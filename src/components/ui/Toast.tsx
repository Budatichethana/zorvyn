import React from 'react';

type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
};

const toneMap: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-primary-600 text-white',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  React.useEffect(() => {
    const timer = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-pop fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 shadow-xl ${toneMap[type]}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast;
