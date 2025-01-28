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

func (bs *BooksService) GetBookList(pageSize int, startIndex int, searchTerm string) (*models.APIResponse, error) {
	// Fetch the list of books from the Google Books API using the search term
	booksResponse, err := bs.GoogleBooksRepository.Client.GetBookList(pageSize, startIndex, searchTerm)
	if err != nil {
		return nil, err // Handle error from GoogleBooksClient
	}

	// Calculate total pages
	totalPages := (booksResponse.TotalItems + pageSize - 1) / pageSize // Ceiling division

	// Create a new slice to hold books with revision numbers
	var updatedBooks []models.Book
	var mu sync.Mutex // Mutex to safely append to the slice
	var wg sync.WaitGroup

	for _, book := range booksResponse.Books {
		wg.Add(1) // Increment the wait group counter
		go func(b models.Book) {
			defer wg.Done() // Decrement the counter when the goroutine completes

			// Check if the book has an ISBN
			if b.ISBN != "" {
				// Get the revision number for the book
				revisionNumber, err := bs.OpenLibraryRepository.Client.GetRevisionNumber(b.ISBN)
				if err != nil {
					// Log the error
					fmt.Printf("Error fetching revision number for ISBN %s: %v\n", b.ISBN, err)
				} else {
					// Set the revision number for the book if successfully fetched
					b.RevisionNumber = revisionNumber
				}
			}

			// Lock the mutex to append the book safely to the slice
			mu.Lock()
			updatedBooks = append(updatedBooks, b)
			mu.Unlock()
		}(book) // Pass the current book as an argument to the goroutine
	}

	wg.Wait() // Wait for all goroutines to finish

	// Create the response object with pagination information
	return &models.APIResponse{
		TotalPages:  totalPages,
		CurrentPage: (startIndex / pageSize) + 1, // Calculate current page (1-based index)
		PageSize:    pageSize,
		Books:       updatedBooks,
	}, nil
}
