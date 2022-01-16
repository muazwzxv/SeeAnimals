package controller

import (
	"log"
	"muazwzxv/m/model"
	"muazwzxv/m/service"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type RecordRepository struct {
	gorm *gorm.DB
}

func NewRecordController() *RecordRepository {
	db := service.GetGormInstance()
	return &RecordRepository{gorm: db.Orm}
}

func (r *RecordRepository) GetAll(ctx *fiber.Ctx) error {
	var record model.Record
	if records, err := record.GetAll(r.gorm); err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Something wrong happened",
			"error":   err.Error,
		})
	} else {
		return ctx.Status(http.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "All records",
			"data":    records,
		})
	}
}

func (r *RecordRepository) GetById(ctx *fiber.Ctx) error {
	var record model.Record
	if err := record.GetById(r.gorm, ctx.Params("id")); err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Not found",
			"error":   err.Error,
		})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    record,
	})
}

func (r *RecordRepository) Create(ctx *fiber.Ctx) error {

	var record model.Record

	if err := ctx.BodyParser(&record); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Bad request",
			"error":   err.Error,
		})
	}

	log.Println(record)
	err := record.Create(r.gorm)
	if err != nil {
		return ctx.Status(http.StatusConflict).JSON(fiber.Map{
			"success": false,
			"message": "Not found",
			"error":   err.Error,
		})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Created",
		"data":    record,
	})

}
