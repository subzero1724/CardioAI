package services

import (
	"ecg-backend/configs"
	"ecg-backend/models"
	"ecg-backend/repositories"
	"ecg-backend/utils"
	"errors"
)

// AuthService handles user registration and login business logic.
type AuthService struct {
	userRepo repositories.UserRepository
	cfg      *configs.Config
}

// NewAuthService creates a new AuthService.
func NewAuthService(repo repositories.UserRepository, cfg *configs.Config) *AuthService {
	return &AuthService{
		userRepo: repo,
		cfg:      cfg,
	}
}

// Register creates a new user account and returns an auth token.
func (s *AuthService) Register(req *models.RegisterRequest) (*models.AuthResponse, error) {
	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Create user
	user := &models.User{
		Email:    req.Email,
		Name:     req.Name,
		Password: hashedPassword,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// Generate JWT
	token, err := utils.GenerateToken(user.ID, user.Email, s.cfg.JWTSecret, s.cfg.JWTExpiration)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

// Login authenticates a user and returns an auth token.
func (s *AuthService) Login(req *models.LoginRequest) (*models.AuthResponse, error) {
	// Find user
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Verify password
	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, errors.New("invalid email or password")
	}

	// Generate JWT
	token, err := utils.GenerateToken(user.ID, user.Email, s.cfg.JWTSecret, s.cfg.JWTExpiration)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}
