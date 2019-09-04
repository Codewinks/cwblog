package categories

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/codewinks/cwblog/api/models"
	"github.com/google/uuid"
)

type CategoryRequest struct {
	*models.Category
}

func (c *CategoryRequest) Bind(r *http.Request) error {
	// fmt.Printf("====%#v \n", c.Category)
	if c.Category == nil {
		return errors.New("Missing required Post fields")
	}

	if c.Category.Id == "" {
		c.Category.Id = uuid.New().String()
	}

	if c.Category.Name == "" {
		return errors.New("Missing category name")
	}

	if c.Category.Slug == "" {
		c.Category.Slug = slugify(c.Category.Name)
	}

	return nil
}

func slugify(s string) string {
	var re = regexp.MustCompile("[^a-z0-9]+")
	return strings.Trim(re.ReplaceAllString(strings.ToLower(s), "-"), "-")
}
