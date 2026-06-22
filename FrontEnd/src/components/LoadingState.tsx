import { Activity } from 'lucide-react';

interface LoadingStateProps {
  progress: number;
}

export function LoadingState({ progress }: LoadingStateProps) {
  // Let's create smart sub-messages depending on current state of analysis
  let phaseText = "Preparing image...";
  if (progress > 15 && progress <= 40) {
    phaseText = "Scanning voltage grid lines...";
  } else if (progress > 40 && progress <= 65) {
    phaseText = "Detecting R-peaks & calculating heart rate...";
  } else if (progress > 65 && progress <= 85) {
    phaseText = "Measuring QT and QRS intervals...";
  } else if (progress > 85) {
    phaseText = "Comparing patterns to clinical database...";
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      
      {/* Activity Wave Animation */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring outer */}
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-red-100 dark:bg-red-950/40 animate-ping opacity-40"></div>
          
          {/* Main loader ring */}
          <div className="relative h-14 w-14 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/50 flex items-center justify-center text-red-500 dark:text-red-400">
            <Activity className="h-7 w-7 animate-[pulse_1.2s_infinite]" />
          </div>
        </div>

        <h3 id="loading-title" className="text-base font-semibold text-neutral-950 dark:text-neutral-50 mt-5">
          Analyzing ECG with AI...
        </h3>
        
        {/* Step subtitle */}
        <p id="loading-phase" className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm h-4">
          {phaseText}
        </p>
      </div>

      {/* Numerical Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-mono font-medium">
            AI Diagnosis Protocol
          </span>
          <span className="font-mono font-bold text-red-500 dark:text-red-400">
            {progress}%
          </span>
        </div>
        
        {/* Dynamic progress bar */}
        <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-400 via-red-500 to-rose-600 dark:from-red-500 dark:to-rose-500 transition-all duration-300 rounded-full ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grid Skeletons simulating scanning */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-xl space-y-2 animate-pulse bg-neutral-50 dark:bg-neutral-850"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full w-2/3"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2"></div>
            <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full w-4/5"></div>
          </div>
        ))}
      </div>

    </div>
  );
}
