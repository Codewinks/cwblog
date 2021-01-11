package models

//Post model
type Post struct {
	Id            string                 `json:"id"`
	UserId        string                 `json:"user_id"`
	Title         string                 `json:"title" binding:"required"`
	Html          string                 `json:"html"`
	Css           string                 `json:"css"`
	Excerpt       string                 `json:"excerpt" binding:"max=255"`
	Slug          string                 `json:"slug" binding:"required,max=200"`
	Password      string                 `json:"password"`
	Format        string                 `json:"format" binding:"exists"`
	Options       map[string]interface{} `json:"options"`
	Visibility    string                 `json:"visibility" binding:"exists"`
	Sort          int                    `json:"sort"`
	CommentStatus int                    `json:"comment_status" binding:"exists"`
	Status        string                 `json:"status" binding:"exists"`
	PublishedAt   string                 `json:"published_at"`
	CreatedAt     string                 `json:"created_at"`
	UpdatedAt     string                 `json:"updated_at"`
	DeletedAt     string                 `json:"deleted_at,omitempty"`
	Tags          []Tag                  `json:"tags" pg:"many2many:posts_tags"`
	Categories    []Category             `json:"categories" pg:"many2many:posts_categories"`
	User          User                   `json:"user" pg:"rel:has-one"`
}

//Role model
type Role struct {
	Id          int                    `json:"id"`
	Name        string                 `json:"name" binding:"required"`
	Meta        map[string]interface{} `json:"meta"`
	Permissions map[string]interface{} `json:"permissions"`
	CreatedAt   string                 `json:"created_at"`
	UpdatedAt   string                 `json:"updated_at"`
}

//Invite model
type Invite struct {
	Id        string `json:"id"`
	Email     string `json:"email" binding:"required"`
	RoleId    int    `json:"role_id"`
	ExpiresAt string `json:"expires_at"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Role      Role   `json:"role" pg:"rel:has-one"`
}

//User model
type User struct {
	Id            string `json:"id"`
	Uid           string `json:"uid"`
	FirstName     string `json:"first_name" binding:"required"`
	LastName      string `json:"last_name" binding:"required"`
	Nickname      string `json:"nickname"`
	Email         string `json:"email" binding:"required"`
	Avatar        string `json:"avatar"`
	Timezone      string `json:"timezone"`
	RoleId        int    `json:"role_id"`
	EmailVerified bool   `json:"email_verified"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	Role          Role   `json:"role" pg:"rel:has-one"`
}

//Category model
type Category struct {
	Id            string     `json:"id"`
	Name          string     `json:"name" binding:"required"`
	Slug          string     `json:"slug" binding:"required"`
	Description   string     `json:"description"`
	ParentId      string     `json:"parent_id"`
	Visibility    string     `json:"visibility"`
	Sort          int        `json:"sort,omitempty"`
	CreatedAt     string     `json:"created_at"`
	UpdatedAt     string     `json:"updated_at"`
	SubCategories []Category `json:"sub_categories" pg:"rel:has-many,join_fk:parent_id"`
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

type PostsCategories struct {
	PostId     string
	CategoryId string
	Sort       int
}

type Setting struct {
	Id          string `json:"id"`
	Key         string `json:"key" binding:"required"`
	Value       string `json:"value" binding:"required"`
	Label       string `json:"label"`
	Description string `json:"description"`
}
