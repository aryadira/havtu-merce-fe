'use client';

import { useState } from 'react';
import { useVerifyEvidence } from '@/src/lib/hooks/payment/payment';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';

interface EvidenceVerificationProps {
    orderId: string;
    evidenceUrl?: string;
    status?: string;
    onSuccess?: () => void;
}

export function EvidenceVerification({ 
    orderId, 
    evidenceUrl, 
    status,
    onSuccess 
}: EvidenceVerificationProps) {
    const [note, setNote] = useState('');
    const { mutate: verify, isPending } = useVerifyEvidence({
        onSuccess: (data) => {
            toast.success(`Pembayaran berhasil ${data.status === 'success' ? 'disetujui' : 'ditolak'}!`);
            onSuccess?.();
        },
        onError: () => {
            toast.error('Gagal memverifikasi pembayaran.');
        },
    });

    const isWaiting = status === 'waiting_verification';

    const handleVerify = (action: 'approve' | 'reject') => {
        verify({
            orderId,
            data: {
                action,
                verification_note: note,
            },
        });
    };

    if (!evidenceUrl) return null;

    const fullEvidenceUrl = evidenceUrl.startsWith('http') 
        ? evidenceUrl 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/../${evidenceUrl}`;

    return (
        <Card className="border-blue-100 bg-blue-50/20 overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    Verifikasi Pembayaran
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-xl border border-blue-100 overflow-hidden group">
                    {evidenceUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <ExternalLink className="w-12 h-12 text-blue-400" />
                            <p className="text-sm font-medium text-blue-700">Bukti Pembayaran (PDF)</p>
                        </div>
                    ) : (
                        <img 
                            src={fullEvidenceUrl} 
                            alt="Bukti Transfer" 
                            className="w-full h-full object-contain"
                        />
                    )}
                    <a 
                        href={fullEvidenceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium gap-2"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Lihat Gambar Penuh
                    </a>
                </div>

                {isWaiting && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Catatan Verifikasi (Opsional)</label>
                        <Textarea 
                            placeholder="Contoh: Bukti transfer tidak terbaca atau nominal tidak sesuai..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="resize-none h-20 bg-white"
                        />
                    </div>
                )}
            </CardContent>
            {isWaiting && (
                <CardFooter className="bg-white border-t border-blue-50 p-4 flex gap-3">
                    <Button
                        variant="destructive"
                        className="flex-1 font-semibold h-11"
                        onClick={() => handleVerify('reject')}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                        Tolak
                    </Button>
                    <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                        onClick={() => handleVerify('approve')}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Setujui
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
