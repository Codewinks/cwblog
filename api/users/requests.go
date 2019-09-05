package users

import (
	"errors"
	"net/http"

	"github.com/codewinks/cwblog/api/models"
)

// UserRequest is a pointer to the Category model.
type UserRequest struct {
	*models.User
}

// Bind validates the User Request body for required fields.
func (u *UserRequest) Bind(r *http.Request) error {
	// u.User is nil if no Post fields are sent in the request. Return an
	// error to avoid a nil pointer dereference.
	if u.User == nil {
		return errors.New("Missing required user fields.")
	}

	if u.User.Id == "" {
		return errors.New("Missing user id.")
	}

	if u.User.FirstName == "" {
		return errors.New("Missing first name.")
	}

	if u.User.LastName == "" {
		return errors.New("Missing last name.")
	}

	if u.User.Email == "" {
		return errors.New("Missing email.")
	}

	// a.User is nil if no Userpayload fields are sent in the request. In this app
	// this won't cause a panic, but checks in this Bind method may be required if
	// a.User or futher nested fields like a.User.Name are accessed elsewhere.

	// fmt.Println(u.User)

	return nil
}
