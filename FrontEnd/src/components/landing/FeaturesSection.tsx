import {
  Upload, Cpu, BarChart3, ShieldCheck,
  Layers, Zap, Gauge, FileSearch,
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload ECG Image',
    description: 'Drag & drop atau upload gambar ECG dalam format JPEG/PNG. Mendukung scan kertas maupun foto digital.',
    gradient: 'from-blue-500 to-cyan-500',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  {
    icon: Cpu,
    title: 'AI Classification',
    description: 'Klasifikasi otomatis menjadi 3 kategori: Normal, Myocardial Infarction, dan Other Heart Disease.',
    gradient: 'from-violet-500 to-purple-500',
    hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-700',
  },
  {
    icon: BarChart3,
    title: 'ECG Metrics Prediction',
    description: 'Prediksi 10 parameter klinis ECG: HR, RR, PR, QRS, QT, QTc, Axis, RV5, SV1, dan R+S.',
    gradient: 'from-emerald-500 to-teal-500',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  {
    icon: Gauge,
    title: 'Confidence Score',
    description: 'Setiap prediksi dilengkapi skor confidence (%) yang menunjukkan tingkat keyakinan AI terhadap hasil analisis.',
    gradient: 'from-amber-500 to-orange-500',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
  {
    icon: Layers,
    title: 'Ensemble AI',
    description: 'Gabungan VGG16, ResNet34, dan DenseNet121 dengan soft-voting memberikan prediksi yang stabil dan andal.',
    gradient: 'from-pink-500 to-rose-500',
    hoverBorder: 'hover:border-pink-300 dark:hover:border-pink-700',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Analisis selesai dalam hitungan detik. Mendukung GPU acceleration untuk performa optimal di production.',
    gradient: 'from-indigo-500 to-blue-500',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
  },
  {
    icon: ShieldCheck,
    title: 'Status Diagnosis',
    description: 'Hasil ditampilkan dengan kode warna (hijau/kuning/merah) sehingga mudah dipahami oleh siapa saja.',
    gradient: 'from-teal-500 to-emerald-500',
    hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-700',
  },
  {
    icon: FileSearch,
    title: 'Clinical Insights',
    description: 'Setiap analisis disertai penjelasan klinis, panduan tindak lanjut, dan edukasi kesehatan jantung.',
    gradient: 'from-sky-500 to-blue-500',
    hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-700',
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-white dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary-50/50 dark:bg-primary-950/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5" />
            Fitur Platform
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Fitur Lengkap untuk{' '}
            <span className="gradient-text">Analisis ECG</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            Dari upload gambar hingga insight klinis — semua tersedia dalam satu platform AI yang powerful.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 ${feature.hoverBorder} hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-500 hover:-translate-y-1.5 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
