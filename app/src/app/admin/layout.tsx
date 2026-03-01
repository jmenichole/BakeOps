'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    MessageSquare,
    MousePointerClick,
    Map,
    Bug,
    Home,
    ShieldAlert
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Overview', href: '/admin', icon: Home },
        { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
        { name: 'Heatmaps', href: '/admin/heatmaps', icon: Map },
        { name: 'Broken Clicks', href: '/admin/broken-clicks', icon: Bug },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-secondary/30">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#111114] border-r border-white/5 z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-serif font-black text-xl italic tracking-tight">Admin</h1>
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">Bake Ops HQ</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                            ? 'bg-secondary text-white shadow-xl shadow-secondary/10'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
                                    <span className="font-bold text-sm tracking-wide">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs font-bold text-white/60"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 min-h-screen">
                <header className="h-24 flex items-center justify-between px-10 border-b border-white/5">
                    <div>
                        <h2 className="text-sm font-bold text-white/40 uppercase tracking-[0.3em]">
                            {navItems.find(i => i.href === pathname)?.name || 'Admin'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-white/60 tracking-wider">LIVE ANALYTICS</span>
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
