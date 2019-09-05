package tags

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/codewinks/cwblog/api/models"
	"github.com/google/uuid"
)

// TagRequest is a pointer to the Tag model.
type TagRequest struct {
	*models.Tag
}

// Bind validates the TagRequest body for required fields.
func (t *TagRequest) Bind(r *http.Request) error {
	// fmt.Printf("====%#v \n", t.Tag)
	if t.Tag == nil {
		return errors.New("Missing required Tag fields")
	}

	if t.Tag.Id == "" {
		t.Tag.Id = uuid.New().String()
	}

	if t.Tag.Name == "" {
		return errors.New("Missing tag name")
	}

	if t.Tag.Slug == "" {
		t.Tag.Slug = slugify(t.Tag.Name)
	}

	return nil
}

func slugify(s string) string {
	var re = regexp.MustCompile("[^a-z0-9]+")
	return strings.Trim(re.ReplaceAllString(strings.ToLower(s), "-"), "-")
}
