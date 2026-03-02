"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Plus, Pencil, Trash2, X, Pin, PinOff,
    ArrowUp, ArrowDown, Upload, Link as LinkIcon, Settings,
    Bold, Italic, Underline, Palette, Type, Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Notice {
    id: number;
    title: string;
    content: string;
    content_html: string;
    image_path: string;
    link_url: string;
    is_pinned: number;
    sort_order: number;
    author: string;
    created_at: string;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px"];
const COLORS = ["#000000", "#333333", "#666666", "#1a56db", "#dc2626", "#16a34a", "#d97706", "#7c3aed"];

export default function AdminNoticesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [imagePath, setImagePath] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [showSettings, setShowSettings] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);
    const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
    const [showTitleSizePicker, setShowTitleSizePicker] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const titleEditorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) router.push("/admin");
                else {
                    loadNotices();
                    loadSettings();
                }
            })
            .catch(() => router.push("/admin"));
    }, [router]);

    const loadNotices = async () => {
        const res = await fetch("/api/admin/notices");
        const data = await res.json();
        setNotices(data.notices || []);
        setLoading(false);
    };

    const loadSettings = async () => {
        try {
            const res = await fetch("/api/admin/notices/settings");
            const data = await res.json();
            setItemsPerPage(data.itemsPerPage || 7);
        } catch { /* ignore */ }
    };

    const resetForm = () => {
        setTitle("");
        setLinkUrl("");
        setIsPinned(false);
        setImagePath("");
        setImageFile(null);
        setEditingId(null);
        if (editorRef.current) editorRef.current.innerHTML = "";
        if (titleEditorRef.current) titleEditorRef.current.innerHTML = "";
    };

    const handleSubmit = async () => {
        const titleText = titleEditorRef.current?.innerText || title;
        const titleHtml = titleEditorRef.current?.innerHTML || title;
        if (!titleText.trim()) return;

        const contentHtml = editorRef.current?.innerHTML || "";
        const contentText = editorRef.current?.innerText || "";

        try {
            const formData = new FormData();
            formData.append("title", titleText);
            formData.append("title_html", titleHtml);
            formData.append("content", contentText);
            formData.append("content_html", contentHtml);
            formData.append("link_url", linkUrl);
            formData.append("is_pinned", String(isPinned));
            if (imageFile) formData.append("image", imageFile);
            formData.append("existing_image_path", imagePath);

            if (editingId) {
                await fetch(`/api/admin/notices/${editingId}`, {
                    method: "PUT",
                    body: formData,
                });
            } else {
                await fetch("/api/admin/notices", {
                    method: "POST",
                    body: formData,
                });
            }
            resetForm();
            setShowForm(false);
            loadNotices();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (notice: Notice) => {
        setTitle(notice.title);
        setLinkUrl(notice.link_url || "");
        setIsPinned(notice.is_pinned === 1);
        setImagePath(notice.image_path || "");
        setImageFile(null);
        setEditingId(notice.id);
        setShowForm(true);
        setTimeout(() => {
            if (titleEditorRef.current) {
                titleEditorRef.current.innerHTML = (notice as any).title_html || notice.title || "";
            }
            if (editorRef.current) {
                editorRef.current.innerHTML = notice.content_html || notice.content || "";
            }
        }, 100);
    };

    const handleDelete = (notice: Notice) => {
        setConfirmModal({
            message: `"${notice.title}" 공지사항을 삭제하시겠습니까?`,
            onConfirm: async () => {
                try {
                    await fetch(`/api/admin/notices/${notice.id}`, { method: "DELETE" });
                    loadNotices();
                } catch (err) {
                    console.error(err);
                }
                setConfirmModal(null);
            },
        });
    };

    const handleTogglePin = async (notice: Notice) => {
        try {
            await fetch(`/api/admin/notices/${notice.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_pinned: notice.is_pinned !== 1 }),
            });
            loadNotices();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMoveUp = async (index: number) => {
        if (index <= 0) return;
        const newOrder = [...notices];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        setNotices(newOrder);
        await fetch("/api/admin/notices/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderedIds: newOrder.map((n) => n.id) }),
        });
    };

    const handleMoveDown = async (index: number) => {
        if (index >= notices.length - 1) return;
        const newOrder = [...notices];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        setNotices(newOrder);
        await fetch("/api/admin/notices/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderedIds: newOrder.map((n) => n.id) }),
        });
    };

    const handleSaveSettings = async () => {
        try {
            await fetch("/api/admin/notices/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemsPerPage }),
            });
            setShowSettings(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Rich text formatting commands
    const execCmd = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center font-pretendard">
                <div className="animate-spin h-8 w-8 border-4 border-deep-blue border-t-transparent rounded-full" />
            </main>
        );
    }

    return (
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
                        <h1 className="text-2xl font-black text-gray-900">공지사항 관리</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            <Settings className="w-4 h-4" />
                            설정
                        </button>
                        <button
                            onClick={() => { resetForm(); setShowForm(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            새 공지 작성
                        </button>
                    </div>
                </motion.div>

                {/* Settings Modal */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center"
                            onClick={() => setShowSettings(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-lg font-bold text-gray-800 mb-6">공지사항 설정</h2>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-600 mb-2">
                                        한 페이지에 표시할 공지사항 수
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="3"
                                            max="10"
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                            className="flex-1 accent-deep-blue"
                                        />
                                        <span className="text-2xl font-black text-deep-blue w-10 text-center">{itemsPerPage}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">3 ~ 10개 (기본: 7개)</p>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSaveSettings}
                                        className="px-6 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                                    >
                                        저장
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                                    {editingId ? "공지사항 수정" : "새 공지사항 작성"}
                                </h2>
                                <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Title with formatting */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">제목</label>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => { titleEditorRef.current?.focus(); document.execCommand("bold", false); }}
                                                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                title="굵게"
                                            >
                                                <Bold className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="w-px h-5 bg-gray-200 mx-0.5" />
                                            {/* Title Size */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowTitleSizePicker(!showTitleSizePicker); setShowTitleColorPicker(false); }}
                                                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                    title="글자 크기"
                                                >
                                                    <Type className="w-3.5 h-3.5" />
                                                </button>
                                                {showTitleSizePicker && (
                                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 min-w-[120px]">
                                                        {FONT_SIZES.map((sz) => (
                                                            <button
                                                                key={sz}
                                                                type="button"
                                                                onClick={() => {
                                                                    titleEditorRef.current?.focus();
                                                                    document.execCommand("fontSize", false, "7");
                                                                    const sel = window.getSelection();
                                                                    if (sel && sel.rangeCount > 0) {
                                                                        const editor = titleEditorRef.current;
                                                                        if (editor) {
                                                                            const fonts = editor.querySelectorAll('font[size="7"]');
                                                                            fonts.forEach((f) => {
                                                                                (f as HTMLElement).removeAttribute("size");
                                                                                (f as HTMLElement).style.fontSize = sz;
                                                                                const innerStyled = f.querySelectorAll('[style*="font-size"]');
                                                                                innerStyled.forEach(inner => {
                                                                                    (inner as HTMLElement).style.fontSize = '';
                                                                                });
                                                                            });
                                                                        }
                                                                    }
                                                                    setShowTitleSizePicker(false);
                                                                }}
                                                                className="block w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                                                                style={{ fontSize: sz }}
                                                            >
                                                                {sz}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Title Color */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowTitleColorPicker(!showTitleColorPicker); setShowTitleSizePicker(false); }}
                                                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                    title="글자 색상"
                                                >
                                                    <Palette className="w-3.5 h-3.5" />
                                                </button>
                                                {showTitleColorPicker && (
                                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {COLORS.map((color) => (
                                                                <button
                                                                    key={color}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        titleEditorRef.current?.focus();
                                                                        document.execCommand("foreColor", false, color);
                                                                        setShowTitleColorPicker(false);
                                                                    }}
                                                                    className="w-7 h-7 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                                                                    style={{ backgroundColor: color }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            ref={titleEditorRef}
                                            contentEditable
                                            className="px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none min-h-[44px]"
                                            data-placeholder="공지사항 제목"
                                            onFocus={() => { setShowTitleColorPicker(false); setShowTitleSizePicker(false); }}
                                            onInput={() => { setTitle(titleEditorRef.current?.innerText || ""); }}
                                        />
                                    </div>
                                </div>

                                {/* Rich Text Toolbar */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">내용</label>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => execCmd("bold")}
                                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                title="굵게"
                                            >
                                                <Bold className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => execCmd("italic")}
                                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                title="기울기"
                                            >
                                                <Italic className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => execCmd("underline")}
                                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                title="밑줄"
                                            >
                                                <Underline className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-6 bg-gray-200 mx-1" />

                                            {/* Font Size */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowSizePicker(!showSizePicker); setShowColorPicker(false); }}
                                                    className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                    title="글자 크기"
                                                >
                                                    <Type className="w-4 h-4" />
                                                </button>
                                                {showSizePicker && (
                                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 min-w-[120px]">
                                                        {FONT_SIZES.map((sz) => (
                                                            <button
                                                                key={sz}
                                                                type="button"
                                                                onClick={() => {
                                                                    execCmd("fontSize", "7");
                                                                    // Replace with specific size
                                                                    const sel = window.getSelection();
                                                                    if (sel && sel.rangeCount > 0) {
                                                                        const editor = editorRef.current;
                                                                        if (editor) {
                                                                            const fonts = editor.querySelectorAll('font[size="7"]');
                                                                            fonts.forEach((f) => {
                                                                                (f as HTMLElement).removeAttribute("size");
                                                                                (f as HTMLElement).style.fontSize = sz;
                                                                                const innerStyled = f.querySelectorAll('[style*="font-size"]');
                                                                                innerStyled.forEach(inner => {
                                                                                    (inner as HTMLElement).style.fontSize = '';
                                                                                });
                                                                            });
                                                                        }
                                                                    }
                                                                    setShowSizePicker(false);
                                                                }}
                                                                className="block w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                                                                style={{ fontSize: sz }}
                                                            >
                                                                {sz}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Color Picker */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowColorPicker(!showColorPicker); setShowSizePicker(false); }}
                                                    className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                                                    title="글자 색상"
                                                >
                                                    <Palette className="w-4 h-4" />
                                                </button>
                                                {showColorPicker && (
                                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {COLORS.map((color) => (
                                                                <button
                                                                    key={color}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        execCmd("foreColor", color);
                                                                        setShowColorPicker(false);
                                                                    }}
                                                                    className="w-7 h-7 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                                                                    style={{ backgroundColor: color }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Editable */}
                                        <div
                                            ref={editorRef}
                                            contentEditable
                                            className="min-h-[200px] px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none"
                                            onFocus={() => { setShowColorPicker(false); setShowSizePicker(false); }}
                                            style={{ lineHeight: "1.8" }}
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">이미지 (선택)</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                            이미지 선택
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setImageFile(file);
                                                    setImagePath(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        {imagePath && (
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                                                <Image src={imagePath} alt="첨부 이미지" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setImagePath(""); setImageFile(null); }}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Link URL */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">링크 URL (선택)</label>
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                        <input
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                        />
                                    </div>
                                </div>

                                {/* Pin Toggle */}
                                <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-4">
                                    <input
                                        type="checkbox"
                                        id="isPinned"
                                        checked={isPinned}
                                        onChange={(e) => setIsPinned(e.target.checked)}
                                        className="w-4 h-4 rounded accent-deep-blue"
                                    />
                                    <label htmlFor="isPinned" className="text-sm font-bold text-amber-800 cursor-pointer">
                                        📌 상단 고정
                                    </label>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); resetForm(); }}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-6 py-2.5 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                                    >
                                        {editingId ? "수정 완료" : "작성 완료"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notices List */}
                <div className="space-y-3">
                    {notices.length === 0 ? (
                        <div className="text-center py-20 text-gray-300">
                            <p className="text-lg font-semibold">아직 공지사항이 없습니다</p>
                            <p className="text-sm mt-1">위의 &quot;새 공지 작성&quot; 버튼을 클릭하여 시작하세요</p>
                        </div>
                    ) : (
                        notices.map((notice, idx) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow ${notice.is_pinned ? "border-amber-200 bg-amber-50/30" : "border-gray-100"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {notice.is_pinned === 1 && (
                                                <span className="text-amber-500 text-xs font-bold">📌</span>
                                            )}
                                            <h3 className="text-base font-bold text-gray-900 truncate">{notice.title}</h3>
                                            {notice.image_path && (
                                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px] font-bold">이미지</span>
                                            )}
                                            {notice.link_url && (
                                                <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-600 text-[10px] font-bold">링크</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{notice.content}</p>
                                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-300">
                                            <span>{notice.author}</span>
                                            <span>·</span>
                                            <span>{new Date(notice.created_at).toLocaleDateString("ko-KR")}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-4 shrink-0">
                                        {/* Move buttons */}
                                        <button
                                            onClick={() => handleMoveUp(idx)}
                                            disabled={idx === 0}
                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
                                            title="위로 이동"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleMoveDown(idx)}
                                            disabled={idx === notices.length - 1}
                                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
                                            title="아래로 이동"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-5 bg-gray-100 mx-0.5" />
                                        {/* Pin */}
                                        <button
                                            onClick={() => handleTogglePin(notice)}
                                            className={`p-2 rounded-lg transition-colors ${notice.is_pinned ? "bg-amber-100 text-amber-600" : "hover:bg-amber-50 text-gray-400 hover:text-amber-600"}`}
                                            title={notice.is_pinned ? "고정 해제" : "고정"}
                                        >
                                            {notice.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                        </button>
                                        {/* Edit */}
                                        <button
                                            onClick={() => handleEdit(notice)}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(notice)}
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
    );
}
