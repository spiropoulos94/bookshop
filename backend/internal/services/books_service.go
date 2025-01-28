package services

import (
	"fmt"
	"spiropoulos04/bookshop/backend/internal/models"
	"spiropoulos04/bookshop/backend/internal/repositories"
)

type BooksService struct {
	GoogleBooksRepository *repositories.GoogleBooksRepository
}

func NewBooksService(googleBooksRepository *repositories.GoogleBooksRepository) *BooksService {
	return &BooksService{
		GoogleBooksRepository: googleBooksRepository,
	}
}

func (bs *BooksService) GetBookList(search string, pageSize int, startIndex int) ([]models.Book, error) {
	fmt.Println("BooksService GetBookList search: ", search)
	return bs.GoogleBooksRepository.Client.GetBookList(search, pageSize, startIndex)
}
