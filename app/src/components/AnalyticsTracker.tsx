'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';

export function AnalyticsTracker() {
    const pathname = usePathname();
    const supabase = createBrowserClient();

    const trackEvent = useCallback(async (
        eventType: string,
        metadata: any = {},
        x?: number,
        y?: number,
        isDeadClick: boolean = false
    ) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            await supabase.from('analytics_events').insert({
                user_id: user?.id || null,
                event_type: eventType,
                page_path: pathname,
                x_pos: x,
                y_pos: y,
                is_dead_click: isDeadClick,
                metadata: {
                    ...metadata,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                }
            });
        } catch (err) {
            // Silently fail to not interrupt user experience
            console.error('Failed to track event:', err);
        }
    }, [pathname, supabase]);

    useEffect(() => {
        // 1. Track Page View
        trackEvent('page_view');

        // 2. Track Clicks (for heatmap & dead clicks)
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Determine if it's an interactive element
            const isInteractive =
                target.closest('button') ||
                target.closest('a') ||
                target.closest('input') ||
                target.closest('select') ||
                target.closest('textarea') ||
                window.getComputedStyle(target).cursor === 'pointer';

            // Capture relative coordinates for better heatmap scaling
            const x = Math.round((e.clientX / window.innerWidth) * 1000);
            const y = Math.round((e.clientY / window.innerHeight) * 1000);

            const metadata = {
                element: target.tagName.toLowerCase(),
                id: target.id || undefined,
                className: target.className || undefined,
                text: (target.innerText || '').slice(0, 50),
            };

            trackEvent(
                'click',
                metadata,
                x,
                y,
                !isInteractive // It's a "dead click" if not on an interactive element
            );
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [trackEvent]);

    return null; // This is a logic-only component
}
