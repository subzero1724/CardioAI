package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger is a structured request logging middleware.
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		// Process request
		c.Next()

		// Log after response
		latency := time.Since(start)
		status := c.Writer.Status()
		clientIP := c.ClientIP()

		log.Printf("[%s] %s %s → %d (%s) from %s",
			method,
			path,
			c.Request.URL.RawQuery,
			status,
			latency,
			clientIP,
		)
	}
}
