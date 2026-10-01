import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const GitHubStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [queryTime, setQueryTime] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            const start = performance.now();
            try {
                const [userRes, reposRes] = await Promise.all([
                    fetch('https://api.github.com/users/Prince671'),
                    fetch('https://api.github.com/users/Prince671/repos?per_page=100')
                ]);

                if (!userRes.ok || !reposRes.ok) throw new Error('API Error');

                const user = await userRes.json();
                const repos = await reposRes.json();

                const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
                const forks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);

                setStats({
                    repos: user.public_repos,
                    followers: user.followers,
                    stars,
                    forks
                });
            } catch {
                setError(true);
            } finally {
                setQueryTime(Math.round(performance.now() - start));
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="mt-4 mb-4 text-accent text-sm animate-pulse font-mono">[sys] querying github api...</div>;
    if (error) return <div className="mt-4 mb-4 text-red text-sm font-mono">[err] failed to fetch data. rate limit possibly exceeded.</div>;

    return (
        <div className="mt-4 mb-4 relative max-w-[400px]">
            {/* Terminal Prompt Header */}
            <div className="mb-3 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-red">prince@portfolio</span>
                    <span className="text-muted">:</span>
                    <span className="text-accent">~/stats</span>
                    <span className="text-muted">$</span>
                    <span className="text-accent">fetch --profile-summary</span>
                </div>
                <div className="h-0.5 w-12 bg-accent opacity-50 mt-1"></div>
            </div>

            {/* Stats Card (Split Pane) */}
            <div className="bg-secondary border border-border-strong rounded-sm overflow-hidden relative group">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px] mix-blend-overlay z-10"></div>

                <div className="bg-primary px-3 py-1.5 border-b border-border-strong flex justify-between items-center relative z-20">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-muted">System.GitHub_Records</span>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-border-strong animate-pulse"></div>
                    </div>
                </div>

                <div className="flex divide-x divide-border-strong relative z-20">
                    <div className="flex flex-col items-center justify-around py-4 px-3 bg-primary/50 w-12">
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>

                    <div className="flex-1 p-4 grid grid-cols-1 gap-4">
                        <div className="flex justify-between items-center group-hover:pl-1 transition-all">
                            <span className="text-xs text-muted uppercase tracking-wider">Public Repos</span>
                            <span className="font-bold text-green-500 text-sm">{stats.repos}</span>
                        </div>
                        <div className="flex justify-between items-center group-hover:pl-1 transition-all">
                            <span className="text-xs text-muted uppercase tracking-wider">Total Stars</span>
                            <span className="font-bold text-green-500 text-sm">{stats.stars}</span>
                        </div>
                        <div className="flex justify-between items-center group-hover:pl-1 transition-all">
                            <span className="text-xs text-muted uppercase tracking-wider">Forks</span>
                            <span className="font-bold text-accent text-sm">{stats.forks}</span>
                        </div>
                        <div className="flex justify-between items-center group-hover:pl-1 transition-all">
                            <span className="text-xs text-muted uppercase tracking-wider">Followers</span>
                            <span className="font-bold text-accent text-sm">{stats.followers}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary px-3 py-1.5 border-t border-border-strong flex justify-between items-center z-20 relative">
                    <span className="text-[9px] font-mono text-muted">query.time: {queryTime}ms</span>
                    <span className="text-[9px] font-mono text-green-500">[LIVE]</span>
                </div>
            </div>
        </div>
    );
};

const PulseTerminalIcon = () => (
    <svg 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        className="my-3 text-accent"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <rect x="4" y="7" width="16" height="12" rx="2.5"/>
        <path d="M12 7V3"/>
        <circle cx="12" cy="2.2" r="1"/>
        <circle cx="9" cy="13" r="1.4" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="13" r="1.4" fill="currentColor" stroke="none"/>
        <path d="M9 16.5c1 .8 5 .8 6 0"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
    </svg>
);

const FloatingTerminal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const { accentColor, setAccentColor, isLowPerf, setIsLowPerf } = useTheme();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', content: 'PRINCE_OS Terminal [Version 2.0.1]\n(c) Prince Soni. All rights reserved.\nType "help" for a list of available commands.' }
    ]);
    
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        if (isMaximized) {
            x.set(0);
            y.set(0);
        }
    }, [isMaximized, x, y]);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setIsMinimized(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        };
        window.addEventListener('open-floating-terminal', handleOpen);
        return () => window.removeEventListener('open-floating-terminal', handleOpen);
    }, []);

    useEffect(() => {
        if (!isMinimized && isOpen) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, isMinimized, isOpen]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMinimized]);

    const executeCommand = (cmd) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;
        
        const newHistory = [...history, { type: 'input', content: trimmed }];
        const lowerCmd = trimmed.toLowerCase();

        if (lowerCmd === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (lowerCmd === 'exit') {
            setIsOpen(false);
            setInput('');
            return;
        } else if (lowerCmd === 'help') {
            newHistory.push({ type: 'output', content: 'AVAILABLE COMMANDS:\n  help     - Show this message\n  skills   - View developer skills\n  projects - View featured projects\n  date     - Show system date\n  status   - Show system status\n  theme    - Toggle accent color\n  fps      - Toggle high FPS/perf mode\n  github   - Fetch GitHub stats\n  whoami   - Current user info\n  pulse    - Summon Pulse AI Assistant\n  clear    - Clear terminal output\n  exit     - Close terminal' });
        } else if (lowerCmd === 'skills') {
            newHistory.push({ 
                type: 'output', 
                content: '💻 PRINCE\'S SKILLS:\n  [Languages]\n    - Java (Level 3 - Intermediate)\n    - JavaScript (Level 3 - Intermediate)\n    - Python (Level 3 - Intermediate)\n    - C/C++, SQL, PHP\n  [Frameworks]\n    - React (Level 3 - Intermediate)\n    - Node.js / Express (Level 3 - Intermediate)\n    - Django (Level 2 - Familiar)\n    - LangChain (Level 3 - Intermediate)\n  [Databases & Cloud]\n    - MongoDB (Level 3 - Intermediate)\n    - Vector DBs: Pinecone / ChromaDB (Level 2 - Familiar)\n    - AWS: EC2, S3 (Level 2 - Familiar)' 
            });
        } else if (lowerCmd === 'projects') {
            newHistory.push({ 
                type: 'output', 
                content: '📂 PRINCE\'S PROJECTS:\n\n1. Collaborative Code & Whiteboard\n   - Tech: React, Node.js, Express, MongoDB, WebSockets, Monaco Editor\n   - Description: Real-time collaboration platform with live code editing, whiteboarding, and multi-language execution.\n\n2. StudySphere (FaceAttend)\n   - Tech: React, Node.js, Express, MongoDB, Python\n   - Description: AI-powered face recognition attendance and LMS platform.\n   - Link: https://face-atten-d.vercel.app/\n\n3. RAG Application\n   - Tech: LangChain, Pinecone, Generative AI, vector embeddings\n   - Description: Retrieval-Augmented Generation app for semantic search and context-aware document Q&A.\n   - Link: https://r-a-g.vercel.app/' 
            });
        } else if (lowerCmd === 'github' || lowerCmd === 'stats' || lowerCmd === 'github stats') {
            newHistory.push({ type: 'component', content: <GitHubStats /> });
        } else if (lowerCmd === 'whoami') {
            newHistory.push({ type: 'output', content: 'Prince671 / Prince Soni\nRole: Full-Stack Developer & GenAI Engineer\nLocation: Satna, MP, India\nStatus: Online' });
        } else if (lowerCmd === 'pulse') {
            window.dispatchEvent(new CustomEvent('open-pulse'));
            newHistory.push({ 
                type: 'component', 
                content: (
                    <div className="flex flex-col gap-2 mt-2 mb-2 font-mono">
                        <PulseTerminalIcon />
                        <div className="text-red font-bold">🤖 PULSE:</div>
                        <div className="text-accent italic">"Online and ready. Let's talk code, projects, or coffee-fueled debugging sessions."</div>
                        <div className="text-muted text-xs">[sys] initiating system link to Pulse assistant...</div>
                    </div>
                )
            });
        } else if (lowerCmd === 'date') {
            newHistory.push({ type: 'output', content: `CURRENT_SYSTEM_TIME: ${new Date().toLocaleString()}` });
        } else if (lowerCmd === 'status') {
            newHistory.push({ type: 'output', content: `[SYSTEM_STATUS_REPORT]\nUPTIME: 12h 43m 12s\nMEMORY: 1.4GB / 4.0GB [|||||-----]\nCPU: 12% LOAD\nALL SYSTEMS NOMINAL` });
        } else if (lowerCmd === 'theme') {
            const nextAccent = accentColor === 'red' ? 'green' : 'red';
            setAccentColor(nextAccent);
            newHistory.push({ type: 'output', content: `Accent theme switched to ${nextAccent.toUpperCase()}` });
        } else if (lowerCmd === 'fps' || lowerCmd === 'perf' || lowerCmd === 'performance') {
            const nextVal = !isLowPerf;
            setIsLowPerf(nextVal);
            newHistory.push({ 
                type: 'output', 
                content: nextVal 
                    ? 'HIGH FPS MODE: ON\n- Particles disabled\n- Interactive mouse-glow grid disabled\n- Click ripples disabled\nEnjoy maximum performance!'
                    : 'HIGH FPS MODE: OFF\n- All background particles and visual animations restored.' 
            });
        } else {
            newHistory.push({ type: 'output', content: `Command not found: "${trimmed}". Type "help" for commands.` });
        }

        setHistory(newHistory);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(input);
        }
    };

    if (!isOpen) return null;

    if (isMinimized) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-24 right-4 z-[9999]"
            >
                <button 
                    onClick={() => { setIsMinimized(false); setTimeout(() => inputRef.current?.focus(), 100); }}
                    className="flex items-center gap-2 bg-secondary border-2 border-border-strong px-4 py-2 hover:border-accent transition-colors font-mono shadow-[4px_4px_0px_var(--color-border-strong)]"
                >
                    <span className="text-accent font-bold">&gt;_</span>
                    <span className="text-accent text-sm">Terminal (Running)</span>
                </button>
            </motion.div>
        );
    }

    const modalVariants = {
        normal: { width: 'min(90vw, 600px)', height: '400px', top: 'auto', left: 'auto', bottom: '20vh', right: '5vw', opacity: 1, scale: 1 },
        maximized: { width: '100vw', height: '100vh', top: 0, left: 0, bottom: 'auto', right: 'auto', opacity: 1, scale: 1 }
    };

    return (
        <AnimatePresence>
            <motion.div 
                drag={!isMaximized}
                dragMomentum={false}
                dragConstraints={{ top: 0, bottom: typeof window !== 'undefined' ? window.innerHeight - 50 : 1000 }}
                dragElastic={0.1}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isMaximized ? "maximized" : "normal"}
                variants={modalVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={isMaximized ? { position: 'fixed' } : { x, y, position: 'fixed' }}
                className={`z-[9999] bg-secondary/95 backdrop-blur-md border-2 border-border-strong flex flex-col font-mono shadow-[8px_8px_0px_rgba(0,0,0,0.5)] overflow-hidden ${isMaximized ? 'border-0 rounded-none' : 'rounded-sm'}`}
            >
                {/* Window Controls Header */}
                <div 
                    className="flex items-center justify-between px-3 py-2 border-b-2 border-border-strong bg-primary select-none cursor-move"
                >
                    <div className="flex gap-2">
                        <span className="text-xs text-muted tracking-widest uppercase">PRINCE_OS / Terminal</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsMinimized(true)} className="text-muted hover:text-accent focus:outline-none">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button onClick={() => setIsMaximized(!isMaximized)} className="text-muted hover:text-green-500 focus:outline-none">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-muted hover:text-red focus:outline-none">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                {/* Terminal Content */}
                <div className="flex-1 overflow-y-auto p-4 text-sm scrollbar-hide">
                    {history.map((line, i) => (
                        <div key={i} className="mb-2 break-words">
                            {line.type === 'input' ? (
                                <div className="flex text-muted">
                                    <span className="mr-2 text-accent">&gt;</span>
                                    <span className="text-accent">{line.content}</span>
                                </div>
                            ) : line.type === 'component' ? (
                                line.content
                            ) : (
                                <div className="text-muted leading-relaxed whitespace-pre-wrap">{line.content}</div>
                            )}
                        </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-accent font-bold">&gt;</span>
                        <input
                            ref={inputRef}
                            className="flex-1 bg-transparent border-none outline-none text-accent font-mono caret-accent"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                    <div ref={scrollRef} />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FloatingTerminal;
