package posts

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/codewinks/cworm"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
)

type key int

const (
	postKey key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Posts.
func Routes(r chi.Router, db *cworm.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/posts", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{postId}", func(r chi.Router) {
				r.Use(cw.PostCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})

		r.With(cw.PostCtx).Get("/slug/{postSlug}", cw.Get)
	})

	return r
}

//List handler returns all posts in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	posts, err := cw.DB.Join(models.User{}, "user_id").Get(&models.Post{})
	if err != nil {
		panic(err)
	}

	render.JSON(w, r, posts)
}

//Store handler creates a new post and returns the post in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &PostRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	exists, err := cw.DB.Where("slug", "=", data.Post.Slug).Exists(models.Post{})
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Post already exists with that slug.")))
		return
	}

	post, err := cw.DB.New(data.Post)
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", post)

	render.JSON(w, r, post)
}

//Get handler returns a post by the provided {postId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	post := r.Context().Value(postKey).(*models.Post)

	if post == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, post)
}

//Update handler updates a post by the provided {postId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	post := r.Context().Value(postKey).(*models.Post)

	data := &PostRequest{Post: post}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	post = data.Post

	cw.DB.Save(post)

	render.JSON(w, r, post)
}

//Delete handler deletes a post by the provided {postId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	post := r.Context().Value(postKey).(*models.Post)
	cw.DB.Delete(post)

	render.JSON(w, r, post)
}

//PostCtx handler loads a post by either {postId} or {postSlug}
func (cw *Handler) PostCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var post models.Post
		var err error

		if postId := chi.URLParam(r, "postId"); postId != "" {
			err = cw.DB.Join(models.User{}, "user_id").Where("id", "=", postId).First(&post)
		} else if postSlug := chi.URLParam(r, "postSlug"); postSlug != "" {
			err = cw.DB.Join(models.User{}, "user_id").Where("slug", "=", postSlug).First(&post)
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), postKey, &post)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
