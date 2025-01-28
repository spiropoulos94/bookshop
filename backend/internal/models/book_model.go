package models

// Struct to represent parts of the API response
type Book struct {
	Title          string  `json:"title"`
	Description    string  `json:"description"`
	PageCount      int     `json:"pageCount"`
	Price          float64 `json:"price"` // Price will always be included
	MaturityRating string  `json:"maturityRating"`
	Thumbnail      string  `json:"thumbnail"`      // Mapping thumbnail directly for ease
	ISBN           string  `json:"isbn,omitempty"` // Changed from slice to single ISBN
	RevisionNumber int     `json:"revision,omitempty"`
}

type Volume struct {
	VolumeInfo struct {
		Book
		ImageLinks struct {
			Thumbnail string `json:"thumbnail"`
		} `json:"imageLinks"`
		IndustryIdentifiers []struct {
			Type       string `json:"type"`
			Identifier string `json:"identifier"`
		} `json:"industryIdentifiers"`
	} `json:"volumeInfo"`
	SaleInfo struct {
		ListPrice struct {
			Amount float64 `json:"amount"`
		} `json:"listPrice"`
	} `json:"saleInfo"`
}

type BooksResponse struct {
	TotalItems int      `json:"totalItems"`
	Items      []Volume `json:"items"`
}
