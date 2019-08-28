package models

type Post struct {
	Id            int    `json:"id"`
	UserId        string `json:"user_id"`
	Title         string `json:"title" binding:"required"`
	Content       string `json:"content"`
	Excerpt       string `json:"excerpt" binding:"max=255"`
	Slug          string `json:"slug" binding:"required,max=200"`
	Password      string `json:"password"`
	Format        string `json:"format" binding:"exists"`
	Visibility    string `json:"visibility" binding:"exists"`
	Sort          int    `json:"sort"`
	CommentStatus int    `json:"comment_status" binding:"exists"`
	Status        string `json:"status" binding:"exists"`
	PublishedAt   string `json:"published_at"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	DeletedAt     string `json:"deleted_at,omitempty"`
	User          User   `json:"user"`
}

type User struct {
	Id        string `json:"id"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Nickname  string `json:"nickname"`
	Email     string `json:"email" binding:"required"`
	Avatar    string `json:"avatar"`
	Timezone  string `json:"timezone"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type Category struct {
	Id               string `json:"id"`
	Name             string `json:"name" binding:"required"`
	Slug             string `json:"slug" binding:"required"`
	Description      string `json:"description"`
	ParentCategoryId string `json:"parent_category_id"`
	Visibility       string `json:"visibility"`
	CreatedAt        string `json:"created_at"`
	UpdatedAt        string `json:"updated_at"`
}

type Tag struct {
	Id          string `json:"id"`
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}
