package tags

import (
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/codewinks/cwblog/api/models"
)

type TagRequest struct {
	*models.Tag
}

func (t *TagRequest) Bind(r *http.Request) error {
	fmt.Printf("====%#v \n", t.Tag)
	if t.Tag == nil {
		return errors.New("Missing required Post fields")
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
