"use client";

import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, Navigation2, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import HomePopup from "@/components/HomePopup";
import PinnedNoticesCarousel from "@/components/PinnedNoticesCarousel";

/* ─── SVG Schematic Illustrations ─── */
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: i * 0.15, duration: 0.8, ease: "easeInOut" as const }, opacity: { delay: i * 0.15, duration: 0.3 } }
  }),
};

/* Growth: child with upward arrow + height ruler */
function GrowthSVG() {
  return (
    <motion.svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" initial="hidden" animate="visible">
      {/* Ruler */}
      <motion.line x1="25" y1="100" x2="25" y2="20" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={0} />
      <motion.line x1="22" y1="35" x2="30" y2="35" stroke="#3B82F6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={1} />
      <motion.line x1="22" y1="50" x2="30" y2="50" stroke="#3B82F6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={1} />
      <motion.line x1="22" y1="65" x2="30" y2="65" stroke="#3B82F6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={1} />
      <motion.line x1="22" y1="80" x2="30" y2="80" stroke="#3B82F6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={1} />
      {/* Person */}
      <motion.circle cx="60" cy="38" r="8" stroke="#3B82F6" strokeWidth="3" variants={draw} custom={2} />
      <motion.line x1="60" y1="46" x2="60" y2="72" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={3} />
      <motion.line x1="60" y1="56" x2="46" y2="64" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={3} />
      <motion.line x1="60" y1="56" x2="74" y2="64" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={3} />
      <motion.line x1="60" y1="72" x2="48" y2="90" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={4} />
      <motion.line x1="60" y1="72" x2="72" y2="90" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={4} />
      {/* Arrow up */}
      <motion.line x1="92" y1="85" x2="92" y2="30" stroke="#3B82F6" strokeWidth="3.75" strokeLinecap="round" variants={draw} custom={5} />
      <motion.polyline points="84,40 92,28 100,40" stroke="#3B82F6" strokeWidth="3.75" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={draw} custom={6} />
    </motion.svg>
  );
}

/* Development: brain with connected nodes */
function DevelopmentSVG() {
  return (
    <motion.svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" initial="hidden" animate="visible">
      {/* Brain outline */}
      <motion.path d="M60 25 C40 25 30 38 30 50 C30 56 33 62 38 66 C35 72 36 80 42 84 C46 87 52 86 56 83 C58 85 62 85 64 83 C68 86 74 87 78 84 C84 80 85 72 82 66 C87 62 90 56 90 50 C90 38 80 25 60 25Z" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={0} />
      {/* Brain center line */}
      <motion.path d="M60 30 C60 40 55 50 60 55 C65 60 60 70 60 80" stroke="#8B5CF6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={1} />
      {/* Nodes */}
      <motion.circle cx="45" cy="50" r="3" stroke="#8B5CF6" strokeWidth="2.25" variants={draw} custom={2} />
      <motion.circle cx="75" cy="50" r="3" stroke="#8B5CF6" strokeWidth="2.25" variants={draw} custom={2} />
      <motion.circle cx="50" cy="68" r="3" stroke="#8B5CF6" strokeWidth="2.25" variants={draw} custom={3} />
      <motion.circle cx="70" cy="68" r="3" stroke="#8B5CF6" strokeWidth="2.25" variants={draw} custom={3} />
      {/* Connections */}
      <motion.line x1="48" y1="50" x2="72" y2="50" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" variants={draw} custom={4} />
      <motion.line x1="45" y1="53" x2="50" y2="65" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" variants={draw} custom={4} />
      <motion.line x1="75" y1="53" x2="70" y2="65" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" variants={draw} custom={4} />
      {/* Sparkle */}
      <motion.circle cx="60" cy="15" r="2" stroke="#8B5CF6" strokeWidth="2.25" variants={draw} custom={5} />
      <motion.line x1="60" y1="10" x2="60" y2="12" stroke="#8B5CF6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={5} />
      <motion.line x1="60" y1="18" x2="60" y2="20" stroke="#8B5CF6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={5} />
      <motion.line x1="55" y1="15" x2="57" y2="15" stroke="#8B5CF6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={5} />
      <motion.line x1="63" y1="15" x2="65" y2="15" stroke="#8B5CF6" strokeWidth="2.25" strokeLinecap="round" variants={draw} custom={5} />
    </motion.svg>
  );
}

/* Allergy: shield with cross + pollen particles */
function AllergySVG() {
  return (
    <motion.svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" initial="hidden" animate="visible">
      {/* Shield */}
      <motion.path d="M60 15 L90 30 L90 60 C90 80 75 100 60 105 C45 100 30 80 30 60 L30 30Z" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" variants={draw} custom={0} />
      {/* Cross inside shield */}
      <motion.line x1="60" y1="40" x2="60" y2="72" stroke="#F59E0B" strokeWidth="3.75" strokeLinecap="round" variants={draw} custom={1} />
      <motion.line x1="44" y1="56" x2="76" y2="56" stroke="#F59E0B" strokeWidth="3.75" strokeLinecap="round" variants={draw} custom={2} />
      {/* Pollen particles floating */}
      <motion.circle cx="18" cy="25" r="3" stroke="#F59E0B" strokeWidth="1.5" variants={draw} custom={3} />
      <motion.line x1="18" y1="20" x2="18" y2="22" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={3} />
      <motion.line x1="18" y1="28" x2="18" y2="30" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={3} />
      <motion.line x1="13" y1="25" x2="15" y2="25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={3} />
      <motion.line x1="21" y1="25" x2="23" y2="25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={3} />
      <motion.circle cx="100" cy="20" r="2.5" stroke="#F59E0B" strokeWidth="1.5" variants={draw} custom={4} />
      <motion.line x1="100" y1="15" x2="100" y2="17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={4} />
      <motion.line x1="100" y1="23" x2="100" y2="25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" variants={draw} custom={4} />
      <motion.circle cx="15" cy="75" r="2" stroke="#F59E0B" strokeWidth="1.5" variants={draw} custom={5} />
      <motion.circle cx="105" cy="70" r="2.5" stroke="#F59E0B" strokeWidth="1.5" variants={draw} custom={5} />
    </motion.svg>
  );
}

/* Infection: microscope + virus */
function InfectionSVG() {
  return (
    <motion.svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" initial="hidden" animate="visible">
      {/* Virus body */}
      <motion.circle cx="60" cy="55" r="18" stroke="#10B981" strokeWidth="3" variants={draw} custom={0} />
      {/* Inner pattern */}
      <motion.circle cx="60" cy="55" r="8" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={1} />
      <motion.circle cx="56" cy="52" r="2" stroke="#10B981" strokeWidth="1.5" variants={draw} custom={2} />
      <motion.circle cx="64" cy="58" r="2" stroke="#10B981" strokeWidth="1.5" variants={draw} custom={2} />
      {/* Spikes */}
      <motion.line x1="60" y1="37" x2="60" y2="28" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={3} />
      <motion.circle cx="60" cy="26" r="2.5" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={3} />
      <motion.line x1="60" y1="73" x2="60" y2="82" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={3} />
      <motion.circle cx="60" cy="84" r="2.5" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={3} />
      <motion.line x1="42" y1="55" x2="33" y2="55" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={4} />
      <motion.circle cx="31" cy="55" r="2.5" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={4} />
      <motion.line x1="78" y1="55" x2="87" y2="55" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={4} />
      <motion.circle cx="89" cy="55" r="2.5" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={4} />
      {/* Diagonal spikes */}
      <motion.line x1="47" y1="42" x2="40" y2="35" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={5} />
      <motion.circle cx="38" cy="33" r="2" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={5} />
      <motion.line x1="73" y1="42" x2="80" y2="35" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={5} />
      <motion.circle cx="82" cy="33" r="2" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={5} />
      <motion.line x1="47" y1="68" x2="40" y2="75" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={6} />
      <motion.circle cx="38" cy="77" r="2" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={6} />
      <motion.line x1="73" y1="68" x2="80" y2="75" stroke="#10B981" strokeWidth="3" strokeLinecap="round" variants={draw} custom={6} />
      <motion.circle cx="82" cy="77" r="2" stroke="#10B981" strokeWidth="2.25" variants={draw} custom={6} />
    </motion.svg>
  );
}

const svgMap: Record<string, React.FC> = {
  "성장": GrowthSVG,
  "발달": DevelopmentSVG,
  "알레르기": AllergySVG,
  "감염": InfectionSVG,
};

export default function HospitalMainPage() {
  const [isRainbow, setIsRainbow] = useState(false);
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const clinicKeywords = [
    { label: "성장", color: "#3B82F6" },
    { label: "발달", color: "#8B5CF6" },
    { label: "알레르기", color: "#F59E0B" },
    { label: "감염", color: "#10B981" },
  ];

  return (
    <main className="min-h-screen bg-[#FBFBFD] font-pretendard selection:bg-deep-blue selection:text-white">
      <HomePopup />
      {/* ═══════ Section 1: Modern Minimal Hero ═══════ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#FBFBFD] flex flex-col items-center justify-center">

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">

          {/* Logo + SVG Illustration area */}
          <div className="relative w-72 h-52 md:w-[416px] md:h-[292px] mb-8">
            <AnimatePresence mode="wait">
              {hoveredKeyword ? (
                <motion.div
                  key={hoveredKeyword}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {svgMap[hoveredKeyword] && (() => { const SvgComp = svgMap[hoveredKeyword]; return <SvgComp />; })()}
                </motion.div>
              ) : (
                <motion.div
                  key="logo"
                  className="relative w-full h-full cursor-pointer"
                  initial={{ scale: 1.7, filter: "blur(15px)", opacity: 0 }}
                  animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
                    filter: { duration: 1.5, ease: "easeOut", delay: 0.1 },
                    opacity: { duration: 0.8, delay: 0.1 }
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut", delay: 0 }
                  }}
                >
                  <Image
                    src="/images/hospital_logo.png"
                    alt="우리들소아청소년과 로고"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clinic Name - Wooridul: puzzle-like gathering */}
          <div className="text-4xl md:text-8xl font-black tracking-tight text-gray-900 mb-2 md:mb-4 flex justify-center overflow-visible">
            {"Wooridul".split("").map((char, i) => {
              const flyFromPositions = [
                { x: -500, y: -300, rotate: -120 },   // W
                { x: 400, y: -400, rotate: 100 },     // o
                { x: -400, y: 400, rotate: 180 },     // o
                { x: 600, y: 200, rotate: -150 },     // r
                { x: -200, y: -500, rotate: 140 },    // i
                { x: 400, y: 500, rotate: -160 },     // d
                { x: -600, y: 100, rotate: 90 },      // u
                { x: 300, y: -500, rotate: -130 },    // l
              ];
              const from = flyFromPositions[i];
              const rainbow = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#6366F1", "#8B5CF6"];
              const tapColor = rainbow[Math.floor(Math.random() * rainbow.length)];

              const baseDelay = 0.4 + i * 0.05;
              const moveDelay = baseDelay + 0.7; // ~0.7초 대기 (0.8초 페이드인 고려)

              return (
                <motion.span
                  key={`w-${i}`}
                  className="inline-block cursor-pointer select-none"
                  initial={{ opacity: 0, x: from.x, y: from.y, rotate: from.rotate, scale: 0.9, color: tapColor }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, color: "#111827" }}
                  transition={{
                    opacity: { duration: 0.8, delay: baseDelay },
                    default: { duration: 3.5, ease: [0.16, 1, 0.3, 1], delay: moveDelay }
                  }}
                  whileHover={{
                    y: [0, -18, 0, -8, 0],
                    scale: [1, 1.2, 1, 1.1, 1],
                    color: ["#111827", tapColor, tapColor, tapColor, "#111827"],
                    transition: { duration: 0.6, ease: "easeOut" },
                  }}
                  whileTap={{
                    scale: 0.9,
                    color: tapColor,
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>

          {/* PEDIATRIC CLINIC - puzzle-like gathering */}
          <div className="text-base md:text-3xl font-semibold tracking-[0.2em] uppercase text-gray-400 mb-8 md:mb-12 flex justify-center gap-[0.1em] md:gap-[0.2em] overflow-visible">
            {"PEDIATRIC".split("").map((char, i) => {
              const flyFromPositions = [
                { x: 500, y: -400, rotate: 130 },     // P
                { x: -600, y: 200, rotate: -110 },    // E
                { x: 300, y: 500, rotate: 160 },      // D
                { x: -400, y: -300, rotate: -140 },   // I
                { x: 600, y: -100, rotate: 120 },     // A
                { x: -300, y: 400, rotate: -160 },    // T
                { x: 400, y: -500, rotate: 110 },     // R
                { x: -500, y: -200, rotate: -130 },   // I
                { x: 700, y: 300, rotate: 150 },      // C
              ];
              const from = flyFromPositions[i];
              const rainbow = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#6366F1", "#8B5CF6"];
              const tapColor = rainbow[Math.floor(Math.random() * rainbow.length)];

              const baseDelay = 1.2 + i * 0.05;
              const moveDelay = baseDelay + 0.7;

              return (
                <motion.span
                  key={`p-${i}`}
                  className="inline-block cursor-pointer select-none"
                  initial={{ opacity: 0, x: from.x, y: from.y, rotate: from.rotate, scale: 0.9, color: tapColor }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, color: "#9CA3AF" }}
                  transition={{
                    opacity: { duration: 0.8, delay: baseDelay },
                    default: { duration: 3.5, ease: [0.16, 1, 0.3, 1], delay: moveDelay }
                  }}
                  whileHover={{
                    y: [0, -12, 0, -6, 0],
                    scale: [1, 1.3, 1, 1.15, 1],
                    color: ["#9CA3AF", tapColor, tapColor, tapColor, "#9CA3AF"],
                    transition: { duration: 0.5, ease: "easeOut" },
                  }}
                  whileTap={{
                    scale: 0.9,
                    color: tapColor,
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {/* Space */}
            <span className="inline-block w-[0.4em]" />
            {"CLINIC".split("").map((char, i) => {
              const flyFromPositions = [
                { x: -500, y: -400, rotate: -130 },   // C
                { x: 400, y: 500, rotate: 150 },      // L
                { x: -600, y: 100, rotate: -110 },    // I
                { x: 500, y: -300, rotate: 130 },     // N
                { x: -300, y: 500, rotate: -160 },    // I
                { x: 600, y: 200, rotate: 140 },      // C
              ];
              const from = flyFromPositions[i];
              const rainbow = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#6366F1", "#8B5CF6"];
              const tapColor = rainbow[Math.floor(Math.random() * rainbow.length)];

              const baseDelay = 1.6 + i * 0.05;
              const moveDelay = baseDelay + 0.7;

              return (
                <motion.span
                  key={`c-${i}`}
                  className="inline-block cursor-pointer select-none"
                  initial={{ opacity: 0, x: from.x, y: from.y, rotate: from.rotate, scale: 0.9, color: tapColor }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, color: "#9CA3AF" }}
                  transition={{
                    opacity: { duration: 0.8, delay: baseDelay },
                    default: { duration: 3.5, ease: [0.16, 1, 0.3, 1], delay: moveDelay }
                  }}
                  whileHover={{
                    y: [0, -12, 0, -6, 0],
                    scale: [1, 1.3, 1, 1.15, 1],
                    color: ["#9CA3AF", tapColor, tapColor, tapColor, "#9CA3AF"],
                    transition: { duration: 0.5, ease: "easeOut" },
                  }}
                  whileTap={{
                    scale: 0.9,
                    color: tapColor,
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>

          {/* Tagline */}
          <motion.p
            className="text-base md:text-2xl text-gray-500 font-medium leading-relaxed break-keep mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            아이들의 건강한 내일을 위한<br />세분화된 맞춤 클리닉
          </motion.p>

          {/* Clinic Keyword Pills */}
          <div className="w-full relative">
            <motion.div
              className="flex flex-nowrap md:flex-wrap justify-center md:justify-center gap-3 md:gap-5 px-4 md:px-0 overflow-x-auto no-scrollbar pt-2 pb-6 md:pb-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.8 } }
              }}
            >
              {clinicKeywords.map((kw, i) => (
                <motion.div
                  key={kw.label}
                  className="shrink-0 snap-center px-6 py-3 md:px-11 md:py-5 rounded-full font-bold text-base md:text-xl text-white shadow-lg cursor-pointer select-none"
                  style={{
                    backgroundColor: kw.color,
                    boxShadow: `0 8px 24px -4px ${kw.color}44`,
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  whileHover={{ scale: 1.08, y: -4, boxShadow: `0 14px 32px -4px ${kw.color}66`, transition: { duration: 0.25 } }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredKeyword(kw.label)}
                  onHoverEnd={() => setHoveredKeyword(null)}
                  onClick={(e) => {
                    // 터치 이벤트 발생 시점 충돌 방지
                    e.preventDefault();
                    setHoveredKeyword(kw.label);
                  }}
                >
                  {kw.label}
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-gray-400 mb-2 text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold">Scroll</span>
          <motion.div
            className="w-[1.5px] h-10 md:h-12 bg-gradient-to-b from-gray-400 to-transparent origin-top rounded-full"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ═══════ Section 2: Clinics Introduction ═══════ */}
      <section className="py-32 md:py-48 bg-[#FBFBFD]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center mb-20 md:mb-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">전문적인 세부 클리닉</h2>
            <p className="mt-6 text-xl text-gray-500 font-medium">우리아이의 바른 성장을 위한 세분화된 진료</p>
          </motion.div>

          <div className="grid gap-8 md:gap-16">
            {/* Clinic 01 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12 group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="w-full md:w-1/2 md:pr-12">
                <div className="text-sm font-bold text-deep-blue mb-4 uppercase tracking-wider">Clinic 01</div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight group-hover:text-deep-blue transition-colors duration-500">
                  성장 클리닉
                </h3>
                <p className="text-2xl text-gray-400 font-light leading-relaxed">
                  성조숙증 <br />
                  저신장 (성장호르몬) <br />
                  소아비만
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-gray-100 shadow-xl shadow-gray-200/50">
                  <Image
                    src="/images/clinic_growth_new.png"
                    alt="성장 클리닉"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Clinic 02 */}
            <motion.div
              className="flex flex-col md:flex-row-reverse items-center gap-12 mt-16 md:mt-32 group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="w-full md:w-1/2 md:pl-12">
                <div className="text-sm font-bold text-coral mb-4 uppercase tracking-wider">Clinic 02</div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight group-hover:text-coral transition-colors duration-500">
                  아동발달 센터
                </h3>
                <p className="text-2xl text-gray-400 font-light leading-relaxed">
                  발달 평가 <br />
                  언어치료 <br />
                  감각통합치료
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-gray-100">
                  <Image
                    src="/images/dev_playroom_wooden_toys.png"
                    alt="아동발달 센터"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Clinic 03 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12 mt-16 md:mt-32 group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="w-full md:w-1/2 md:pr-12">
                <div className="text-sm font-bold text-sky-500 mb-4 uppercase tracking-wider">Clinic 03</div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight group-hover:text-sky-500 transition-colors duration-500">
                  호흡기/알레르기 클리닉
                </h3>
                <p className="text-2xl text-gray-400 font-light leading-relaxed">
                  숨쉬기 편안한 <br />
                  건강한 일상
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-gray-100 shadow-xl shadow-gray-200/50">
                  <Image
                    src="/images/clinic_respiratory_new.png"
                    alt="호흡기/알레르기 클리닉"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════ Section 2.5: 고정 공지사항 ═══════ */}
      <PinnedNoticesCarousel />

      {/* ═══════ Section 3: Location & Time (Redesigned) ═══════ */}
      <section className="py-24 md:py-32 bg-white pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#222222] tracking-tight">진료시간 및 오시는 길</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-center max-w-6xl mx-auto">

            {/* Left: Illustrations + Map Image + Map Links */}
            <motion.div
              className="w-full lg:w-[45%] flex flex-col items-center lg:pt-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {/* Map Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-md border-4 border-white ring-1 ring-gray-100 bg-gray-50 z-0">
                <Image
                  src="/images/map.png"
                  alt="오시는 길 지도"
                  fill
                  className="object-cover"
                />
              </div>

              {/* 4 Link Buttons Grid */}
              <div className="w-full grid grid-cols-2 gap-3 mt-5">
                {/* 1. 진료예약 (똑닥) */}
                <Link
                  href="https://short.ddocdoc.com/m8eeg5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-[56px] rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#391B1B] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <Image
                    src="/images/ddocdoc.jpg"
                    alt="똑닥 로고"
                    width={28}
                    height={28}
                    className="rounded-lg object-contain"
                  />
                  <span className="text-sm font-black">진료예약</span>
                </Link>

                {/* 2. 카카오톡 채널 */}
                <Link
                  href="http://pf.kakao.com/_xczQUG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-[56px] rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#391B1B] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="#391B1B">
                    <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.96 3.6-.99 3.83 0 0-.02.17.09.24.1.06.23.02.23.02.3-.04 3.54-2.32 4.1-2.72.6.08 1.24.13 1.91.13 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-medium opacity-80">우리들아동발달센터</span>
                    <span className="text-sm font-black">카카오톡 상담</span>
                  </div>
                </Link>

                {/* 3. Instagram */}
                <Link
                  href="https://www.instagram.com/wooridulped?igsh=YnUyenYzaDAyeWpw&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-[56px] rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <Image
                    src="/instagram_black.svg"
                    alt="Instagram"
                    width={22}
                    height={22}
                    className="brightness-0 invert"
                  />
                  <span className="text-sm font-black">Instagram</span>
                </Link>

                {/* 4. 네이버블로그 */}
                <Link
                  href="https://blog.naver.com/wooridulped"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-[56px] rounded-xl bg-[#03C75A] hover:bg-[#02b351] text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="white">
                    <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-medium opacity-80">네이버 블로그</span>
                    <span className="text-[11px] font-black">우리들아동발달센터</span>
                  </div>
                </Link>
              </div>

            </motion.div>

            {/* Right: Info Typography */}
            <motion.div
              className="w-full lg:w-[55%] flex flex-col justify-start pt-4 lg:pt-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Address Header */}
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-6 h-6 text-[#355DBB] shrink-0 mt-0.5" fill="#e6f0ff" />
                  <h4 className="text-xl md:text-[1.35rem] font-bold text-[#222222] leading-tight">
                    대전 유성구 노은로 170 스타시티빌딩 6층 <br className="md:hidden" /> <span className="text-[#355DBB]">우리들소아청소년과</span>
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-gray-700 pl-8 font-medium">
                  <span>노은역 1번 출구 <strong>도보 1분</strong> | <strong>노은역 지하주차장 주차 가능</strong></span>
                </div>
              </motion.div>

              {/* Reservation Tel */}
              <motion.div variants={fadeInUp} className="mb-4">
                <div className="flex items-center justify-between border-2 border-[#5479CA] rounded-full h-[54px] pl-10 pr-8 text-center bg-white shadow-sm w-full max-w-[390px]">
                  <span className="text-[#5479CA] text-xl font-bold">전화</span>
                  <a href="tel:042-862-7582" className="text-4xl font-extrabold text-[#5479CA] tracking-tighter hover:text-blue-800 transition-colors leading-none pb-0.5">
                    042-862-7582
                  </a>
                </div>
              </motion.div>

              <motion.p variants={fadeInUp} className="text-gray-700 font-medium mb-8 text-sm md:text-base flex items-start md:items-center gap-1">
                <span className="text-black mt-0.5 md:mt-0">*</span>
                <span>
                  원활하고 빠른 진료를 위해 <strong className="text-[#355DBB] font-bold underline underline-offset-4 decoration-2">"똑닥"어플 예약 또는 현장 접수로</strong> 운영 됩니다.
                </span>
              </motion.p>

              {/* Hours Table */}
              <motion.div variants={fadeInUp} className="flex flex-col gap-3.5 w-full max-w-[420px]">
                {/* Row 1: Weekdays */}
                <div className="flex items-center w-full h-[54px]">
                  <div className="w-[110px] h-full bg-[#3B66BC] text-white font-bold rounded-l-full flex items-center justify-center text-[1.1rem] tracking-wide shrink-0">
                    평일
                  </div>
                  <div className="flex-1 h-full bg-[#EBEBEB] text-[#111] rounded-r-full flex items-center px-5 font-medium text-[1.1rem] tracking-wide justify-between whitespace-nowrap">
                    <span>오전 <strong className="font-extrabold text-2xl">08:30</strong></span>
                    <span>~</span>
                    <span>오후 <strong className="font-extrabold text-2xl">06:30</strong></span>
                  </div>
                </div>

                {/* Row 2: Sat */}
                <div className="flex items-center w-full h-[54px]">
                  <div className="w-[110px] h-full bg-[#3B66BC] text-white font-bold rounded-l-full flex items-center justify-center text-[1.1rem] tracking-wide shrink-0">
                    토요일
                  </div>
                  <div className="flex-1 h-full bg-[#EBEBEB] text-[#111] rounded-r-full flex items-center px-5 font-medium text-[1.1rem] tracking-wide justify-between whitespace-nowrap">
                    <span>오전 <strong className="font-extrabold text-2xl">08:30</strong></span>
                    <span>~</span>
                    <span>오후 <strong className="font-extrabold text-2xl">01:00</strong></span>
                  </div>
                </div>

                {/* Row 3: Lunch */}
                <div className="flex items-center w-full h-[54px]">
                  <div className="w-[110px] h-full bg-[#3B66BC] text-white font-bold rounded-l-full flex items-center justify-center text-[1.1rem] tracking-wide shrink-0">
                    점심시간
                  </div>
                  <div className="flex-1 h-full bg-[#EBEBEB] text-[#111] rounded-r-full flex items-center px-5 font-medium text-[1.1rem] tracking-wide justify-between whitespace-nowrap">
                    <span>오후 <strong className="font-extrabold text-2xl">01:00</strong></span>
                    <span>~</span>
                    <span>오후 <strong className="font-extrabold text-2xl">02:00</strong></span>
                  </div>
                </div>
              </motion.div>

              <motion.p variants={fadeInUp} className="mt-4 text-[#E85B5B] font-medium text-base">
                * 일요일/공휴일은 휴진입니다.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>


    </main>
  );
}
