'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePlatformStore } from '@/store/platform-store';
import { CheckCircle2, XCircle, Info, AlertTriangle, X, type LucideIcon } from 'lucide-react';

interface ToastStyle {
  bg: string;
  border: string;
  icon: LucideIcon;
  iconColor: string;
  text: string;
}

const STYLES: Record<string, ToastStyle> = {
  success: { bg: 'bg-[#e8f5ee]', border: 'border-[#4caf82]/40', icon: CheckCircle2, iconColor: 'text-[#2d7a58]', text: 'text-[#1e5c40]' },
  error:   { bg: 'bg-[#fde8e8]', border: 'border-[#e07070]/40', icon: XCircle,      iconColor: 'text-[#b84040]', text: 'text-[#8a2c2c]' },
  info:    { bg: 'bg-[#e4eef8]', border: 'border-[#6b9bd2]/40', icon: Info,          iconColor: 'text-[#3b6fa8]', text: 'text-[#2a5282]' },
  warning: { bg: 'bg-[#fef0d8]', border: 'border-[#d4a843]/40', icon: AlertTriangle, iconColor: 'text-[#a87a20]', text: 'text-[#7a5515]' },
};

export default function ToastNotification() {
  const toast = usePlatformStore((s) => s.toast);
  const clearToast = usePlatformStore((s) => s.clearToast);

  const style: ToastStyle = STYLES[toast?.type ?? 'info'] ?? STYLES.info;
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.2, type: 'spring', bounce: 0.3 }}
          className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg border backdrop-blur-sm ${style.bg} ${style.border}`}
        >
          <Icon className={`w-4 h-4 shrink-0 ${style.iconColor}`} />
          <span className={`text-sm font-medium ${style.text}`}>{toast.message}</span>
          <button
            onClick={clearToast}
            className="ml-1 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
