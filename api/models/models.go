package models

//Post model
type Post struct {
	Id            string `json:"id"`
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
	Tags          []Tag  `json:"tags" pg:"many2many:posts_tags"`
	User          User   `json:"user" pg:"rel:has-one"`
}

//User model
type User struct {
	Id        string `json:"id"`
	Uid       string `json:"uid"`
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

//Category model
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

//Tag model
type Tag struct {
	Id          string `json:"id"`
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	Sort        int    `json:"sort,omitempty"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type PostsTags struct {
	PostId string
	TagId  string
	Sort   int
}
