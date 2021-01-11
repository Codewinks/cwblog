package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "9_create_settings_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE settings (
				id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
				key varchar(250) NOT NULL UNIQUE,
				value text NOT NULL,
				label varchar(250) NULL DEFAULT NULL,
				description text NULL DEFAULT NULL,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE settings`)
	})

}
