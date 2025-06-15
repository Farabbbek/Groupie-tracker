package handlers

import (
	"net/http"
	"strings"
)

func RenderErrorPage(w http.ResponseWriter, r *http.Request, status int) {
	switch status {
	case http.StatusNotFound:
		http.ServeFile(w, r, "templates/errors/error404.html")
	case http.StatusInternalServerError:
		http.ServeFile(w, r, "templates/errors/error500.html")
	case http.StatusBadRequest:
		http.ServeFile(w, r, "templates/errors/error400.html")
	default:
		http.Error(w, http.StatusText(status), status)
	}
}

func ProtectedFileServer(dir string) http.Handler {
	fs := http.FileServer(http.Dir(dir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			RenderErrorPage(w, r, http.StatusNotFound)
			return
		}
		fs.ServeHTTP(w, r)
	})
}
