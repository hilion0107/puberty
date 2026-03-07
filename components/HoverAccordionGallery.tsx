"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

export default function HoverAccordionGallery({
    images,
    onImageClick
}: {
    images: { src: string; label: string }[];
    onImageClick: (index: number) => void;
}) {
    // 1. Determine items per page based on screen width
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [startIndex, setStartIndex] = useState(0);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Track dragging to prevent accidental clicks
    const [dragStartX, setDragStartX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(4);
                setIsMobile(true);
            } else {
                setItemsPerPage(7);
                setIsMobile(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Ensure we don't go out of bounds if screen size changes
    useEffect(() => {
        const maxStartIndex = Math.max(0, images.length - itemsPerPage);
        if (startIndex > maxStartIndex) {
            setStartIndex(maxStartIndex);
        }
    }, [itemsPerPage, images.length, startIndex]);

    // 2. Pagination Logic
    const handleNext = () => {
        const maxStartIndex = Math.max(0, images.length - itemsPerPage);
        setStartIndex((prev) => Math.min(prev + itemsPerPage, maxStartIndex));
    };

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(0, prev - itemsPerPage));
    };

    const displayImages = images.slice(startIndex, startIndex + itemsPerPage);
    const showPrev = startIndex > 0;
    const showNext = startIndex + itemsPerPage < images.length;

    // 3. Drag / Swipe Logic
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragStartX(clientX);
        setIsDragging(false);
    };

    const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (dragStartX === null) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        if (Math.abs(dragStartX - clientX) > 10) {
            setIsDragging(true); // User moved pointer significantly, it's a drag
        }
    };

    const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
        if (dragStartX === null) return;
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
        const diff = dragStartX - clientX;

        // Threshold for swipe is 50px
        if (diff > 50 && showNext) {
            handleNext();
        } else if (diff < -50 && showPrev) {
            handlePrev();
        }

        setDragStartX(null);
        // Delay resetting isDragging so the trailing click event can be blocked
        setTimeout(() => setIsDragging(false), 50);
    };

    return (
        <div className="relative w-full group/gallery select-none">
            <div
                className="w-full h-[400px] md:h-[500px] flex gap-2 md:gap-4 overflow-hidden rounded-3xl"
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            >
                <AnimatePresence mode="popLayout">
                    {displayImages.map((imageObj, localIndex) => {
                        const globalIndex = startIndex + localIndex;
                        const isHovered = hoveredIndex === globalIndex;

                        return (
                            <motion.div
                                key={`${imageObj.src}-${globalIndex}`} // Unique key for AnimatePresence
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    flex: isHovered ? 5 : 1, // Expand hovered item
                                }}
                                exit={{ opacity: 0, scale: 0.8, flex: 0 }}
                                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                                onMouseEnter={() => !isMobile && setHoveredIndex(globalIndex)}
                                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                                onClick={(e) => {
                                    if (isDragging) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
                                    if (isMobile) {
                                        if (hoveredIndex === globalIndex) {
                                            onImageClick(globalIndex);
                                        } else {
                                            setHoveredIndex(globalIndex);
                                        }
                                    } else {
                                        onImageClick(globalIndex);
                                    }
                                }}
                                className="relative h-full overflow-hidden rounded-2xl cursor-pointer group flex-shrink-0 min-w-[40px] md:min-w-[60px]"
                            >
                                <Image
                                    src={imageObj.src}
                                    alt={imageObj.label}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Dark Overlay */}
                                <div
                                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${isHovered ? 'bg-gradient-to-t from-black/80 via-black/10 to-transparent' : 'bg-black/40'}`}
                                />

                                {/* Label */}
                                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end">
                                    <span
                                        className={`text-white font-bold transition-all duration-500 block ${isHovered ? 'text-lg md:text-xl drop-shadow-md whitespace-normal' : 'text-sm whitespace-nowrap overflow-hidden text-ellipsis opacity-0 md:opacity-100'}`}
                                        style={{ writingMode: !isHovered && !isMobile ? 'vertical-rl' : 'horizontal-tb' }}
                                    >
                                        {imageObj.label}
                                    </span>
                                </div>

                                {/* Expand Icon */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.2, delay: 0.1 }}
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        >
                                            <div className="bg-black/30 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center">
                                                <Maximize2 className="text-white w-5 h-5" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination UI Overlay */}
            <AnimatePresence>
                {showPrev && (
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-deep-blue hover:scale-110 transition-transform z-10 opacity-0 group-hover/gallery:opacity-100"
                        aria-label="Previous images"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showNext && (
                    <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-deep-blue hover:scale-110 transition-transform z-10 opacity-0 group-hover/gallery:opacity-100"
                        aria-label="Next images"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
