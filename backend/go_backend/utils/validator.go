package utils

import (
	"path/filepath"
	"strings"
)

// AllowedImageExtensions is the set of accepted ECG image file types.
var AllowedImageExtensions = map[string]bool{
	".png":  true,
	".jpg":  true,
	".jpeg": true,
}

// AllowedMIMETypes is the set of accepted content types.
var AllowedMIMETypes = map[string]bool{
	"image/png":  true,
	"image/jpeg": true,
}

// IsAllowedImageExtension checks if the filename has an allowed image extension.
func IsAllowedImageExtension(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	return AllowedImageExtensions[ext]
}

// IsAllowedMIMEType checks if the MIME type is in the allow-list.
func IsAllowedMIMEType(contentType string) bool {
	return AllowedMIMETypes[contentType]
}
