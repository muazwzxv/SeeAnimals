package service

import (
	"fmt"
	"muazwzxv/m/config"
	"muazwzxv/m/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db GormInstance

type GormInstance struct {
	Orm *gorm.DB
}

func newGormInstance() GormInstance {

	config := config.GetInstance().FetchDatabaseConfig()
	dsn := fmt.Sprintf("%s:%s@(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.DatabaseName,
	)
	fmt.Println(dsn)

	if db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		// Skip default transaction to improve speed
		SkipDefaultTransaction: true,
		// Cache statements
		PrepareStmt: true,
	}); err != nil {
		// Panic
		panic(fmt.Sprintf("Failed to connect to database: \n %v", err))
	} else {
		return GormInstance{db}
	}
}

func GetGormInstance() *GormInstance {
	if !db.isInstantiated() {
		db = newGormInstance()
	}
	return &db
}

func (g *GormInstance) isInstantiated() bool {
	return g.Orm != nil
}

func (g *GormInstance) GormShutDown() error {

	if sql, err := g.Orm.DB(); err != nil {
		return err
	} else {
		sql.Close()
		return nil
	}
}

func (g *GormInstance) Migrate() error {

	if err := g.Orm.Debug().AutoMigrate(
		&model.Record{},
	); err != nil {
		return err
	}
	return nil
}
