package handlers

import (
	"net/http"
	"strings"
)

func RenderErrorPage(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
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

func FileServer404(prefix string, dir string) http.Handler {
	fs := http.FileServer(http.Dir(dir))
	return http.StripPrefix(prefix, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ref := r.Header.Get("Referer")
		if ref == "" || !strings.HasPrefix(ref, "http://localhost:8080/") {
			RenderErrorPage(w, r, http.StatusNotFound)
			return
		}
		if _, err := http.Dir(dir).Open(r.URL.Path); err != nil {
			RenderErrorPage(w, r, http.StatusNotFound)
			return
		}
		fs.ServeHTTP(w, r)
	}))
}
