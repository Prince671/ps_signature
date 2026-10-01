import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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
        <path d="m128 0 128 221.705H0z" />
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
        title: 'BUILDING A REAL-TIME COLLABORATIVE CODE EDITOR & WHITEBOARD',
        image: '/project-codecollab.svg',
        content: `
            <h3>Real-Time, By Design</h3>
            <p>This project reflection walks through building a full-stack real-time collaboration platform with <strong>React</strong>, <strong>Node.js</strong>, <strong>Express</strong>, <strong>MongoDB</strong>, <strong>WebSockets</strong>, and the <strong>Monaco Editor</strong> — combining live code editing, a shared whiteboard, authentication, and multi-language code execution in one workspace.</p>

            <h4>The Challenge & How It Was Solved</h4>
            <p>Keeping every participant's cursor, edits, and whiteboard strokes in sync without noticeable lag was the core problem. By broadcasting granular diffs over Socket.IO instead of full document state, and by optimizing React re-renders on the editor and canvas layers, load time dropped from 3.2s to 1.8s and Lighthouse performance climbed from 68% to 91%.</p>

            <blockquote>"Sync should feel invisible — the moment users notice it, it has already failed."</blockquote>

            <h4>Key Features</h4>
            <ul>
                <li><strong>Live Code Editing:</strong> Monaco-powered editor with multi-language support and real-time cursor presence.</li>
                <li><strong>Collaborative Whiteboard:</strong> Shared canvas synced alongside the code session.</li>
                <li><strong>Authentication:</strong> Session-based auth for private and shared rooms.</li>
                <li><strong>Multi-language Execution:</strong> Run code directly from the shared session.</li>
                <li><strong>MongoDB Persistence:</strong> Session and room state stored for reconnection.</li>
            </ul>

            <h4>Try It</h4>
            <p>Built as part of an ongoing effort to explore real-time systems — happy to talk through the WebSocket architecture or the rendering optimizations if you're curious.</p>
        `,
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
        title: 'BUILDING A RETRIEVAL-AUGMENTED GENERATION APP WITH LANGCHAIN & PINECONE',
        image: '/project-rag.svg',
        content: `
            <h3>Context-Aware Q&A, From Documents to Answers</h3>
            <p>This guide documents how I built a <strong>Retrieval-Augmented Generation (RAG)</strong> application using <strong>LangChain</strong>, <strong>Pinecone</strong>, and vector embeddings — turning a pile of documents into a system that can answer questions with real, cited context instead of hallucinating.</p>

            <h4>Step 1: Chunk & Embed</h4>
            <p>Documents are split into overlapping chunks, then converted into vector embeddings so semantically similar text ends up close together in vector space.</p>

            <h4>Step 2: Store & Retrieve</h4>
            <ol>
                <li>Upsert embeddings into a Pinecone index.</li>
                <li>On each query, embed the question and run a similarity search.</li>
                <li>Pull back the top-k most relevant chunks as context.</li>
            </ol>

            <h4>Step 3: Generate the Answer</h4>
            <p>The retrieved chunks are passed into an LLM prompt alongside the user's question, so the model answers from the actual source material rather than guessing.</p>

            <h4>Performance Notes</h4>
            <p>Optimizing the retrieval and API workflow brought load time down from 3.1s to 1.9s and performance score up from 67% to 90%.</p>
        `,
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
        title: 'NOTESFLOW: A NOTES APP WITH FOLDERS, SHARING & A BUILT-IN AI ASSISTANT',
        image: '/project-notesflow.svg',
        content: `
            <h3>More Than a CRUD App</h3>
            <p><strong>NotesFlow</strong> started as a simple question: what does a notes app look like once you actually need to organize hundreds of notes, share a few of them, and occasionally ask "wait, what did I write about this?" The answer became a full-stack app built with <strong>React</strong>, <strong>Node.js</strong>, <strong>Express</strong>, and <strong>MongoDB</strong>.</p>

            <h4>Folders, Sharing & Uploads</h4>
            <p>Notes live inside folders rather than one long flat list, which made a real difference once the note count grew past a couple dozen. Any note can be turned into a shareable link, and attachments — images or files — are handled through <strong>Cloudinary</strong> rather than storing binary blobs in MongoDB.</p>

            <h4>Authentication Done Properly</h4>
            <p>Auth covers the full loop, not just login: registration, JWT-based sessions, protected and public routes, and a forgot-password / reset-password flow — the part most side projects skip and then regret.</p>

            <blockquote>"The AI assistant only feels useful once it actually knows what you've written — that's what made the notes-aware sidebar worth building."</blockquote>

            <h4>The AI Sidebar</h4>
            <p>An <strong>AIAgentSidebar</strong> component sits alongside the editor and can answer general questions, but its more interesting mode is answering questions <em>about your own notes</em> — a small step toward a notes app that helps you think instead of just storing text.</p>

            <h4>What's Next</h4>
            <p>Real-time collaboration, note version history, and drag-and-drop folder organization are next on the list — all logged openly in the repo's roadmap.</p>
        `,
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
        title: 'AI AGENT: A TOOL-USING ASSISTANT WITH LANGCHAIN & MISTRAL',
        image: '/project-aiagent.svg',
        content: `
            <h3>Not Just a Chatbot</h3>
            <p>Most "AI chat" side projects are a thin wrapper around a single prompt. <strong>AI Agent</strong> is different: it's a <strong>LangChain</strong>-orchestrated agent backed by <strong>Mistral AI</strong> that decides, on its own, which tool a query actually needs — weather, news, stock price, currency conversion, places, or a general web search via Tavily — then calls it and reasons over the result.</p>

            <h4>How It Thinks</h4>
            <ol>
                <li>A query comes in from the React frontend.</li>
                <li>The LangChain agent analyzes intent and selects a tool.</li>
                <li>The tool executes (e.g. hits the OpenWeatherMap or a stock API).</li>
                <li>The result is fed back to Mistral, which drafts the final answer.</li>
                <li>The response streams back token-by-token over Server-Sent Events.</li>
            </ol>

            <h4>Streaming & Voice</h4>
            <p>Responses render character-by-character through a dedicated <code>/agent-stream</code> endpoint rather than waiting for the full completion — it feels noticeably faster even when the underlying latency is the same. On top of that, the Web Speech API powers both voice input and text-to-speech output, so the whole thing can run hands-free.</p>

            <h4>Persistent, Searchable History</h4>
            <p>Every conversation is stored in <strong>MongoDB</strong> with auto-generated chat titles and full-text search across chat history — so past answers aren't lost the moment you close the tab.</p>

            <blockquote>"The interesting engineering problem wasn't the LLM call — it was making tool selection reliable enough that the agent picks correctly on the first try."</blockquote>

            <h4>Stack</h4>
            <p>A <strong>Flask</strong> backend handles auth (JWT) and the streaming endpoints, <strong>LangChain</strong> handles tool orchestration, and the frontend is <strong>React + Tailwind CSS</strong> with Chart.js rendering live stock charts inline whenever a price query is detected.</p>
        `,
        refs: [
            { label: 'LangChain Docs', url: 'https://python.langchain.com/', Icon: DocIcon },
            { label: 'Mistral AI Docs', url: 'https://docs.mistral.ai/', Icon: DocIcon },
            { label: 'Tavily Search API', url: 'https://tavily.com', Icon: DocIcon },
            { label: 'GitHub Repo', url: 'https://github.com/Prince671/AI-Agent', Icon: GitHubIcon },
        ]
    },
];

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    useEffect(() => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    if (!post) return <div className="min-h-screen flex items-center justify-center font-mono text-red">404: POST_NOT_FOUND</div>;

    return (
        <div className="bg-primary text-accent min-h-screen pt-32 pb-20 px-4 md:px-0">
            <div className="container-custom max-w-3xl">
                <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted hover:text-red mb-12 transition-colors">
                    &lt; RETURN_TO_SYSTEM
                </Link>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-mono text-xs text-red font-bold">[{post.unit}]</span>
                        <div className="w-8 h-[1px] bg-border-strong opacity-50"></div>
                        <span className="font-mono text-xs text-muted">/{post.date}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-12 font-mono uppercase leading-none tracking-tighter">
                        {post.title}
                    </h1>

                    <div className="border-4 border-border-strong mb-16 p-1 relative shadow-[8px_8px_0px_var(--color-border-strong)]">
                        <img src={post.image} alt={post.title} className="w-full h-auto grayscale transition-all duration-700 hover:grayscale-0" />
                        <div className="absolute top-2 right-2 font-mono text-[8px] bg-red text-white px-2 py-0.5">SOURCE: LOG_FILE_0x{post.id.slice(0, 2).toUpperCase()}</div>
                    </div>

                    <div
                        className="blog-content font-mono text-muted leading-relaxed text-lg prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post.refs && post.refs.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-border-strong/50">
                            <h4 className="text-xl font-bold font-mono text-accent mb-6 tracking-tight uppercase">References &amp; Tools Used</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {post.refs.map((ref, i) => (
                                    <a
                                        key={i}
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 bg-secondary/30 border border-border-strong/50 hover:border-red/60 p-4 transition-all duration-200 hover:bg-red/5"
                                    >
                                        <span className="text-muted group-hover:text-red transition-colors">
                                            <ref.Icon />
                                        </span>
                                        <span className="font-mono text-xs tracking-widest text-muted group-hover:text-red transition-colors truncate">
                                            {ref.label}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.article>

                <div className="mt-20 pt-12 border-t border-border-strong flex justify-between items-center">
                    <div className="font-mono text-[10px] text-muted tracking-[0.4em] uppercase">STATUS: LOG_COMPLETE</div>
                    <Link to="/" className="nothing-card px-8 py-3 font-mono text-[10px] tracking-widest hover:border-red hover:text-red transition-all">
                        EXIT_INTERFACE
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
