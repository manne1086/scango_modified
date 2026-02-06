import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Scanner: React.FC<{ onScan: (code: string) => void; variant?: 'square' | 'rectangle' }> = React.memo(({ onScan, variant = 'square' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isSupported, setIsSupported] = useState<boolean>(true);

    useEffect(() => {
        let animationFrameId: number;
        let stream: MediaStream | null = null;
        let detector: any = null;

        if (!('BarcodeDetector' in window)) {
            setIsSupported(false);
        } else {
            // @ts-ignore
            detector = new window.BarcodeDetector({ formats: ['ean_13', 'upc_a', 'code_128', 'qr_code'] });
        }

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setHasPermission(true);
                    if (detector) scanFrame();
                }
            } catch (err) {
                setHasPermission(false);
            }
        };

        const scanFrame = async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                try {
                    const barcodes = await detector.detect(videoRef.current);
                    if (barcodes.length > 0) {
                        onScan(barcodes[0].rawValue);
                    }
                } catch (err) {
                    // console.error("Detection error", err);
                }
            }
            animationFrameId = requestAnimationFrame(scanFrame);
        };

        startCamera();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onScan]);

    if (!isSupported) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-white bg-black h-full">
                <AlertCircle size={48} className="text-[#FFD200] mb-4" />
                <p className="font-bold text-lg">Hardware Incompatibility</p>
                <p className="text-sm text-gray-400 mt-2">Browser doesn't support Barcode API.</p>
            </div>
        );
    }

    if (hasPermission === false) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-white bg-black h-full">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="font-bold">Camera Denied</p>
                <p className="text-sm text-gray-400">Please enable camera access.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" autoPlay playsInline />
            <div className={`relative z-10 border-2 border-white/30 rounded-2xl flex items-center justify-center ${variant === 'rectangle' ? 'w-80 h-40' : 'w-64 h-64'}`}>
                <div className="absolute inset-0 border-4 border-[#007041] animate-pulse rounded-2xl opacity-40"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            </div>
        </div>
    );
});
