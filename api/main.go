package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/codewinks/godotenv"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"

	"github.com/codewinks/cwblog/api/auth"
	"github.com/codewinks/cwblog/api/posts"
	"github.com/codewinks/cwblog/api/users"
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
		auth.Routes(r, db)
		posts.Routes(r, db)
		users.Routes(r, db)
	})

	return router
}

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		panic("Error loading .env file")
	}

	db, err := cworm.Connect(os.Getenv("DB_CONNECTION"), os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_DATABASE"))
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %s", err))
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
