package core

import (
	"github.com/codewinks/cworm"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"net/http"
)

type Handler struct {
	DB     *cworm.DB
	Routes *chi.Mux
}

type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

//ErrInvalidRequest – The request was unacceptable, often due to missing a required parameter.
func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid Request",
		ErrorText:      err.Error(),
	}
}

//ErrUnauthorized – No valid API token provided.
var ErrUnauthorized = &ErrResponse{HTTPStatusCode: 401, StatusText: "Unauthorized"}

//ErrRequestFailed – The parameters were valid but the request failed.
func ErrRequestFailed(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 402,
		StatusText:     "Request Failed",
		ErrorText:      err.Error(),
	}
}

//ErrNotFound – The requested resource doesn't exist.
var ErrNotFound = &ErrResponse{HTTPStatusCode: 404, StatusText: "Not Found"}

//ErrConflict – The request conflicts with another request (perhaps due to using the same idempotent key).
func ErrConflict(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 409,
		StatusText:     "Conflict",
		ErrorText:      err.Error(),
	}
}

//ErrRender
func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}

//ErrTooManyRequests – Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.
var ErrTooManyRequests = &ErrResponse{HTTPStatusCode: 429, StatusText: "Too Many Requests"}
