package model

import (
	"time"

	"gorm.io/gorm"
)

type Record struct {
	ID        uint `gorm:"primaryKey"`
	Class     string
	Accuracy  float64
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (r *Record) Create(gorm *gorm.DB) error {
	if err := gorm.Debug().Create(r).Error; err != nil {
		return err
	}

	return nil
}

func (r *Record) GetAll(gorm *gorm.DB) ([]Record, error) {
	var record []Record
	if err := gorm.Debug().Find(&record).Error; err != nil {
		return nil, err
	}
	return record, nil
}

func (r *Record) GetById(gorm *gorm.DB, id string) error {
	if res := gorm.Debug().Where("id = ?", id).First(r); res.Error != nil {
		return res.Error
	}
	return nil
}
