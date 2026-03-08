"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─── Data ─── */
const departments = [
    {
        name: "성장클리닉",
        color: "#EF4444",
        size: 120,
        details: ["성조숙증", "저신장(성장호르몬)", "소아비만"],
    },
    {
        name: "아동발달센터",
        color: "#F97316",
        size: 120,
        details: [
            "언어검사, 감각통합검사, 베일리검사",
            "언어치료, 감각통합치료",
        ],
    },
    {
        name: "알레르기",
        color: "#EAB308",
        size: 120,
        details: ["알레르기성 비염", "천식", "아토피"],
    },
    {
        name: "감염",
        color: "#22C55E",
        size: 120,
        details: ["발열", "호흡기 질환", "요로 감염"],
    },
    {
        name: "예방접종",
        color: "#3B82F6",
        size: 120,
        details: ["국가 필수 예방접종", "성인 유료 접종"],
    },
    {
        name: "영유아검진",
        color: "#6366F1",
        size: 120,
        details: ["언어", "운동", "인지", "사회성", "자조"],
    },
    {
        name: "일반진료",
        color: "#8B5CF6",
        size: 120,
        details: ["장염", "변비", "성인비만"],
    },
    {
        name: "수액요법",
        color: "#EC4899",
        size: 120,
        details: ["독감치료수액", "장염수액", "영양수액"],
    },
];

/* Bubble positions – perfect circle (r=40%, centered at 50,50) */
const bubblePositions = [
    { x: 50, y: 5 },         // Top
    { x: 78.28, y: 21.72 },  // Top Right
    { x: 90, y: 50 },        // Right
    { x: 78.28, y: 78.28 },  // Bottom Right
    { x: 50, y: 90 },        // Bottom
    { x: 21.72, y: 78.28 },  // Bottom Left
    { x: 10, y: 50 },        // Left
    { x: 21.72, y: 21.72 },  // Top Left
];

/* Fly-in starting positions (from outside the viewport) */
const flyFromPositions = [
    { x: 0, y: -400 },
    { x: 400, y: -400 },
    { x: 400, y: 0 },
    { x: 400, y: 400 },
    { x: 0, y: 400 },
    { x: -400, y: 400 },
    { x: -400, y: 0 },
    { x: -400, y: -400 },
];

/* ─── Animation Variants ─── */
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

/* ─── Typewriter Component ─── */
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
    const [displayed, setDisplayed] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setStarted(false);
        const startTimer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimer);
    }, [text, delay]);

    useEffect(() => {
        if (!started) return;
        if (displayed.length >= text.length) return;
        const timer = setTimeout(() => {
            setDisplayed(text.slice(0, displayed.length + 1));
        }, 42); // 30ms / 0.7 = ~42ms (slower)
        return () => clearTimeout(timer);
    }, [displayed, text, started]);

    return (
        <span>
            {displayed}
            {displayed.length < text.length && started && (
                <motion.span
                    className="inline-block w-[2px] h-[1em] bg-current ml-[1px] align-text-bottom"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                />
            )}
        </span>
    );
}

/* ─── Post-it Note ─── */
function PostItNote({
    dept,
    isVisible,
}: {
    dept: (typeof departments)[0];
    isVisible: boolean;
}) {
    const rotation = useRef((Math.random() - 0.5) * 6);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, scale: 0.85, y: 20, rotate: rotation.current - 3 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: rotation.current }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-[320px] h-[320px]"
                    style={{
                        background: `linear-gradient(135deg, ${dept.color}18 0%, ${dept.color}30 100%)`,
                        borderLeft: `5px solid ${dept.color}`,
                        borderRadius: "4px 16px 16px 4px",
                        boxShadow: `4px 4px 20px ${dept.color}20, 0 2px 8px rgba(0,0,0,0.06)`,
                    }}
                >
                    {/* Tape */}
                    <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm opacity-50"
                        style={{
                            background: `linear-gradient(180deg, ${dept.color}40 0%, ${dept.color}20 100%)`,
                            transform: `translateX(-50%) rotate(${(Math.random() - 0.5) * 4}deg)`,
                        }}
                    />

                    <div className="p-7 pt-9 h-full flex flex-col">
                        {/* Title */}
                        <h3
                            className="text-2xl font-black mb-5"
                            style={{ color: dept.color }}
                        >
                            {dept.name}
                        </h3>

                        {/* Details with typewriter */}
                        <ul className="space-y-3 flex-1">
                            {dept.details.map((detail, idx) => (
                                <li
                                    key={idx}
                                    className="text-gray-700 font-bold text-base leading-relaxed flex items-start gap-2"
                                >
                                    <span
                                        className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ background: dept.color }}
                                    />
                                    <Typewriter text={detail} delay={200 + idx * 400} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─── Bouncing Bubble ─── */
function Bubble({
    dept,
    index,
    hovered,
    onHover,
    onLeave,
}: {
    dept: (typeof departments)[0];
    index: number;
    hovered: number | null;
    onHover: () => void;
    onLeave: () => void;
}) {
    const isHovered = hovered === index;
    const isOtherHovered = hovered !== null && !isHovered;

    /* Random bounce parameters per bubble */
    const bounceY = useRef(4 + Math.random() * 6);
    const bounceDur = useRef(2.2 + Math.random() * 1.5);
    const bounceDelay = useRef(Math.random() * 2);

    return (
        <motion.div
            className="absolute flex items-center justify-center cursor-pointer select-none"
            style={{
                width: 120,
                height: 120,
                left: `calc(${bubblePositions[index].x}% - 60px)`,
                top: `calc(${bubblePositions[index].y}% - 60px)`,
                zIndex: isHovered ? 20 : 10,
            }}
            /* Fly-in from outside */
            initial={{
                x: flyFromPositions[index].x,
                y: flyFromPositions[index].y,
                opacity: 0,
                scale: 0.4,
            }}
            /* Idle bounce */
            animate={{
                x: 0,
                y: isHovered
                    ? 0
                    : [0, -bounceY.current, 0, -bounceY.current * 0.5, 0],
                scale: isHovered ? 1.35 : isOtherHovered ? 0.7 : 1,
                filter: isOtherHovered ? "blur(3px)" : "blur(0px)",
                opacity: isOtherHovered ? 0.45 : 1,
            }}
            transition={
                isHovered || isOtherHovered
                    ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                    : {
                        x: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 * index },
                        y: {
                            duration: bounceDur.current,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.15 * index + 1.2,
                        },
                        scale: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 * index },
                        opacity: { duration: 0.6, delay: 0.15 * index },
                        default: { duration: 0.4 },
                    }
            }
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            whileTap={{ scale: 1.45 }}
        >
            {/* Glow ring */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${dept.color}30 0%, transparent 70%)`,
                }}
                animate={{ scale: isHovered ? 1.5 : 1, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Main circle */}
            <div
                className="relative flex items-center justify-center rounded-full shadow-lg transition-shadow"
                style={{
                    width: 120,
                    height: 120,
                    background: `linear-gradient(135deg, ${dept.color} 0%, ${dept.color}CC 100%)`,
                    boxShadow: isHovered
                        ? `0 8px 32px ${dept.color}50`
                        : `0 4px 14px ${dept.color}30`,
                }}
            >
                <span className="text-white font-black text-[18px] lg:text-base text-center leading-tight px-2 drop-shadow-md">
                    {dept.name}
                </span>
            </div>
        </motion.div>
    );
}

/* ─── Growth Stage SVG Line-Art ─── */
const growthStages = [
    {
        label: "Neonate",
        svg: (
            <svg viewBox="0 0 200 220" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                {/* Cute swaddled baby */}
                {/* Head - round baby head */}
                <circle cx="100" cy="60" r="26" />
                {/* Eyes */}
                <circle cx="90" cy="56" r="2" fill="#1a1a1a" />
                <circle cx="110" cy="56" r="2" fill="#1a1a1a" />
                {/* Cute blush cheeks */}
                <circle cx="82" cy="64" r="4" fill="#f87171" opacity="0.3" stroke="none" />
                <circle cx="118" cy="64" r="4" fill="#f87171" opacity="0.3" stroke="none" />
                {/* Tiny smile */}
                <path d="M95 67 Q100 72 105 67" />
                {/* Baby hair tuft */}
                <path d="M92 36 Q95 26 100 28 Q105 26 108 36" />
                <path d="M88 40 Q85 30 90 28" />
                {/* Swaddle body - rounded wrap */}
                <ellipse cx="100" cy="130" rx="32" ry="52" />
                {/* Swaddle wrap lines */}
                <path d="M70 110 Q100 125 130 110" />
                <path d="M72 135 Q100 150 128 135" />
                {/* Tiny hand poking out */}
                <circle cx="132" cy="115" r="5" />
                {/* Finger lines */}
                <path d="M135 112 L138 110" />
                <path d="M136 114 L140 113" />
                {/* Bottle */}
                <rect x="145" y="80" width="10" height="30" rx="4" />
                <path d="M147 80 L150 68 L153 80" />
                <rect x="148" y="66" width="6" height="4" rx="1" />
                <line x1="140" y1="95" x2="145" y2="95" />
            </svg>
        ),
    },
    {
        label: "Infant",
        svg: (
            <svg viewBox="0 0 200 220" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                {/* Chubby baby standing with arms out */}
                {/* Head */}
                <circle cx="100" cy="40" r="24" />
                {/* Eyes */}
                <circle cx="92" cy="36" r="2" fill="#1a1a1a" />
                <circle cx="108" cy="36" r="2" fill="#1a1a1a" />
                {/* Smile */}
                <path d="M94 46 Q100 52 106 46" />
                {/* Hair */}
                <path d="M78 32 Q82 16 100 12 Q118 16 122 32" />
                {/* Cute tuft */}
                <path d="M97 16 Q100 8 103 16" />
                {/* Body - chubby torso */}
                <ellipse cx="100" cy="98" rx="20" ry="28" />
                {/* Diaper bump */}
                <ellipse cx="100" cy="125" rx="18" ry="10" />
                <path d="M84 120 Q100 115 116 120" />
                {/* Arms stretched out for balance */}
                <path d="M80 82 Q60 72 50 80 L48 86" />
                <circle cx="46" cy="88" r="4" />
                <path d="M120 82 Q140 72 150 80 L152 86" />
                <circle cx="154" cy="88" r="4" />
                {/* Chubby legs - wide stance */}
                <path d="M88 125 Q82 150 78 170" />
                <path d="M82 125 Q76 150 72 170" />
                <path d="M112 125 Q118 150 122 170" />
                <path d="M118 125 Q124 150 128 170" />
                {/* Little shoes */}
                <ellipse cx="75" cy="174" rx="10" ry="5" />
                <ellipse cx="125" cy="174" rx="10" ry="5" />
            </svg>
        ),
    },
    {
        label: "Toddler",
        svg: (
            <svg viewBox="0 0 220 220" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                {/* Toddler on tricycle */}
                {/* Head */}
                <circle cx="105" cy="32" r="18" />
                {/* Eyes */}
                <circle cx="99" cy="29" r="1.5" fill="#1a1a1a" />
                <circle cx="111" cy="29" r="1.5" fill="#1a1a1a" />
                {/* Smile */}
                <path d="M102 36 Q105 39 108 36" />
                {/* Hair / Helmet */}
                <path d="M87 26 Q92 10 105 8 Q118 10 123 26" />
                <line x1="87" y1="26" x2="123" y2="26" />
                {/* Body sitting */}
                <line x1="105" y1="50" x2="105" y2="105" />
                {/* Shoulders */}
                <path d="M90 60 L105 55 L120 60" />
                {/* Arms to handlebars */}
                <path d="M90 65 L65 88" />
                <path d="M120 65 L145 88" />
                <circle cx="63" cy="90" r="3" />
                <circle cx="147" cy="90" r="3" />
                {/* Legs to pedals */}
                <path d="M100 105 L78 140" />
                <path d="M110 105 L128 135" />
                {/* Tricycle - front wheel */}
                <circle cx="65" cy="165" r="22" />
                <circle cx="65" cy="165" r="3" fill="#1a1a1a" />
                {/* Spokes */}
                <line x1="65" y1="143" x2="65" y2="187" />
                <line x1="43" y1="165" x2="87" y2="165" />
                {/* Front fork */}
                <line x1="65" y1="143" x2="65" y2="92" />
                {/* Handlebar */}
                <line x1="55" y1="90" x2="75" y2="90" />
                <circle cx="55" cy="90" r="2" fill="#1a1a1a" />
                <circle cx="75" cy="90" r="2" fill="#1a1a1a" />
                {/* Seat */}
                <path d="M95 105 Q107 100 119 105" strokeWidth="3" />
                {/* Frame connecting seat to front */}
                <line x1="107" y1="108" x2="65" y2="143" />
                {/* Rear axle */}
                <line x1="107" y1="108" x2="107" y2="170" />
                {/* Back wheels */}
                <circle cx="90" cy="170" r="16" />
                <circle cx="90" cy="170" r="2" fill="#1a1a1a" />
                <circle cx="130" cy="170" r="16" />
                <circle cx="130" cy="170" r="2" fill="#1a1a1a" />
                {/* Rear axle connecting wheels */}
                <line x1="90" y1="170" x2="130" y2="170" />
                {/* Pedals */}
                <circle cx="78" cy="143" r="3" />
                <line x1="65" y1="143" x2="78" y2="143" />
            </svg>
        ),
    },
    {
        label: "Child",
        svg: (
            <svg viewBox="0 0 220 220" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                {/* Child kicking soccer ball */}
                {/* Head */}
                <circle cx="85" cy="30" r="17" />
                {/* Eyes */}
                <circle cx="80" cy="27" r="1.5" fill="#1a1a1a" />
                <circle cx="90" cy="27" r="1.5" fill="#1a1a1a" />
                {/* Smile */}
                <path d="M82 34 Q85 38 88 34" />
                {/* Hair */}
                <path d="M69 24 Q74 10 85 8 Q96 10 101 24" />
                <path d="M72 20 Q70 14 75 12" />
                {/* Body */}
                <line x1="85" y1="47" x2="85" y2="110" />
                {/* Shoulders */}
                <path d="M70 58 L85 52 L100 58" />
                {/* Arms - dynamic pose */}
                <path d="M70 62 Q55 55 50 65" />
                <circle cx="48" cy="67" r="3" />
                <path d="M100 62 Q115 55 118 48" />
                <circle cx="120" cy="46" r="3" />
                {/* Standing leg */}
                <path d="M85 110 L78 155" />
                <ellipse cx="76" cy="160" rx="10" ry="5" />
                {/* Kicking leg - extended */}
                <path d="M85 110 L110 128 L138 135" />
                <ellipse cx="142" cy="134" rx="8" ry="4" transform="rotate(-10 142 134)" />
                {/* Soccer ball - KEEP FILLED with classic pattern */}
                <circle cx="165" cy="125" r="18" fill="white" stroke="#1a1a1a" strokeWidth="2.5" />
                <path d="M165 110 L158 117 L160 126 L170 126 L172 117 Z" fill="#1a1a1a" stroke="none" />
                <path d="M150 122 L153 115 L158 117 L160 126 L154 128 Z" fill="#1a1a1a" stroke="none" />
                <path d="M180 122 L177 115 L172 117 L170 126 L176 128 Z" fill="#1a1a1a" stroke="none" />
                <path d="M155 135 L160 126 L170 126 L175 135 L165 140 Z" fill="#1a1a1a" stroke="none" />
                {/* Motion lines */}
                <line x1="178" y1="115" x2="192" y2="110" strokeDasharray="4 3" />
                <line x1="180" y1="125" x2="195" y2="123" strokeDasharray="4 3" />
                <line x1="178" y1="135" x2="192" y2="139" strokeDasharray="4 3" />
            </svg>
        ),
    },
    {
        label: "Adolescent",
        svg: (
            <svg viewBox="0 0 200 220" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                {/* Student in uniform - line art */}
                {/* Head */}
                <circle cx="100" cy="28" r="17" />
                {/* Eyes */}
                <circle cx="95" cy="25" r="1.5" fill="#1a1a1a" />
                <circle cx="105" cy="25" r="1.5" fill="#1a1a1a" />
                {/* Smile */}
                <path d="M97 32 Q100 35 103 32" />
                {/* Hair - neat */}
                <path d="M83 22 Q87 8 100 5 Q113 8 117 22" />
                <path d="M83 22 L81 27" />
                {/* Neck */}
                <line x1="100" y1="45" x2="100" y2="54" />
                {/* Uniform collar / V-neck */}
                <path d="M88 54 L100 68 L112 54" />
                {/* Tie */}
                <line x1="100" y1="68" x2="100" y2="95" />
                <path d="M97 68 L100 62 L103 68" />
                {/* Uniform body - blazer */}
                <path d="M82 54 L80 138 L120 138 L118 54" />
                {/* Button dots */}
                <circle cx="100" cy="82" r="1.5" fill="#1a1a1a" />
                <circle cx="100" cy="98" r="1.5" fill="#1a1a1a" />
                <circle cx="100" cy="114" r="1.5" fill="#1a1a1a" />
                {/* Arms */}
                <path d="M82 62 Q65 78 60 100" />
                <circle cx="58" cy="103" r="3" />
                <path d="M118 62 Q135 78 140 100" />
                <circle cx="142" cy="103" r="3" />
                {/* Book in right hand */}
                <rect x="135" y="93" width="14" height="18" rx="2" />
                <line x1="142" y1="93" x2="142" y2="111" />
                {/* Legs */}
                <line x1="90" y1="138" x2="86" y2="185" />
                <line x1="110" y1="138" x2="114" y2="185" />
                {/* Shoes */}
                <ellipse cx="84" cy="189" rx="10" ry="4" />
                <ellipse cx="116" cy="189" rx="10" ry="4" />
            </svg>
        ),
    },
    {
        label: "Family",
        svg: (
            <svg viewBox="0 0 260 220" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                {/* Dad (left, taller) */}
                <circle cx="65" cy="30" r="16" />
                <circle cx="60" cy="27" r="1.5" fill="#1a1a1a" />
                <circle cx="70" cy="27" r="1.5" fill="#1a1a1a" />
                <path d="M63 34 Q65 36 67 34" />
                <path d="M50 23 Q55 10 65 8 Q75 10 80 23" />
                <line x1="65" y1="46" x2="65" y2="130" />
                {/* Dad's outer arm */}
                <path d="M65 70 L40 95" />
                <circle cx="38" cy="97" r="3" />
                {/* Dad's inner arm → reaching to child's hand */}
                <path d="M65 75 L100 105" />
                {/* Dad legs */}
                <line x1="58" y1="130" x2="53" y2="185" />
                <line x1="72" y1="130" x2="77" y2="185" />
                <path d="M48 185 L58 185" />
                <path d="M72 185 L82 185" />

                {/* Child (center, small) */}
                <circle cx="130" cy="75" r="12" />
                <circle cx="126" cy="73" r="1.5" fill="#1a1a1a" />
                <circle cx="134" cy="73" r="1.5" fill="#1a1a1a" />
                <path d="M128 79 Q130 81 132 79" />
                <path d="M120 68 Q122 60 130 58 Q138 60 140 68" />
                <line x1="130" y1="87" x2="130" y2="145" />
                {/* Child arms → holding parents' hands */}
                <path d="M130 100 L100 107" />
                <path d="M130 100 L160 107" />
                {/* Child legs */}
                <line x1="125" y1="145" x2="120" y2="185" />
                <line x1="135" y1="145" x2="140" y2="185" />
                <path d="M115 185 L125 185" />
                <path d="M135 185 L145 185" />

                {/* Mom (right, slightly shorter) */}
                <circle cx="195" cy="35" r="15" />
                <circle cx="190" cy="32" r="1.5" fill="#1a1a1a" />
                <circle cx="200" cy="32" r="1.5" fill="#1a1a1a" />
                <path d="M193 38 Q195 40 197 38" />
                {/* Mom hair - longer */}
                <path d="M180 30 Q182 15 195 12 Q208 15 210 30" />
                <path d="M180 30 L178 50" />
                <path d="M210 30 L212 50" />
                <line x1="195" y1="50" x2="195" y2="135" />
                {/* Mom's inner arm → child's hand */}
                <path d="M195 75 L160 105" />
                {/* Mom's outer arm */}
                <path d="M195 75 L220 95" />
                <circle cx="222" cy="97" r="3" />
                {/* Mom dress/skirt */}
                <path d="M185 110 L180 185" />
                <path d="M205 110 L210 185" />
                <path d="M185 110 Q195 115 205 110" />
                {/* Mom feet */}
                <path d="M175 185 L185 185" />
                <path d="M205 185 L215 185" />

                {/* Connection circles (hands) */}
                <circle cx="100" cy="107" r="3" fill="#1a1a1a" opacity="0.3" />
                <circle cx="160" cy="107" r="3" fill="#1a1a1a" opacity="0.3" />

                {/* Hearts above */}
                <path d="M125 48 Q125 43 128 43 Q130 43 130 47 Q130 43 132 43 Q135 43 135 48 Q135 53 130 56 Q125 53 125 48" fill="#EF4444" stroke="none" opacity="0.5" />
            </svg>
        ),
    },
];

/* ─── Growth Stage Animation Component ─── */
function GrowthStageAnimation() {
    const [currentStage, setCurrentStage] = useState(0);
    const [showTagline, setShowTagline] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const isLastStage = currentStage === growthStages.length - 1;

        if (isLastStage) {
            // Show tagline after a short delay
            const taglineTimer = setTimeout(() => setShowTagline(true), 600);
            // After 5 seconds on Family, loop back to start
            timerRef.current = setTimeout(() => {
                setShowTagline(false);
                setCurrentStage(0);
            }, 5000);
            return () => {
                clearTimeout(taglineTimer);
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }

        // Normal stages: advance after 2.5s
        timerRef.current = setTimeout(() => {
            setCurrentStage((prev) => prev + 1);
        }, 2500);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentStage]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[544px] ml-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-col items-center"
                >
                    {/* Stage label — 2x bigger (text-sm -> text-2xl) */}
                    <motion.p
                        className="text-2xl font-bold tracking-widest text-gray-400 uppercase mb-6"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        {growthStages[currentStage].label}
                    </motion.p>

                    {/* SVG illustration — 1.7x bigger */}
                    <div className="w-[272px] h-[300px]">
                        {growthStages[currentStage].svg}
                    </div>

                    {/* "우리 가족 주치의" tagline — only on Family — 2x bigger (text-2xl -> text-5xl) */}
                    {showTagline && currentStage === growthStages.length - 1 && (
                        <motion.p
                            className="-mt-6 text-4xl font-normal text-gray-800 tracking-tight whitespace-nowrap font-nanum-pen"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            우리 가족 주치의
                        </motion.p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ─── Schedule Display Component ─── */
interface ScheduleData {
    year: number;
    month: number;
    days: { date: number; dayOfWeek: number; am: string; pm: string; isHoliday: boolean; holidayName?: string; isClosed?: boolean }[];
    doctors: { abbr: string; name: string; color: string }[];
    footerLines: { text: string; color: string; size: number; bold: boolean }[];
    businessHours?: { amStart: string; amEnd: string; pmStart: string; pmEnd: string };
}

function ScheduleDisplay({ initialSchedules = [] }: { initialSchedules: ScheduleData[] }) {
    const [schedules, setSchedules] = useState<ScheduleData[]>(initialSchedules);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (initialSchedules.length > 0) {
            setSchedules(initialSchedules);

            // Find current month index
            const now = new Date();
            const cy = now.getFullYear();
            const cm = now.getMonth() + 1;
            const idx = initialSchedules.findIndex((s: any) => s.year === cy && s.month === cm);
            setCurrentIndex(idx >= 0 ? idx : 0);
        }
    }, [initialSchedules]);

    if (schedules.length === 0) {
        return (
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full max-w-4xl mx-auto min-h-[400px] rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-white/50"
            >
                <div className="text-center text-gray-400">
                    <div className="text-5xl mb-4">🕐</div>
                    <p className="text-lg font-semibold">진료 시간표가 곧 업데이트 됩니다</p>
                    <p className="text-sm mt-2">관리자 페이지에서 시간표를 설정해주세요</p>
                </div>
            </motion.div>
        );
    }

    const currentSchedule = schedules[currentIndex];
    const { year, month, days, doctors, footerLines, businessHours } = currentSchedule;
    const DAY_NAMES = ["월", "화", "수", "목", "금", "토"];

    // Group by weeks (Mon-Sat, skip Sun)
    function getFirstDow(y: number, m: number) {
        const d = new Date(y, m - 1, 1).getDay();
        return d === 0 ? 0 : d - 1; // If Sunday(0), no empty Mon-Sat cells needed. Else Mon=0...Sat=5.
    }
    const firstDow = getFirstDow(year, month);
    const weeks: typeof days[] = [];
    let week: typeof days = [];
    for (let i = 0; i < firstDow; i++) {
        week.push({ date: 0, dayOfWeek: i, am: "", pm: "", isHoliday: false });
    }
    for (const day of days) {
        if (day.dayOfWeek === 6) continue;
        week.push(day);
        if (day.dayOfWeek === 5) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length > 0) {
        while (week.length < 6) week.push({ date: 0, dayOfWeek: week.length, am: "", pm: "", isHoliday: false });
        weeks.push(week);
    }

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -50 : 50,
            opacity: 0
        })
    };

    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-deep-blue to-blue-500 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => { setDirection(-1); setCurrentIndex(prev => prev + 1); }}
                        disabled={currentIndex >= schedules.length - 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.h3
                            key={`${year}-${month}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="text-2xl font-black text-white text-center w-full"
                        >
                            {year}년 {month}월
                        </motion.h3>
                    </AnimatePresence>

                    <button
                        onClick={() => { setDirection(1); setCurrentIndex(prev => prev - 1); }}
                        disabled={currentIndex <= 0}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`${year}-${month}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {/* Calendar Grid */}


                            {/* Calendar Grid */}
                            <div className="p-4 md:p-6 overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="w-16 py-2 text-xs font-bold text-gray-400"></th>
                                            {DAY_NAMES.map((d, i) => (
                                                <th key={d} className={`py-2 text-sm font-bold ${i === 5 ? "text-blue-500" : "text-gray-700"}`}>
                                                    {d}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weeks.map((wk, wIdx) => (
                                            <motion.tr
                                                key={wIdx}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: wIdx * 0.05 }}
                                                viewport={{ once: true }}
                                                className="border-t border-gray-100"
                                                style={{ display: "table-row" }}
                                            >
                                                <td className="align-top py-2 px-1 relative w-12 border-r border-gray-50">
                                                    <div className="flex flex-col h-full justify-between items-center pb-1">
                                                        <div className="text-[10px] text-gray-400 font-bold mt-1 max-w-full text-center">{wIdx + 1}주</div>
                                                        <div className="flex flex-col gap-1 mt-auto w-full translate-y-[8px]">
                                                            <div className="text-[9px] text-blue-400 font-bold text-center leading-[22px]">오전</div>
                                                            <div className="text-[9px] text-orange-400 font-bold text-center leading-[22px]">오후</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {wk.map((day, dIdx) => (
                                                    <td key={dIdx} className={`align-top py-2 px-1 ${day.date === 0 ? "" : "border-l border-gray-50"}`}>
                                                        {day.date > 0 && (
                                                            <div className="flex flex-col h-full min-h-[64px]">
                                                                {/* Date number */}
                                                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                                                    <span className={`text-sm font-black ${day.isHoliday || day.isClosed ? "text-red-500" : day.dayOfWeek === 5 ? "text-blue-500" : "text-gray-800"
                                                                        }`}>
                                                                        {day.date}
                                                                    </span>
                                                                    {day.isHoliday && day.holidayName && (
                                                                        <span className="text-[9px] text-red-500 font-bold leading-tight">{day.holidayName}</span>
                                                                    )}
                                                                </div>

                                                                {day.isClosed ? (
                                                                    <div className="text-center text-xs text-red-300 font-bold mt-auto h-[48px] flex items-center justify-center">휴진</div>
                                                                ) : (
                                                                    <div className="flex flex-col gap-1 mt-auto">
                                                                        {/* AM */}
                                                                        {day.am === "휴진" ? (
                                                                            <div className="bg-red-50/60 rounded px-1 min-h-[22px] flex items-center justify-center text-center">
                                                                                <span className="text-[10px] text-red-500 font-bold block leading-tight">휴진</span>
                                                                            </div>
                                                                        ) : day.am ? (
                                                                            <div className="bg-blue-50/60 rounded px-1 min-h-[22px] flex items-center justify-center text-center">
                                                                                <div className="flex items-center justify-center gap-0 flex-wrap">
                                                                                    {day.am.split("/").map((a, ai) => {
                                                                                        const doc = doctors?.find((d) => d.abbr === a.trim());
                                                                                        return (
                                                                                            <span key={ai}>
                                                                                                {ai > 0 && <span className="text-gray-300 text-[10px]">/</span>}
                                                                                                <span className="text-xs font-black" style={{ color: doc?.color || "#333" }}>
                                                                                                    {a.trim()}
                                                                                                </span>
                                                                                            </span>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        ) : <div className="min-h-[22px]"></div>}
                                                                        {/* PM */}
                                                                        {day.pm === "휴진" ? (
                                                                            <div className="bg-red-50/60 rounded px-1 min-h-[22px] flex items-center justify-center text-center">
                                                                                <span className="text-[10px] text-red-500 font-bold block leading-tight">휴진</span>
                                                                            </div>
                                                                        ) : day.pm ? (
                                                                            <div className="bg-orange-50/60 rounded px-1 min-h-[22px] flex items-center justify-center text-center">
                                                                                <div className="flex items-center justify-center gap-0 flex-wrap">
                                                                                    {day.pm.split("/").map((a, ai) => {
                                                                                        const doc = doctors?.find((d) => d.abbr === a.trim());
                                                                                        return (
                                                                                            <span key={ai}>
                                                                                                {ai > 0 && <span className="text-gray-300 text-[10px]">/</span>}
                                                                                                <span className="text-xs font-black" style={{ color: doc?.color || "#333" }}>
                                                                                                    {a.trim()}
                                                                                                </span>
                                                                                            </span>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        ) : <div className="min-h-[22px]"></div>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Business Hours Settings */}
                            {businessHours && (
                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-6 border-b border-gray-100 bg-gray-50/30">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">오전 진료</span>
                                        <span className="text-base font-bold text-gray-800 tracking-wider">
                                            {businessHours.amStart} <span className="text-gray-400 font-normal">~</span> {businessHours.amEnd}
                                        </span>
                                    </div>
                                    <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">오후 진료</span>
                                        <span className="text-base font-bold text-gray-800 tracking-wider">
                                            {businessHours.pmStart} <span className="text-gray-400 font-normal">~</span> {businessHours.pmEnd}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Doctor Legend */}
                            {doctors && doctors.length > 0 && (
                                <div className="px-6 pb-4 pt-6">
                                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 justify-center">
                                        {doctors.map((doc, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                <span className="text-sm font-black" style={{ color: doc.color }}>
                                                    {doc.abbr}
                                                </span>
                                                <span className="text-xs text-gray-500">: {doc.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Messages */}
                            {footerLines && footerLines.length > 0 && (
                                <div className="px-6 pb-6 pt-4 space-y-0.5 text-center bg-gray-50/30 border-t border-gray-100">
                                    {footerLines.map((line, idx) => (
                                        <p
                                            key={idx}
                                            style={{
                                                color: line.color,
                                                fontSize: `${line.size}px`,
                                                fontWeight: line.bold ? 700 : 400,
                                            }}
                                        >
                                            {line.text}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function ClinicContent({ initialSchedules = [] }: { initialSchedules: any[] }) {
    const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-white font-pretendard">
            {/* ═══════ Section 1: 진료과목 ═══════ */}
            <section
                id="departments"
                className="relative pt-24 pb-10 lg:pt-36 lg:pb-28 overflow-hidden"
            >
                {/* Soft BG */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Section heading */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-6 lg:mb-16"
                    >
                        <span className="inline-block text-xs lg:text-sm font-bold tracking-widest text-deep-blue uppercase mb-1 lg:mb-3">
                            Departments
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-black text-gray-900">
                            진료과목
                        </h2>
                        {/* 완전히 숨김 (모바일) */}
                        <p className="hidden lg:block mt-4 text-gray-500 max-w-lg mx-auto">
                            버튼을 터치해 각 진료과목의 상세 내용을 확인해 보세요
                        </p>
                    </motion.div>

                    {/* Bubble playground + Post-it */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-0 lg:gap-4 mt-0 border border-transparent">
                        {/* Left: Bubbles - 모바일에서 왼쪽 위로 붙이고 스케일 75% 고정, 하단 여백 제거로 겹침 유도 */}
                        <motion.div
                            className="relative w-full lg:w-[45%] max-w-[500px] aspect-square lg:mx-0 lg:ml-8 mt-4 lg:mt-12 scale-[0.75] lg:scale-100 origin-top-left -ml-4 sm:ml-0 -mb-[140px] lg:mb-0"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {/* Background String (Circle) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="40%"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="3"
                                />
                            </svg>

                            {/* Central Logo */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-56 h-40 pointer-events-none"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    backgroundColor: hoveredBubble !== null ? '#2DD4BF' : 'rgba(0,0,0,0.5)' // Mint on hover, Black 50% idle
                                }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    maskImage: `url('/images/cloud_logo_clean.png')`,
                                    maskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    WebkitMaskImage: `url('/images/cloud_logo_clean.png')`,
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                }}
                            />

                            {departments.map((dept, i) => (
                                <Bubble
                                    key={dept.name}
                                    dept={dept}
                                    index={i}
                                    hovered={hoveredBubble}
                                    onHover={() => setHoveredBubble(i)}
                                    onLeave={() => setHoveredBubble(null)}
                                />
                            ))}
                        </motion.div>

                        {/* Right: Growth animation (idle) or Post-it detail (hovered) - 우측 하단 배치 */}
                        <div className="w-full lg:w-1/2 flex items-start justify-end lg:justify-center pr-2 sm:pr-6 lg:pr-0 pt-0 lg:pt-20 min-h-[350px] lg:min-h-[400px] scale-[0.73] lg:scale-100 origin-top-right lg:origin-center translate-y-6 lg:translate-y-0">
                            <AnimatePresence mode="wait">
                                {hoveredBubble !== null ? (
                                    <motion.div
                                        key="postit"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <PostItNote
                                            dept={departments[hoveredBubble]}
                                            isVisible={true}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="growth"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <GrowthStageAnimation />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ Section 2: 진료 시간표 ═══════ */}
            <section
                id="schedule"
                className="relative py-20 md:py-28 bg-gradient-to-b from-white via-sky-blue/20 to-white"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block text-sm font-bold tracking-widest text-deep-blue uppercase mb-3">
                            Schedule
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                            진료 시간표
                        </h2>
                    </motion.div>

                    <ScheduleDisplay initialSchedules={initialSchedules} />
                </div>
            </section>

            {/* ═══════ Section 3: 진료 예약 ═══════ */}
            <section
                id="reservation"
                className="relative py-20 md:py-28 bg-gradient-to-b from-white to-slate-50"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-4"
                    >
                        <span className="inline-block text-sm font-bold tracking-widest text-deep-blue uppercase mb-3">
                            Reservation
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                            진료 예약
                        </h2>
                    </motion.div>

                    {/* Notice */}
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center text-sm text-gray-400 mb-14"
                    >
                        똑닥어플 예약, 현장 접수만 시행하고 있습니다 (전화 접수
                        불가)
                    </motion.p>

                    {/* Cards */}
                    <motion.div
                        className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Card 1: 똑닥 */}
                        <motion.div
                            variants={fadeInUp}
                            className="relative group rounded-3xl bg-white border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="text-center flex flex-col h-full">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
                                        성장클리닉 · 아동발달센터 <br />
                                        일반진료
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-8">
                                        똑닥으로 간편하게 예약하세요
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href="https://short.ddocdoc.com/m8eeg5"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-3 w-full max-w-[260px] h-[72px] rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] text-[#391B1B] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 mx-auto"
                                    >
                                        <Image
                                            src="/images/ddocdoc.jpg"
                                            alt="똑닥 로고"
                                            width={36}
                                            height={36}
                                            className="rounded-xl object-contain drop-shadow-sm"
                                        />
                                        <span className="text-xl font-black pt-1">똑닥 예약</span>
                                    </Link>

                                    <p className="mt-4 text-xs text-gray-400">
                                        버튼을 클릭하면 똑닥 앱으로 이동합니다
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: 카카오 */}
                        <motion.div
                            variants={fadeInUp}
                            className="relative group rounded-3xl bg-white border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="text-center flex flex-col h-full">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
                                        아동발달클리닉
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-7 mb-8">
                                        카카오톡 채널로 상담 · 예약하세요
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href="http://pf.kakao.com/_xczQUG"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-3 w-full max-w-[260px] h-[72px] rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] text-[#391B1B] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 mx-auto"
                                    >
                                        {/* Kakao talk icon */}
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-8 h-8 flex-shrink-0"
                                            fill="#391B1B"
                                        >
                                            <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.96 3.6-.99 3.83 0 0-.02.17.09.24.1.06.23.02.23.02.3-.04 3.54-2.32 4.1-2.72.6.08 1.24.13 1.91.13 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
                                        </svg>
                                        <div className="text-left flex flex-col justify-center">
                                            <div className="text-[11px] font-medium opacity-70 leading-tight">카카오톡 채널</div>
                                            <div className="text-[13px] font-black leading-tight pt-0.5">아동발달클리닉 상담</div>
                                        </div>
                                    </Link>

                                    <p className="mt-4 text-xs text-gray-400">
                                        버튼을 클릭하면 카카오톡 채널로 이동합니다
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
