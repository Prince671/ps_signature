import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * HorizontalScroll — converts vertical scroll into horizontal movement.
 * The container is pinned (sticky) while scrolling through panelCount panels.
 * Each child panel should be 100vw wide.
 */
const HorizontalScroll = ({ children, panelCount = 3 }) => {
  const containerRef = useRef(null);
  const [useVerticalLayout, setUseVerticalLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');
    const updateLayout = () => setUseVerticalLayout(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    ['0%', `-${(panelCount - 1) * 100}%`]
  );

  return (
    <section
      ref={containerRef}
      style={{ height: useVerticalLayout ? 'auto' : `${panelCount * 100}vh` }}
      className="relative portfolio-project-scroll"
    >
      <div className={useVerticalLayout ? 'relative h-auto' : 'sticky top-0 h-screen overflow-hidden'}>
        <motion.div
          style={{ x: useVerticalLayout ? 0 : x }}
          className={`portfolio-project-track ${useVerticalLayout ? 'flex flex-col h-auto' : 'flex h-full'}`}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
