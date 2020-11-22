package users

import (
	"errors"
	"net/http"

	"github.com/codewinks/cwblog/api/models"
	"github.com/google/uuid"
)

// UserRequest is a pointer to the User model.
type UserRequest struct {
	*models.User
}

// Bind validates the UserRequest body for required fields.
func (u *UserRequest) Bind(r *http.Request) error {
	// fmt.Printf("====%#v \n", u.User)
	if u.User == nil {
		return errors.New("Missing required User fields")
	}

	if u.User.Id == "" {
		u.User.Id = uuid.New().String()
	}

	if u.User.FirstName == "" {
		return errors.New("Missing first name")
	}

	if u.User.Email == "" {
		return errors.New("Missing email.")
	}

	return nil
}
