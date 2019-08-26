package posts

import (
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/codewinks/cwblog/api/models"
)

type PostRequest struct {
	*models.Post
}

func (p *PostRequest) Bind(r *http.Request) error {
	fmt.Printf("====%#v \n", p.Post)
	if p.Post == nil {
		return errors.New("Missing required Post fields")
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
