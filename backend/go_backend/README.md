# ECG Backend Service

Production-ready Golang backend for the ECG Analysis System. Acts as the API gateway between the React frontend and the Python AI inference service.

---

## Architecture

```
┌──────────────────┐     HTTP/JSON     ┌──────────────────┐    HTTP/Multipart    ┌──────────────────┐
│                  │ ◄───────────────► │                  │ ◄──────────────────► │                  │
│  React Frontend  │                   │  Golang Backend  │                      │  Python AI Svc   │
│  (port 3000)     │                   │  (port 8080)     │                      │  (port 8000)     │
│                  │                   │                  │                      │                  │
│  • Upload ECG    │                   │  • Auth (JWT)    │                      │  • VGG16         │
│  • View results  │                   │  • Validation    │                      │  • ResNet34      │
│  • User mgmt     │                   │  • File proxy    │                      │  • DenseNet121   │
│                  │                   │  • Logging       │                      │  • Ensemble      │
└──────────────────┘                   └──────────────────┘                      └──────────────────┘
```

### Request Flow

```
1. React → POST /api/ecg/predict (with JWT + image file)
2. Go Backend validates JWT token
3. Go Backend validates file (type, size)
4. Go Backend forwards image → Python AI service POST /predict
5. AI service runs ensemble inference (3 models)
6. AI service returns JSON prediction
7. Go Backend enriches response with timestamp
8. Go Backend returns clean JSON → React
```

---

## Folder Structure

```
go_backend/
├── main.go                 # Application entry point
├── go.mod                  # Go module definition
├── go.sum                  # Dependency checksums
├── .env                    # Environment variables (local dev)
├── .env.example            # Template for environment variables
│
├── configs/
│   └── config.go           # Centralized configuration loader
│
├── controllers/
│   ├── auth_controller.go  # Registration & login handlers
│   ├── ecg_controller.go   # ECG prediction handler
│   └── health_controller.go # Health check handler
│
├── middleware/
│   ├── auth.go             # JWT authentication middleware
│   ├── cors.go             # CORS configuration
│   └── logger.go           # Request logging middleware
│
├── models/
│   ├── user.go             # User model & auth DTOs
│   ├── ecg.go              # ECG prediction models
│   └── response.go         # Standard API response envelope
│
├── repositories/
│   └── user_repository.go  # User data access (in-memory, DB-ready interface)
│
├── routes/
│   └── routes.go           # Route registration & dependency injection
│
├── services/
│   ├── auth_service.go     # Authentication business logic
│   └── ecg_service.go      # AI service communication
│
├── storage/
│   └── uploads/            # Uploaded file storage (gitignored)
│
└── utils/
    ├── jwt.go              # JWT token generation & validation
    ├── password.go         # bcrypt hashing utilities
    ├── response.go         # Response helper functions
    └── validator.go        # File validation utilities
```

### Layer Responsibilities

| Layer | Purpose |
|-------|---------|
| **controllers/** | HTTP request/response handling — parse input, call service, format output |
| **services/** | Business logic — auth flow, AI service communication |
| **repositories/** | Data access abstraction — currently in-memory, swappable to PostgreSQL |
| **models/** | Domain models and DTOs — shared across layers |
| **middleware/** | Cross-cutting concerns — auth, CORS, logging |
| **utils/** | Stateless helpers — JWT, hashing, validation |
| **configs/** | Environment-based configuration |

---

## Installation

### Prerequisites

- **Go** 1.21+ ([download](https://go.dev/dl/))
- **Python AI service** running on port 8000 (see `../ai_service/`)
- (Optional) **PostgreSQL** for future database integration

### Steps

```bash
# 1. Navigate to the backend directory
cd backend/go_backend

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your settings
nano .env   # or use any editor

# 4. Install dependencies
go mod tidy

# 5. Build
go build -o ecg-backend .

# 6. Run
./ecg-backend
```

Or run directly without building:

```bash
go run main.go
```

### Expected Startup Output

```
[WARN] No .env file found — using system environment variables
═══════════════════════════════════════════════════
  ECG BACKEND SERVICE — development
  Listening on :8080
  AI Service  → http://localhost:8000
═══════════════════════════════════════════════════
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_ENV` | `development` | Environment: `development` / `production` |
| `APP_PORT` | `8080` | Server port |
| `JWT_SECRET` | `change-me-in-production` | HMAC secret for JWT signing |
| `JWT_EXPIRATION_HOURS` | `24` | Token lifetime in hours |
| `AI_SERVICE_URL` | `http://localhost:8000` | Python AI service URL |
| `AI_SERVICE_TIMEOUT_SECONDS` | `30` | HTTP timeout for AI calls |
| `MAX_UPLOAD_SIZE_MB` | `10` | Max file upload size |
| `UPLOAD_DIR` | `./storage/uploads` | Upload directory path |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin (React) |
| `DATABASE_URL` | *(empty)* | PostgreSQL connection string (future) |

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Health check (backend + AI service) |
| `POST` | `/api/auth/register` | ❌ | Create new user account |
| `POST` | `/api/auth/login` | ❌ | Login & get JWT token |
| `POST` | `/api/ecg/predict` | ✅ JWT | Upload ECG image & get prediction |

---

### `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "Health check",
  "data": {
    "backend": "healthy",
    "ai_service": "healthy"
  }
}
```

---

### `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "doctor@hospital.com",
  "name": "Dr. Smith",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "doctor@hospital.com",
      "name": "Dr. Smith",
      "created_at": "2026-05-20T15:00:00Z",
      "updated_at": "2026-05-20T15:00:00Z"
    }
  }
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": "Invalid request: Key: 'RegisterRequest.Email' Error:Field validation for 'Email' failed on the 'email' tag"
}
```

---

### `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "doctor@hospital.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "doctor@hospital.com",
      "name": "Dr. Smith",
      "created_at": "2026-05-20T15:00:00Z",
      "updated_at": "2026-05-20T15:00:00Z"
    }
  }
}
```

---

### `POST /api/ecg/predict`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: multipart/form-data
```

**Body:** `form-data`
| Key | Type | Value |
|-----|------|-------|
| `file` | File | ECG image (PNG/JPG/JPEG, max 10MB) |

**Response (200):**
```json
{
  "success": true,
  "message": "ECG analysis completed",
  "data": {
    "prediction": "Myocardial_Infarction",
    "confidence": 78.33,
    "features": {
      "HR": 80.5,
      "RR": 0.87,
      "PR": 0.12,
      "QRS": 0.16,
      "QT": 0.36,
      "QTc": 0.42,
      "AXIS": 15.1,
      "RV5": 0.93,
      "SV1": 0.95,
      "R_plus_S": 1.94
    },
    "timestamp": "2026-05-20T15:30:00Z"
  }
}
```

---

## Testing with Postman

### Step 1: Register

1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/register`
3. **Body → raw → JSON:**
```json
{
  "email": "test@ecg.com",
  "name": "Test User",
  "password": "test123456"
}
```
4. Copy the `token` from the response.

### Step 2: Login (alternative)

1. **Method:** POST
2. **URL:** `http://localhost:8080/api/auth/login`
3. **Body → raw → JSON:**
```json
{
  "email": "test@ecg.com",
  "password": "test123456"
}
```

### Step 3: Predict ECG

1. **Method:** POST
2. **URL:** `http://localhost:8080/api/ecg/predict`
3. **Headers → Authorization:** `Bearer <your_token>`
4. **Body → form-data:**
   - Key: `file` (select "File" type)
   - Value: Select an ECG image
5. Click **Send**

### cURL Examples

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ecg.com","name":"Test User","password":"test123456"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ecg.com","password":"test123456"}'

# Predict (replace <TOKEN> with actual JWT)
curl -X POST http://localhost:8080/api/ecg/predict \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/ecg_image.png"

# Health check
curl http://localhost:8080/api/health
```

---

## JWT Authentication

### Flow

```
1. Client sends POST /api/auth/login with email + password
2. Server validates credentials
3. Server returns signed JWT token (HS256, 24h expiry)
4. Client stores token (localStorage / cookie)
5. Client sends token in Authorization header for protected routes
6. Auth middleware validates token on every request
7. User ID and email are extracted and injected into request context
```

### Token Structure

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "doctor@hospital.com",
  "exp": 1716300000,
  "iat": 1716213600,
  "iss": "ecg-backend"
}
```

### Security Notes

- **Never** commit your `JWT_SECRET` to version control
- Use a strong, random secret in production (32+ characters)
- Consider refresh tokens for long-lived sessions
- Set `Secure` and `HttpOnly` flags if using cookies

---

## File Upload Flow

```
1. React frontend sends multipart/form-data with ECG image
2. Gin parses the upload (limited to MAX_UPLOAD_SIZE_MB)
3. Controller validates:
   - File exists in "file" form field
   - Extension is .png, .jpg, or .jpeg
   - File size ≤ 10 MB
4. ECG service opens the file and forwards it as multipart to AI service
5. AI service processes and returns prediction
6. Backend returns enriched JSON to frontend
```

> **Note:** Currently, the image is streamed directly to the AI service without saving to disk. For audit trails, enable saving to `storage/uploads/` before forwarding.

---

## AI Service Connection

The Go backend communicates with the Python AI service using standard HTTP:

| Setting | Value |
|---------|-------|
| Protocol | HTTP |
| Method | POST multipart/form-data |
| Endpoint | `{AI_SERVICE_URL}/predict` |
| Timeout | 30 seconds (configurable) |
| Health | `{AI_SERVICE_URL}/health` |

### Startup Checklist

1. Start the AI service first: `cd ai_service && uvicorn app:app --port 8000`
2. Verify it's running: `curl http://localhost:8000/health`
3. Start the Go backend: `cd go_backend && go run main.go`
4. Verify integration: `curl http://localhost:8080/api/health`

---

## Future Database Integration

The codebase is designed for easy PostgreSQL integration:

### 1. Repository Interface Pattern

```go
// Already defined in repositories/user_repository.go
type UserRepository interface {
    Create(user *models.User) error
    FindByEmail(email string) (*models.User, error)
    FindByID(id string) (*models.User, error)
}
```

### 2. To Add PostgreSQL

1. Add `gorm.io/gorm` and `gorm.io/driver/postgres` to `go.mod`
2. Create `repositories/postgres_user_repository.go` implementing `UserRepository`
3. Update `routes/routes.go` to inject the Postgres repo instead of in-memory
4. Add migration files in a `migrations/` directory

### 3. ECG Record Storage

The `models/ecg.go` already includes `ECGRecord` for storing predictions:

```go
type ECGRecord struct {
    ID        string              `json:"id"`
    UserID    string              `json:"user_id"`
    ImagePath string              `json:"image_path"`
    Result    ECGPredictionResult `json:"result"`
    CreatedAt time.Time           `json:"created_at"`
}
```

---

## Error Handling Strategy

All API responses use a consistent envelope:

```json
// Success
{
  "success": true,
  "message": "Description of what happened",
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Description of what went wrong"
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Successful request |
| `201` | Resource created (register) |
| `400` | Validation error (bad input) |
| `401` | Unauthorized (missing/invalid JWT) |
| `409` | Conflict (duplicate email) |
| `500` | Internal server error |

### Error Flow

```
Controller → validate input → return 400 if invalid
Controller → call service → return service error
Service → call repository → return repo error
Service → call AI service → return formatted error
Recovery middleware → catch panics → return 500
```

---

## Logging Strategy

### Request Logging

Every HTTP request is logged with:
```
[GET] /api/health ? → 200 (1.2ms) from 127.0.0.1
```

### AI Service Logging

AI service calls include status and latency:
```
[AI] Response status=200  latency=145ms
[ECG] Prediction result: Myocardial_Infarction (78.33%)
```

### Production Recommendations

- Use structured JSON logging (e.g., `zerolog` or `zap`)
- Ship logs to ELK stack or CloudWatch
- Add request IDs for tracing
- Log user IDs for audit trails

---

## Docker Setup

### Dockerfile

```dockerfile
# ── Build Stage ───────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o ecg-backend .

# ── Run Stage ─────────────────────────────────────
FROM alpine:3.19

RUN apk --no-cache add ca-certificates
WORKDIR /app

COPY --from=builder /app/ecg-backend .
COPY .env.example .env

EXPOSE 8080

CMD ["./ecg-backend"]
```

### Docker Compose (full stack)

```yaml
version: "3.9"

services:
  ai-service:
    build: ../ai_service
    ports:
      - "8000:8000"
    volumes:
      - ../ai_service/Models:/app/Models
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]

  go-backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - APP_ENV=production
      - APP_PORT=8080
      - JWT_SECRET=${JWT_SECRET}
      - AI_SERVICE_URL=http://ai-service:8000
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      - ai-service

  # postgres:
  #   image: postgres:16-alpine
  #   environment:
  #     POSTGRES_DB: ecg_db
  #     POSTGRES_USER: ecg_user
  #     POSTGRES_PASSWORD: ${DB_PASSWORD}
  #   volumes:
  #     - pgdata:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   pgdata:
```

---

## Nginx Reverse Proxy

### Configuration

```nginx
upstream go_backend {
    server 127.0.0.1:8080;
}

upstream ai_service {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name ecg.yourdomain.com;

    # Frontend (React)
    location / {
        root /var/www/ecg-frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Go Backend API
    location /api/ {
        proxy_pass http://go_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # File upload
        client_max_body_size 10M;

        # Timeouts
        proxy_connect_timeout 10s;
        proxy_read_timeout 60s;
    }

    # AI Service (internal only — block external access)
    # location /ai/ {
    #     deny all;
    # }
}
```

### SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d ecg.yourdomain.com
```

---

## Production Deployment

### Checklist

- [ ] Set `APP_ENV=production` (enables Gin release mode)
- [ ] Generate strong `JWT_SECRET` (use `openssl rand -hex 32`)
- [ ] Set up PostgreSQL and update `DATABASE_URL`
- [ ] Configure Nginx with SSL
- [ ] Set up Docker + Docker Compose
- [ ] Enable rate limiting (nginx or middleware)
- [ ] Set up log aggregation
- [ ] Configure health check monitoring
- [ ] Set up backup strategy for database
- [ ] Enable CORS with specific origins (not `*`)

### Security Best Practices

| Practice | Status |
|----------|--------|
| bcrypt password hashing (cost=12) | ✅ |
| JWT with HMAC-SHA256 | ✅ |
| CORS middleware | ✅ |
| File type validation | ✅ |
| File size limits | ✅ |
| Input validation (Gin binding) | ✅ |
| Panic recovery middleware | ✅ |
| Password never in JSON response | ✅ |
| Environment-based secrets | ✅ |
| Rate limiting | ⬜ Add in production |
| HTTPS enforcement | ⬜ Via Nginx/LB |
| Request ID tracing | ⬜ Add for observability |
| SQL injection prevention | ⬜ Via parameterized queries (with DB) |

---

## Running the Full Stack

```bash
# Terminal 1 — AI Service
cd backend/ai_service
source venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8000

# Terminal 2 — Go Backend
cd backend/go_backend
go run main.go

# Terminal 3 — React Frontend (future)
cd frontend
npm run dev
```
