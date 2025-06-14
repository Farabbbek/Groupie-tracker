package data_models

import (
	"encoding/json"
	"net/http"
)

// GetArtists
func GetArtists() ([]Artist, error) {
	resp, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var artists []Artist
	if err := json.NewDecoder(resp.Body).Decode(&artists); err != nil {
		return nil, err
	}

	return artists, nil
}

// GetRelations
func GetRelations() ([]Relation, error) {
	resp, err := http.Get("https://groupietrackers.herokuapp.com/api/relation")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var relationsResponse struct {
		Index []Relation `json:"index"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&relationsResponse); err != nil {
		return nil, err
	}
	return relationsResponse.Index, nil
}
