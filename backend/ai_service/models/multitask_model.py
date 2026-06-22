"""
MultiTaskModel — Exact architecture from train_test.py
=======================================================
This class MUST remain identical to the training notebook
so that saved .pth state_dicts load without errors.

Changes here will break weight compatibility!
"""

import torch
import torch.nn as nn
from torchvision import models


class MultiTaskModel(nn.Module):
    """
    Multitask ECG model with:
      • Classification head  → 3 classes
      • Regression head      → 10 ECG features

    Supported backbones: resnet34 | vgg16 | densenet121
    """

    def __init__(
        self,
        backbone_name: str,
        num_classes: int = 3,
        num_features: int = 10,
    ):
        super().__init__()

        self.backbone_name = backbone_name

        # =================================================
        # RESNET34
        # =================================================
        if backbone_name == "resnet34":

            backbone = models.resnet34(weights=None)

            in_features = backbone.fc.in_features

            self.feature_extractor = nn.Sequential(
                *list(backbone.children())[:-1]
            )

        # =================================================
        # VGG16
        # =================================================
        elif backbone_name == "vgg16":

            backbone = models.vgg16(weights=None)

            self.feature_extractor = backbone.features

            self.avgpool = backbone.avgpool

            self.vgg_classifier = nn.Sequential(
                *list(backbone.classifier.children())[:-1]
            )

            in_features = 4096

        # =================================================
        # DENSENET121
        # =================================================
        elif backbone_name == "densenet121":

            backbone = models.densenet121(weights=None)

            self.feature_extractor = backbone.features

            in_features = backbone.classifier.in_features

        else:
            raise ValueError(
                f"Unsupported backbone: {backbone_name}. "
                f"Choose from: resnet34, vgg16, densenet121"
            )

        # =================================================
        # OUTPUT HEADS
        # =================================================
        self.classifier = nn.Linear(in_features, num_classes)

        self.regressor = nn.Linear(in_features, num_features)

    def forward(self, x: torch.Tensor):

        # =================================================
        # RESNET34
        # =================================================
        if self.backbone_name == "resnet34":

            x = self.feature_extractor(x)

            x = torch.flatten(x, 1)

        # =================================================
        # VGG16
        # =================================================
        elif self.backbone_name == "vgg16":

            x = self.feature_extractor(x)

            x = self.avgpool(x)

            x = torch.flatten(x, 1)

            x = self.vgg_classifier(x)

        # =================================================
        # DENSENET121
        # =================================================
        elif self.backbone_name == "densenet121":

            x = self.feature_extractor(x)

            x = nn.functional.relu(x)

            x = nn.functional.adaptive_avg_pool2d(x, (1, 1))

            x = torch.flatten(x, 1)

        class_output = self.classifier(x)

        regression_output = self.regressor(x)

        return class_output, regression_output
