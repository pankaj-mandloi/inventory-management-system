import toast from 'react-hot-toast';

export const useToast = () => {
  const success = (message) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: '#059669',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#059669',
      },
    });
  };

  const error = (message) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#DC2626',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#DC2626',
      },
    });
  };

  const warning = (message) => {
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const info = (message) => {
    toast(message, {
      duration: 4000,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const loading = (message) => {
    return toast.loading(message, {
      style: {
        borderRadius: '12px',
        padding: '16px',
      },
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
  };
};