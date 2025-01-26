package handlers

import (
	"net/http"
	"spiropoulos04/bookshop/backend/internal/container"

	"github.com/gin-gonic/gin"
)

func HealthHandler(c *container.Container) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	}
}
