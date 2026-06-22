import React, { useState, useRef } from 'react';
import { Upload, FileImage, Trash2, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { PRESET_DIAGNOSES } from '../services/api';

interface EcgUploadCardProps {
  onAnalyze: (file: File, presetIndex?: number) => void;
  isAnalyzing: boolean;
}

export function EcgUploadCard({ onAnalyze, isAnalyzing }: EcgUploadCardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic image validator
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid JPEG, PNG, or TIFF image file of an ECG waveform.");
      return;
    }
    
    setSelectedFile(file);
    setSelectedPresetIndex(undefined); // Clear preset selection if user uploads a custom file

    // Parse image preview url
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPresetIndex(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerAnalysis = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, selectedPresetIndex);
    }
  };

  // Quick preset loader
  const loadPreset = (index: number) => {
    // Generate a simulated mock File based on preset metadata
    const preset = PRESET_DIAGNOSES[index];
    const file = new File(["mock_binary_data"], `ecg_preset_${preset.status}_wave.png`, { type: "image/png" });
    setSelectedFile(file);
    setSelectedPresetIndex(index);
    
    // Set a matching stylized abstract medical graph vector as preview
    // We can use a colored procedural line or placeholder SVG representing the rhythm.
    let colorHex = "f43f5e"; // red
    if (preset.status === 'normal') colorHex = "10b981"; // green
    if (preset.status === 'moderate') colorHex = "f59e0b"; // yellow
    
    const svgPreview = `data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200" style="background:%230a0a0a; border-radius:12px">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23222" stroke-width="1" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="%23333" stroke-width="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(%23grid)" />
        <path d="M 0,100 L 40,100 L 60,100 L 70,70 L 80,130 L 90,100 L 120,100 S 140,50 160,100 S 190,140 210,100 L 250,100 L 260,20 L 275,180 L 285,100 L 400,100" 
              fill="none" stroke="%23${colorHex}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <text x="20" y="40" fill="%23999" font-family="monospace" font-size="12">PRESET INTERACTION ACTIVE</text>
        <text x="20" y="60" fill="%23aaa" font-family="sans-serif" font-weight="bold" font-size="14">${preset.prediction}</text>
      </svg>
    `;
    setPreviewUrl(svgPreview);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 space-y-6 shadow-sm flex flex-col">
      
      {/* Title block */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-neutral-200 uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ECG Input
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
          Upload your lead-II scan, photographic medical chart, or digital strip.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        id="drag-drop-zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`relative border-2 border-dashed rounded-2xl cursor-pointer py-10 px-4 text-center transition-all duration-300 flex flex-col items-center justify-center ${
          previewUrl 
            ? 'border-slate-200 dark:border-neutral-700 bg-slate-50/30 dark:bg-neutral-950/20' 
            : dragActive 
              ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-500/5' 
              : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/5 hover:border-slate-300 dark:hover:border-neutral-700'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />

        {previewUrl ? (
          /* Preview state */
          <div className="space-y-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 shadow-sm bg-neutral-950 max-h-56 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="ECG Preview"
                className="max-h-52 w-auto object-contain transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <button
                id="clear-file-btn"
                onClick={handleClear}
                disabled={isAnalyzing}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white/90 dark:bg-neutral-900/90 text-red-600 hover:bg-white dark:hover:bg-neutral-800 shadow-sm transition-colors cursor-pointer"
                title="Discard file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-xs bg-white dark:bg-neutral-950 py-2 px-3 rounded-lg border border-slate-100 dark:border-neutral-800">
              <span className="truncate max-w-[200px] font-mono text-slate-600 dark:text-neutral-400 font-semibold">
                {selectedFile?.name}
              </span>
              <span className="text-slate-450 dark:text-neutral-500 shrink-0">
                {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
              </span>
            </div>
          </div>
        ) : (
          /* Idle Blank state */
          <div className="space-y-3 pointer-events-none">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-neutral-800/85 flex items-center justify-center text-slate-500 dark:text-neutral-400">
              <FileImage className="h-6 w-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-600 dark:text-neutral-300">
                Drag & drop your ECG image here, or <span className="text-blue-600 dark:text-blue-400">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                Supports JPEG, PNG, or High-Contrast scans (Up to 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preset Sandboxed Samples Selector */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-450 dark:text-neutral-500 tracking-wider font-mono font-bold uppercase flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Interactive Cardiac Presets (Self-Testing Sandbox)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-slate-100 dark:border-neutral-800/50 pt-3">
          {PRESET_DIAGNOSES.map((diag, index) => {
            const riskColor = 
              diag.status === 'normal' 
                ? 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/60 text-emerald-800 dark:border-emerald-950/20 dark:bg-emerald-950/10 dark:text-emerald-400' 
                : diag.status === 'moderate' 
                  ? 'border-amber-100 bg-amber-50/30 hover:bg-amber-50/60 text-amber-805 dark:border-amber-950/20 dark:bg-amber-950/10 dark:text-amber-400' 
                  : 'border-rose-100 bg-rose-50/30 hover:bg-rose-50/60 text-rose-800 dark:border-rose-950/20 dark:bg-rose-950/10 dark:text-rose-400';
            
            const isActive = selectedPresetIndex === index;

            return (
              <button
                key={index}
                id={`preset-btn-${index}`}
                type="button"
                disabled={isAnalyzing}
                onClick={(e) => {
                  e.stopPropagation();
                  loadPreset(index);
                }}
                className={`py-2 px-3 rounded-xl border text-left text-xs transition-all duration-200 cursor-pointer ${riskColor} ${
                  isActive 
                    ? 'ring-2 ring-blue-500 font-bold scale-[1.01]' 
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div className="font-semibold truncate flex items-center justify-between">
                  <span>{diag.prediction.split(' ')[0]} {diag.prediction.split(' ')[1] || ''}</span>
                  <ArrowRight className="w-3 h-3 translate-x-0.5" />
                </div>
                <div className="text-[9px] opacity-75 mt-0.5 truncate uppercase font-mono tracking-wider font-medium">
                  {diag.status} ({diag.confidence.toFixed(1)}%)
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Action Trigger */}
      <button
        id="analyze-ecg-btn"
        type="button"
        onClick={triggerAnalysis}
        disabled={isAnalyzing || !selectedFile}
        className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
          isAnalyzing || !selectedFile
            ? 'bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500 cursor-not-allowed shadow-none'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-[0.99] cursor-pointer'
        }`}
      >
        <span>
          {isAnalyzing 
            ? 'Analyzing Grid Waveforms...' 
            : !selectedFile 
              ? 'Select or Upload ECG scan file' 
              : `Start AI Analysis`
          }
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
}
