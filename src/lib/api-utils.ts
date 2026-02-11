import { toast } from 'sonner';

export const handleApiError = (error: any, defaultMessage: string = 'Terjadi kesalahan.') => {
    if (!error.response) {
        toast.error(
            'Gagal terhubung ke server. Pastikan server menyala atau periksa koneksi internet Anda.',
        );
        return;
    }
    const { message } = error?.response?.data || {};
    toast.error(message || defaultMessage);
};
