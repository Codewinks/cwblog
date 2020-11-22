package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "1_create_roles_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE roles (
				id SERIAL PRIMARY KEY,
				name varchar(250) NOT NULL UNIQUE,
				meta JSON NULL,
				permissions JSON NULL,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);

			INSERT INTO roles (name, permissions) VALUES
				('Super Admin', '{"super_admin": true}'),
				('Admin', '{"admin": true}'),
				('Moderator', '{"moderator": true}'),
				('Editor', '{"editor": true}'),
				('Guest', null);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE roles`)
	})

}
