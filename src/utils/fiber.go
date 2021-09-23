package utils

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func CreateFiberApp() *fiber.App {
	options := fiber.Config{
		Prefork: true,
		AppName: "Crypthobin-ui",
	}

	app := fiber.New(options)
	app.Use(logger.New())

	if port, ok := os.LookupEnv("PORT"); ok {
		app.Listen(":" + port)
	} else {
		app.Listen(":8080")
	}

	return app
}
