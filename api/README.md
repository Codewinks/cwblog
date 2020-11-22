1. Make sure migrations are ran and up to date.
    ```
    From the root directory you can use the provided cli: go run cwb.go
    ```
2. Install all Go libraries:
    ```
    go get github.com/codewinks/cworm
    go get github.com/codewinks/go-colors 
    go get github.com/codewinks/godotenv
    go get github.com/codewinks/cwblog 
    go get github.com/auth0/go-jwt-middleware
    go get github.com/dgrijalva/jwt-go
    go get github.com/go-chi/chi
    ```
2. go run main.go

Add `AUTH_CHECK_URL` to Auth0 Application Advanced settings:
http://a2f26fa01aa9.ngrok.io/v1/auth/check

This is used in conjuction with the `userLoginSignup` rule to check if a user can signup. 