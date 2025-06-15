package main

import (
	"fmt"
	"groupie-tracker/data_models"
	"groupie-tracker/handlers"
	"log"
	"net/http"
)

func errorHandlerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic caught: %+v", err)
				handlers.RenderErrorPage(w, r, http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load artists data
	var (
		artists []data_models.Artist
		err     error
	)
	artists, err = data_models.GetArtists()
	if err != nil {
		log.Fatal("Failed to fetch artists:", err)
	}
	relationsList, err := data_models.GetRelations()
	if err != nil {
		log.Fatal("Failed to fetch relations:", err)
	}

	relations := make(map[int]data_models.Relation)
	for _, rel := range relationsList {
		relations[rel.ID] = rel
	}

	mux := http.NewServeMux()

	// Serve static files Checking and error
	stylesHandler := http.StripPrefix("/static/8f3bdc1/styles/", handlers.ProtectedFileServer("static/styles"))
	mux.Handle("/static/8f3bdc1/styles/", stylesHandler)

	jsHandler := http.StripPrefix("/static/8f3bdc1/js/", handlers.ProtectedFileServer("static/js"))
	mux.Handle("/static/8f3bdc1/js/", jsHandler)

	// Register routes with data
	handlers.SetupRoutes(mux, artists, relations)

	// Start server
	port := ":8080"
	fmt.Printf("Server starting on http://localhost%s\n", port)
	if err := http.ListenAndServe(port, errorHandlerMiddleware(mux)); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
