import { toast } from 'react-hot-toast';

export const showNotification = (
  message: string,
  status: 'success' | 'error',
  options = {},
) => {
  toast[status](message, {
    duration: 3000,
    position: 'top-center',
    ...options,
  });
};
