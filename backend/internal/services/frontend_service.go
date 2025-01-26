package services

import (
	"net/http"
	"spiropoulos04/bookshop/backend/internal/config"
)

type FrontendService struct {
	Config config.FrontendConfig
}

func NewFrontendService(config *config.FrontendConfig) *FrontendService {
	return &FrontendService{
		Config: *config,
	}
}

func (fs *FrontendService) ServeStaticFiles(w http.ResponseWriter, r *http.Request) {
	// Serve static files from the React app build directory

	fsFileServer := http.FileServer(http.Dir(fs.Config.FrontendDir))
	fsFileServer.ServeHTTP(w, r)
}
