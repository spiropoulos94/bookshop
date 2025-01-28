package services

import (
	"fmt"
	"spiropoulos04/bookshop/backend/internal/models"
	"spiropoulos04/bookshop/backend/internal/repositories"
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

func (bs *BooksService) GetBookList(pageSize int, startIndex int) ([]models.Book, error) {
	// Fetch the list of books
	books, err := bs.GoogleBooksRepository.Client.GetBookList(pageSize, startIndex)
	if err != nil {
		return nil, err // Handle error from GoogleBooksClient
	}

	// Create a new slice to hold books with revision numbers
	var updatedBooks []models.Book

	for _, book := range books {
		// Check if the book has an ISBN
		if book.ISBN != "" {
			// Get the revision number for the book
			revisionNumber, err := bs.OpenLibraryRepository.Client.GetRevisionNumber(book.ISBN)
			if err != nil {
				// Log the error (using a logging library or fmt for simplicity)
				fmt.Printf("Error fetching revision number for ISBN %s: %v\n", book.ISBN, err)
				// No need to skip the book, just do not set the revision number
			} else {
				// Set the revision number for the book if successfully fetched
				book.RevisionNumber = revisionNumber
			}
		}

		// Append the updated book to the new slice, regardless of ISBN
		updatedBooks = append(updatedBooks, book)
	}

	return updatedBooks, nil
}
