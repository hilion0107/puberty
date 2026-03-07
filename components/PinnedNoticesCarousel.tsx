"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Notice {
    id: number;
    title: string;
    title_html: string;
    content: string;
    content_html: string;
    image_path: string;
    link_url: string;
    is_pinned: number;
    author: string;
    created_at: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

interface PinnedNoticesCarouselProps {
    initialNotices?: Notice[];
}

export default function PinnedNoticesCarousel({ initialNotices }: PinnedNoticesCarouselProps) {
    const [notices, setNotices] = useState<Notice[]>(initialNotices || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [direction, setDirection] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!initialNotices || initialNotices.length === 0) {
            fetch("/api/admin/notices")
                .then((res) => res.json())
                .then((data) => {
                    const pinned = (data.notices || []).filter(
                        (n: Notice) => n.is_pinned === 1
                    );
                    setNotices(pinned);
                })
                .catch(() => { });
        }
    }, [initialNotices]);

    const goNext = useCallback(() => {
        if (notices.length <= 1) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, [notices.length]);

    const goPrev = useCallback(() => {
        if (notices.length <= 1) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length);
    }, [notices.length]);

    // Auto-play (0.7x speed → 4300ms interval)
    useEffect(() => {
        if (isPaused || isHovered || notices.length <= 1) return;
        intervalRef.current = setInterval(goNext, 4300);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, isHovered, goNext, notices.length]);

    const handleCardClick = (noticeId: number) => {
        if (expandedId === noticeId) {
            // Already expanded → navigate
            return; // Link handles navigation
        }
        // First click → expand & pause
        setExpandedId(noticeId);
        setIsPaused(true);
    };

    const handleClickOutside = () => {
        if (expandedId !== null) {
            setExpandedId(null);
            setIsPaused(false);
        }
    };

    if (notices.length === 0) return null;

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.95,
        }),
    };

    const currentNotice = notices[currentIndex];
    const isExpanded = expandedId === currentNotice?.id;
    const cardBg = isHovered && !isExpanded
        ? "rgb(255 247 237)"  // light orange on hover
        : isExpanded
            ? "rgb(239 246 255)"  // light blue when expanded
            : "rgb(255 255 255)"; // white default

    return (
        <section
            className="py-20 md:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white"
            onClick={handleClickOutside}
        >
            <div className="max-w-4xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-sm font-bold tracking-widest text-deep-blue uppercase mb-3">
                        Notice
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                        공지사항
                    </h2>
                    <p className="mt-4 text-gray-400 font-medium">
                        우리들소아청소년과의 중요한 소식
                    </p>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Navigation Arrows */}
                    {notices.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrev();
                                    setExpandedId(null);
                                    setIsPaused(false);
                                }}
                                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-deep-blue hover:shadow-xl transition-all"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNext();
                                    setExpandedId(null);
                                    setIsPaused(false);
                                }}
                                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-deep-blue hover:shadow-xl transition-all"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Card Area */}
                    <div className="overflow-hidden rounded-2xl min-h-[200px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <motion.div
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    animate={{
                                        scale: isExpanded ? 1.03 : 1,
                                        backgroundColor: cardBg,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(currentNotice.id);
                                    }}
                                >
                                    {isExpanded ? (
                                        /* Expanded: show as link to detail page */
                                        <Link
                                            href={`/notices/${currentNotice.id}`}
                                            className="block p-8"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Pin className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                                                            고정
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                                                        {currentNotice.title_html &&
                                                            currentNotice.title_html !== currentNotice.title ? (
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: currentNotice.title_html,
                                                                }}
                                                            />
                                                        ) : (
                                                            currentNotice.title
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 whitespace-pre-line mb-4">
                                                        {currentNotice.content}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-300">
                                                            {new Date(currentNotice.created_at).toLocaleDateString("ko-KR")}
                                                        </span>
                                                        <span className="text-xs text-deep-blue font-bold">
                                                            자세히 보기 →
                                                        </span>
                                                    </div>
                                                </div>
                                                {currentNotice.image_path && (
                                                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                        <Image
                                                            src={currentNotice.image_path}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ) : (
                                        /* Collapsed: summary view */
                                        <div className="p-8">
                                            <div className="flex items-start gap-6">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Pin className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                                                            고정
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                                                        {currentNotice.title_html &&
                                                            currentNotice.title_html !== currentNotice.title ? (
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: currentNotice.title_html,
                                                                }}
                                                            />
                                                        ) : (
                                                            currentNotice.title
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 line-clamp-3 whitespace-pre-line">
                                                        {currentNotice.content}
                                                    </p>
                                                    <p className="mt-3 text-xs text-gray-300">
                                                        {new Date(currentNotice.created_at).toLocaleDateString("ko-KR")}
                                                    </p>
                                                </div>
                                                {currentNotice.image_path && (
                                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                        <Image
                                                            src={currentNotice.image_path}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Indicator Dots */}
                    {notices.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {notices.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                        setExpandedId(null);
                                        setIsPaused(false);
                                    }}
                                    className={`rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? "w-6 h-2 bg-deep-blue"
                                        : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    aria-label={`공지 ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Auto-play status indicator */}
                    {isPaused && notices.length > 1 && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-xs text-gray-300 mt-3"
                        >
                            클릭하여 자세히 보기 · 다른 곳을 클릭하면 자동 재생됩니다
                        </motion.p>
                    )}
                </motion.div>

                {/* View All Link */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-8"
                >
                    <Link
                        href="/notices"
                        className="inline-flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-deep-blue transition-colors"
                    >
                        전체 공지사항 보기
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
