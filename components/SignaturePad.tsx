"use client";

import { useRef, useState, useEffect } from "react";
import { Eraser } from "lucide-react";

interface SignaturePadProps {
    onSave: (signatureDataUrl: string | null) => void;
    initialDataUrl?: string | null;
}

export default function SignaturePad({ onSave, initialDataUrl }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 캔버스 해상도 보정 (가장 선명하게 나오도록 Retina 디스플레이 지원)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#0f172a";

        // 배경을 흰색으로 채우기
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);

        // 초기 서명 데이터가 있으면 그리기
        if (initialDataUrl) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
                setHasSignature(true);
            };
            img.src = initialDataUrl;
        }

    }, [initialDataUrl]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX = 0, clientY = 0;

        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX = 0, clientY = 0;

        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const canvas = canvasRef.current;
            if (canvas) {
                onSave(canvas.toDataURL("image/png"));
            }
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);
        setHasSignature(false);
        onSave(null);
    };

    return (
        <div className="w-full">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    className="w-full h-40 touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                {!hasSignature && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 font-medium text-sm">
                        여기에 서명을 그려주세요
                    </div>
                )}
            </div>
            {hasSignature && (
                <div className="mt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={clearSignature}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded bg-gray-100 hover:bg-red-50"
                    >
                        <Eraser className="w-3 h-3" />
                        다시 쓰기
                    </button>
                </div>
            )}
        </div>
    );
}
