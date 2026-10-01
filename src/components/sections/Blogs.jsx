import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import TiltCard from '../ui/TiltCard';
import GlitchText from '../ui/GlitchText';

/* ─── Reference Icon SVGs ─── */
const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
);
const DocIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const VercelIcon = () => (
    <svg viewBox="0 0 256 222" className="w-4 h-4 shrink-0" fill="currentColor">
        <path d="M128 0L256 221.705H0z" />
    </svg>
);
const OpenAIIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.756 19.86a4.5 4.5 0 0 1-6.157-1.556zM2.61 8.64a4.485 4.485 0 0 1 2.34-1.974V12.2a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.572 14.51A4.501 4.501 0 0 1 2.61 8.64zm16.44 3.866-5.836-3.37 2.02-1.165a.073.073 0 0 1 .072 0l4.49 2.59a4.496 4.496 0 0 1-.696 8.114v-5.536a.797.797 0 0 0-.05-.633zm2.008-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.52 9.979V7.648a.071.071 0 0 1 .028-.068l4.487-2.59a4.496 4.496 0 0 1 6.675 4.654zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V7.81a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 7.193a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" />
    </svg>
);

const blogPosts = [
    {
        id: 'realtime-collab-editor',
        date: 'MAR 11, 2026',
        unit: 'CASE_STUDY',
        category: 'Project Reflection',
        title: 'BUILDING A REAL-TIME COLLABORATIVE CODE EDITOR & WHITEBOARD',
        image: '/project-codecollab.svg',
        excerpt: 'A walkthrough of building a full-stack real-time collaboration platform — live code editing with Monaco, whiteboarding, and multi-language execution over WebSockets.',
        tags: ['REACT', 'NODE.JS', 'EXPRESS', 'MONGODB', 'WEBSOCKETS'],
        refs: [
            { label: 'Socket.IO Docs', url: 'https://socket.io/docs/v4/', Icon: DocIcon },
            { label: 'Monaco Editor', url: 'https://microsoft.github.io/monaco-editor/', Icon: GitHubIcon },
            { label: 'MongoDB Docs', url: 'https://www.mongodb.com/docs/', Icon: DocIcon },
            { label: 'Vercel Deployment', url: 'https://vercel.com', Icon: VercelIcon },
        ]
    },
    {
        id: 'rag-langchain-pinecone',
        date: 'FEB 28, 2026',
        unit: 'HOW_TO_GUIDE',
        category: 'How-To Guide',
        title: 'BUILDING A RETRIEVAL-AUGMENTED GENERATION APP WITH LANGCHAIN & PINECONE',
        image: '/project-rag.svg',
        excerpt: 'Notes on building a RAG pipeline for context-aware document Q&A — chunking, embeddings, vector search with Pinecone, and generation with an LLM.',
        tags: ['LANGCHAIN', 'PINECONE', 'VECTOR_DB', 'GENERATIVE_AI'],
        refs: [
            { label: 'LangChain Docs', url: 'https://python.langchain.com/', Icon: DocIcon },
            { label: 'Pinecone Docs', url: 'https://docs.pinecone.io/', Icon: DocIcon },
            { label: 'OpenAI Platform', url: 'https://platform.openai.com/docs', Icon: OpenAIIcon },
            { label: 'GitHub Repo', url: 'https://github.com/Prince671/RAG/', Icon: GitHubIcon },
        ]
    },
    {
        id: 'notesflow-ai-notes-app',
        date: 'MAY 18, 2026',
        unit: 'CASE_STUDY',
        category: 'Project Reflection',
        title: 'NOTESFLOW: A NOTES APP WITH FOLDERS, SHARING & A BUILT-IN AI ASSISTANT',
        image: '/project-notesflow.svg',
        excerpt: 'How I structured a full-stack notes manager with folder-based organization, shareable links, file uploads via Cloudinary, and an AI sidebar that can answer questions about your own notes.',
        tags: ['REACT', 'NODE.JS', 'EXPRESS', 'MONGODB', 'CLOUDINARY', 'JWT'],
        refs: [
            { label: 'Express Docs', url: 'https://expressjs.com/', Icon: DocIcon },
            { label: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/', Icon: DocIcon },
            { label: 'Cloudinary Docs', url: 'https://cloudinary.com/documentation', Icon: DocIcon },
            { label: 'GitHub Repo', url: 'https://github.com/Prince671/Notes_Flow', Icon: GitHubIcon },
        ]
    },
    {
        id: 'ai-agent-langchain-mistral',
        date: 'JUN 09, 2026',
        unit: 'DEEP_DIVE',
        category: 'Architecture Deep-Dive',
        title: 'AI AGENT: A TOOL-USING ASSISTANT WITH LANGCHAIN & MISTRAL',
        image: '/project-aiagent.svg',
        excerpt: 'Inside a LangChain-orchestrated agent that reasons over a query, picks the right tool — weather, news, stocks, currency, places — and streams a grounded answer back in real time, with voice in and out.',
        tags: ['PYTHON', 'FLASK', 'LANGCHAIN', 'MISTRAL_AI', 'MONGODB'],
        refs: [
            { label: 'LangChain Docs', url: 'https://python.langchain.com/', Icon: DocIcon },
            { label: 'Mistral AI Docs', url: 'https://docs.mistral.ai/', Icon: DocIcon },
            { label: 'Tavily Search API', url: 'https://tavily.com', Icon: DocIcon },
            { label: 'GitHub Repo', url: 'https://github.com/Prince671/AI-Agent', Icon: GitHubIcon },
        ]
    },
];

const cardVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const Blogs = () => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isHovered, setIsHovered] = useState(false);
    const dragStartX = useRef(0);

    const current = ((page % blogPosts.length) + blogPosts.length) % blogPosts.length;

    const paginate = (newDir) => {
        setPage(([prev]) => [prev + newDir, newDir]);
    };

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [page, isHovered]);

    const handleDragStart = (e) => {
        dragStartX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    };

    const handleDragEnd = (e) => {
        const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const delta = dragStartX.current - endX;
        if (Math.abs(delta) > 50) paginate(delta > 0 ? 1 : -1);
    };

    const post = blogPosts[current];

    return (
        <section className="py-20 px-4 md:px-10 relative overflow-hidden bg-transparent" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="absolute top-0 right-0 w-64 h-64 border-r-2 border-t-2 border-border-strong opacity-10 pointer-events-none" />

            <div className="container-custom mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-[1px]" style={{ backgroundColor: 'var(--color-red)', opacity: 0.7 }} />
                        <h4 className="font-mono text-sm text-muted tracking-widest uppercase">
                            <span className="text-red">// 05</span> &mdash; LOGS
                        </h4>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-accent">
                        <span className="glitch-hover" data-text="PERSONAL BLOGS">PERSONAL BLOGS</span>
                    </h2>
                    <div className="w-16 h-[4px]" style={{ backgroundColor: 'var(--color-red)' }} />
                </motion.div>

                {/* Carousel */}
                <div className="relative">
                    {/* Slide */}
                    <div
                        className="overflow-hidden"
                        onMouseDown={handleDragStart}
                        onMouseUp={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchEnd={handleDragEnd}
                        style={{ cursor: 'grab' }}
                    >
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: 'easeInOut' }}
                            >
                                <TiltCard
                                    maxTilt={4}
                                    glare={true}
                                    className="neo-card p-4 md:p-10 bg-primary border-2 border-border-strong relative overflow-hidden"
                                    style={{ boxShadow: '6px 6px 0px var(--color-border-strong)', borderRadius: 0 }}
                                >
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red" />
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red" />
                                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red" />

                                    {/* Meta */}
                                    <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-mono text-[9px] tracking-widest text-muted">// {post.date}</span>
                                            {/* Category Badge */}
                                            <div className="inline-block font-mono text-[8px] tracking-[0.3em] uppercase px-2 py-1 text-accent bg-red/10 border border-red/30 w-fit">
                                                {post.category}
                                            </div>
                                        </div>
                                        <span className="font-mono text-[9px] tracking-widest text-red font-bold border border-red px-2 py-0.5">
                                            [{post.unit}]
                                        </span>
                                    </div>


                                    {/* Title */}
                                    <h3 className="text-xl md:text-3xl font-black font-mono uppercase tracking-tight mb-4 text-accent leading-tight">
                                        {post.title}
                                    </h3>

                                    {/* Divider */}
                                    <div className="w-12 h-[2px] mb-4 md:mb-6" style={{ backgroundColor: 'var(--color-red)' }} />

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-mono tracking-widest border border-border-strong px-2 py-0.5 text-muted">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Read More */}
                                    <div className="mt-6 pt-6 border-t border-border-strong/30">
                                        <Link
                                            to={`/blog/${post.id}`}
                                            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-red hover:gap-4 transition-all duration-200"
                                        >
                                            READ_FULL_LOG
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Nav Controls */}
                    <div className="flex items-center justify-between mt-8">
                        {/* Dot Indicators */}
                        <div className="flex items-center gap-2">
                            {blogPosts.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(() => [i, i > current ? 1 : -1])}
                                    className="transition-all duration-200"
                                    aria-label={`Go to slide ${i + 1}`}
                                >
                                    <div
                                        className="transition-all duration-300"
                                        style={{
                                            width: i === current ? '24px' : '8px',
                                            height: '4px',
                                            backgroundColor: i === current ? 'var(--color-red)' : 'var(--color-border-strong)',
                                            opacity: i === current ? 1 : 0.4,
                                        }}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Counter + Arrows */}
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-[9px] tracking-widest text-muted/50">
                                {String(current + 1).padStart(2, '0')} / {String(blogPosts.length).padStart(2, '0')}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => paginate(-1)}
                                    className="w-9 h-9 flex items-center justify-center border-2 border-border-strong hover:border-red hover:text-red transition-all duration-200 font-mono text-muted"
                                    aria-label="Previous post"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="w-9 h-9 flex items-center justify-center border-2 border-border-strong hover:border-red hover:text-red transition-all duration-200 font-mono text-muted"
                                    aria-label="Next post"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom status bar */}
                <div className="mt-12 pt-6 border-t border-border-strong/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-[9px] text-muted tracking-widest opacity-40">
                        LOG_STREAM_CONNECTED // {blogPosts.length}_ENTRIES_LOADED
                    </p>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-1 h-3 bg-border-strong opacity-20" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blogs;
