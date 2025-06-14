package handlers

import (
	"net/http"
	"strings"
)

// KyzetHandler just Kyzet
func KyzetApiKey(next http.Handler) http.Handler {
	const secretAPIKey = "69d742de9375d0bfb12dc7438ce265ba"
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-API-Key") != secretAPIKey {
			RenderErrorPage(w, r, http.StatusNotFound)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func KyzetDirListing(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			RenderErrorPage(w, r, http.StatusNotFound)
			return
		}
		next.ServeHTTP(w, r)
	})
}
