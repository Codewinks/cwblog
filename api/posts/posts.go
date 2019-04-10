package posts

import (
	"context"
	"net/http"

	"fmt"
	"github.com/codewinks/cworm"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"errors"
	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
)

type Handler core.Handler

func Routes(r chi.Router, db *cworm.DB) chi.Router {
	fmt.Println("posts routes loaded")
	cw := &Handler{DB: db}
	r.Route("/posts", func(r chi.Router) {
		r.Get("/", cw.List)
		r.Post("/", cw.Store)

		r.Route("/{postId}", func(r chi.Router) {
			r.Use(cw.PostCtx)
			r.Get("/", cw.Get)
			r.Put("/", cw.Update)
			r.Delete("/", cw.Delete)
		})

		r.With(cw.PostCtx).Get("/slug/{postSlug}", cw.Get)
	})

	return r
}

func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	posts, err := cw.DB.Join(models.User{}, "user_id").Get(&models.Post{})
	if err != nil {
		panic(err)
	}

	render.JSON(w, r, posts)
}

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

	fmt.Printf("%#v \n", post)

	render.JSON(w, r, post)
}

func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	post := r.Context().Value("post").(*models.Post)

	render.JSON(w, r, post)
}

func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	//[] Implement update
	post := r.Context().Value("post").(*models.Post)

	data := &PostRequest{Post: post}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	post = data.Post

	cw.DB.Save(post)

	render.JSON(w, r, post)
}

func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	post := r.Context().Value("post").(models.Post)
	cw.DB.Delete(post)

	render.JSON(w, r, post)
}

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

		ctx := context.WithValue(r.Context(), "post", &post)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
