"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navData = [
    {
        id: "about",
        title: "병원소개",
        href: "/about",
        subMenus: [
            { label: "인사말", href: "/about#greeting" },
            { label: "의료진 소개", href: "/about#staff" },
            { label: "병원 둘러보기", href: "/about#tour" }
        ]
    },
    {
        id: "clinic",
        title: "진료 안내",
        href: "/clinic",
        subMenus: [
            { label: "진료 과목", href: "/clinic#departments" },
            { label: "진료 시간표", href: "/clinic#schedule" },
            { label: "진료 예약", href: "/clinic#reservation" }
        ]
    },
    {
        id: "puberty",
        title: "성조숙증 클리닉",
        href: "/puberty",
        subMenus: [
            { label: "성조숙증이란?", href: "/puberty#definition" },
            { label: "치료 필요성", href: "/puberty#why-treat" },
            { label: "검사", href: "/puberty#imaging" },
            { label: "치료", href: "/puberty#duration" }
        ]
    },
    {
        id: "growth",
        title: "성장 클리닉",
        href: "/growth",
        subMenus: [
            { label: "저신장", href: "/growth#definition" },
            { label: "자가진단", href: "/growth#checklist" },
            { label: "치료", href: "/growth#principle" },
            { label: "진료 과정", href: "/growth#process" }
        ]
    },
    {
        id: "development",
        title: "아동발달센터",
        href: "/development",
        subMenus: [
            { label: "소개", href: "/development#intro" },
            { label: "자가진단", href: "/development#checklist" },
            { label: "발달검사", href: "/development#test" },
            { label: "치료 프로그램", href: "/development#treatment" },
            { label: "진료 과정", href: "/development#process" }
        ]
    },
    {
        id: "notices",
        title: "공지사항",
        href: "/notices",
        subMenus: []
    }
];

export default function Navigation() {
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const pathname = usePathname();

    const containerVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
    };

    return (
        <header className="fixed top-0 z-50 w-full border-b border-gray-100/60 bg-white/70 backdrop-blur-md transition-colors font-pretendard">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1.5 font-bold text-gray-900 group">
                    <img
                        src="/images/cloud_logo_clean.png"
                        alt="우리들소아청소년과 로고"
                        className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
                        style={{ mixBlendMode: 'multiply' }}
                    />
                    <span className="text-2xl tracking-tight whitespace-nowrap">우리들소아청소년과</span>
                </Link>

                {/* Desktop Main Menu */}
                <nav className="hidden lg:flex items-center gap-8 relative" onMouseLeave={() => setHoveredMenu(null)}>
                    {navData.map((menu) => {
                        const isActive = pathname === menu.href;

                        return (
                            <div
                                key={menu.id}
                                className="relative py-2"
                                onMouseEnter={() => setHoveredMenu(menu.id)}
                            >
                                <Link
                                    href={menu.href}
                                    className={`flex items-center gap-1 text-base font-bold transition-colors ${isActive ? "text-deep-blue" : "text-gray-600 hover:text-deep-blue"
                                        }`}
                                >
                                    {menu.title}
                                    {menu.subMenus.length > 0 && (
                                        <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-300" style={{ transform: hoveredMenu === menu.id ? "rotate(180deg)" : "rotate(0deg)" }} />
                                    )}
                                </Link>

                                {/* Active Indicator Pill/Bar */}
                                {hoveredMenu === menu.id && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute -bottom-[17px] left-0 right-0 h-[3px] bg-deep-blue rounded-t-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}

                                {/* Dropdown Menu */}
                                {menu.subMenus.length > 0 && (
                                    <AnimatePresence>
                                        {hoveredMenu === menu.id && (
                                            <motion.div
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute left-1/2 top-full mt-[16px] w-48 -translate-x-1/2 rounded-2xl bg-white p-2.5 shadow-xl ring-1 ring-black/5"
                                            >
                                                {menu.subMenus.map((sub) => (
                                                    <motion.div key={sub.label} variants={itemVariants}>
                                                        <Link
                                                            href={sub.href}
                                                            className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-deep-blue"
                                                            onClick={() => setHoveredMenu(null)}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/admin"
                        className="text-[11px] font-medium text-gray-400 hover:text-deep-blue transition-colors px-2 py-1"
                    >
                        관리자
                    </Link>
                    <Link
                        href="/clinic#schedule"
                        className="group flex items-center justify-center gap-2 rounded-full bg-deep-blue px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-deep-blue/90 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Calendar className="h-4 w-4 transition-transform group-hover:scale-110" />
                        진료시간표
                    </Link>
                </div>
            </div>
        </header>
    );
}
