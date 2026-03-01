'use client';

import { useToast } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss }: { toast: any; onDismiss: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    };

    const colors = {
        success: 'border-green-100 bg-white/95',
        error: 'border-red-100 bg-white/95',
        info: 'border-blue-100 bg-white/95',
        warning: 'border-amber-100 bg-white/95',
    };

    return (
        <div
            className={`
        pointer-events-auto
        flex items-center gap-4 p-4 pr-6 rounded-2xl border shadow-xl transition-all duration-500 ease-out
        ${colors[toast.type as keyof typeof colors]}
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-95'}
      `}
            style={{ minWidth: '300px' }}
        >
            <div className="flex-shrink-0">
                {icons[toast.type as keyof typeof icons]}
            </div>
            <p className="flex-1 text-sm font-bold text-gray-800 leading-tight">
                {toast.message}
            </p>
            <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
