package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Define the OpenLibraryClient struct
type OpenLibraryClient struct {
	BaseURL string
}

// NewOpenLibraryClient initializes and returns a OpenLibraryClient
func NewOpenLibraryClient(baseUrl string) *OpenLibraryClient {
	return &OpenLibraryClient{
		BaseURL: baseUrl,
	}
}

// GetRevisionNumber fetches the revision number for a given ISBN identifier
func (c *OpenLibraryClient) GetRevisionNumber(isbnIdentifier string) (int, error) {
	url := fmt.Sprintf("%s/%s.json", c.BaseURL, isbnIdentifier)

	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("failed to fetch data: %s", resp.Status)
	}

	var result struct {
		Revision int `json:"revision"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return 0, err
	}

	return result.Revision, nil
}
