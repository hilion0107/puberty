"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Smile,
    ShieldCheck,
    Phone,
    ArrowRight,
    Puzzle,
    MessageCircle,
    Activity,
    Brain,
    Star,
    Stethoscope,
    Calendar,
    ClipboardList,
    RefreshCw,
    Award
} from "lucide-react";
import Image from "next/image";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};



export default function DevelopmentClinic() {
    return (
        <div className="min-h-screen bg-dev-beige font-pretendard text-gray-800">
            {/* ═══════ Navigation ═══════ */}


            {/* ═══════ Section 1: Hero (도입 및 중요성) ═══════ */}
            <section id="intro" className="relative overflow-hidden bg-dev-beige pb-20 pt-28 md:pb-32 md:pt-36">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.span variants={fadeInUp} className="mb-4 inline-block rounded-full bg-dev-wood/20 px-4 py-1.5 text-sm font-semibold text-dev-wood-dark">
                                조기 발견이 아이의 미래를 바꿉니다
                            </motion.span>
                            <motion.h1 variants={fadeInUp} className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                                건강한 일상을 회복하는
                                <br />
                                <span className="text-dev-wood-dark">우리 아이 놀이터</span>
                            </motion.h1>
                            <motion.div variants={fadeInUp} className="mt-6 border-l-4 border-dev-wood pl-4">
                                <p className="text-lg leading-relaxed text-gray-600 font-medium">
                                    만 0~3세는 뇌가 가장 빠르게 발달하는 <span className="text-dev-wood-dark font-bold">결정적 시기(골든타임)</span>입니다.
                                </p>
                                <p className="mt-2 text-base leading-relaxed text-gray-500">
                                    이 시기에 발달 지연을 조기에 발견하고 집중적인 치료를 실시하면,
                                    아이가 가진 잠재력을 극대화하고 손상된 부분을 회복시켜 2차 장애 발생을 예방할 수 있습니다.
                                </p>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={scaleIn}
                            className="relative mx-auto w-full max-w-md aspect-[4/5]"
                        >
                            {/* Arch frame using CSS border-radius */}
                            <div className="absolute inset-0 rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                                <Image
                                    src="/images/dev_hero_warm_interaction.png"
                                    alt="Mother and child smiling warmly"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════ Section 2: 자가진단표 ═══════ */}
            <section id="checklist" className="bg-white py-20 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            우리 아이, 발달 지연을 의심해야 할까요?
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            다음 항목 중 해당되는 것이 있다면 편안하게 상담을 받아보세요.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Card 1 */}
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-3xl bg-dev-beige p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                    <MessageCircle className="h-6 w-6 text-dev-wood-dark" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">언어 발달 지연</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2"><span className="text-dev-wood-dark mt-1">•</span> 10~12개월에 옹알이가 없고 단어 산출이 전혀 안 되는 경우</li>
                                <li className="flex items-start gap-2"><span className="text-dev-wood-dark mt-1">•</span> 18개월이 되어도 말보다 몸짓으로만 의사표현을 하는 경우</li>
                                <li className="flex items-start gap-2"><span className="text-dev-wood-dark mt-1">•</span> 24개월 전후로 두 단어 연결("우유 줘")이 안 되는 아이</li>
                            </ul>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-3xl bg-[#f5fcf8] p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                    <Puzzle className="h-6 w-6 text-dev-green" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">감각통합 이상</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2"><span className="text-dev-green mt-1">•</span> 촉각, 시각, 청각 등 특정 감각에 지나치게 예민한 경우</li>
                                <li className="flex items-start gap-2"><span className="text-dev-green mt-1">•</span> 특정 소리에 귀를 막거나, 옷의 택(tag)을 극도로 싫어하는 경우</li>
                                <li className="flex items-start gap-2"><span className="text-dev-green mt-1">•</span> 자주 넘어지고 물건을 잘 떨어뜨리며 움직임이 둔한 경우</li>
                            </ul>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-3xl bg-[#f5f9ff] p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                    <Smile className="h-6 w-6 text-dev-blue" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">사회성 및 상호작용 지연</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2"><span className="text-dev-blue mt-1">•</span> 눈 맞춤이 안 되고 호명 반응(불러도 대답 없음)이 약한 경우</li>
                                <li className="flex items-start gap-2"><span className="text-dev-blue mt-1">•</span> 또래나 타인에게 관심이 없고 혼자 노는 것을 선호하는 아이</li>
                                <li className="flex items-start gap-2"><span className="text-dev-blue mt-1">•</span> 특정 사물(바퀴 등)에 과도하게 집착하거나 상동행동을 보이는 아이</li>
                            </ul>
                        </motion.div>

                        {/* Card 4 */}
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-3xl bg-[#fff8f5] p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                    <Activity className="h-6 w-6 text-coral" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">전반적 발달 지연</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2"><span className="text-coral mt-1">•</span> 또래에 비해 대근육(걷기, 뛰기 등) 발달이 확연히 늦은 경우</li>
                                <li className="flex items-start gap-2"><span className="text-coral mt-1">•</span> 소근육(블록 쌓기, 숟가락질 등) 조작이 서투른 경우</li>
                                <li className="flex items-start gap-2"><span className="text-coral mt-1">•</span> 다방면에서 유의미하게 느린 발달 양상을 보이는 아이</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════ Section 3: 검사 안내 ═══════ */}
            <section id="test" className="bg-dev-beige py-20 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <motion.div
                            variants={scaleIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative mx-auto w-full max-w-md aspect-square lg:order-last"
                        >
                            {/* Circular frame */}
                            <div className="absolute inset-0 rounded-full overflow-hidden shadow-xl border-8 border-white bg-white">
                                <Image
                                    src="/images/dev_growth_sprout_olive.png"
                                    alt="Child touching a small sprout"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                전문적이고 체계적인<br />검사 프로그램
                            </h2>
                            <p className="mb-10 text-lg text-gray-600">
                                아이의 현재 수준을 정확히 파악하기 위한 과학적인 평가 도구들을 사용합니다.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                                        <MessageCircle className="h-5 w-5 text-dev-wood-dark" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">언어 발달 검사</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>SELSI</strong> (생후 5~36개월 영유아 언어발달), <strong>PRES</strong> (만 2~6세 취학 전 아동 언어발달), <strong>REVT</strong> (어휘력 검사), 구문의미이해력검사 등을 통해 수용 및 표현 언어 능력을 심층 평가합니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                                        <Puzzle className="h-5 w-5 text-dev-green" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">감각통합 평가</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            아동이 전정감각, 고유수용성 감각, 촉각 등의 감각 자극을 어떻게 처리하고 조절하는지, 운동 계획과 실행 능력에 문제가 없는지 평가합니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                                        <Brain className="h-5 w-5 text-dev-blue" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">영유아 발달 검사</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>K-DST</strong> (6개 영역 발달선별검사) 및 <strong>베일리 영유아 발달검사(Bayley Scales)</strong>를 통해 인지, 언어, 운동, 사회정서 등 전반적인 발달 상태를 심층적으로 진단하는 표준 검사입니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════ Section 4: 치료 프로그램 ═══════ */}
            <section id="treatment" className="bg-white py-20 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            우리 아이 맞춤형 치료 프로그램
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            안전하고 편안한 공간에서 각 분야 전문가와 함께합니다.
                        </p>
                    </motion.div>

                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* 언어 치료 */}
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group overflow-hidden rounded-[2.5rem] bg-dev-beige hover:shadow-lg transition-shadow">
                            <div className="relative h-64 w-full bg-dev-wood/10 p-6 flex items-center justify-center">
                                <div className="absolute inset-x-8 -top-12 bottom-0 rounded-t-full overflow-hidden shadow-lg border-4 border-white">
                                    <Image
                                        src="/images/dev_language_therapy.png"
                                        alt="Child and therapist interacting in a warm playroom"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <MessageCircle className="h-6 w-6 text-dev-wood-dark" /> 언어 치료
                                </h3>
                                <div className="mb-4">
                                    <h4 className="text-sm font-bold text-dev-wood-dark">적용 대상</h4>
                                    <p className="text-sm text-gray-600 mt-1">말이 늦게 트이는 아이, 발음이 부정확한 아이, 반향어 등 상황에 맞지 않는 말을 하거나 상호작용 의사소통에 어려움을 겪는 아이</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-dev-wood-dark">기대 효과</h4>
                                    <p className="text-sm text-gray-600 mt-1">어휘력 및 문장 표현력 향상, 수용언어 증진, 또래와의 원활한 상호작용 및 화용 능력 발달 지원</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* 감각통합 치료 */}
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group overflow-hidden rounded-[2.5rem] bg-[#f5fcf8] hover:shadow-lg transition-shadow">
                            <div className="relative h-64 w-full bg-dev-green/10 p-6 flex items-center justify-center">
                                <div className="absolute inset-x-8 -bottom-12 top-8 rounded-b-full overflow-hidden shadow-lg border-4 border-white">
                                    <Image
                                        src="/images/dev_playroom_wooden_toys.png" // Reusing or you can ask for a 4th image, but the prompt asked for 3. Using playroom again for consistency as it fits "safe toys".
                                        alt="Safe playroom environment"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Puzzle className="h-6 w-6 text-dev-green" /> 감각통합 치료
                                </h3>
                                <div className="mb-4">
                                    <h4 className="text-sm font-bold text-dev-green">적용 대상</h4>
                                    <p className="text-sm text-gray-600 mt-1">신체 접촉을 피하거나 무기력한 아이, 활동량이 과도한 아이, 소/대근육 사용이 서툰 아이</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-dev-green">기대 효과</h4>
                                    <p className="text-sm text-gray-600 mt-1">구조화된 환경 내 감각 자극을 통해 뇌의 정보처리 기능 조직화, 중추신경계 반응 향상으로 자기 조절력 및 일상 적응력 증대</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════ Section 5: 원스톱 진료/치료 프로세스 ═══════ */}
            <section id="process" className="bg-dev-beige/30 py-20 md:py-32 relative overflow-hidden">
                <div className="mx-auto max-w-5xl px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            상담부터 치료, 일상 회복까지
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            소아청소년과 전문의와 발달 전문가가 함께하는 <br className="md:hidden" /><span className="font-bold text-dev-wood-dark">6단계 원스톱 케어 시스템</span>
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Wavy/Curved background line (CSS visual line) */}
                        <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-dev-wood/40 via-dev-green/40 to-dev-wood-dark/40 md:-translate-x-1/2 rounded-full"></div>

                        <div className="space-y-12">
                            {[
                                {
                                    step: 1, icon: MessageCircle, color: "text-dev-wood-dark", border: "border-dev-wood-dark", bg: "bg-white", bubble: "border-r-white", bubbleMobile: "border-r-white",
                                    title: "문의 및 예약 (상담)", desc: "부모님의 고민을 먼저 듣고, 가장 빠르고 편안한 진료 일정을 안내해 드립니다."
                                },
                                {
                                    step: 2, icon: Stethoscope, color: "text-growth-orange", border: "border-growth-orange", bg: "bg-[#fff8f5]", bubble: "border-l-[#fff8f5]", bubbleMobile: "border-r-[#fff8f5]",
                                    title: "소아청소년과 전문의 진료", desc: "소아청소년과 전문의가 아이의 전반적인 건강 상태와 발달 지연 여부를 의학적으로 꼼꼼하게 통합 진찰합니다.", highlight: true
                                },
                                {
                                    step: 3, icon: ClipboardList, color: "text-dev-green", border: "border-dev-green", bg: "bg-white", bubble: "border-r-white", bubbleMobile: "border-r-white",
                                    title: "맞춤형 발달 검사 진행", desc: "언어, 감각통합, 인지, 심리 등 영역별로 전문가들이 표준화된 심층 평가를 진행합니다."
                                },
                                {
                                    step: 4, icon: Brain, color: "text-deep-blue", border: "border-deep-blue", bg: "bg-blue-50/50", bubble: "border-l-blue-50/50", bubbleMobile: "border-r-blue-50/50",
                                    title: "치료 계획 수립 및 보호자 코칭", desc: "검사 결과를 바탕으로 1:1 맞춤 치료 계획을 세우며, 가정 내 연계가 가능하도록 보호자 코칭을 함께 진행합니다.", highlight: true
                                },
                                {
                                    step: 5, icon: RefreshCw, color: "text-dev-wood-dark", border: "border-dev-wood-dark", bg: "bg-white", bubble: "border-r-white", bubbleMobile: "border-r-white",
                                    title: "치료 중간 평가", desc: "주기적인 발달 경과 확인을 통해 긍정적인 변화를 살피고, 성장 속도에 맞춰 다음 방향을 재조정합니다."
                                },
                                {
                                    step: 6, icon: Award, color: "text-dev-wood-dark", border: "border-dev-wood-dark", bg: "bg-dev-wood/10", bubble: "border-l-dev-wood/10", bubbleMobile: "border-r-dev-wood/10",
                                    title: "치료 종료 및 사후 관리", desc: "목표한 발달 단계에 도달하여 치료를 마무리하며, 건강한 일상에 잘 적응하도록 지속적으로 응원합니다."
                                }
                            ].map((item, index) => {
                                const isEven = index % 2 === 1;
                                return (
                                    <motion.div key={item.step} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between group ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="hidden md:block w-full md:w-[45%]"></div>
                                        {/* Center Icon */}
                                        <div className={`absolute left-0 md:left-1/2 w-16 h-16 bg-white border-4 ${item.border} rounded-full flex items-center justify-center -translate-x-[6px] md:-translate-x-1/2 shadow-lg z-10 transition-transform group-hover:scale-110`}>
                                            <item.icon className={`h-7 w-7 ${item.color}`} />
                                        </div>
                                        {/* Card Box */}
                                        <div className={`w-full md:w-[45%] pl-20 ${isEven ? 'md:pl-0 md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                                            <div className={`${item.bg} rounded-3xl p-6 shadow-sm group-hover:shadow-md transition-shadow relative border border-gray-100`}>
                                                {/* Desktop Triangle */}
                                                <div className={`absolute top-6 ${isEven ? '-right-3 border-l-[12px] border-l-inherit border-r-0' : '-left-3 border-r-[12px] border-r-inherit border-l-0'} w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent drop-shadow-sm hidden md:block ${item.bubble.split(' ')[0]}`}></div>
                                                {/* Mobile Triangle */}
                                                <div className={`absolute top-6 -left-3 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-inherit border-b-[10px] border-b-transparent drop-shadow-sm md:hidden block ${item.bubbleMobile.split(' ')[0]}`}></div>

                                                <span className={`text-xs font-black tracking-widest uppercase mb-1 block ${item.color}`}>STEP {item.step}</span>
                                                <h3 className={`text-xl font-bold mb-2 ${item.highlight ? item.color : 'text-gray-900'}`}>{item.title}</h3>
                                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ CTA / Footer ═══════ */}
            <section className="bg-dev-wood-dark py-20 text-white md:py-32">
                <div className="mx-auto max-w-4xl text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <ShieldCheck className="mx-auto mb-6 h-16 w-16 text-dev-wood" />
                        <h2 className="mb-6 text-3xl font-bold md:text-5xl leading-tight">
                            우리 아이 발달,
                            <br />더 이상 혼자 고민하지 마세요.
                        </h2>
                        <p className="mb-10 text-lg text-dev-wood">
                            아이의 작은 변화를 위한 첫걸음, 전문가와 함께 시작하세요.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                href="https://short.ddocdoc.com/m8eeg5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 font-bold text-dev-wood-dark shadow-lg border-4 border-[#ac7b53] transition-transform hover:scale-105"
                            >
                                <Image src="/images/ddocdoc.png" alt="똑닥" width={20} height={20} className="rounded-md" />
                                초기 평가 예약하기
                            </a>
                            <a
                                href="http://pf.kakao.com/_xczQUG"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-8 font-bold text-white transition-colors hover:bg-white/20"
                            >
                                <MessageCircle className="h-5 w-5" />
                                카카오채널 간편 상담
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
