package posts

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
)

type key int

const (
	postKey key = iota
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Posts.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/posts", func(r chi.Router) {
		r.Use(cw.Init)
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

//Init handler registers models
func (cw *Handler) Init(next http.Handler) http.Handler {
	orm.RegisterTable((*models.PostsTags)(nil))
	return next
}

//List handler returns all posts in JSON format.
func (cw *Handler) List(w http.ResponseWriter, r *http.Request) {
	var posts []models.Post
	err := cw.DB.Model(&posts).Relation("User").Relation("Tags").Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
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

	// TODO: Put current user into middleware? Will eventually be re-used in other spots to obtain the current user ID.
	var currentUser models.User
	currentUid :=  r.Context().Value(middleware.UidKey).(string)
	err := cw.DB.Model(&currentUser).Where("uid = ?", currentUid).First()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	post := data.Post
	exists, err := cw.DB.Model(post).Where("slug = ?", post.Slug).Exists()
	if exists {
		render.Render(w, r, core.ErrConflict(errors.New("Post already exists with that slug.")))
		return
	}

	post.UserId = currentUser.Id
	queryTx := func(cw *Handler) error {
		return cw.DB.RunInTransaction(r.Context(), func(tx *pg.Tx) error {
			cw.Tx = tx
			_, err = tx.Model(post).Insert()
			err = InsertOrUpdateTags(tx, post)
			return err
		})
	}
	err = queryTx(cw)
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	fmt.Printf("====%#v \n", post)

	render.JSON(w, r, post)
}

//Get handler returns a post by the provided {postId}
func (cw *Handler) Get(w http.ResponseWriter, r *http.Request) {
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

	err := cw.DB.Model(post).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	data := &PostRequest{Post: post}
	if err := render.Bind(r, data); err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	post = data.Post


	queryTx := func(cw *Handler) error {
		return cw.DB.RunInTransaction(r.Context(), func(tx *pg.Tx) error {
			_, err = tx.Model(post).WherePK().Update()
			err = InsertOrUpdateTags(tx, post)
			return err
		})
	}
	err = queryTx(cw)
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	err = cw.DB.Model(post).WherePK().Select()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, post)
}

//Delete handler deletes a post by the provided {postId}
func (cw *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	post := r.Context().Value(postKey).(*models.Post)

	_, err := cw.DB.Model(post).WherePK().Delete()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	render.JSON(w, r, post)
}

//PostCtx handler loads a post by either {postId} or {postSlug}
func (cw *Handler) PostCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		post := &models.Post {
			Id: chi.URLParam(r, "postId"),
			Slug: chi.URLParam(r, "postSlug"),
		}
		var err error

		if post.Id != "" {
			err = cw.DB.Model(post).Relation("User").Relation("Tags").WherePK().Select()
		} else if post.Slug != "" {
			err = cw.DB.Model(post).Relation("User").Relation("Tags").Where("slug = ?", post.Slug).First()
		} else {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		if err != nil {
			render.Render(w, r, core.ErrNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), postKey, post)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func  InsertOrUpdateTags(tx *pg.Tx, post *models.Post) error {
	var postsTags []models.PostsTags

	//TODO: Remove tags that arent' in the slice
	for i := 0; i < len(post.Tags); i++ {
		postsTags = append(postsTags, models.PostsTags{
			PostId: post.Id,
			TagId: post.Tags[i].Id,
			Sort: post.Tags[i].Sort,
		})
	}

	if len(postsTags) > 0 {
		fmt.Printf("LENPOSTTAGS %#v\n", postsTags)
		_, err := tx.Model(&postsTags).OnConflict("(post_id, tag_id) DO UPDATE").Insert()
		if err != nil {
			return err
		}
	}

	return nil
}