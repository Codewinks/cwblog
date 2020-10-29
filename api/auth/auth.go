package auth

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
	"github.com/codewinks/cworm"
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Auth.
func Routes(r chi.Router, db *cworm.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/auth", func(r chi.Router) {
		r.Use(middleware.IsAuthenticated)
		r.Post("/login", cw.Login)
		r.Post("/logout", cw.Logout)
	})

	return r
}

//Login handler to obtain jwt token.
func (cw *Handler) Login(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value("user").(*jwt.Token).Raw

	url := fmt.Sprintf("https://%s/userinfo", os.Getenv("AUTH0_DOMAIN"))
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("content-type", "application/json")
	req.Header.Add("Authorization", "Bearer "+token)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	var result map[string]interface{}
	json.Unmarshal([]byte(body), &result)

	var user models.User
	var exists bool
	var err error

	exists, err = cw.DB.NewQuery().Where("id", "=", result["sub"]).Exists(&user)

	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if !exists {
		user.Id = result["sub"].(string)
		user.Email = result["email"].(string)
		user.FirstName = result["given_name"].(string)
		user.LastName = result["family_name"].(string)
		user.Avatar = result["picture"].(string)
		_, err := cw.DB.NewQuery().Create(user)
		if err != nil {
			render.Render(w, r, core.ErrInvalidRequest(err))
			return
		}
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(200)
	w.Write(body)
	// url :=

	// payload := strings.NewReader(fmt.Sprintf("{\"client_id\":\"%s\",\"client_secret\":\"%s\",\"audience\":\"%s\",\"grant_type\":\"client_credentials\"}", os.Getenv("AUTH0_CLIENT_ID"), os.Getenv("AUTH0_CLIENT_SECRET"), os.Getenv("AUTH0_AUDIENCE")))

	// req, _ := http.NewRequest("POST", url, payload)

	// req.Header.Add("content-type", "application/json")

	// res, _ := http.DefaultClient.Do(req)

	// defer res.Body.Close()
	// body, _ := ioutil.ReadAll(res.Body)

	// w.Header().Set("Content-Type", "application/json; charset=utf-8")
	// w.WriteHeader(200)
	// w.Write(body)
}

//Logout handler – Unfinished
func (cw *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, nil)
}
