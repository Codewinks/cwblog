package auth

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cworm"
)

type Handler core.Handler

func Routes(r chi.Router, db *cworm.DB) chi.Router {
	fmt.Println("auth routes loaded")
	cw := &Handler{DB: db}
	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", cw.Login)
		r.Post("/logout", cw.Logout)
	})

	return r
}

func (cw *Handler) Login(w http.ResponseWriter, r *http.Request) {
	url := fmt.Sprintf("https://%s/oauth/token", os.Getenv("AUTH0_DOMAIN"))

	payload := strings.NewReader(fmt.Sprintf("{\"client_id\":\"%s\",\"client_secret\":\"%s\",\"audience\":\"%s\",\"grant_type\":\"client_credentials\"}", os.Getenv("AUTH0_CLIENT_ID"), os.Getenv("AUTH0_CLIENT_SECRET"), os.Getenv("AUTH0_AUDIENCE")))

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(200)
	w.Write(body)
}

func (cw *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	posts, err := cw.DB.Join(models.User{}, "user_id").Get(&models.Post{})
	if err != nil {
		panic(err)
	}

	render.JSON(w, r, posts)
}
