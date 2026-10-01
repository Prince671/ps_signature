import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Certificate data.
 * 'image' — path to a preview image in /public/certs/ (PNG or JPG).
 *   If the image is missing, a branded fallback placeholder is shown.
 * 'link'  — URL to the original certificate for verification / download.
 */
const CERTS = [
  {
    title: 'React',
    provider: 'HackerRank',
    image: '/certs/cert-react.png',
    link: 'https://www.hackerrank.com/certificates/35ee02b0b93a',
    year: '2024',
    color: '#61DAFB',
  },
  {
    title: 'SQL (Basic)',
    provider: 'HackerRank',
    image: '/certs/cert-sql.png',
    link: 'https://www.hackerrank.com/certificates/f5b17d53a49c',
    year: '2024',
    color: '#F29111',
  },
  {
    title: 'Problem Solving',
    provider: 'HackerRank',
    image: '/certs/cert-problem-solving.png',
    link: 'https://www.hackerrank.com/certificates/f5b17d53a49c',
    year: '2024',
    color: '#2EC866',
  },
  {
    title: 'Python',
    provider: 'HackerRank',
    image: '/certs/cert-python.png',
    link: 'https://www.hackerrank.com/certificates/f5b17d53a49c',
    year: '2024',
    color: '#3776AB',
  },
  {
    title: 'Java',
    provider: 'HackerRank',
    image: '/certs/cert-java.png',
    link: 'https://www.hackerrank.com/certificates/eee596a882d9',
    year: '2024',
    color: '#F89820',
  },
  {
    title: 'Cloud Engineer',
    provider: 'Certificate',
    image: '/certs/cert-cloud.png',
    link: 'https://drive.google.com/file/d/1o2xCO4B6yP87AjjMYJhtvyAa7z7jljI2/view',
    year: '2024',
    color: '#4285F4',
  },
];

/* ── Fallback placeholder SVG when a cert image is missing ── */
const CertPlaceholder = ({ title, provider, color }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-3 select-none"
    style={{ background: `${color}10`, border: `1px solid ${color}30` }}
    aria-label={`${title} certificate placeholder`}
  >
    {/* Award icon */}
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="8" r="6" />
      <path d="M9.09 16.88 8 22l4-2.5 4 2.5-1.09-5.12" />
    </svg>
    <div className="text-center px-4">
      <div className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color }}>{title}</div>
      <div className="font-mono text-[10px] text-muted uppercase tracking-widest mt-1">{provider}</div>
    </div>
    <div
      className="font-mono text-[9px] tracking-widest px-2 py-0.5 border"
      style={{ color: `${color}80`, borderColor: `${color}30` }}
    >
      VERIFIED · {provider.toUpperCase()}
    </div>
  </div>
);

/* ── Single cert card ── */
const CertCard = ({ cert, index, onExpand }) => {
  const [imgState, setImgState] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] }}
      className="nothing-card hover-lift bg-secondary/30 overflow-hidden flex flex-col group cursor-pointer"
      onClick={() => onExpand(cert)}
      onKeyDown={(e) => e.key === 'Enter' && onExpand(cert)}
      tabIndex={0}
      role="button"
      aria-label={`View ${cert.title} certificate from ${cert.provider}`}
    >
      {/* Preview area */}
      <div className="relative w-full aspect-[4/3] bg-black/40 border-b-2 border-border-strong overflow-hidden">
        {/* Loading spinner */}
        {imgState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-red border-t-transparent rounded-full animate-spin" aria-hidden />
          </div>
        )}

        {/* Certificate image */}
        {imgState !== 'error' && (
          <img
            src={cert.image}
            alt={`${cert.title} certificate issued by ${cert.provider}`}
            className="w-full h-full object-cover"
            style={{
              opacity: imgState === 'loaded' ? 1 : 0,
              transition: 'opacity 0.5s ease',
              filter: 'grayscale(20%)',
            }}
            onLoad={() => setImgState('loaded')}
            onError={() => setImgState('error')}
            loading="lazy"
          />
        )}

        {/* Fallback placeholder */}
        {imgState === 'error' && (
          <CertPlaceholder title={cert.title} provider={cert.provider} color={cert.color} />
        )}

        {/* Expand overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-primary/90 border border-border-strong px-3 py-1.5 font-mono text-[10px] tracking-widest text-accent uppercase">
            Click to Expand
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-mono text-sm font-bold text-accent uppercase tracking-tight">{cert.title}</div>
          <div className="font-mono text-[10px] text-muted uppercase tracking-widest mt-0.5">
            {cert.provider} · {cert.year}
          </div>
        </div>
        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-red transition-colors duration-300 p-1"
          title={`Verify ${cert.title} certificate`}
          aria-label={`Verify ${cert.title} certificate externally`}
          onClick={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

/* ── Lightbox Modal ── */
const CertModal = ({ cert, onClose }) => {
  const [imgState, setImgState] = useState('loading');
  const shouldReduceMotion = useReducedMotion();

  // Trap focus & close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate enlarged view`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" aria-hidden />

      {/* Modal content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={shouldReduceMotion ? false : { scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between bg-primary border-2 border-border-strong px-4 py-3 mb-0">
          <div>
            <div className="font-mono text-sm font-bold text-accent uppercase">{cert.title}</div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest">{cert.provider} · {cert.year}</div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-widest uppercase text-muted hover:text-red transition-colors flex items-center gap-1.5"
              aria-label={`Open original ${cert.title} certificate`}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Verify
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-border-strong text-muted hover:text-red hover:border-red transition-all font-mono"
              aria-label="Close certificate view"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative bg-black/60 border-2 border-t-0 border-border-strong" style={{ minHeight: '300px' }}>
          {imgState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" aria-hidden />
            </div>
          )}
          {imgState !== 'error' ? (
            <img
              src={cert.image}
              alt={`${cert.title} certificate issued by ${cert.provider}`}
              className="w-full h-auto"
              style={{ opacity: imgState === 'loaded' ? 1 : 0, transition: 'opacity 0.4s ease' }}
              onLoad={() => setImgState('loaded')}
              onError={() => setImgState('error')}
            />
          ) : (
            <div className="w-full" style={{ minHeight: '260px' }}>
              <CertPlaceholder title={cert.title} provider={cert.provider} color={cert.color} />
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="bg-primary border-2 border-t-0 border-border-strong px-4 py-2">
          <p className="font-mono text-[10px] text-muted tracking-widest">
            Click &quot;Verify&quot; to open the original certificate on {cert.provider} for independent verification.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Certificates section ── */
const Certificates = () => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [expandedCert, setExpandedCert] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setIsInView(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleExpand = useCallback((cert) => setExpandedCert(cert), []);
  const handleClose = useCallback(() => setExpandedCert(null), []);

  return (
    <>
      <section id="certificates" className="section-padding bg-transparent relative overflow-hidden">
        <div className="container-custom w-full" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <h4 className="font-mono text-sm text-muted tracking-widest uppercase mb-2">
              <span className="text-red">// 04</span> &mdash; VERIFIED CREDENTIALS
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">
              <span className="glitch-hover" data-text="CERTIFICATES">CERTIFICATES</span>
            </h2>
            <div className="w-16 h-[2px]" style={{ backgroundColor: 'var(--color-red)', opacity: 0.6 }} />
            <p className="font-mono text-xs text-muted mt-4 max-w-lg">
              Click any card to preview the certificate. Hit the arrow icon to verify it independently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTS.map((cert, i) => (
              <CertCard
                key={i}
                cert={cert}
                index={i}
                onExpand={handleExpand}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {expandedCert && (
          <CertModal cert={expandedCert} onClose={handleClose} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Certificates;
