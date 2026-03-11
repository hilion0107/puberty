"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ClipboardList, Eye, Trash2, Edit2, Search,
    Calendar, User, Ruler, Brain, Wind, Activity, Copy, Check, Save, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getHeightPercentile, getWeightPercentile, getAgeInMonths, calculateMPH, calculatePAH } from "@/lib/growthPercentile";
import GrowthChart from "@/components/GrowthChart";

interface Questionnaire {
    id: number;
    name: string;
    gender: string;
    birth_date: string;
    privacy_consent: boolean;
    category: string;
    responses: Record<string, unknown>;
    created_at: string;
}

const categoryMap: Record<string, { label: string; icon: typeof Ruler; color: string }> = {
    growth: { label: "성장", icon: Ruler, color: "text-blue-600 bg-blue-50" },
    development: { label: "발달", icon: Brain, color: "text-emerald-600 bg-emerald-50" },
    allergy: { label: "알레르기 비염", icon: Wind, color: "text-amber-600 bg-amber-50" },
    constipation: { label: "변비", icon: Activity, color: "text-rose-600 bg-rose-50" },
};

/* ─── 만나이 연/개월수 계산 ─── */
function calculateAge(birthDate: string, submitDate: string): string {
    const birth = new Date(birthDate);
    const submit = new Date(submitDate);

    let monthsDiff = (submit.getFullYear() - birth.getFullYear()) * 12 + (submit.getMonth() - birth.getMonth());
    if (submit.getDate() < birth.getDate()) {
        monthsDiff--;
    }

    if (monthsDiff < 0) return "0세 0개월";

    const years = Math.floor(monthsDiff / 12);
    const months = monthsDiff % 12;

    return `${years}세 ${months}개월`;
}

/* ─── 성장 문진표 결과를 텍스트로 변환 ─── */
function formatGrowthResponse(q: Questionnaire): string {
    const r = q.responses as Record<string, string | string[]>;
    let text = `[성장 문진표 결과]\n`;
    text += `이름: ${q.name}\n성별: ${q.gender}\n생년월일: ${q.birth_date} (만나이: ${calculateAge(q.birth_date, q.created_at)})\n\n`;
    text += `── 현재 신체 정보 ──\n`;
    const ageM = getAgeInMonths(q.birth_date, q.created_at);
    const hP = getHeightPercentile(parseFloat(r.height as string), ageM, q.gender);
    const wP = getWeightPercentile(parseFloat(r.weight as string), ageM, q.gender);
    text += `키: ${r.height || "-"}cm${hP !== null ? `(${hP}백분위)` : ""} / 몸무게: ${r.weight || "-"}kg${wP !== null ? `(${wP}백분위)` : ""}\n`;
    // 골연령
    const baY = r.boneAgeYears as string;
    const baM = r.boneAgeMonths as string;
    if (baY || baM) {
        text += `골연령: ${baY || "0"}세 ${baM || "0"}개월\n`;
    }
    // MPH
    const mphData = calculateMPH(parseFloat(r.motherHeight as string), parseFloat(r.fatherHeight as string), q.gender);
    if (mphData) {
        text += `MPH: ${mphData.mph}cm${mphData.percentile !== null ? `(${mphData.percentile}백분위)` : ""}\n`;
    }
    // PAH
    if (baY || baM) {
        const boneMonths = (parseInt(baY as string) || 0) * 12 + (parseInt(baM as string) || 0);
        const pahData = calculatePAH(parseFloat(r.height as string), boneMonths, q.gender);
        if (pahData) {
            text += `PAH: ${pahData.pah}cm(${pahData.percentile}백분위)\n`;
        }
    }
    text += `\n`;
    text += `── 출생 정보 ──\n`;
    text += `출생 주수: ${r.birthWeeks || "-"}주 ${r.birthDays || "-"}일\n`;
    text += `출생 체중: ${r.birthWeight || "-"}kg / 출생 키: ${r.birthHeight || "-"}cm / 두위: ${r.birthHeadCircumference || "-"}cm\n`;
    text += `분만 방법: ${r.deliveryMethod || "-"}\n`;
    text += `둔위 분만: ${r.breechDelivery || "-"}\n`;
    text += `신생아 중환자실: ${r.nicuHistory || "-"} ${r.nicuReason ? `(사유: ${r.nicuReason})` : ""}\n\n`;
    text += `── 가족력 및 부모 정보 ──\n`;
    text += `특이 가족력: ${r.familyHistory || "-"} ${r.familyDisease ? `(${r.familyDisease})` : ""}\n`;
    text += `엄마 키: ${r.motherHeight || "-"}cm / 몸무게: ${r.motherWeight || "-"}kg\n`;
    text += `아빠 키: ${r.fatherHeight || "-"}cm / 몸무게: ${r.fatherWeight || "-"}kg\n`;
    text += `엄마 초경 연령: ${r.motherMenarche || "-"}\n`;
    text += `엄마 성장패턴: 작은키(${r.motherShortHeight || "-"}) 마른편(${r.motherThin || "-"})\n`;
    text += `아빠 성장패턴: 작은키(${r.fatherShortHeight || "-"}) 마른편(${r.fatherThin || "-"})\n\n`;
    text += `── 2차 성징 및 증상 ──\n`;
    text += `${q.gender === "여자" ? "가슴발견 시기" : "고환 크기 증가 발견 시기"}: ${r.pubertySigns || "-"}\n`;
    text += `해당 증상: ${Array.isArray(r.symptoms) && r.symptoms.length > 0 ? r.symptoms.join(", ") : "없음"}\n`;
    text += `진단 질환/복용약: ${r.diagnosedDiseases || "-"}\n`;
    return text;
}

function formatChartCopy(q: Questionnaire): string {
    const r = q.responses as Record<string, string | string[]>;
    const cDate = new Date(q.created_at);
    const dateStr = `${cDate.getFullYear()}-${cDate.getMonth() + 1}-${cDate.getDate()}`;

    const ga = r.birthWeeks ? `${r.birthWeeks}+${r.birthDays || 0}` : "0+0";
    const bwt = r.birthWeight || "0";

    const ageM = getAgeInMonths(q.birth_date, q.created_at);
    const hP = getHeightPercentile(parseFloat(r.height as string), ageM, q.gender);
    const wP = getWeightPercentile(parseFloat(r.weight as string), ageM, q.gender);
    const htStr = r.height ? `${r.height}cm(${hP !== null ? hP : "-"}P)` : "-";
    const wtStr = r.weight ? `${r.weight}kg(${wP !== null ? wP : "-"}P)` : "-";

    const yearsCA = Math.floor(ageM / 12);
    const monthsCA = ageM % 12;
    const baY = r.boneAgeYears ? parseInt(r.boneAgeYears as string) : null;
    const baM = r.boneAgeMonths ? parseInt(r.boneAgeMonths as string) : null;
    let baStr = "";
    if (baY !== null || baM !== null) {
        baStr = `BA ${baY || 0}y${baM || 0}m`;
    }

    const mphData = calculateMPH(parseFloat(r.motherHeight as string), parseFloat(r.fatherHeight as string), q.gender);
    let mphStr = `MPH: mom ${r.motherHeight || "?"}cm, dad ${r.fatherHeight || "?"}cm`;
    if (mphData) mphStr += ` -> ${mphData.mph}cm`;

    let pahStr = "PAH: -";
    if (baY !== null || baM !== null) {
        const boneMonths = (baY || 0) * 12 + (baM || 0);
        const pahData = calculatePAH(parseFloat(r.height as string), boneMonths, q.gender);
        if (pahData) pahStr = `PAH: ${pahData.pah}cm`;
    }

    const momMenarche = r.motherMenarche || "-";

    return `${dateStr}\nGA: ${ga}wks, Bwt.: ${bwt}kg\nHt.: ${htStr}, Wt.: ${wtStr}\nCA ${yearsCA}y${monthsCA}m  ${baStr}\n${mphStr}\n${pahStr}\n엄마 초경: ${momMenarche}`;
}

export default function QuestionnaireResultsPage() {
    const router = useRouter();
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingId, setViewingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editResponses, setEditResponses] = useState<Record<string, unknown>>({});
    const [copied, setCopied] = useState(false);
    const [chartCopied, setChartCopied] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) router.push("/admin");
                else loadData();
            })
            .catch(() => router.push("/admin"));
    }, [router]);

    const loadData = async () => {
        try {
            const res = await fetch("/api/questionnaire");
            const data = await res.json();
            setQuestionnaires(data.questionnaires || []);
        } catch {
            console.error("데이터 로딩 실패");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        setConfirmModal({
            message: "이 문진표를 삭제하시겠습니까?",
            onConfirm: async () => {
                await fetch("/api/questionnaire", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                });
                loadData();
                setConfirmModal(null);
                if (viewingId === id) setViewingId(null);
            },
        });
    };

    const handleCopy = (q: Questionnaire) => {
        const text = formatGrowthResponse(q);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChartCopy = (q: Questionnaire) => {
        const text = formatChartCopy(q);
        navigator.clipboard.writeText(text);
        setChartCopied(true);
        setTimeout(() => setChartCopied(false), 2000);
    };

    const startEdit = (q: Questionnaire) => {
        setEditingId(q.id);
        setEditResponses(JSON.parse(JSON.stringify(q.responses)));
        setViewingId(null);
    };

    const handleSaveEdit = async (id: number) => {
        await fetch("/api/questionnaire", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, responses: editResponses }),
        });
        setEditingId(null);
        loadData();
    };

    const updateEditResponse = (key: string, value: string | string[]) => {
        setEditResponses((prev) => ({ ...prev, [key]: value }));
    };

    const filtered = questionnaires
        .filter((q) => filter === "all" || q.category === filter)
        .filter((q) => !searchTerm || q.name.includes(searchTerm));

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center font-pretendard">
                <div className="animate-spin h-8 w-8 border-4 border-deep-blue border-t-transparent rounded-full" />
            </main>
        );
    }

    const viewingQ = questionnaires.find((q) => q.id === viewingId);
    const editingQ = questionnaires.find((q) => q.id === editingId);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-pretendard pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* ── 헤더 ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">문진표 결과</h1>
                            <p className="text-sm text-gray-400 font-medium">
                                총 <span className="text-deep-blue font-bold">{questionnaires.length}</span>건
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── 필터 & 검색 ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {[{ id: "all", label: "전체" }, ...Object.entries(categoryMap).map(([id, v]) => ({ id, label: v.label }))].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f.id ? "bg-deep-blue text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="이름 검색"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                        />
                    </div>
                </div>

                {/* ── 목록 ── */}
                <div className="space-y-3">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-300">
                            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium">제출된 문진표가 없습니다.</p>
                        </div>
                    ) : (
                        filtered.map((q) => {
                            const cat = categoryMap[q.category];
                            return (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat?.color || "bg-gray-100 text-gray-500"}`}>
                                            {cat ? <cat.icon className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-gray-900">{q.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{q.gender}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cat?.color || "bg-gray-100 text-gray-500"}`}>
                                                    {cat?.label || q.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(q.created_at).toLocaleDateString("ko-KR")} {new Date(q.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                                                <span>·</span>
                                                <User className="w-3 h-3" />
                                                {q.birth_date} ({calculateAge(q.birth_date, q.created_at)})
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => setViewingId(q.id)} className="p-2 text-gray-400 hover:text-deep-blue hover:bg-blue-50 rounded-lg transition-colors" title="보기">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => startEdit(q)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="수정">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="삭제">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ═══════ 보기 모달 (전체 화면) ═══════ */}
            <AnimatePresence>
                {viewingQ && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 overflow-y-auto pt-6 pb-16"
                    >
                        <div className="max-w-3xl mx-auto px-4 sm:px-6">
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={() => setViewingId(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                    <ArrowLeft className="w-5 h-5" /> <span className="text-sm font-bold">목록으로</span>
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleChartCopy(viewingQ)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${chartCopied ? "bg-blue-500/20 text-blue-400 backdrop-blur-md border border-blue-500/30" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/10"}`}
                                    >
                                        {chartCopied ? <><Check className="w-4 h-4" /> 복사됨!</> : <><Copy className="w-4 h-4" /> 차트 복사</>}
                                    </button>
                                    <button
                                        onClick={() => handleCopy(viewingQ)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? "bg-green-500/20 text-green-400 backdrop-blur-md border border-green-500/30" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/10"}`}
                                    >
                                        {copied ? <><Check className="w-4 h-4" /> 복사됨!</> : <><Copy className="w-4 h-4" /> 결과 복사</>}
                                    </button>
                                </div>
                            </div>

                            {/* 기본 정보 카드 */}
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6">
                                <h2 className="text-xl font-black text-gray-900 mb-4">📋 {viewingQ.name}님의 {categoryMap[viewingQ.category]?.label} 문진표</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] text-gray-400 font-bold">이름</p><p className="text-sm font-bold text-gray-900">{viewingQ.name}</p></div>
                                    <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] text-gray-400 font-bold">성별</p><p className="text-sm font-bold text-gray-900">{viewingQ.gender}</p></div>
                                    <div className="p-3 rounded-xl bg-blue-50/50"><p className="text-[10px] text-deep-blue font-bold">만나이</p><p className="text-sm font-bold text-deep-blue">{calculateAge(viewingQ.birth_date, viewingQ.created_at)}</p></div>
                                    <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] text-gray-400 font-bold">생년월일</p><p className="text-sm font-bold text-gray-900">{viewingQ.birth_date}</p></div>
                                    <div className="p-3 rounded-xl bg-gray-50"><p className="text-[10px] text-gray-400 font-bold">제출일</p><p className="text-sm font-bold text-gray-900">{new Date(viewingQ.created_at).toLocaleDateString("ko-KR")}</p></div>
                                </div>
                            </div>

                            {/* 성장 문진표 상세 결과 */}
                            {viewingQ.category === "growth" && (() => {
                                const r = viewingQ.responses as Record<string, string | string[]>;
                                const ageM = getAgeInMonths(viewingQ.birth_date, viewingQ.created_at);
                                const hPercentile = getHeightPercentile(parseFloat(r.height as string), ageM, viewingQ.gender);
                                const wPercentile = getWeightPercentile(parseFloat(r.weight as string), ageM, viewingQ.gender);
                                return (
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <h3 className="text-sm font-black text-deep-blue mb-3">📏 현재 신체 정보</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 rounded-xl bg-blue-50/50">
                                                    <p className="text-[10px] text-gray-400">키</p>
                                                    <p className="text-sm font-bold">
                                                        {r.height || "-"} cm
                                                        {hPercentile !== null && <span className="ml-1 text-deep-blue">({hPercentile}백분위)</span>}
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-blue-50/50">
                                                    <p className="text-[10px] text-gray-400">몸무게</p>
                                                    <p className="text-sm font-bold">
                                                        {r.weight || "-"} kg
                                                        {wPercentile !== null && <span className="ml-1 text-deep-blue">({wPercentile}백분위)</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* 골연령 / MPH / PAH */}
                                        {(() => {
                                            const motherH = parseFloat(r.motherHeight as string);
                                            const fatherH = parseFloat(r.fatherHeight as string);
                                            const baY = r.boneAgeYears as string;
                                            const baM = r.boneAgeMonths as string;
                                            const hasBoneAge = !!(baY || baM);
                                            const boneMonths = hasBoneAge ? (parseInt(baY) || 0) * 12 + (parseInt(baM) || 0) : 0;
                                            const mphData = calculateMPH(motherH, fatherH, viewingQ.gender);
                                            const pahData = hasBoneAge ? calculatePAH(parseFloat(r.height as string), boneMonths, viewingQ.gender) : null;

                                            return (hasBoneAge || mphData) ? (
                                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                                    <h3 className="text-sm font-black text-purple-600 mb-3">🦴 성장 예측</h3>
                                                    <div className="space-y-3">
                                                        {hasBoneAge && (
                                                            <div className="p-3 rounded-xl bg-purple-50/50">
                                                                <p className="text-[10px] text-gray-400">골연령</p>
                                                                <p className="text-sm font-bold">{baY || "0"}세 {baM || "0"}개월</p>
                                                            </div>
                                                        )}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {mphData && (
                                                                <div className="p-3 rounded-xl bg-purple-50/50">
                                                                    <p className="text-[10px] text-gray-400">MPH (중간부모키)</p>
                                                                    <p className="text-sm font-bold">
                                                                        {mphData.mph}cm
                                                                        {mphData.percentile !== null && <span className="ml-1 text-purple-600">({mphData.percentile}백분위)</span>}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {pahData && (
                                                                <div className="p-3 rounded-xl bg-purple-50/50">
                                                                    <p className="text-[10px] text-gray-400">PAH (예측 성인키)</p>
                                                                    <p className="text-sm font-bold">
                                                                        {pahData.pah}cm
                                                                        <span className="ml-1 text-purple-600">({pahData.percentile}백분위)</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                        {/* 성장 그래프 */}
                                        {(() => {
                                            const heightVal = parseFloat(r.height as string);
                                            const baYStr = r.boneAgeYears as string;
                                            const baMStr = r.boneAgeMonths as string;
                                            const hasBa = !!(baYStr || baMStr);
                                            const boneM = hasBa ? (parseInt(baYStr) || 0) * 12 + (parseInt(baMStr) || 0) : 0;
                                            const motherH = parseFloat(r.motherHeight as string);
                                            const fatherH = parseFloat(r.fatherHeight as string);
                                            const mph = calculateMPH(motherH, fatherH, viewingQ.gender);
                                            const pah = hasBa ? calculatePAH(heightVal, boneM, viewingQ.gender) : null;

                                            const chartPoints: { ageMonths: number; height: number; label: string; color: string }[] = [];

                                            // 1) 현재 나이 기준 현재 키
                                            if (heightVal > 0 && ageM >= 36) {
                                                chartPoints.push({ ageMonths: ageM, height: heightVal, label: "현재 키", color: "#3B82F6" });
                                            }
                                            // 2) 골연령 기준 현재 키
                                            if (heightVal > 0 && hasBa && boneM >= 36) {
                                                chartPoints.push({ ageMonths: boneM, height: heightVal, label: "골연령 기준", color: "#F97316" });
                                            }
                                            // 3) 18세 기준 MPH
                                            if (mph) {
                                                chartPoints.push({ ageMonths: 216, height: mph.mph, label: "MPH", color: "#8B5CF6" });
                                            }
                                            // 4) 18세 기준 PAH
                                            if (pah) {
                                                chartPoints.push({ ageMonths: 216, height: pah.pah, label: "PAH", color: "#10B981" });
                                            }

                                            if (chartPoints.length > 0) {
                                                return <GrowthChart gender={viewingQ.gender} points={chartPoints} />;
                                            }
                                            return null;
                                        })()}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <h3 className="text-sm font-black text-pink-600 mb-3">👶 출생 정보</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                                <div className="p-3 rounded-xl bg-pink-50/50"><p className="text-[10px] text-gray-400">출생 주수</p><p className="font-bold">{r.birthWeeks || "-"}주 {r.birthDays || "-"}일</p></div>
                                                <div className="p-3 rounded-xl bg-pink-50/50"><p className="text-[10px] text-gray-400">출생 체중</p><p className="font-bold">{r.birthWeight || "-"} kg</p></div>
                                                <div className="p-3 rounded-xl bg-pink-50/50"><p className="text-[10px] text-gray-400">출생 키</p><p className="font-bold">{r.birthHeight || "-"} cm</p></div>
                                                <div className="p-3 rounded-xl bg-pink-50/50"><p className="text-[10px] text-gray-400">두위</p><p className="font-bold">{r.birthHeadCircumference || "-"} cm</p></div>
                                                <div className="p-3 rounded-xl bg-pink-50/50"><p className="text-[10px] text-gray-400">분만 방법</p><p className="font-bold">{r.deliveryMethod || "-"}</p></div>
                                                <div className="p-3 rounded-xl bg-pink-50/50"><p className="text-[10px] text-gray-400">둔위 분만</p><p className="font-bold">{r.breechDelivery || "-"}</p></div>
                                            </div>
                                            {r.nicuHistory === "예" && (
                                                <div className="mt-3 p-3 rounded-xl bg-red-50/50"><p className="text-[10px] text-gray-400">신생아 중환자실</p><p className="text-sm font-bold">{r.nicuHistory} — {r.nicuReason || "-"}</p></div>
                                            )}
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <h3 className="text-sm font-black text-purple-600 mb-3">👨‍👩‍👦 가족 정보</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="p-3 rounded-xl bg-purple-50/50"><p className="text-[10px] text-gray-400">특이 가족력</p><p className="font-bold">{r.familyHistory || "-"} {r.familyDisease ? `(${r.familyDisease})` : ""}</p></div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 rounded-xl bg-purple-50/50"><p className="text-[10px] text-gray-400">👩 엄마 키/몸무게</p><p className="font-bold">{r.motherHeight || "-"}cm / {r.motherWeight || "-"}kg</p></div>
                                                    <div className="p-3 rounded-xl bg-purple-50/50"><p className="text-[10px] text-gray-400">👨 아빠 키/몸무게</p><p className="font-bold">{r.fatherHeight || "-"}cm / {r.fatherWeight || "-"}kg</p></div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-purple-50/50"><p className="text-[10px] text-gray-400">👩 엄마 초경 연령</p><p className="font-bold">{r.motherMenarche || "-"}</p></div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 rounded-xl bg-purple-50/50"><p className="text-[10px] text-gray-400">👩 엄마 성장패턴</p><p className="font-bold">작은키: {r.motherShortHeight || "-"} / 마른편: {r.motherThin || "-"}</p></div>
                                                    <div className="p-3 rounded-xl bg-purple-50/50"><p className="text-[10px] text-gray-400">👨 아빠 성장패턴</p><p className="font-bold">작은키: {r.fatherShortHeight || "-"} / 마른편: {r.fatherThin || "-"}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <h3 className="text-sm font-black text-amber-600 mb-3">🩺 2차 성징 및 증상</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="p-3 rounded-xl bg-amber-50/50">
                                                    <p className="text-[10px] text-gray-400">{viewingQ.gender === "여자" ? "가슴발견 시기" : "고환 크기 증가 발견 시기"}</p>
                                                    <p className="font-bold">{r.pubertySigns || "-"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-amber-50/50">
                                                    <p className="text-[10px] text-gray-400 mb-2">해당 증상</p>
                                                    {Array.isArray(r.symptoms) && r.symptoms.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {r.symptoms.map((s: string) => (
                                                                <span key={s} className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-bold">{s}</span>
                                                            ))}
                                                        </div>
                                                    ) : <p className="font-bold">없음</p>}
                                                </div>
                                                <div className="p-3 rounded-xl bg-amber-50/50"><p className="text-[10px] text-gray-400">진단 질환/복용약</p><p className="font-bold">{r.diagnosedDiseases || "-"}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 알레르기 비염 문진표 상세 결과 */}
                            {viewingQ.category === "allergy" && (() => {
                                const r = viewingQ.responses as Record<string, string>;
                                // 기간 분류: 주 4일 이상 AND 1년 중 4주 이상 지속
                                const isPersistent = r.allergy_duration_days === "예" && r.allergy_duration_weeks === "예";
                                const durationText = isPersistent ? "지속성 (Persistent)" : "간헐성 (Intermittent)";

                                // 중증도 분류: 하나라도 "있다" 이면 중등도-중증, 아니면 경증
                                const hasSevereSymptom = r.allergy_sleep === "있다" || r.allergy_daily_life === "있다" || r.allergy_work_school === "있다" || r.allergy_troublesome === "있다";
                                const severityText = hasSevereSymptom ? "중등도-중증 (Moderate-Severe)" : "경증 (Mild)";

                                // TNSS 총점
                                const tnssTotal = (parseInt(r.tnss_congestion) || 0) + (parseInt(r.tnss_runny_nose) || 0) + (parseInt(r.tnss_itching) || 0) + (parseInt(r.tnss_sneezing) || 0);
                                const isHighTnss = tnssTotal >= 6;

                                // ARIA Step
                                let ariaStep = "";
                                let treatmentOptions = [];
                                if (!isPersistent && !hasSevereSymptom) {
                                    ariaStep = "Step 1: 경증 간헐성";
                                    treatmentOptions = ["2세대 경구용 항히스타민제", "국소용 항히스타민제", "비충혈 제거제(단기 사용)"];
                                } else if (isPersistent && hasSevereSymptom) {
                                    ariaStep = "Step 3: 중등도-중증 지속성";
                                    treatmentOptions = ["복합 요법: 비강 내 스테로이드(INS) + 비강 내 항히스타민제", "약물 반응 없을 시 면역요법 고려", "코막힘 극심 시 수술적 치료 고려"];
                                } else {
                                    ariaStep = "Step 2: 중등도-중증 간헐성 또는 경증 지속성";
                                    treatmentOptions = ["비강 내 스테로이드제(INS) (1차 선택제)", "필요시 항히스타민제나 류코트리엔 조절제 병용"];
                                }

                                return (
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {/* 종합 평가 */}
                                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                                <h3 className="text-sm font-black text-amber-600 mb-4">📊 ARIA 가이드라인 종합 평가</h3>
                                                <div className="space-y-4">
                                                    <div className="p-3 bg-amber-50 rounded-xl">
                                                        <div className="text-xs text-amber-800 font-bold mb-1">분류형태</div>
                                                        <div className="text-sm font-black text-gray-900">{durationText} / {severityText}</div>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <div className="text-xs text-gray-500 font-bold mb-1">TNSS (총 코증상 점수)</div>
                                                        <div className={`text-xl font-black ${isHighTnss ? "text-red-500" : "text-gray-900"}`}>
                                                            {tnssTotal}점 <span className="text-sm font-medium text-gray-500">/ 12점</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 치료 권고 (Step) */}
                                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                                <h3 className="text-sm font-black text-emerald-600 mb-4">💊 권고 치료 옵션</h3>
                                                <div className="p-3 bg-emerald-50 rounded-xl mb-3">
                                                    <div className="text-sm font-black text-emerald-800">{ariaStep}</div>
                                                </div>
                                                <ul className="space-y-2 text-sm text-gray-700">
                                                    {treatmentOptions.map((opt, idx) => (
                                                        <li key={idx} className="flex gap-2">
                                                            <span className="text-emerald-500 font-bold">•</span>
                                                            <span className="font-medium leading-tight">{opt}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* 상세 문진 항목 내역 */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <h3 className="text-sm font-black text-gray-800 mb-4">📝 문진표 응답 내역</h3>
                                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                                                <div className="space-y-3">
                                                    <div className="text-xs font-bold text-gray-500 border-b pb-1">기간 및 삶의 질 (최근 3개월)</div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">주 4일 이상 증상:</span><span className="font-bold text-gray-900">{r.allergy_duration_days || "-"}</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">1년 중 4주 이상 지속:</span><span className="font-bold text-gray-900">{r.allergy_duration_weeks || "-"}</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">수면장애:</span><span className="font-bold text-gray-900">{r.allergy_sleep || "-"}</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">일상생활/여가/스포츠 장애:</span><span className="font-bold text-gray-900">{r.allergy_daily_life || "-"}</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">학교/직장생활 어려움:</span><span className="font-bold text-gray-900">{r.allergy_work_school || "-"}</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">매우 불편한 증상:</span><span className="font-bold text-gray-900">{r.allergy_troublesome || "-"}</span></div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="text-xs font-bold text-gray-500 border-b pb-1">증상 중증도 평가 (0~3점)</div>
                                                    <div className="flex justify-between text-sm items-center"><span className="text-gray-600">VAS 평가 (주관적 불편감):</span><span className="px-2 py-1 bg-gray-100 rounded-md font-bold text-gray-900">{r.allergy_vas || "0"} / 10</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">코막힘:</span><span className="font-bold text-gray-900">{r.tnss_congestion || "0"}점</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">콧물:</span><span className="font-bold text-gray-900">{r.tnss_runny_nose || "0"}점</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">코 가려움증:</span><span className="font-bold text-gray-900">{r.tnss_itching || "0"}점</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">재채기:</span><span className="font-bold text-gray-900">{r.tnss_sneezing || "0"}점</span></div>
                                                    <div className="flex justify-between text-sm"><span className="text-gray-600">눈 증상:</span><span className="font-bold text-gray-900">{r.allergy_eye_symptom || "0"}점</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════ 수정 모달 ═══════ */}
            <AnimatePresence>
                {editingQ && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto pt-6 pb-16"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 p-6 sm:p-8 my-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-gray-900">✏️ 문진표 수정</h2>
                                <button onClick={() => setEditingId(null)} className="p-2 rounded-xl hover:bg-gray-100">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-6"><strong>{editingQ.name}</strong>님의 {categoryMap[editingQ.category]?.label} 문진표</p>

                            {editingQ.category === "growth" && (() => {
                                const r = editResponses as Record<string, string | string[]>;
                                return (
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">키 (cm)</label><input type="number" step="0.1" value={r.height as string || ""} onChange={(e) => updateEditResponse("height", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">몸무게 (kg)</label><input type="number" step="0.1" value={r.weight as string || ""} onChange={(e) => updateEditResponse("weight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                                            <label className="block text-xs font-bold text-purple-600 mb-2">🦴 골연령 (관리자 입력)</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div><label className="block text-[10px] text-gray-400 mb-1">세</label><input type="number" min="0" max="20" value={r.boneAgeYears as string || ""} onChange={(e) => updateEditResponse("boneAgeYears", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-purple-200 text-sm" placeholder="예: 9" /></div>
                                                <div><label className="block text-[10px] text-gray-400 mb-1">개월</label><input type="number" min="0" max="11" value={r.boneAgeMonths as string || ""} onChange={(e) => updateEditResponse("boneAgeMonths", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-purple-200 text-sm" placeholder="예: 3" /></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">출생 주수</label><input type="number" value={r.birthWeeks as string || ""} onChange={(e) => updateEditResponse("birthWeeks", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">출생 일수</label><input type="number" value={r.birthDays as string || ""} onChange={(e) => updateEditResponse("birthDays", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">출생 체중</label><input type="number" step="0.01" value={r.birthWeight as string || ""} onChange={(e) => updateEditResponse("birthWeight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">출생 키</label><input type="number" step="0.1" value={r.birthHeight as string || ""} onChange={(e) => updateEditResponse("birthHeight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">두위</label><input type="number" step="0.1" value={r.birthHeadCircumference as string || ""} onChange={(e) => updateEditResponse("birthHeadCircumference", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        </div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">분만 방법</label><input type="text" value={r.deliveryMethod as string || ""} onChange={(e) => updateEditResponse("deliveryMethod", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">둔위 분만</label><input type="text" value={r.breechDelivery as string || ""} onChange={(e) => updateEditResponse("breechDelivery", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">신생아 중환자실 입원</label><input type="text" value={r.nicuHistory as string || ""} onChange={(e) => updateEditResponse("nicuHistory", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">입원 이유</label><input type="text" value={r.nicuReason as string || ""} onChange={(e) => updateEditResponse("nicuReason", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">엄마 키 (cm)</label><input type="number" step="0.1" value={r.motherHeight as string || ""} onChange={(e) => updateEditResponse("motherHeight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">엄마 몸무게 (kg)</label><input type="number" step="0.1" value={r.motherWeight as string || ""} onChange={(e) => updateEditResponse("motherWeight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">아빠 키 (cm)</label><input type="number" step="0.1" value={r.fatherHeight as string || ""} onChange={(e) => updateEditResponse("fatherHeight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">아빠 몸무게 (kg)</label><input type="number" step="0.1" value={r.fatherWeight as string || ""} onChange={(e) => updateEditResponse("fatherWeight", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        </div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">엄마 초경 연령</label><input type="text" value={r.motherMenarche as string || ""} onChange={(e) => updateEditResponse("motherMenarche", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">{editingQ.gender === "여자" ? "가슴발견 시기" : "고환 크기 증가 발견 시기"}</label><input type="text" value={r.pubertySigns as string || ""} onChange={(e) => updateEditResponse("pubertySigns", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">진단 질환/복용약</label><input type="text" value={r.diagnosedDiseases as string || ""} onChange={(e) => updateEditResponse("diagnosedDiseases", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" /></div>
                                    </div>
                                );
                            })()}

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => handleSaveEdit(editingQ.id)} className="flex-1 py-3 rounded-xl bg-deep-blue text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
                                    <Save className="w-4 h-4" /> 저장
                                </button>
                                <button onClick={() => setEditingId(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors">
                                    취소
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── 삭제 확인 모달 ── */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
                        <p className="text-base font-bold text-gray-900 mb-6">{confirmModal.message}</p>
                        <div className="flex gap-3">
                            <button onClick={confirmModal.onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600">삭제</button>
                            <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200">취소</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
