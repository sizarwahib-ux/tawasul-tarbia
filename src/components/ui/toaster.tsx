import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: 'default' | 'destructive' | 'success' }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: { title: string; description?: string; variant?: 'default' | 'destructive' | 'success' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              t.variant === 'destructive'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : t.variant === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {t.variant === 'destructive' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {t.variant === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {t.variant === 'default' && <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
            
            <div className="flex-1">
              <h5 className="font-bold text-sm leading-snug">{t.title}</h5>
              {t.description && <p className="text-xs mt-1 text-slate-600">{t.description}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: ({ title, description }: { title: string; description?: string }) => {
        console.log(`[Toast] ${title}: ${description || ''}`);
      }
    };
  }
  return context;
};

export const Toaster: React.FC = () => {
  return null; // Integrated in ToastProvider
};
