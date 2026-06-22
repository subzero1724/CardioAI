import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 rounded-2xl border border-red-100 dark:border-red-950/40 bg-red-50/50 dark:bg-red-500/5 mt-6 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Error Icon */}
        <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
          <AlertCircle id="error-alert-icon" className="h-5 w-5 stroke-[2.2]" />
        </div>
        
        {/* Message and Retry */}
        <div className="flex-1">
          <h3 id="error-title" className="text-sm font-semibold text-red-900 dark:text-red-200">
            Analysis Request Encountered an Error
          </h3>
          <p id="error-message" className="text-xs text-red-700/90 dark:text-red-400 mt-1 leading-relaxed">
            {message || "We could not extract a readable ECG grid waveform. Please make sure the image is centered, well-lit, and in JPG/PNG format."}
          </p>
          
          <button
            id="error-retry-btn"
            onClick={onRetry}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-white dark:text-red-300 text-xs font-semibold shadow-sm hover:shadow transition-all duration-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry ECG Upload
          </button>
        </div>
      </div>
    </div>
  );
}
