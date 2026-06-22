package repositories

import (
	"errors"
	"sync"
	"time"

	"ecg-backend/models"

	"github.com/google/uuid"
)

// ──────────────────────────────────────────────────────────────────────────────
// In-Memory User Repository
// Replace with PostgreSQL implementation when database is integrated.
// ──────────────────────────────────────────────────────────────────────────────

// UserRepository defines the interface for user data access.
type UserRepository interface {
	Create(user *models.User) error
	FindByEmail(email string) (*models.User, error)
	FindByID(id string) (*models.User, error)
}

// InMemoryUserRepo stores users in memory (development only).
type InMemoryUserRepo struct {
	mu    sync.RWMutex
	users map[string]*models.User // key = ID
	email map[string]string       // email → ID lookup
}

// NewInMemoryUserRepo creates a new in-memory user repository.
func NewInMemoryUserRepo() *InMemoryUserRepo {
	return &InMemoryUserRepo{
		users: make(map[string]*models.User),
		email: make(map[string]string),
	}
}

func (r *InMemoryUserRepo) Create(user *models.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Check duplicate email
	if _, exists := r.email[user.Email]; exists {
		return errors.New("email already registered")
	}

	user.ID = uuid.New().String()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	r.users[user.ID] = user
	r.email[user.Email] = user.ID

	return nil
}

func (r *InMemoryUserRepo) FindByEmail(email string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	id, exists := r.email[email]
	if !exists {
		return nil, errors.New("user not found")
	}

	return r.users[id], nil
}

func (r *InMemoryUserRepo) FindByID(id string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, exists := r.users[id]
	if !exists {
		return nil, errors.New("user not found")
	}

	return user, nil
}
