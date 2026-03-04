"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2 } from "lucide-react";

export default function HoverAccordionGallery({
    images,
    onImageClick
}: {
    images: string[];
    onImageClick: (index: number) => void;
}) {
    // Only show a limited number of images to make the accordion effective.
    // Optimal number is usually 5-7. We'll slice the first 7.
    const displayImages = images.slice(0, 7);

    // We keep track of which image index is hovered. null means none.
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="w-full h-[400px] md:h-[500px] flex gap-2 md:gap-4 overflow-hidden rounded-3xl">
            {displayImages.map((src, index) => {
                const isHovered = hoveredIndex === index;
                // Default width is uniform. Hovered width expands significantly.
                // We use flex-grow via Framer Motion's animate prop.
                return (
                    <motion.div
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onImageClick(index)}
                        animate={{
                            flex: isHovered ? 5 : 1, // Expand hovered item 5 times wider
                        }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="relative h-full overflow-hidden rounded-2xl cursor-pointer group flex-shrink-0 min-w-[40px] md:min-w-[60px]"
                    >
                        <Image
                            src={src}
                            alt={`Gallery Image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark Overlay that disappears on hover for a spotlight effect */}
                        <div
                            className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                        />

                        {/* Expand Icon visible only when hovered to indicate clickability */}
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
        </div>
    );
}
