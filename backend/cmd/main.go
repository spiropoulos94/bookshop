package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"spiropoulos04/bookshop/backend/internal/container"
	"spiropoulos04/bookshop/backend/internal/router"
	"syscall"
	"time"
)

func main() {
	c := container.NewContainer()
	c.InitContainer()

	router.Build(c)

	// Start server in a goroutine to allow graceful shutdown
	go func() {
		// log.Printf("Starting server on %s...", c.EnvConfig.ServerConfig.Hostname)
		if err := c.Server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe(): %s", err)
		}
	}()

	// Graceful shutdown handling
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop // Wait for interrupt signal

	// Initiate graceful shutdown
	log.Println("Shutting down server...")
	// Create a context with a timeout of 10 seconds. The context is used to set a deadline for a graceful shutdown
	// process.
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	// Ensure resources are released when the context is done.
	defer cancel()
	if err := c.Shutdown(ctx); err != nil {
		log.Fatalf("Error during shutdown: %v", err)
	}
	log.Println("Server shutdown complete.")
}
