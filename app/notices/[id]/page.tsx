"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, ExternalLink, Pin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Notice {
    id: number;
    title: string;
    title_html: string;
    content: string;
    content_html: string;
    image_path: string;
    link_url: string;
    is_pinned: number;
    author: string;
    created_at: string;
    updated_at: string;
}

export default function NoticeDetailPage() {
    const params = useParams();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        fetch(`/api/admin/notices/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setNotice(data.notice || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center font-pretendard">
                <div className="animate-spin h-8 w-8 border-4 border-deep-blue border-t-transparent rounded-full" />
            </main>
        );
    }

    if (!notice) {
        return (
            <main className="min-h-screen bg-white font-pretendard pt-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-300 font-bold mb-4">공지사항을 찾을 수 없습니다</p>
                    <Link href="/notices" className="text-deep-blue font-bold text-sm hover:underline">
                        목록으로 돌아가기
                    </Link>
                </div>
            </main>
        );
    }

    const hasHtml = notice.content_html && notice.content_html.trim() !== "";

    return (
        <main className="min-h-screen bg-white font-pretendard pt-20 pb-20">
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Back */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/notices"
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-deep-blue transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        목록으로 돌아가기
                    </Link>
                </motion.div>

                {/* Article */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Pinned badge */}
                    {notice.is_pinned === 1 && (
                        <div className="flex items-center gap-2 mb-4">
                            <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />

                        </div>
                    )}

                    {notice.title_html && notice.title_html !== notice.title ? (
                        <h1
                            className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6"
                            dangerouslySetInnerHTML={{ __html: notice.title_html }}
                        />
                    ) : (
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">
                            {notice.title}
                        </h1>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 mb-8 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-medium">{notice.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(notice.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
                        </div>
                    </div>

                    {/* Image */}
                    {notice.image_path && (
                        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100">
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={notice.image_path}
                                    alt={notice.title}
                                    fill
                                    className="object-contain bg-gray-50"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {hasHtml ? (
                        <div
                            className="prose prose-gray max-w-none text-base text-gray-600 leading-relaxed font-medium"
                            dangerouslySetInnerHTML={{ __html: notice.content_html }}
                        />
                    ) : (
                        <div className="prose prose-gray max-w-none">
                            {notice.content.split("\n").map((paragraph, idx) => (
                                <p key={idx} className="text-base text-gray-600 leading-relaxed mb-4 font-medium">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Link URL */}
                    {notice.link_url && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <a
                                href={notice.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-deep-blue text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                관련 링크 열기
                            </a>
                        </div>
                    )}
                </motion.article>
            </div>
        </main>
    );
}
