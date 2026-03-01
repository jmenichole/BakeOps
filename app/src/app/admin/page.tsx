'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import {
    Users,
    MessageSquare,
    MousePointer2,
    TrendingUp,
    AlertCircle,
    Clock
} from 'lucide-react';

export default function AdminOverview() {
    const [stats, setStats] = useState<any>({
        totalFeedback: 0,
        avgRating: 0,
        deadClicks: 0,
        totalEvents: 0,
        loading: true
    });

    const supabase = createBrowserClient();

    useEffect(() => {
        async function fetchStats() {
            // In a real app, we'd do complex aggregations.
            // For now, let's get counts.

            const { count: feedbackCount } = await supabase
                .from('feedback')
                .select('*', { count: 'exact', head: true });

            const { data: feedbackData } = await supabase
                .from('feedback')
                .select('rating')
                .not('rating', 'is', null);

            const { count: eventCount } = await supabase
                .from('analytics_events')
                .select('*', { count: 'exact', head: true });

            const { count: deadClickCount } = await supabase
                .from('analytics_events')
                .select('*', { count: 'exact', head: true })
                .eq('is_dead_click', true);

            const ratings = feedbackData?.map(f => f.rating) || [];
            const avgRating = ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                : 0;

            setStats({
                totalFeedback: feedbackCount || 0,
                avgRating,
                totalEvents: eventCount || 0,
                deadClicks: deadClickCount || 0,
                loading: false
            });
        }

        fetchStats();
    }, [supabase]);

    const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
        <div className="bg-[#111114] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.02] translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 ${color.bg}`} />
            <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${color.bg} ${color.text} shadow-xl shadow-black/20`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-bold text-white/40 tracking-wider">+{trend}%</span>
                </div>
            </div>
            <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest pl-1 mb-2">{label}</p>
                <p className="text-4xl font-serif font-black italic tracking-tight">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={MessageSquare}
                    label="Total Feedback"
                    value={stats.totalFeedback}
                    trend="12"
                    color={{ bg: 'bg-secondary/10', text: 'text-secondary' }}
                />
                <StatCard
                    icon={Clock}
                    label="Avg Rating"
                    value={stats.avgRating + "/5"}
                    trend="8"
                    color={{ bg: 'bg-amber-500/10', text: 'text-amber-500' }}
                />
                <StatCard
                    icon={MousePointer2}
                    label="Interactions"
                    value={stats.totalEvents}
                    trend="24"
                    color={{ bg: 'bg-blue-500/10', text: 'text-blue-500' }}
                />
                <StatCard
                    icon={AlertCircle}
                    label="Broken Clicks"
                    value={stats.deadClicks}
                    trend="4"
                    color={{ bg: 'bg-red-500/10', text: 'text-red-500' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Card (Simulated for aesthetics) */}
                <div className="lg:col-span-2 bg-[#111114] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-serif font-bold italic mb-2 tracking-tight">Growth & Sentiment</h3>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest pl-1">Daily engagement metrics</p>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4">
                        {[35, 42, 38, 55, 62, 45, 78, 92, 85, 95, 88, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="w-full bg-gradient-to-t from-secondary/50 via-secondary/20 to-transparent rounded-t-xl group-hover:from-secondary group-hover:scale-y-110 transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Distribution */}
                <div className="bg-[#111114] p-10 rounded-[3rem] border border-white/5">
                    <h3 className="text-xl font-serif font-bold italic mb-8 tracking-tight">Feedback Mix</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Bugs', value: '42%', color: 'bg-red-500' },
                            { label: 'Feature Ideas', value: '28%', color: 'bg-amber-500' },
                            { label: 'UI/UX Polish', value: '18%', color: 'bg-blue-500' },
                            { label: 'Questions', value: '12%', color: 'bg-purple-500' },
                        ].map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest pl-1">
                                    <span className="text-white/40">{cat.label}</span>
                                    <span className="text-white">{cat.value}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${cat.color} opacity-60 rounded-full`}
                                        style={{ width: cat.value }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
