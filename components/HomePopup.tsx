"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface PopupData {
    id: number;
    title: string;
    imagePath: string;
    size: string;
    position: string;
    durationDays: number;
}

interface PopupState {
    popup: PopupData;
    visible: boolean;
    offset: { x: number; y: number };
}

export default function HomePopup() {
    const [popupStates, setPopupStates] = useState<PopupState[]>([]);

    useEffect(() => {
        // Check if dismissed today
        const dismissedDate = localStorage.getItem("popup_dismissed_date");
        const today = new Date().toDateString();
        if (dismissedDate === today) return;

        const sessionDismissed = sessionStorage.getItem("popup_dismissed");
        if (sessionDismissed === "true") return;

        fetch("/api/admin/popup")
            .then((res) => res.json())
            .then((data) => {
                const popups: PopupData[] = data.popups || [];
                if (popups.length === 0 && data.popup) {
                    popups.push(data.popup);
                }
                if (popups.length > 0) {
                    // Check individual dismiss state
                    const dismissed = JSON.parse(sessionStorage.getItem("popup_dismissed_ids") || "[]");
                    const states = popups
                        .filter((p) => !dismissed.includes(p.id))
                        .map((popup, idx) => ({
                            popup,
                            visible: true,
                            offset: { x: idx * 30, y: idx * 30 },
                        }));
                    setPopupStates(states);
                }
            })
            .catch(() => { });
    }, []);

    const handleClose = (id: number) => {
        setPopupStates((prev) => prev.map((s) => s.popup.id === id ? { ...s, visible: false } : s));
        const dismissed = JSON.parse(sessionStorage.getItem("popup_dismissed_ids") || "[]");
        dismissed.push(id);
        sessionStorage.setItem("popup_dismissed_ids", JSON.stringify(dismissed));

        // If all closed, set session flag
        setTimeout(() => {
            setPopupStates((prev) => {
                const remaining = prev.filter((s) => s.visible);
                if (remaining.length === 0) {
                    sessionStorage.setItem("popup_dismissed", "true");
                }
                return prev;
            });
        }, 400);
    };

    const handleDismissToday = (id: number) => {
        handleClose(id);
        localStorage.setItem("popup_dismissed_date", new Date().toDateString());
    };

    const getPositionClasses = (pos: string): string => {
        switch (pos) {
            case "top-left": return "items-start justify-start pt-[10vh] pl-[5vw]";
            case "top-right": return "items-start justify-end pt-[10vh] pr-[5vw]";
            case "center": return "items-center justify-center";
            case "bottom-left": return "items-end justify-start pb-[10vh] pl-[5vw]";
            case "bottom-right": return "items-end justify-end pb-[10vh] pr-[5vw]";
            default: return "items-center justify-center";
        }
    };

    const getSizeClass = (sz: string): string => {
        switch (sz) {
            case "1": return "w-[85vw] md:w-[70vw]";
            case "1/2": return "w-[50vw] md:w-[40vw]";
            case "1/3": return "w-[35vw] md:w-[30vw]";
            case "1/4": return "w-[28vw] md:w-[22vw]";
            default: return "w-[50vw] md:w-[40vw]";
        }
    };

    const anyVisible = popupStates.some((s) => s.visible);
    if (!anyVisible && popupStates.length > 0) return null;
    if (popupStates.length === 0) return null;

    return (
        <AnimatePresence>
            {anyVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] bg-black/40"
                >
                    {popupStates.map((state) => (
                        state.visible && (
                            <DraggablePopup
                                key={state.popup.id}
                                popup={state.popup}
                                offset={state.offset}
                                positionClasses={getPositionClasses(state.popup.position)}
                                sizeClass={getSizeClass(state.popup.size)}
                                onClose={() => handleClose(state.popup.id)}
                                onDismissToday={() => handleDismissToday(state.popup.id)}
                            />
                        )
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface DraggablePopupProps {
    popup: PopupData;
    offset: { x: number; y: number };
    positionClasses: string;
    sizeClass: string;
    onClose: () => void;
    onDismissToday: () => void;
}

function DraggablePopup({ popup, offset, positionClasses, sizeClass, onClose, onDismissToday }: DraggablePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
    const dragStartRef = useRef<{ mouseX: number; mouseY: number; elX: number; elY: number } | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        e.preventDefault();
        const el = popupRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        dragStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            elX: rect.left,
            elY: rect.top,
        };
        setIsDragging(true);
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        const touch = e.touches[0];
        const el = popupRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        dragStartRef.current = {
            mouseX: touch.clientX,
            mouseY: touch.clientY,
            elX: rect.left,
            elY: rect.top,
        };
        setIsDragging(true);
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragStartRef.current) return;
            const dx = e.clientX - dragStartRef.current.mouseX;
            const dy = e.clientY - dragStartRef.current.mouseY;
            setDragPos({
                x: dragStartRef.current.elX + dx,
                y: dragStartRef.current.elY + dy,
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!dragStartRef.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - dragStartRef.current.mouseX;
            const dy = touch.clientY - dragStartRef.current.mouseY;
            setDragPos({
                x: dragStartRef.current.elX + dx,
                y: dragStartRef.current.elY + dy,
            });
        };

        const handleEnd = () => {
            setIsDragging(false);
            dragStartRef.current = null;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleEnd);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging]);

    const containerStyle: React.CSSProperties = dragPos
        ? {
            position: "fixed",
            left: dragPos.x,
            top: dragPos.y,
            transform: "none",
            zIndex: 1000,
        }
        : {};

    return (
        <div
            className={`absolute inset-0 flex ${positionClasses} pointer-events-none`}
            style={{ pointerEvents: "none" }}
        >
            <motion.div
                ref={popupRef}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`${sizeClass} bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                style={{
                    ...containerStyle,
                    marginLeft: !dragPos ? offset.x : undefined,
                    marginTop: !dragPos ? offset.y : undefined,
                    userSelect: "none",
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Image */}
                <div className="relative w-full bg-white">
                    {popup.imagePath?.toLowerCase().endsWith(".pdf") ? (
                        <iframe
                            src={popup.imagePath}
                            className="w-full min-h-[500px] border-0 pointer-events-none"
                            title={popup.title || "PDF 팝업"}
                        />
                    ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={popup.imagePath}
                            alt={popup.title || "공지 팝업"}
                            className="w-full h-auto pointer-events-none"
                            draggable={false}
                        />
                    )}
                </div>

                {/* Bottom buttons */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
                    <button
                        onClick={onDismissToday}
                        className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors cursor-pointer"
                    >
                        오늘 하루 열지 않기
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-bold transition-colors cursor-pointer"
                    >
                        닫기
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
