package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "5_create_posts_tags_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE posts_tags (
				post_id uuid NOT NULL,
				tag_id uuid NOT NULL,
				sort int NULL DEFAULT 0,
				UNIQUE (post_id, tag_id),
				CONSTRAINT fk_post_id FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
				CONSTRAINT fk_tag_id FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
			);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE posts_tags`)
	})

}
