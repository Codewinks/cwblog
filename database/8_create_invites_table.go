package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "8_create_invites_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE invites (
				id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
				email varchar(250) NOT NULL UNIQUE,
				role_id int NULL,
				expires_at timestamp NULL,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				CONSTRAINT fk_role_id FOREIGN KEY(role_id) REFERENCES roles(id) ON UPDATE CASCADE
			);
		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE invites`)
	})

}
