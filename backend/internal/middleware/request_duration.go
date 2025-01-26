package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func RequestDurationLogger() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		start := time.Now()
		ctx.Next() // Process the request
		duration := time.Since(start)

		log.Printf("Request %s %s completed in %v", ctx.Request.Method, ctx.Request.URL.Path, duration)
	}
}
