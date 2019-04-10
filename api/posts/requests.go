package posts

import (
	"errors"
	"fmt"
	"github.com/codewinks/cwblog/api/models"
	"net/http"
	"regexp"
	"strings"
)

type PostRequest struct {
	*models.Post
}

func (p *PostRequest) Bind(r *http.Request) error {
	// p.Post is nil if no Post fields are sent in the request. Return an
	// error to avoid a nil pointer dereference.
	if p.Post == nil {
		return errors.New("Missing required Post fields.")
	}

	if p.Post.Title == "" {
		return errors.New("Missing title")
	}

	if p.Post.SiteId == "" {
		return errors.New("Missing site id")
	}

	if p.Post.UserId == "" {
		return errors.New("Missing user id")
	}

	// a.User is nil if no Userpayload fields are sent in the request. In this app
	// this won't cause a panic, but checks in this Bind method may be required if
	// a.User or futher nested fields like a.User.Name are accessed elsewhere.

	if p.Post.Slug == "" {
		p.Post.Slug = slugify(p.Post.Title) // as an example, we down-case
	}

	fmt.Println(p.Post)

	return nil
}

func slugify(s string) string {
	var re = regexp.MustCompile("[^a-z0-9]+")
	return strings.Trim(re.ReplaceAllString(strings.ToLower(s), "-"), "-")
}
