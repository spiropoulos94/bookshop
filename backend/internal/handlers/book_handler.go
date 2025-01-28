package handlers

import (
	"fmt"
	"net/http"
	"spiropoulos04/bookshop/backend/internal/container"
	"strconv"

	"github.com/gin-gonic/gin"
)

// BookHandler returns a handler function to get the book list
func GetBookHandler(c *container.Container) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get the searchParams from the query string, with a default value of "books"
		searchParams := ctx.DefaultQuery("search", "books")
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

		// Call the BooksService to get the list of books based on the search parameters
		fmt.Println("GetBooks handler searchParams: ", searchParams)
		books, err := c.Services.BooksService.GetBookList(searchParams, pageSizeInt, startIndexInt)
		if err != nil {
			// Handle the error (return an appropriate HTTP status and message)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Return the list of books in the response
		ctx.JSON(http.StatusOK, books)
	}
}
