package repositories

import "spiropoulos04/bookshop/backend/internal/config"

type Repositories struct {
	Google    *GoogleBooksRepository
	EnvConfig *config.Config
}

// NewRepositories creates and returns an instance of Repositories
func NewRepositories(cfg *config.Config) *Repositories {
	return &Repositories{
		Google:    NewGoogleBooksRepository(&cfg.GoogleBooksConfig),
		EnvConfig: cfg, // Store the configuration in the struct
	}
}
