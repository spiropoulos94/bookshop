package services

import (
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

func (bs *BooksService) GetBookList(pageSize int, startIndex int) ([]models.Book, error) {
	return bs.GoogleBooksRepository.Client.GetBookList(pageSize, startIndex)
}
