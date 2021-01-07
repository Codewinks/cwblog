package users

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/api/core"
	"github.com/codewinks/cwblog/api/middleware"
)

type key int

const (
	userKey key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Users.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/users", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{userId}", func(r chi.Router) {
				r.Use(cw.UserCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})

		r.With(cw.UserCtx).Get("/slug/{userSlug}", cw.Get)
	})

	return r
}

//List handler returns all users in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	err := cw.DB.Model(&users).Relation("Role").Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
	}

	render.JSON(w, r, users)
}

//Store handler creates a new user and returns the user in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &UserRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	var user models.User
	exists, err := cw.DB.Model(&user).Where("email = ?", data.User.Email).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("User already exists with that email.")))
		return
	}

	_, err = cw.DB.Model(data.User).Insert()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", user)

	render.JSON(w, r, user)
}

//Get handler returns a user by the provided {userId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	user := r.Context().Value(userKey).(*models.User)

	if user == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, user)
}

//Update handler updates a user by the provided {userId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userKey).(*models.User)

	err := cw.DB.Model(user).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &UserRequest{User: user}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	user = data.User

	_, err = cw.DB.Model(user).WherePK().Update()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(user).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, user)
}

//Delete handler deletes a user by the provided {userId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userKey).(*models.User)

	_, err := cw.DB.Model(user).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, user)
}

//UserCtx handler loads a user by either {userId} or {userSlug}
func (cw *Handler) UserCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error
		user := &models.User {
			Id: chi.URLParam(r, "userId"),
			Email: chi.URLParam(r, "userEmail"),
		}

		if user.Id != "" {
			err = cw.DB.Model(user).Relation("Role").WherePK().Select()
		} else if user.Email != "" {
			err = cw.DB.Model(user).Relation("Role").Where("email = ?", user.Email).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), userKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
