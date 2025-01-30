package services

import (
	"fmt"
	"log"
	"spiropoulos04/bookshop/backend/internal/models"
	"spiropoulos04/bookshop/backend/internal/repositories"
	"sync"
)

type BooksService struct {
	GoogleBooksRepository *repositories.GoogleBooksRepository
	OpenLibraryRepository *repositories.OpenLibraryRepository
}

func NewBooksService(googleBooksRepository *repositories.GoogleBooksRepository, openLibraryRepository *repositories.OpenLibraryRepository) *BooksService {
	return &BooksService{
		GoogleBooksRepository: googleBooksRepository,
		OpenLibraryRepository: openLibraryRepository,
	}
}

func (bs *BooksService) GetBookList(pageSize int, startIndex int, searchTerm string, isNotMature bool) (*models.APIResponse, error) {
	log.Println("Fetching books from Google Books API", isNotMature)

	if pageSize > 40 {
		pageSize = 40
	}

	var updatedBooks []models.Book
	var mu sync.Mutex
	var wg sync.WaitGroup

	booksCollected := 0
	currentStartIndex := startIndex
	batchCount := 0

	for booksCollected < pageSize {
		booksResponse, err := bs.GoogleBooksRepository.Client.GetBookList(pageSize, currentStartIndex, searchTerm)
		if err != nil {
			return nil, err
		}

		if len(booksResponse.Books) == 0 {
			batchCount++
			if batchCount >= 10 {
				log.Println("No books found after 10 batches. Returning empty response.")
				return &models.APIResponse{
					TotalPages:  0,
					CurrentPage: (startIndex / pageSize) + 1,
					PageSize:    pageSize,
					Books:       []models.Book{},
				}, nil
			}
			continue
		} else {
			batchCount = 0
		}

		// Create a slice with the same length as the fetched books
		bookBatch := make([]models.Book, len(booksResponse.Books))

		for i, book := range booksResponse.Books {
			if isNotMature && book.MaturityRating != "NOT_MATURE" {
				continue
			}

			wg.Add(1)
			go func(index int, b models.Book) {
				defer wg.Done()

				if b.ISBN != "" {
					revisionNumber, err := bs.OpenLibraryRepository.Client.GetRevisionNumber(b.ISBN)
					if err != nil {
						fmt.Printf("Error fetching revision number for ISBN %s: %v\n", b.ISBN, err)
					} else {
						b.RevisionNumber = revisionNumber
					}
				}

				// Store the book at the correct index
				bookBatch[index] = b
			}(i, book)

			booksCollected++

			if booksCollected >= pageSize {
				break
			}
		}

		wg.Wait()

		// Append books in order to the final list
		mu.Lock()
		for _, book := range bookBatch {
			if len(updatedBooks) < pageSize && book.ID != "" {
				updatedBooks = append(updatedBooks, book)
			}
		}
		mu.Unlock()

		if booksCollected >= pageSize {
			break
		}

		currentStartIndex += pageSize
	}

	totalPages := (booksCollected + pageSize - 1) / pageSize

	return &models.APIResponse{
		TotalPages:  totalPages,
		CurrentPage: (startIndex / pageSize) + 1,
		PageSize:    pageSize,
		Books:       updatedBooks,
	}, nil
}
