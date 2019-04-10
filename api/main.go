package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"

	"github.com/codewinks/cwblog/api/posts"
	"github.com/codewinks/cworm"
)

func Routes(db *cworm.DB) *chi.Mux {
	router := chi.NewRouter()
	router.Use(
		middleware.Logger,
		middleware.DefaultCompress,
		// middleware.RedirectSlashes,
		middleware.Recoverer,
		render.SetContentType(render.ContentTypeJSON),
	)

	router.Route("/v1", func(r chi.Router) {
		posts.Routes(r, db)
	})

	return router
}

func main() {
	db, err := cworm.Connect("root@tcp(127.0.0.1:3306)/winks")
	if err != nil {
		panic("Failed to connect to database")
	}

	defer db.DB.Close()

	router := Routes(db)

	walkFunc := func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		log.Printf("%s %s\n", method, route)
		return nil
	}

	if err := chi.Walk(router, walkFunc); err != nil {
		log.Panicf("Logging error: %s\n", err.Error())
	}

	log.Println("Running on: < http://api.winks.localhost:8080 >")
	log.Fatal(http.ListenAndServe(":3001", router))
}
