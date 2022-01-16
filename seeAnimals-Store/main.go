package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"muazwzxv/m/config"
	"muazwzxv/m/service"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	fmt.Println("hehe")
	app := fiber.New()

	if err := service.GetGormInstance().Migrate(); err != nil {
		panic(err)
	}

	go func() {
		if err := app.Listen(fmt.Sprintf(":%d", config.GetInstance().FetchServerPort())); err != nil {
			log.Panic(err)
		}
	}()

	c := make(chan os.Signal, 1)

	// Notify channel if interrup or termination signal is sent
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	_ = <-c // Block main thread until interrupt is received
	fmt.Println("Gracefully shutting down ....")
	_ = app.Shutdown()

	fmt.Println("Cleaning up task ........")

	service.GetGormInstance().GormShutDown()

	fmt.Println("Shitdown Complete !")

}

func setupMiddleware(app *fiber.App) {
	app.Use(recover.New())
	app.Use(logger.New())
	app.Server().MaxConnsPerIP = 1
}

func setupRouter(app *fiber.App) {
	v1 := app.Group("/api")

	v1.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello world")
	})
}
