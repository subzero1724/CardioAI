"""
Preprocessing — Must match train_test.py test_transform exactly
================================================================
Pipeline:
  1. Resize to 224×224
  2. Convert to tensor
  3. Normalize with ImageNet mean/std
"""

import torch
from PIL import Image
from torchvision import transforms

# Exact replication of test_transform from train_test.py
_inference_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


def preprocess_image(
    image: Image.Image,
    device: torch.device,
) -> torch.Tensor:
    """
    Preprocess a PIL image for model inference.

    Args:
        image:  PIL Image (any mode — will be converted to RGB).
        device: Target torch device.

    Returns:
        Tensor of shape (1, 3, 224, 224) on the target device.
    """
    image = image.convert("RGB")
    tensor = _inference_transform(image)
    return tensor.unsqueeze(0).to(device)
