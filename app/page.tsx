"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CountUp } from "./components/CountUp";
import {
  Brain,
  Search,
  AlertTriangle,
  ScanLine,
  Timer,
  ShieldCheck,
  Activity,
  ChevronDown,
  Phone,
  Heart,
  Bone,
  Syringe,
  TrendingDown,
  Sparkles,
  Users,
  ArrowDown,
  CircleDot,
  CheckCircle2,
  HelpCircle,
  Calendar,
  ClipboardList,
  Stethoscope,
  Baby,
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
  { href: "#definition", label: "성조숙증이란" },
  { href: "#diagnosis", label: "진단 검사" },
  { href: "#why-treat", label: "치료 이유" },
  { href: "#imaging", label: "정밀 검사" },
  { href: "#duration", label: "치료 기간" },
  { href: "#safety", label: "안전성" },
  { href: "#follow-up", label: "추적 관찰" },
  { href: "#faq", label: "FAQ" },
];

/* ─────────────── FAQ data ─────────────── */
const faqData = [
  {
    q: "성조숙증 치료를 시작하면 언제까지 맞아야 하나요?",
    a: "아이의 골연령과 성장 속도를 고려하여 개별적으로 결정합니다. 일반적으로 여아는 골연령 12세 전후, 남아는 골연령 13세 전후에 치료를 중단하면 최종 성인키에 가장 유리합니다.",
  },
  {
    q: "주사를 맞으면 키가 더 많이 크나요?",
    a: "GnRH 치료의 목표는 성장판이 빨리 닫히는 것을 방지하여 충분한 성장 기간을 확보하는 것입니다. 직접적으로 키를 크게 하는 것은 아니지만, 치료하지 않았을 때보다 최종 성인키가 더 클 것으로 기대됩니다.",
  },
  {
    q: "치료 중 부작용은 없나요?",
    a: "간혹 주사 부위에 멍이나 통증이 있을 수 있지만 대부분 일시적입니다. GnRH agonist는 전 세계적으로 40년 이상 사용되어 온 약제로, 장기적인 안전성이 충분히 입증되어 있습니다.",
  },
  {
    q: "치료를 중단하면 사춘기가 바로 시작되나요?",
    a: "치료를 중단하면 보통 6개월~1년 내에 사춘기가 자연스럽게 진행됩니다. 또래와 비슷한 시기에 사춘기를 겪을 수 있도록 중단 시점을 신중하게 결정합니다.",
  },
  {
    q: "남자아이도 성조숙증이 있나요?",
    a: "네, 남자아이에게도 성조숙증이 나타날 수 있습니다. 고환 크기가 4ml 이상으로 커지거나, 음모 발달, 여드름, 체취 등이 또래보다 빠르게 시작되면 검사가 필요합니다.",
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
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-deep-blue/10">
        <Icon className="h-7 w-7 text-deep-blue" />
      </div>
      <h2 className="text-2xl font-bold text-deep-blue md:text-3xl">{title}</h2>
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
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-deep-blue"
      >
        <div className="flex items-start gap-3 pr-4">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-deep-blue-light" />
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
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ─── Sticky Nav ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 font-bold text-deep-blue">
              <Heart className="h-6 w-6 text-coral" fill="currentColor" />
              <span className="text-lg tracking-tight whitespace-nowrap">성조숙증 클리닉</span>
            </a>
            {/* Main GNB for Page switching */}
            <div className="hidden lg:flex items-center gap-2 border-l border-gray-200 pl-6">
              <a href="/" className="px-3 py-1.5 text-sm font-bold text-deep-blue bg-deep-blue/10 rounded-full transition-colors">성조숙증 클리닉</a>
              <a href="/growth" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-growth-blue transition-colors">저신장 클리닉</a>
            </div>
          </div>
          <div className="hidden gap-1 xl:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-deep-blue/5 hover:text-deep-blue whitespace-nowrap"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════ Section 1: Hero + HPG Axis ═══════ */}
      <section
        id="definition"
        className="relative overflow-hidden bg-gradient-to-br from-deep-blue via-blue-800 to-blue-900 pb-20 pt-28 md:pb-32 md:pt-36"
      >
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-blue-mid/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-blue-mid/5" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-sky-200 backdrop-blur">
                보호자 설명 가이드
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl md:leading-tight">
                우리 아이의 건강한 성장,
                <br />
                <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                  성조숙증 바로 알기
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-blue-100/80 md:text-lg">
                성조숙증은 또래보다 사춘기가 이르게 시작되는 현상입니다. 적절한
                시기에 정확한 진단과 치료를 시작하면 건강한 성장을 도울 수
                있습니다.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/images/hero_cute_child.png"
                alt="Happy child measuring height"
                width={800}
                height={800}
                className="w-full rounded-3xl shadow-2xl object-cover aspect-video lg:aspect-square"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mx-auto mt-20 max-w-5xl"
          >
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:p-8">
              <h3 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
                성조숙증의 원인: <span className="text-sky-300">성장 지휘본부</span>의 조기 활성화
              </h3>
              <p className="mb-6 text-center text-sm leading-relaxed text-blue-100/90 md:text-base">
                <strong className="text-white">시상하부와 뇌하수체</strong>는 우리 몸의 <strong>'성장 지휘본부'</strong>입니다.<br className="hidden md:block" />
                이 지휘본부에서 일찍 <strong>'성장 스위치'</strong>(신호 전달)를 켜게 되면, <br className="hidden md:block" />
                남자는 고환, 여자는 난소에서 성호르몬이 조기에 분비되어 성조숙증이 시작됩니다.
              </p>
              <div className="mx-auto aspect-[4/3] max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl relative">
                <Image
                  src="/images/hpg_cute_axis_v2.png"
                  alt="HPG Axis Infographic - Growth Command Center"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Section 2: Diagnosis ═══════ */}
      <section id="diagnosis" className="bg-white py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Even Section: Left Image */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-last lg:order-first"
            >
              <Image
                src="/images/medical_cute_desk.png"
                alt="Pediatrician desk"
                width={800}
                height={800}
                className="w-full rounded-3xl shadow-xl object-cover aspect-video lg:aspect-square"
              />
            </motion.div>

            {/* Right Text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-10 text-left">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light/30">
                  <Search className="h-6 w-6 text-coral" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-deep-blue md:text-4xl">
                  정확한 진단을 위한 필수 검사
                </h2>
                <p className="text-lg text-gray-500">
                  단일 검사가 아닌, 여러 가지 평가를 종합하여 진단합니다.
                </p>
              </div>

              <div className="grid gap-6">
                <motion.div
                  variants={fadeInUp}
                  className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:bg-white"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <Bone className="h-6 w-6 text-deep-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">골연령 검사</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    왼손 엑스레이를 촬영하여 뼈의 성숙도를 확인합니다. 실제 나이보다 골연령이 앞서 있는지 정확히 평가합니다.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:bg-white"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <Syringe className="h-6 w-6 text-deep-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">GnRH 자극 검사</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    시간대별 호르몬 변화 수치(LH, FSH)를 측정, 진성 성조숙증 여부를 정확 판단합니다.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 3: Why Treat ═══════ */}
      <section id="why-treat" className="bg-slate-light py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Odd Section: Left Text (Checklist) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-10 text-left">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light/30">
                  <AlertTriangle className="h-6 w-6 text-coral" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-deep-blue md:text-4xl">
                  왜 조기에 치료해야 할까요?
                </h2>
                <p className="text-lg text-gray-500">
                  이런 증상이 보인다면 빠른 진단이 필요합니다.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: "🎀", label: "가슴 발달", gender: "여아" },
                  { icon: "🧬", label: "고환 크기 증가", gender: "남아" },
                  { icon: "👕", label: "머리 냄새 / 피지", gender: "공통" },
                  { icon: "🌿", label: "음모 발달", gender: "공통" },
                  { icon: "📏", label: "급격한 키 성장", gender: "공통" },
                  { icon: "🌋", label: "여드름", gender: "공통" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                      <span className="text-xs text-coral font-medium">{item.gender}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-6 text-sm text-coral font-semibold">
                ⚠️ 여아는 &quot;가슴 발달&quot;, 남아는 &quot;고환 크기 증가&quot;가 가장 중요한 신호입니다.
              </p>
            </motion.div>

            {/* Right: Risk Factor Boxes */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              {[
                {
                  icon: TrendingDown,
                  title: "최종 성인키 손실",
                  desc: "성장판 조기 폐쇄로 예상보다 5~10cm 작을 수 있습니다.",
                  color: "bg-red-50 text-red-500"
                },
                {
                  icon: Users,
                  title: "심리적 스트레스",
                  desc: "빠른 2차 성징으로 또래와 달라 사회적 어려움을 겪습니다.",
                  color: "bg-amber-50 text-amber-500"
                },
                {
                  icon: AlertTriangle,
                  title: "여성암 위험 증가",
                  desc: "여성 호르몬 노출 기간 증가로 관련 암 발병률이 상대적으로 높아집니다.",
                  color: "bg-rose-50 text-rose-500"
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group flex items-center gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${card.color}`}>
                    <card.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-gray-900">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 4: MRI / Ultrasound ═══════ */}
      <section id="imaging" className="bg-white py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Even: Left Visual Cards */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-last lg:order-first grid gap-6 sm:grid-cols-2"
            >
              <div className="rounded-3xl bg-blue-50/70 p-8 text-center transition-all hover:bg-blue-100/50">
                <Brain className="mx-auto mb-4 h-12 w-12 text-deep-blue" />
                <h3 className="mb-2 text-lg font-bold text-gray-900">뇌 MRI</h3>
                <p className="text-sm text-gray-600">시상하부 등 기질적 인자 확인</p>
              </div>
              <div className="rounded-3xl bg-sky-50/70 p-8 text-center sm:translate-y-6 transition-all hover:bg-sky-100/50">
                <Baby className="mx-auto mb-4 h-12 w-12 text-deep-blue" />
                <h3 className="mb-2 text-lg font-bold text-gray-900">골반 초음파</h3>
                <p className="text-sm text-gray-600">자궁 및 난소 성숙도 객관적 평가</p>
              </div>
            </motion.div>

            {/* Right Text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-6 text-left">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light/30">
                  <ScanLine className="h-6 w-6 text-coral" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-deep-blue md:text-4xl">
                  보이지 않는 원인까지 철저하게
                </h2>
                <p className="text-lg leading-relaxed text-gray-500">
                  드물지만 뇌하수체 종양이나 난소/부신 병변 등 기질적 원인이 있을 수 있습니다. 아이에게 꼭 필요한 맞춤형 진단과 치료 계획을 위해 안전하게 검사를 진행합니다.
                </p>
              </div>
              <div className="inline-flex rounded-xl bg-gray-50 px-5 py-3 text-sm font-medium text-gray-700">
                🛡️ 6세 미만 사춘기, 남아 성조숙증은 필수 검사 대상입니다.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 5: Treatment Duration ═══════ */}
      <section id="duration" className="bg-slate-light py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Odd: Left Text */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light/30">
                  <Timer className="h-6 w-6 text-coral" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-deep-blue md:text-4xl">
                  치료는 언제까지 하나요?
                </h2>
                <p className="text-lg leading-relaxed text-gray-500">
                  또래와 비슷한 시기에 사춘기를 맞이하도록 돕는 것이 가장 큰 목표입니다. 개별적인 성장 속도와 예상 성인키를 종합하여 여아는 골연령 12세, 남아는 13세 전후에 중단하는 것이 일반적입니다.
                </p>
              </div>
              <motion.p
                variants={fadeInUp}
                className="mt-4 text-sm text-gray-400"
              >
                ※ 정확한 치료 중단 시점은 전문의와 함께 성상태약속, 성장판 닫힘 정도를 기반으로 판단하게 됩니다.
              </motion.p>
            </motion.div>

            {/* Right: Timeline Step Bar */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              {/* Girl Step Bar */}
              <motion.div variants={scaleIn} className="rounded-3xl border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/50">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-pink-600"><span className="text-2xl">👧</span> 여아 기준</span>
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-rose-500">최적 효율 구간</span>
                </div>
                {/* Horizontal Step Bar */}
                <div className="relative flex w-full flex-col mt-4 mb-2">
                  <div className="absolute left-0 top-3 -z-10 h-2 w-full rounded-full bg-gray-100"></div>
                  <div className="absolute left-0 top-3 -z-10 h-2 w-1/2 rounded-full bg-gradient-to-r from-pink-300 to-pink-500"></div>

                  <div className="flex w-full justify-between items-start">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-4 border-white bg-pink-300 shadow"></div>
                      <span className="text-xs font-semibold text-gray-500">치료 시작</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-[-6px]">
                      <div className="h-6 w-6 rounded-full border-4 border-white bg-rose-500 shadow-lg"></div>
                      <span className="text-sm font-bold text-rose-600 text-center leading-tight">골연령<br /><CountUp to={12} duration={2} />세</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-4 border-white bg-gray-300 shadow"></div>
                      <span className="text-xs font-semibold text-gray-400">자연 사춘기</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Boy Step Bar */}
              <motion.div variants={scaleIn} className="rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/50">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-blue-600"><span className="text-2xl">👦</span> 남아 기준</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-500">최적 효율 구간</span>
                </div>
                {/* Horizontal Step Bar */}
                <div className="relative flex w-full flex-col mt-4 mb-2">
                  <div className="absolute left-0 top-3 -z-10 h-2 w-full rounded-full bg-gray-100"></div>
                  <div className="absolute left-0 top-3 -z-10 h-2 w-[60%] rounded-full bg-gradient-to-r from-blue-300 to-blue-500"></div>

                  <div className="flex w-full justify-between items-start">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-4 border-white bg-blue-300 shadow"></div>
                      <span className="text-xs font-semibold text-gray-500">치료 시작</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-[-6px] ml-4">
                      <div className="h-6 w-6 rounded-full border-4 border-white bg-blue-600 shadow-lg"></div>
                      <span className="text-sm font-bold text-blue-700 text-center leading-tight">골연령<br /><CountUp to={13} duration={2} />세</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-4 border-white bg-gray-300 shadow"></div>
                      <span className="text-xs font-semibold text-gray-400">자연 사춘기</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 6: Safety ═══════ */}
      <Section id="safety" bg="bg-white">
        <SectionTitle
          icon={ShieldCheck}
          title="치료제, 안심해도 될까요?"
          subtitle="GnRH agonist는 전 세계적으로 오랜 기간 검증된 안전한 약제입니다."
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
            className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 md:p-10"
          >
            <div className="grid gap-6">
              {[
                {
                  icon: CheckCircle2,
                  title: "40년 이상의 사용 역사",
                  desc: "전 세계적으로 수십 년간 수백만 명의 환자에게 사용되어 온 약제입니다.",
                },
                {
                  icon: CheckCircle2,
                  title: "가역적 치료",
                  desc: "치료를 중단하면 자연스럽게 사춘기가 진행됩니다. 영구적인 변화를 일으키지 않습니다.",
                },
                {
                  icon: CheckCircle2,
                  title: "장기 부작용 없음",
                  desc: "다수의 장기 추적 연구에서 특별한 장기적 부작용이 보고되지 않았습니다.",
                },
                {
                  icon: CheckCircle2,
                  title: "생식 기능 보존",
                  desc: "치료 후 생식 기능은 정상적으로 회복되며, 향후 임신과 출산에 영향을 주지 않습니다.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl bg-white/70 p-5">
                  <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════ Section 7: Follow-up ═══════ */}
      <Section id="follow-up" bg="bg-slate-light">
        <SectionTitle
          icon={Activity}
          title="치료 중에도 세심하게 관리합니다"
          subtitle="3~6개월 간격의 정기 검진으로 치료 효과를 모니터링합니다."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          {/* Process steps */}
          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Stethoscope,
                title: "신체 진찰",
                desc: "키, 체중, 2차 성징 진행도 확인",
                step: "01",
              },
              {
                icon: Bone,
                title: "골연령 검사",
                desc: "6~12개월마다 골연령 재평가",
                step: "02",
              },
              {
                icon: ClipboardList,
                title: "혈액 검사",
                desc: "호르몬 수치를 통한 억제 정도 확인",
                step: "03",
              },
              {
                icon: Calendar,
                title: "치료 조정",
                desc: "필요시 용량이나 투여 간격 조절",
                step: "04",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
              >
                <span className="absolute -top-3 left-4 rounded-full bg-deep-blue px-3 py-1 text-xs font-bold text-white">
                  {item.step}
                </span>
                <div className="mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <item.icon className="h-7 w-7 text-deep-blue" />
                </div>
                <h4 className="mb-2 font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-center text-sm text-amber-900">
              ⚡ 억제가 불충분한 경우 용량 변경이나 투여 간격 단축이 필요할 수
              있으며, 담당 의사와 상의하여 최적의 치료 계획을 조정합니다.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════ FAQ Section ═══════ */}
      <Section id="faq" bg="bg-white">
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
      <section className="bg-gradient-to-br from-deep-blue via-blue-800 to-blue-900 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <Heart className="mx-auto mb-6 h-12 w-12 text-sky-300" />
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            아이의 건강한 성장, 함께 지켜드리겠습니다
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100/80">
            궁금한 사항이 있으시거나 상담이 필요하시면 언제든지 문의해 주세요.
            전문 의료진이 친절하게 안내해 드립니다.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="tel:02-000-0000"
              className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-deep-blue shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Phone className="h-5 w-5" />
              전화 상담
            </a>
            <a
              href="#definition"
              className="flex items-center gap-2 rounded-2xl border border-white/30 px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-white/10"
            >
              처음부터 다시 보기
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
            © 2025 성조숙증 보호자 가이드. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
