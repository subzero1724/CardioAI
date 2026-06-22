import { EcgAnalysisResult } from '../types/ecg';
import { formatPercent } from '../utils/format';
import { ShieldAlert, ShieldCheck, HeartPulse, Clock, FileText, ChevronRight } from 'lucide-react';

interface ResultCardProps {
  result: EcgAnalysisResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { prediction, status, confidence, explanation, timestamp } = result;

  // Custom visual theme mappings based on medical risk level
  const themeMap = {
    normal: {
      border: 'border-emerald-100 dark:border-emerald-900/40',
      bg: 'bg-emerald-50/45 dark:bg-emerald-500/5',
      text: 'text-emerald-900 dark:text-emerald-300',
      tagBg: 'bg-emerald-100 dark:bg-emerald-500/10',
      tagText: 'text-emerald-800 dark:text-emerald-400',
      barColor: 'bg-emerald-500',
      iconClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20',
      icon: <ShieldCheck className="h-6 w-6 stroke-[2.2]" />,
      recommendation: "Ensure steady physical activity and routine yearly wellness screens. Maintain a healthy lifestyle."
    },
    moderate: {
      border: 'border-amber-100 dark:border-amber-900/40',
      bg: 'bg-amber-50/45 dark:bg-amber-500/5',
      text: 'text-amber-900 dark:text-amber-300',
      tagBg: 'bg-amber-100 dark:bg-amber-500/10',
      tagText: 'text-amber-800 dark:text-amber-400',
      barColor: 'bg-amber-500',
      iconClass: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20',
      icon: <HeartPulse className="h-6 w-6 stroke-[2.2]" />,
      recommendation: "Consult your general practitioner within the coming weeks. Avoid pre-test stimulants (such as caffeine or nicotine), and check if symptoms recur while resting."
    },
    abnormal: {
      border: 'border-rose-100 dark:border-rose-900/40',
      bg: 'bg-rose-50/45 dark:bg-rose-500/5',
      text: 'text-rose-950 dark:text-rose-300',
      tagBg: 'bg-rose-100 dark:bg-rose-500/10',
      tagText: 'text-rose-800 dark:text-rose-400',
      barColor: 'bg-rose-600',
      iconClass: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20',
      icon: <ShieldAlert className="h-6 w-6 stroke-[2.2]" />,
      recommendation: "Please coordinate with a certified professional physician or cardiologist as soon as possible to carry out a comprehensive diagnostic standard 12-lead clinical ECG."
    }
  };

  const currentTheme = themeMap[status] || themeMap.normal;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 p-8 shadow-sm relative overflow-hidden transition-all duration-300 animate-fade-in">
      
      {/* Accent Background Glow based on current cardiac status */}
      {status === 'normal' && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100 dark:bg-emerald-950/20 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      )}
      {status === 'moderate' && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100 dark:bg-amber-950/20 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      )}
      {status === 'abnormal' && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-100 dark:bg-rose-950/20 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      )}
      
      <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-start justify-between gap-6">
        <div className="flex-1">
          {/* Status Indicator Dot row */}
          <div className="flex items-center gap-3 mb-2.5">
            <span className={`w-3 h-3 rounded-full ${
              status === 'normal' 
                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                : status === 'moderate' 
                  ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                  : 'bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]'
            }`} />
            <h3 className={`text-xs font-bold uppercase tracking-widest ${
              status === 'normal' 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : status === 'moderate' 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-rose-600 dark:text-rose-400'
            }`}>
              AI Prediction: {status} Level
            </h3>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              {timestamp}
            </span>
          </div>

          <h2 id="prediction-title" className="text-3xl font-black text-slate-900 dark:text-neutral-50 mb-4 tracking-tight leading-snug">
            {prediction}
          </h2>
        </div>

        {/* Display High-contrast Score widget */}
        <div className="flex flex-col items-start md:items-end shrink-0 bg-slate-50/50 dark:bg-neutral-950/30 p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 md:border-none md:bg-transparent md:p-0">
          <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-1 font-mono tracking-tighter">
            {confidence.toFixed(1)}<span className="text-2xl font-bold">%</span>
          </div>
          <div className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider text-left md:text-right">
            Confidence Score
          </div>
        </div>
      </div>

      {/* Confidence Progress Bar */}
      <div className="mt-8 relative z-10">
        <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-neutral-500 mb-2.5 uppercase tracking-wide">
          <span>Confidence Threshold</span>
          <span>High Probability</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              status === 'normal' 
                ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : status === 'moderate' 
                  ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Clinical Explanation & Educational support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-8 border-t border-slate-150 dark:border-neutral-800/60 text-sm relative z-10">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400 dark:text-neutral-500 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            AI Findings
          </span>
          <p id="explanation-text" className="text-slate-600 dark:text-neutral-300 leading-relaxed text-xs">
            {explanation}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/45 border border-slate-200/50 dark:border-neutral-800/35 space-y-1.5 text-xs">
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400 dark:text-neutral-500">
            Actionable Guidance
          </span>
          <p id="recommendation-text" className="text-slate-550 dark:text-neutral-400 leading-relaxed">
            {currentTheme.recommendation}
          </p>
        </div>
      </div>

    </div>
  );
}
