import { useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, CalendarCheck } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would POST to backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-white dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-50/30 dark:bg-primary-950/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Mail className="w-3.5 h-3.5" />
            Hubungi Kami
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Tertarik <span className="gradient-text">Berkolaborasi?</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            Kami terbuka untuk kolaborasi riset, integrasi API, dan kemitraan di bidang kesehatan digital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Info Cards */}
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'contact@cardioai.id', href: 'mailto:contact@cardioai.id' },
                { icon: Phone, label: 'Phone', value: '+62 812 3456 7890', href: 'tel:+6281234567890' },
                { icon: MapPin, label: 'Location', value: 'Jakarta, Indonesia', href: '#' },
                { icon: CalendarCheck, label: 'Demo Request', value: 'Jadwalkan demo gratis', href: '#' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-neutral-200">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 h-48 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-slate-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 dark:text-neutral-500 font-medium">
                  Jakarta, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" />
                Kirim Pesan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Nama</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama lengkap"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@contoh.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm text-slate-800 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                >
                  <option value="">Pilih topik...</option>
                  <option value="demo">Request Demo</option>
                  <option value="api">API Integration</option>
                  <option value="research">Kolaborasi Riset</option>
                  <option value="partnership">Kemitraan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Pesan</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tulis pesan Anda..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  submitted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-500 hover:to-accent-500 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 hover:-translate-y-0.5'
                }`}
              >
                {submitted ? (
                  <>✓ Pesan Terkirim!</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
