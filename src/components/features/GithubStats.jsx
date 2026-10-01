import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext.jsx';

const USERNAME = "Prince671";

// Primary: actively maintained, used by react-github-calendar (jogruber).
// Fallback: community deno adapter, in case the primary is ever down.
async function fetchContributions(username) {
    try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (!res.ok) throw new Error('primary failed');
        const data = await res.json();
        if (!data?.contributions?.length) throw new Error('empty');
        // Normalize into week columns like GitHub's calendar
        const days = data.contributions;
        const weeks = [];
        let currentWeek = [];
        days.forEach((day, i) => {
            const dow = new Date(day.date + 'T00:00:00Z').getUTCDay();
            if (i === 0) {
                for (let k = 0; k < dow; k++) currentWeek.push(null);
            }
            currentWeek.push(day);
            if (dow === 6) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        if (currentWeek.length) weeks.push(currentWeek);
        const total = Object.values(data.total || {}).reduce((a, b) => a + b, 0);
        return { weeks, total, source: 'jogruber' };
    } catch {
        // fallback
        const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        if (!res.ok) throw new Error('fallback failed');
        const data = await res.json();
        const weeks = data.contributions.map(week =>
            week.map(d => d ? { date: d.date, count: d.contributionCount, level: { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }[d.contributionLevel] ?? 0 } : null)
        );
        return { weeks, total: data.totalContributions, source: 'deno' };
    }
}

async function fetchProfile(username) {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error('profile fetch failed');
    return res.json();
}

const GithubStats = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const { theme } = useTheme();

    const [contribData, setContribData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(false);

        Promise.all([
            fetchContributions(USERNAME),
            fetchProfile(USERNAME).catch(() => null),
        ])
            .then(([contrib, prof]) => {
                if (cancelled) return;
                setContribData(contrib);
                setProfile(prof);
            })
            .catch(err => {
                console.error("Failed to fetch Github stats", err);
                if (!cancelled) setError(true);
            })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

    const isLight = theme === 'light' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches);

    const levelColors = isLight
        ? ['#e0e0e0', '#f4c7c3', '#e8897d', '#dd4d3a', '#cc2929']
        : ['#1a1a1a', '#5c1212', '#991f1f', '#cc2929', '#ff3333'];

    return (
        <section className="section-padding bg-transparent relative overflow-hidden min-h-[80vh] flex items-center">
            <div className="container-custom w-full" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h4 className="font-mono text-sm text-muted tracking-widest uppercase mb-2"><span className="text-red">// 03</span> &mdash; OPEN SOURCE</h4>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent"><span className="glitch-hover" data-text="GITHUB ACTIVITY">GITHUB ACTIVITY</span></h2>
                    <div className="w-16 h-[2px]" style={{ backgroundColor: 'var(--color-red)', opacity: 0.6 }}></div>
                </motion.div>

                {/* Live profile stat strip */}
                {profile && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-3 gap-3 md:gap-4 mb-6"
                    >
                        {[
                            { label: 'PUBLIC REPOS', value: profile.public_repos },
                            { label: 'FOLLOWERS', value: profile.followers },
                            { label: 'FOLLOWING', value: profile.following },
                        ].map((stat, i) => (
                            <div key={i} className="border-2 border-border-strong p-4 text-center hover-lift bg-primary">
                                <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-red font-mono">{stat.value}</div>
                                <div className="text-[10px] font-mono tracking-widest text-muted mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full p-6 md:p-8 bg-primary relative border-2 border-accent"
                    style={{
                        boxShadow: '4px 4px 0px var(--color-red)'
                    }}
                >
                    <div className="flex justify-between items-end mb-8 border-b-2 border-accent pb-4">
                        <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase font-bold">COMMIT.FREQ_ANALYSIS</h3>
                        {!loading && !error && (
                            <span className="font-mono text-[10px] text-red animate-pulse">LIVE_SYNC</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="w-full animate-pulse">
                            {/* Skeleton contribution grid */}
                            <div className="flex gap-1 overflow-hidden">
                                {Array.from({ length: 52 }).map((_, weekIdx) => (
                                    <div key={weekIdx} className="flex flex-col gap-1">
                                        {Array.from({ length: 7 }).map((_, dayIdx) => (
                                            <div
                                                key={dayIdx}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-secondary"
                                                style={{ opacity: Math.random() > 0.6 ? 0.5 : 0.15 }}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <div className="h-3 w-28 bg-secondary rounded" />
                                <div className="h-3 w-36 bg-secondary rounded" />
                            </div>
                        </div>
                    ) : error || !contribData ? (
                        <div className="text-center py-10">
                            <div className="text-red font-mono text-sm mb-2">LIVE DATA TEMPORARILY UNAVAILABLE</div>
                            <a
                                href={`https://github.com/${USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs text-muted hover:text-red underline underline-offset-4"
                            >
                                View profile directly on GitHub →
                            </a>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                            <div className="flex gap-1" style={{ minWidth: 'max-content' }}>
                                {contribData.weeks.map((week, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex flex-col gap-1"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.4, delay: 0.3 + idx * 0.006, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        {week.map((day, dayIdx) => (
                                            <div
                                                key={`${idx}-${dayIdx}`}
                                                className="w-3 h-3 md:w-4 md:h-4 border border-border-subtle transition-transform duration-300 hover:scale-125 hover:z-10 group relative"
                                                style={{ backgroundColor: day ? levelColors[day.level] : 'transparent', borderColor: day ? undefined : 'transparent' }}
                                            >
                                                {day && (
                                                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-20 whitespace-nowrap bg-secondary text-accent font-mono text-[10px] px-2 py-1 border border-border-strong uppercase transition-opacity duration-200">
                                                        {day.count} on {day.date}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6 text-xs font-mono text-muted">
                                <div>TOTAL: <span className="text-accent font-bold">{contribData.total}</span> contributions in the last year</div>
                                <div className="flex items-center gap-2">
                                    <span>LESS</span>
                                    {levelColors.map((c, i) => (
                                        <div key={i} className="w-3 h-3 md:w-4 md:h-4 border border-border-subtle" style={{ backgroundColor: c }}></div>
                                    ))}
                                    <span>MORE</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-0 left-0 w-2 h-2 bg-red"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-red"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-red"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default GithubStats;
