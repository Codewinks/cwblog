package models

type Post struct {
	Id            string `json:"id"`
	UserId        string `json:"user_id"`
	Title         string `json:"title" binding:"required"`
	Content       string `json:"content"`
	Excerpt       string `json:"excerpt" binding:"max=255"`
	Slug          string `json:"slug" binding:"required,max=200"`
	Password      string `json:"password"`
	Sort          string `json:"sort"`
	Format        string `json:"format" binding:"exists"`
	Visibility    string `json:"visibility" binding:"exists"`
	CommentStatus string `json:"comment_status" binding:"exists"`
	Status        string `json:"status" binding:"exists"`
	PublishedAt   string `json:"published_at"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	DeletedAt     string `json:"deleted_at"`
	User          User   `json:"user"`
}

type User struct {
	Id              string `json:"id"`
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	Phone           string `json:"phone"`
	Avatar          string `json:"avatar"`
	Timezone        string `json:"timezone"`
	Role            string `json:"role"`
	EmailVerifiedAt string `json:"email_verified_at"`
	LastLoginAt     string `json:"last_login_at"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
}
