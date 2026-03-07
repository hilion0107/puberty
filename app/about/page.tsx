"use client";

import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { GraduationCap, Award, Stethoscope, BookOpen, ChevronLeft, ChevronRight, X, Star } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import HoverAccordionGallery from "@/components/HoverAccordionGallery";

/* ─── Animation Variants ─── */
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } },
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as any } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};

/* ─── Schematic Illustration: Child with Teddy Bear & Stethoscope ─── */
function TeddyBearIllustration() {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.12, duration: 0.7, ease: "easeInOut" as const },
                opacity: { delay: i * 0.12, duration: 0.2 },
            },
        }),
    };

    return (
        <motion.svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Teddy Bear Body */}
            <motion.circle cx="130" cy="130" r="28" stroke="#D4A574" strokeWidth="3" variants={draw} custom={0} />
            {/* Head */}
            <motion.circle cx="130" cy="95" r="22" stroke="#D4A574" strokeWidth="3" variants={draw} custom={1} />
            {/* Ears */}
            <motion.circle cx="112" cy="80" r="9" stroke="#D4A574" strokeWidth="2.5" variants={draw} custom={2} />
            <motion.circle cx="148" cy="80" r="9" stroke="#D4A574" strokeWidth="2.5" variants={draw} custom={2} />
            {/* Eyes */}
            <motion.circle cx="122" cy="92" r="2.5" stroke="#D4A574" strokeWidth="2" variants={draw} custom={3} />
            <motion.circle cx="138" cy="92" r="2.5" stroke="#D4A574" strokeWidth="2" variants={draw} custom={3} />
            {/* Nose */}
            <motion.circle cx="130" cy="99" r="3" stroke="#D4A574" strokeWidth="2" variants={draw} custom={3} />
            {/* Arms */}
            <motion.line x1="105" y1="125" x2="90" y2="115" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" variants={draw} custom={4} />
            <motion.line x1="155" y1="125" x2="170" y2="140" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" variants={draw} custom={4} />
            {/* Legs */}
            <motion.line x1="118" y1="155" x2="112" y2="172" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" variants={draw} custom={5} />
            <motion.line x1="142" y1="155" x2="148" y2="172" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" variants={draw} custom={5} />

            {/* Child - Head */}
            <motion.circle cx="60" cy="55" r="18" stroke="#3B82F6" strokeWidth="3" variants={draw} custom={2} />
            {/* Hair */}
            <motion.path d="M45 48 Q50 35 60 33 Q70 35 75 48" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none" variants={draw} custom={3} />
            {/* Eyes */}
            <motion.circle cx="53" cy="53" r="2" stroke="#3B82F6" strokeWidth="2" variants={draw} custom={4} />
            <motion.circle cx="67" cy="53" r="2" stroke="#3B82F6" strokeWidth="2" variants={draw} custom={4} />
            {/* Smile */}
            <motion.path d="M55 60 Q60 65 65 60" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" variants={draw} custom={4} />
            {/* Body */}
            <motion.line x1="60" y1="73" x2="60" y2="120" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={5} />
            {/* Arms */}
            <motion.line x1="60" y1="85" x2="42" y2="100" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={5} />
            <motion.line x1="60" y1="85" x2="90" y2="105" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={6} />
            {/* Legs */}
            <motion.line x1="60" y1="120" x2="48" y2="148" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={7} />
            <motion.line x1="60" y1="120" x2="72" y2="148" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={7} />

            {/* Stethoscope */}
            <motion.path d="M85 105 Q95 95 105 100 Q108 108 105 115" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" fill="none" variants={draw} custom={8} />
            <motion.circle cx="105" cy="118" r="4" stroke="#F87171" strokeWidth="2.5" variants={draw} custom={9} />

            {/* Heart above */}
            <motion.path d="M90 40 C90 36 85 32 82 36 C79 32 74 36 74 40 C74 46 82 50 82 50 C82 50 90 46 90 40Z" stroke="#F87171" strokeWidth="2" fill="none" variants={draw} custom={10} />
        </motion.svg>
    );
}

/* ─── Schematic Illustration: Heart & Stethoscope ─── */
function HeartStethoscopeIllustration() {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.12, duration: 0.7, ease: "easeInOut" as const },
                opacity: { delay: i * 0.12, duration: 0.2 },
            },
        }),
    };

    return (
        <motion.svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <g transform="translate(30, 30) scale(0.7)">
                {/* Heart */}
                <motion.path
                    d="M100 145 C 100 145, 50 100, 50 65 C 50 40, 75 30, 90 50 C 100 65, 100 65, 100 65 C 100 65, 100 65, 110 50 C 125 30, 150 40, 150 65 C 150 100, 100 145, 100 145 Z"
                    stroke="#F43F5E"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={draw}
                    custom={0}
                />

                {/* Stethoscope Earpieces */}
                <motion.circle cx="65" cy="20" r="4" fill="#0EA5E9" variants={draw} custom={1} />
                <motion.circle cx="135" cy="20" r="4" fill="#0EA5E9" variants={draw} custom={1} />

                {/* Metal tubes of stethoscope */}
                <motion.path
                    d="M65 24 L75 60 C 75 80, 125 80, 125 60 L135 24"
                    stroke="#0EA5E9"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    variants={draw}
                    custom={2}
                />

                {/* Main tube running down */}
                <motion.path
                    d="M100 75 C 100 150, 160 130, 160 160 C 160 190, 80 190, 80 160"
                    stroke="#0EA5E9"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    variants={draw}
                    custom={3}
                />

                {/* Chestpiece */}
                <motion.circle cx="75" cy="155" r="8" stroke="#0EA5E9" strokeWidth="4" fill="white" variants={draw} custom={4} />
                <motion.circle cx="75" cy="155" r="2" fill="#0EA5E9" variants={draw} custom={4} />
            </g>
        </motion.svg>
    );
}

/* ─── Staff Data ─── */
const staffData = [
    {
        room: "포근한 곰돌이방",
        icon: "/images/bear_icon.png",
        name: "최지연 원장",
        title: "소아청소년과 전문의",
        specialty: ["소아알레르기", "아토피 피부염", "소아이비인후과 클리닉"],
        background: [
            "건양대학교 의과대학 졸업",
            "건양대병원 전공의",
            "전) 대전 선병원 과장",
            "전) 건양대학교 소아청소년과 외래교수",
            "전) 건강한 모유수유아 선발대회 심사위원",
        ],
        highlight: null,
        chop: false,
        badge: null,
        cardBg: "bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white",
        accentColor: "text-amber-700",
        borderColor: "border-amber-200/60",
        glowColor: "hover:shadow-amber-200/50",
        tintColor: "#D97706",
    },
    {
        room: "친근한 나무늘보방",
        icon: "/images/sloth_icon.png",
        name: "김성현 원장",
        title: "소아청소년과 전문의",
        specialty: [
            "소아이비인후과",
            "소아알레르기 호흡기",
            "모유상담(IBCLC)",
            "소아신경/ADHD",
            "성장/성조숙증",
            "아동 발달 클리닉",
        ],
        background: [
            "건양대대학교 의과대학 졸업",
            "연세대학교 세브란스병원 임상조교수",
            "필라델피아 아동병원(CHOP) 연수",
            "전) 엠블아동병원 원장",
        ],
        highlight: null,
        chop: true,
        badge: null,
        cardBg: "bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white",
        accentColor: "text-emerald-700",
        borderColor: "border-emerald-200/60",
        glowColor: "hover:shadow-emerald-200/50",
        tintColor: "#059669",
    },
    {
        room: "편안한 악어방",
        icon: "/images/crocodile_icon.png",
        name: "이진환 원장",
        title: "소아청소년과 전문의",
        specialty: [
            "소아알레르기 호흡기",
            "소아이비인후과",
            "소아소화기 영양",
            "성장/성조숙증",
            "아동 발달 클리닉",
        ],
        background: [
            "건양대학교 의과대학 졸업",
            "건양대병원 전공의",
            "안동시 보건소 진료과장",
        ],
        highlight: null,
        chop: false,
        badge: "국가고시 전국 수석",
        papers: [
            "Effect of adenotonsillar hypertrophy on right ventricle function in children, Korean Journal of Pediatrics",
            "Interstitial deletion of 5q33.3q35.1 in a boy with severe mental retardation, Korean Journal of Pediatrics",
            "Gram-negative Septicemia after Infliximab Treatment in an Infant with Refractory Kawasaki Disease, The Korean Journal of Pediatric Infectious Diseases",
        ],
        cardBg: "bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white",
        accentColor: "text-blue-700",
        borderColor: "border-blue-200/60",
        glowColor: "hover:shadow-blue-200/50",
        tintColor: "#2563EB",
    },
];

/* ─── Gallery Images ─── */
export type GalleryImage = {
    src: string;
    label: string;
};

const galleryImages: GalleryImage[] = [
    { src: "/images/interior/1.JPG", label: "외관" },
    { src: "/images/interior/2.jpeg", label: "외관" },
    { src: "/images/interior/3.JPG", label: "데스크" },
    { src: "/images/interior/4.JPG", label: "대기실" },
    { src: "/images/interior/5.JPG", label: "대기실" },
    { src: "/images/interior/6.JPG", label: "신생아대기실" },
    { src: "/images/interior/7.JPG", label: "신생아대기실" },
    { src: "/images/interior/8.JPG", label: "놀이방" },
    { src: "/images/interior/9.JPG", label: "유아화장실" },
    { src: "/images/interior/10.JPG", label: "호흡기치료실" },
    { src: "/images/interior/11.JPG", label: "방사선실" },
    { src: "/images/interior/12.jpeg", label: "1인 수액실" },
    { src: "/images/interior/13.jpeg", label: "수액실" },
    { src: "/images/interior/14.JPG", label: "수액실" },
    { src: "/images/interior/15.JPG", label: "아동발달센터" },
    { src: "/images/interior/16.JPG", label: "감각통합실" },
    { src: "/images/interior/17.JPG", label: "언어치료실" }
];

/* ─── Lightbox Component ─── */
function Lightbox({
    images,
    startIndex,
    onClose,
}: {
    images: GalleryImage[];
    startIndex: number;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState(startIndex);

    const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    });

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Close */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/80 hover:text-white z-10 transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Nav */}
            <button
                onClick={prev}
                className="absolute left-4 md:left-8 text-white/60 hover:text-white z-10 transition-colors"
            >
                <ChevronLeft className="w-10 h-10" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 md:right-8 text-white/60 hover:text-white z-10 transition-colors"
            >
                <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-[90vw] h-[70vh] md:w-[75vw] md:h-[80vh]"
                >
                    <Image
                        src={images[current].src}
                        alt={images[current].label}
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-wider text-center">
                <div className="text-xl md:text-2xl text-white mb-2 font-bold drop-shadow-md">{images[current].label}</div>
                <div>{current + 1} / {images.length}</div>
            </div>
        </motion.div>
    );
}

/* ─── Infinite Carousel Component ─── */
function ImageCarousel({
    images,
    onImageClick,
}: {
    images: string[];
    onImageClick: (index: number) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(0);
    const animFrameRef = useRef<number>(0);
    const CARD_WIDTH = 420;
    const GAP = 24;
    const SPEED = 0.6;

    // Double the images for infinite scroll effect
    const doubledImages = [...images, ...images];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const totalWidth = images.length * (CARD_WIDTH + GAP);

        const animate = () => {
            if (!isPaused) {
                scrollRef.current += SPEED;
                if (scrollRef.current >= totalWidth) {
                    scrollRef.current -= totalWidth;
                }
                container.style.transform = `translateX(-${scrollRef.current}px)`;
            }
            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPaused, images.length]);

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                ref={containerRef}
                className="flex will-change-transform"
                style={{ gap: `${GAP}px` }}
            >
                {doubledImages.map((src, i) => (
                    <div
                        key={`${src}-${i}`}
                        className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
                        style={{ width: CARD_WIDTH, height: 300 }}
                        onClick={() => onImageClick(i % images.length)}
                    >
                        <Image
                            src={src}
                            alt={`병원 내부 ${(i % images.length) + 1}`}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110"
                            sizes="420px"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                        <div className="absolute inset-0 shadow-none group-hover:shadow-2xl transition-shadow duration-500 rounded-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-white font-pretendard selection:bg-deep-blue selection:text-white">
            {/* ═══════ Section 1: 인사말 (Greetings Hero) ═══════ */}
            <section
                id="greeting"
                className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 md:pt-28"
            >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30" />
                <div className="absolute top-[10%] left-[5%] w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[10%] right-[5%] w-64 h-64 md:w-96 md:h-96 rounded-full bg-rose-100/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-5xl px-6 w-full py-20">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                        {/* Left: Text */}
                        <motion.div
                            className="flex-1 text-center lg:text-left max-w-lg"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInLeft} className="mb-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-deep-blue text-sm font-bold tracking-wider uppercase">
                                    About Us
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInLeft}
                                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8"
                            >
                                우리 아이들의
                                <br />
                                <span className="text-deep-blue">몸과 마음</span>의 건강을
                                <br />
                                책임지는 병원
                            </motion.h1>

                            <motion.p
                                variants={fadeInLeft}
                                className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0"
                            >
                                성장 발달 전문 소아과로서
                                <br className="hidden md:block" />
                                아이 한 명 한 명의 건강한 내일을 설계합니다
                            </motion.p>

                            <motion.div variants={fadeInLeft} className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
                                {["세심한 진료", "따뜻한 돌봄", "전문적 치료"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-semibold bg-white/80 backdrop-blur-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right: Illustration */}
                        <motion.div
                            className="flex-1 max-w-md lg:max-w-lg w-full"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInScale}
                        >
                            <div className="relative aspect-square group [perspective:1000px]">
                                <div className="absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                    {/* Front Side */}
                                    <div className="absolute inset-0 [backface-visibility:hidden]">
                                        <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-blue-100/50 to-rose-100/30" />
                                        <TeddyBearIllustration />
                                    </div>

                                    {/* Back Side */}
                                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                        <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-blue-100/50 to-rose-100/30" />
                                        <HeartStethoscopeIllustration />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════ Section 2: 의료진 소개 (Medical Staff) ═══════ */}
            <section id="staff" className="py-24 md:py-36 bg-[#FBFBFD]">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        className="text-center mb-16 md:mb-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-deep-blue text-sm font-bold tracking-wider uppercase mb-4">
                            Medical Staff
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.5] md:leading-[1.6]">
                            우리아이의 건강을 지키는
                            <br />
                            <span className="text-deep-blue">든든한 파트너</span>
                        </h2>
                    </motion.div>

                    {/* Staff Cards Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                    >
                        {staffData.map((staff, idx) => (
                            <motion.div
                                key={staff.name}
                                variants={cardVariant}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                                }}
                                className={`relative rounded-3xl p-8 border ${staff.cardBg} ${staff.borderColor} shadow-lg shadow-gray-100/50 ${staff.glowColor} hover:shadow-xl transition-all duration-500 overflow-hidden group`}
                            >
                                {/* Large blurred character background */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] opacity-[0.30] blur-[2px] pointer-events-none transition-all duration-700 ease-out group-hover:opacity-[0.60] group-hover:scale-105">
                                    <Image
                                        src={staff.icon}
                                        alt=""
                                        fill
                                        className="object-contain transition-all duration-700"
                                    />
                                    {/* Color tint overlay on hover */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-full mix-blend-color"
                                        style={{ backgroundColor: staff.tintColor }}
                                    />
                                </div>
                                {/* Subtle decorative blob */}
                                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Room Theme Header */}
                                <div className="mb-6">
                                    <h4 className={`text-lg font-extrabold ${staff.accentColor}`}>
                                        {staff.room}
                                    </h4>
                                </div>

                                {/* Doctor Name & Title */}
                                <div className="mb-5">
                                    <h3 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-2 flex-wrap">
                                        {staff.name}
                                        {/* Gold badge for 이진환 */}
                                        {staff.badge && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold shadow-md shadow-amber-200/50">
                                                <Star className="w-3 h-3 fill-white" />
                                                {staff.badge}
                                            </span>
                                        )}
                                    </h3>
                                    {staff.title && (
                                        <p className="text-sm font-semibold text-gray-500">
                                            {staff.title}
                                        </p>
                                    )}
                                </div>

                                {/* Specialty */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Stethoscope className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            전문 진료
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {staff.specialty.map((s) => (
                                            <span
                                                key={s}
                                                className="px-2.5 py-1 rounded-lg bg-white/80 text-gray-700 text-xs font-semibold border border-gray-100"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Background */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GraduationCap className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            학력 및 경력
                                        </span>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {staff.background.map((bg) => {
                                            const isChopLine = staff.chop && bg.includes("CHOP");
                                            const isHighlightLine = bg.includes("소아청소년과 외래교수");
                                            return (
                                                <li
                                                    key={bg}
                                                    className={`text-sm flex items-start gap-2 ${isChopLine
                                                        ? "text-base font-bold text-emerald-700"
                                                        : isHighlightLine
                                                            ? "font-bold text-orange-600"
                                                            : "text-gray-600 font-medium"
                                                        }`}
                                                >
                                                    <span className="text-gray-300 mt-1 shrink-0">•</span>
                                                    <span>
                                                        {bg}
                                                        {isChopLine && (
                                                            <span className="ml-1.5 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold align-middle">
                                                                <Award className="w-3 h-3" />
                                                                세계적 수준
                                                            </span>
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Papers for 이진환 */}
                                {"papers" in staff && staff.papers && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                논문
                                            </span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {staff.papers.map((paper: string) => (
                                                <li
                                                    key={paper}
                                                    className="text-xs text-gray-500 font-medium leading-relaxed flex items-start gap-2"
                                                >
                                                    <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                                                    <span className="italic">{paper}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════ Section 3: 병원 둘러보기 (Hospital Tour) ═══════ */}
            <section id="tour" className="py-24 md:py-36 bg-white overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 mb-12 md:mb-16">
                    <motion.div
                        className="text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-deep-blue text-sm font-bold tracking-wider uppercase mb-4">
                            Hospital Tour
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                            병원 둘러보기
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            따뜻하고 편안한 공간에서 아이들이 안심하고 진료받을 수 있습니다
                        </p>
                    </motion.div>
                </div>

                {/* Hover Accordion Gallery */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <HoverAccordionGallery
                        images={galleryImages}
                        onImageClick={(i) => setLightboxIndex(i)}
                    />
                </motion.div>

                {/* See More Button */}
                <motion.div
                    className="text-center mt-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={() => setLightboxIndex(0)}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-deep-blue text-white font-bold text-base shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        더 보기
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </section>

            {/* ─── Lightbox ─── */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox
                        images={galleryImages}
                        startIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
