package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func TraceIDMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		traceID := ctx.GetHeader("X-Trace-ID")
		if traceID == "" {
			traceID = uuid.New().String()
		}

		// Set the Request ID in the context
		ctx.Set("TraceID", traceID)

		// Add the Request ID to the response headers
		ctx.Writer.Header().Set("X-Trace-ID", traceID)

		ctx.Next()
	}
}
