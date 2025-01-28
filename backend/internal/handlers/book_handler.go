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
		// Get the page and pageSize from the query string, with defaults
		pageSize := ctx.Query("pageSize")
		page := ctx.Query("page")

		// Provide default values if pageSize or page are omitted
		pageSizeInt := 10 // Default page size
		pageInt := 1      // Default page number

		if pageSize != "" {
			var err error
			pageSizeInt, err = strconv.Atoi(pageSize)
			if err != nil || pageSizeInt <= 0 {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pageSize parameter"})
				return
			}
		}

		if page != "" {
			var err error
			pageInt, err = strconv.Atoi(page)
			if err != nil || pageInt <= 0 {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page parameter"})
				return
			}
		}

		// Calculate the start index based on the page and page size
		startIndexInt := (pageInt - 1) * pageSizeInt

		// Create a cache key based on the page size and start index
		cacheKey := "books:" + strconv.Itoa(pageSizeInt) + ":" + strconv.Itoa(startIndexInt)

		// Attempt to retrieve the books from Redis cache
		cachedBooks, err := c.Redis.Get(ctx, cacheKey).Result()
		if err == nil { // Cache hit
			var paginatedResponse models.APIResponse
			if err := json.Unmarshal([]byte(cachedBooks), &paginatedResponse); err == nil {
				ctx.JSON(http.StatusOK, paginatedResponse)
				return
			}
		}

		// Call the BooksService to get the list of books based on the search parameters
		paginatedResponse, err := c.Services.BooksService.GetBookList(pageSizeInt, startIndexInt)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Store the retrieved books in the Redis cache for future requests
		cachedBooksJSON, _ := json.Marshal(paginatedResponse)
		c.Redis.Set(ctx, cacheKey, cachedBooksJSON, 24*time.Hour)

		// Return the paginated response in the response
		ctx.JSON(http.StatusOK, paginatedResponse)
	}
}
