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

	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Auth.
func Routes(r chi.Router, db *pg.DB) chi.Router {
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
	err := json.Unmarshal([]byte(body), &result)
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	var user models.User
	exists, err := cw.DB.Model(&user).Where("uid = ?", result["sub"]).Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if !exists {
		user := &models.User{
			Uid: result["sub"].(string),
			Email: result["email"].(string),
			FirstName: result["given_name"].(string),
			LastName: result["family_name"].(string),
			Avatar: result["picture"].(string),
		}

		_, err := cw.DB.Model(user).Insert()
		if err != nil {
			render.Render(w, r, core.ErrInvalidRequest(err))
			return
		}
	}else{
		err = cw.DB.Model(&user).Where("uid = ?", result["sub"]).First()
		if err != nil {
			render.Render(w, r, core.ErrInvalidRequest(err))
			return
		}
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(200)
	w.Write(body)
}

//Logout handler – Unfinished
func (cw *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, nil)
}
