import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsub = scrollYProgress.on('change', (v) => {
            setVisible(v > 0.01);
        });
        return unsub;
    }, [scrollYProgress]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-[200] origin-left pointer-events-none"
            style={{
                scaleX,
                height: '2px',
                background: 'var(--color-red)',
                opacity: visible ? 1 : 0,
                transformOrigin: '0%',
                transition: 'opacity 0.3s ease',
            }}
        />
    );
};

export default ScrollProgress;
