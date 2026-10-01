import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import TextReveal from '../ui/TextReveal';
import MagneticWrapper from '../ui/MagneticWrapper';

const ProficiencyBadge = ({ level, label = "EXP.LVL" }) => {
  return (
    <div className="flex items-center gap-1.5 mt-2 opacity-95 bg-black/40 w-fit px-2 py-1 border border-border-strong/30">
      <span className="text-[9px] font-mono tracking-widest text-muted uppercase">{label}</span>
      <div className="flex gap-1 ml-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-3"
            style={{ 
              backgroundColor: i < level ? 'var(--badge-color, var(--color-red))' : 'rgba(255, 255, 255, 0.08)',
              opacity: i < level ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SkillCard = ({ skill }) => {
  const projectEvidence = getProjectEvidence(skill.name);
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(skill.name);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(window.innerWidth < 768 || isTouch);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startScramble = () => {
    setIsHovered(true);
    if (isMobile) return;
    let iteration = 0;
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(skill.name
        .split("")
        .map((letter, index) => {
          if (index < iteration || letter === " ") {
            return skill.name[index];
          }
          const chars = "X01!@#$%^&*><{}[]";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );

      if (iteration >= skill.name.length) {
        clearInterval(intervalRef.current);
        setDisplayText(skill.name);
      }
      iteration += 1 / 2;
    }, 25);
  };

  const stopScramble = () => {
    setIsHovered(false);
    if (isMobile) return;
    clearInterval(intervalRef.current);
    setDisplayText(skill.name);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, [skill.name]);

  return (
    <MagneticWrapper strength={0.25} className="relative">
      <motion.div
        onMouseEnter={startScramble}
        onMouseLeave={stopScramble}
        layoutId={`skill-${skill.name}`}
        className="flex min-h-[76px] flex-col items-start justify-center gap-2 bg-primary border-2 px-4 md:px-5 py-3 transition-all duration-200 cursor-default group relative overflow-visible"
        style={{
          borderColor: isHovered ? skill.color : 'var(--color-border-strong)',
          boxShadow: isHovered 
            ? `6px 6px 0px ${skill.color}` 
            : `4px 4px 0px ${skill.color}`,
          transform: isHovered && !isMobile ? 'translate(-2px, -2px)' : 'none',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Subtle color glow backplate */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: skill.color }}
        />
        
        {/* Brand Icon SVG */}
        <div className="flex items-center gap-3">
        <svg 
          viewBox={skill.viewBox || "0 0 24 24"} 
          className="w-6 h-6 shrink-0 opacity-80 group-hover:opacity-100 transition-all duration-300"
          style={{ 
            color: isHovered ? skill.color : 'inherit',
            transform: isHovered && !isMobile
              ? (skill.name === "REACT" ? "scale(1.15) rotate(180deg)" : "scale(1.15) rotate(8deg)") 
              : "none"
          }}
          fill="currentColor"
        >
          {skill.icon}
        </svg>

        {/* Text Scramble / Label */}
        <span className="font-mono text-sm tracking-tight text-light/90">
          {displayText.split("").map((char, index) => (
            <span 
              key={index} 
              style={{ 
                color: isHovered && char !== skill.name[index] ? skill.color : undefined,
                opacity: isHovered && char !== skill.name[index] ? 0.8 : 1
              }}
              className="transition-colors duration-100"
            >
              {char}
            </span>
          ))}
        </span>
        </div>
        {projectEvidence.length > 0 && (
          <span className="max-w-56 text-[9px] font-mono leading-relaxed text-muted">
            USED IN: {projectEvidence.join(" · ")}
          </span>
        )}
      </motion.div>

      {/* Floating Cyberpunk Tooltip */}
      <AnimatePresence>
        {isHovered && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 z-30 pointer-events-none w-max max-w-[220px]"
          >
            <div 
              className="bg-black/95 text-light border-2 px-3.5 py-2 shadow-2xl backdrop-blur-md"
              style={{ 
                borderColor: skill.color,
                boxShadow: `4px 4px 0px rgba(0,0,0,0.8)`,
                '--badge-color': skill.color
              }}
            >
              <div className="text-[9px] font-mono tracking-wider text-muted uppercase mb-1 flex justify-between gap-6">
                <span>{skill.category}</span>
                <span style={{ color: skill.color }} className="font-bold">{skill.status}</span>
              </div>
              <div className="text-xs font-mono font-bold tracking-tight text-light uppercase mb-0.5">{skill.name}</div>
              <ProficiencyBadge level={skill.level} label="LVL" />
            </div>
            {/* Tooltip pointer */}
            <div 
              className="w-2.5 h-2.5 bg-black border-r-2 border-b-2 rotate-45 mx-auto -mt-1.5"
              style={{ 
                borderColor: skill.color,
                backgroundColor: 'rgba(10, 10, 10, 0.98)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MagneticWrapper>
  );
};

const SKILLS_DATA = [
  {
    name: "JAVA",
    color: "#e76f51",
    level: 3,
    category: "LANGUAGE",
    status: "INTERMEDIATE",
    group: "BACKEND",
    icon: <path d="M 17.625 3 C 19.027344 6.308594 12.597656 8.335938 12 11.09375 C 11.453125 13.625 15.808594 16.59375 15.8125 16.59375 C 15.148438 15.546875 14.664063 14.664063 14 13.03125 C 12.875 10.273438 20.855469 7.785156 17.625 3 Z M 21.875 7.59375 C 21.875 7.59375 16.253906 7.949219 15.96875 11.625 C 15.839844 13.261719 17.453125 14.121094 17.5 15.3125 C 17.539063 16.285156 16.53125 17.09375 16.53125 17.09375 C 16.53125 17.09375 18.339844 16.765625 18.90625 15.28125 C 19.53125 13.632813 17.6875 12.507813 17.875 11.1875 C 18.054688 9.925781 21.875 7.59375 21.875 7.59375 Z M 23.25 16.0625 C 22.660156 16.035156 21.996094 16.253906 21.40625 16.6875 C 22.570313 16.429688 23.5625 17.160156 23.5625 18 C 23.5625 19.882813 20.875 21.65625 20.875 21.65625 C 20.875 21.65625 25.03125 21.191406 25.03125 18.09375 C 25.03125 16.816406 24.230469 16.109375 23.25 16.0625 Z M 12.21875 16.09375 C 10.769531 16.144531 7.875 16.382813 7.875 17.5 C 7.875 19.054688 14.617188 19.175781 19.4375 18.21875 C 19.4375 18.21875 20.75 17.304688 21.09375 16.96875 C 17.933594 17.625 10.71875 17.726563 10.71875 17.15625 C 10.71875 16.632813 13.03125 16.09375 13.03125 16.09375 C 13.03125 16.09375 12.703125 16.078125 12.21875 16.09375 Z M 11.78125 18.96875 C 10.988281 18.96875 9.8125 19.585938 9.8125 20.1875 C 9.8125 21.398438 15.78125 22.328125 20.1875 20.5625 L 18.65625 19.625 C 15.667969 20.601563 10.148438 20.277344 11.78125 18.96875 Z M 12.53125 21.6875 C 11.449219 21.6875 10.75 22.371094 10.75 22.875 C 10.75 24.425781 17.214844 24.578125 19.78125 23 L 18.15625 21.9375 C 16.242188 22.761719 11.425781 22.882813 12.53125 21.6875 Z M 8.90625 23.09375 C 7.140625 23.058594 6 23.859375 6 24.53125 C 6 28.105469 24.09375 27.933594 24.09375 24.28125 C 24.09375 23.675781 23.378906 23.386719 23.125 23.25 C 24.601563 26.742188 8.34375 26.46875 8.34375 24.40625 C 8.34375 23.9375 9.546875 23.46875 10.65625 23.6875 L 9.71875 23.15625 C 9.441406 23.113281 9.160156 23.097656 8.90625 23.09375 Z M 26 25.5 C 23.25 28.160156 16.289063 29.113281 9.28125 27.46875 C 16.289063 30.398438 25.964844 28.769531 26 25.5 Z" />
  },
  {
    name: "JAVASCRIPT",
    color: "#f7df1e",
    level: 3,
    category: "LANGUAGE",
    status: "INTERMEDIATE",
    group: "FRONTEND",
    viewBox: "0 0 32 32",
    icon: <path d="M2 2h28v28H2V2zm14.671 23.375c.391.781 1.156 1.406 2.469 1.406 1.469 0 2.516-.781 2.516-2.531v-6.859h-2.083v6.828c0 .906-.375 1.141-.969 1.141-.625 0-.891-.438-1.187-.953l-1.746.968zm7.187-.219c.641 1.219 1.938 2.156 3.969 2.156 2.062 0 3.641-1.078 3.641-3.031 0-1.828-1.031-2.641-2.891-3.438l-.547-.234c-.938-.406-1.344-.672-1.344-1.328 0-.531.406-.938 1.047-.938.625 0 1.031.266 1.406.938l1.656-1.062c-.703-1.219-1.672-1.688-3.062-1.688-1.938 0-3.187 1.234-3.187 2.859 0 1.766 1.031 2.609 2.609 3.281l.547.234c1 .438 1.594.703 1.594 1.453 0 .625-.578 1.078-1.5 1.078-1.078 0-1.703-.562-2.172-1.312l-1.766 1.031z"/>
  },
  {
    name: "PYTHON",
    color: "#3776ab",
    level: 3,
    category: "LANGUAGE",
    status: "INTERMEDIATE",
    group: "BACKEND",
    viewBox: "0 0 24 24",
    icon: <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h6.5l.02 2.75.02.37-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 13.61l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
  },
  {
    name: "NODE.JS",
    color: "#3c873a",
    level: 3,
    category: "RUNTIME",
    status: "INTERMEDIATE",
    group: "BACKEND",
    viewBox: "0 0 24 24",
    icon: <path d="M11.998,24c-0.321,0-0.641-0.084-0.919-0.25l-2.925-1.732c-0.437-0.244-0.224-0.331-0.08-0.38 c0.583-0.203,0.701-0.25,1.323-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.247,1.334c0.081,0.045,0.194,0.045,0.269,0l8.759-5.056 c0.081-0.046,0.132-0.138,0.132-0.234V6.921c0-0.099-0.051-0.189-0.134-0.239l-8.756-5.053c-0.08-0.047-0.187-0.047-0.267,0 L3.107,6.683C3.021,6.731,2.968,6.825,2.968,6.921v10.15c0,0.097,0.053,0.187,0.139,0.233l2.399,1.385 c1.302,0.651,2.098-0.116,2.098-0.887V7.787c0-0.142,0.114-0.253,0.256-0.253h1.119c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.744-0.951,2.744-2.601,2.744c-0.508,0-0.908,0-2.026-0.551L2.28,18.675c-0.567-0.328-0.917-0.939-0.917-1.604V6.921 c0-0.665,0.35-1.276,0.917-1.603l8.763-5.062c0.554-0.315,1.29-0.315,1.838,0l8.759,5.062c0.567,0.329,0.919,0.938,0.919,1.603 v10.15c0,0.665-0.352,1.274-0.919,1.604l-8.759,5.058C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.253,0.112-0.253,0.253 c0,1.482,0.806,3.248,4.654,3.248C17.474,17.006,19.099,15.917,19.099,13.993z"/>
  },
  {
    name: "EXPRESS",
    color: "#a3a3a3",
    level: 3,
    category: "FRAMEWORK",
    status: "INTERMEDIATE",
    group: "BACKEND",
    viewBox: "0 0 24 24",
    icon: <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.6 11.088l-.007.8zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.257-4.59-5.257-2.882-.02-4.964 2.08-5.064 5.257z"/>
  },
  {
    name: "MONGODB",
    color: "#00ed64",
    level: 3,
    category: "DATABASE",
    status: "INTERMEDIATE",
    group: "DATABASE",
    viewBox: "0 0 32 32",
    icon: <path d="M15.821 23.185s0-10.361 0.344-10.36c0.266 0 0.612 13.365 0.612 13.365-0.476-0.056-0.956-2.199-0.956-3.005zM22.489 12.945c-0.919-4.016-2.932-7.469-5.708-10.134l-0.007-0.006c-0.338-0.516-0.647-1.108-0.895-1.732l-0.024-0.068c0.001 0.020 0.001 0.044 0.001 0.068 0 0.565-0.253 1.070-0.652 1.409l-0.003 0.002c-3.574 3.034-5.848 7.505-5.923 12.508l-0 0.013c-0.001 0.062-0.001 0.135-0.001 0.208 0 4.957 2.385 9.357 6.070 12.115l0.039 0.028 0.087 0.063q0.241 1.784 0.412 3.576h0.601c0.166-1.491 0.39-2.796 0.683-4.076l-0.046 0.239c0.396-0.275 0.742-0.56 1.065-0.869l-0.003 0.003c2.801-2.597 4.549-6.297 4.549-10.404 0-0.061-0-0.121-0.001-0.182l0 0.009c-0.003-0.981-0.092-1.94-0.261-2.871l0.015 0.099z" />
  },
  {
    name: "SQL",
    color: "#00758f",
    level: 3,
    category: "DATABASE",
    status: "INTERMEDIATE",
    group: "DATABASE",
    viewBox: "0 0 24 24",
    icon: <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"/>
  },
  {
    name: "VECTOR DB",
    color: "#8a63d2",
    level: 2,
    category: "AI / DATA",
    status: "FAMILIAR",
    group: "AI",
    viewBox: "0 0 24 24",
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  },
  {
    name: "LANGCHAIN",
    color: "#1c3c3c",
    level: 3,
    category: "AI / GENAI",
    status: "INTERMEDIATE",
    group: "AI",
    viewBox: "0 0 24 24",
    icon: <path d="M9 3a4 4 0 00-4 4v1a4 4 0 000 8v1a4 4 0 004 4h1a4 4 0 000-8H9a2 2 0 01-2-2V8a2 2 0 012-2h1a4 4 0 000-8H9zm6 0a4 4 0 010 8h-1a4 4 0 000 8h1a4 4 0 004-4v-1a4 4 0 000-8V6a4 4 0 00-4-4h-1z"/>
  },
  {
    name: "REACT",
    color: "#61dafb",
    level: 3,
    category: "FRONTEND",
    status: "INTERMEDIATE",
    group: "FRONTEND",
    viewBox: "0 0 256 228",
    icon: <path d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c-3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z" />
  },
  {
    name: "HTML/CSS",
    color: "#e34f26",
    level: 3,
    category: "FRONTEND",
    status: "INTERMEDIATE",
    group: "FRONTEND",
    viewBox: "0 0 24 24",
    icon: <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
  },
  {
    name: "PHP",
    color: "#777bb4",
    level: 2,
    category: "LANGUAGE",
    status: "FAMILIAR",
    group: "BACKEND",
    viewBox: "0 0 24 24",
    icon: <path d="M12 5.5c6.6 0 12 2.9 12 6.5s-5.4 6.5-12 6.5S0 15.6 0 12s5.4-6.5 12-6.5zM5.9 9.3H4.4l-.9 4.6h1.3l.3-1.4h.9c1 0 1.7-.6 1.9-1.6.2-1.1-.4-1.6-1.4-1.6H5.9zm.4 1.1h.4c.4 0 .6.2.5.5-.1.4-.4.6-.8.6h-.4l.3-1.1zm3.4-1.1H8.4l-.9 4.6h1.3l.3-1.5h.4l.6 1.5h1.4l-.8-1.7c.5-.3.9-.7 1-1.4.2-1.1-.4-1.5-1.4-1.5H9.7zm.3 1.1h.4c.4 0 .6.2.5.6-.1.4-.4.6-.8.6h-.4l.3-1.2zM13.1 9.3l-.9 4.6h1.3l.3-1.5h.5c1 0 1.9-.6 2.1-1.7.2-1.1-.4-1.4-1.4-1.4h-1.9zm.5 1.1h.4c.4 0 .7.1.6.5-.1.4-.4.6-.9.6h-.4l.3-1.1z"/>
  },
  {
    name: "DJANGO",
    color: "#0c4b33",
    level: 2,
    category: "FRAMEWORK",
    status: "FAMILIAR",
    group: "BACKEND",
    viewBox: "0 0 24 24",
    icon: <path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 8.958a3.34 3.34 0 0 0-1.325-.229c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102zM20.795 5.955v9.516c0 3.264-.24 4.84-.95 6.21-.66 1.298-1.526 2.116-3.312 3.01l-3.649-1.724c1.784-.815 2.65-1.53 3.209-2.649.585-1.145.789-2.473.789-5.962V5.955zm-4.702-6.246h3.924v4.02h-3.924z"/>
  },
  {
    name: "AWS",
    color: "#ff9900",
    level: 2,
    category: "CLOUD",
    status: "FAMILIAR",
    group: "CLOUD",
    viewBox: "0 0 24 24",
    icon: <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.207.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.404 1.101-2.346 1.101-.671 0-1.206-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.847.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.301-.367-.28 0-.567.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.502.502 0 0 1-.128.023c-.111 0-.167-.08-.167-.247v-.391c0-.128.016-.224.056-.28a.594.594 0 0 1 .224-.167c.279-.144.615-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.152c.95 0 1.645.216 2.09.647.438.43.66 1.085.66 1.963v2.583zm-3.24 1.214c.263 0 .535-.048.822-.144.288-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.143 0-.239-.024-.303-.08-.064-.047-.12-.159-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.128 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.759.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.399-1.158c0-.335.072-.63.216-.886.143-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.31.08.454.127.143.048.255.096.334.144a.68.68 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.359c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926a2.147 2.147 0 0 1-.583.703c-.247.2-.542.343-.886.446-.36.111-.734.167-1.142.167z"/>
  },
  {
    name: "GIT",
    color: "#f05032",
    level: 3,
    category: "VCS",
    status: "INTERMEDIATE",
    group: "VCS",
    viewBox: "0 0 24 24",
    icon: <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.738 2.736c.64-.23 1.383-.09 1.899.426.702.702.702 1.841 0 2.541-.702.703-1.84.703-2.54 0-.52-.52-.662-1.272-.435-1.921l-2.707-2.706c-.05.025-.102.046-.153.067v3.917c.231.22.378.533.378.878 0 .674-.547 1.221-1.221 1.221s-1.22-.547-1.22-1.22c0-.342.146-.653.374-.871V8.406c-.228-.219-.374-.53-.374-.873 0-.17.037-.333.103-.483L5.457 4.593 .454 9.596c-.605.604-.605 1.584 0 2.19l10.48 10.478c.604.604 1.581.604 2.188 0l10.424-10.423c.603-.604.603-1.584 0-2.19m0 0" />
  },
  {
    name: "GITHUB",
    color: "#a3a3a3",
    level: 3,
    category: "PLATFORM",
    status: "INTERMEDIATE",
    group: "VCS",
    viewBox: "0 0 24 24",
    icon: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  },
  {
    name: "VS CODE",
    color: "#007acc",
    level: 3,
    category: "TOOLS",
    status: "INTERMEDIATE",
    group: "PLATFORM",
    viewBox: "0 0 24 24",
    icon: <path d="M17 3l4 2v14l-4 2-9-8 9-8zM3 9l6 3-6 3V9zm14-3.5L8.5 12l8.5 6.5v-15z"/>
  },
  {
    name: "POSTMAN",
    color: "#ff6c37",
    level: 3,
    category: "TOOLS",
    status: "INTERMEDIATE",
    group: "PLATFORM",
    viewBox: "0 0 24 24",
    icon: <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.964 8.14L15.85 10.26l-1.06-1.06 2.12-2.12a.75.75 0 011.06 1.06zm-3.18 3.18l-1.06-1.06 2.12-2.12 1.06 1.06-2.12 2.12zM8 16l-1.5-1.5L11 10l1.5 1.5L8 16z"/>
  }
];
const PROJECT_EVIDENCE = [
  { name: "Collaborative Code & Whiteboard", tech: ["React", "Node.js", "Express", "MongoDB", "WebSockets", "Monaco Editor"] },
  { name: "StudySphere", tech: ["React", "Node.js", "Express", "MongoDB", "Python"] },
  { name: "RAG Application", tech: ["LangChain", "Pinecone", "Generative AI", "Vector Embeddings"] },
  { name: "NotesFlow", tech: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT"] },
  { name: "AI Agent", tech: ["Python", "Flask", "LangChain", "Mistral AI", "MongoDB", "React"] },
];

const SKILL_TECH_ALIASES = {
  "VECTOR DB": ["Pinecone", "Vector Embeddings"],
  "SOCKET.IO": ["WebSockets"],
};

function getProjectEvidence(skillName) {
  const normalizedName = skillName.toLowerCase();
  const relatedTech = [normalizedName, ...(SKILL_TECH_ALIASES[skillName] || []).map((tech) => tech.toLowerCase())];
  return PROJECT_EVIDENCE
    .filter((project) => project.tech.some((tech) => relatedTech.includes(tech.toLowerCase())))
    .map((project) => project.name);
}

const FILTERS = ["ALL", "BACKEND & DB", "FRONTEND & DESIGN", "CLOUD & DEV TOOLS"];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredSkills = SKILLS_DATA.filter((skill) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "BACKEND & DB") {
      return ["BACKEND", "DATABASE", "AI"].includes(skill.group);
    }
    if (activeFilter === "FRONTEND & DESIGN") {
      return ["FRONTEND", "DESIGN"].includes(skill.group);
    }
    if (activeFilter === "CLOUD & DEV TOOLS") {
      return ["CLOUD", "VCS", "PLATFORM", "DEPLOYMENT", "CYBERSEC"].includes(skill.group);
    }
    return true;
  });

  return (
    <section className="section-padding bg-transparent relative overflow-hidden py-24">
      {/* Subtle Dot-Grid Background Overlay */}
      <div
        className="absolute inset-0 z-[-1] opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Section Heading */}
      <div className="container-custom relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <ScrollReveal delay={0}>
            <h4 className="text-sm text-muted mb-2 tracking-widest uppercase flex items-center gap-3">
              <span className="text-red font-bold">// 01</span>
              <span>&mdash; CAPABILITIES</span>
            </h4>
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter" style={{ fontFamily: 'monospace' }}>
              <span className="text-muted/30"></span>
              <TextReveal text="SKILLS" delay={0.2} className="mx-2 inline-flex" />
              <span className="text-muted/30"></span>
            </h2>
            <div className="w-16 h-[4px]" style={{ backgroundColor: 'var(--color-red)' }} />
          </ScrollReveal>
        </motion.div>

        {/* ── RETRO BRUTALIST FILTER TABS ── */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 text-xs font-mono max-w-3xl mx-auto px-4">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`px-3 py-1.5 border-2 border-border-strong uppercase transition-all duration-150 relative ${
                activeFilter === filter 
                  ? "bg-accent text-primary shadow-[2px_2px_0px_var(--color-red)] -translate-x-[1px] -translate-y-[1px]" 
                  : "bg-transparent text-muted hover:text-accent hover:border-accent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── UNIFIED SKILLS CLOUD ── */}
        <motion.div 
          layout
          className="flex flex-wrap justify-center gap-4 md:gap-5 mt-4 text-accent font-mono max-w-4xl mx-auto px-4 min-h-[300px] items-start content-start"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  layout: { type: "spring", stiffness: 400, damping: 30 }
                }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
