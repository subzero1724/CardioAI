import { Link } from 'react-router-dom';
import {
  Activity, Heart, Mail, MapPin, Phone,
  Github, Linkedin, Twitter,
} from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'ECG Analyzer', href: '/analyzer' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Demo', href: '/analyzer' },
  ],
  Company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Our Mission', href: '/#about' },
    { label: 'Research', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ],
  Resources: [
    { label: 'FAQ', href: '/#faq' },
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 transition-colors duration-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Activity className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Cardio<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed max-w-sm">
              Platform AI analisis ECG berbasis deep learning ensemble untuk deteksi dini penyakit jantung. Dikembangkan untuk mendukung screening kesehatan jantung yang lebih cepat dan akurat.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:contact@cardioai.id" className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4" />
                contact@cardioai.id
              </a>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-neutral-400">
                <Phone className="w-4 h-4" />
                +62 812 3456 7890
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-neutral-400">
                <MapPin className="w-4 h-4" />
                Jakarta, Indonesia
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Github, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center justify-center text-slate-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-neutral-200">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 dark:text-neutral-500">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="text-xs font-medium">
                © {new Date().getFullYear()} CardioAI. All rights reserved.
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-neutral-600 text-center md:text-right max-w-lg leading-relaxed uppercase tracking-wider font-medium">
              CardioAI adalah platform screening untuk tujuan edukasi dan penelitian. Tidak menggantikan diagnosis medis profesional.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
