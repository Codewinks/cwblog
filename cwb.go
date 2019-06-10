package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/codewinks/cworm"
	"github.com/codewinks/go-colors"
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
	var msg string
	var run string

	switch cmd[0] {
	case "help":
	case "--help":
	case "-h":
		showHelp()
	case "migrate":
		if len(cmd) == 1 {
			run = cmd[0]
		} else {
			run = cmd[1]
		}

		if msg, err = cworm.Migrate(run); err != nil {
			fmt.Println(colors.Red(err.Error()))
			break
		}

		print(msg)

	default:
		colors.Red(fmt.Sprintf("Command \"%s\" is not defined", cmd[0]))
		showHelp()
	}

	os.Exit(0)
}

func showHelp() {
	fmt.Printf(`%[4]sCWBlog 0.0.1 %[1]s

%[2]sUsage:%[1]s
  command [options]

%[2]sAvailable commands:%[1]s
    %[3]shelp, --help, -h%[1]s	Displays this help menu
	
  %[2]smigrate%[1]s
    %[3]smigrate%[1]s		Run the database migrations
    %[3]smigrate:fresh%[1]s	Drop all tables and re-run all migrations
    %[3]smigrate:refresh%[1]s	Reset and re-run all migrations		(coming soon)
    %[3]smigrate:reset%[1]s	Rollback all database migrations	(coming soon)
    %[3]smigrate:rollback%[1]s	Rollback the last database migration	(coming soon)
    %[3]smigrate:status%[1]s	Show the status of each migration
	
  %[2]smake%[1]s
    %[3]smake:migration%[1]s	Create a new migration file

`, colors.NC, colors.YELLOW, colors.GREEN, colors.CYANBOLD)
}
