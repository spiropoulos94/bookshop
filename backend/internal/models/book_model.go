package models

// Struct to represent parts of the API response
type Book struct {
	Title          string   `json:"title"`
	Description    string   `json:"description"`
	PageCount      int      `json:"pageCount"`
	Price          float64  `json:"price,omitempty"` // Use `omitempty` to handle cases where the price isn't provided
	MaturityRating string   `json:"maturityRating"`
	Thumbnail      string   `json:"thumbnail"`       // Mapping thumbnail directly for ease
	ISBNs          []string `json:"isbns,omitempty"` // Collect all ISBNs into a slice
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
