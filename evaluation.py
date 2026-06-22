# =====================================================
# SKRIPSI BAB V - FULL EVALUASI SCRIPT (COLAB)
# =====================================================
# Jalankan 1 kali di Google Colab. 
# Pastikan file dataset dan model (.pth) sudah ada di Drive.
# =====================================================

# ------------------------------------------------------------------
# 1. INSTALL & MOUNT DRIVE
# ------------------------------------------------------------------
!pip install -q tqdm scikit-learn matplotlib seaborn pandas numpy torchvision

from google.colab import drive
drive.mount('/content/drive')

# ------------------------------------------------------------------
# 2. IMPORT LIBRARY
# ------------------------------------------------------------------
import os
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
from PIL import Image
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    mean_absolute_error,
    mean_squared_error,
    roc_curve,
    auc
)
from sklearn.preprocessing import label_binarize
from sklearn.model_selection import StratifiedKFold
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import transforms, models

warnings.filterwarnings("ignore")

# ------------------------------------------------------------------
# 3. GPU CHECK
# ------------------------------------------------------------------
print("CUDA Available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print(f"[GPU] {torch.cuda.get_device_name(0)}")
    device = torch.device("cuda")
else:
    device = torch.device("cpu")
    print("⚠️ Using CPU (enable GPU in Colab for faster)")

# ------------------------------------------------------------------
# 4. KONFIGURASI (SESUAIKAN PATH DRIVE ANDA)
# ------------------------------------------------------------------
class Config:
    # ============= UBAH PATH INI =============
    BASE_DIR = "/content/drive/MyDrive/DataSet/ptbdb/All_Assets"
    # ==========================================
    DATASET_DIR = os.path.join(BASE_DIR, "dataset_images_3class")
    OUTPUT_DIR = os.path.join(BASE_DIR, "multitask_outputs")
    TRAIN_CSV = os.path.join(BASE_DIR, "train.csv")
    VAL_CSV   = os.path.join(BASE_DIR, "val.csv")
    TEST_CSV  = os.path.join(BASE_DIR, "test.csv")
    IMAGE_SIZE = 224
    BATCH_SIZE = 256
    NUM_WORKERS = 4
    DEVICE = device
    EPOCHS = 15              # Untuk Cross Validation
    LEARNING_RATE = 1e-4
    PATIENCE = 5

CFG = Config()
os.makedirs(CFG.OUTPUT_DIR, exist_ok=True)
print(f"✅ Config loaded. Output: {CFG.OUTPUT_DIR}")

# ==================================================================
# 5.1.1 DESKRIPSI DAN VISUALISASI DATASET
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.1 DESKRIPSI DAN VISUALISASI DATASET")
print("="*60)

train_df = pd.read_csv(CFG.TRAIN_CSV)
val_df   = pd.read_csv(CFG.VAL_CSV)
test_df  = pd.read_csv(CFG.TEST_CSV)

print(f"Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)} | Total: {len(train_df)+len(val_df)+len(test_df)}")

# -- Distribusi kelas per split --
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
for ax, (name, df) in zip(axes, [("Train", train_df), ("Validation", val_df), ("Test", test_df)]):
    counts = df['label'].value_counts()
    colors = ['#2ecc71', '#e74c3c', '#3498db']
    ax.bar(counts.index, counts.values, color=colors)
    ax.set_title(f'{name} Set (n={len(df)})', fontsize=13)
    ax.set_ylabel('Jumlah Sampel')
    for i, v in enumerate(counts.values):
        ax.text(i, v + 5, str(v), ha='center', fontweight='bold')
    ax.tick_params(axis='x', rotation=15)
plt.suptitle("Distribusi Kelas per Split Dataset", fontsize=15, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_1_dataset_distribution.png"), dpi=300)
plt.show()

# -- Pie chart keseluruhan --
all_df = pd.concat([train_df, val_df, test_df])
fig, ax = plt.subplots(figsize=(7, 7))
counts = all_df['label'].value_counts()
ax.pie(counts.values, labels=counts.index, autopct='%1.1f%%', colors=['#2ecc71','#e74c3c','#3498db'],
       startangle=90, textprops={'fontsize': 12})
ax.set_title("Proporsi Kelas Keseluruhan Dataset", fontsize=14, fontweight='bold')
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_1_dataset_pie.png"), dpi=300)
plt.show()

# -- Sampel gambar ECG per kelas --
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
for ax, cls_name in zip(axes, ["Normal", "Myocardial_Infarction", "Other_Heart_Disease"]):
    cls_dir = os.path.join(CFG.DATASET_DIR, cls_name)
    if os.path.exists(cls_dir):
        sample_file = os.listdir(cls_dir)[0]
        img = Image.open(os.path.join(cls_dir, sample_file)).convert("RGB")
        ax.imshow(img); ax.set_title(cls_name, fontsize=13)
    ax.axis('off')
plt.suptitle("Contoh Gambar ECG per Kelas", fontsize=15, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_1_sample_ecg_images.png"), dpi=300)
plt.show()

# ==================================================================
# 5.1.2.1 HASIL EKSTRAKSI PARAMETER KLINIS
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.2.1 HASIL EKSTRAKSI PARAMETER KLINIS")
print("="*60)

feature_cols = ['HR','RR','PR','QRS','QT','QTc','AXIS','RV5','SV1','R_plus_S']
print("\n📋 Statistik Deskriptif Parameter Klinis (Train Set):")
print(train_df[feature_cols].describe().round(4).to_string())

# -- Box plot parameter klinis per kelas --
fig, axes = plt.subplots(2, 5, figsize=(22, 8))
for i, col in enumerate(feature_cols):
    ax = axes.flatten()[i]
    data_per_class = [train_df[train_df['label']==c][col].values for c in ["Normal","Myocardial_Infarction","Other_Heart_Disease"]]
    bp = ax.boxplot(data_per_class, labels=["N","MI","OHD"], patch_artist=True)
    for patch, color in zip(bp['boxes'], ['#2ecc71','#e74c3c','#3498db']):
        patch.set_facecolor(color); patch.set_alpha(0.7)
    ax.set_title(col, fontsize=11); ax.grid(axis='y', alpha=0.3)
plt.suptitle("Distribusi Parameter Klinis per Kelas", fontsize=15, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_2_1_clinical_params_boxplot.png"), dpi=300)
plt.show()

# ==================================================================
# 5.1.2.2 HASIL NORMALISASI Z-SCORE
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.2.2 HASIL NORMALISASI Z-SCORE")
print("="*60)

from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
raw_features = train_df[feature_cols].copy()
normalized_features = pd.DataFrame(scaler.fit_transform(raw_features), columns=feature_cols)

print("\n📋 Sebelum Normalisasi (5 baris pertama):")
print(raw_features.head().round(4).to_string())
print("\n📋 Sesudah Normalisasi Z-Score (5 baris pertama):")
print(normalized_features.head().round(4).to_string())

# -- Before vs After histogram --
fig, axes = plt.subplots(2, 5, figsize=(22, 8))
for i, col in enumerate(feature_cols):
    ax = axes.flatten()[i]
    ax.hist(raw_features[col], bins=30, alpha=0.6, color='#e74c3c', label='Sebelum', density=True)
    ax.hist(normalized_features[col], bins=30, alpha=0.6, color='#3498db', label='Sesudah', density=True)
    ax.set_title(col, fontsize=11); ax.legend(fontsize=8); ax.grid(alpha=0.3)
plt.suptitle("Perbandingan Distribusi Sebelum vs Sesudah Normalisasi Z-Score", fontsize=15, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_2_2_zscore_comparison.png"), dpi=300)
plt.show()

# -- Heatmap korelasi setelah normalisasi --
fig, ax = plt.subplots(figsize=(10, 8))
corr = normalized_features.corr()
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', center=0, ax=ax, square=True)
ax.set_title("Heatmap Korelasi Parameter Klinis (Z-Score)", fontsize=14)
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_2_2_correlation_heatmap.png"), dpi=300)
plt.show()

# ------------------------------------------------------------------
# 5. TRANSFORM
# ------------------------------------------------------------------
train_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomRotation(5),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

test_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

# ------------------------------------------------------------------
# 6. DATASET
# ------------------------------------------------------------------
class ECGDataset(Dataset):
    def __init__(self, csv_file, image_dir, transform=None):
        self.df = pd.read_csv(csv_file)
        self.image_dir = image_dir
        self.transform = transform
        self.label_map = {
            "Normal": 0,
            "Myocardial_Infarction": 1,
            "Other_Heart_Disease": 2
        }
        self.feature_cols = ['HR','RR','PR','QRS','QT','QTc','AXIS','RV5','SV1','R_plus_S']

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        patient_id = row['patient_id']
        label_name = row['label']
        image_path = os.path.join(self.image_dir, label_name, f"{patient_id}.png")
        if not os.path.exists(image_path):
            image_path = image_path.replace(".png", ".jpg")
        image = Image.open(image_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        class_label = torch.tensor(self.label_map[label_name], dtype=torch.long)
        regression_target = torch.tensor(row[self.feature_cols].values.astype(np.float32), dtype=torch.float32)
        return image, class_label, regression_target

# ------------------------------------------------------------------
# 7. MULTI-TASK MODEL
# ------------------------------------------------------------------
class MultiTaskModel(nn.Module):
    def __init__(self, backbone_name, num_classes=3, num_features=10):
        super().__init__()
        self.backbone_name = backbone_name

        if backbone_name == "resnet34":
            backbone = models.resnet34(pretrained=True)
            in_features = backbone.fc.in_features
            self.feature_extractor = nn.Sequential(*list(backbone.children())[:-1])
        elif backbone_name == "vgg16":
            backbone = models.vgg16(pretrained=True)
            self.feature_extractor = backbone.features
            self.avgpool = backbone.avgpool
            self.vgg_classifier = nn.Sequential(*list(backbone.classifier.children())[:-1])
            in_features = 4096
        elif backbone_name == "densenet121":
            backbone = models.densenet121(pretrained=True)
            self.feature_extractor = backbone.features
            in_features = backbone.classifier.in_features
        else:
            raise ValueError("Unsupported backbone")

        self.classifier = nn.Linear(in_features, num_classes)
        self.regressor = nn.Linear(in_features, num_features)

    def forward(self, x):
        if self.backbone_name == "resnet34":
            x = self.feature_extractor(x)
            x = torch.flatten(x, 1)
        elif self.backbone_name == "vgg16":
            x = self.feature_extractor(x)
            x = self.avgpool(x)
            x = torch.flatten(x, 1)
            x = self.vgg_classifier(x)
        elif self.backbone_name == "densenet121":
            x = self.feature_extractor(x)
            x = nn.functional.relu(x)
            x = nn.functional.adaptive_avg_pool2d(x, (1,1))
            x = torch.flatten(x, 1)
        class_out = self.classifier(x)
        reg_out = self.regressor(x)
        return class_out, reg_out

# ==================================================================
# 5.1.3.1 HASIL TRAINING MODEL TUNGGAL (Train/Val Accuracy per Epoch)
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.3.1 HASIL TRAINING MODEL TUNGGAL")
print("="*60)

train_dataset = ECGDataset(CFG.TRAIN_CSV, CFG.DATASET_DIR, transform=train_transform)
val_dataset   = ECGDataset(CFG.VAL_CSV,   CFG.DATASET_DIR, transform=test_transform)
train_loader  = DataLoader(train_dataset, batch_size=CFG.BATCH_SIZE, shuffle=True, num_workers=CFG.NUM_WORKERS, pin_memory=True)
val_loader    = DataLoader(val_dataset, batch_size=CFG.BATCH_SIZE, shuffle=False, num_workers=CFG.NUM_WORKERS, pin_memory=True)

def train_with_history(model_name, epochs=CFG.EPOCHS):
    print(f"\n🔄 Training {model_name} ...")
    model = MultiTaskModel(model_name).to(CFG.DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=CFG.LEARNING_RATE)
    cls_criterion = nn.CrossEntropyLoss()
    reg_criterion = nn.HuberLoss()
    scaler = torch.cuda.amp.GradScaler() if CFG.DEVICE.type == 'cuda' else None
    history = {'train_acc': [], 'val_acc': [], 'train_loss': [], 'val_loss': []}
    best_acc, patience_counter = 0, 0

    for epoch in range(epochs):
        # -- Train --
        model.train()
        correct, total, running_loss = 0, 0, 0
        for imgs, lbls, regs in tqdm(train_loader, desc=f"{model_name} E{epoch+1}"):
            imgs, lbls, regs = imgs.to(CFG.DEVICE), lbls.to(CFG.DEVICE), regs.to(CFG.DEVICE)
            optimizer.zero_grad()
            if scaler:
                with torch.cuda.amp.autocast():
                    c_out, r_out = model(imgs)
                    loss = cls_criterion(c_out, lbls) + reg_criterion(r_out, regs)
                scaler.scale(loss).backward(); scaler.step(optimizer); scaler.update()
            else:
                c_out, r_out = model(imgs)
                loss = cls_criterion(c_out, lbls) + reg_criterion(r_out, regs)
                loss.backward(); optimizer.step()
            running_loss += loss.item()
            correct += (torch.argmax(c_out, 1) == lbls).sum().item(); total += lbls.size(0)
        history['train_acc'].append(correct / total)
        history['train_loss'].append(running_loss / len(train_loader))

        # -- Validation --
        model.eval()
        v_correct, v_total, v_loss = 0, 0, 0
        with torch.no_grad():
            for imgs, lbls, regs in val_loader:
                imgs, lbls, regs = imgs.to(CFG.DEVICE), lbls.to(CFG.DEVICE), regs.to(CFG.DEVICE)
                c_out, r_out = model(imgs)
                loss = cls_criterion(c_out, lbls) + reg_criterion(r_out, regs)
                v_loss += loss.item()
                v_correct += (torch.argmax(c_out, 1) == lbls).sum().item(); v_total += lbls.size(0)
        val_acc = v_correct / v_total
        history['val_acc'].append(val_acc)
        history['val_loss'].append(v_loss / len(val_loader))
        print(f"  Epoch {epoch+1}: Train Acc={history['train_acc'][-1]:.4f} | Val Acc={val_acc:.4f}")

        if val_acc > best_acc:
            best_acc = val_acc; patience_counter = 0
            torch.save(model.state_dict(), os.path.join(CFG.OUTPUT_DIR, f"best_{model_name}.pth"))
        else:
            patience_counter += 1
            if patience_counter >= CFG.PATIENCE:
                print(f"  Early stopping at epoch {epoch+1}"); break
    return history

# -- Train all 3 models & collect history --
all_history = {}
for m_name in ["vgg16", "resnet34", "densenet121"]:
    all_history[m_name] = train_with_history(m_name)

# -- Plot Train/Val Accuracy Curves --
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
colors = {'vgg16': '#e74c3c', 'resnet34': '#3498db', 'densenet121': '#2ecc71'}
for ax, m_name in zip(axes, ["vgg16", "resnet34", "densenet121"]):
    h = all_history[m_name]
    epochs_range = range(1, len(h['train_acc'])+1)
    ax.plot(epochs_range, h['train_acc'], 'o-', label='Train Acc', color=colors[m_name])
    ax.plot(epochs_range, h['val_acc'], 's--', label='Val Acc', color=colors[m_name], alpha=0.7)
    ax.set_title(f'{m_name.upper()} - Accuracy per Epoch', fontsize=13)
    ax.set_xlabel('Epoch'); ax.set_ylabel('Accuracy'); ax.legend(); ax.grid(alpha=0.3)
    ax.set_ylim(0, 1.05)
plt.suptitle("5.1.3.1 Kurva Training & Validasi Akurasi", fontsize=15, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_3_1_training_curves_accuracy.png"), dpi=300)
plt.show()

# -- Plot Train/Val Loss Curves --
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
for ax, m_name in zip(axes, ["vgg16", "resnet34", "densenet121"]):
    h = all_history[m_name]
    epochs_range = range(1, len(h['train_loss'])+1)
    ax.plot(epochs_range, h['train_loss'], 'o-', label='Train Loss', color=colors[m_name])
    ax.plot(epochs_range, h['val_loss'], 's--', label='Val Loss', color=colors[m_name], alpha=0.7)
    ax.set_title(f'{m_name.upper()} - Loss per Epoch', fontsize=13)
    ax.set_xlabel('Epoch'); ax.set_ylabel('Loss'); ax.legend(); ax.grid(alpha=0.3)
plt.suptitle("5.1.3.1 Kurva Training & Validasi Loss", fontsize=15, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "5_1_3_1_training_curves_loss.png"), dpi=300)
plt.show()

# -- Summary table --
summary_rows = []
for m_name, h in all_history.items():
    summary_rows.append({
        "Model": m_name.upper(),
        "Best Train Acc": max(h['train_acc']),
        "Best Val Acc": max(h['val_acc']),
        "Final Train Loss": h['train_loss'][-1],
        "Final Val Loss": h['val_loss'][-1],
        "Epochs Run": len(h['train_acc'])
    })
train_summary_df = pd.DataFrame(summary_rows)
print("\n📋 Ringkasan Training:")
print(train_summary_df.to_string(index=False))
train_summary_df.to_csv(os.path.join(CFG.OUTPUT_DIR, "5_1_3_1_training_summary.csv"), index=False)

# ==================================================================
# 5.1.3.2 HASIL IMPLEMENTASI ENSEMBLE VOTING (SOFT VOTING)
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.3.2 IMPLEMENTASI ENSEMBLE VOTING (SOFT VOTING)")
print("="*60)
print("Metode: Soft Voting (rata-rata probabilitas softmax dari 3 model)")
print("Model anggota: VGG16, ResNet34, DenseNet121")
print("Formula: P_ensemble(c) = (P_vgg16(c) + P_resnet34(c) + P_densenet121(c)) / 3")
print("Prediksi final: argmax(P_ensemble)")

# ------------------------------------------------------------------
# 8. LOAD TEST DATASET & MODEL
# ------------------------------------------------------------------
test_dataset = ECGDataset(CFG.TEST_CSV, CFG.DATASET_DIR, transform=test_transform)
test_loader = DataLoader(test_dataset, batch_size=CFG.BATCH_SIZE, shuffle=False,
                         num_workers=CFG.NUM_WORKERS, pin_memory=True)

class_names = ["Normal", "Myocardial_Infarction", "Other_Heart_Disease"]
print(f"🧪 Test samples: {len(test_dataset)}")

def load_model(backbone):
    model = MultiTaskModel(backbone).to(CFG.DEVICE)
    weights_path = os.path.join(CFG.OUTPUT_DIR, f"best_{backbone}.pth")
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"❌ Weight tidak ditemukan: {weights_path}")
    model.load_state_dict(torch.load(weights_path, map_location=CFG.DEVICE))
    model.eval()
    return model

print("\n📥 Loading trained models ...")
vgg16_model = load_model("vgg16")
resnet34_model = load_model("resnet34")
densenet121_model = load_model("densenet121")
print("✅ All models loaded.")

models_dict = {"VGG16": vgg16_model, "ResNet34": resnet34_model, "DenseNet121": densenet121_model}
models_list = [vgg16_model, resnet34_model, densenet121_model]

# ------------------------------------------------------------------
# 9. FUNGSI EVALUASI
# ------------------------------------------------------------------
def evaluate_model(model, loader, desc="Evaluating"):
    model.eval()
    all_preds, all_labels, all_reg_preds, all_reg_targets = [], [], [], []
    with torch.no_grad():
        for images, labels, reg_targets in tqdm(loader, desc=desc):
            images = images.to(CFG.DEVICE)
            logits, regs = model(images)
            preds = torch.argmax(logits, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_reg_preds.append(regs.cpu().numpy())
            all_reg_targets.append(reg_targets.numpy())
    all_reg_preds = np.vstack(all_reg_preds)
    all_reg_targets = np.vstack(all_reg_targets)
    acc = accuracy_score(all_labels, all_preds)
    report = classification_report(all_labels, all_preds, target_names=class_names, output_dict=True)
    cm = confusion_matrix(all_labels, all_preds)
    return acc, report, cm, all_reg_preds, all_reg_targets

def ensemble_evaluate(models, loader):
    all_preds, all_labels, all_reg_preds, all_reg_targets = [], [], [], []
    with torch.no_grad():
        for images, labels, reg_targets in tqdm(loader, desc="Ensemble"):
            images = images.to(CFG.DEVICE)
            probs_list, reg_list = [], []
            for m in models:
                logits, regs = m(images)
                probs_list.append(torch.softmax(logits, dim=1))
                reg_list.append(regs)
            avg_probs = torch.stack(probs_list).mean(dim=0)
            avg_reg = torch.stack(reg_list).mean(dim=0)
            preds = torch.argmax(avg_probs, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_reg_preds.append(avg_reg.cpu().numpy())
            all_reg_targets.append(reg_targets.numpy())
    all_reg_preds = np.vstack(all_reg_preds)
    all_reg_targets = np.vstack(all_reg_targets)
    acc = accuracy_score(all_labels, all_preds)
    report = classification_report(all_labels, all_preds, target_names=class_names, output_dict=True)
    cm = confusion_matrix(all_labels, all_preds)
    return acc, report, cm, all_reg_preds, all_reg_targets

# ==================================================================
# 5.1.4.1 HASIL PENGUJIAN MODEL TUNGGAL
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.4.1 HASIL PENGUJIAN MODEL TUNGGAL")
print("="*60)

results = {}
for name, model in models_dict.items():
    acc, report, cm, _, _ = evaluate_model(model, test_loader, desc=name)
    results[name] = {"accuracy": acc, "report": report, "confusion_matrix": cm}
    print(f"✅ {name} Acc: {acc:.4f}")

# ==================================================================
# 5.1.4.2 HASIL PENGUJIAN ENSEMBLE VOTING (SOFT VOTING)
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.4.2 HASIL PENGUJIAN ENSEMBLE VOTING (SOFT VOTING)")
print("="*60)

ens_acc, ens_report, ens_cm, ens_reg_preds, ens_reg_targets = ensemble_evaluate(models_list, test_loader)
results["Ensemble"] = {"accuracy": ens_acc, "report": ens_report, "confusion_matrix": ens_cm,
                       "reg_preds": ens_reg_preds, "reg_targets": ens_reg_targets}
print(f"✅ Ensemble Acc: {ens_acc:.4f}")

# ==================================================================
# 5.1.4.3 PERBANDINGAN KINERJA MODEL
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.4.3 PERBANDINGAN KINERJA MODEL")
print("="*60)
fig, axes = plt.subplots(2, 2, figsize=(14, 12))
for idx, (name, res) in enumerate(results.items()):
    if idx >= 4: break
    disp = ConfusionMatrixDisplay(confusion_matrix=res["confusion_matrix"], display_labels=class_names)
    disp.plot(ax=axes.flatten()[idx], cmap="Blues", values_format="d")
    axes.flatten()[idx].set_title(f"{name}\nAcc = {res['accuracy']:.4f}")
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "confusion_matrices_all.png"), dpi=300)
plt.show()

# -- Tabel & Bar Chart Perbandingan --
comparison_df = pd.DataFrame({
    "Model": list(results.keys()),
    "Accuracy": [res["accuracy"] for res in results.values()]
})
print("\n📋 Perbandingan Akurasi:")
print(comparison_df.to_string(index=False))
comparison_df.to_csv(os.path.join(CFG.OUTPUT_DIR, "accuracy_comparison.csv"), index=False)

plt.figure(figsize=(8,5))
sns.barplot(data=comparison_df, x="Model", y="Accuracy", palette="viridis")
plt.ylim(0, 1)
plt.title("Perbandingan Akurasi pada Test Set", fontsize=14)
for i, acc in enumerate(comparison_df["Accuracy"]):
    plt.text(i, acc + 0.01, f"{acc:.4f}", ha="center")
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "accuracy_comparison.png"), dpi=300)
plt.show()

# ==================================================================
# 5.1.4.5 HASIL EKSTRAKSI PARAMETER KLINIS (REGRESI)
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.4.5 HASIL EKSTRAKSI PARAMETER KLINIS (REGRESI)")
print("="*60)
feature_names = ['HR','RR','PR','QRS','QT','QTc','AXIS','RV5','SV1','R_plus_S']
mae_per_feat = mean_absolute_error(ens_reg_targets, ens_reg_preds, multioutput='raw_values')
mse_per_feat = mean_squared_error(ens_reg_targets, ens_reg_preds, multioutput='raw_values')
reg_df = pd.DataFrame({"Fitur": feature_names, "MAE": mae_per_feat, "MSE": mse_per_feat})
print(reg_df.to_string(index=False))
reg_df.to_csv(os.path.join(CFG.OUTPUT_DIR, "regression_metrics_ensemble.csv"), index=False)
print(f"Overall MAE: {mean_absolute_error(ens_reg_targets, ens_reg_preds):.4f}")
print(f"Overall MSE: {mean_squared_error(ens_reg_targets, ens_reg_preds):.4f}")

# Scatter Plot HR & QTc
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for idx, (feat_idx, label) in enumerate(zip([0, 5], ['HR (Heart Rate)', 'QTc (Corrected QT)'])):
    ax = axes[idx]
    y_true, y_pred = ens_reg_targets[:, feat_idx], ens_reg_preds[:, feat_idx]
    ax.scatter(y_true, y_pred, alpha=0.5, s=10, color='steelblue')
    minv, maxv = min(y_true.min(), y_pred.min()), max(y_true.max(), y_pred.max())
    ax.plot([minv, maxv], [minv, maxv], 'r--', lw=2, label='Perfect')
    ax.set_xlabel('Actual'); ax.set_ylabel('Predicted')
    ax.set_title(f'{label}\nMAE={mean_absolute_error(y_true, y_pred):.3f}, R²={np.corrcoef(y_true, y_pred)[0,1]**2:.3f}')
    ax.legend(); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "regression_scatter_HR_QTc.png"), dpi=300)
plt.show()

# ------------------------------------------------------------------
# 14. ROC CURVE (2x2 GRID)
# ------------------------------------------------------------------
print("\n" + "="*60)
print("📊 ROC CURVE (One-vs-Rest)")
print("="*60)

def get_probs_labels(model, loader):
    model.eval()
    all_probs, all_labels = [], []
    with torch.no_grad():
        for images, labels, _ in tqdm(loader, desc="Collecting probs"):
            images = images.to(CFG.DEVICE)
            logits, _ = model(images)
            all_probs.append(torch.softmax(logits, dim=1).cpu().numpy())
            all_labels.append(labels.numpy())
    return np.vstack(all_probs), np.hstack(all_labels)

def get_ens_probs_labels(models, loader):
    all_probs, all_labels = [], []
    with torch.no_grad():
        for images, labels, _ in tqdm(loader, desc="Ensemble probs"):
            images = images.to(CFG.DEVICE)
            probs_list = []
            for m in models:
                logits, _ = m(images)
                probs_list.append(torch.softmax(logits, dim=1))
            avg_probs = torch.stack(probs_list).mean(dim=0)
            all_probs.append(avg_probs.cpu().numpy())
            all_labels.append(labels.numpy())
    return np.vstack(all_probs), np.hstack(all_labels)

roc_data = {}
for name, model in models_dict.items():
    probs, labels = get_probs_labels(model, test_loader)
    roc_data[name] = (probs, labels)
ens_probs, ens_labels = get_ens_probs_labels(models_list, test_loader)
roc_data["Ensemble"] = (ens_probs, ens_labels)

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
n_classes = 3
colors = ['#1f77b4', '#ff7f0e', '#2ca02c']
for idx, (name, (probs, labels)) in enumerate(roc_data.items()):
    if idx >= 4: break
    ax = axes.flatten()[idx]
    y_bin = label_binarize(labels, classes=[0,1,2])
    for i, color in zip(range(n_classes), colors):
        fpr, tpr, _ = roc_curve(y_bin[:, i], probs[:, i])
        roc_auc = auc(fpr, tpr)
        ax.plot(fpr, tpr, color=color, lw=2, label=f'{class_names[i]} (AUC={roc_auc:.3f})')
    ax.plot([0,1],[0,1],'k--', lw=1)
    ax.set_xlabel('FPR'); ax.set_ylabel('TPR')
    ax.set_title(f'{name} - ROC')
    ax.legend(loc="lower right"); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "roc_curves_all_models.png"), dpi=300)
plt.show()

# ------------------------------------------------------------------
# 15. VISUALISASI SAMPEL GAMBAR ECG (6 SAMPEL)
# ------------------------------------------------------------------
print("\n" + "="*60)
print("🖼️ VISUALISASI PREDIKSI SAMPEL GAMBAR")
print("="*60)

images, labels, reg_targets = next(iter(test_loader))
images, labels = images[:6].to(CFG.DEVICE), labels[:6].numpy()
with torch.no_grad():
    probs_list = []
    for m in models_list:
        logits, _ = m(images)
        probs_list.append(torch.softmax(logits, dim=1))
    avg_probs = torch.stack(probs_list).mean(dim=0)
    preds = torch.argmax(avg_probs, dim=1).cpu().numpy()
    _, reg_preds = models_list[0](images)
    reg_preds = reg_preds.cpu().numpy()

mean = np.array([0.485, 0.456, 0.406]); std = np.array([0.229, 0.224, 0.225])
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
for i in range(6):
    ax = axes.flatten()[i]
    img = images[i].cpu().numpy().transpose((1,2,0)); img = std * img + mean; img = np.clip(img,0,1)
    ax.imshow(img)
    true_l = class_names[labels[i]]; pred_l = class_names[preds[i]]
    color = 'green' if preds[i] == labels[i] else 'red'
    ax.set_title(f"True: {true_l}\nPred: {pred_l}", color=color)
    ax.text(5, 5, f"HR: {reg_targets[i][0]:.1f}→{reg_preds[i][0]:.1f} | QTc: {reg_targets[i][5]:.1f}→{reg_preds[i][5]:.1f}",
            bbox=dict(facecolor='white', alpha=0.7), fontsize=8)
    ax.axis('off')
plt.suptitle("Prediksi Ensemble pada Sampel ECG", fontsize=16)
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "sample_predictions.png"), dpi=300)
plt.show()

# ------------------------------------------------------------------
# 16. PER-CLASS PERFORMANCE (Ensemble)
# ------------------------------------------------------------------
print("\n" + "="*60)
print("📊 PERFORMANCE PER KELAS (Ensemble)")
print("="*60)
report_ens = pd.DataFrame(ens_report).transpose()
classes_metrics = report_ens.loc[class_names, ['precision', 'recall', 'f1-score']]
fig, ax = plt.subplots(figsize=(8,5))
classes_metrics.plot(kind='bar', ax=ax, color=['#1f77b4','#ff7f0e','#2ca02c'], rot=0)
ax.set_title('Ensemble - Performance per Class', fontsize=14)
ax.set_ylim(0,1); ax.set_ylabel('Score'); ax.grid(axis='y', alpha=0.3)
for container in ax.containers:
    ax.bar_label(container, fmt='%.3f')
plt.tight_layout()
plt.savefig(os.path.join(CFG.OUTPUT_DIR, "per_class_performance_ensemble.png"), dpi=300)
plt.show()

# ==================================================================
# 5.1.4.4 HASIL VALIDASI SILANG 5-FOLD
# ==================================================================
print("\n" + "="*60)
print("📊 5.1.4.4 HASIL VALIDASI SILANG 5-FOLD (ResNet34)")
print("="*60)

train_full_df = pd.read_csv(CFG.TRAIN_CSV)
labels_full = train_full_df["label"].map({"Normal":0, "Myocardial_Infarction":1, "Other_Heart_Disease":2}).values
train_full_dataset = ECGDataset(CFG.TRAIN_CSV, CFG.DATASET_DIR, transform=train_transform)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
fold_accs = []

for fold, (train_idx, val_idx) in enumerate(skf.split(np.zeros(len(train_full_dataset)), labels_full)):
    print(f"\nFold {fold+1}/5")
    train_sub = Subset(train_full_dataset, train_idx); val_sub = Subset(train_full_dataset, val_idx)
    train_loader_cv = DataLoader(train_sub, CFG.BATCH_SIZE, shuffle=True, num_workers=CFG.NUM_WORKERS, pin_memory=True)
    val_loader_cv = DataLoader(val_sub, CFG.BATCH_SIZE, shuffle=False, num_workers=CFG.NUM_WORKERS, pin_memory=True)
    
    model_cv = MultiTaskModel("resnet34").to(CFG.DEVICE)
    optimizer = optim.Adam(model_cv.parameters(), lr=CFG.LEARNING_RATE)
    criterion = nn.CrossEntropyLoss()
    best_acc, patience = 0.0, 0
    
    for epoch in range(CFG.EPOCHS):
        model_cv.train()
        for imgs, lbls, _ in train_loader_cv:
            imgs, lbls = imgs.to(CFG.DEVICE), lbls.to(CFG.DEVICE)
            optimizer.zero_grad()
            logits, _ = model_cv(imgs)
            loss = criterion(logits, lbls)
            loss.backward(); optimizer.step()
        
        model_cv.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for imgs, lbls, _ in val_loader_cv:
                imgs, lbls = imgs.to(CFG.DEVICE), lbls.to(CFG.DEVICE)
                logits, _ = model_cv(imgs)
                preds = torch.argmax(logits, dim=1)
                correct += (preds == lbls).sum().item(); total += lbls.size(0)
        val_acc = correct / total
        if val_acc > best_acc:
            best_acc = val_acc; patience = 0
        else:
            patience += 1
            if patience >= CFG.PATIENCE: break
    fold_accs.append(best_acc)
    print(f"Best Val Acc: {best_acc:.4f}")

print(f"\n✅ 5-Fold CV Results: {[f'{a:.4f}' for a in fold_accs]}")
print(f"Mean Acc: {np.mean(fold_accs):.4f} (±{np.std(fold_accs):.4f})")
pd.DataFrame({"Fold": range(1,6), "Accuracy": fold_accs}).to_csv(os.path.join(CFG.OUTPUT_DIR, "cv_results_resnet34.csv"), index=False)

# ------------------------------------------------------------------
# 18. SIMPAN SEMUA REPORT & SELESAI
# ------------------------------------------------------------------
for name, res in results.items():
    pd.DataFrame(res["report"]).transpose().to_csv(os.path.join(CFG.OUTPUT_DIR, f"report_{name}.csv"))

print("\n" + "="*60)
print("🎉 SEMUA EVALUASI DAN VISUALISASI SELESAI!")
print("="*60)
print(f"📁 Hasil tersimpan di: {CFG.OUTPUT_DIR}")
print("File yang dihasilkan:")
print(" - confusion_matrices_all.png")
print(" - accuracy_comparison.png / .csv")
print(" - regression_metrics_ensemble.csv & scatter.png")
print(" - roc_curves_all_models.png")
print(" - sample_predictions.png")
print(" - per_class_performance_ensemble.png")
print(" - cv_results_resnet34.csv")
print(" - report_*.csv (semua model & ensemble)")