import { useCallback } from 'react';
import { toast } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const useToast = () => {
    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast.info(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            default:
                toast.info(message);
                break;
        }
    }, []);

    return { showToast };
};

export default useToast;