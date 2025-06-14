package handlers

import (
	"encoding/json"
	"groupie-tracker/data_models"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
)

var indexTemplate = template.Must(template.ParseFiles("templates/index.html"))

// HomeHandler renders the main page
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		RenderErrorPage(w, r, http.StatusNotFound)
		return
	}
	http.ServeFile(w, r, "templates/index.html")
}

func ArtistsHandler(artists []data_models.Artist, relations map[int]data_models.Relation) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		idStr := strings.TrimPrefix(r.URL.Path, "/api/artists/")
		if idStr == "" {
			log.Println("Request for all artists received")
			if artists == nil {
				w.Write([]byte("[]"))
				return
			}
			json.NewEncoder(w).Encode(artists)
			return
		}
		log.Printf("Request for artist with ID string: '%s'", idStr)
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid artist ID format", http.StatusBadRequest)
			return
		}
		var artist *data_models.Artist
		for i := range artists {
			if artists[i].ID == id {
				artist = &artists[i]
				break
			}
		}
		if artist == nil {
			http.Error(w, "Artist not found", http.StatusNotFound)
			return
		}

		rel, ok := relations[id]
		if !ok {
			http.Error(w, "Relation data not found for artist", http.StatusNotFound)
			return
		}

		type Concert struct {
			Location string   `json:"location"`
			Dates    []string `json:"dates"`
		}
		type ArtistDetails struct {
			ID           int       `json:"id"`
			Name         string    `json:"name"`
			Image        string    `json:"image"`
			CreationDate int       `json:"creationDate"`
			FirstAlbum   string    `json:"firstAlbum"`
			Members      []string  `json:"members"`
			Concerts     []Concert `json:"concerts"`
		}
		details := ArtistDetails{
			ID:           artist.ID,
			Name:         artist.Name,
			Image:        artist.Image,
			CreationDate: artist.CreationDate,
			FirstAlbum:   artist.FirstAlbum,
			Members:      artist.Members,
			Concerts:     []Concert{},
		}
		for location, dates := range rel.DatesLocations {
			details.Concerts = append(details.Concerts, Concert{Location: location, Dates: dates})
		}
		json.NewEncoder(w).Encode(details)
	}
}

func DetailsPageHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/details.html")
}

// SearchHandler handles artist search by name or member
func SearchHandler(artists []data_models.Artist) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("q")
		if query == "" {
			http.Error(w, "Missing search query", http.StatusBadRequest)
			return
		}

		query = strings.ToLower(query)
		var results []data_models.Artist

		for _, artist := range artists {
			// Search in artist name
			if strings.Contains(strings.ToLower(artist.Name), query) {
				results = append(results, artist)
				continue
			}
			// Search in members
			for _, member := range artist.Members {
				if strings.Contains(strings.ToLower(member), query) {
					results = append(results, artist)
					break
				}
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	}
}

func PanicHandler(w http.ResponseWriter, r *http.Request) {
	panic("тестовая паника")
}
