package router

import (
	"spiropoulos04/bookshop/backend/internal/container"
	"spiropoulos04/bookshop/backend/internal/handlers"
	"spiropoulos04/bookshop/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func Build(c *container.Container) {
	// Add routes here
	router := c.Server.Handler.(*gin.Engine)

	// Add the middleware to log request duration
	router.Use(middleware.RequestDurationLogger())

	// Routes
	router.GET("/health", handlers.HealthHandler(c))

	// Static files

	c.Server.Handler = router
}
