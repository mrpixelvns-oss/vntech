import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const variants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[320px] ${
          type === 'success' 
            ? 'bg-white/95 dark:bg-slate-900/95 border-green-500/20 shadow-green-500/10' 
            : 'bg-white/95 dark:bg-slate-900/95 border-red-500/20 shadow-red-500/10'
        }`}
      >
        <div className={`p-2 rounded-full flex-shrink-0 ${
            type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'
        }`}>
            {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        
        <div className="flex-1">
          <h4 className={`font-bold text-sm mb-0.5 ${type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {type === 'success' ? 'Thành công' : 'Có lỗi xảy ra'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-snug">{message}</p>
        </div>

        <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <X size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default Toast;