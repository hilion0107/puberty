"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PopupData {
    id: number;
    title: string;
    imagePath: string;
    size: string;
    position: string;
    durationDays: number;
    linkUrl?: string;
}

export default function HomePopup({ initialData }: { initialData?: PopupData[] }) {
    const [popups, setPopups] = useState<PopupData[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 이미 앱에서 해제했거나 오늘 안보기 한 경우 리턴
        const sessionDismissed = sessionStorage.getItem("popup_dismissed");
        const dismissedDate = localStorage.getItem("popup_dismissed_date");
        const today = new Date().toDateString();

        if (sessionDismissed === "true" || dismissedDate === today) return;

        const handleData = (data: PopupData[]) => {
            if (data && data.length > 0) {
                const dismissed = JSON.parse(sessionStorage.getItem("popup_dismissed_ids") || "[]");
                // 사용자가 개별적으로 닫지 않은 팝업만 필터
                const validPopups = data.filter(p => !dismissed.includes(p.id));
                if (validPopups.length > 0) {
                    setPopups(validPopups);
                    setIsVisible(true);
                }
            }
        };

        if (initialData && initialData.length > 0) {
            handleData(initialData);
        } else {
             fetch("/api/admin/popup")
                 .then((res) => res.json())
                 .then((data) => {
                     const fetchedPopups: PopupData[] = data.popups || [];
                     if (fetchedPopups.length === 0 && data.popup) {
                         fetchedPopups.push(data.popup);
                     }
                     handleData(fetchedPopups);
                 })
                 .catch(() => { });
        }
    }, [initialData]);

    // 데스크톱 화면에서 팝업이 전체 화면의 1/3 사이즈로 렌더링되도록 일관된 클래스 적용
    const getSlideWidthClass = () => {
        return "!w-[85vw] md:!w-[45vw] lg:!w-[33vw]"; 
    };

    const handleCloseAll = () => {
        setIsVisible(false);
        sessionStorage.setItem("popup_dismissed", "true");
        const dismissed = JSON.parse(sessionStorage.getItem("popup_dismissed_ids") || "[]");
        popups.forEach(p => dismissed.push(p.id));
        sessionStorage.setItem("popup_dismissed_ids", JSON.stringify(dismissed));
    };

    const handleDismissTodayAll = () => {
        handleCloseAll();
        localStorage.setItem("popup_dismissed_date", new Date().toDateString());
    };

    const handleCloseSingle = (id: number) => {
        const newPopups = popups.filter(p => p.id !== id);
        const dismissed = JSON.parse(sessionStorage.getItem("popup_dismissed_ids") || "[]");
        dismissed.push(id);
        sessionStorage.setItem("popup_dismissed_ids", JSON.stringify(dismissed));

        if (newPopups.length === 0) {
            handleCloseAll();
        } else {
            setPopups(newPopups);
        }
    };

    if (!isVisible || popups.length === 0) return null;

    const PopupContent = ({ popup }: { popup: PopupData }) => {
        const content = (
            <div className="relative w-full cursor-pointer hover:opacity-[0.98] transition-opacity bg-white">
                {popup.imagePath?.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                        src={popup.imagePath}
                        className="w-full h-[50vh] md:h-[60vh] border-0 pointer-events-none"
                        title={popup.title || "PDF 팝업"}
                    />
                ) : (
                    <Image
                        src={popup.imagePath}
                        alt={popup.title || "공지 팝업"}
                        width={800}
                        height={800}
                        className="w-full max-h-[60vh] md:max-h-[75vh] object-contain"
                        draggable={false}
                        priority={true}
                    />
                )}
            </div>
        );

        if (popup.linkUrl) {
            // 외부 링크 보정 (http나 https 포함 안 되어있으면 붙임)
            const url = popup.linkUrl.startsWith('http') ? popup.linkUrl : `https://${popup.linkUrl}`;
            return (
                <Link href={url} target="_blank" rel="noopener noreferrer" className="block w-full">
                    {content}
                </Link>
            );
        }

        return <>{content}</>;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pt-8 pb-20 md:pb-24 px-0"
            >
                <div className="w-full flex-1 flex flex-col items-center justify-center relative">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={"auto"}
                        centeredSlides={true}
                        grabCursor={true}
                        navigation={{
                            prevEl: '.popup-prev',
                            nextEl: '.popup-next',
                        }}
                        pagination={{ 
                            clickable: true, 
                            el: '.popup-pagination',
                            bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2.5 !h-2.5 !mx-1.5 transition-all',
                            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-6 !rounded-full'
                        }}
                        className="w-full"
                    >
                        {popups.map((popup) => (
                            <SwiperSlide 
                                key={popup.id} 
                                className={`${getSlideWidthClass()} !h-auto flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden`}
                            >
                                <div className="flex-1 flex flex-col justify-center items-center bg-white">
                                    <PopupContent popup={popup} />
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDismissTodayAll(); }}
                                        className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
                                    >
                                        오늘 하루 보지 않기 (전체)
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCloseSingle(popup.id); }}
                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-bold transition-colors"
                                    >
                                        닫기
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* PC/Mobile 공통: 하단 네비게이션 */}
                {popups.length > 1 && (
                    <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex items-center justify-center gap-6 px-4 z-50">
                        <button className="popup-prev w-12 h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-md transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="popup-pagination flex justify-center !w-auto"></div>
                        <button className="popup-next w-12 h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-md transition-all">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* 우측 상단 공통 전체 닫기 */}
                <button 
                    onClick={handleCloseAll}
                    className="absolute top-4 right-4 md:top-8 md:right-8 w-11 h-11 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-[1000] border border-white/10"
                >
                    <X className="w-6 h-6" />
                </button>

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(0,0,0,0.1);
                        border-radius: 10px;
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
}
