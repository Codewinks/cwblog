package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/codewinks/cwblog/database"
	"github.com/codewinks/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	if len(os.Args) == 1 {
		showHelp()
		os.Exit(0)
	}

	cmd := strings.Split(os.Args[1], ":")

	switch cmd[0] {
	case "help":
	case "--help":
	case "-h":
		showHelp()
	case "migrate":
		if len(cmd) == 1 {
			if err := database.RunMigrations(); err != nil {
				panic(err)
			}
			break
		}

		switch cmd[1] {
		case "reset":
		case "rollback":
		case "status":
		default:
			fmt.Printf("Command \"%s\" is not defined\n\nAvailable commands:\n  migrate\n  migrate:reset\n  migrate:rollback\n  migrate:status\n\n", cmd[1])
		}

	default:
		fmt.Printf("Command \"%s\" is not defined\n", cmd[0])
	}

	os.Exit(0)
}

func showHelp() {
	fmt.Println(`CWBlog 0.0.1

Usage:
  command [options]

Available commands:
  migrate
    migrate:reset	Reset and re-run all migrations
    migrate:rollback	Rollback the last database migration
    migrate:status	Show the status of each migration

`)
}
