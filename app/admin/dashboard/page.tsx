"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, Image, Users, LogOut, Shield, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const menuItems = [
    {
        title: "진료 시간표 관리",
        description: "시간표 이미지를 업로드하면 자동으로 분석하여 진료 안내 페이지에 반영합니다.",
        icon: Calendar,
        href: "/admin/schedule",
        color: "from-blue-500 to-indigo-600",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        title: "공지사항 관리",
        description: "홈페이지 공지사항 게시판의 글을 작성, 수정, 삭제할 수 있습니다.",
        icon: FileText,
        href: "/admin/notices",
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        title: "팝업 설정",
        description: "홈페이지 접속 시 표시되는 팝업창의 이미지, 크기, 위치, 기간을 설정합니다.",
        icon: Image,
        href: "/admin/popup",
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        title: "관리자 계정 관리",
        description: "새로운 관리자 계정을 추가하거나 기존 관리자 목록을 확인합니다.",
        icon: Users,
        href: "/admin/users",
        color: "from-purple-500 to-violet-600",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        title: "문진표 결과",
        description: "환자가 제출한 사전 문진표를 카테고리별로 조회하고 관리합니다.",
        icon: ClipboardList,
        href: "/admin/questionnaire",
        color: "from-cyan-500 to-blue-600",
        bgColor: "bg-cyan-50",
        iconColor: "text-cyan-600",
    },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) {
                    router.push("/admin");
                } else {
                    setUser(data.user);
                }
                setLoading(false);
            })
            .catch(() => {
                router.push("/admin");
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center font-pretendard">
                <div className="animate-spin h-8 w-8 border-4 border-deep-blue border-t-transparent rounded-full" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-pretendard pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-deep-blue/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-deep-blue" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900">관리자 대시보드</h1>
                        </div>
                        <p className="text-gray-400 font-medium ml-[52px]">
                            <span className="text-deep-blue font-bold">{user?.username}</span>님, 환영합니다
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                    </button>
                </motion.div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link
                                href={item.href}
                                className="group block p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                    {item.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
