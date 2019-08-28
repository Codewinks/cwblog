package categories

import (
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/codewinks/cwblog/api/models"
)

type CategoryRequest struct {
	*models.Category
}

func (c *CategoryRequest) Bind(r *http.Request) error {
	fmt.Printf("====%#v \n", c.Category)
	if c.Category == nil {
		return errors.New("Missing required Post fields")
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
