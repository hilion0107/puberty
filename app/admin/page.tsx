"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // 이미 로그인된 상태인지 확인 → 로그인되어 있으면 대시보드로 바로 이동
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/verify");
                if (res.ok) {
                    router.replace("/admin/dashboard");
                    return;
                }
            } catch {
                // 인증 실패 → 로그인 페이지 표시
            }
            setChecking(false);
        };
        checkAuth();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "로그인에 실패했습니다.");
                setLoading(false);
                return;
            }

            router.push("/admin/dashboard");
        } catch {
            setError("서버와 연결할 수 없습니다.");
            setLoading(false);
        }
    };

    // 인증 확인 중에는 로딩 화면 표시
    if (checking) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-deep-blue/20 border-t-deep-blue rounded-full" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white font-pretendard flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-deep-blue/10 flex items-center justify-center mx-auto mb-5">
                            <Lock className="w-8 h-8 text-deep-blue" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2">
                            관리자 로그인
                        </h1>
                        <p className="text-sm text-gray-400 font-medium">
                            우리들소아청소년과 관리자 전용 페이지
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100"
                        >
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="text-sm text-red-600 font-medium">{error}</span>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                아이디
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="관리자 아이디"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    로그인 중...
                                </span>
                            ) : (
                                "로그인"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-300 mt-6">
                    © 우리들소아청소년과 관리자 시스템
                </p>
            </motion.div>
        </main>
    );
}
