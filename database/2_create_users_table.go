package database

import "github.com/go-pg/migrations/v8"

func init() {
	migration := "2_create_users_table.go"

	migrations.MustRegisterTx(func(db migrations.DB) error {
		return migrateUp(db, migration, `
			CREATE TABLE users (
				id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
				uid char(36) NOT NULL UNIQUE,
				first_name varchar(250) NOT NULL,
				last_name varchar(250) NULL,
				nickname varchar(250) NULL DEFAULT NULL,
				email varchar(100) NOT NULL UNIQUE,
				avatar varchar(250) NULL,
				timezone varchar(100) NULL DEFAULT 'UTC',
				role_id int NULL,
				email_verified boolean NULL DEFAULT false,
				created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				CONSTRAINT fk_role_id FOREIGN KEY(role_id) REFERENCES roles(id) ON UPDATE CASCADE
			);

		`)
	}, func(db migrations.DB) error {
		return migrateDown(db, migration, `DROP TABLE users`)
	})

}
