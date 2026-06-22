import { TrendingUp, Award, Clock, Database, Users, Globe } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useEffect, useState } from 'react';

const METRICS = [
  { icon: TrendingUp, value: 94, suffix: '%', label: 'Akurasi Model', description: 'Akurasi klasifikasi pada dataset testing ECG', color: 'text-emerald-500' },
  { icon: Award, value: 3, suffix: '', label: 'Model AI', description: 'VGG16, ResNet34, dan DenseNet121 ensemble', color: 'text-primary-500' },
  { icon: Clock, value: 0.6, suffix: 's', label: 'Inference Time', description: 'Rata-rata waktu analisis per gambar ECG', color: 'text-violet-500' },
  { icon: Database, value: 10, suffix: '', label: 'ECG Metrics', description: 'Parameter klinis yang diprediksi secara real-time', color: 'text-amber-500' },
  { icon: Users, value: 3, suffix: '', label: 'Kelas Prediksi', description: 'Normal, Myocardial Infarction, Other Heart Disease', color: 'text-rose-500' },
  { icon: Globe, value: 224, suffix: 'px', label: 'Input Resolution', description: 'Resolusi standar preprocessing untuk semua model', color: 'text-cyan-500' },
];

function AnimatedNumber({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const startTime = Date.now();
    const isFloat = target % 1 !== 0;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      setCurrent(isFloat ? parseFloat(value.toFixed(1)) : Math.floor(value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return (
    <span
      ref={(el) => {
        if (!el || started) return;
        const obs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
          { threshold: 0.5 }
        );
        obs.observe(el);
      }}
    >
      {current}{suffix}
    </span>
  );
}

export function StatsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 gradient-bg-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-400/20 bg-primary-500/10 text-primary-300 text-xs font-bold uppercase tracking-widest mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Performance Metrics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Angka yang <span className="gradient-text">Berbicara</span>
          </h2>
          <p className="mt-5 text-lg text-slate-300 leading-relaxed">
            Transparansi penuh tentang performa dan kapabilitas platform AI kami.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`group p-6 lg:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/15 transition-all duration-500 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <Icon className={`w-7 h-7 ${metric.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <p className={`text-3xl lg:text-4xl font-black ${metric.color} font-mono tracking-tighter mb-1`}>
                  <AnimatedNumber target={metric.value} suffix={metric.suffix} />
                </p>
                <p className="text-sm font-bold text-white mb-1.5">
                  {metric.label}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
