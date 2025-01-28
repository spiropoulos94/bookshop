package repositories

import (
	"spiropoulos04/bookshop/backend/internal/clients"
	"spiropoulos04/bookshop/backend/internal/config"
)

type GoogleBooksRepository struct {
	Config *config.GoogleBooksConfig
	Client *clients.GoogleBooksClient
}

func NewGoogleBooksRepository(c *config.GoogleBooksConfig) *GoogleBooksRepository {

	googleApiClient := clients.NewGoogleBooksClient(c.BaseURL)

	return &GoogleBooksRepository{
		Config: c,
		Client: googleApiClient,
	}
}
