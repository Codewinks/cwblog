package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "4_create_categories_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE categories (
				id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
				name varchar(250) NOT NULL,
				slug varchar(250) NOT NULL,
				description text NULL DEFAULT NULL,
				parent_id uuid NULL DEFAULT NULL,
				visibility varchar(11) NOT NULL,
				sort int NULL DEFAULT 0,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE (slug, parent_id)
			);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE categories`)
	})

}
