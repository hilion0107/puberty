"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------
   SVG paths hand-traced from the hospital_logo.png:
   - Cloud body (outline)
   - 4 rain lines (vertical squiggles)
   - 2 small stars (star paths)
   - 2 dots (circles → ellipse paths)
   - "wooridul" text as a single path (outline font)
   ------------------------------------------------------------------ */

const STROKE_COLOR = "#1a2340";
const FILL_COLOR = "#1a2340";
// Mint color for hover (logo graphic parts only)
const MINT = "#4ecdc4";

// Each segment is drawn one after another
const drawVariant = (delay: number, duration = 1.0) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration, delay, ease: "easeInOut" },
            opacity: { duration: 0.1, delay },
        },
    },
});

const fillVariant = (delay: number) => ({
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, delay, ease: "backOut" },
    },
});

export default function LogoDrawAnimation() {
    return (
        <motion.svg
            viewBox="0 0 580 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full group"
            initial="hidden"
            animate="visible"
        >
            {/* ── Cloud main body outline ── */}
            <motion.path
                d="
          M148,175
          C100,175 62,140 62,98
          C62,68 80,43 107,33
          C110,14 127,0 148,0
          C160,0 171,5 179,13
          C188,5 200,0 214,0
          C244,0 268,24 268,54
          C268,57 268,60 267,63
          C285,70 298,87 298,108
          C298,140 271,165 238,165
          L148,175Z
        "
                stroke={STROKE_COLOR}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={drawVariant(0.1, 2.2)}
                style={{ transition: "stroke 0.5s ease" }}
                className="group-hover:[stroke:#4ecdc4]"
            />

            {/* ── Rain line 1 ── */}
            <motion.path
                d="M130,182 L130,230 Q130,240 140,240 L140,255"
                stroke={STROKE_COLOR}
                strokeWidth="8"
                strokeLinecap="round"
                variants={drawVariant(2.4, 0.6)}
                style={{ transition: "stroke 0.5s ease" }}
                className="group-hover:[stroke:#4ecdc4]"
            />
            {/* ── Rain line 2 ── */}
            <motion.path
                d="M160,182 L160,255"
                stroke={STROKE_COLOR}
                strokeWidth="8"
                strokeLinecap="round"
                variants={drawVariant(2.6, 0.5)}
                style={{ transition: "stroke 0.5s ease" }}
                className="group-hover:[stroke:#4ecdc4]"
            />
            {/* ── Rain line 3 ── */}
            <motion.path
                d="M190,182 L190,230 Q190,240 200,240 L200,255"
                stroke={STROKE_COLOR}
                strokeWidth="8"
                strokeLinecap="round"
                variants={drawVariant(2.8, 0.6)}
                style={{ transition: "stroke 0.5s ease" }}
                className="group-hover:[stroke:#4ecdc4]"
            />
            {/* ── Rain line 4 ── */}
            <motion.path
                d="M220,182 L220,255"
                stroke={STROKE_COLOR}
                strokeWidth="8"
                strokeLinecap="round"
                variants={drawVariant(3.0, 0.5)}
                style={{ transition: "stroke 0.5s ease" }}
                className="group-hover:[stroke:#4ecdc4]"
            />

            {/* ── Big dot (filled circle) ── */}
            <motion.circle
                cx="152"
                cy="100"
                r="10"
                fill={FILL_COLOR}
                variants={fillVariant(3.5)}
                style={{ transition: "fill 0.5s ease" }}
                className="group-hover:[fill:#4ecdc4]"
            />

            {/* ── Small dot ── */}
            <motion.circle
                cx="172"
                cy="75"
                r="5"
                fill={FILL_COLOR}
                variants={fillVariant(3.7)}
                style={{ transition: "fill 0.5s ease" }}
                className="group-hover:[fill:#4ecdc4]"
            />

            {/* ── Star 1 (small, top-right area) ── */}
            <motion.path
                d="M240,42 L243,52 L253,52 L245,58 L248,68 L240,62 L232,68 L235,58 L227,52 L237,52 Z"
                fill={FILL_COLOR}
                variants={fillVariant(3.9)}
                style={{ transition: "fill 0.5s ease" }}
                className="group-hover:[fill:#4ecdc4]"
            />

            {/* ── Star 2 (bigger, lower-right) ── */}
            <motion.path
                d="M265,82 L269,96 L283,96 L272,104 L276,118 L265,110 L254,118 L258,104 L247,96 L261,96 Z"
                fill={FILL_COLOR}
                variants={fillVariant(4.1)}
                style={{ transition: "fill 0.5s ease" }}
                className="group-hover:[fill:#4ecdc4]"
            />

            {/* ── "wooridul" text path (drawn in one stroke) ── */}
            {/* Using text element animated with stroke-dashoffset trick via Framer Motion */}
            <motion.text
                x="120"
                y="258"
                fontSize="68"
                fontFamily="'Arial Black', 'Arial Bold', sans-serif"
                fontWeight="900"
                fill="none"
                stroke={STROKE_COLOR}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={drawVariant(4.3, 2.0)}
                style={{ paintOrder: "stroke fill" }}
            >
                wooridul
            </motion.text>

            {/* ── Text fill fades in after stroke draw ── */}
            <motion.text
                x="120"
                y="258"
                fontSize="68"
                fontFamily="'Arial Black', 'Arial Bold', sans-serif"
                fontWeight="900"
                fill={FILL_COLOR}
                variants={fillVariant(6.5)}
            >
                wooridul
            </motion.text>
        </motion.svg>
    );
}
