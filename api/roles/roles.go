package roles

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
	roleKey key = iota
	ROLE_SUPERADMIN = 1
	ROLE_ADMIN = 2
	ROLE_MODERATOR = 3
	ROLE_EDITOR = 4
	ROLE_GUEST = 5
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Roles.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/roles", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{roleId}", func(r chi.Router) {
				r.Use(cw.RoleCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})
	})

	return r
}

//List handler returns all roles in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var roles []models.Role
	err := cw.DB.Model(&roles).Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
	}

	render.JSON(w, r, roles)
}

//Store handler creates a new role and returns the role in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &RoleRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	var role models.Role
	exists, err := cw.DB.Model(&role).Where("name = ?", data.Role.Name).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Role already exists with that name.")))
		return
	}

	_, err = cw.DB.Model(data.Role).Insert()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", role)

	render.JSON(w, r, role)
}

//Get handler returns a role by the provided {roleId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	role := r.Context().Value(roleKey).(*models.Role)

	if role == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, role)
}

//Update handler updates a role by the provided {roleId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value(roleKey).(*models.Role)

	err := cw.DB.Model(role).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &RoleRequest{Role: role}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	role = data.Role

	_, err = cw.DB.Model(role).WherePK().Update()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(role).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, role)
}

//Delete handler deletes a role by the provided {roleId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value(roleKey).(*models.Role)

	_, err := cw.DB.Model(role).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, role)
}

//RoleCtx handler loads a role by either {roleId} or {roleSlug}
func (cw *Handler) RoleCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var role models.Role
		var err error

		if roleId := chi.URLParam(r, "roleId"); roleId != "" {
			err = cw.DB.Model(&role).Where("id = ?", roleId).First()
		} else if roleSlug := chi.URLParam(r, "roleSlug"); roleSlug != "" {
			err = cw.DB.Model(&role).Where("slug = ?", roleSlug).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), roleKey, &role)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
