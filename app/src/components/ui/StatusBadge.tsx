import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'paid':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'preparing':
                return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'ready':
                return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'delivered':
                return 'bg-green-50 text-green-600 border-green-100';
            case 'cancelled':
                return 'bg-red-50 text-red-600 border-red-100';
            case 'pending':
                return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <span className={cn(
            "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border transition-colors",
            getStatusStyles(status),
            className
        )}>
            {status}
        </span>
    );
}
