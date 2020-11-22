package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "7_create_posts_categories_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE posts_categories (
				post_id uuid NOT NULL,
				category_id uuid NOT NULL,
				sort int NULL DEFAULT 0,
				UNIQUE (post_id, category_id),
				CONSTRAINT fk_post_id FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
				CONSTRAINT fk_category_id FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
			);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE posts_categories`)
	})

}
