package services

import (
	"fmt"
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
	// Enforce max pageSize limit of 40
	if pageSize > 40 {
		pageSize = 40
	}

	var updatedBooks []models.Book
	var mu sync.Mutex
	var wg sync.WaitGroup

	// Initialize a variable to keep track of the number of collected books
	booksCollected := 0
	currentStartIndex := startIndex

	// Fetch books until we collect enough or exhaust the results
	for booksCollected < pageSize {
		// Fetch books from Google Books API
		booksResponse, err := bs.GoogleBooksRepository.Client.GetBookList(pageSize, currentStartIndex, searchTerm)
		if err != nil {
			return nil, err
		}

		// Loop through the fetched books
		for _, book := range booksResponse.Books {
			// Apply isNotMature filter
			if isNotMature && book.MaturityRating != "NOT_MATURE" {
				continue
			}

			wg.Add(1)
			go func(b models.Book) {
				defer wg.Done()

				// Fetch revision number if ISBN is present
				if b.ISBN != "" {
					revisionNumber, err := bs.OpenLibraryRepository.Client.GetRevisionNumber(b.ISBN)
					if err != nil {
						fmt.Printf("Error fetching revision number for ISBN %s: %v\n", b.ISBN, err)
					} else {
						b.RevisionNumber = revisionNumber
					}
				}

				// Append book safely with mutex
				mu.Lock()
				if len(updatedBooks) < pageSize { // Ensure we return only the required number of books
					updatedBooks = append(updatedBooks, b)
				}
				mu.Unlock()
			}(book)

			// Increment books collected counter
			booksCollected++

			// Stop if we've collected enough books
			if booksCollected >= pageSize {
				break
			}
		}

		// Break the outer loop if we have enough books
		if booksCollected >= pageSize {
			break
		}

		// Increment the start index for the next batch
		currentStartIndex += pageSize
	}

	wg.Wait()

	totalPages := (booksCollected + pageSize - 1) / pageSize

	return &models.APIResponse{
		TotalPages:  totalPages,
		CurrentPage: (startIndex / pageSize) + 1,
		PageSize:    pageSize,
		Books:       updatedBooks,
	}, nil
}
