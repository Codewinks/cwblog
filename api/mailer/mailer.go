package mailer

import (
	"bytes"
	"fmt"
	"net/smtp"
	"os"
	"text/template"
)

type Config struct {
	To       []string
	From     string
	Subject  string
	Template string
	Body     string
	Params   interface{}
}

//SendMail
func SendMail(config Config) error {
	username := os.Getenv("MAIL_USERNAME")
	password := os.Getenv("MAIL_PASSWORD")
	smtpHost := os.Getenv("MAIL_HOST")
	smtpPort := os.Getenv("MAIL_PORT")

	//TODO: Add validation to ensure to, subject and template are specified
	if config.From == "" {
		config.From = os.Getenv("MAIL_FROM")
	}


	// Authentication.
	auth := smtp.PlainAuth("", username, password, smtpHost)

	//TODO: Add validation to verify template exists

	currentDir, err := os.Getwd()
	if err != nil {
		return err
	}

	t, err := template.ParseFiles(fmt.Sprintf("%s/mailer/%s", currentDir, config.Template))
	if err != nil {
		return err
	}

	var body bytes.Buffer

	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body.Write([]byte(fmt.Sprintf("Subject: %s \n%s\n\n", config.Subject, mimeHeaders)))

	t.Execute(&body, config.Params)

	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, config.From, config.To, body.Bytes())
	if err != nil {
		return err
	}

	return nil
}
