import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-0.5 text-slate-400 hover:text-white rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
