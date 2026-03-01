'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import {
    Bug,
    MousePointerClick,
    MapPin,
    Layout,
    Clock,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminBrokenClicks() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createBrowserClient();

    useEffect(() => {
        async function fetchDeadClicks() {
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .eq('is_dead_click', true)
                .order('created_at', { ascending: false });

            if (data) setEvents(data);
            setLoading(false);
        }

        fetchDeadClicks();
    }, [supabase]);

    if (loading) return <div className="text-white/20 font-bold uppercase tracking-widest text-center py-20 animate-pulse">Scanning for Broken Clicks...</div>;

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-serif font-black italic tracking-tight mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-xl shadow-red-500/10">
                            <Bug className="w-5 h-5 text-red-500" />
                        </div>
                        Broken Click Detector
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em] pl-1">Identifying UX friction points</p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="bg-[#111114] p-20 rounded-[3rem] border border-white/5 text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <MousePointerClick className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="text-2xl font-serif font-bold italic text-white/60">Flawless Experience!</h4>
                    <p className="text-sm text-white/20 mt-2 font-bold uppercase tracking-widest pl-1">No dead clicks detected in the logs.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-[#111114] p-6 rounded-[2rem] border border-white/5 hover:border-red-500/10 transition-all group flex items-center gap-6"
                        >
                            <div className="w-14 h-14 bg-red-500/5 rounded-2xl flex items-center justify-center border border-red-500/10 group-hover:bg-red-500/10 transition-colors">
                                <MousePointerClick className="w-6 h-6 text-red-500 opacity-60" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Target Element</p>
                                    <p className="font-bold text-white/80 flex items-center gap-2">
                                        <Layout className="w-3.5 h-3.5 text-secondary" />
                                        {event.element_tag || 'Unknown Element'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Page Path</p>
                                    <p className="font-bold text-white/80 truncate">{event.page_path}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Coordinates</p>
                                    <p className="font-bold text-white/80 flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                                        ({event.x_pos || 0}, {event.y_pos || 0})
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Occurred</p>
                                    <p className="font-bold text-white/80 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                                <div className="h-10 w-[1px] bg-white/5 mx-2" />
                                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/60 transition-all active:scale-95 group">
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
