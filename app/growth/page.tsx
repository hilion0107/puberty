"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CountUp } from "../components/CountUp";
import {
    Brain,
    Search,
    AlertTriangle,
    Timer,
    ShieldCheck,
    Activity,
    ChevronDown,
    Phone,
    Heart,
    TrendingUp,
    ActivitySquare,
    ClipboardList,
    Syringe,
    PlayCircle,
    HelpCircle,
    Stethoscope,
    Bone,
    CheckCircle2,
    Calendar,
    Sparkles,
} from "lucide-react";

/* ─────────────── Animation variants ─────────────── */
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

/* ─────────────── Nav links ─────────────── */
const navLinks = [
    { href: "#definition", label: "저신장이란" },
    { href: "#checklist", label: "체크리스트" },
    { href: "#principle", label: "치료 원리" },
    { href: "#safety", label: "안전성" },
    { href: "#injection", label: "주사법" },
    { href: "#process", label: "진료 과정" },
    { href: "#faq", label: "FAQ" },
];

/* ─────────────── FAQ data ─────────────── */
const faqData = [
    {
        q: "부모 키가 작으면 무조건 유전인가요?",
        a: "유전적 요인이 크지만, 영양 상태, 수면, 운동, 호르몬 분비 등 다양한 환경적 요인도 성장에 큰 영향을 미칩니다. 부모의 키가 작아도 적절한 관리를 통해 예상보다 더 클 수 있습니다.",
    },
    {
        q: "치료는 언제 시작하는 게 좋나요?",
        a: "보통 초등학교 입학 전후(만 5~6세)부터 골연령 및 뼈 나이를 검사하여, 필요한 경우 일찍 치료를 시작하는 것이 유리합니다. 사춘기가 본격적으로 시작되기 전이 가장 효과가 좋습니다.",
    },
    {
        q: "주사를 매일 맞아야 하나요?",
        a: "약효를 일정하게 유지하기 위해 주 6~7회, 매일 피하 주사하는 것이 가장 일반적이며 효과적입니다.",
    },
    {
        q: "주사 맞을 때 많이 아픈가요?",
        a: "최근에는 바늘이 얇고 짧은 펜 타입이나 자동 주사기가 잘 나와 있어 통증이 시원찮습니다. 아이들도 금방 적응하는 경우가 많습니다.",
    },
    {
        q: "치료 기간은 얼마나 되나요?",
        a: "아이의 반응도에 따라 다르지만 보통 2~3년 이상의 장기 치료가 권장됩니다. 성장판이 닫힐 때까지 꾸준히 하는 것이 중요합니다.",
    },
];

/* ─────────────── Section Wrapper ─────────────── */
function Section({
    id,
    children,
    className = "",
    bg = "bg-white",
}: {
    id: string;
    children: React.ReactNode;
    className?: string;
    bg?: string;
}) {
    return (
        <motion.section
            id={id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
            className={`py-20 md:py-28 ${bg} ${className}`}
        >
            <div className="mx-auto max-w-6xl px-6">{children}</div>
        </motion.section>
    );
}

/* ─────────────── Section Title ─────────────── */
function SectionTitle({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-growth-blue/10">
                <Icon className="h-7 w-7 text-growth-blue" />
            </div>
            <h2 className="text-2xl font-bold text-growth-blue md:text-3xl">{title}</h2>
            {subtitle && (
                <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500">{subtitle}</p>
            )}
        </div>
    );
}

/* ─────────────── FAQ Accordion ─────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-growth-blue"
            >
                <div className="flex items-start gap-3 pr-4">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-growth-blue-light" />
                    <span className="text-base font-semibold text-gray-800">{q}</span>
                </div>
                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <p className="pb-5 pl-8 text-sm leading-relaxed text-gray-600">{a}</p>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function GrowthPage() {
    return (
        <main className="min-h-screen bg-growth-bg font-pretendard">
            {/* ─── Sticky Nav ─── */}
            <nav className="fixed top-0 z-50 w-full border-b border-gray-100/60 bg-white/80 backdrop-blur-lg">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-6">
                        <a href="#" className="flex items-center gap-2 font-bold text-growth-blue">
                            <TrendingUp className="h-6 w-6 text-growth-orange" />
                            <span className="text-lg tracking-tight whitespace-nowrap">저신장 클리닉</span>
                        </a>
                        {/* Main GNB for Page switching */}
                        <div className="hidden lg:flex items-center gap-2 border-l border-gray-200 pl-6">
                            <a href="/" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-deep-blue transition-colors">성조숙증 클리닉</a>
                            <a href="/growth" className="px-3 py-1.5 text-sm font-bold text-growth-blue bg-growth-blue/10 rounded-full transition-colors">저신장 클리닉</a>
                        </div>
                    </div>
                    <div className="hidden gap-1 xl:flex">
                        {navLinks.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-growth-blue/5 hover:text-growth-blue whitespace-nowrap"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* ═══════ Section 1: Hero ═══════ */}
            <section
                id="definition"
                className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-orange-50 pb-20 pt-28 md:pb-32 md:pt-40"
            >
                {/* Decorative elements */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-growth-orange/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-growth-blue/10 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-growth-orange/10 px-4 py-1.5 text-sm font-bold text-growth-orange">
                            <Sparkles className="h-4 w-4" />
                            성장호르몬 치료 가이드
                        </span>
                        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl md:leading-tight">
                            우리 아이 숨은 키 찾기,
                            <br />
                            <span className="text-growth-blue">정확한 진단</span>이 시작입니다
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                            저신장증은 치료 시기를 놓치지 않는 것이 가장 중요합니다.
                            의학적 기준에 맞는 정확한 진단을 통해 맞춤형 성장 플랜을 세워드립니다.
                        </p>
                    </motion.div>

                    {/* Growth Criteria Infographic */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3 }}
                        className="mx-auto mt-16 max-w-3xl"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-growth-blue/10">
                                    <TrendingUp className="h-7 w-7 text-growth-blue" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    하위 <CountUp to={3} duration={2} />% 미만
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500">
                                    같은 연령, 같은 성별의 평균 키를 기준으로 100명 중 앞에서 3번째 이하에 속하는 경우
                                </p>
                            </div>
                            <div className="rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-xl shadow-orange-900/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-growth-orange/10">
                                    <ActivitySquare className="h-7 w-7 text-growth-orange" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    연 <CountUp to={4} duration={2} />cm 이하 성장
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500">
                                    꾸준히 성장해야 할 시기에 연간 성장 속도가 4cm 이하로 현저히 떨어지는 경우
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════ Section 2: Checklist ═══════ */}
            <Section id="checklist" bg="bg-white">
                <SectionTitle
                    icon={ClipboardList}
                    title="혹시 우리 아이도 검사가 필요할까요?"
                    subtitle="다음 항목 중 하나라도 해당된다면 전문의와의 상담을 권장합니다."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {[
                        { icon: "📏", text: "성별/연령 표준치 평균보다 10cm 이상 작을 때" },
                        { icon: "🙋", text: "반 번호가 항상 1, 2, 3번을 못 벗어날 때" },
                        { icon: "📉", text: "1년에 키가 4~5cm 미만으로 자랄 때" },
                        { icon: "📊", text: "성장백분위수가 표준 평균치의 3% 이하일 때" },
                        { icon: "👨‍👩‍👦", text: "부모 키가 매우 작아 유전적 저신장이 우려될 때" },
                        { icon: "⚠️", text: "갑자기 성장 속도가 급격히 떨어질 때" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={scaleIn}
                            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:border-growth-blue/30 hover:bg-blue-50/50"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                                {item.icon}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{item.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>

            {/* ═══════ Section 3: Principle & Target ═══════ */}
            <Section id="principle" bg="bg-growth-bg">
                <SectionTitle
                    icon={Brain}
                    title="성장호르몬, 어떤 역할을 하나요?"
                    subtitle="단순히 키만 키우는 것이 아닌, 신체 전반의 건강한 발달을 돕습니다."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto max-w-4xl"
                >
                    {/* Explanation */}
                    <motion.div variants={fadeInUp} className="mb-10 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                        <div className="grid md:grid-cols-2 items-center">
                            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 bg-growth-blue text-white">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-growth-orange-light" />
                                    호르몬의 작용
                                </h3>
                                <p className="text-blue-100 leading-relaxed text-sm">
                                    뇌하수체 전엽에서 분비되는 성장호르몬은 간에서 IGF-1(인슐린 유사 성장인자)을
                                    생성시켜 뼈와 연골의 성장을 촉진합니다. 또한 체내 지방 분해와 단백질 합성을
                                    도와 근육 발달 등 신체가 튼튼하게 자라도록 돕는 핵심 물질입니다.
                                </p>
                            </div>
                            <div className="p-8 md:p-10">
                                <h4 className="font-bold text-gray-800 mb-4 text-lg">주요 치료 대상</h4>
                                <ul className="space-y-3">
                                    {[
                                        "성장호르몬 결핍증 (GHD)",
                                        "터너 증후군 / 프라더빌리 증후군",
                                        "부당경량아 (SGA) 및 만성신부전증",
                                        "특발성 저신장 (ISS - 원인 불명)"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 className="h-4 w-4 text-growth-orange shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </Section>

            {/* ═══════ Section 4: Safety & Monitoring ═══════ */}
            <Section id="safety" bg="bg-white">
                <SectionTitle
                    icon={ShieldCheck}
                    title="치료의 안전성, 꼼꼼하게 관리합니다"
                    subtitle="성장호르몬은 수십 년간 입증된 안전한 치료입니다."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto max-w-4xl"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <motion.div variants={scaleIn} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-8">
                            <ShieldCheck className="mb-4 h-8 w-8 text-growth-blue" />
                            <h3 className="mb-3 text-lg font-bold text-gray-900">장기적인 안전성 입증</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                1980년대 중반 유전자 재조합 성장호르몬이 개발된 이후, 전 세계적으로
                                안전성이 확인된 생체 호르몬과 동일한 구조의 약제를 사용합니다.
                            </p>
                        </motion.div>
                        <motion.div variants={scaleIn} className="rounded-2xl border border-orange-100 bg-orange-50/50 p-8">
                            <Activity className="mb-4 h-8 w-8 text-growth-orange" />
                            <h3 className="mb-3 text-lg font-bold text-gray-900">철저한 모니터링</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                혈당 상승이나 갑상선 기능 저하 등 만약의 부작용을 예방하기 위해
                                3~6개월 단위로 혈액 검사 및 신체 검진을 꼼꼼하게 진행합니다.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </Section>

            {/* ═══════ Section 5: Injection Guide ═══════ */}
            <Section id="injection" bg="bg-growth-bg">
                <SectionTitle
                    icon={Syringe}
                    title="집에서 하는 세심한 관리, 주사법 가이드"
                    subtitle="자동주사기로 통증은 덜고, 관리는 더 쉬워졌습니다."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto max-w-4xl bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                        {[
                            { title: "투여 시간", desc: "취침 전 (밤 10시 경)", sub: "성장호르몬 분비 주기에 맞춤" },
                            { title: "투여 빈도", desc: "주 6~7회", sub: "매일 꾸준히 투여 권장" },
                            { title: "투여 부위", desc: "피하 지방", sub: "복부, 팔, 허벅지, 엉덩이 순환" },
                            { title: "기기 특징", desc: "펜 타입 / 자동주사기", sub: "바늘이 얇아 통증 최소화" }
                        ].map((item, i) => (
                            <motion.div key={i} variants={scaleIn} className="pt-6 sm:pt-0 px-4 text-center">
                                <h4 className="text-sm font-bold text-growth-orange mb-2">{item.title}</h4>
                                <p className="text-lg font-bold text-gray-900 mb-1">{item.desc}</p>
                                <p className="text-xs text-gray-500">{item.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Section>

            {/* ═══════ Section 6: Process Timeline ═══════ */}
            <Section id="process" bg="bg-white">
                <SectionTitle
                    icon={Calendar}
                    title="진료 프로세스"
                    subtitle="체계적인 검사와 진단을 통해 최적의 치료 계획을 세웁니다."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto max-w-5xl"
                >
                    <div className="grid gap-4 md:grid-cols-5 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gray-100" />

                        {[
                            { icon: Stethoscope, title: "문진 및 신체계측", step: "1" },
                            { icon: TrendingUp, title: "표적키(MPH) 계산", step: "2" },
                            { icon: Bone, title: "골연령(X-ray) 측정", step: "3" },
                            { icon: Search, title: "정밀 검사 (혈액)", step: "4" },
                            { icon: ClipboardList, title: "맞춤형 치료 계획", step: "5" }
                        ].map((item, i) => (
                            <motion.div key={i} variants={scaleIn} className="relative z-10 text-center">
                                <div className="mx-auto flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-white bg-growth-bg shadow-sm mb-4 transition-transform hover:scale-110 hover:bg-growth-blue/5">
                                    <span className="text-growth-orange text-xs font-bold mb-1">STEP {item.step}</span>
                                    <item.icon className="h-6 w-6 text-growth-blue" />
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h4>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Section>

            {/* ═══════ FAQ Section ═══════ */}
            <Section id="faq" bg="bg-growth-bg">
                <SectionTitle
                    icon={HelpCircle}
                    title="자주 묻는 질문"
                    subtitle="보호자분들이 가장 많이 궁금해하시는 내용을 모았습니다."
                />
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl"
                >
                    <motion.div
                        variants={scaleIn}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
                    >
                        {faqData.map((faq, i) => (
                            <FAQItem key={i} q={faq.q} a={faq.a} />
                        ))}
                    </motion.div>
                </motion.div>
            </Section>

            {/* ═══════ CTA Section ═══════ */}
            <section className="bg-gradient-to-br from-growth-blue to-blue-800 py-20 relative overflow-hidden">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="relative mx-auto max-w-3xl px-6 text-center"
                >
                    <TrendingUp className="mx-auto mb-6 h-12 w-12 text-growth-orange-light" />
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                        우리아이 숨은 키 찾기, 지금 시작하세요
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-blue-100/90">
                        성장 치료는 정확한 시기가 수반되어야 최대 효과를 볼 수 있습니다.
                        궁금한 사항은 전문가와 상담하세요.
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <a
                            href="#"
                            className="flex items-center gap-2 rounded-2xl bg-growth-orange px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:bg-orange-600"
                        >
                            <Phone className="h-5 w-5" />
                            상담 예약하기
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-2 rounded-2xl border border-white/30 px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-white/10"
                        >
                            <PlayCircle className="h-5 w-5" />
                            주사법 동영상 보기
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-gray-100 bg-white py-8">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <p className="text-xs text-gray-400">
                        본 자료는 의료 전문가의 감수를 거쳐 제작되었으며, 진료 상담을 대체하지
                        않습니다.
                    </p>
                    <p className="mt-2 text-xs text-gray-300">
                        © 2025 저신장 클리닉. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
