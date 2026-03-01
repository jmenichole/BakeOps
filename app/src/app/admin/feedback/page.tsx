'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import {
    Bug,
    Lightbulb,
    MousePointer2,
    HelpCircle,
    Smile,
    Meh,
    Frown,
    Angry,
    Heart,
    Globe,
    Monitor,
    Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminFeedback() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createBrowserClient();

    useEffect(() => {
        async function fetchFeedback() {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setFeedback(data);
            setLoading(false);
        }

        fetchFeedback();
    }, [supabase]);

    const CategoryIcon = ({ category }: { category: string }) => {
        switch (category) {
            case 'bug': return <Bug className="w-4 h-4 text-red-500" />;
            case 'feature_request': return <Lightbulb className="w-4 h-4 text-amber-500" />;
            case 'ui_ux': return <MousePointer2 className="w-4 h-4 text-blue-500" />;
            default: return <HelpCircle className="w-4 h-4 text-purple-500" />;
        }
    };

    const RatingIcon = ({ rating }: { rating: number }) => {
        const icons = [Angry, Frown, Meh, Smile, Heart];
        const colors = ['text-red-500', 'text-orange-500', 'text-amber-500', 'text-green-500', 'text-pink-500'];
        const Icon = icons[rating - 1] || HelpCircle;
        const color = colors[rating - 1] || 'text-gray-400';
        return <Icon className={`w-5 h-5 ${color}`} />;
    };

    if (loading) return <div className="text-white/20 font-bold uppercase tracking-widest text-center py-20 animate-pulse">Loading Kitchen Feedback...</div>;

    return (
        <div className="space-y-8">
            {feedback.length === 0 ? (
                <div className="bg-[#111114] p-20 rounded-[3rem] border border-white/5 text-center">
                    <MessageSquareIcon className="w-16 h-16 text-white/5 mx-auto mb-6" />
                    <h3 className="text-2xl font-serif font-bold italic text-white/40">No feedback yet.</h3>
                    <p className="text-sm text-white/20 mt-2 font-bold uppercase tracking-widest">The kitchen is quiet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {feedback.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#111114] p-8 rounded-[2.5rem] border border-white/5 hover:border-secondary/20 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 opacity-0 group-hover:opacity-100 blur-[60px] transition-opacity -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                {/* Sentiment & Category Sidebar */}
                                <div className="flex md:flex-col items-center gap-4 min-w-[60px]">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl shadow-black/20">
                                        <RatingIcon rating={item.rating} />
                                    </div>
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl shadow-black/20">
                                        <CategoryIcon category={item.category} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                                {item.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-[10px] font-medium text-white/20">
                                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-white/20">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-lg font-medium text-white/80 leading-relaxed italic">
                                        "{item.message}"
                                    </p>

                                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-white/40">
                                            <Globe className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold truncate max-w-[200px]">{item.page_url}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/40">
                                            <Monitor className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.browser_info?.os || 'Unknown Device'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MessageSquareIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    );
}
