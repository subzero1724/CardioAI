import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const FAQ_ITEMS = [
  {
    question: 'Apa itu CardioAI?',
    answer: 'CardioAI adalah platform screening ECG berbasis artificial intelligence yang menggunakan ensemble deep learning (VGG16, ResNet34, DenseNet121) untuk menganalisis gambar ECG dan mendeteksi kemungkinan kelainan jantung. Platform ini dirancang sebagai alat bantu screening awal, bukan pengganti diagnosis medis profesional.',
  },
  {
    question: 'Seberapa akurat hasil analisis AI?',
    answer: 'Model ensemble kami mencapai akurasi sekitar 94% pada dataset testing. Namun, perlu diingat bahwa ini adalah alat screening dan bukan pengganti pemeriksaan medis profesional. Hasil analisis sebaiknya dikonsultasikan dengan dokter atau kardiolog.',
  },
  {
    question: 'Format gambar ECG apa saja yang didukung?',
    answer: 'Platform mendukung gambar dalam format JPEG dan PNG dengan ukuran maksimal 10MB. Anda bisa upload scan kertas ECG, foto ECG dari kamera, atau file digital ECG. Semakin jelas dan kontras gambarnya, semakin baik hasil analisisnya.',
  },
  {
    question: 'Apakah data ECG saya aman?',
    answer: 'Gambar ECG yang diupload hanya diproses untuk analisis dan tidak disimpan secara permanen di server kami. Kami mengutamakan privasi dan keamanan data medis pengguna.',
  },
  {
    question: 'Apa saja yang diprediksi oleh AI?',
    answer: 'AI kami memprediksi 2 hal utama: (1) Klasifikasi kondisi jantung ke dalam 3 kategori (Normal, Myocardial Infarction, Other Heart Disease) beserta confidence score, dan (2) 10 parameter klinis ECG (HR, RR, PR, QRS, QT, QTc, Axis, RV5, SV1, R+S) yang diekstrak dari gambar.',
  },
  {
    question: 'Bagaimana cara kerja Ensemble Model?',
    answer: 'Ensemble model menggabungkan prediksi dari 3 arsitektur deep learning yang berbeda (VGG16, ResNet34, DenseNet121). Untuk klasifikasi, kami menggunakan teknik soft-voting (rata-rata probabilitas). Untuk regresi parameter ECG, kami menggunakan rata-rata prediksi. Pendekatan ini menghasilkan prediksi yang lebih robust dan akurat dibanding single model.',
  },
  {
    question: 'Apakah platform ini gratis?',
    answer: 'Ya, platform demo ini tersedia secara gratis untuk tujuan edukasi dan screening awal. Untuk penggunaan enterprise, integrasi API, atau kolaborasi riset, silakan hubungi kami melalui form kontak.',
  },
  {
    question: 'Apakah platform ini bisa menggantikan dokter?',
    answer: 'Tidak. CardioAI adalah alat bantu screening awal yang dirancang untuk mendukung — bukan menggantikan — keputusan medis profesional. Jika Anda memiliki keluhan jantung, selalu konsultasikan dengan dokter atau kardiolog.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle, index }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      isOpen
        ? 'border-primary-200 dark:border-primary-800/50 bg-primary-50/30 dark:bg-primary-950/20 shadow-sm'
        : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-slate-300 dark:hover:border-neutral-700'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-6 text-left cursor-pointer group"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 ${
          isOpen
            ? 'bg-primary-500 text-white'
            : 'bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-500'
        }`}>
          <span className="text-xs font-bold font-mono">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="flex-1">
          <h3 className={`text-base font-bold transition-colors duration-300 ${
            isOpen ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-white'
          }`}>
            {question}
          </h3>
          <div className={`overflow-hidden transition-all duration-400 ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed pr-4">
              {answer}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 shrink-0 mt-0.5 text-slate-400 dark:text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
      </button>
    </div>
  );
}

export function FAQSection() {
  const { ref, isVisible } = useScrollReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-slate-50 dark:bg-neutral-900/50 transition-colors duration-300 overflow-hidden">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Pertanyaan yang{' '}
            <span className="gradient-text">Sering Ditanyakan</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 dark:text-neutral-400 leading-relaxed">
            Temukan jawaban untuk pertanyaan umum tentang CardioAI dan teknologi di baliknya.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 60 + 200}ms` }}
            >
              <FAQItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
