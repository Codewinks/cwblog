package categories

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

type Handler core.Handler

func Routes(r chi.Router, db *cworm.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/categories", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{categoryId}", func(r chi.Router) {
				r.Use(cw.CategoryCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})

		r.With(cw.CategoryCtx).Get("/slug/{categorySlug}", cw.Get)
	})

	return r
}

func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	categories, err := cw.DB.Get(&models.Category{})
	if err != nil {
		panic(err)
	}

	render.JSON(w, r, categories)
}

func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &CategoryRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	exists, err := cw.DB.Where("slug", "=", data.Category.Slug).Exists(models.Category{})
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Category already exists with that slug.")))
		return
	}

	category, err := cw.DB.New(data.Category)
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", category)

	render.JSON(w, r, category)
}

func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	category := r.Context().Value("category").(*models.Category)

	if category == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, category)
}

func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	category := r.Context().Value("category").(*models.Category)

	data := &CategoryRequest{Category: category}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	category = data.Category

	cw.DB.Save(category)

	render.JSON(w, r, category)
}

func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	category := r.Context().Value("category").(*models.Category)
	cw.DB.Delete(category)

	render.JSON(w, r, category)
}

func (cw *Handler) CategoryCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var category models.Category
		var err error

		if categoryId := chi.URLParam(r, "categoryId"); categoryId != "" {
			err = cw.DB.Join(models.User{}, "user_id").Where("id", "=", categoryId).First(&category)
		} else if categorySlug := chi.URLParam(r, "categorySlug"); categorySlug != "" {
			err = cw.DB.Join(models.User{}, "user_id").Where("slug", "=", categorySlug).First(&category)
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), "category", &category)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
