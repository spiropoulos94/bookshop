package container

import (
	"context"
	"fmt"
	"net/http"
	"spiropoulos04/bookshop/backend/internal/config"
	"spiropoulos04/bookshop/backend/internal/repositories"
	"spiropoulos04/bookshop/backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type Container struct {
	EnvConfig    *config.Config
	Server       *http.Server
	Repositories *repositories.Repositories
	Services     *services.Services
	Redis        *redis.Client
}

// NewContainer initializes a new container
func NewContainer() *Container {
	c := &Container{}

	return c
}

// Shutdown gracefully stops all the services and closes all established connections.
// It takes a context as a parameter to allow for timeout and cancellation signals when shutting down.
func (c *Container) Shutdown(ctx context.Context) error {
	// Add any shutdown logic for services if needed
	if err := c.Server.Shutdown(ctx); err != nil {
		return err
	}
	return nil
}

// InitConfig initializes the environment configuration
func (c *Container) InitConfig() {
	envConfig := config.Load()
	c.EnvConfig = &envConfig
}

// InitServer initializes the HTTP server with a Gin router
func (c *Container) InitServer() {

	c.Server = &http.Server{
		Addr:         fmt.Sprintf("%s:%d", c.EnvConfig.ServerConfig.Hostname, c.EnvConfig.ServerConfig.Port),
		Handler:      gin.New(),
		ReadTimeout:  c.EnvConfig.ServerConfig.ReadTimeout,
		WriteTimeout: c.EnvConfig.ServerConfig.WriteTimeout,
		IdleTimeout:  c.EnvConfig.ServerConfig.IdleTimeout,
	}
}

func (c *Container) InitRepositories() {
	c.Repositories = &repositories.Repositories{
		Google:      repositories.NewGoogleBooksRepository(&c.EnvConfig.GoogleBooksConfig),
		OpenLibrary: repositories.NewOpenLibraryRepository(&c.EnvConfig.OpenLibraryConfig),
	}
}

// InitServices initializes application services
func (c *Container) InitServices() {

	c.Services = &services.Services{
		BooksService:    services.NewBooksService(c.Repositories.Google, c.Repositories.OpenLibrary),
		FrontendService: services.NewFrontendService(&c.EnvConfig.FrontendConfig),
	}
}

// InitRedis initializes the Redis client
func (c *Container) InitRedis() {
	c.Redis = redis.NewClient(&redis.Options{
		Addr:     c.EnvConfig.RedisConfig.Address,  // e.g., "localhost:6379"
		Password: c.EnvConfig.RedisConfig.Password, // No password set by default
	})

	// Test the Redis connection
	ctx := context.Background()
	if err := c.Redis.Ping(ctx).Err(); err != nil {
		panic(fmt.Sprintf("failed to connect to Redis: %v", err))
	}
}

func (c *Container) InitContainer() *Container {
	c.InitConfig()
	c.InitServer()
	c.InitRepositories()
	c.InitServices()
	c.InitRedis()

	return c
}
