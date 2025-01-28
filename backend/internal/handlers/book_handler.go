package handlers

import (
	"encoding/json"
	"net/http"
	"spiropoulos04/bookshop/backend/internal/container"
	"spiropoulos04/bookshop/backend/internal/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// GetBookHandler returns a handler function to get the book list with caching
func GetBookHandler(c *container.Container) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get the searchParams from the query string, with a default value of "books"
		pageSize := ctx.Query("pageSize")
		startIndex := ctx.Query("startIndex")

		// Provide default values if pageSize or startIndex are omitted
		pageSizeInt := 10  // Default page size
		startIndexInt := 0 // Default start index

		if pageSize != "" {
			var err error
			pageSizeInt, err = strconv.Atoi(pageSize)
			if err != nil {
				// Handle the error (return an appropriate HTTP status and message)
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pageSize parameter"})
				return
			}
		}

		if startIndex != "" {
			var err error
			startIndexInt, err = strconv.Atoi(startIndex)
			if err != nil {
				// Handle the error (return an appropriate HTTP status and message)
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid startIndex parameter"})
				return
			}
		}

		// Create a cache key based on the page size and start index
		cacheKey := "books:" + strconv.Itoa(pageSizeInt) + ":" + strconv.Itoa(startIndexInt)

		// Attempt to retrieve the books from Redis cache
		cachedBooks, err := c.Redis.Get(ctx, cacheKey).Result()
		if err == nil { // Cache hit
			// Parse the cached data
			var books []models.Book
			if err := json.Unmarshal([]byte(cachedBooks), &books); err == nil {
				// Return the cached books
				ctx.JSON(http.StatusOK, books)
				return
			}
		}

		// Call the BooksService to get the list of books based on the search parameters
		books, err := c.Services.BooksService.GetBookList(pageSizeInt, startIndexInt)
		if err != nil {
			// Handle the error (return an appropriate HTTP status and message)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Store the retrieved books in the Redis cache for future requests
		cachedBooksJSON, _ := json.Marshal(books)

		// Set the cache with no expiration
		c.Redis.Set(ctx, cacheKey, cachedBooksJSON, 24*time.Hour) // Use 0 for no expiration

		// Return the list of books in the response
		ctx.JSON(http.StatusOK, books)
	}
}
