package posts

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/codewinks/cwblog/api/models"
	"github.com/google/uuid"
)

// PostRequest is a pointer to the Post model.
type PostRequest struct {
	*models.Post
}

// Bind validates the Post Request body for required fields.
func (p *PostRequest) Bind(r *http.Request) error {
	// fmt.Printf("====%#v \n", p.Post)
	if p.Post == nil {
		return errors.New("Missing required Post fields")
	}

	if p.Post.Id == "" {
		p.Post.Id = uuid.New().String()
	}

	if p.Post.Title == "" {
		return errors.New("Missing post title")
	}

	if p.Post.UserId == "" {
		p.Post.UserId = r.Context().Value("userID").(string)
	}

	if p.Post.Slug == "" {
		p.Post.Slug = slugify(p.Post.Title)
	}

	return nil
}

func slugify(s string) string {
	var re = regexp.MustCompile("[^a-z0-9]+")
	return strings.Trim(re.ReplaceAllString(strings.ToLower(s), "-"), "-")
}
