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
func (gbc *GoogleBooksClient) GetBookList(pageSize int, startIndex int, searchTerm string) (*models.GoogleBooksAPIClientResponse, error) {
	fmt.Println("GoogleBooksClient GetBookList pageSize: ", pageSize, ", startIndex: ", startIndex, ", searchTerm: ", searchTerm)

	// Construct the API endpoint with the search terms, pageSize, and startIndex
	url := fmt.Sprintf("%s/volumes?q=%s&maxResults=%d&startIndex=%d", gbc.BaseURL, searchTerm, pageSize, startIndex)

	fmt.Println("GoogleBooksClient GetBookList url: ", url)

	// Make the HTTP GET request
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// Handle rate limit response (HTTP 429)
	if resp.StatusCode == http.StatusTooManyRequests {
		fmt.Println("Rate limit exceeded (429). GOOGLE API Quata reached Returning an empty response.")
		return &models.GoogleBooksAPIClientResponse{TotalItems: 0, Books: []models.Book{}}, nil
	}

	// Check if the response status is OK
	if resp.StatusCode != http.StatusOK {
		// Read the response body to log it
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("error: received status code %d but failed to read response body: %v", resp.StatusCode, err)
		}

		return nil, fmt.Errorf("error: received status code %d, response: %s", resp.StatusCode, string(body))
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
			ID:             volume.ID,
			Title:          volume.VolumeInfo.Title,
			Description:    volume.VolumeInfo.Description,
			PageCount:      volume.VolumeInfo.PageCount,
			MaturityRating: volume.VolumeInfo.MaturityRating,
			Thumbnail:      volume.VolumeInfo.ImageLinks.Thumbnail,
		}

		// Extract only the ISBN_13
		for _, id := range volume.VolumeInfo.IndustryIdentifiers {
			if id.Type == "ISBN_13" {
				book.ISBN = id.Identifier // Save only the ISBN_13
				break                     // Exit the loop once we found ISBN_13
			}
		}

		// Ensure price is always included
		if volume.SaleInfo.ListPrice.Amount != 0 {
			book.Price = volume.SaleInfo.ListPrice.Amount
		} else {
			book.Price = 0.0 // Default value when price is missing
		}

		books = append(books, book)
	}

	return &models.GoogleBooksAPIClientResponse{
		TotalItems: booksResponse.TotalItems,
		Books:      books,
	}, nil
}
