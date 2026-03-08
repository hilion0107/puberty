"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, Users as UsersIcon, Shield, Trash2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Admin {
    id: number;
    username: string;
    admin_type: string;
    created_at: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adminType, setAdminType] = useState("대표");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [editPassword, setEditPassword] = useState("");
    const [editConfirmPassword, setEditConfirmPassword] = useState("");
    const [editAdminType, setEditAdminType] = useState("대표");

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => res.json())
            .then((data) => {
                if (!data.authenticated) router.push("/admin");
                else loadAdmins();
            })
            .catch(() => router.push("/admin"));
    }, [router]);

    const loadAdmins = async () => {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setAdmins(data.admins || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, admin_type: adminType }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess("관리자가 추가되었습니다!");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setAdminType("대표");
            loadAdmins();
        } catch {
            setError("서버 오류가 발생했습니다.");
        }
    };

    const handleDelete = (id: number) => {
        setConfirmModal({
            message: "이 관리자 계정을 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
                    const data = await res.json();

                    if (!res.ok) {
                        alert(data.error || "삭제에 실패했습니다.");
                        setConfirmModal(null);
                        return;
                    }

                    setSuccess("관리자가 삭제되었습니다.");
                    loadAdmins();
                } catch {
                    setError("서버 오류가 발생했습니다.");
                }
                setConfirmModal(null);
            }
        });
    };

    const handleEditClick = (admin: Admin) => {
        setEditingAdmin(admin);
        setEditAdminType(admin.admin_type || "대표");
        setEditPassword("");
        setEditConfirmPassword("");
        setError("");
        setSuccess("");
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (editPassword && editPassword !== editConfirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingAdmin?.id,
                    password: editPassword,
                    admin_type: editAdminType
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess("관리자 정보가 수정되었습니다.");
            setEditingAdmin(null);
            loadAdmins();
        } catch {
            setError("서버 오류가 발생했습니다.");
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
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-pretendard pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900">관리자 계정 관리</h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add Admin Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">새 관리자 추가</h2>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 font-medium">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">아이디</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="새 관리자 아이디"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">비밀번호</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호 (4자 이상)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="비밀번호 확인"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">관리자 유형</label>
                                <select
                                    value={adminType}
                                    onChange={(e) => setAdminType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue bg-white"
                                >
                                    <option value="대표">대표</option>
                                    <option value="의사">의사</option>
                                    <option value="간호">간호</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                관리자 추가
                            </button>
                        </form>
                    </motion.div>

                    {/* Admin List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <UsersIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">관리자 목록</h2>
                        </div>
                        <div className="space-y-3">
                            {admins.map((admin) => (
                                <div
                                    key={admin.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-deep-blue/10 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-deep-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-800">{admin.username}</p>
                                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-deep-blue text-[10px] font-bold">
                                                {admin.admin_type || "대표"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(admin.created_at).toLocaleDateString("ko-KR")} 가입
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditClick(admin)}
                                            className="p-2 text-gray-400 hover:text-deep-blue hover:bg-blue-50 rounded-lg transition-colors"
                                            title="관리자 수정"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(admin.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="관리자 삭제"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <p className="text-gray-800 font-medium text-sm whitespace-pre-line mb-6">{confirmModal.message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmModal.onConfirm}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
                            >
                                삭제
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

            {/* Edit Admin Modal */}
            {editingAdmin && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Edit2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">관리자 계정 수정</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            <strong className="text-gray-900">{editingAdmin.username}</strong> 님의 계정 정보를 수정합니다.
                        </p>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">새 비밀번호 (선택)</label>
                                <input
                                    type="password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                    placeholder="변경하려면 입력 (4자 이상)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                    minLength={4}
                                />
                            </div>
                            {editPassword && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">비밀번호 확인</label>
                                    <input
                                        type="password"
                                        value={editConfirmPassword}
                                        onChange={(e) => setEditConfirmPassword(e.target.value)}
                                        placeholder="비밀번호 확인"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">관리자 유형</label>
                                <select
                                    value={editAdminType}
                                    onChange={(e) => setEditAdminType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue bg-white"
                                >
                                    <option value="대표">대표</option>
                                    <option value="의사">의사</option>
                                    <option value="간호">간호</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-deep-blue text-white font-bold text-sm hover:bg-blue-800 transition-colors"
                                >
                                    저장
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingAdmin(null)}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
