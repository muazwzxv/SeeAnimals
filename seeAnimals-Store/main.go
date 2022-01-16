package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"muazwzxv/m/config"
	"muazwzxv/m/controller"
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

	setupMiddleware(app)

	setupRouter(app)

	c := make(chan os.Signal, 1)
	// Notify channel if interrup or termination signal is sent
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {

		_ = <-c
		fmt.Println("Gracefully shutting down ....")
		_ = app.Shutdown()

	}()

	if err := app.Listen(fmt.Sprintf(":%d", config.GetInstance().FetchServerPort())); err != nil {
		log.Panic(err)
	}

	fmt.Println("Cleaning up task ........")

	service.GetGormInstance().GormShutDown()

	fmt.Println("Shutdown Complete !")

}

func setupMiddleware(app *fiber.App) {
	app.Use(recover.New())
	app.Use(logger.New())
	//app.Server().MaxConnsPerIP = 1
}

func setupRouter(app *fiber.App) {
	v1 := app.Group("/api")

	recordRepository := controller.NewRecordController()
	v1.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello world")
	})
	v1.Get("/records", recordRepository.GetAll)
	v1.Get("/record/:id", recordRepository.GetById)
	v1.Post("/record", recordRepository.Create)
}
