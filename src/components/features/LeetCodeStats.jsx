import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// LeetCode has no official public activity API. This component uses a
// community-run public adapter (alfa-leetcode-api) so the provider can be
// swapped later without touching the UI — see fetchLeetCodeCalendar/
// fetchLeetCodeStats below.
const LEETCODE_USERNAME = "prince-67";

async function fetchLeetCodeCalendar(username) {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);
    if (!res.ok) throw new Error('calendar fetch failed');
    const data = await res.json();
    const raw = typeof data.submissionCalendar === 'string'
        ? JSON.parse(data.submissionCalendar)
        : data.submissionCalendar;
    if (!raw) throw new Error('no calendar data');
    return raw; // { unixTimestamp: count }
}

async function fetchLeetCodeStats(username) {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
    if (!res.ok) throw new Error('stats fetch failed');
    return res.json(); // { solvedProblem, easySolved, mediumSolved, hardSolved }
}

// Build a 52-week grid (like GitHub's) ending today from a { timestamp: count } map
function buildWeeks(calendarMap) {
    const dayMs = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = 52 * 7;
    const start = new Date(today.getTime() - (totalDays - 1) * dayMs);
    // align to the most recent Sunday on/before start
    start.setDate(start.getDate() - start.getDay());

    const days = [];
    for (let i = 0; i < totalDays + 7; i++) {
        const d = new Date(start.getTime() + i * dayMs);
        if (d > today) break;
        const ts = Math.floor(d.getTime() / 1000);
        // calendar keys are unix seconds truncated to day boundary (UTC); find nearest match
        const dayStartUTC = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
        const count = calendarMap[dayStartUTC] || calendarMap[ts] || 0;
        days.push({ date: d, count });
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks;
}

function levelFor(count) {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
}

const LeetCodeStats = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    const [weeks, setWeeks] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(false);
            try {
                const [calendarMap, solvedStats] = await Promise.all([
                    fetchLeetCodeCalendar(LEETCODE_USERNAME),
                    fetchLeetCodeStats(LEETCODE_USERNAME).catch(() => null),
                ]);
                if (cancelled) return;
                setWeeks(buildWeeks(calendarMap));
                setStats(solvedStats);
            } catch (err) {
                console.error("Failed to fetch LeetCode activity", err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    const colors = ['#1a1a1a', '#5c1a12', '#99331f', '#cc5729', '#ff8c33'];

    return (
        <section className="section-padding bg-transparent relative overflow-hidden">
            <div className="container-custom w-full" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h4 className="font-mono text-sm text-muted tracking-widest uppercase mb-2"><span className="text-red">// 03B</span> &mdash; PROBLEM SOLVING</h4>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent"><span className="glitch-hover" data-text="LEETCODE ACTIVITY">LEETCODE ACTIVITY</span></h2>
                    <div className="w-16 h-[2px]" style={{ backgroundColor: 'var(--color-red)', opacity: 0.6 }}></div>
                </motion.div>

                {/* Prominent solved-count stat strip */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
                >
                    <div className="col-span-2 md:col-span-1 border-2 border-red p-4 text-center hover-lift bg-primary" style={{ boxShadow: '3px 3px 0px var(--color-red)' }}>
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-red font-mono">
                            {!loading && stats ? stats.solvedProblem : '—'}
                        </div>
                        <div className="text-[10px] font-mono tracking-widest text-muted mt-1">PROBLEMS SOLVED</div>
                    </div>
                    <div className="border-2 border-border-strong p-4 text-center hover-lift bg-primary">
                        <div className="text-base sm:text-xl md:text-2xl font-black text-accent font-mono">{!loading && stats ? stats.easySolved : '—'}</div>
                        <div className="text-[9px] font-mono tracking-widest text-muted mt-1">EASY</div>
                    </div>
                    <div className="border-2 border-border-strong p-4 text-center hover-lift bg-primary">
                        <div className="text-base sm:text-xl md:text-2xl font-black text-accent font-mono">{!loading && stats ? stats.mediumSolved : '—'}</div>
                        <div className="text-[9px] font-mono tracking-widest text-muted mt-1">MEDIUM</div>
                    </div>
                    <div className="border-2 border-border-strong p-4 text-center hover-lift bg-primary">
                        <div className="text-base sm:text-xl md:text-2xl font-black text-accent font-mono">{!loading && stats ? stats.hardSolved : '—'}</div>
                        <div className="text-[9px] font-mono tracking-widest text-muted mt-1">HARD</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full p-6 md:p-8 bg-primary relative border-2 border-accent"
                    style={{ boxShadow: '4px 4px 0px var(--color-red)' }}
                >
                    <div className="flex justify-between items-end mb-8 border-b-2 border-accent pb-4">
                        <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase font-bold">SUBMISSION.HEATMAP</h3>
                        {!loading && !error && (
                            <span className="font-mono text-[10px] text-red animate-pulse">LIVE_SYNC</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="w-full animate-pulse">
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
                    ) : error || !weeks ? (
                        <div className="text-center py-10">
                            <div className="text-red font-mono text-sm mb-2">LIVE DATA TEMPORARILY UNAVAILABLE</div>
                            <a
                                href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs text-muted hover:text-red underline underline-offset-4"
                            >
                                View profile directly on LeetCode →
                            </a>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                            <div className="flex gap-1" style={{ minWidth: 'max-content' }}>
                                {weeks.map((week, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        {week.map((day, dayIdx) => (
                                            <div
                                                key={`${idx}-${dayIdx}`}
                                                className="w-3 h-3 md:w-4 md:h-4 border border-border-subtle transition-transform hover:scale-125 hover:z-10 group relative"
                                                style={{ backgroundColor: colors[levelFor(day.count)] }}
                                            >
                                                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-20 whitespace-nowrap bg-secondary text-accent font-mono text-[10px] px-2 py-1 border border-border-strong uppercase">
                                                    {day.count} on {day.date.toISOString().slice(0, 10)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-between items-center gap-4 mt-6 text-xs font-mono text-muted">
                                <div>
                                    SOLVED: <span className="text-accent font-bold">{stats?.solvedProblem ?? '—'}</span>
                                    {stats && (
                                        <span className="ml-2 text-[10px] text-muted/70">
                                            (E:{stats.easySolved} M:{stats.mediumSolved} H:{stats.hardSolved})
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>LESS</span>
                                    {colors.map((c, i) => (
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

export default LeetCodeStats;
