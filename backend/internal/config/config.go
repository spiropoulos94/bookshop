package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds application configuration
type Config struct {
	ServerConfig
	RedisConfig
	FrontendConfig
	GoogleBooksConfig
	OpenLibraryConfig
}

// Load loads configuration from environment variables
func Load() Config {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
		// fmt.Println("Error loading .env file")
	}

	return Config{
		ServerConfig: ServerConfig{
			Hostname:      getEnv("HOSTNAME", "localhost"),
			Port:          getEnvAsInt("PORT", 8080),
			ServerAddress: getEnv("SERVER_ADDRESS", ":8080"),
			WriteTimeout:  getEnvAsDuration("WRITE_TIMEOUT", 120*time.Second),
			ReadTimeout:   getEnvAsDuration("READ_TIMEOUT", 15*time.Second),
			IdleTimeout:   getEnvAsDuration("IDLE_TIMEOUT", 60*time.Second),
			Environment:   getEnv("ENVIRONMENT", "development"),
		},
		FrontendConfig: FrontendConfig{
			FrontendDir: getEnv("FRONTEND_DIRECTORY", "./frontend"),
		},
		GoogleBooksConfig: GoogleBooksConfig{
			BaseURL: getEnv("GOOGLE_BOOKS_API_BASE_URL", ""),
		},
		OpenLibraryConfig: OpenLibraryConfig{
			BaseURL: getEnv("OPEN_LIBRARY_API_BASE_URL", ""),
		},
		RedisConfig: RedisConfig{
			Address:  getEnv("REDIS_ADDRESS", "localhost:6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
		},
	}
}

// getEnv returns the value of an environment variable or a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// getEnvAsInt returns the value of an environment variable as an integer or a default value
func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// getEnvAsDuration returns the value of an environment variable as a time.Duration or a default value
func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if value, exists := os.LookupEnv(key); exists {
		if durationValue, err := time.ParseDuration(value); err == nil {
			return durationValue
		}
	}
	return defaultValue
}
