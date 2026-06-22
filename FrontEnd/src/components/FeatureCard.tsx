import { EcgFeatures } from '../types/ecg';
import { FEATURE_METADATA_MAP, formatMetric } from '../utils/format';
import { Check, ShieldAlert, Heart } from 'lucide-react';

interface FeatureCardProps {
  features: EcgFeatures;
}

export function FeatureCard({ features }: FeatureCardProps) {
  
  // Helper to examine if a metric value is within physiological standard ranges
  const checkMetricHealth = (key: keyof EcgFeatures, value: number) => {
    switch (key) {
      case 'HR':
        return value >= 60 && value <= 100 ? 'normal' : 'abnormal';
      case 'RR':
        return value >= 0.6 && value <= 1.0 ? 'normal' : 'abnormal';
      case 'PR':
        // 0 when absent (AFib) -> abnormal
        return value >= 120 && value <= 200 ? 'normal' : 'abnormal';
      case 'QRS':
        return value >= 70 && value <= 110 ? 'normal' : 'abnormal';
      case 'QT':
        return value >= 350 && value <= 440 ? 'normal' : 'abnormal';
      case 'QTc':
        return value < 450 ? 'normal' : 'abnormal';
      case 'AXIS':
        return value >= -30 && value <= 100 ? 'normal' : 'abnormal';
      case 'RV5':
        return value < 2.5 ? 'normal' : 'abnormal';
      case 'SV1':
        return value < 1.5 ? 'normal' : 'abnormal';
      case 'R_plus_S':
        return value < 3.5 ? 'normal' : 'abnormal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-400 dark:text-neutral-500">
          Extracted Clinical Parameters
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.keys(FEATURE_METADATA_MAP) as Array<keyof EcgFeatures>).map((key) => {
          const value = features[key];
          const meta = FEATURE_METADATA_MAP[key];
          const health = checkMetricHealth(key, value);
          const formattedVal = formatMetric(value, key);

          return (
            <div
              key={key}
              className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-4 shadow-sm hover:border-blue-200 dark:hover:border-neutral-700 hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between"
            >
              {/* Metric label & status dot */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                  {meta.label}
                </span>
                
                {/* Health indicator */}
                {value === 0 && key === 'PR' ? (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" title="Absent" />
                ) : health === 'normal' ? (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" title="Normal Range" />
                ) : (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" title="Outside standard limit" />
                )}
              </div>

              {/* Value and unit */}
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800 dark:text-neutral-50 font-mono tracking-tight">
                  {formattedVal}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-500 font-mono">
                  {meta.unit}
                </span>
              </div>

              {/* Metric readable name */}
              <p className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500 mt-1 truncate">
                {meta.name}
              </p>

              {/* Range helper */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-neutral-800/60 flex items-center justify-between text-[9px] font-mono text-slate-450 dark:text-neutral-500">
                <span>Ref:</span>
                <span className="font-semibold">{meta.normalRange}</span>
              </div>

              {/* Custom tooltip helper for non-technical clients */}
              <div className="absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-950 dark:bg-neutral-800 text-white rounded-lg p-2.5 shadow-lg text-[10px] z-20 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <span>{meta.name}</span>
                  {value === 0 && key === 'PR' ? (
                    <span className="text-red-400 font-semibold">(Absent)</span>
                  ) : health === 'normal' ? (
                    <span className="text-emerald-400 font-semibold">(Normal)</span>
                  ) : (
                    <span className="text-amber-400 font-semibold">(Out of range)</span>
                  )}
                </div>
                <p className="font-sans leading-normal text-slate-300">{meta.description}</p>
              </div>

            </div>
          );
        })}

        {/* Export PDF Slate Interactive Button directly in the card grid */}
        <button
          type="button"
          onClick={() => alert("Simulated ECG Analysis PDF report generation completed. Ready for local storage.")}
          className="bg-slate-900 hover:bg-slate-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 text-white rounded-2xl border border-slate-850 dark:border-neutral-800 p-4 shadow-md flex items-center justify-center text-center cursor-pointer hover:scale-[1.01] transition-all duration-200"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-100 dark:text-neutral-200 block">
              Export PDF
            </span>
            <span className="text-[9px] font-mono text-slate-400 dark:text-neutral-500 block">
              Clinical Report
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
