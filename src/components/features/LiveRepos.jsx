import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const USERNAME = "Prince671";
// Repos already shown as featured projects above — avoid duplicates here.
const FEATURED_REPOS = new Set(['Notes_Flow', 'AI-Agent', 'RAG', 'face_Attend']);

const LANGUAGE_COLORS = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    HTML: '#e34f26',
    CSS: '#264de4',
    Java: '#e76f51',
    'Jupyter Notebook': '#f37626',
    Shell: '#89e051',
};

const LiveRepos = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    const [repos, setRepos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`)
            .then(res => {
                if (!res.ok) throw new Error('failed');
                return res.json();
            })
            .then(data => {
                if (cancelled) return;
                const filtered = data
                    .filter(r => !r.fork && !FEATURED_REPOS.has(r.name))
                    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
                    .slice(0, 9);
                setRepos(filtered);
            })
            .catch(err => {
                console.error("Failed to fetch GitHub repos", err);
                if (!cancelled) setError(true);
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="mt-16">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between mb-6"
                ref={ref}
            >
                <h3 className="font-mono text-sm tracking-widest uppercase text-muted">
                    <span className="text-red">// LIVE</span> &mdash; MORE ON GITHUB
                </h3>
                <a
                    href={`https://github.com/${USERNAME}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-muted hover:text-red transition-colors uppercase tracking-widest"
                >
                    View all →
                </a>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-28 border-2 border-border-strong/50 bg-secondary/20 animate-pulse"></div>
                    ))}
                </div>
            ) : error || !repos ? (
                <div className="text-center py-8 border-2 border-border-strong/50">
                    <div className="text-red font-mono text-sm mb-2">LIVE DATA TEMPORARILY UNAVAILABLE</div>
                    <a
                        href={`https://github.com/${USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted hover:text-red underline underline-offset-4"
                    >
                        Browse repositories directly on GitHub →
                    </a>
                </div>
            ) : repos.length === 0 ? (
                <div className="text-center py-8 text-muted font-mono text-xs">No additional public repositories right now.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {repos.map((repo, i) => (
                        <motion.a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                            className="nothing-card hover-lift bg-secondary/20 p-4 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm font-bold text-accent truncate group-hover:text-red transition-colors">{repo.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-red transition-colors shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </div>
                                <p className="text-xs text-muted font-mono leading-relaxed line-clamp-2 min-h-[2.5em]">
                                    {repo.description || 'No description provided.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-[10px] font-mono text-muted">
                                {repo.language && (
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#888' }}></span>
                                        {repo.language}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    {repo.stargazers_count}
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveRepos;
