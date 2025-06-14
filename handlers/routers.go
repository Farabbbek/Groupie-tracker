package handlers

import (
	"groupie-tracker/data_models"
	"net/http"
)

func SetupRoutes(mux *http.ServeMux, artists []data_models.Artist, relations map[int]data_models.Relation) {
	apiArtistsHandler := http.HandlerFunc(ArtistsHandler(artists, relations))
	apiSearchHandler := http.HandlerFunc(SearchHandler(artists))

	mux.HandleFunc("/", HomeHandler)
	mux.HandleFunc("/details", DetailsPageHandler)
	mux.Handle("/api/artists/", KyzetApiKey(apiArtistsHandler))
	mux.Handle("/api/search", KyzetApiKey(apiSearchHandler))
	mux.HandleFunc("/panic", PanicHandler)
}
