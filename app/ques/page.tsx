"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, ChevronRight, ChevronLeft, CheckCircle2,
    ClipboardList, Heart, Brain, Wind, AlertCircle, Ruler, Weight,
    Baby, Shield, Stethoscope, Activity, Edit2, FilePlus2, PartyPopper, Scale
} from "lucide-react";
import SignaturePad from "@/components/SignaturePad";

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
    { id: "obesity", label: "비만 치료 문진표", icon: Weight, color: "from-purple-500 to-fuchsia-600", bgColor: "bg-purple-50", iconColor: "text-purple-600", description: "비만 치료약물 처방 전 문진 및 동의서" },
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
    const [obesityStep, setObesityStep] = useState<1 | 2>(1); // 비만 문진표용 서브 단계 (1: 문진, 2: 동의서)

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
        // 비만 치료 문진표 추가 항목
        current_height: "",
        current_weight: "",
        target_weight: "",
        obesity_thyroid: "",
        obesity_thyroid_detail: "",
        obesity_pancreas_history: "",
        obesity_gallbladder: "",
        obesity_gi_disease: "",
        obesity_diabetic_retinopathy: "",
        obesity_diabetes_med: "",
        obesity_diabetes_med_name: "",
        obesity_other_meds: "",
        obesity_diet_pills: "",
        obesity_allergy: "",
        obesity_pregnant: "",
        obesity_breastfeeding: "",
        obesity_signature: "",
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
            current_height: "", current_weight: "", target_weight: "",
            obesity_thyroid: "", obesity_thyroid_detail: "", obesity_pancreas_history: "", obesity_gallbladder: "", obesity_gi_disease: "",
            obesity_diabetic_retinopathy: "", obesity_diabetes_med: "", obesity_diabetes_med_name: "", obesity_other_meds: "",
            obesity_diet_pills: "", obesity_allergy: "", obesity_pregnant: "", obesity_breastfeeding: "", obesity_signature: "",
        });
        setObesityStep(1);
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
                                        const isAvailable = cat.id === "growth" || cat.id === "allergy" || cat.id === "obesity";
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

                    {/* ═══════ STEP 3: 비만 치료 문진표 ═══════ */}
                    {step === 3 && category === "obesity" && obesityStep === 1 && (
                        <motion.div key="step3_obesity_1" {...fadeIn}>
                            <div className="space-y-6">
                                {/* 기본 신체 정보 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Scale className="w-20 h-20 text-purple-600" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                            <Scale className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">📍 현재 신체 정보</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">📏 현재 키 (cm)</label>
                                            <input type="number" step="0.1" value={responses.current_height} onChange={(e) => updateResponse("current_height", e.target.value)} placeholder="cm" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">⚖️ 현재 몸무게 (kg)</label>
                                            <input type="number" step="0.1" value={responses.current_weight} onChange={(e) => updateResponse("current_weight", e.target.value)} placeholder="kg" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all" />
                                        </div>
                                        <div className="sm:border-l border-gray-100 sm:pl-6">
                                            <label className="block text-xs font-bold text-purple-600 mb-2">🎯 목표 몸무게 (kg)</label>
                                            <input type="number" step="0.1" value={responses.target_weight} onChange={(e) => updateResponse("target_weight", e.target.value)} placeholder="목표 kg" className="w-full px-4 py-3.5 rounded-xl bg-purple-50 border-2 border-purple-100 text-sm font-black text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-purple-300" />
                                        </div>
                                    </div>
                                </div>

                                {/* 과거력 및 가족력 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                            <Stethoscope className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">🩺 과거력 및 가족력</h2>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium mb-6 bg-indigo-50/50 p-3 rounded-xl">🔹 해당사항이 있을 경우 <span className="text-indigo-600 font-bold underline">"예"</span>에 체크하시고 상세 내용을 적어주세요.</p>
                                    
                                    <div className="space-y-6">
                                        {/* 갑상선 질환 */}
                                        <div className="pb-6 border-b border-gray-50">
                                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">갑상선 질환 (Thyroid Disease) <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">중요</span></h3>
                                            <p className="text-xs text-gray-500 mb-3">본인 또는 가족 중에 '갑상선 수질암'이나 '다발성 내분비 종양 증후군 2형(MEN 2)'을 진단받은 적이 있습니까?</p>
                                            <div className="flex gap-4 mb-4">
                                                {["예", "아니오"].map((opt) => (
                                                    <button key={opt} onClick={() => updateResponse("obesity_thyroid", opt)}
                                                        className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_thyroid === opt ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                    >{opt}</button>
                                                ))}
                                            </div>
                                            <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-600 mb-2 font-medium">기타 갑상선 질환을 앓고 계십니까?</p>
                                                <input type="text" value={responses.obesity_thyroid_detail} onChange={(e) => updateResponse("obesity_thyroid_detail", e.target.value)} placeholder="예시) 갑상선 기능 저하증, 항진증 등 표기" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                            </div>
                                        </div>

                                        {/* 췌장 및 담낭 질환 */}
                                        <div className="pb-6 border-b border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800 mb-2">과거 췌장염(Pancreatitis) 이력</h3>
                                                <div className="flex gap-3 mt-3">
                                                    {["예", "아니오"].map((opt) => (
                                                        <button key={opt} onClick={() => updateResponse("obesity_pancreas_history", opt)}
                                                            className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${responses.obesity_pancreas_history === opt ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                        >{opt}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800 mb-2">담석증 등 담낭(쓸개) 질환 유무</h3>
                                                <div className="flex gap-3 mt-3">
                                                    {["예", "아니오"].map((opt) => (
                                                        <button key={opt} onClick={() => updateResponse("obesity_gallbladder", opt)}
                                                            className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${responses.obesity_gallbladder === opt ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                        >{opt}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 위장관 질환 */}
                                        <div className="pb-6 border-b border-gray-50">
                                            <h3 className="text-sm font-bold text-gray-800 mb-2">위장관 질환 (Gastrointestinal Disease)</h3>
                                            <p className="text-xs text-gray-500 mb-3">중증 위마비 등 만성적인 소화 장애나 염증성 장질환이 있습니까?</p>
                                            <div className="flex gap-4">
                                                {["예", "아니오"].map((opt) => (
                                                    <button key={opt} onClick={() => updateResponse("obesity_gi_disease", opt)}
                                                        className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_gi_disease === opt ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                    >{opt}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 당뇨관련 합병증 */}
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 mb-2">당뇨관련 합병증</h3>
                                            <p className="text-xs text-gray-500 mb-3">당뇨망막병증(Diabetic Retinopathy) 등 합병증이나 신장 질환이 있습니까?</p>
                                            <div className="flex gap-4">
                                                {["예", "아니오"].map((opt) => (
                                                    <button key={opt} onClick={() => updateResponse("obesity_diabetic_retinopathy", opt)}
                                                        className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_diabetic_retinopathy === opt ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                    >{opt}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 현재 복용 약물 및 알레르기 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                            <Activity className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">💊 투약 이력 및 알레르기</h2>
                                    </div>

                                    <div className="space-y-6">
                                        {/* 당뇨약 */}
                                        <div className="pb-6 border-b border-gray-50">
                                            <h3 className="text-sm font-bold text-gray-800 mb-2">당뇨약 (Diabetes Medication)</h3>
                                            <p className="text-xs text-gray-500 mb-3">인슐린을 포함한 당뇨 약물을 맞거나 복용 중이십니까?</p>
                                            <div className="flex gap-4 mb-3">
                                                {["예", "아니오"].map((opt) => (
                                                    <button key={opt} onClick={() => updateResponse("obesity_diabetes_med", opt)}
                                                        className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_diabetes_med === opt ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                    >{opt}</button>
                                                ))}
                                            </div>
                                            {responses.obesity_diabetes_med === "예" && (
                                                <input type="text" value={responses.obesity_diabetes_med_name} onChange={(e) => updateResponse("obesity_diabetes_med_name", e.target.value)} placeholder="약 이름을 적어주세요" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                                            )}
                                        </div>

                                        {/* 기타 질환 약물 */}
                                        <div className="pb-6 border-b border-gray-50">
                                            <h3 className="text-sm font-bold text-gray-800 mb-2">기타 질환 약물</h3>
                                            <p className="text-xs text-gray-500 mb-3">고혈압, 고지혈증 등 복용 중인 약이 있다면 모두 적어주세요.</p>
                                            <input type="text" value={responses.obesity_other_meds} onChange={(e) => updateResponse("obesity_other_meds", e.target.value)} placeholder="복용 약물 기재 (없을 경우 비워두세요)" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                                        </div>

                                        {/* 다이어트 약물 */}
                                        <div className="pb-6 border-b border-gray-50">
                                            <h3 className="text-sm font-bold text-gray-800 mb-2">다이어트 약물</h3>
                                            <p className="text-xs text-gray-500 mb-3">최근 3개월 이내에 다른 식욕억제제나 한약, 비만 치료 주사제를 사용한 적이 있습니까?</p>
                                            <div className="flex gap-4">
                                                {["예", "아니오"].map((opt) => (
                                                    <button key={opt} onClick={() => updateResponse("obesity_diet_pills", opt)}
                                                        className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_diet_pills === opt ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                    >{opt}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 알레르기 */}
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4 text-red-500" /> 알레르기 (Allergy)</h3>
                                            <p className="text-xs text-gray-500 mb-3">약물에 대한 중증 알레르기 반응이 나타난 적이 있습니까?</p>
                                            <div className="flex gap-4">
                                                {["예", "아니오"].map((opt) => (
                                                    <button key={opt} onClick={() => updateResponse("obesity_allergy", opt)}
                                                        className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_allergy === opt ? "border-red-500 bg-red-50 text-red-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                                                    >{opt}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 성별 여성인 경우 추가 질문 */}
                                {gender === "여자" && (
                                    <div className="bg-pink-50/50 rounded-3xl border border-pink-100 p-6 sm:p-8">
                                        <h2 className="text-sm font-black text-pink-600 mb-5">[성별이 여성인 분만 작성하는 항목]</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800 mb-2">임신 유무</h3>
                                                <p className="text-xs text-gray-500 mb-3">현재 임신 중이거나, 임신을 계획하고 계십니까?</p>
                                                <div className="flex gap-4">
                                                    {["예", "아니오"].map((opt) => (
                                                        <button key={opt} onClick={() => updateResponse("obesity_pregnant", opt)}
                                                            className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_pregnant === opt ? "border-pink-500 bg-pink-100/50 text-pink-700" : "border-gray-200 bg-white text-gray-400"}`}
                                                        >{opt}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800 mb-2">모유 수유 유무</h3>
                                                <p className="text-xs text-gray-500 mb-3">현재 모유 수유 중이십니까?</p>
                                                <div className="flex gap-4">
                                                    {["예", "아니오"].map((opt) => (
                                                        <button key={opt} onClick={() => updateResponse("obesity_breastfeeding", opt)}
                                                            className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${responses.obesity_breastfeeding === opt ? "border-pink-500 bg-pink-100/50 text-pink-700" : "border-gray-200 bg-white text-gray-400"}`}
                                                        >{opt}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 하단 버튼 */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> 이전
                                    </button>
                                    <button
                                        onClick={() => setObesityStep(2)}
                                        className="flex-[2] py-4 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                    >
                                        다음: 안내 및 동의서 작성 <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && category === "obesity" && obesityStep === 2 && (
                        <motion.div key="step3_obesity_2" {...fadeIn}>
                            <div className="space-y-6">
                                {/* 동의서 안내문 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-6">📑 비만 치료제 투여 안내 및 동의서</h2>
                                    <p className="text-sm font-bold text-gray-600 mb-8 pb-6 border-b border-gray-100 leading-relaxed">
                                        🏥 본 의원(<span className="text-purple-600">우리들소아청소년과</span>)은 환자분의 안전한 치료를 위해 아래와 같이 약물(위고비/마운자로 등)의 주요 부작용과 주의사항을 안내합니다. 
                                        내용을 <span className="underline decoration-purple-300 decoration-2">충분히 읽고 이해하신 후</span> 서명해 주시기 바랍니다.
                                    </p>

                                    <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-medium">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><span className="text-purple-600">1.</span> 흔하게 발생하는 부작용 (위장관 증상)</h3>
                                            <p className="mb-2">약물 투여 초기 또는 용량을 증량할 때 다음과 같은 증상이 나타날 수 있습니다. 대부분 시간이 지나면 완화되지만, 증상이 심할 경우 의료진과 상담해야 합니다.</p>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                <li><strong>소화기계:</strong> 메스꺼움(오심), 구토, 설사, 변비, 복통, 소화불량, 가스 참(복부 팽만감).</li>
                                                <li><strong>전신 증상:</strong> 두통, 피로감, 어지러움.</li>
                                            </ul>
                                        </div>

                                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-900">
                                            <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> 2. 드물지만 심각한 부작용 및 즉시 내원이 필요한 경우</h3>
                                            <p className="mb-2">다음과 같은 증상이 나타나면 즉시 투약을 중단하고 병원을 방문하십시오.</p>
                                            <ul className="list-disc pl-5 space-y-1 text-red-800">
                                                <li><strong>췌장염:</strong> 참기 힘든 심한 복통이 등 쪽으로 뻗치는 경우.</li>
                                                <li><strong>담낭 질환:</strong> 심한 우측 상복부 통증, 황달, 발열.</li>
                                                <li><strong>중증 알레르기:</strong> 두드러기, 가려움, 호흡 곤란, 얼굴이나 목의 부종.</li>
                                                <li><strong>저혈당:</strong> 식은땀, 떨림, 심한 허기, 집중력 저하 (특히 당뇨약을 복용 중인 경우 주의).</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><span className="text-purple-600">3.</span> 특별 주의사항 및 금기</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                                <li><strong className="text-red-500">갑상선암 관련:</strong> 본인 또는 가족 중 '갑상선 수질암'이나 '다발성 내분비 종양 증후군 2형(MEN 2)' 이력이 있는 경우 <strong>절대 투여해서는 안 됩니다.</strong></li>
                                                <li><strong className="text-red-500">임신 및 수유:</strong> 임산부 및 수유부는 투여가 금지됩니다. 임신을 계획 중이라면 <strong>최소 투여 중단 2개월 후</strong>에 임신을 시도할 것을 권장합니다. (경구 피임약의 효과를 떨어뜨릴 수 있으므로 추가적인 피임법 사용이 권장됩니다.)</li>
                                                <li><strong>수술/내시경 예정:</strong> 위 배출 지연으로 인해 흡인 위험이 있으므로, 전신마취 수술이나 내시경 예정 시 반드시 의료진에게 투약 사실을 알려야 합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* 환자 확인 및 서명 폼 */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10">
                                    <h3 className="text-lg font-black text-gray-900 mb-4">[환자 확인 및 동의]</h3>
                                    <ul className="space-y-3 text-sm font-medium text-gray-700 mb-8 bg-gray-50 p-5 rounded-2xl">
                                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" /> 본인은 현재 앓고 있는 질환 및 복용 중인 약물, 과거 병력에 대해 사실대로 답변하였습니다.</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" /> 약물 투여 중 이상 반응이 나타날 경우 즉시 투약을 중단하고 의료진에게 상담할 것을 확인합니다.</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" /> 본인은 위 안내 사항을 모두 숙지하였으며, 본인의 자발적인 의사에 따라 치료를 진행하는 것에 동의합니다.</li>
                                    </ul>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">작성일</label>
                                                <div className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 border border-gray-200">
                                                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">환자 성명</label>
                                                <div className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 border border-gray-200">
                                                    {name || "이름 미기입"}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="border border-gray-200 p-3 bg-gray-50/50 rounded-2xl">
                                            <p className="text-xs font-bold text-gray-500 mb-2 text-center">아래 영역에 서명해주세요 (터치 및 마우스 드래그)</p>
                                            <SignaturePad 
                                                initialDataUrl={responses.obesity_signature || null}
                                                onSave={(dataUrl) => updateResponse("obesity_signature", dataUrl || "")} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 하단 버튼 */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setObesityStep(1)}
                                        className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> 문진표 재확인
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !responses.obesity_signature}
                                        className="flex-[2] py-4 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                제출 중...
                                            </span>
                                        ) : (
                                            <>서명 및 제출하기 <CheckCircle2 className="w-4 h-4" /></>
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
