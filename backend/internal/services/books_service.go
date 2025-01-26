package services

import "spiropoulos04/bookshop/backend/internal/repositories"

type BooksService struct {
	GoogleBooksRepository *repositories.GoogleBooksRepository
}

func NewBooksService(googleBooksRepository *repositories.GoogleBooksRepository) *BooksService {
	return &BooksService{
		GoogleBooksRepository: googleBooksRepository,
	}
}

func (bs *BooksService) GetBookList() {
	bs.GoogleBooksRepository.Client.GetBookList()
}
