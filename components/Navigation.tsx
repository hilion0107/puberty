"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Menu, X } from "lucide-react";
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const pathname = usePathname();

    // 메뉴 이동 시 모바일 메뉴 자동 닫기
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setExpandedMenus([]);
    }, [pathname]);

    const toggleMobileMenu = (id: string) => {
        setExpandedMenus(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

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
            <div className="mx-auto flex h-[60px] md:h-[72px] max-w-7xl items-center justify-between px-4 md:px-6 relative">

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 -ml-2 text-gray-700 hover:text-deep-blue transition-colors focus:outline-none"
                    aria-label="메뉴 열기"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Logo */}
                <Link
                    href="/"
                    className="flex flex-row items-center gap-1.5 font-bold text-gray-900 group md:static absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0"
                >
                    <img
                        src="/images/cloud_logo_clean.png"
                        alt="우리들소아청소년과 로고"
                        className="w-6 h-6 md:w-10 md:h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,216,182,0.6)] shrink-0"
                        style={{ mixBlendMode: 'multiply' }}
                    />
                    <span className="text-base md:text-2xl tracking-tight whitespace-nowrap transition-colors duration-300 group-hover:text-[#00d8b6]">우리들소아청소년과</span>
                </Link>

                {/* Mobile Schedule button (Right side) */}
                <Link
                    href="/clinic#schedule"
                    className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 bg-deep-blue text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm"
                >
                    진료시간표
                </Link>

                {/* Desktop Main Menu */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 relative" onMouseLeave={() => setHoveredMenu(null)}>
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

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-[100] flex h-[100dvh] w-full">
                        {/* Background Overlay (Right 40%) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer (Left 40%) */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative z-10 w-[40%] min-w-[40%] max-w-[40%] h-full bg-white shadow-2xl flex flex-col overflow-hidden flex-none"
                        >
                            {/* Drawer Header */}
                            <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-100 min-h-[60px]">
                                <span className="font-bold text-gray-900 tracking-tight">메뉴</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1.5 -mr-1.5 text-gray-500 hover:text-deep-blue bg-gray-50 rounded-full"
                                    aria-label="메뉴 닫기"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Body (Menus) */}
                            <div className="flex-1 overflow-y-auto w-full py-2">
                                {navData.map((menu) => (
                                    <div key={menu.id} className="w-full">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50/50">
                                            <Link
                                                href={menu.href}
                                                className="text-[14px] font-bold text-gray-800 whitespace-normal break-words leading-tight flex-1 pr-2"
                                                onClick={() => {
                                                    if (menu.subMenus.length === 0) setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                {menu.title}
                                            </Link>

                                            {menu.subMenus.length > 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleMobileMenu(menu.id);
                                                    }}
                                                    className="p-1.5 text-gray-400 bg-gray-50 rounded-full active:bg-gray-100 transition-colors"
                                                >
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-300 ${expandedMenus.includes(menu.id) ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {menu.subMenus.length > 0 && expandedMenus.includes(menu.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50/50"
                                                >
                                                    <div className="flex flex-col px-4 py-1.5 space-y-1">
                                                        {menu.subMenus.map((sub) => (
                                                            <Link
                                                                key={sub.label}
                                                                href={sub.href}
                                                                className="py-2.5 pl-2 text-[14px] font-medium text-gray-600 hover:text-deep-blue"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Drawer Footer (Admin & Schedule) */}
                            <div className="mt-auto border-t border-gray-100 p-3 flex flex-col gap-2 shrink-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                                <Link
                                    href="/clinic#schedule"
                                    className="flex items-center justify-center gap-1.5 rounded-lg bg-deep-blue px-2 py-2.5 text-[12px] font-bold text-white shadow-sm break-keep text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                    <span>진료시간표</span>
                                </Link>
                                <Link
                                    href="/admin"
                                    className="text-center text-[12px] font-medium text-gray-400 py-2 bg-gray-50 rounded-lg"
                                >
                                    관리자
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
}
