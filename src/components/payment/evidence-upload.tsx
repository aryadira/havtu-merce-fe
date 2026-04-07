'use client';

import { useState } from 'react';
import { useUploadEvidence } from '@/src/lib/hooks/payment/payment';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle2, Loader2, X } from 'lucide-react';

interface EvidenceUploadProps {
    orderId: string;
    onSuccess?: () => void;
}

export function EvidenceUpload({ orderId, onSuccess }: EvidenceUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const { mutate: upload, isPending } = useUploadEvidence({
        onSuccess: () => {
            toast.success('Bukti pembayaran berhasil diupload!');
            setFile(null);
            setPreview(null);
            onSuccess?.();
        },
        onError: (error) => {
            toast.error('Gagal mengupload bukti pembayaran. Pastikan ukuran file < 5MB.');
            console.error(error)
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreview(null);
            }
        }
    };

    const handleUpload = () => {
        if (!file) return;
        upload({ orderId, file });
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <Card className="border-emerald-100 bg-emerald-50/30 overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    Upload Bukti Transfer
                </CardTitle>
                <CardDescription>
                    Pilih file gambar (JPG, PNG, WEBP) atau PDF bukti transfer Anda.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!file ? (
                    <div className="relative group">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-emerald-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-400 transition-all cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-sm font-medium text-emerald-700">Klik untuk pilih file</p>
                                <p className="text-xs text-emerald-500 mt-1">Maks. 5MB</p>
                            </div>
                            <Input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="relative p-3 bg-white border border-emerald-200 flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <FileText className="w-6 h-6 text-emerald-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                onClick={removeFile}
                                disabled={isPending}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                            onClick={handleUpload}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Mengupload...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Konfirmasi Pembayaran
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
