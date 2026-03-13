"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Upload, Save, Pencil, Sparkles, Trash2, Plus, Minus,
    ChevronLeft, ChevronRight, Palette, Type, Bold as BoldIcon, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSessionMonitor from "@/components/AdminSessionMonitor";
import Image from "next/image";

/* ─── Types ─── */
interface Doctor {
    abbr: string;
    name: string;
    color: string;
}

interface ScheduleDay {
    date: number;
    dayOfWeek: number;
    am: string;
    pm: string;
    isHoliday: boolean;
    holidayName?: string;
    isClosed?: boolean;
}

interface FooterLine {
    text: string;
    color: string;
    size: number;
    bold: boolean;
}

interface BusinessHours {
    amStart: string;
    amEnd: string;
    pmStart: string;
    pmEnd: string;
}

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
    amStart: "09:00", amEnd: "13:00",
    pmStart: "14:00", pmEnd: "18:00"
};

const DEFAULT_FOOTER: FooterLine[] = [
    { text: "점심시간 13:00~14:00", color: "#000000", size: 14, bold: false },
    { text: "접수마감안내: 효율적인 진료를 위해 접수를 미리 마감할 수 있습니다", color: "#000000", size: 13, bold: false },
    { text: "-상기 스케줄은 사정에 의해 변경될 수 있습니다-", color: "#888888", size: 12, bold: false },
];

const DEFAULT_COLORS = [
    "#9333EA", "#DC2626", "#EA580C", "#16A34A", "#2563EB", "#DB2777", "#0D9488", "#7C3AED"
];

const DAY_NAMES = ["월", "화", "수", "목", "금", "토"];

/* ─── Helpers ─── */
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
    const d = new Date(year, month - 1, 1).getDay();
    return d === 0 ? 0 : d - 1; // If Sunday(0), no empty Mon-Sat cells needed. Else Mon=0...Sat=5.
}

function generateEmptyDays(year: number, month: number): ScheduleDay[] {
    const totalDays = getDaysInMonth(year, month);
    const days: ScheduleDay[] = [];
    for (let i = 1; i <= totalDays; i++) {
        const d = new Date(year, month - 1, i);
        const dow = d.getDay();
        const dayOfWeek = dow === 0 ? 6 : dow - 1; // Mon=0 ... Sun=6
        days.push({
            date: i,
            dayOfWeek,
            am: "",
            pm: "",
            isHoliday: false,
            isClosed: dayOfWeek === 6, // Sundays closed by default
        });
    }
    return days;
}

function groupByWeeks(days: ScheduleDay[], year: number, month: number): ScheduleDay[][] {
    const firstDow = getFirstDayOfWeek(year, month);
    const weeks: ScheduleDay[][] = [];
    let currentWeek: ScheduleDay[] = [];

    // Fill empty slots at start
    for (let i = 0; i < firstDow; i++) {
        currentWeek.push({ date: 0, dayOfWeek: i, am: "", pm: "", isHoliday: false });
    }

    for (const day of days) {
        if (day.dayOfWeek === 6) continue; // Skip Sundays in display
        currentWeek.push(day);
        if (day.dayOfWeek === 5) { // Saturday = end of row
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) {
        while (currentWeek.length < 6) {
            currentWeek.push({ date: 0, dayOfWeek: currentWeek.length, am: "", pm: "", isHoliday: false });
        }
        weeks.push(currentWeek);
    }
    return weeks;
}

/* ─── Main Component ─── */
export default function AdminSchedulePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [user, setUser] = useState<{ username: string; autoLogoutMinutes?: number } | null>(null);

    // Year/Month
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);

    // Doctors
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [showDoctorSetup, setShowDoctorSetup] = useState(true);

    // Schedule Days
    const [days, setDays] = useState<ScheduleDay[]>([]);

    // Footer
    const [footerLines, setFooterLines] = useState<FooterLine[]>(DEFAULT_FOOTER);

    // Business Hours
    const [businessHours, setBusinessHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);

    // Upload
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Editing cell
    const [editingCell, setEditingCell] = useState<{ date: number; period: "am" | "pm" } | null>(null);

    // Confirmation modal
    const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

    const loadSchedule = useCallback(async (y: number, m: number) => {
        try {
            const res = await fetch(`/api/admin/schedule?year=${y}&month=${m}`);
            const data = await res.json();
            if (data.data) {
                setDays(data.data.days || generateEmptyDays(y, m));
                if (data.data.doctors?.length) setDoctors(data.data.doctors);
                if (data.data.footerLines?.length) setFooterLines(data.data.footerLines);
                if (data.data.businessHours) setBusinessHours(data.data.businessHours);
            } else {
                setDays(generateEmptyDays(y, m));
            }
        } catch {
            setDays(generateEmptyDays(y, m));
        }
    }, []);

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) router.push("/admin");
                else {
                    setUser(data.user);
                    // Load doctors
                    fetch("/api/admin/doctors")
                        .then((r) => r.json())
                        .then((d) => {
                            if (d.doctors?.length) {
                                setDoctors(d.doctors.map((doc: { abbreviation: string; name: string; color: string }) => ({
                                    abbr: doc.abbreviation,
                                    name: doc.name,
                                    color: doc.color
                                })));
                            }
                        });
                    loadSchedule(year, month).then(() => setLoading(false));
                }
            })
            .catch(() => router.push("/admin"));
    }, [router, year, month, loadSchedule]);

    const changeMonth = (delta: number) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
        setYear(newYear);
        setMonth(newMonth);
    };

    const handleOCR = async (file: File) => {
        setAnalyzing(true);
        setUploadedImage(null);
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("year", year.toString());
            formData.append("month", month.toString());

            const res = await fetch("/api/admin/schedule/ocr", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success && data.data) {
                if (data.data.days?.length) setDays(data.data.days);
                if (data.data.doctors?.length) setDoctors(data.data.doctors);
                if (data.imagePath) setUploadedImage(data.imagePath);
                alert("AI 분석이 완료되었습니다! 결과를 확인하고 수정해주세요.");
            } else {
                alert(data.error || "분석에 실패했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("분석 중 오류가 발생했습니다.");
        }
        setAnalyzing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save doctors
            await fetch("/api/admin/doctors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctors }),
            });

            // Save schedule
            await fetch("/api/admin/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year, month, days, doctors, footerLines, businessHours }),
            });

            alert("저장되었습니다!");
        } catch {
            alert("저장 중 오류가 발생했습니다.");
        }
        setSaving(false);
    };

    const handleClear = () => {
        setConfirmModal({
            message: `${year}년 ${month}월 시간표를 초기화할까요?`,
            onConfirm: async () => {
                setDays(generateEmptyDays(year, month));
                setUploadedImage(null);
                try {
                    await fetch(`/api/admin/schedule?year=${year}&month=${month}`, { method: "DELETE" });
                } catch { /* ignore */ }
                setConfirmModal(null);
            }
        });
    };

    const updateDay = (date: number, field: "am" | "pm" | "holidayName", value: string) => {
        setDays((prev) =>
            prev.map((d) => (d.date === date ? { ...d, [field]: value } : d))
        );
    };

    const toggleHoliday = (date: number) => {
        setDays((prev) =>
            prev.map((d) => {
                if (d.date !== date) return d;
                const newHoliday = !d.isHoliday;
                return {
                    ...d,
                    isHoliday: newHoliday,
                    isClosed: newHoliday ? true : d.dayOfWeek === 6,
                    holidayName: newHoliday ? (d.holidayName || "공휴일") : undefined,
                };
            })
        );
    };

    const toggleClosed = (date: number) => {
        setDays((prev) =>
            prev.map((d) => {
                if (d.date !== date) return d;
                return { ...d, isClosed: !d.isClosed, am: !d.isClosed ? "" : d.am, pm: !d.isClosed ? "" : d.pm };
            })
        );
    };

    // Doctor management
    const addDoctor = () => {
        const colorIdx = doctors.length % DEFAULT_COLORS.length;
        setDoctors((prev) => [...prev, { abbr: "", name: "", color: DEFAULT_COLORS[colorIdx] }]);
    };

    const removeDoctor = (idx: number) => {
        setDoctors((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateDoctor = (idx: number, field: keyof Doctor, value: string) => {
        setDoctors((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)));
    };

    // Footer management
    const addFooterLine = () => {
        setFooterLines((prev) => [...prev, { text: "", color: "#000000", size: 14, bold: false }]);
    };

    const removeFooterLine = (idx: number) => {
        setFooterLines((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateFooterLine = (idx: number, field: keyof FooterLine, value: string | number | boolean) => {
        setFooterLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
    };

    const applyWeekToAll = (sourceWIdx: number) => {
        setConfirmModal({
            message: `${sourceWIdx + 1}주의 일정을 이번 달 모든 주에 동일하게 복사하시겠습니까?\n(기존 일정에 덮어쓰기 되지만, 적용 후 개별 수정이 가능합니다)`,
            onConfirm: () => {
                const currentWeeks = groupByWeeks(days, year, month);
                const sourceWeek = currentWeeks[sourceWIdx];
                const validSourceDays = sourceWeek.filter(d => d.date > 0);

                setDays((prev) => {
                    return prev.map((day) => {
                        if (day.date === 0) return day;
                        const sourceDay = validSourceDays.find(d => d.dayOfWeek === day.dayOfWeek);
                        if (!sourceDay) return day;
                        return {
                            ...day,
                            am: sourceDay.am,
                            pm: sourceDay.pm,
                            isClosed: sourceDay.isClosed
                        };
                    });
                });
                setConfirmModal(null);
            }
        });
    };

    const weeks = groupByWeeks(days, year, month);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center font-pretendard">
                <div className="animate-spin h-8 w-8 border-4 border-deep-blue border-t-transparent rounded-full" />
            </main>
        );
    }

    return (
        <>
            {user && user.autoLogoutMinutes && <AdminSessionMonitor autoLogoutMinutes={user.autoLogoutMinutes} />}
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-pretendard pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <h1 className="text-2xl font-black text-gray-900">진료 시간표 관리</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "저장 중..." : "저장하기"}
                        </button>
                    </div>
                </motion.div>

                {/* ═══ Step 1: Doctor Settings ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden"
                >
                    <button
                        onClick={() => setShowDoctorSetup(!showDoctorSetup)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                    >
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-purple-500" />
                            1. 원장 설정
                            <span className="text-sm font-normal text-gray-400 ml-2">
                                ({doctors.length}명)
                            </span>
                        </h2>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showDoctorSetup ? "rotate-90" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {showDoctorSetup && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 space-y-3">
                                    {doctors.map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                                            <input
                                                type="color"
                                                value={doc.color}
                                                onChange={(e) => updateDoctor(idx, "color", e.target.value)}
                                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={doc.abbr}
                                                onChange={(e) => updateDoctor(idx, "abbr", e.target.value)}
                                                placeholder="약자"
                                                className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-center focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                            />
                                            <input
                                                type="text"
                                                value={doc.name}
                                                onChange={(e) => updateDoctor(idx, "name", e.target.value)}
                                                placeholder="이름 (예: 김성현 원장님)"
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                            />
                                            <button
                                                onClick={() => removeDoctor(idx)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addDoctor}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 font-bold text-sm hover:bg-purple-100 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        원장 추가
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ═══ Step 2: Year/Month + Image Upload ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-6"
                >
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-500" />
                        2. 연/월 선택 및 이미지 업로드
                    </h2>

                    {/* Year/Month Selector */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <select
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-deep-blue/20"
                            >
                                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - 1 + i).map((y) => (
                                    <option key={y} value={y}>{y}년</option>
                                ))}
                            </select>
                            <select
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-deep-blue/20"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>{m}월</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => changeMonth(1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Image Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${analyzing ? "border-purple-300 bg-purple-50/30" : "border-gray-200 hover:border-deep-blue/40 hover:bg-blue-50/30"
                            }`}
                        onClick={() => !analyzing && fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && !analyzing) handleOCR(file);
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleOCR(file);
                            }}
                        />
                        {analyzing ? (
                            <div className="py-4">
                                <div className="animate-spin h-10 w-10 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-3" />
                                <p className="text-purple-600 font-bold">AI가 시간표를 분석하고 있습니다...</p>
                                <p className="text-xs text-purple-400 mt-1">잠시만 기다려주세요 (약 10~30초)</p>
                            </div>
                        ) : uploadedImage ? (
                            <div className="relative w-full max-w-2xl mx-auto">
                                <Image
                                    src={uploadedImage}
                                    alt="업로드된 시간표"
                                    width={800}
                                    height={400}
                                    className="object-contain rounded-lg mx-auto"
                                />
                                <p className="text-xs text-gray-400 mt-2">클릭하여 새 이미지로 교체</p>
                            </div>
                        ) : (
                            <div className="py-4">
                                <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">시간표 이미지를 업로드하면 AI가 자동으로 분석합니다</p>
                                <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP 지원 — 드래그 또는 클릭</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ═══ Step 3: Calendar Editor ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-6"
                >
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-green-500" />
                        3. 달력 편집
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            (각 셀을 클릭하여 원장을 선택하세요)
                        </span>
                    </h2>

                    {/* Calendar Header */}
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-black text-deep-blue">
                            {year}년 {month}월
                        </h3>
                    </div>

                    {/* Calendar Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="w-16 py-2 text-xs font-bold text-gray-400 uppercase"></th>
                                    {DAY_NAMES.map((d, i) => (
                                        <th key={d} className={`py-2 text-sm font-bold ${i === 5 ? "text-blue-500" : "text-gray-700"}`}>
                                            {d}
                                        </th>
                                    ))}
                                    <th className="w-20 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {weeks.map((week, wIdx) => (
                                    <>
                                        {/* Date Row */}
                                        <tr key={`date-${wIdx}`} className="border-t border-gray-100">
                                            <td className="py-1 text-center text-xs text-gray-300 font-bold">{wIdx + 1}주</td>
                                            {week.map((day, dIdx) => (
                                                <td key={dIdx} className="py-1 text-center relative">
                                                    {day.date > 0 && (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className={`text-sm font-black ${day.isHoliday || day.isClosed ? "text-red-500" : day.dayOfWeek === 5 ? "text-blue-500" : "text-gray-800"
                                                                }`}>
                                                                {day.date}
                                                            </span>
                                                            {day.isHoliday && (
                                                                <input
                                                                    type="text"
                                                                    value={day.holidayName || ""}
                                                                    onChange={(e) => updateDay(day.date, "holidayName", e.target.value)}
                                                                    placeholder="공휴일명"
                                                                    className="w-full text-[9px] text-red-500 font-bold text-center bg-transparent border-b border-red-200 focus:border-red-400 outline-none px-0 mt-0.5 placeholder:text-red-200"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            <td rowSpan={4} className="align-middle text-center border-l border-gray-50 bg-gray-50/30 w-20 px-1">
                                                <button
                                                    onClick={() => applyWeekToAll(wIdx)}
                                                    className="w-full text-[10px] py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors flex flex-col items-center gap-0.5 border border-blue-100 shadow-sm"
                                                    title="이 주의 스케줄을 이번 달의 다른 모든 주에 동일하게 적용합니다."
                                                >
                                                    <span>이 주를</span>
                                                    <span>모든 주에</span>
                                                    <span>적용</span>
                                                </button>
                                            </td>
                                        </tr>
                                        {/* AM Row */}
                                        <tr key={`am-${wIdx}`}>
                                            <td className="py-0.5 text-center text-[10px] text-gray-300 font-bold">오전</td>
                                            {week.map((day, dIdx) => (
                                                <td key={dIdx} className="py-0.5 px-0.5">
                                                    {day.date > 0 && !day.isClosed && (
                                                        <CellEditor
                                                            value={day.am}
                                                            doctors={doctors}
                                                            isEditing={editingCell?.date === day.date && editingCell?.period === "am"}
                                                            onStartEdit={() => setEditingCell({ date: day.date, period: "am" })}
                                                            onChange={(v) => { updateDay(day.date, "am", v); setEditingCell(null); }}
                                                            onCancel={() => setEditingCell(null)}
                                                        />
                                                    )}
                                                    {day.date > 0 && day.isClosed && (
                                                        <div className="text-center text-xs text-red-300 font-bold py-1">휴진</div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                        {/* PM Row */}
                                        <tr key={`pm-${wIdx}`} className="border-b border-gray-100">
                                            <td className="py-0.5 text-center text-[10px] text-gray-300 font-bold">오후</td>
                                            {week.map((day, dIdx) => (
                                                <td key={dIdx} className="py-0.5 px-0.5">
                                                    {day.date > 0 && !day.isClosed && (
                                                        <CellEditor
                                                            value={day.pm}
                                                            doctors={doctors}
                                                            isEditing={editingCell?.date === day.date && editingCell?.period === "pm"}
                                                            onStartEdit={() => setEditingCell({ date: day.date, period: "pm" })}
                                                            onChange={(v) => { updateDay(day.date, "pm", v); setEditingCell(null); }}
                                                            onCancel={() => setEditingCell(null)}
                                                        />
                                                    )}
                                                    {day.date > 0 && day.isClosed && (
                                                        <div className="text-center text-xs text-red-300 font-bold py-1">휴진</div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Action Row (Holiday/Closed toggle) */}
                                        <tr key={`action-${wIdx}`}>
                                            <td></td>
                                            {week.map((day, dIdx) => (
                                                <td key={dIdx} className="pb-2">
                                                    {day.date > 0 && (
                                                        <div className="flex justify-center gap-1">
                                                            <button
                                                                onClick={() => toggleHoliday(day.date)}
                                                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${day.isHoliday ? "bg-red-100 text-red-500" : "text-gray-300 hover:text-red-400"
                                                                    }`}
                                                            >
                                                                공휴
                                                            </button>
                                                            <button
                                                                onClick={() => toggleClosed(day.date)}
                                                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors ${day.isClosed ? "bg-gray-200 text-gray-500" : "text-gray-300 hover:text-gray-500"
                                                                    }`}
                                                            >
                                                                휴진
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Business Hours Settings */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-2 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
                            <span className="text-sm font-bold text-blue-500">오전 진료</span>
                            <input
                                type="time"
                                value={businessHours.amStart}
                                onChange={(e) => setBusinessHours(prev => ({ ...prev, amStart: e.target.value }))}
                                className="px-2 py-1 rounded border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-200 outline-none"
                            />
                            <span className="text-gray-400">~</span>
                            <input
                                type="time"
                                value={businessHours.amEnd}
                                onChange={(e) => setBusinessHours(prev => ({ ...prev, amEnd: e.target.value }))}
                                className="px-2 py-1 rounded border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-200 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50/50 px-4 py-2 rounded-xl border border-orange-100">
                            <span className="text-sm font-bold text-orange-500">오후 진료</span>
                            <input
                                type="time"
                                value={businessHours.pmStart}
                                onChange={(e) => setBusinessHours(prev => ({ ...prev, pmStart: e.target.value }))}
                                className="px-2 py-1 rounded border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-orange-200 outline-none"
                            />
                            <span className="text-gray-400">~</span>
                            <input
                                type="time"
                                value={businessHours.pmEnd}
                                onChange={(e) => setBusinessHours(prev => ({ ...prev, pmEnd: e.target.value }))}
                                className="px-2 py-1 rounded border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-orange-200 outline-none"
                            />
                        </div>
                    </div>

                    {/* Doctor Legend */}
                    {doctors.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                            {doctors.map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                    <span
                                        className="text-sm font-black"
                                        style={{ color: doc.color }}
                                    >
                                        {doc.abbr}
                                    </span>
                                    <span className="text-xs text-gray-500">: {doc.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ═══ Step 4: Footer Messages ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5 text-orange-500" />
                        4. 하단 문구 설정
                    </h2>

                    <div className="space-y-3">
                        {footerLines.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-2 group">
                                <span className="text-xs font-bold text-gray-300 w-5">{idx + 1}</span>
                                <input
                                    type="text"
                                    value={line.text}
                                    onChange={(e) => updateFooterLine(idx, "text", e.target.value)}
                                    placeholder="문구를 입력하세요..."
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                    style={{ fontWeight: line.bold ? 700 : 400, color: line.color, fontSize: `${line.size}px` }}
                                />
                                <input
                                    type="color"
                                    value={line.color}
                                    onChange={(e) => updateFooterLine(idx, "color", e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                                    title="글자색"
                                />
                                <select
                                    value={line.size}
                                    onChange={(e) => updateFooterLine(idx, "size", parseInt(e.target.value))}
                                    className="w-16 px-1 py-2 rounded-lg border border-gray-200 text-xs"
                                    title="글자 크기"
                                >
                                    {[10, 11, 12, 13, 14, 16, 18, 20].map((s) => (
                                        <option key={s} value={s}>{s}px</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => updateFooterLine(idx, "bold", !line.bold)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${line.bold ? "bg-deep-blue text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                        }`}
                                    title="굵게"
                                >
                                    <BoldIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeFooterLine(idx)}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addFooterLine}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 font-bold text-sm hover:bg-orange-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            줄 추가
                        </button>
                    </div>

                    {/* Preview */}
                    {footerLines.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-2 font-bold">미리보기:</p>
                            <div className="space-y-0.5">
                                {footerLines.map((line, idx) => (
                                    <p
                                        key={idx}
                                        style={{
                                            color: line.color,
                                            fontSize: `${line.size}px`,
                                            fontWeight: line.bold ? 700 : 400,
                                        }}
                                    >
                                        {line.text || "(빈 줄)"}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ═══ Confirmation Modal ═══ */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <p className="text-gray-800 font-medium text-sm whitespace-pre-line mb-6">{confirmModal.message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmModal.onConfirm}
                                className="flex-1 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                            >
                                확인
                            </button>
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
        </>
    );
}

/* ─── Cell Editor Component ─── */
interface CellEditorProps {
    value: string;
    doctors: Doctor[];
    isEditing: boolean;
    onStartEdit: () => void;
    onChange: (v: string) => void;
    onCancel: () => void;
}

function CellEditor({
    value,
    doctors,
    isEditing,
    onStartEdit,
    onChange,
    onCancel,
}: CellEditorProps) {
    const [localAbbrs, setLocalAbbrs] = useState<string[]>([]);

    useEffect(() => {
        if (isEditing) {
            setLocalAbbrs(value ? value.split("/").filter(Boolean) : []);
        }
    }, [isEditing, value]);

    const abbrsForDisplay = value ? value.split("/").filter(Boolean) : [];

    if (isEditing) {
        return (
            <div className="relative">
                <div className="absolute z-10 top-0 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[120px]">
                    <div className="space-y-1 mb-2">
                        {doctors.map((doc) => {
                            const isSelected = localAbbrs.includes(doc.abbr);
                            return (
                                <button
                                    key={doc.abbr}
                                    onClick={() => {
                                        let newAbbrs: string[];
                                        if (isSelected) {
                                            newAbbrs = localAbbrs.filter((a) => a !== doc.abbr);
                                        } else {
                                            newAbbrs = [...localAbbrs.filter(a => a !== "휴진"), doc.abbr];
                                        }
                                        setLocalAbbrs(newAbbrs);
                                    }}
                                    className={`w-full px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${isSelected
                                        ? "bg-blue-50 ring-1 ring-blue-200"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <span
                                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px]"
                                        style={{
                                            borderColor: doc.color,
                                            backgroundColor: isSelected ? doc.color : "transparent",
                                            color: isSelected ? "white" : doc.color,
                                        }}
                                    >
                                        {isSelected && "✓"}
                                    </span>
                                    <span style={{ color: doc.color }}>{doc.abbr}</span>
                                    <span className="text-gray-400 text-[10px]">{doc.name}</span>
                                </button>
                            );
                        })}

                        {/* Empty/Closed option */}
                        <button
                            onClick={() => {
                                if (localAbbrs.includes("휴진")) setLocalAbbrs([]);
                                else setLocalAbbrs(["휴진"]);
                            }}
                            className={`w-full px-2 py-1.5 mt-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${localAbbrs.includes("휴진")
                                ? "bg-red-50 text-red-500 ring-1 ring-red-200"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            휴진
                        </button>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onChange(localAbbrs.join("/"))}
                            className="flex-1 py-1 text-[10px] font-bold bg-deep-blue text-white rounded-lg"
                        >
                            확인
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 py-1 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-lg"
                        >
                            취소
                        </button>
                    </div>
                </div>
                <div className="h-8 rounded-lg bg-blue-50 border-2 border-blue-300" />
            </div>
        );
    }

    return (
        <button
            onClick={onStartEdit}
            className="w-full h-8 rounded-lg border border-gray-100 hover:border-deep-blue/40 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-0.5 text-xs"
        >
            {abbrsForDisplay.length > 0 ? (
                abbrsForDisplay.includes("휴진") ? (
                    <span className="font-bold text-red-400">휴진</span>
                ) : (
                    abbrsForDisplay.map((a, i) => {
                        const doc = doctors.find((d) => d.abbr === a);
                        return (
                            <span key={i}>
                                {i > 0 && <span className="text-gray-300">/</span>}
                                <span className="font-black" style={{ color: doc?.color || "#333" }}>
                                    {a}
                                </span>
                            </span>
                        );
                    })
                )
            ) : (
                <span className="text-gray-200">-</span>
            )}
        </button>
    );
}
