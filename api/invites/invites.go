package invites

import (
	"context"
	"errors"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"
	"net/http"

	"github.com/codewinks/cwblog/api/mailer"
	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
)

type key int

const (
	inviteKey key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Invites.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/invites", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Get("/", cw.List)
			r.Post("/", cw.Store)

			r.Route("/{inviteId}", func(r chi.Router) {
				r.Use(cw.InviteCtx)
				r.Get("/", cw.Get)
				r.Put("/", cw.Update)
				r.Delete("/", cw.Delete)
			})
		})
	})

	return r
}

//List handler returns all invites in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var invites []models.Invite
	err := cw.DB.Model(&invites).Relation("Role").Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
	}

	render.JSON(w, r, invites)
}

//Store handler creates a new invite and returns the invite in JSON format.
func (cw *Handler) Store(w http.ResponseWriter, r *http.Request) {
	data := &InviteRequest{}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	invite := data.Invite
	exists, err := cw.DB.Model(invite).Where("email = ?", invite.Email).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Invite already exists with that email.")))
		return
	}

	var user models.User
	exists, err = cw.DB.Model(&user).Where("email = ?", invite.Email).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("User with that email already has an account.")))
		return
	}

	_, err = cw.DB.Model(invite).Insert()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", invite)

	// Send invite email
	err = mailer.SendMail(mailer.Config{
		To:      []string{invite.Email},
		Subject: "You have been invited!",
		Template: "templates/invite.html",
		Params: struct {
			Name    string
			Message string
		}{
			Name:    "Puneet Singh",
			Message: "This is a test message in a HTML template",
		},
	})

	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, invite)
}

//Get handler returns a invite by the provided {inviteId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
	fmt.Println("-----")
	invite := r.Context().Value(inviteKey).(*models.Invite)

	if invite == nil {
		render.Render(w, r, core.ErrNotFound)
		return
	}

	render.JSON(w, r, invite)
}

//Update handler updates a invite by the provided {inviteId}
func (cw *Handler) Update(w http.ResponseWriter, r *http.Request) {
	invite := r.Context().Value(inviteKey).(*models.Invite)

	err := cw.DB.Model(invite).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &InviteRequest{Invite: invite}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	invite = data.Invite

	_, err = cw.DB.Model(invite).WherePK().Update()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(invite).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, invite)
}

//Delete handler deletes a invite by the provided {inviteId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	invite := r.Context().Value(inviteKey).(*models.Invite)

	_, err := cw.DB.Model(invite).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, invite)
}

//InviteCtx handler loads a invite by either {inviteId} or {inviteEmail}
func (cw *Handler) InviteCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error
		invite := &models.Invite{
			Id:    chi.URLParam(r, "inviteId"),
			Email: chi.URLParam(r, "inviteEmail"),
		}

		if invite.Id != "" {
			err = cw.DB.Model(invite).Relation("Role").WherePK().Select()
		} else if invite.Email != "" {
			err = cw.DB.Model(invite).Relation("Role").Where("email = ?", invite.Email).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), inviteKey, invite)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
