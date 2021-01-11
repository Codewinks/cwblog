package settings

import (
	"errors"
	"github.com/codewinks/cwblog/api/models"
	"github.com/google/uuid"
	"net/http"
)

// SettingRequest is a pointer to the Setting model.
type SettingRequest struct {
	*models.Setting
}

// Bind validates the SettingRequest body for required fields.
func (s *SettingRequest) Bind(r *http.Request) error {
	// fmt.Printf("====%#v \n", s.Setting)
	if s.Setting == nil {
		return errors.New("Missing required Setting fields")
	}

	if s.Setting.Id == "" {
		s.Setting.Id = uuid.New().String()
	}

	if s.Setting.Key == "" {
		return errors.New("Missing setting key")
	}

	if s.Setting.Value == "" {
		return errors.New("Missing setting value")
	}

	return nil
}