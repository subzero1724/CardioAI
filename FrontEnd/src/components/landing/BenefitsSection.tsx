import { Link } from 'react-router-dom';
import {
  Clock, Wallet, Globe, Stethoscope,
  ChevronRight, HeartPulse, GraduationCap, Accessibility,
} from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const BENEFITS = [
  {
    icon: Clock,
    title: 'Screening Cepat & Efisien',
    description: 'Analisis ECG selesai dalam hitungan detik — bukan jam atau hari. Ideal untuk screening awal di klinik atau rumah sakit.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Wallet,
    title: 'Hemat Biaya',
    description: 'Mengurangi ketergantungan pada konsultasi spesialis untuk screening awal. AI membantu memprioritaskan pasien yang membutuhkan perhatian segera.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Akses di Mana Saja',
    description: 'Platform berbasis web yang dapat diakses dari perangkat apa pun. Tidak perlu instalasi software khusus atau hardware mahal.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Stethoscope,
    title: 'Mendukung Tenaga Medis',
    description: 'Bukan menggantikan, tapi mendukung keputusan klinis. AI memberikan second opinion yang objektif untuk setiap pemeriksaan ECG.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: GraduationCap,
    title: 'Edukasi Kesehatan',
    description: 'Setiap hasil analisis disertai penjelasan yang mudah dipahami. Membantu pasien memahami kondisi jantung mereka sendiri.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Accessibility,
    title: 'Mudah Digunakan',
    description: 'Interface intuitif yang dirancang untuk semua kalangan — dari tenaga medis profesional hingga pengguna awam.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

export function BenefitsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 lg:py-32 bg-white dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50/40 dark:bg-emerald-950/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Header + CTA */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <HeartPulse className="w-3.5 h-3.5" />
              Keunggulan Platform
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
              Mengapa Memilih{' '}
              <span className="gradient-text">CardioAI?</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-neutral-400 leading-relaxed mb-8">
              Platform kami dirancang untuk memberikan screening ECG yang cepat, akurat, dan mudah diakses oleh siapa saja — dari tenaga medis hingga masyarakat umum.
            </p>
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-xl shadow-primary-600/20 hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <HeartPulse className="w-5 h-5" />
              Mulai Analisis ECG
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`group p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 hover:shadow-lg hover:border-slate-300 dark:hover:border-neutral-700 transition-all duration-500 hover:-translate-y-0.5 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${index * 80 + 200}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
