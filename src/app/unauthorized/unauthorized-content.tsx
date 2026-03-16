'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { motion } from 'framer-motion';

export default function UnauthorizedContent() {
    return (
        <div className="w-full flex-1 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center space-y-8 p-10 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
            >
                <div className="flex justify-center">
                    <div className="relative">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="bg-red-50 p-5 rounded-full"
                        >
                            <ShieldAlert className="w-16 h-16 text-red-500" />
                        </motion.div>
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.2, 0.5]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-red-400 rounded-full -z-10"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-600">
                        Akses Ditolak
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                    </p>
                </div>

                <div className="pt-6 flex flex-col gap-3">
                    <Button asChild className="w-full h-12 text-md font-semibold transition-all duration-300">
                        <Link href="/dashboard" className="flex items-center justify-center gap-2">
                            <Home className="w-4 h-4" />
                            Kembali ke Dashboard
                        </Link>
                    </Button>
                    
                    <Button asChild variant="ghost" className="w-full h-12 text-md font-medium text-slate-600 hover:bg-slate-50">
                        <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Halaman Sebelumnya
                        </button>
                    </Button>
                </div>

                <div className="pt-8 border-t border-slate-100 italic text-slate-400 text-sm">
                    Error Code: 403 • Unauthorized Access
                </div>
            </motion.div>
        </div>
    );
}
