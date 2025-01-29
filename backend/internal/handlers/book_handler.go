package handlers

import (
	"encoding/json"
	"log"
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

		traceID, _ := ctx.Get("TraceID")
		log.Printf("Handling request with ID: %v", traceID)

		pageSize := ctx.Query("pageSize")
		page := ctx.Query("page")
		search := ctx.Query("search")
		isNotMature := ctx.Query("isNotMature")

		pageSizeInt := 10 // Default page size
		pageInt := 1      // Default page number
		searchTerm := "nosql"

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

		if search != "" {
			searchTerm = search
		}

		// Convert isNotMature query param to boolean
		isNotMatureBool := false
		if isNotMature != "" {
			isNotMatureBool = isNotMature == "true"
		}

		startIndexInt := (pageInt - 1) * pageSizeInt
		cacheKey := "books:" + strconv.Itoa(pageSizeInt) + ":" + strconv.Itoa(startIndexInt) + ":" + searchTerm + ":" + strconv.FormatBool(isNotMatureBool)

		cachedBooks, err := c.Redis.Get(ctx, cacheKey).Result()
		if err == nil {
			var paginatedResponse models.APIResponse
			if err := json.Unmarshal([]byte(cachedBooks), &paginatedResponse); err == nil {
				ctx.JSON(http.StatusOK, paginatedResponse)
				return
			}
		}

		paginatedResponse, err := c.Services.BooksService.GetBookList(pageSizeInt, startIndexInt, searchTerm, isNotMatureBool)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		cachedBooksJSON, _ := json.Marshal(paginatedResponse)
		c.Redis.Set(ctx, cacheKey, cachedBooksJSON, 24*time.Hour)

		ctx.JSON(http.StatusOK, paginatedResponse)
	}
}
