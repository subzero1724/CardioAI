import { Link } from 'react-router-dom';
import { ChevronRight, HeartPulse, ShieldCheck, BarChart3, Activity } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function DemoPreviewSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 lg:py-32 bg-white dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 dark:via-primary-950/10 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Activity className="w-3.5 h-3.5" />
            Live Demo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Lihat <span className="gradient-text">AI Beraksi</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            Coba langsung ECG Analyzer — upload gambar ECG dan lihat bagaimana AI kami memberikan analisis dalam hitungan detik.
          </p>
        </div>

        {/* Demo Preview Card */}
        <div className={`relative max-w-5xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          {/* Browser mockup frame */}
          <div className="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl shadow-slate-200/50 dark:shadow-neutral-950/50 overflow-hidden">
            {/* Browser top bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 dark:bg-neutral-950/50 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-8">
                <div className="h-7 bg-white dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700 flex items-center px-3">
                  <span className="text-xs text-slate-400 dark:text-neutral-500 font-mono truncate">
                    cardioai.id/analyzer
                  </span>
                </div>
              </div>
            </div>

            {/* Mock content */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-white dark:from-neutral-950 dark:to-neutral-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Upload zone preview */}
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-neutral-700 p-8 text-center bg-white/50 dark:bg-neutral-900/50">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center mb-4">
                      <HeartPulse className="w-7 h-7 text-primary-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-neutral-300 mb-1">
                      Upload ECG Image
                    </p>
                    <p className="text-xs text-slate-400 dark:text-neutral-500">
                      Drag & drop atau browse file
                    </p>
                  </div>

                  {/* Preset buttons preview */}
                  <div className="grid grid-cols-2 gap-2">
                    {['Normal', 'Tachycardia', 'LVH', 'AFib'].map((label, i) => (
                      <div key={label} className={`py-2 px-3 rounded-xl border text-xs font-medium ${
                        i === 0
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : i < 3
                            ? 'border-slate-200 bg-slate-50 text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500'
                            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500'
                      }`}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Result preview */}
                <div className="space-y-4">
                  {/* Diagnosis card */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">AI Prediction: Normal</span>
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white mb-3">Normal Sinus Rhythm</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-primary-600 dark:text-primary-400 font-mono">96.8%</span>
                      <span className="text-xs text-slate-400 dark:text-neutral-500 uppercase tracking-wider font-bold">Confidence</span>
                    </div>
                  </div>

                  {/* Metrics mini grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'HR', value: '72', unit: 'bpm' },
                      { label: 'QRS', value: '90', unit: 'ms' },
                      { label: 'QTc', value: '410', unit: 'ms' },
                    ].map((m) => (
                      <div key={m.label} className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-center">
                        <p className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-wider font-bold">{m.label}</p>
                        <p className="text-base font-black text-slate-800 dark:text-white">{m.value}</p>
                        <p className="text-[10px] text-slate-400 dark:text-neutral-500">{m.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 lg:-right-8 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xl p-3.5 flex items-center gap-2.5 animate-float">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">94% Accuracy</p>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500">Ensemble Model</p>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xl p-3.5 flex items-center gap-2.5 animate-float-delayed">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">10 ECG Metrics</p>
              <p className="text-[10px] text-slate-400 dark:text-neutral-500">Real-time Prediction</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-xl shadow-primary-600/20 hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <HeartPulse className="w-5 h-5" />
            Coba ECG Analyzer Sekarang
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-slate-400 dark:text-neutral-500">
            Gratis • Tanpa registrasi • Hasil instan
          </p>
        </div>
      </div>
    </section>
  );
}
