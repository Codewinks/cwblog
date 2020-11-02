package categories

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
)

type key int

const (
	categoryKey key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Categories.
func Routes(r chi.Router, db *pg.DB) chi.Router {
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

//List handler returns all categories in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var categories []models.Category
	err := cw.DB.Model(&categories).Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
	}

	render.JSON(w, r, categories)
}

//Store handler creates a new category and returns the category in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &CategoryRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	var category models.Category
	exists, err := cw.DB.Model(&category).Where("slug = ?", data.Category.Slug).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Category already exists with that slug.")))
		return
	}

	_, err = cw.DB.Model(data.Category).Insert()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", category)

	render.JSON(w, r, category)
}

//Get handler returns a category by the provided {categoryId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	category := r.Context().Value(categoryKey).(*models.Category)

	if category == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, category)
}

//Update handler updates a category by the provided {categoryId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	category := r.Context().Value(categoryKey).(*models.Category)

	err := cw.DB.Model(category).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &CategoryRequest{Category: category}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	category = data.Category

	_, err = cw.DB.Model(category).WherePK().Update()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(category).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, category)
}

//Delete handler deletes a category by the provided {categoryId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	category := r.Context().Value(categoryKey).(*models.Category)

	_, err := cw.DB.Model(category).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, category)
}

//CategoryCtx handler loads a category by either {categoryId} or {categorySlug}
func (cw *Handler) CategoryCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var category models.Category
		var err error

		if categoryId := chi.URLParam(r, "categoryId"); categoryId != "" {
			err = cw.DB.Model(&category).Where("id = ?", categoryId).First()
		} else if categorySlug := chi.URLParam(r, "categorySlug"); categorySlug != "" {
			err = cw.DB.Model(&category).Where("slug = ?", categorySlug).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), categoryKey, &category)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
