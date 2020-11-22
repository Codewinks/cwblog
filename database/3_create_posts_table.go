package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "3_create_posts_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE posts (
				id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
				user_id uuid NOT NULL,
				title text NOT NULL,
				content text NULL DEFAULT NULL,
				excerpt text NULL DEFAULT NULL,
				slug varchar(250) NOT NULL UNIQUE,
				password varchar(250) NULL DEFAULT NULL,
				format varchar(11) NOT NULL,
				visibility varchar(11) NOT NULL,
				status varchar(11) NOT NULL,
				sort int NULL DEFAULT 0,
				comment_status smallint NOT NULL DEFAULT 1,
				published_at timestamp NULL DEFAULT NULL,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				deleted_at timestamp NULL DEFAULT NULL,
				CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
			);

			CREATE INDEX idx_format_status_date ON posts (format, status, published_at, id);
			CREATE INDEX idx_slug ON posts (slug);
			CREATE INDEX idx_user_id ON posts (user_id);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE posts`)
	})

}
