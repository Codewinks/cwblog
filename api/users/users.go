package users

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
	"github.com/codewinks/cwblog/middleware"
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Users.
func Routes(r chi.Router, db *cworm.DB) chi.Router {
	fmt.Println("users routes loaded")
	cw := &Handler{DB: db}
	r.Route("/users", func(r chi.Router) {
		r.Use(middleware.IsAuthenticated)

		r.Get("/", cw.List)
		r.Post("/", cw.Store)

		r.Route("/{userId}", func(r chi.Router) {
			r.Use(cw.UserCtx)
			r.Get("/", cw.Get)
			r.Put("/", cw.Update)
			r.Delete("/", cw.Delete)
		})

		r.With(cw.UserCtx).Get("/email/{userEmail}", cw.Get)
	})

	return r
}

//List handler returns all users in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	users, err := cw.DB.Get(&models.User{})
	if err != nil {
		panic(err)
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

	exists, err := cw.DB.Where("email", "=", data.User.Email).Exists(models.User{})
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("User already exists with that email.")))
		return
	}

	user, err := cw.DB.New(data.User)
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("%#v \n", user)

	render.JSON(w, r, user)
}

//Get handler returns a user by the provided {userId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(*models.User)

	render.JSON(w, r, user)
}

//Update handler updates a user by the provided {userId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	//[] Implement update
	user := r.Context().Value("user").(*models.User)

	data := &UserRequest{User: user}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	user = data.User

	cw.DB.Save(user)

	render.JSON(w, r, user)
}

//Delete handler deletes a user by the provided {userId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(models.User)
	cw.DB.Delete(user)

	render.JSON(w, r, user)
}

//UserCtx handler loads a user by either {userId} or {userSlug}
func (cw *Handler) UserCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		var err error

		if userId := chi.URLParam(r, "userId"); userId != "" {
			err = cw.DB.Where("id", "=", userId).First(&user)
		} else if userEmail := chi.URLParam(r, "userEmail"); userEmail != "" {
			err = cw.DB.Where("email", "=", userEmail).First(&user)
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}
		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), "user", &user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
