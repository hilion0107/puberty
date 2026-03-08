"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingQuesButton() {
    const pathname = usePathname();

    // 관리자 페이지, 문진표 페이지에서는 숨김
    if (pathname.startsWith("/admin") || pathname.startsWith("/ques")) return null;

    return (
        <Link
            href="/ques"
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full bg-deep-blue text-white font-bold text-sm shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
        >
            <ClipboardList className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">사전 문진표</span>
        </Link>
    );
}
