"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Clock, RefreshCw } from "lucide-react";

// 세션 타임아웃: 1시간 (밀리초)
const SESSION_TIMEOUT = 60 * 60 * 1000;
// 팝업 후 자동 로그아웃까지 1분 (밀리초)
const LOGOUT_GRACE_PERIOD = 60 * 1000;

export default function AdminSessionManager() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // 관리자 로그인 상태 확인
    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/verify");
            const data = await res.json();
            setIsAdmin(!!data.authenticated);
            return !!data.authenticated;
        } catch {
            setIsAdmin(false);
            return false;
        }
    }, []);

    // 로그아웃 처리
    const performLogout = useCallback(async () => {
        clearAllTimers();
        setShowTimeoutPopup(false);
        await fetch("/api/auth/logout", { method: "POST" });
        setIsAdmin(false);
        router.push("/");
    }, [router]);

    // 모든 타이머 정리
    const clearAllTimers = useCallback(() => {
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
            sessionTimerRef.current = null;
        }
        if (graceTimerRef.current) {
            clearTimeout(graceTimerRef.current);
            graceTimerRef.current = null;
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, []);

    // 세션 타이머 시작/리셋
    const resetSessionTimer = useCallback(() => {
        if (!isAdmin) return;
        clearAllTimers();

        sessionTimerRef.current = setTimeout(() => {
            // 타임아웃 팝업 표시
            setShowTimeoutPopup(true);
            setCountdown(60);

            // 카운트다운 시작
            countdownRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // 1분 후 자동 로그아웃
            graceTimerRef.current = setTimeout(() => {
                performLogout();
            }, LOGOUT_GRACE_PERIOD);
        }, SESSION_TIMEOUT);
    }, [isAdmin, clearAllTimers, performLogout]);

    // "시간연장" 클릭
    const handleExtendSession = useCallback(() => {
        setShowTimeoutPopup(false);
        setCountdown(60);
        resetSessionTimer();
    }, [resetSessionTimer]);

    // 초기 인증 확인 및 타이머 설정
    useEffect(() => {
        checkAuth().then((authenticated) => {
            if (authenticated) {
                resetSessionTimer();
            }
        });

        return () => clearAllTimers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // isAdmin 상태 변화 시 타이머 관리
    useEffect(() => {
        if (isAdmin) {
            resetSessionTimer();
        } else {
            clearAllTimers();
        }
    }, [isAdmin, resetSessionTimer, clearAllTimers]);

    // 사용자 활동 감지 → 타이머 리셋
    useEffect(() => {
        if (!isAdmin) return;

        const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
        const handleActivity = () => {
            // 팝업이 떠 있을 때는 활동 감지로 리셋하지 않음
            if (!showTimeoutPopup) {
                resetSessionTimer();
            }
        };

        activityEvents.forEach((event) =>
            window.addEventListener(event, handleActivity, { passive: true })
        );

        return () => {
            activityEvents.forEach((event) =>
                window.removeEventListener(event, handleActivity)
            );
        };
    }, [isAdmin, showTimeoutPopup, resetSessionTimer]);

    // 주기적 인증 상태 확인 (다른 탭에서 로그아웃된 경우 대응)
    useEffect(() => {
        if (!isAdmin) return;
        const interval = setInterval(checkAuth, 5 * 60 * 1000); // 5분마다
        return () => clearInterval(interval);
    }, [isAdmin, checkAuth]);

    // 로그인 상태가 아니면 아무것도 렌더링하지 않음
    if (!isAdmin) return null;

    return (
        <AnimatePresence>
            {showTimeoutPopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                            <Clock className="w-7 h-7 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-2">
                            세션 만료 알림
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                            장시간 사용이 없어 로그아웃됩니다.
                        </p>
                        <p className="text-xs text-gray-400 mb-6">
                            <span className="text-amber-500 font-bold text-base">{countdown}</span>초 후 자동 로그아웃
                        </p>
                        <button
                            onClick={handleExtendSession}
                            className="w-full py-3 rounded-xl bg-deep-blue text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-md"
                        >
                            <RefreshCw className="w-4 h-4" />
                            시간연장
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
