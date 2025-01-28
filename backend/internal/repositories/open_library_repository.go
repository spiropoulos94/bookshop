package repositories

import (
	"spiropoulos04/bookshop/backend/internal/clients"
	"spiropoulos04/bookshop/backend/internal/config"
)

type OpenLibraryRepository struct {
	Client *clients.OpenLibraryClient
}

func NewOpenLibraryRepository(c *config.OpenLibraryConfig) *OpenLibraryRepository {
	OpenLibraryApiClient := clients.NewOpenLibraryClient(c.BaseURL)

	return &OpenLibraryRepository{
		Client: OpenLibraryApiClient,
	}
}
