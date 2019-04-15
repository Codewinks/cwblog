package database

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/codewinks/cworm"
)

// Todo:
// - [ ] Add migrate rollback
// - [ ] Add migrate reset

//go:generate go-bindata -pkg pg -mode 0644 -modtime 499137600 -o db_migrations_generated.go schema/

var db *cworm.DB

func RunMigrations() (err error) {
	db, err = cworm.Connect(os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_DATABASE"))
	if err != nil {
		return err
	}

	defer db.DB.Close()

	batch := getNextBatch()

	err = verifyMigrationsTable()
	if err != nil {
		return err
	}

	count, err := countMigrations()
	if err != nil {
		return err
	}

	migrations, err := filepath.Glob("database/migrations/*.sql")
	if err != nil {
		panic(err.Error())
	}

	sort.Strings(migrations)

	if count >= len(migrations) {
		fmt.Println("Nothing to migrate.")
		return nil
	}

	fmt.Println("Running migrations...")

	for i, file := range migrations {
		// skip running ones we've clearly already ran
		if count > 0 {
			count--
			continue
		}
		cleanName := strings.TrimPrefix(file, "database/migrations/")

		fmt.Println(fmt.Sprintf("Migrating: %s", cleanName))

		migration, err := ioutil.ReadFile(file)
		if err != nil {
			return err
		}

		err = runMigration(i, migration)
		if err != nil {
			return err
		}

		err = recordMigration(cleanName, batch)
		if err != nil {
			return err
		}

		fmt.Println(fmt.Sprintf("Migrated: %s", cleanName))
	}

	return nil
}

func getNextBatch() (batch int) {
	rows := db.DB.QueryRow("SELECT MAX(batch)+1 FROM migrations;")
	rows.Scan(&batch)

	return batch
}

func verifyMigrationsTable() error {
	_, err := db.DB.Exec(`CREATE TABLE IF NOT EXISTS migrations (
		id int(10) unsigned NOT NULL AUTO_INCREMENT,
		migration varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
		batch int(11) NOT NULL,
		PRIMARY KEY (id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`)
	//Migration table created successfully.
	return err
}

func countMigrations() (int, error) {
	row := db.DB.QueryRow(`SELECT count(*) FROM migrations;`)

	var count int
	err := row.Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func runMigration(num int, buf []byte) error {
	_, err := db.DB.Exec(string(buf))
	return err
}

func recordMigration(name string, batch int) error {
	_, err := db.DB.Query("INSERT INTO migrations (migration, batch) VALUES (?, ?);", name, batch)
	return err
}
