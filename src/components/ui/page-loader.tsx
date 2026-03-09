import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
    spinnerColor?: string;
}

export function PageLoader({
    message = 'Loading...',
    spinnerColor = 'text-primary',
}: PageLoaderProps) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
            <Loader2 className={`w-10 h-10 animate-spin ${spinnerColor}`} />
            <p className="text-gray-500 font-medium animate-pulse">{message}</p>
        </div>
    );
}
