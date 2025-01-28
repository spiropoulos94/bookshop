package clients

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"spiropoulos04/bookshop/backend/internal/models"
)

// Define the GoogleBooksClient struct
type GoogleBooksClient struct {
	BaseURL string
}

// NewGoogleBooksClient initializes and returns a GoogleBooksClient
func NewGoogleBooksClient(baseUrl string) *GoogleBooksClient {
	return &GoogleBooksClient{
		BaseURL: baseUrl,
	}
}

// GetBookList fetches a list of books based on search terms
// GetBookList fetches a list of books based on search terms
func (gbc *GoogleBooksClient) GetBookList(searchTerms string, pageSize int, startIndex int) ([]models.Book, error) {
	fmt.Println("GoogleBooksClient GetBookList searchTerms: ", searchTerms)
	fmt.Println("GoogleBooksClient GetBookList pageSize: ", pageSize, ", startIndex: ", startIndex)

	// Construct the API endpoint with the search terms, pageSize, and startIndex
	url := fmt.Sprintf("%s/volumes?q=%s&maxResults=%d&startIndex=%d", gbc.BaseURL, searchTerms, pageSize, startIndex)

	fmt.Println("GoogleBooksClient GetBookList url: ", url)

	// Make the HTTP GET request
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// Check if the response status is OK
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: received status code %d", resp.StatusCode)
	}

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	// Parse the JSON response
	var booksResponse models.BooksResponse
	if err := json.Unmarshal(body, &booksResponse); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %v", err)
	}

	// Extract the book list from the response
	var books []models.Book
	for _, volume := range booksResponse.Items {
		// Map VolumeInfo to Book
		book := models.Book{
			Title:          volume.VolumeInfo.Title,
			Description:    volume.VolumeInfo.Description,
			PageCount:      volume.VolumeInfo.PageCount,
			MaturityRating: volume.VolumeInfo.MaturityRating,
			Thumbnail:      volume.VolumeInfo.ImageLinks.Thumbnail,
			ISBNs: func() []string {
				var isbns []string
				for _, id := range volume.VolumeInfo.IndustryIdentifiers {
					isbns = append(isbns, id.Identifier)
				}
				return isbns
			}(),
		}

		// Map the price if available
		if volume.SaleInfo.ListPrice.Amount != 0 {
			book.Price = volume.SaleInfo.ListPrice.Amount
		}

		books = append(books, book)
	}

	return books, nil
}
