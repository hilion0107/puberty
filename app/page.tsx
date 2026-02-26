"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  hidden: { opacity: 0, y: 40 },
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
          <a href="#" className="flex items-center gap-2 font-bold text-deep-blue">
            <Heart className="h-6 w-6 text-coral" fill="currentColor" />
            <span className="text-lg tracking-tight">성조숙증 가이드</span>
          </a>
          <div className="hidden gap-1 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-deep-blue/5 hover:text-deep-blue"
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
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-blue-mid/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-blue-mid/5" />

        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
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
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-blue-100/80 md:text-lg">
              성조숙증은 또래보다 사춘기가 이르게 시작되는 현상입니다. 적절한
              시기에 정확한 진단과 치료를 시작하면 아이의 건강한 성장을 도울 수
              있습니다.
            </p>
          </motion.div>

          {/* HPG Axis Infographic */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mx-auto mt-16 max-w-3xl"
          >
            <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md md:p-12">
              <h3 className="mb-8 text-center text-lg font-bold text-white">
                시상하부-뇌하수체-생식샘 축 (HPG Axis)
              </h3>

              {/* Flow */}
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-0">
                {/* Brain */}
                <div className="flex flex-col items-center">
                  <div className="animate-signal flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/30">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-purple-200">
                    시상하부
                  </span>
                  <span className="text-xs text-purple-300/70">GnRH 분비</span>
                </div>

                {/* Arrow */}
                <div className="flex items-center md:mx-4">
                  <div className="flex h-8 flex-col items-center md:h-auto md:flex-row">
                    <div className="flex flex-col items-center gap-1 md:flex-row">
                      <CircleDot className="animate-pulse-dot h-3 w-3 text-sky-300" />
                      <CircleDot className="animate-pulse-dot h-3 w-3 text-sky-300" style={{ animationDelay: "0.3s" }} />
                      <CircleDot className="animate-pulse-dot h-3 w-3 text-sky-300" style={{ animationDelay: "0.6s" }} />
                      <ArrowDown className="h-5 w-5 text-sky-300 md:-rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Pituitary */}
                <div className="flex flex-col items-center">
                  <div className="animate-signal-delay-1 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-blue-200">
                    뇌하수체
                  </span>
                  <span className="text-xs text-blue-300/70">LH / FSH 분비</span>
                </div>

                {/* Arrow */}
                <div className="flex items-center md:mx-4">
                  <div className="flex h-8 flex-col items-center md:h-auto md:flex-row">
                    <div className="flex flex-col items-center gap-1 md:flex-row">
                      <CircleDot className="animate-pulse-dot h-3 w-3 text-cyan-300" />
                      <CircleDot className="animate-pulse-dot h-3 w-3 text-cyan-300" style={{ animationDelay: "0.3s" }} />
                      <CircleDot className="animate-pulse-dot h-3 w-3 text-cyan-300" style={{ animationDelay: "0.6s" }} />
                      <ArrowDown className="h-5 w-5 text-cyan-300 md:-rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Gonads */}
                <div className="flex flex-col items-center">
                  <div className="animate-signal-delay-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-rose-500/30">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <span className="mt-2 text-sm font-semibold text-pink-200">
                    생식샘
                  </span>
                  <span className="text-xs text-pink-300/70">
                    성호르몬 분비
                  </span>
                </div>
              </div>

              <p className="mt-8 text-center text-sm leading-relaxed text-blue-100/70">
                성조숙증은 이 축이{" "}
                <strong className="text-white">또래보다 일찍 활성화</strong>되어
                8세(여아) 또는 9세(남아) 이전에 2차 성징이 나타나는 상태입니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Section 2: Diagnosis ═══════ */}
      <Section id="diagnosis" bg="bg-white">
        <SectionTitle
          icon={Search}
          title="정확한 진단을 위한 필수 검사"
          subtitle="성조숙증의 진단은 단일 검사가 아닌, 여러 가지 평가를 종합하여 결정됩니다."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2"
        >
          {/* Card 1 - Bone Age */}
          <motion.div
            variants={scaleIn}
            className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Bone className="h-7 w-7 text-deep-blue" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">골연령 검사</h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              왼손 엑스레이(X-ray)를 촬영하여 뼈의 성숙도를 확인합니다. 실제
              나이보다 골연령이 많이 앞서 있다면 성장판이 일찍 닫힐 수 있어
              적극적인 관리가 필요합니다.
            </p>
            <div className="rounded-xl bg-sky-blue/50 p-4">
              <p className="text-sm font-medium text-deep-blue">
                💡 골연령이 실제 나이보다 1년 이상 앞서 있으면 주의가 필요합니다.
              </p>
            </div>
          </motion.div>

          {/* Card 2 - GnRH Stimulation Test */}
          <motion.div
            variants={scaleIn}
            className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Syringe className="h-7 w-7 text-deep-blue" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              성조숙증 자극 검사 (GnRH 자극 검사)
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              GnRH(성선자극호르몬 방출호르몬)를 투여한 후 시간대별로 혈액을
              채취하여 LH, FSH 호르몬의 반응 수치를 측정합니다. 이 검사를 통해
              진성 성조숙증 여부를 정확하게 판단합니다.
            </p>
            <div className="rounded-xl bg-sky-blue/50 p-4">
              <p className="text-sm font-medium text-deep-blue">
                💡 LH 최고치가 기준 이상이면 진성 성조숙증으로 진단합니다.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════ Section 3: Why Treat ═══════ */}
      <Section id="why-treat" bg="bg-slate-light">
        <SectionTitle
          icon={AlertTriangle}
          title="왜 조기에 치료해야 할까요?"
          subtitle="치료 없이 방치하면 다음과 같은 문제가 발생할 수 있습니다."
        />

        {/* 2차 성징 체크리스트 */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14"
        >
          <h3 className="mb-6 text-center text-lg font-bold text-gray-800">
            🔍 이런 증상이 보이나요? — 2차 성징 체크리스트
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🎀",
                label: "가슴 멍울 / 발달",
                desc: "여아에서 가장 먼저 나타나는 신호",
                highlight: true,
                gender: "여아",
              },
              {
                icon: "🧬",
                label: "고환 크기 증가",
                desc: "남아에서 가장 먼저 나타나는 신호",
                highlight: true,
                gender: "남아",
              },
              {
                icon: "👕",
                label: "머리 냄새 / 기름기",
                desc: "피지 분비 증가로 인한 체취 변화",
                highlight: false,
                gender: "공통",
              },
              {
                icon: "🌋",
                label: "여드름",
                desc: "호르몬 변화로 인한 피부 변화",
                highlight: false,
                gender: "공통",
              },
              {
                icon: "🌿",
                label: "음모 / 겨드랑이 털",
                desc: "체모가 또래보다 빠르게 발달",
                highlight: false,
                gender: "공통",
              },
              {
                icon: "📏",
                label: "급격한 키 성장",
                desc: "일시적이나 성장판 조기 폐쇄 위험",
                highlight: false,
                gender: "공통",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className={`flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${item.highlight
                  ? "border-coral/30 bg-coral-light"
                  : "border-gray-100 bg-white"
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-bold text-gray-800">{item.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.gender === "여아"
                        ? "bg-pink-100 text-pink-700"
                        : item.gender === "남아"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {item.gender}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-coral font-semibold">
            ⚠️ 여아는 &quot;가슴 발달&quot;, 남아는 &quot;고환 크기 증가&quot;가 가장 중요한 첫 번째 신호입니다.
          </p>
        </motion.div>

        {/* 3 Risk Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {[
            {
              icon: TrendingDown,
              title: "최종 성인키 손실",
              desc: "성장판이 일찍 닫혀 충분히 자랄 시간이 부족해집니다. 치료하지 않으면 예상보다 5~10cm 이상 작을 수 있습니다.",
              color: "from-red-500 to-rose-600",
              bg: "bg-red-50",
            },
            {
              icon: Users,
              title: "빠른 2차 성징",
              desc: "또래보다 빠른 신체 변화로 인해 아이가 심리적 스트레스를 받을 수 있으며, 사회적 적응에 어려움을 겪을 수 있습니다.",
              color: "from-amber-500 to-orange-600",
              bg: "bg-amber-50",
            },
            {
              icon: AlertTriangle,
              title: "여성암 위험 증가 (여아)",
              desc: "여성 호르몬에 노출되는 기간이 길어져 유방암 등 호르몬 관련 암의 발생 위험이 상대적으로 높아질 수 있습니다.",
              color: "from-red-600 to-red-700",
              bg: "bg-red-50",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
              >
                <card.icon className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════ Section 4: MRI / Ultrasound ═══════ */}
      <Section id="imaging" bg="bg-white">
        <SectionTitle
          icon={ScanLine}
          title="보이지 않는 원인까지 철저하게 확인합니다"
          subtitle="드물지만 존재할 수 있는 기질적 원인을 배제하기 위한 필수 검사입니다."
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
            className="rounded-3xl border border-blue-100 bg-gradient-to-br from-sky-blue/40 to-blue-50 p-8 md:p-10"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue/10">
                  <Brain className="h-6 w-6 text-deep-blue" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">뇌 MRI</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  시상하부나 뇌하수체 주변의 종양 여부를 확인합니다. 특히 6세
                  미만에서 사춘기가 시작된 경우나 남아의 경우 반드시 시행합니다.
                </p>
              </div>
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue/10">
                  <Baby className="h-6 w-6 text-deep-blue" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  복부 / 골반 초음파
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  난소나 부신의 종양 여부를 확인합니다. 자궁과 난소의 크기 변화도
                  함께 평가하여 사춘기 진행 정도를 객관적으로 판단합니다.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-white/70 p-4">
              <p className="text-center text-sm font-medium text-deep-blue">
                🛡️ 이 검사들은 안전하며, 원인을 정확히 파악하여 최적의 치료
                계획을 세우기 위한 중요한 과정입니다.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════ Section 5: Treatment Duration (Timeline) ═══════ */}
      <Section id="duration" bg="bg-slate-light">
        <SectionTitle
          icon={Timer}
          title="언제까지 치료를 진행하나요?"
          subtitle="또래와 비슷한 시기에 사춘기를 맞이하도록 돕는 것이 치료의 목표입니다."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          {/* Timeline */}
          <motion.div variants={scaleIn} className="relative">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Girl */}
              <div className="rounded-2xl border border-pink-100 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                    <span className="text-2xl">👧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">여자 아이</h3>
                    <p className="text-sm text-pink-500">골연령 기준</p>
                  </div>
                </div>
                {/* Timeline bar */}
                <div className="my-6">
                  <div className="relative h-3 rounded-full bg-pink-100">
                    <div className="absolute left-0 top-0 h-full w-3/4 rounded-full bg-gradient-to-r from-pink-400 to-rose-400" />
                    <div className="absolute -top-1 right-1/4 h-5 w-5 rounded-full border-2 border-white bg-rose-500 shadow-lg" />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-400">
                    <span>치료 시작</span>
                    <span className="font-bold text-rose-600">골연령 12세</span>
                    <span>사춘기 진행</span>
                  </div>
                </div>
                <div className="rounded-xl bg-pink-50 p-4">
                  <p className="text-center text-sm font-semibold text-rose-700">
                    골연령 12세 전후 치료 중단 시<br />
                    <span className="text-base">최종 성인키 예후 가장 우수</span>
                  </p>
                </div>
              </div>

              {/* Boy */}
              <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-2xl">👦</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">남자 아이</h3>
                    <p className="text-sm text-blue-500">골연령 기준</p>
                  </div>
                </div>
                {/* Timeline bar */}
                <div className="my-6">
                  <div className="relative h-3 rounded-full bg-blue-100">
                    <div className="absolute left-0 top-0 h-full w-3/4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                    <div className="absolute -top-1 right-1/4 h-5 w-5 rounded-full border-2 border-white bg-blue-600 shadow-lg" />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-400">
                    <span>치료 시작</span>
                    <span className="font-bold text-blue-700">골연령 13세</span>
                    <span>사춘기 진행</span>
                  </div>
                </div>
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-center text-sm font-semibold text-blue-800">
                    골연령 13세 전후 치료 중단 시<br />
                    <span className="text-base">최종 성인키 예후 가장 우수</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mt-8 text-center text-sm text-gray-500"
          >
            ※ 치료 중단 시점은 아이의 성장 속도, 2차 성징 진행도, 예측 성인키
            등을 종합적으로 고려하여 개별적으로 결정합니다.
          </motion.p>
        </motion.div>
      </Section>

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
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
