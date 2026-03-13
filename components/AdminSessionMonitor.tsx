"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut } from "lucide-react";

interface AdminSessionMonitorProps {
    autoLogoutMinutes: number; // db에 저장된 시간(기본 60분)
}

export default function AdminSessionMonitor({ autoLogoutMinutes }: AdminSessionMonitorProps) {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(60); // 경고창에서 보여줄 60초 카운트다운
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 자동 로그아웃 밀리초 (설정된 분 단위 * 60초 * 1000)
    const timeoutMs = autoLogoutMinutes * 60 * 1000;
    // 경고 팝업을 표시할 시점 (로그아웃 1분 전)
    const warningMs = Math.max(0, timeoutMs - 60000);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout failed", error);
        }
        router.push("/admin");
    }, [router]);

    const resetTimer = useCallback(() => {
        // 이미 경고가 떠 있다면 초기화만으로는 안되고 재연장 액션이 필요함
        if (showWarning) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setShowWarning(true);
            setRemainingSeconds(60);
        }, warningMs);
    }, [warningMs, showWarning]);

    useEffect(() => {
        // 전역 이벤트 리스너 등록 (Throttling 적용하여 과도한 호출 방지)
        const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
        let throttleTimeout: NodeJS.Timeout | null = null;

        const handleActivity = () => {
            if (throttleTimeout) return;
            throttleTimeout = setTimeout(() => {
                resetTimer();
                throttleTimeout = null;
            }, 1000); // 1초에 한 번만 반응
        };

        events.forEach((event) => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        // 초기 타이머 시작
        resetTimer();

        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, handleActivity);
            });
            if (throttleTimeout) clearTimeout(throttleTimeout);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [resetTimer]);

    // 경고창이 떴을 때 1초마다 카운트다운
    useEffect(() => {
        if (showWarning) {
            intervalRef.current = setInterval(() => {
                setRemainingSeconds((prev) => {
                    if (prev <= 1) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        logout(); // 0초 도달 시 로그아웃
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [showWarning, logout]);

    const handleExtendSession = () => {
        setShowWarning(false);
        resetTimer();
    };

    return (
        <AnimatePresence>
            {showWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm"
                    >
                        <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">세션 만료 경고</h2>
                            <p className="text-gray-600 text-center text-sm mb-4">
                                장시간 비활동으로 인해 잠시 후 <br className="hidden sm:block" />
                                보안을 위해 <strong>자동으로 로그아웃</strong> 됩니다.
                            </p>
                            <div className="text-4xl font-black text-red-600 mb-2">
                                {remainingSeconds}초
                            </div>
                        </div>
                        <div className="p-4 flex gap-3 bg-gray-50">
                            <button
                                onClick={handleExtendSession}
                                className="flex-1 py-3 px-4 bg-deep-blue text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm"
                            >
                                세션 연장하기
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-3 bg-white text-gray-700 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
