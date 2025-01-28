# Backend Builder
FROM golang:1.23-alpine AS backend-builder

WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend ./
RUN go build -o server ./cmd/main.go

# Frontend Builder
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Final Stage
FROM golang:1.23-alpine

WORKDIR /app

# Copy backend artifacts
COPY --from=backend-builder /app/server .
COPY --from=backend-builder /app/internal /app/internal

# Copy frontend build artifacts
COPY --from=frontend-builder /frontend/dist ./frontend

# Copy the .env file
COPY backend/.env .  

# Expose the port for the server
EXPOSE 8080

# Start the application
CMD ["./server"]
