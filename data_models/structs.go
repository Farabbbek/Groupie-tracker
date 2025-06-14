package data_models

type Artist struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Image        string   `json:"image"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	Members      []string `json:"members"`
}

// Relation links an artist to their concert dates and locations
type Relation struct {
	ID             int                 `json:"id"`
	DatesLocations map[string][]string `json:"datesLocations"`
}

// ArtistDetails is the structure returned by the /api/artists/:id endpoint
type ArtistDetails struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Image        string    `json:"image"`
	CreationDate int       `json:"creationDate"`
	FirstAlbum   string    `json:"firstAlbum"`
	Members      []string  `json:"members"`
	Concerts     []Concert `json:"concerts"`
}

// Concert represents a concert location and its dates
type Concert struct {
	Location string   `json:"location"`
	Dates    []string `json:"dates"`
}
