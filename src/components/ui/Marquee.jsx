import { motion } from 'framer-motion';

/**
 * Marquee - Infinite scrolling text band for Awwwards-style aesthetic.
 */
const Marquee = ({ items = [], speed = 30 }) => {
  const content = items.join('  ✦  ');
  // Repeat content to ensure it spans much wider than the screen
  const repeatedContent = new Array(10).fill(content).join('  ✦  ');

  return (
    <div className="relative w-full overflow-hidden bg-primary border-y-2 border-border-strong py-6 my-16 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 z-0 bg-red/10 mix-blend-screen" />
      
      {/* Container must be wide enough to allow sliding */}
      <div className="flex whitespace-nowrap z-10">
        <motion.div
          className="flex whitespace-nowrap text-5xl md:text-7xl font-black font-mono uppercase tracking-tighter text-transparent cursor-default"
          style={{ WebkitTextStroke: '2px var(--color-accent)' }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        >
          <span className="mx-4 hover:text-accent transition-colors duration-500">{repeatedContent}</span>
          <span className="mx-4 hover:text-accent transition-colors duration-500">{repeatedContent}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
