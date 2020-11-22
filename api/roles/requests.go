package roles

import (
	"errors"
	"github.com/codewinks/cwblog/api/models"
	"net/http"
)

// RoleRequest is a pointer to the Role model.
type RoleRequest struct {
	*models.Role
}

// Bind validates the RoleRequest body for required fields.
func (t *RoleRequest) Bind(r *http.Request) error {
	// fmt.Printf("====%#v \n", t.Role)
	if t.Role == nil {
		return errors.New("Missing required Role fields")
	}

	if t.Role.Name == "" {
		return errors.New("Missing role name")
	}


	return nil
}
