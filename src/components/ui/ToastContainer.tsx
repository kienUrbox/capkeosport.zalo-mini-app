import { useEffect } from 'react';
import { useSnackbar } from 'zmp-ui';
import { useToastStore } from '@/stores/toast.store';

export const ToastContainer = () => {
  const { openSnackbar } = useSnackbar();
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const latestToast = toasts[toasts.length - 1];
    if (latestToast) {
      openSnackbar({
        text: latestToast.message,
        type: latestToast.type,
        position: 'top',
        duration: 3000,
      });
      removeToast(latestToast.id);
    }
  }, [toasts, openSnackbar, removeToast]);

  return null;
};
