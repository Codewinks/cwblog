package auth

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/go-pg/pg/v10"

	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/api/roles"
	"github.com/codewinks/cwblog/core"
	"github.com/codewinks/cwblog/middleware"
)

//Handler consists of the DB connection and Routes
type Handler core.Handler

//Routes consists of the route method declarations for Auth.
func Routes(r chi.Router, db *pg.DB) chi.Router {
	cw := &Handler{DB: db}
	r.Route("/auth", func(r chi.Router) {
		r.Post("/check", cw.Check)
		r.Group(func(r chi.Router) {
			r.Use(middleware.IsAuthenticated)
			r.Post("/login", cw.Login)
			r.Post("/logout", cw.Logout)
		})
	})

	return r
}

type Check struct {
	Audience string
	ClientId  string
	ClientSecret  string
	Email  string
}

//Check handler – Called from Auth0 User Login Signup rule. Compares hash against client secret.
func (cw *Handler) Check(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var data Check
	err := decoder.Decode(&data)
	if err != nil {
		panic(err)
	}

	mac := hmac.New(sha256.New, []byte(os.Getenv("APP_KEY")))
	mac.Write([]byte(os.Getenv("AUTH0_CLIENT_SECRET")))
	hashedSecret := hex.EncodeToString(mac.Sum(nil))

	if hashedSecret != data.ClientSecret{
		render.Render(w, r, core.ErrUnauthorized)
	}

	// TODO: Add check here against "invites" table, then return status back to rule. Update rule allow signups for email
	var invite models.Invite
	exists, err := cw.DB.Model(&invite).Where("email = ?", data.Email).Where("expires_at > NOW()").Exists()
	if err != nil {
		render.Render(w, r, core.ErrInvalidRequest(err))
		return
	}

	if exists {
		render.JSON(w, r, nil)
		return
	}

	render.Render(w, r, core.ErrConflict(errors.New("Invite has expired or is no longer valid.")))
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
	err = cw.DB.Model(&user).Where("uid = ?", result["sub"]).WhereOr("email = ?", result["email"]).Relation("Role").First()
	if err != nil {
		if err.Error() != "pg: no rows in result set" {
			render.Render(w, r, core.ErrInvalidRequest(err))
			return
		}
	}

	if user.Id == "" {
		count, err := cw.DB.Model(&models.User{}).Count()
		if err != nil {
			panic(err)
		}

		roleId := roles.ROLE_GUEST
		if count == 0 {
			roleId = roles.ROLE_SUPERADMIN
		}

		fmt.Printf("%#v\n\n", result)

		if _, exists := result["given_name"].(string); !exists {
			result["given_name"] = result["name"]
		}

		if _, exists := result["family_name"].(string); !exists {
			result["family_name"] = ""
		}

		user := &models.User{
			Uid: result["sub"].(string),
			Email: result["email"].(string),
			FirstName: result["given_name"].(string),
			LastName: result["family_name"].(string),
			Avatar: result["picture"].(string),
			Nickname: result["nickname"].(string),
			EmailVerified: result["email_verified"].(bool),
			RoleId: roleId,
		}

		queryTx := func(cw *Handler) error {
			return cw.DB.RunInTransaction(r.Context(), func(tx *pg.Tx) error {
				cw.Tx = tx
				_, err = tx.Model(user).Insert()
				if err != nil {
					return err
				}

				var invite models.Invite
				_, err := cw.DB.Model(&invite).Where("email = ?", user.Email).Delete()
				return err
			})
		}

		err = queryTx(cw)
		if err != nil {
			fmt.Println(err)
			render.Render(w, r, core.ErrInvalidRequest(err))
			return
		}
	}

	reqBodyBytes := new(bytes.Buffer)
	json.NewEncoder(reqBodyBytes).Encode(user)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(200)
	w.Write(reqBodyBytes.Bytes())
}

//Logout handler – Unfinished
func (cw *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, nil)
}
