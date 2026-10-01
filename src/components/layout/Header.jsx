import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import MagneticWrapper from '../ui/MagneticWrapper.jsx';

const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Activity', id: 'activity' },
  { label: 'Education', id: 'education' },
  { label: 'Certs', id: 'certificates' },
  { label: 'Contact', id: 'contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: highlight the nav link for the section currently in view
  useEffect(() => {
    const sections = NAV_LINKS
      .map(link => document.getElementById(link.id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      if (window.lenis) {
        window.lenis.scrollTo(element, { offset: -70, duration: 1.1 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  }, []);

  const headerVariants = {
    initial: { y: -100 },
    animate: { y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  const resumeUrl = import.meta.env.VITE_RESUME_URL || '/resume.pdf';

  return (
    <>
      <motion.header
        id="main-header"
        className={`fixed top-0 left-0 right-0 transition-all duration-500 z-50 ${scrolled
            ? 'py-2'
            : 'bg-transparent py-4'
          }`}
        style={scrolled ? {
          backgroundColor: 'var(--color-primary)',
          borderBottom: '2px solid var(--color-border-strong)',
        } : {}}
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="w-full px-4 md:px-10 flex items-center justify-between h-16 relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 cursor-pointer shrink-0"
            onClick={() => scrollToSection('home')}
          >
            <div
              className="flex items-center justify-center w-10 h-10 border-2 transition-transform duration-500 hover:-translate-y-0.5"
              style={{
                background: 'var(--color-red)',
                borderColor: 'var(--color-border-strong)',
                borderRadius: '0px',
                boxShadow: '4px 4px 0px var(--color-border-strong)',
                transform: 'translate(-2px, -2px)',
              }}
            >
              <span className="text-sm font-black tracking-tight text-white font-mono">PS</span>
            </div>
            <div className="hidden lg:block">
              <span className="font-mono text-[10px] tracking-[0.5em] text-accent uppercase font-bold">
                DEVELOPER PORTFOLIO
              </span>
            </div>
          </motion.div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 mx-2 lg:mx-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-2.5 lg:px-3.5 py-2 font-mono text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  activeSection === link.id ? 'text-red' : 'text-muted hover:text-accent'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute left-2.5 right-2.5 lg:left-3.5 lg:right-3.5 -bottom-0.5 h-[2px] bg-red"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 ml-auto">
            {/* Command Palette / Search Bar */}
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 border-2 border-border-strong text-muted hover:border-accent hover:text-accent transition-all duration-300 cursor-text group mr-2"
              style={{ backgroundColor: 'var(--color-primary)', boxShadow: '4px 4px 0px var(--color-border-strong)' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-red transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">Terminal...</span>
              <kbd className="ml-4 px-1.5 py-0.5 text-[9px] font-mono border border-border-strong text-accent opacity-60">⌘K</kbd>
            </div>

            {/* Separate Resume Button */}
            <MagneticWrapper strength={0.4}>
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="px-3 lg:px-4 py-1.5 bg-red text-white font-mono text-[9px] lg:text-[10px] font-bold tracking-widest uppercase border-2 border-accent hover:translate-y-[-2px] hover:shadow-[4px 4px 0px_var(--color-accent)] transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-red)',
                  borderColor: 'var(--color-accent)',
                  boxShadow: scrolled ? '2px 2px 0px var(--color-accent)' : '3px 3px 0px var(--color-accent)',
                }}
              >
                RESUME
              </motion.a>
            </MagneticWrapper>

            <ThemeToggle />
          </div>

          {/* Mobile Nav Actions */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <ThemeToggle />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent p-2 focus:outline-none z-[70] border-2 border-border-strong relative w-10 h-10 flex items-center justify-center"
              style={{ boxShadow: '2px 2px 0px var(--color-border-strong)', backgroundColor: 'var(--color-primary)' }}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block h-[2px] w-full bg-current origin-center"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block h-[2px] w-full bg-current"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block h-[2px] w-full bg-current origin-center"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] md:hidden"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <div className="h-full flex flex-col justify-center px-8 pt-16">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-left py-3 font-mono text-3xl font-black uppercase tracking-tight border-b-2 transition-colors duration-300 ${
                      activeSection === link.id ? 'text-red border-red' : 'text-accent border-border-strong/40'
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-10 flex items-center gap-3"
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-3 bg-red text-white font-mono text-xs font-bold tracking-widest uppercase border-2 border-accent"
                >
                  Resume
                </a>
                <button
                  onClick={() => { window.dispatchEvent(new CustomEvent('open-terminal')); setMenuOpen(false); }}
                  className="px-4 py-3 border-2 border-border-strong text-muted font-mono text-xs font-bold tracking-widest uppercase hover:text-accent hover:border-accent transition-colors duration-300"
                >
                  Terminal
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
