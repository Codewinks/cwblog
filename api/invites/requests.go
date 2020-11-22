package invites

import (
	"errors"
	"fmt"
	"github.com/codewinks/cwblog/api/models"
	"github.com/codewinks/cwblog/api/roles"
	"net/http"
)

// InviteRequest is a pointer to the Invite model.
type InviteRequest struct {
	*models.Invite
}

// Bind validates the InviteRequest body for required fields.
func (t *InviteRequest) Bind(r *http.Request) error {
	fmt.Printf("====%#v \n", t.Invite)
	if t.Invite == nil {
		return errors.New("Missing required Invite fields")
	}

	if t.Invite.Email == "" {
		return errors.New("Missing invite email")
	}

	if t.Invite.RoleId == 0 {
		t.Invite.RoleId = roles.ROLE_GUEST
	}

	return nil
}
