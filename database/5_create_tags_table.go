package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "5_create_tags_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE tags (
				id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
				name varchar(250) NOT NULL UNIQUE,
				slug varchar(250) NOT NULL UNIQUE,
				description text NULL DEFAULT NULL,
				sort int NULL DEFAULT 0,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE tags`)
	})

}
