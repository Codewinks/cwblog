package main

import (
	"compress/flate"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/codewinks/godotenv"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/auth"
	"github.com/codewinks/cwblog/api/categories"
	"github.com/codewinks/cwblog/api/invites"
	"github.com/codewinks/cwblog/api/posts"
	"github.com/codewinks/cwblog/api/roles"
	"github.com/codewinks/cwblog/api/settings"
	"github.com/codewinks/cwblog/api/tags"
	"github.com/codewinks/cwblog/api/users"
)

//Routes consists of the main route method declarations.
func Routes(db *pg.DB) *chi.Mux {
	router := chi.NewRouter()

	corsOptions := cors.New(cors.Options{
		// AllowedOrigins: []string{"*"},
		AllowOriginFunc: AllowedOriginFunc,
		AllowedMethods:  []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:  []string{"Accept", "Authorization", "Content-Type"},
		// ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	router.Use(
		corsOptions.Handler,
		middleware.Logger,
		middleware.NewCompressor(flate.DefaultCompression).Handler,
		// middleware.RedirectSlashes,
		middleware.Recoverer,
		render.SetContentType(render.ContentTypeJSON),
	)

	router.Route("/v1", func(r chi.Router) {
		auth.Routes(r, db)
		categories.Routes(r, db)
		settings.Routes(r, db)
		invites.Routes(r, db)
		posts.Routes(r, db)
		roles.Routes(r, db)
		tags.Routes(r, db)
		users.Routes(r, db)
	})

	return router
}

//AllowedOriginFunc validates the request origin.
func AllowedOriginFunc(r *http.Request, origin string) bool {
	//TODO: Move allowed origins to environment variable
	if origin == "http://localhost:3000" {
		return true
	}

	return false
}

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		panic("Error loading .env file")
	}

	db := pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT")),
		User:     os.Getenv("DB_USERNAME"),
		Password: os.Getenv("DB_PASSWORD"),
		Database: os.Getenv("DB_DATABASE"),
	})
	defer db.Close()

	ctx := context.Background()
	if err := db.Ping(ctx); err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %s", err))
	}

	router := Routes(db)

	walkFunc := func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		log.Printf("%s %s\n", method, route)
		return nil
	}

	if err := chi.Walk(router, walkFunc); err != nil {
		log.Panicf("Logging error: %s\n", err.Error())
	}

	log.Println("Running on: < http://api.winks.localhost:8080 >")
	log.Fatal(http.ListenAndServe(":8080", router))
}
