<div align="center">

# 🫀 CardioAI

### Intelligent ECG Analysis Platform with Multi-Task Deep Learning Ensemble

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Go](https://img.shields.io/badge/Go-1.25+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

**CardioAI** is a full-stack AI-powered platform that performs automated ECG image classification and clinical parameter extraction using an ensemble of deep learning models. Built as a thesis/skripsi project, it demonstrates end-to-end machine learning deployment — from model training and evaluation to production-ready web application.

<br/>

[Features](#-features) •
[Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[Model Details](#-model-details) •
[Dataset](#-dataset) •
[Results](#-results) •
[Project Structure](#-project-structure) •
[License](#-license)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🧠 AI & Deep Learning
- **Multi-Task Learning** — Simultaneous classification + regression in a single forward pass
- **Ensemble Soft Voting** — Combines VGG16, ResNet34, DenseNet121 for robust predictions
- **3-Class ECG Classification** — Normal, Myocardial Infarction, Other Heart Disease
- **Clinical Parameter Extraction** — Predicts 10 ECG features (HR, RR, PR, QRS, QT, QTc, AXIS, RV5, SV1, R+S)
- **5-Fold Cross Validation** — Rigorous model validation with stratified splits

</td>
<td width="50%">

### 🌐 Full-Stack Application
- **Modern React UI** — Interactive analyzer with real-time ECG upload & results
- **Go Backend API** — High-performance REST API with JWT authentication
- **FastAPI AI Service** — Dedicated inference microservice with GPU support
- **Responsive Design** — Dark/Light theme with smooth animations
- **Drag & Drop Upload** — Intuitive ECG image upload interface

</td>
</tr>
</table>

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CardioAI Platform                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐  │
│  │             │     │                  │     │                  │  │
│  │   Frontend  │────▶│   Go Backend     │────▶│  AI Service      │  │
│  │   (React)   │◀────│   (Gin Router)   │◀────│  (FastAPI)       │  │
│  │             │     │                  │     │                  │  │
│  │  • Vite     │     │  • JWT Auth      │     │  • VGG16         │  │
│  │  • TailwindCSS    │  • CORS          │     │  • ResNet34      │  │
│  │  • Recharts │     │  • File Upload   │     │  • DenseNet121   │  │
│  │  • Motion   │     │  • Proxy to AI   │     │  • Soft Voting   │  │
│  │             │     │                  │     │  • GPU/CPU Auto  │  │
│  └─────────────┘     └──────────────────┘     └──────────────────┘  │
│    :3000                :8080                    :8000               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Upload ──▶ React UI ──▶ Go Backend ──▶ FastAPI AI Service
                                                    │
                                          ┌─────────┴─────────┐
                                          │  Preprocessing     │
                                          │  Resize 224×224    │
                                          │  ImageNet Normalize│
                                          └─────────┬─────────┘
                                                    │
                                    ┌───────────────┼───────────────┐
                                    ▼               ▼               ▼
                                 VGG16          ResNet34       DenseNet121
                                    │               │               │
                                    ▼               ▼               ▼
                              ┌──────────────────────────────────────┐
                              │     Ensemble Soft Voting             │
                              │  P(c) = Σ P_model(c) / 3            │
                              ├──────────────────────────────────────┤
                              │  Classification  │  Regression       │
                              │  ─────────────── │  ────────────     │
                              │  • Normal        │  • HR, RR, PR    │
                              │  • MI            │  • QRS, QT, QTc  │
                              │  • OHD           │  • AXIS, RV5     │
                              │                  │  • SV1, R+S      │
                              └──────────────────┴──────────────────┘
                                                    │
                                                    ▼
                                            JSON Response ──▶ React UI
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS 4 | Interactive web UI |
| **UI Components** | Lucide React, Recharts, Motion (Framer) | Icons, charts, animations |
| **Backend API** | Go 1.25, Gin, golang-jwt, bcrypt | REST API, auth, routing |
| **AI Service** | Python 3.10+, FastAPI, Uvicorn | Model inference endpoint |
| **Deep Learning** | PyTorch 2.2+, TorchVision | Model training & inference |
| **ML Tools** | scikit-learn, NumPy, Pandas | Preprocessing, evaluation |
| **Visualization** | Matplotlib, Seaborn | Training plots, ROC curves |
| **Environment** | Google Colab (training), Docker-ready | GPU training, deployment |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x & **npm**
- **Go** ≥ 1.25
- **Python** ≥ 3.10
- **CUDA** (optional, for GPU inference)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CardioAI.git
cd CardioAI
```

### 2. AI Service (FastAPI)

```bash
cd backend/ai_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Place model weights in Models/ directory
# Required: best_vgg16.pth, best_resnet34.pth, best_densenet121.pth, ecg_scaler.pkl

# Start the service
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Go Backend

```bash
cd backend/go_backend

# Copy environment config
cp .env.example .env
# Edit .env with your configuration (JWT secret, AI service URL, etc.)

# Install dependencies & run
go mod tidy
go run main.go
```

### 4. Frontend (React)

```bash
cd FrontEnd

# Copy environment config
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
| Service | URL |
|---------|-----|
| Frontend | `http://localhost:3000` |
| Go Backend | `http://localhost:8080` |
| AI Service | `http://localhost:8000` |
| API Docs (Swagger) | `http://localhost:8000/docs` |

---

## 🧠 Model Details

### Multi-Task Architecture

CardioAI uses a **Multi-Task Learning** approach where each backbone model simultaneously performs two tasks through shared feature representations:

```
                    ┌─────────────────────┐
                    │   ECG Image Input    │
                    │    (224 × 224 × 3)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Backbone (CNN)     │
                    │   Feature Extractor  │
                    │                      │
                    │  • VGG16 (4096-d)    │
                    │  • ResNet34 (512-d)  │
                    │  • DenseNet121       │
                    │    (1024-d)          │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Shared Features     │
                    └─────┬─────────┬─────┘
                          │         │
               ┌──────────▼──┐ ┌───▼───────────┐
               │ Classifier  │ │  Regressor    │
               │ FC → 3      │ │  FC → 10      │
               │             │ │               │
               │ CrossEntropy│ │  HuberLoss    │
               └─────────────┘ └───────────────┘
```

### Model Specifications

| Model | Backbone | Feature Dim | Params (approx.) | Pre-trained |
|-------|----------|-------------|-------------------|-------------|
| VGG16 | VGG-16 | 4,096 | ~138M | ImageNet |
| ResNet34 | ResNet-34 | 512 | ~21M | ImageNet |
| DenseNet121 | DenseNet-121 | 1,024 | ~8M | ImageNet |

### Training Configuration

| Parameter | Value |
|-----------|-------|
| Input Size | 224 × 224 px |
| Batch Size | 256 |
| Optimizer | Adam |
| Learning Rate | 1e-4 |
| Epochs | 15 (with early stopping) |
| Patience | 5 epochs |
| Classification Loss | CrossEntropyLoss |
| Regression Loss | HuberLoss |
| Mixed Precision | ✅ (AMP on CUDA) |
| Data Augmentation | RandomRotation(5°), ColorJitter |
| Normalization | ImageNet mean/std |

### Ensemble Strategy

The ensemble uses **Soft Voting** — averaging the softmax probability distributions across all three models:

$$P_{ensemble}(c) = \frac{1}{3} \sum_{m \in \{VGG16,\ ResNet34,\ DenseNet121\}} P_m(c)$$

$$\hat{y} = \arg\max_c\ P_{ensemble}(c)$$

### Clinical Parameters (Regression Targets)

| Parameter | Description | Unit |
|-----------|-------------|------|
| HR | Heart Rate | bpm |
| RR | R-R Interval | ms |
| PR | PR Interval | ms |
| QRS | QRS Duration | ms |
| QT | QT Interval | ms |
| QTc | Corrected QT (Bazett) | ms |
| AXIS | Electrical Axis | degrees |
| RV5 | R-wave amplitude in V5 | mV |
| SV1 | S-wave amplitude in V1 | mV |
| R+S | Sum of R + S amplitudes | mV |

---

## 📊 Dataset

### PTB Diagnostic ECG Database (PTBDB)

This project uses the **PTB Diagnostic ECG Database** from [PhysioNet](https://physionet.org/content/ptbdb/1.0.0/), a publicly available benchmark dataset for cardiac diagnostics research.

| Attribute | Detail |
|-----------|--------|
| **Source** | PhysioNet — PTB Diagnostic ECG Database |
| **Subjects** | 294 subjects |
| **Total Records** | 549 high-resolution ECG recordings |
| **Leads** | 15 leads (12 standard + 3 Frank XYZ) |
| **Sampling Rate** | 1,000 Hz |
| **Resolution** | 16-bit |
| **License** | Open Data Commons Attribution License v1.0 |

### Classification Labels (3-Class)

| Class | Description |
|-------|-------------|
| **Normal** | Healthy control subjects with no cardiac abnormalities |
| **Myocardial Infarction (MI)** | Subjects diagnosed with myocardial infarction |
| **Other Heart Disease (OHD)** | Subjects with other cardiac conditions (cardiomyopathy, bundle branch block, dysrhythmia, hypertrophy, valvular heart disease, etc.) |

### Data Split

The dataset is split into three subsets with stratified sampling to maintain class distribution:

| Split | Purpose |
|-------|---------|
| **Train** | Model training with data augmentation |
| **Validation** | Hyperparameter tuning & early stopping |
| **Test** | Final performance evaluation (unseen data) |

### Preprocessing Pipeline

1. **ECG Signal → Image Conversion** — ECG waveforms are plotted and saved as PNG images
2. **Resize** — All images resized to 224 × 224 pixels
3. **Augmentation** (train only) — Random rotation (±5°), color jitter (brightness/contrast ±10%)
4. **Normalization** — ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
5. **Clinical Features** — Z-Score normalization using `StandardScaler`

> **📎 Reference:** Bousseljot, R., Kreiseler, D., Schnabel, A. — *"Nutzung der EKG-Signaldatenbank CARDIODAT der PTB über das Internet"*, Biomedizinische Technik, 1995.

---

## 📈 Results

### Evaluation Methodology

The evaluation pipeline (`evaluation.py`) generates comprehensive performance metrics:

| Evaluation | Description |
|------------|-------------|
| **Per-Model Accuracy** | Individual test accuracy for VGG16, ResNet34, DenseNet121 |
| **Ensemble Accuracy** | Soft voting accuracy on test set |
| **Confusion Matrices** | 2×2 grid for all models + ensemble |
| **Classification Report** | Precision, Recall, F1-Score per class |
| **ROC Curves** | One-vs-Rest ROC with AUC per class |
| **Regression Metrics** | MAE & MSE for each clinical parameter |
| **5-Fold Cross Validation** | Mean ± Std accuracy across folds (ResNet34) |
| **Training Curves** | Train/Val accuracy and loss per epoch |

### Generated Outputs

All evaluation outputs are saved to the `multitask_outputs/` directory:

| File | Content |
|------|---------|
| `5_1_1_dataset_distribution.png` | Class distribution per data split |
| `5_1_1_dataset_pie.png` | Overall class proportion |
| `5_1_1_sample_ecg_images.png` | Sample ECG images per class |
| `5_1_2_1_clinical_params_boxplot.png` | Clinical parameter distribution per class |
| `5_1_2_2_zscore_comparison.png` | Before vs after Z-Score normalization |
| `5_1_2_2_correlation_heatmap.png` | Feature correlation heatmap |
| `5_1_3_1_training_curves_accuracy.png` | Training & validation accuracy curves |
| `5_1_3_1_training_curves_loss.png` | Training & validation loss curves |
| `confusion_matrices_all.png` | Confusion matrices (all models) |
| `accuracy_comparison.png` | Bar chart comparing model accuracies |
| `roc_curves_all_models.png` | ROC curves with AUC |
| `regression_scatter_HR_QTc.png` | Actual vs predicted scatter plots |
| `per_class_performance_ensemble.png` | Per-class precision/recall/F1 |
| `report_*.csv` | Detailed classification reports |

---

## 📁 Project Structure

```
CardioAI/
│
├── 📄 README.md                  # Project documentation (you are here)
├── 📄 .gitignore                 # Git ignore rules
├── 📄 evaluation.py              # Full evaluation & visualization script (Colab)
│
├── 📂 FrontEnd/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx               # Main app with routing
│   │   ├── main.tsx              # Entry point
│   │   ├── index.css             # Global styles
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Landing page
│   │   │   └── AnalyzerPage.tsx  # ECG analysis interface
│   │   ├── components/
│   │   │   ├── EcgUploadCard.tsx  # Drag & drop upload
│   │   │   ├── ResultCard.tsx     # Prediction results display
│   │   │   ├── EcgWaveformChart.tsx  # ECG waveform visualization
│   │   │   ├── FeatureCard.tsx    # Clinical feature cards
│   │   │   ├── Header.tsx         # Page header
│   │   │   ├── LoadingState.tsx   # Loading animations
│   │   │   ├── ErrorState.tsx     # Error handling UI
│   │   │   ├── landing/          # Landing page components
│   │   │   └── layout/           # Navbar, Footer
│   │   ├── context/              # Theme context (dark/light)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── 📂 backend/
│   ├── 📂 ai_service/            # FastAPI AI inference service
│   │   ├── app.py                # FastAPI application & lifespan
│   │   ├── requirements.txt      # Python dependencies
│   │   ├── Models/               # Model weights (.pth) & scaler
│   │   ├── models/               # MultiTaskModel definition
│   │   ├── routes/
│   │   │   └── predict.py        # POST /predict endpoint
│   │   ├── services/
│   │   │   └── model_service.py  # Model loading & ensemble inference
│   │   └── utils/                # Preprocessing & postprocessing
│   │
│   └── 📂 go_backend/            # Go REST API backend
│       ├── main.go               # Entry point
│       ├── go.mod / go.sum       # Go modules
│       ├── configs/              # Configuration loading
│       ├── controllers/          # Request handlers
│       ├── middleware/           # JWT auth, CORS
│       ├── models/               # Data models
│       ├── repositories/         # Data access layer
│       ├── routes/               # Route setup
│       ├── services/             # Business logic
│       ├── utils/                # Helpers
│       └── .env.example
│
├── 📂 dataset/                   # ECG dataset (not tracked in git)
│
├── 📂 notebooks/                 # Jupyter notebooks (experiments)
│
├── 📂 docs/                      # Project documentation
│   ├── architecture.md           # System architecture details
│   ├── methodology.md            # Research methodology
│   └── api.md                    # API documentation
│
└── 📂 assets/                    # Static assets
    ├── architecture/             # Architecture diagrams
    ├── results/                  # Evaluation result images
    └── website/                  # Website screenshots
```

---

## 🔧 API Reference

### AI Service Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "models_loaded": true,
  "device": "cuda"
}
```

#### ECG Prediction
```http
POST /predict
Content-Type: multipart/form-data
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | `File` | ECG image (PNG/JPG/JPEG, max 10MB) |

**Response:**
```json
{
  "prediction": "Normal",
  "confidence": 97.42,
  "features": {
    "HR": 72.5,
    "RR": 827.6,
    "PR": 160.3,
    "QRS": 88.1,
    "QT": 392.4,
    "QTc": 431.2,
    "AXIS": 45.7,
    "RV5": 1.82,
    "SV1": 0.95,
    "R_plus_S": 2.77
  }
}
```

---

## 🧪 Running Evaluation

The full evaluation script is designed to run on **Google Colab** with GPU:

1. Upload `evaluation.py` to Google Colab
2. Mount Google Drive with your dataset and trained models
3. Update the `BASE_DIR` path in the `Config` class
4. Run all cells — the script will:
   - Visualize dataset distribution
   - Train VGG16, ResNet34, DenseNet121 with early stopping
   - Generate training curves (accuracy & loss)
   - Perform ensemble soft voting evaluation
   - Create confusion matrices, ROC curves, regression scatter plots
   - Run 5-fold cross validation
   - Export all metrics to CSV

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📚 References

1. **PTB Diagnostic ECG Database** — Bousseljot, R., Kreiseler, D., Schnabel, A. *"Nutzung der EKG-Signaldatenbank CARDIODAT der PTB über das Internet"*, Biomedizinische Technik, 1995. [PhysioNet](https://physionet.org/content/ptbdb/1.0.0/)
2. **VGG16** — Simonyan, K. & Zisserman, A. *"Very Deep Convolutional Networks for Large-Scale Image Recognition"*, ICLR, 2015.
3. **ResNet** — He, K. et al. *"Deep Residual Learning for Image Recognition"*, CVPR, 2016.
4. **DenseNet** — Huang, G. et al. *"Densely Connected Convolutional Networks"*, CVPR, 2017.
5. **Multi-Task Learning** — Caruana, R. *"Multitask Learning"*, Machine Learning, 1997.

---

<div align="center">

**Built with ❤️ for cardiac health research**

*CardioAI — Making ECG analysis accessible through artificial intelligence*

</div>
