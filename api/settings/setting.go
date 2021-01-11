package settings

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/core"
	"github.com/codewinks/cwblog/api/middleware"
	"github.com/codewinks/cwblog/api/models"
)

type key int

const (
	settingId key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Settings.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/settings", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{settingId}", func(r chi.Router) {
				r.Use(cw.SettingCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})
	})

	return r
}

//List handler returns all setting in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var setting []models.Setting
	err := cw.DB.Model(&setting).Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
	}

	render.JSON(w, r, setting)
}

//Store handler creates a new setting and returns the setting in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &SettingRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	var setting models.Setting
	exists, err := cw.DB.Model(&setting).Where("key = ?", data.Setting.Key).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Setting already exists with that key.")))
		return
	}

	_, err = cw.DB.Model(data.Setting).Insert()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", setting)

	render.JSON(w, r, setting)
}

//Get handler returns a setting by the provided {settingId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	setting := r.Context().Value(settingId).(*models.Setting)

	if setting == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, setting)
}

//Update handler updates a setting by the provided {settingId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	setting := r.Context().Value(settingId).(*models.Setting)

	err := cw.DB.Model(setting).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &SettingRequest{Setting: setting}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	setting = data.Setting

	_, err = cw.DB.Model(setting).WherePK().Update()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(setting).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, setting)
}

//Delete handler deletes a setting by the provided {settingId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	setting := r.Context().Value(settingId).(*models.Setting)

	_, err := cw.DB.Model(setting).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, setting)
}

//SettingCtx handler loads a setting by {settingId}
func (cw *Handler) SettingCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var setting models.Setting
		var err error

		if settingId := chi.URLParam(r, "settingId"); settingId != "" {
			err = cw.DB.Model(&setting).Where("id = ?", settingId).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), settingId, &setting)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
