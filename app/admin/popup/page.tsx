"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Save, Eye, Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminSessionMonitor from "@/components/AdminSessionMonitor";

const SIZE_OPTIONS = [
    { label: "전체 (1)", value: "1" },
    { label: "1/2", value: "1/2" },
    { label: "1/3", value: "1/3" },
    { label: "1/4", value: "1/4" },
];

const POSITION_OPTIONS = [
    { label: "약간 위쪽 왼쪽", value: "top-left" },
    { label: "약간 위쪽 오른쪽", value: "top-right" },
    { label: "중앙", value: "center" },
    { label: "약간 아래쪽 왼쪽", value: "bottom-left" },
    { label: "약간 아래쪽 오른쪽", value: "bottom-right" },
];

const DURATION_OPTIONS = [
    { label: "1일", value: 1 },
    { label: "3일", value: 3 },
    { label: "1주일", value: 7 },
    { label: "2주일", value: 14 },
    { label: "1개월", value: 30 },
    { label: "3개월", value: 90 },
    { label: "6개월", value: 180 },
    { label: "1년", value: 365 },
];

interface PopupItem {
    id: number;
    title: string;
    imagePath: string;
    size: string;
    position: string;
    durationDays: number;
    isActive: boolean;
    linkUrl: string;
    createdAt: string;
}

export default function AdminPopupPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<{ username: string; autoLogoutMinutes?: number } | null>(null);
    const [popups, setPopups] = useState<PopupItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewPopup, setPreviewPopup] = useState<PopupItem | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [size, setSize] = useState("1/2");
    const [position, setPosition] = useState("center");
    const [durationDays, setDurationDays] = useState(7);
    const [isActive, setIsActive] = useState(true);
    const [linkUrl, setLinkUrl] = useState("");
    const [addToNotice, setAddToNotice] = useState(false);

    const loadPopups = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/popup?all=true");
            const data = await res.json();
            setPopups(data.popups || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) router.push("/admin");
                else {
                    setUser(data.user);
                    loadPopups();
                }
            })
            .catch(() => router.push("/admin"));
    }, [router, loadPopups]);

    const resetForm = () => {
        setTitle("");
        setImagePath("");
        setImageFile(null);
        setSize("1/2");
        setPosition("center");
        setDurationDays(7);
        setIsActive(true);
        setLinkUrl("");
        setAddToNotice(false);
        setEditingId(null);
    };

    const handleEdit = (popup: PopupItem) => {
        setTitle(popup.title);
        setImagePath(popup.imagePath);
        setImageFile(null);
        setSize(popup.size);
        setPosition(popup.position);
        setDurationDays(popup.durationDays);
        setIsActive(popup.isActive);
        setLinkUrl(popup.linkUrl || "");
        setAddToNotice(false);
        setEditingId(popup.id);
        setShowForm(true);
    };

    const handleDelete = (popup: PopupItem) => {
        setConfirmModal({
            message: `"${popup.title || "제목 없음"}" 팝업을 삭제하시겠습니까?`,
            onConfirm: async () => {
                try {
                    await fetch("/api/admin/popup", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: popup.id }),
                    });
                    loadPopups();
                } catch (err) {
                    console.error(err);
                }
                setConfirmModal(null);
            },
        });
    };

    const handleSave = async () => {
        if (!imagePath && !imageFile) {
            alert("이미지를 업로드해주세요.");
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            if (imageFile) formData.append("image", imageFile);
            formData.append("existingImagePath", imagePath);
            formData.append("title", title);
            formData.append("size", size);
            formData.append("position", position);
            formData.append("durationDays", String(durationDays));
            formData.append("isActive", String(isActive));
            formData.append("linkUrl", linkUrl);
            formData.append("addToNotice", String(addToNotice));
            if (editingId) formData.append("editId", String(editingId));

            await fetch("/api/admin/popup", { method: "POST", body: formData });
            resetForm();
            setShowForm(false);
            loadPopups();
        } catch {
            alert("저장 중 오류가 발생했습니다.");
        }
        setSaving(false);
    };

    const handleFileSelect = (file: File) => {
        setImageFile(file);
        setImagePath(URL.createObjectURL(file));
    };

    // Drag & drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
            handleFileSelect(file);
        }
    };

    const getPositionStyle = (pos: string): React.CSSProperties => {
        const base: React.CSSProperties = { position: "absolute" };
        switch (pos) {
            case "top-left": return { ...base, top: "10%", left: "10%" };
            case "top-right": return { ...base, top: "10%", right: "10%" };
            case "center": return { ...base, top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
            case "bottom-left": return { ...base, bottom: "10%", left: "10%" };
            case "bottom-right": return { ...base, bottom: "10%", right: "10%" };
            default: return { ...base, top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
        }
    };

    const getSizePercent = (sz: string): string => {
        switch (sz) {
            case "1": return "90%";
            case "1/2": return "50%";
            case "1/3": return "33%";
            case "1/4": return "25%";
            default: return "50%";
        }
    };

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
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <h1 className="text-2xl font-black text-gray-900">팝업 설정</h1>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        새 팝업 추가
                    </button>
                </motion.div>

                {/* Form Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-lg p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-800">
                                    {editingId ? "팝업 수정" : "새 팝업 추가"}
                                </h2>
                                <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Image & Title */}
                                <div className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1">팝업 제목</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="팝업 제목을 입력하세요"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                        />
                                    </div>
                                    {/* Link URL */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1">연결 링크 (URL)</label>
                                        <input
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            placeholder="클릭 시 이동할 주소 (예: https://...)"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                        />
                                    </div>

                                    {/* Image Upload with Drag & Drop */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1">팝업 이미지</label>
                                        <div
                                            ref={dropZoneRef}
                                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? "border-deep-blue bg-blue-50/50 scale-[1.02]" : "border-gray-200 hover:border-deep-blue/40"}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileSelect(file);
                                                }}
                                            />
                                            {imagePath ? (
                                                <div className="relative w-full">
                                                    {imageFile?.type === "application/pdf" || imagePath.toLowerCase().endsWith(".pdf") ? (
                                                        <iframe src={imagePath} className="w-full h-[400px] rounded-lg border-0 bg-white" title="PDF 미리보기" />
                                                    ) : (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img src={imagePath} alt="팝업 이미지" className="w-full h-auto rounded-lg" />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="py-6">
                                                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-400 font-medium">
                                                        이미지를 클릭하여 선택하거나
                                                    </p>
                                                    <p className="text-sm text-deep-blue font-bold">
                                                        드래그 앤 드롭하세요
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Settings */}
                                <div className="space-y-4">
                                    {/* Active Toggle */}
                                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800">팝업 활성화</h3>
                                            <p className="text-xs text-gray-400">홈페이지에 팝업을 표시합니다</p>
                                        </div>
                                        <button
                                            onClick={() => setIsActive(!isActive)}
                                            className={`relative w-14 h-7 rounded-full transition-colors ${isActive ? "bg-deep-blue" : "bg-gray-200"}`}
                                        >
                                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${isActive ? "left-[30px]" : "left-0.5"}`} />
                                        </button>
                                    </div>

                                    {/* Size */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">크기</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {SIZE_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSize(opt.value)}
                                                    className={`py-2 rounded-lg text-xs font-bold transition-all ${size === opt.value ? "bg-deep-blue text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Position */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">위치</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {POSITION_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setPosition(opt.value)}
                                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${position === opt.value ? "bg-deep-blue text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">표시 기간</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {DURATION_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setDurationDays(opt.value)}
                                                    className={`py-2 rounded-lg text-xs font-bold transition-all ${durationDays === opt.value ? "bg-deep-blue text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add to Notice */}
                                    {!editingId && (
                                        <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-4">
                                            <input
                                                type="checkbox"
                                                id="addToNotice"
                                                checked={addToNotice}
                                                onChange={(e) => setAddToNotice(e.target.checked)}
                                                className="w-4 h-4 rounded accent-deep-blue"
                                            />
                                            <label htmlFor="addToNotice" className="text-sm font-bold text-amber-800 cursor-pointer">
                                                공지사항에도 추가하기
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setPreviewPopup({
                                            id: 0,
                                            title,
                                            imagePath,
                                            size,
                                            position,
                                            durationDays,
                                            isActive,
                                            linkUrl,
                                            createdAt: "",
                                        });
                                        setShowPreview(true);
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    미리보기
                                </button>
                                <button
                                    onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "저장 중..." : editingId ? "수정 완료" : "저장하기"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Popups List */}
                <div className="space-y-3">
                    {popups.length === 0 ? (
                        <div className="text-center py-20 text-gray-300">
                            <div className="text-5xl mb-4">🖼️</div>
                            <p className="text-lg font-semibold">아직 등록된 팝업이 없습니다</p>
                            <p className="text-sm mt-1">위의 &quot;새 팝업 추가&quot; 버튼을 클릭하여 시작하세요</p>
                        </div>
                    ) : (
                        popups.map((popup, idx) => (
                            <motion.div
                                key={popup.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    {popup.imagePath && (
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                            <Image src={popup.imagePath} alt={popup.title || "팝업"} fill className="object-cover" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-gray-900 truncate">
                                                {popup.title || "제목 없음"}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${popup.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                                                {popup.isActive ? "활성" : "비활성"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span>크기: {popup.size}</span>
                                            <span>·</span>
                                            <span>기간: {popup.durationDays}일</span>
                                            <span>·</span>
                                            <span>{popup.createdAt ? new Date(popup.createdAt).toLocaleDateString("ko-KR") : ""}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setPreviewPopup(popup);
                                                setShowPreview(true);
                                            }}
                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(popup)}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(popup)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && previewPopup && (
                <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center" onClick={() => setShowPreview(false)}>
                    <div className="relative w-full h-full max-w-6xl max-h-[80vh] m-8 bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={() => setShowPreview(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-bold">닫기</button>
                        </div>
                        <div className="w-full h-full bg-gray-100 relative">
                            <div className="absolute top-4 left-4 text-xs text-gray-400 font-bold">미리보기</div>
                            {previewPopup.imagePath && (
                                <div style={{ ...getPositionStyle(previewPopup.position), width: getSizePercent(previewPopup.size) }} className="bg-white rounded-xl shadow-2xl overflow-hidden">
                                    <div className="relative w-full bg-white">
                                        {previewPopup.imagePath.toLowerCase().endsWith(".pdf") ? (
                                            <iframe src={previewPopup.imagePath} className="w-full min-h-[500px] border-0" title="PDF 팝업 미리보기" />
                                        ) : (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={previewPopup.imagePath} alt="팝업 미리보기" className="w-full h-auto" />
                                        )}
                                    </div>
                                    <div className="p-3 flex justify-between border-t border-gray-100">
                                        <button className="text-xs text-gray-400 hover:text-gray-600">오늘 하루 열지 않기</button>
                                        <button className="text-xs text-gray-400 hover:text-gray-600">닫기</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-6"
                    >
                        <p className="text-base font-bold text-gray-800 mb-6 text-center">{confirmModal.message}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm shadow-md hover:bg-red-600 transition-all"
                            >
                                삭제
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
        </>
    );
}
