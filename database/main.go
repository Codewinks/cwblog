package database

import (
	"context"
	"fmt"
	//"io/ioutil"
	"os"
	//"path/filepath"
	//"sort"
	"strconv"
	"strings"
	"time"

	"github.com/codewinks/go-colors"
	"github.com/go-pg/migrations/v8"
	"github.com/go-pg/pg/v10"
)

//go:generate go-bindata -pkg pg -mode 0644 -modtime 499137600 -o db_migrations_generated.go schema/

type cw struct {
	db *pg.DB
}

func Migrate(args []string) (msg string, err error) {
	cmd := strings.Split(args[1], ":")
	args = append(cmd[1:], args[2:]...)

	if len(args) < 1 {
		args = append(args, "migrate")
	}

	var cw cw
	cw.db = pg.Connect(&pg.Options{
		Addr:     fmt.Sprintf("%s:%s",os.Getenv("DB_HOST"), os.Getenv("DB_PORT")),
		User: os.Getenv("DB_USERNAME"),
		Password: os.Getenv("DB_PASSWORD"),
		Database:  os.Getenv("DB_DATABASE"),
	})
	defer cw.db.Close()


	ctx := context.Background()
	if err := cw.db.Ping(ctx); err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %s", err))
	}

	migrations.SetTableName("_migrations")

	cw.db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

	oldVersion, newVersion, err := migrations.Run(cw.db, "init")
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}

	switch args[0] {
	case "fresh":
		err = cw.disableForeignKeyConstraints()
		err = cw.dropAllTables()
		err = cw.enableForeignKeyConstraints()

		oldVersion, newVersion, err = migrations.Run(cw.db, "init")
		if err != nil {
			return "", fmt.Errorf(err.Error())
		}

		oldVersion, newVersion, err = migrations.Run(cw.db, "up")
	case "refresh":
		oldVersion, newVersion, err = migrations.Run(cw.db, "reset")
		if err != nil {
			return "", fmt.Errorf(err.Error())
		}
		oldVersion, newVersion, err = migrations.Run(cw.db, "up")
	case "rollback":
		oldVersion, newVersion, err = migrations.Run(cw.db, "down")
	case "status":
		//err = cw.status()
	case "migrate":
		oldVersion, newVersion, err = migrations.Run(cw.db, "up")
	default:
		oldVersion, newVersion, err = migrations.Run(cw.db, args...)
	}
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}

	if newVersion != oldVersion {
		fmt.Printf("Migrated from version %d to %d\n", oldVersion, newVersion)
	} else {
		fmt.Println(colors.Green("Nothing to migrate."))
	}

	return
}

func Make(cmd string, name string) (msg string, err error) {
	switch cmd {
	case "migration":
		fmt.Println("Make Migration")
		timestamp := time.Now().UnixNano() / 1000000
		filename := fmt.Sprintf("%s_%s.sql", strconv.FormatInt(timestamp, 10), strings.ToLower(name))

		emptyFile, err := os.Create("database/migrations/" + filename)
		if err != nil {
			panic(err.Error())
		}

		emptyFile.Close()
		fmt.Printf("%s%-12s%s %s\n", colors.GREEN, "Created Migration:", colors.NC, filename)
	default:
		return "", fmt.Errorf(fmt.Sprintf("Command \"%s\" is not defined", cmd))
	}

	return
}

func migrateUp(db migrations.DB, migration string, query string) error {
	fmt.Printf("%s%-14s%s %s\n", colors.YELLOW, "Migrating:", colors.NC, migration)

	_, err := db.Exec(query)

	if err == nil {
		fmt.Printf("%s%-14s%s %s\n", colors.GREEN, "Migrated:", colors.NC, migration)
	}

	return err
}

func migrateDown(db migrations.DB, migration string, query string) error {
	fmt.Printf("%s%-14s%s %s\n", colors.YELLOW, "Rolling back:", colors.NC, migration)

	_, err := db.Exec(query)

	if err == nil {
		fmt.Printf("%s%-14s%s %s\n", colors.GREEN, "Rolled back:", colors.NC, migration)
	}

	return err
}

//
//func (cw *cw) runMigrations() (err error) {
//	err = db.createMigrationsTable()
//	if err != nil {
//		return err
//	}
//
//	// TODO: [ ] Create better migration diff check
//	count, err := db.countMigrations()
//	if err != nil {
//		return err
//	}
//
//	migrations, err := getMigrationFiles()
//
//	if count >= len(migrations) {
//		fmt.Println(colors.Green("Nothing to migrate."))
//		return nil
//	}
//
//	batch := db.getNextBatch()
//
//	for i, file := range migrations {
//		// skip running ones we've clearly already ran
//		if count > 0 {
//			count--
//			continue
//		}
//
//		cleanName := strings.TrimPrefix(file, "database/migrations/")
//
//		fmt.Printf("%s%-12s%s %s\n", colors.YELLOW, "Migrating:", colors.NC, cleanName)
//
//		migration, err := ioutil.ReadFile(file)
//		if err != nil {
//			return err
//		}
//
//		err = db.runMigration(i, migration)
//		if err != nil {
//			return err
//		}
//
//		err = db.recordMigration(cleanName, batch)
//		if err != nil {
//			return err
//		}
//
//		fmt.Printf("%s%-12s%s %s\n", colors.GREEN, "Migrated:", colors.NC, cleanName)
//	}
//
//	return nil
//}
//func getMigrationFiles() ([]string, error) {
//	files, err := filepath.Glob("database/migrations/*.sql")
//	if err != nil {
//		panic(err.Error())
//	}
//
//	sort.Strings(files)
//
//	return files, nil
//}
//
//func (cw *cw) getBatch() (batch int) {
//	rows := db.DB.QueryRow("SELECT MAX(batch) FROM migrations;")
//	rows.Scan(&batch)
//
//	return
//}
//
//func (cw *cw) getNextBatch() (batch int) {
//	rows := db.DB.QueryRow("SELECT MAX(batch)+1 FROM migrations;")
//	rows.Scan(&batch)
//
//	return
//}
//
func (cw *cw) dropAllTables() error {
	var allTables []string

	_, err := cw.db.Query(&allTables, `select tablename from pg_tables where schemaname='public'`)
	if err != nil {
		panic(err)
	}

	if len(allTables) > 0 {
		_, err = cw.db.Exec(fmt.Sprintf(`DROP TABLE %s CASCADE`, strings.Join(allTables, ",")))
		if err != nil {
			panic(err)
		}
	}

	fmt.Println(colors.Green("Dropped all tables successfully."))

	return err
}
//
//func (cw *cw) createMigrationsTable() error {
//	_, err := db.DB.Exec(`CREATE TABLE IF NOT EXISTS migrations (
//		id int(10) unsigned NOT NULL AUTO_INCREMENT,
//		migration varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
//		batch int(11) NOT NULL,
//		PRIMARY KEY (id)
//		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`)
//
//	return err
//}
//
//func (cw *cw) countMigrations() (int, error) {
//	row := db.DB.QueryRow(`SELECT count(id) FROM migrations;`)
//
//	var count int
//	err := row.Scan(&count)
//	if err != nil {
//		return 0, err
//	}
//
//	return count, nil
//}
//
//func (cw *cw) runMigration(num int, buf []byte) error {
//	_, err := db.DB.Exec(string(buf))
//	return err
//}
//
//func (cw *cw) recordMigration(name string, batch int) error {
//	_, err := db.DB.Query("INSERT INTO migrations (migration, batch) VALUES (?, ?);", name, batch)
//	return err
//}
//
func (cw *cw) enableForeignKeyConstraints() error {
	_, err := cw.db.Exec(`SET FOREIGN_KEY_CHECKS=1;`)
	return err
}

func (cw *cw) disableForeignKeyConstraints() error {
	_, err := cw.db.Exec(`SET FOREIGN_KEY_CHECKS=0;`)
	return err
}
//
//func (cw *cw) getMigrations() (map[string]int, error) {
//	var name string
//	var batch int
//	migrations := make(map[string]int)
//
//	rows, err := db.DB.Query(`SELECT migration, batch FROM migrations ORDER BY id DESC`)
//	if err != nil {
//		panic(err)
//	}
//
//	defer rows.Close()
//
//	for rows.Next() {
//		err = rows.Scan(&name, &batch)
//		if err != nil {
//			panic(err)
//		}
//
//		migrations[name] = batch
//	}
//
//	err = rows.Err()
//	if err != nil {
//		panic(err)
//	}
//
//	return migrations, nil
//}
//
//func (cw *cw) status() error {
//	migrations, err := getMigrationFiles()
//	if err != nil {
//		return err
//	}
//
//	currentMigrations, err := db.getMigrations()
//
//	var tableRows []string
//	var maxLength int
//
//	for _, file := range migrations {
//		name := strings.TrimPrefix(file, "database/migrations/")
//
//		if len(name) > maxLength {
//			maxLength = len(name)
//		}
//	}
//
//	for _, file := range migrations {
//		status := colors.Red("No")
//		batch := ""
//		name := strings.TrimPrefix(file, "database/migrations/")
//
//		if val, ok := currentMigrations[name]; ok {
//			status = colors.Green("Yes")
//			batch = strconv.Itoa(val)
//		}
//
//		tableRows = append(tableRows, fmt.Sprintf("| %s | %s | %s |", fmt.Sprintf("%-15s", status), fmt.Sprintf("%-*s", maxLength, name), fmt.Sprintf("%-5s", batch)))
//	}
//
//	table := fmt.Sprintf(`+------+%[1]s--+-------+
//| Ran? | %[2]s | Batch |
//+------+%[1]s--+-------+
//%[3]s
//+------+%[1]s--+-------+
//`, strings.Repeat("-", maxLength), fmt.Sprintf("%-*s", maxLength, "Migration"), strings.Join(tableRows, "\n"))
//
//	fmt.Printf(table)
//
//	return nil
//}
