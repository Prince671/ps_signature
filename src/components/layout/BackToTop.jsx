import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIdle from '../../hooks/useIdle';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const isIdle = useIdle(3000); // 3 seconds timeout

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ 
                        opacity: isIdle ? 0 : 1, 
                        scale: isIdle ? 0.9 : 1, 
                        y: isIdle ? 10 : 0 
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    className={`fixed left-4 sm:left-6 z-40 p-3 w-12 h-12 flex items-center justify-center bg-primary border-2 border-border-strong text-accent transition-all duration-500 hover:border-red hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-red)] rounded-full group ${isIdle ? 'pointer-events-none' : ''}`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
                    aria-label="Back to top"
                >
                    <svg
                        className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 11l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
