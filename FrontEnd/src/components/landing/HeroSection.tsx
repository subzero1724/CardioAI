import { Link } from 'react-router-dom';
import { ChevronRight, ArrowDown, Shield, Cpu, Zap, HeartPulse } from 'lucide-react';

export function HeroSection() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg-hero" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* ECG Line SVG Background */}
      <svg className="absolute bottom-0 left-0 right-0 w-full h-40 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path
          d="M0,50 L100,50 L150,50 L180,20 L200,80 L220,50 L300,50 L350,50 L380,15 L400,85 L420,50 L500,50 L550,50 L580,25 L600,75 L620,50 L700,50 L750,50 L780,10 L800,90 L820,50 L900,50 L950,50 L980,20 L1000,80 L1020,50 L1100,50 L1200,50"
          fill="none"
          stroke="url(#ecg-gradient)"
          strokeWidth="2"
          className="ecg-path"
        />
        <defs>
          <linearGradient id="ecg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-400/20 bg-primary-500/10 text-primary-300 text-xs font-semibold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Healthcare Technology
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Deteksi Dini{' '}
              <span className="gradient-text">Penyakit Jantung</span>{' '}
              dengan Kekuatan AI
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
              Platform analisis ECG berbasis <strong className="text-white">ensemble deep learning</strong> yang mampu mengidentifikasi kelainan jantung dari gambar ECG dalam hitungan detik.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-xl shadow-primary-600/25 hover:shadow-primary-500/35 transition-all duration-300 hover:-translate-y-0.5"
              >
                <HeartPulse className="w-5 h-5" />
                Coba Demo AI
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button
                onClick={scrollToAbout}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-slate-300 border border-slate-600/50 hover:bg-white/5 hover:border-slate-500/50 transition-all duration-300 cursor-pointer"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>AI Models Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-400" />
                <span>94% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent-400" />
                <span>3 Model Ensemble</span>
              </div>
            </div>
          </div>

          {/* Right: Floating Cards */}
          <div className="hidden lg:block relative h-[500px]" aria-hidden="true">
            {/* Main Card */}
            <div className="absolute top-12 right-0 w-80 glass rounded-3xl border border-white/10 p-6 shadow-2xl animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">AI Prediction</p>
                  <p className="text-sm font-bold text-white">Normal Sinus Rhythm</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-emerald-400 font-bold">96.8%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[96.8%] h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[{ label: 'HR', value: '72 bpm' }, { label: 'QRS', value: '90 ms' }, { label: 'QTc', value: '410 ms' }].map((m) => (
                    <div key={m.label} className="text-center p-2 bg-white/5 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{m.label}</p>
                      <p className="text-xs font-bold text-white mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Secondary Card */}
            <div className="absolute top-64 left-0 w-64 glass rounded-2xl border border-white/10 p-5 shadow-2xl animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-500/15 rounded-xl flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ensemble Model</p>
                  <p className="text-sm font-bold text-white">3 Deep Learning</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {['VGG16', 'ResNet34', 'DenseNet121'].map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                    <span className="text-xs text-slate-300 font-mono">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Card */}
            <div className="absolute top-0 left-20 w-52 glass rounded-2xl border border-white/10 p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">System Online</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                AI inference ready • GPU/CPU auto-detect • Real-time analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
