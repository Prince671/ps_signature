import React from 'react';
import { motion } from 'framer-motion';

const HoverImageLink = ({ heading, subheading }) => {
  return (
    <motion.div 
      initial="initial"
      whileHover="whileHover"
      data-cursor-text="VIEW"
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-border-strong py-8 md:py-12 transition-colors duration-500 hover:border-red cursor-default"
    >
      <div className="relative z-20 flex flex-col w-full md:w-auto pointer-events-none">
        <motion.span 
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 }
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.1
          }}
          className="relative z-10 block text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase text-light transition-colors duration-500 group-hover:text-red tracking-tighter"
        >
          {heading.split("").map((l, i) => (
            <motion.span 
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 }
              }}
              transition={{ type: "spring" }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-10 mt-2 block text-xs sm:text-sm font-mono text-muted transition-colors duration-500 group-hover:text-light uppercase tracking-widest">
          {subheading}
        </span>
      </div>
      
      <motion.div 
        variants={{
          initial: { x: "25%", opacity: 0 },
          whileHover: { x: "0%", opacity: 1 }
        }}
        transition={{ type: "spring" }}
        className="relative z-20 p-4 pointer-events-none hidden md:block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-red">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </motion.div>
    </motion.div>
  );
};

const HoverImageLinks = () => {
  return (
    <section className="bg-transparent section-padding py-24 relative z-10">
      <div className="container-custom mx-auto max-w-6xl">
        
        <div className="mb-12">
           <h4 className="font-mono text-sm text-muted mb-2 tracking-widest uppercase"><span className="text-red">// 05</span> &mdash; CORE PHILOSOPHY</h4>
           <div className="w-16 h-[2px]" style={{ backgroundColor: 'var(--color-red)', opacity: 0.6 }}></div>
        </div>

        <HoverImageLink 
          heading="Full-Stack"
          subheading="React, Node.js, Express & MongoDB end-to-end"
        />
        <HoverImageLink 
          heading="Real-Time"
          subheading="WebSockets, live collaboration & sync systems"
        />
        <HoverImageLink 
          heading="GenAI"
          subheading="LangChain, RAG pipelines & vector search"
        />
      </div>
    </section>
  );
};

export default HoverImageLinks;
