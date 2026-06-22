import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EcgUploadCard } from '../components/EcgUploadCard';
import { ResultCard } from '../components/ResultCard';
import { FeatureCard } from '../components/FeatureCard';
import { EcgWaveformChart } from '../components/EcgWaveformChart';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { analyzeEcgImage, PRESET_DIAGNOSES } from '../services/api';
import { EcgAnalysisResult } from '../types/ecg';
import { HeartPulse, Info, ArrowLeft, Activity } from 'lucide-react';

export function AnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<EcgAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with the standard default Normal rhythm so the metrics dashboard has preloaded parameters
  useEffect(() => {
    const defaultNormalResult: EcgAnalysisResult = {
      ...PRESET_DIAGNOSES[0],
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    setResult(defaultNormalResult);
  }, []);

  // Handle ECG upload and run the simulated analysis
  const handleAnalyze = async (file: File, presetIndex?: number) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    
    try {
      const data = await analyzeEcgImage(file, presetIndex, (currentProgress) => {
        setProgress(currentProgress);
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during image scan. Please verify you attached a valid ECG schema.");
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setError(null);
    // Restore default normal preset to populate metrics
    const defaultNormalResult: EcgAnalysisResult = {
      ...PRESET_DIAGNOSES[0],
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    setResult(defaultNormalResult);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 font-sans transition-colors duration-300 flex flex-col pt-18 lg:pt-20">

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Breadcrumb / Back navigation */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-900 border border-transparent hover:border-slate-200 dark:hover:border-neutral-800 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              ECG Analyzer <span className="gradient-text">Pro</span>
            </h2>
          </div>
        </div>
        
        {/* Top welcome disclaimer notice for Non-Technical Users */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex items-start gap-3.5">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 dark:text-neutral-300 space-y-1">
            <p className="font-extrabold text-slate-800 dark:text-neutral-200">Interactive Clinical ECG Screening Dashboard</p>
            <p className="leading-relaxed">
              This interactive clinical-style dashboard processes ECG paper images to extract signal intervals and predict cardiac status. To test different outcomes immediately, select one of the 5 interactive cardiac presets below or drag in an image file.
            </p>
          </div>
        </div>

        {/* Dynamic Layout Splitting: Config Card and results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Upload controller & presets */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <EcgUploadCard onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            
            {/* Quick guide on reading ECG values */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-400 dark:text-neutral-500">
                Guide to Reading Electrocardiograms
              </h4>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-neutral-400">
                <li className="flex gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold font-mono">1.</span>
                  <span><strong>Heart Rate (HR):</strong> Normal resting rhythm is between 60 to 100 beats per minute. Rates above 100 signify Tachycardia, and below 60 represent Bradycardia.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold font-mono">2.</span>
                  <span><strong>QRS Complex:</strong> Representing contraction of our ventricles. If expanded (&gt;110 ms), it suggests bundle branch conduction delays.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold font-mono">3.</span>
                  <span><strong>QT Interval:</strong> The time taken for ventricular contraction and recovery. Adjusted for rate to calculate Corrected QT (QTc). Prolonged QTc increases risk factors.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: AI Analysis outcome card */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            {isAnalyzing && (
              <LoadingState progress={progress} />
            )}

            {error && (
              <ErrorState message={error} onRetry={handleReset} />
            )}

            {!isAnalyzing && !error && result && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Result diagnostics pill box */}
                <ResultCard result={result} />

                {/* Simulated ECG Interactive Zoom and Scroll Plot Window */}
                <EcgWaveformChart result={result} />

                {/* Grid features panel */}
                <FeatureCard features={result.features} />

              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer Medical Disclaimer */}
      <footer className="border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-6 mt-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2.5">
          <div className="flex justify-center text-slate-400 dark:text-neutral-500">
            <HeartPulse className="h-5 w-5 animate-pulse text-slate-400" />
          </div>
          <p id="medical-disclaimer" className="text-[11px] font-semibold text-slate-450 dark:text-neutral-500 max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
            CardioAI is for educational screening purposes only and does not replace professional medical diagnosis, decision support, or emergency medical treatment.
          </p>
          <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-500">
            © {new Date().getFullYear()} CardioAI Clinical AI Screening System • API Integration Endpoint Active (/api/predict)
          </p>
        </div>
      </footer>

    </div>
  );
}
