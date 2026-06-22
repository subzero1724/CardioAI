import { Brain, Layers, Target, Microscope, Sparkles, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const ABOUT_ITEMS = [
  {
    icon: Brain,
    title: 'Deep Learning AI',
    description: 'Menggunakan jaringan saraf tiruan (neural network) yang mempelajari pola-pola ECG dari ribuan data pasien untuk mengenali kelainan jantung dengan akurasi tinggi.',
    color: 'from-primary-500 to-primary-600',
    bg: 'bg-primary-50 dark:bg-primary-950/30',
  },
  {
    icon: Layers,
    title: 'Ensemble Model',
    description: 'Menggabungkan 3 arsitektur deep learning terbaik (VGG16, ResNet34, DenseNet121) dengan teknik soft-voting untuk menghasilkan prediksi yang lebih stabil dan akurat.',
    color: 'from-accent-500 to-accent-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    icon: Target,
    title: 'Multitask Learning',
    description: 'AI kami tidak hanya mengklasifikasikan kondisi jantung, tapi juga memprediksi 10 parameter ECG penting secara bersamaan (HR, QRS, QTc, dan lainnya).',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: Microscope,
    title: 'Analisis Gambar ECG',
    description: 'Cukup upload foto atau scan ECG — AI akan memproses gambar secara otomatis menjadi prediksi diagnosis dan metrik klinis yang mudah dipahami.',
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
  },
  {
    icon: Sparkles,
    title: 'Real-time Inference',
    description: 'Proses analisis berlangsung dalam hitungan detik. Sistem mendukung GPU acceleration untuk kinerja optimal pada skala besar.',
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: ShieldCheck,
    title: 'Screening Terpercaya',
    description: 'Dikembangkan dengan riset mendalam dan validasi terhadap dataset klinis. Dirancang sebagai alat bantu screening awal yang mendukung keputusan medis.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

export function AboutAISection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-white dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Brain className="w-3.5 h-3.5" />
            Tentang Teknologi AI Kami
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Kekuatan <span className="gradient-text">Artificial Intelligence</span> untuk Kesehatan Jantung
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            Platform kami menggunakan teknologi deep learning terbaru untuk menganalisis gambar ECG dan memberikan insight klinis yang bermakna — semua dalam hitungan detik.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ABOUT_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group relative p-7 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl hover:shadow-primary-600/5 transition-all duration-500 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${item.color} bg-clip-text`} style={{ color: 'var(--tw-gradient-from)' }} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
