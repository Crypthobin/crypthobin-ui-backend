package main

import (
	"github.com/Crypthobin/crypthobin-ui-backend/src/routers"
	"github.com/Crypthobin/crypthobin-ui-backend/src/utils"
)

func main() {
	app := utils.CreateFiberApp()

	app.Post("/accounts", routers.CreateAccount)
}
