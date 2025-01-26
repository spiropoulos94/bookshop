package clients

import "fmt"

type GoogleBooksClient struct {
}

func NewGoogleBooksClient() *GoogleBooksClient {
	return &GoogleBooksClient{}
}

func (gbc *GoogleBooksClient) GetBookList() {
	fmt.Println("Getting book list from Google Books API")
}
