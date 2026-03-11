"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, ChevronRight, ChevronLeft, CheckCircle2,
    ClipboardList, Heart, Brain, Wind, AlertCircle, Ruler, Weight,
    Baby, Shield, Stethoscope, Activity, Edit2, FilePlus2, PartyPopper
} from "lucide-react";

/* ─────────────── 애니메이션 ─────────────── */
const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

/* ─────────────── 증상 체크리스트 ─────────────── */
const symptomList = [
    "급격한 키성장", "급격한 체중 증가", "음모", "겨드랑이 털",
    "머릿내", "기름진 얼굴 또는 여드름", "공격적 행동 또는 반항",
    "유즙분비", "커피색 반점", "척추측만증", "잦은 두통",
    "구토", "시야 장애", "다음/다뇨", "심한변비", "자주 넘어짐",
];

/* ─────────────── 카테고리 데이터 ─────────────── */
const categories = [
    { id: "growth", label: "성장 문진표", icon: Ruler, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", iconColor: "text-blue-600", description: "키, 몸무게, 출생 정보 및 성장 관련 문진" },
    { id: "development", label: "발달 문진표", icon: Brain, color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-50", iconColor: "text-emerald-600", description: "아이의 발달 상태 평가 문진" },
    { id: "allergy", label: "알레르기 비염 문진표", icon: Wind, color: "from-amber-500 to-orange-600", bgColor: "bg-amber-50", iconColor: "text-amber-600", description: "알레르기 및 비염 증상 평가 문진" },
    { id: "constipation", label: "변비 문진표", icon: Activity, color: "from-rose-500 to-pink-600", bgColor: "bg-rose-50", iconColor: "text-rose-600", description: "소화 및 배변 습관 평가 문진" },
];

/* ─────────────── 개인정보 동의서 본문 ─────────────── */
const privacyText = `[개인정보 수집 및 이용 동의서]

1. 수집하는 개인정보 항목
  - 이름, 성별, 생년월일, 건강 관련 문진 응답 내용

2. 개인정보의 수집 및 이용 목적
  - 진료 전 사전 문진 및 환자 상태 파악
  - 정확한 진료 및 맞춤 의료 서비스 제공
  - 진료 기록 관리 및 보관

3. 개인정보의 보유 및 이용 기간
  - 수집일로부터 3년간 보유 후 파기
  - 단, 의료법에 따른 보존 의무가 있는 경우 해당 기간까지 보관

4. 동의를 거부할 권리 및 거부 시 불이익
  - 위 개인정보 수집에 대한 동의를 거부하실 수 있으나, 거부 시 사전 문진표 작성이 불가합니다.

※ 본 동의서는 우리들소아청소년과의원 진료 목적으로만 사용됩니다.`;

export default function QuestionnairePage() {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submittedId, setSubmittedId] = useState<number | null>(null); // 제출된 문진표 ID

    // Step 1: 기본 정보
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [privacyConsent, setPrivacyConsent] = useState(false);

    // Step 2: 카테고리
    const [category, setCategory] = useState("");

    // Step 3: 성장 문진표 응답
    const [responses, setResponses] = useState({
        height: "",
        weight: "",
        birthWeeks: "",
        birthDays: "",
        birthWeight: "",
        birthHeight: "",
        birthHeadCircumference: "",
        deliveryMethod: "",
        breechDelivery: "",
        nicuHistory: "",
        nicuReason: "",
        familyHistory: "",
        familyDisease: "",
        motherHeight: "",
        motherWeight: "",
        fatherHeight: "",
        fatherWeight: "",
        motherMenarche: "",
        motherShortHeight: "",
        motherThin: "",
        fatherShortHeight: "",
        fatherThin: "",
        pubertySigns: "",
        symptoms: [] as string[],
        diagnosedDiseases: "",
        // 알레르기 비염 문진표 추가 항목
        allergy_duration_days: "",
        allergy_duration_weeks: "",
        allergy_sleep: "",
        allergy_daily_life: "",
        allergy_work_school: "",
        allergy_troublesome: "",
        allergy_vas: "0",
        tnss_congestion: "",
        tnss_runny_nose: "",
        tnss_itching: "",
        tnss_sneezing: "",
        allergy_eye_symptom: "",
    });

    const updateResponse = (key: string, value: string | string[]) => {
        setResponses((prev) => ({ ...prev, [key]: value }));
    };

    const toggleSymptom = (symptom: string) => {
        setResponses((prev) => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter((s) => s !== symptom)
                : [...prev.symptoms, symptom],
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
        try {
            const isEdit = submittedId !== null;
            const res = await fetch("/api/questionnaire", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(isEdit ? { id: submittedId } : {}),
                    name,
                    gender,
                    birth_date: birthDate,
                    privacy_consent: privacyConsent,
                    category,
                    responses,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
                setSubmitting(false);
                return;
            }
            // 최초 제출일 때만 ID 저장
            if (!isEdit && data.id) {
                setSubmittedId(data.id);
            }
            setSubmitting(false);
            setStep(4); // 완료 페이지로 이동
        } catch {
            setError("서버 오류가 발생했습니다.");
            setSubmitting(false);
        }
    };

    // 다른 문진표 작성: 응답 초기화 후 카테고리 선택(step 2)으로
    const handleNewQuestionnaire = () => {
        setSubmittedId(null); // ID 초기화 → 다음 제출은 새로 생성
        setCategory("");
        setResponses({
            height: "", weight: "",
            birthWeeks: "", birthDays: "", birthWeight: "", birthHeight: "", birthHeadCircumference: "",
            deliveryMethod: "", breechDelivery: "", nicuHistory: "", nicuReason: "",
            familyHistory: "", familyDisease: "",
            motherHeight: "", motherWeight: "", fatherHeight: "", fatherWeight: "",
            motherMenarche: "", motherShortHeight: "", motherThin: "",
            fatherShortHeight: "", fatherThin: "",
            pubertySigns: "", symptoms: [], diagnosedDiseases: "",
            allergy_duration_days: "", allergy_duration_weeks: "",
            allergy_sleep: "", allergy_daily_life: "", allergy_work_school: "", allergy_troublesome: "",
            allergy_vas: "0", tnss_congestion: "", tnss_runny_nose: "", tnss_itching: "", tnss_sneezing: "", allergy_eye_symptom: "",
        });
        setError("");
        setStep(2);
    };

    const canProceedStep1 = name && gender && birthDate && privacyConsent;
    const canProceedStep2 = !!category;

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white font-pretendard pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* ── 진행 표시 (step 4에서는 숨김) ── */}
                {step < 4 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s
                                            ? "bg-deep-blue text-white shadow-lg shadow-blue-900/20"
                                            : "bg-gray-200 text-gray-400"
                                            }`}
                                    >
                                        {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-12 sm:w-20 h-1 rounded-full transition-all duration-300 ${step > s ? "bg-deep-blue" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-400 font-medium">
                            {step === 1 && "기본 정보 입력"}
                            {step === 2 && "문진 항목 선택"}
                            {step === 3 && "상세 문진 작성"}
                        </p>
                    </div>
                )}

                {/* ── 에러 메시지 ── */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm text-red-600 font-medium">{error}</span>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* ═══════ STEP 1: 기본 정보 ═══════ */}
                    {step === 1 && (
                        <motion.div key="step1" {...fadeIn}>
                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-black text-gray-900">사전 문진표</h1>
                                        <p className="text-sm text-gray-400 font-medium">기본 정보를 입력해주세요</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {/* 이름 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">아이 이름</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="이름을 입력해주세요"
                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all"
                                        />
                                    </div>

                                    {/* 성별 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">성별</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["남자", "여자"].map((g) => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setGender(g)}
                                                    className={`py-3.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${gender === g
                                                        ? "border-deep-blue bg-deep-blue/5 text-deep-blue"
                                                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {g === "남자" ? "👦 " : "👧 "}{g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 생년월일 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            생년월일
                                        </label>
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all"
                                        />
                                    </div>

                                    {/* 개인정보 동의 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">
                                            <Shield className="w-4 h-4 inline mr-1" />
                                            개인정보 수집 및 이용 동의
                                        </label>
                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 max-h-48 overflow-y-auto mb-3">
                                            <pre className="text-xs text-gray-500 whitespace-pre-wrap font-pretendard leading-relaxed">{privacyText}</pre>
                                        </div>
                                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-blue-50/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={privacyConsent}
                                                onChange={(e) => setPrivacyConsent(e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-deep-blue focus:ring-deep-blue/20"
                                            />
                                            <span className="text-sm font-bold text-gray-700">
                                                <span className="block sm:inline">개인정보 수집 및 이용에 </span>
                                                <span className="block sm:inline">동의합니다. (필수)</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setError(""); setStep(2); }}
                                    disabled={!canProceedStep1}
                                    className="w-full mt-8 py-4 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    다음 단계 <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════ STEP 2: 카테고리 선택 ═══════ */}
                    {step === 2 && (
                        <motion.div key="step2" {...fadeIn}>
                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                        <ClipboardList className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-black text-gray-900">문진 항목 선택</h1>
                                        <p className="text-sm text-gray-400 font-medium">
                                            <span className="block sm:inline">해당하는 문진 항목을 </span>
                                            <span className="block sm:inline">선택해주세요</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    {categories.map((cat) => {
                                        const isSelected = category === cat.id;
                                        const isAvailable = cat.id === "growth" || cat.id === "allergy";
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => isAvailable && setCategory(cat.id)}
                                                disabled={!isAvailable}
                                                className={`relative group p-5 rounded-2xl border-2 text-left transition-all duration-200 ${isSelected
                                                    ? "border-deep-blue bg-deep-blue/5 shadow-lg"
                                                    : isAvailable
                                                        ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                                        : "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${cat.bgColor} flex items-center justify-center shrink-0`}>
                                                        <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base font-bold text-gray-900">{cat.label}</h3>
                                                        <p className="text-xs text-gray-400 font-medium mt-0.5">{cat.description}</p>
                                                    </div>
                                                    {isSelected && (
                                                        <CheckCircle2 className="w-6 h-6 text-deep-blue shrink-0" />
                                                    )}
                                                </div>
                                                {!isAvailable && (
                                                    <span className="absolute top-3 right-3 text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                                                        준비 중
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> 이전
                                    </button>
                                    <button
                                        onClick={() => { setError(""); setStep(3); }}
                                        disabled={!canProceedStep2}
                                        className="flex-[2] py-4 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        다음 단계 <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════ STEP 3: 성장 문진표 ═══════ */}
                    {step === 3 && category === "growth" && (
                        <motion.div key="step3" {...fadeIn}>
                            <div className="space-y-6">
                                {/* 기본 신체 정보 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Ruler className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">현재 신체 정보</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">키 (cm)</label>
                                            <input type="number" step="0.1" value={responses.height} onChange={(e) => updateResponse("height", e.target.value)} placeholder="cm" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">몸무게 (kg)</label>
                                            <input type="number" step="0.1" value={responses.weight} onChange={(e) => updateResponse("weight", e.target.value)} placeholder="kg" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                        </div>
                                    </div>
                                </div>

                                {/* 출생 정보 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                            <Baby className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">출생 정보</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {/* 출생 주수 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                                <span className="block sm:inline">출생 주수 </span>
                                                <span className="text-gray-400">(40주가 만삭)</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input type="number" value={responses.birthWeeks} onChange={(e) => updateResponse("birthWeeks", e.target.value)} placeholder="주" className="flex-1 px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                                <span className="text-sm text-gray-400 font-medium">주</span>
                                                <input type="number" value={responses.birthDays} onChange={(e) => updateResponse("birthDays", e.target.value)} placeholder="일" className="flex-1 px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                                <span className="text-sm text-gray-400 font-medium">일</span>
                                            </div>
                                        </div>
                                        {/* 출생 체중/키/두위 */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">출생 체중 (kg)</label>
                                                <input type="number" step="0.01" value={responses.birthWeight} onChange={(e) => updateResponse("birthWeight", e.target.value)} placeholder="kg" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">출생 키 (cm)</label>
                                                <input type="number" step="0.1" value={responses.birthHeight} onChange={(e) => updateResponse("birthHeight", e.target.value)} placeholder="cm" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">두위 (cm)</label>
                                                <input type="number" step="0.1" value={responses.birthHeadCircumference} onChange={(e) => updateResponse("birthHeadCircumference", e.target.value)} placeholder="cm" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                            </div>
                                        </div>
                                        {/* 분만 방법 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">분만 방법</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["제왕절개", "자연분만"].map((m) => (
                                                    <button key={m} type="button" onClick={() => updateResponse("deliveryMethod", m)}
                                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${responses.deliveryMethod === m ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                    >{m}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* 둔위 분만 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                                <span className="block sm:inline">둔위 분만 여부 </span>
                                                <span className="text-gray-400 text-[11px]">(엉덩이부터 출산)</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["예", "아니오"].map((v) => (
                                                    <button key={v} type="button" onClick={() => updateResponse("breechDelivery", v)}
                                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${responses.breechDelivery === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                    >{v}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* 신생아 중환자실 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">신생아 중환자실 입원 병력</label>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                {["예", "아니오"].map((v) => (
                                                    <button key={v} type="button" onClick={() => updateResponse("nicuHistory", v)}
                                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${responses.nicuHistory === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                    >{v}</button>
                                                ))}
                                            </div>
                                            {responses.nicuHistory === "예" && (
                                                <input type="text" value={responses.nicuReason} onChange={(e) => updateResponse("nicuReason", e.target.value)}
                                                    placeholder="입원 이유 (예: 경련, 출생시 손상, 신생아 황달 등)"
                                                    className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 가족력 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                            <Heart className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">가족력 및 부모 정보</h2>
                                    </div>
                                    <div className="space-y-5">
                                        {/* 특이 가족력 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">
                                                <span className="block sm:inline">특이 가족력 </span>
                                                <span className="text-gray-400">(가족, 친척 중 특이 질환)</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                {["예", "아니오"].map((v) => (
                                                    <button key={v} type="button" onClick={() => updateResponse("familyHistory", v)}
                                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${responses.familyHistory === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                    >{v}</button>
                                                ))}
                                            </div>
                                            {responses.familyHistory === "예" && (
                                                <input type="text" value={responses.familyDisease} onChange={(e) => updateResponse("familyDisease", e.target.value)}
                                                    placeholder="질환명 (예: 당뇨, 갑상선, 기타 내분비 질환 등)"
                                                    className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                                />
                                            )}
                                        </div>
                                        {/* 엄마 키/몸무게 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">👩 엄마의 키와 몸무게</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">키 (cm)</label>
                                                    <input type="number" step="0.1" value={responses.motherHeight} onChange={(e) => updateResponse("motherHeight", e.target.value)} placeholder="cm" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">몸무게 (kg)</label>
                                                    <input type="number" step="0.1" value={responses.motherWeight} onChange={(e) => updateResponse("motherWeight", e.target.value)} placeholder="kg" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* 아빠 키/몸무게 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">👨 아빠의 키와 몸무게</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">키 (cm)</label>
                                                    <input type="number" step="0.1" value={responses.fatherHeight} onChange={(e) => updateResponse("fatherHeight", e.target.value)} placeholder="cm" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">몸무게 (kg)</label>
                                                    <input type="number" step="0.1" value={responses.fatherWeight} onChange={(e) => updateResponse("fatherWeight", e.target.value)} placeholder="kg" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* 엄마 초경 연령 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                                👩 엄마의 초경 연령 <span className="text-gray-400">(예: 초5, 초6, 중1 ...)</span>
                                            </label>
                                            <input type="text" value={responses.motherMenarche} onChange={(e) => updateResponse("motherMenarche", e.target.value)}
                                                placeholder="예: 초6" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue" />
                                        </div>
                                        {/* 엄마 어릴적 성장패턴 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">
                                                <span className="block sm:inline">👩 엄마의 어릴적 성장패턴 </span>
                                                <span className="text-gray-400">(어릴적에 키가 작고 마른 편이었다)</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">작은 키</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["예", "아니오"].map((v) => (
                                                            <button key={v} type="button" onClick={() => updateResponse("motherShortHeight", v)}
                                                                className={`py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${responses.motherShortHeight === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400"}`}
                                                            >{v}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">마른 편</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["예", "아니오"].map((v) => (
                                                            <button key={v} type="button" onClick={() => updateResponse("motherThin", v)}
                                                                className={`py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${responses.motherThin === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400"}`}
                                                            >{v}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* 아빠 어릴적 성장패턴 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">
                                                <span className="block sm:inline">👨 아빠의 어릴적 성장패턴 </span>
                                                <span className="text-gray-400">(어릴적에 키가 작고 마른 편이었다)</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">작은 키</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["예", "아니오"].map((v) => (
                                                            <button key={v} type="button" onClick={() => updateResponse("fatherShortHeight", v)}
                                                                className={`py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${responses.fatherShortHeight === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400"}`}
                                                            >{v}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] text-gray-400 mb-1">마른 편</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["예", "아니오"].map((v) => (
                                                            <button key={v} type="button" onClick={() => updateResponse("fatherThin", v)}
                                                                className={`py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${responses.fatherThin === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400"}`}
                                                            >{v}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2차 성징 및 증상 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                            <Stethoscope className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">2차 성징 및 증상</h2>
                                    </div>
                                    <div className="space-y-5">
                                        {/* 성별에 따른 2차 성징 질문 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                                {gender === "여자"
                                                    ? "*(여자 아이 해당) 가슴발견은 언제 아셨나요?"
                                                    : "*(남자 아이 해당) 고환 크기 증가 발견 시기는?"}
                                                <span className="text-gray-400 ml-1">(예: 한달전, 2주전)</span>
                                            </label>
                                            <input type="text" value={responses.pubertySigns} onChange={(e) => updateResponse("pubertySigns", e.target.value)}
                                                placeholder={gender === "여자" ? "예: 한달전" : "예: 한달전"}
                                                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                            />
                                        </div>
                                        {/* 증상 체크리스트 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-3">
                                                <span className="block sm:inline">*다음 중 아이에 해당하는 증상에 </span>
                                                <span className="block sm:inline">체크해 주세요</span>
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {symptomList.map((s) => (
                                                    <label key={s} className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all text-xs font-medium ${responses.symptoms.includes(s) ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-100 text-gray-500 hover:border-gray-200"
                                                        }`}>
                                                        <input type="checkbox" checked={responses.symptoms.includes(s)} onChange={() => toggleSymptom(s)} className="w-4 h-4 rounded border-gray-300 text-deep-blue focus:ring-deep-blue/20" />
                                                        {s}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* 진단 받은 질환 */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">
                                                <span className="block sm:inline">*아이의 진단 받은 질환 및 </span>
                                                <span className="block sm:inline">현재 복용중인 약/건강식품</span>
                                            </label>
                                            <input type="text" value={responses.diagnosedDiseases} onChange={(e) => updateResponse("diagnosedDiseases", e.target.value)}
                                                placeholder="예: 천식약, 피부약, 한약, 홍삼, 영양제"
                                                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 하단 버튼 */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> 이전
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="flex-[2] py-4 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                제출 중...
                                            </span>
                                        ) : (
                                            <>제출하기 <CheckCircle2 className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════ STEP 3: 알레르기 비염 문진표 ═══════ */}
                    {step === 3 && category === "allergy" && (
                        <motion.div key="step3_allergy" {...fadeIn}>
                            <div className="space-y-6">
                                {/* 작성 기준 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <h2 className="text-xl font-black text-gray-900 text-center mb-6">알레르기 비염 증상 평가지</h2>
                                    <p className="text-sm text-gray-600 font-medium mb-8">
                                        * <span className="underline decoration-2 underline-offset-4 decoration-current font-bold">최근 3개월</span> 동안의 <span className="underline decoration-2 underline-offset-4 decoration-current font-bold">비염</span> 상태를 기준으로 작성 부탁드립니다.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-sm font-bold text-gray-700">• 증상이 주 4일 이상 있다</span>
                                            <div className="flex gap-2">
                                                {["예", "아니오"].map(v => (
                                                    <button key={v} onClick={() => updateResponse("allergy_duration_days", v)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${responses.allergy_duration_days === v ? "border-amber-500 bg-amber-50 text-amber-600" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                    >{v}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-sm font-bold text-gray-700">• 증상이 1년 중 4주 이상 지속된다</span>
                                            <div className="flex gap-2">
                                                {["예", "아니오"].map(v => (
                                                    <button key={v} onClick={() => updateResponse("allergy_duration_weeks", v)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${responses.allergy_duration_weeks === v ? "border-amber-500 bg-amber-50 text-amber-600" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                    >{v}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        {[
                                            { id: "allergy_sleep", label: "1. 수면장애" },
                                            { id: "allergy_daily_life", label: "2. 일상생활, 여가, 스포츠 활동의 장애" },
                                            { id: "allergy_work_school", label: "3. 학교나 직장생활 어려움" },
                                            { id: "allergy_troublesome", label: "4. 매우 불편한 증상(코막힘, 콧물, 코 가려움증, 재채기 등)" },
                                        ].map((item) => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                                                <span className="text-sm font-bold text-gray-800">{item.label}</span>
                                                <div className="flex gap-2 shrink-0">
                                                    {["없다", "있다"].map(v => (
                                                        <button key={v} onClick={() => updateResponse(item.id, v)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${responses[item.id as keyof typeof responses] === v ? "border-deep-blue bg-deep-blue/5 text-deep-blue" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                                                        >{v}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* VAS 평가 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <h3 className="text-lg font-black text-gray-900 mb-6">• VAS 평가</h3>
                                    <p className="text-sm text-gray-600 font-medium mb-6">알레르기 비염 증상이 어느 정도인가요?</p>

                                    <div className="px-2 sm:px-6 mb-8 mt-24 relative">
                                        <div className="relative w-full h-3 bg-gray-200 rounded-full">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-amber-500 rounded-full transition-all duration-300 pointer-events-none"
                                                style={{ width: `${(parseInt(responses.allergy_vas as string) || 0) * 10}%` }}
                                            />
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => updateResponse("allergy_vas", num.toString())}
                                                    className="absolute top-1/2 flex flex-col items-center justify-center cursor-pointer group"
                                                    style={{ left: `${num * 10}%`, transform: 'translate(-50%, -50%)', width: '32px', height: '64px' }}
                                                >
                                                    <div className={`w-4 h-4 rounded-full mb-3 ${parseInt(responses.allergy_vas as string) === num ? 'bg-amber-600 ring-4 ring-amber-100 scale-125 shadow-md' : 'bg-gray-300 group-hover:bg-amber-300'} transition-all`} />
                                                    <span className={`text-sm font-bold ${parseInt(responses.allergy_vas as string) === num ? 'text-amber-600' : 'text-gray-400 group-hover:text-amber-500'} transition-colors`}>{num}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-6 mt-10">
                                        <span className="flex items-center gap-1">증상 없음 <span className="text-xl">😃</span></span>
                                        <span className="flex items-center gap-1">참을 수 없을 정도 심함 <span className="text-xl">😫</span></span>
                                    </div>
                                    <p className="text-center text-sm font-medium text-blue-500 bg-blue-50/50 py-3 rounded-xl mt-4">
                                        0~10점 중 고르게 증상 없음에는 <strong>(😃)</strong>, 참을 수 없을 정도 심함 <strong>(😫)</strong> 으로 선택해주세요.
                                    </p>
                                </div>

                                {/* 증상 점수 (TNSS) */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <h3 className="text-lg font-black text-gray-900 text-center mb-2">{"<증상 점수>"}</h3>
                                    <p className="text-sm text-gray-500 italic text-center mb-8">해당하는 사항에 체크 해주세요</p>

                                    <div className="space-y-6">
                                        {[
                                            { id: "tnss_congestion", label: "1. 코막힘", options: ["증상이 전혀 없음", "증상이 조금 있음", "증상이 많이 있음", "증상이 매우 심함"] },
                                            { id: "tnss_runny_nose", label: "2. 콧물", options: ["증상이 전혀 없음", "증상이 조금 있음", "증상이 많이 있음", "증상이 매우 심함"] },
                                            { id: "tnss_itching", label: "3. 코 가려움증", options: ["증상이 전혀 없음", "증상이 조금 있음", "증상이 많이 있음", "증상이 매우 심함"] },
                                            { id: "tnss_sneezing", label: "4. 재채기", options: ["증상이 전혀 없음", "증상이 조금 있음", "증상이 많이 있음", "증상이 매우 심함"] },
                                            { id: "allergy_eye_symptom", label: "5. 눈 증상", options: ["증상이 전혀 없음", "증상이 조금 있음", "증상이 많이 있음", "증상이 매우 심함"] }
                                        ].map((item) => (
                                            <div key={item.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                                <span className="text-sm font-bold text-gray-800 shrink-0 w-28">{item.label}:</span>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                                                    {item.options.map((opt, idx) => (
                                                        <button key={opt} onClick={() => updateResponse(item.id, idx.toString())}
                                                            className={`py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all ${responses[item.id as keyof typeof responses] === idx.toString() ? "border-amber-500 bg-amber-50 text-amber-600 shadow-sm" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}`}
                                                        >
                                                            <div className="text-lg mb-1">{idx}</div>
                                                            <div className="leading-tight">{opt}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 하단 버튼 */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> 이전
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="flex-[2] py-4 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                제출 중...
                                            </span>
                                        ) : (
                                            <>제출하기 <CheckCircle2 className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══════ STEP 4: 제출 완료 ═══════ */}
                    {step === 4 && (
                        <motion.div key="step4" {...fadeIn}>
                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12 text-center">
                                <div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
                                    제출 완료
                                </h1>
                                <p className="text-base text-gray-500 font-medium leading-relaxed mb-2">
                                    문진표가 정상적으로 제출되었습니다.
                                </p>
                                <p className="text-base text-gray-500 font-medium mb-10">
                                    감사합니다.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" /> 수정하기
                                    </button>
                                    <button
                                        onClick={handleNewQuestionnaire}
                                        className="flex-1 py-4 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FilePlus2 className="w-4 h-4" /> 다른 문진표 작성
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
