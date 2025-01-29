package router

import (
	"net/http"
	"spiropoulos04/bookshop/backend/internal/container"
	"spiropoulos04/bookshop/backend/internal/handlers"
	"spiropoulos04/bookshop/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func Build(c *container.Container) {

	// Add routes here
	router := c.Server.Handler.(*gin.Engine)

	// CORS middleware that allows all origins in DEVELOPMENT
	router.Use(func(ctx *gin.Context) {
		if c.EnvConfig.Environment == "development" {
			// Allow all origins in development
			ctx.Header("Access-Control-Allow-Origin", "*")
			ctx.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			ctx.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		}
		// Handle preflight requests
		if ctx.Request.Method == http.MethodOptions {
			ctx.AbortWithStatus(http.StatusNoContent)
			return
		}

		ctx.Next()
	})

	// Add the middleware to log request duration
	router.Use(middleware.RequestDurationLogger())
	// Add the middleware to set the trace ID used in debugging
	router.Use(middleware.TraceIDMiddleware())

	// Routes
	router.GET("/health", handlers.HealthHandler(c))
	router.GET("/api/books", handlers.GetBookHandler(c))

	// Static files
	router.GET("/", handlers.FrontendHandler(c))

	// use a catch-all if no other routes match
	router.NoRoute(handlers.FrontendHandler(c)) // This serves as a catch-all

	c.Server.Handler = router
}
