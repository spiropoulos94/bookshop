package config

import "time"

type ServerConfig struct {
	Hostname      string
	Port          int
	ServerAddress string
	WriteTimeout  time.Duration
	ReadTimeout   time.Duration
	IdleTimeout   time.Duration

	Environment string
}
