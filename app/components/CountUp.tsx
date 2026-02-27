"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useTransform, motion } from "framer-motion";

export function CountUp({
    to,
    duration = 2,
    className = "",
}: {
    to: number;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const count = useMotionValue(0);
    const springCount = useSpring(count, { duration: duration * 1000, bounce: 0 });
    const rounded = useTransform(springCount, Math.round);

    useEffect(() => {
        if (isInView) {
            count.set(to);
        }
    }, [isInView, to, count]);

    return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
