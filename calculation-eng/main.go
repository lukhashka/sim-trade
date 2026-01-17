package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	// Створюємо роутер
	r := gin.Default()

	// Простий ендпоінт для перевірки
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Calculation Engine is running!",
			"status":  "ready_for_heavy_math",
		})
	})

	// Запуск на порту 8080
	r.Run(":8080") 
}