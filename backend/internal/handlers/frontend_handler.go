package handlers

import (
	"spiropoulos04/bookshop/backend/internal/container"

	"github.com/gin-gonic/gin"
)

func FrontendHandler(c *container.Container) gin.HandlerFunc {
	// Add handler logic here
	return func(ctx *gin.Context) {

		c.Services.FrontendService.ServeStaticFiles(ctx.Writer, ctx.Request)

	}
}
