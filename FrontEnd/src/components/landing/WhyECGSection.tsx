import { Heart, AlertTriangle, Clock, Activity, TrendingUp, Users } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const STATS = [
  {
    icon: Heart,
    value: '17.9 Juta',
    label: 'Kematian akibat penyakit kardiovaskular setiap tahun di dunia',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
  },
  {
    icon: AlertTriangle,
    value: '80%',
    label: 'Kasus penyakit jantung bisa dicegah dengan deteksi dini dan gaya hidup sehat',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Clock,
    value: '< 1 Detik',
    label: 'Waktu yang dibutuhkan AI untuk menganalisis satu gambar ECG',
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-950/30',
  },
  {
    icon: TrendingUp,
    value: '94%',
    label: 'Akurasi ensemble model AI dalam mengklasifikasikan kondisi jantung',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

const REASONS = [
  {
    icon: Heart,
    title: 'Penyakit Jantung — Pembunuh #1 Dunia',
    description: 'Penyakit kardiovaskular adalah penyebab utama kematian secara global. ECG (Elektrokardiogram) adalah alat utama untuk mendeteksi masalah jantung sebelum terlambat.',
  },
  {
    icon: Activity,
    title: 'ECG Mendeteksi Apa yang Tidak Terlihat',
    description: 'Banyak kelainan jantung bersifat silent — tanpa gejala yang terasa. ECG dapat mengungkap gangguan irama, kerusakan otot jantung, dan risiko tersembunyi lainnya.',
  },
  {
    icon: Users,
    title: 'Akses Screening untuk Semua',
    description: 'Dengan bantuan AI, screening ECG tidak lagi harus bergantung sepenuhnya pada ketersediaan dokter spesialis. Platform ini membuka akses analisis awal untuk siapa saja.',
  },
];

export function WhyECGSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 lg:py-32 bg-slate-50 dark:bg-neutral-900/50 transition-colors duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/20 dark:bg-rose-900/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5" />
            Mengapa ECG Penting
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Setiap Detak Jantung <span className="gradient-text">Menceritakan Sesuatu</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            ECG adalah jendela ke kesehatan jantung Anda. Deteksi dini bisa menyelamatkan nyawa — dan AI membuatnya lebih cepat dari sebelumnya.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                className={`relative p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className={`text-2xl lg:text-3xl font-black ${stat.color} mb-1.5`}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className={`p-7 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-700 hover:shadow-lg ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 120 + 500}ms` }}
              >
                <Icon className="w-8 h-8 text-rose-500 mb-4" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">
                  {reason.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
