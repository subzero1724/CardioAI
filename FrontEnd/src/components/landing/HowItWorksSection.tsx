import { Upload, Cpu, BarChart3, FileCheck, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const STEPS = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Gambar ECG',
    description: 'Upload gambar ECG dari scan kertas, foto kamera, atau file digital. Sistem menerima format JPEG dan PNG hingga 10MB.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Memproses Gambar',
    description: 'Gambar dipreprocess (resize 224×224, normalisasi ImageNet) lalu dianalisis oleh 3 model deep learning secara bersamaan.',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Ensemble Voting',
    description: 'Hasil dari VGG16, ResNet34, dan DenseNet121 digabungkan dengan teknik soft-voting untuk klasifikasi dan averaging untuk regresi.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    step: '04',
    icon: FileCheck,
    title: 'Hasil & Insight',
    description: 'Dapatkan diagnosis AI, confidence score, 10 parameter ECG, penjelasan klinis, dan rekomendasi tindak lanjut — semua dalam hitungan detik.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-slate-50 dark:bg-neutral-900/50 transition-colors duration-300 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu className="w-3.5 h-3.5" />
            Cara Kerja
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Dari Upload hingga{' '}
            <span className="gradient-text">Diagnosis AI</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            Hanya 4 langkah sederhana dari gambar ECG ke insight klinis yang actionable.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 via-amber-200 to-emerald-200 dark:from-blue-800/50 dark:via-violet-800/50 dark:via-amber-800/50 dark:to-emerald-800/50" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                <div className="relative p-7 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Step number */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg relative z-10`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-300 dark:text-neutral-600 mb-2 uppercase tracking-widest">
                    Step {step.step}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps (mobile/tablet) */}
                {index < STEPS.length - 1 && (
                  <div className="lg:hidden flex justify-center py-3">
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-neutral-600 rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
