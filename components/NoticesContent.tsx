"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronRight, Search, Pin, ChevronLeft, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

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
}

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

interface NoticesContentProps {
    initialNotices: Notice[];
    initialItemsPerPage: number;
}

export default function NoticesContent({ initialNotices, initialItemsPerPage }: NoticesContentProps) {
    const [notices, setNotices] = useState<Notice[]>(initialNotices || []);
    const [loading, setLoading] = useState(!initialNotices);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage || 7);

    useEffect(() => {
        if (!initialNotices || initialNotices.length === 0) {
            fetch("/api/admin/notices")
                .then((res) => res.json())
                .then((data) => {
                    setNotices(data.notices || []);
                    setItemsPerPage(data.itemsPerPage || 7);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [initialNotices]);

    const filtered = notices.filter(
        (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginatedNotices = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <main className="min-h-screen bg-white font-pretendard selection:bg-deep-blue selection:text-white pt-20">
            <section className="relative py-12 md:py-[72px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30" />
                <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-deep-blue text-sm font-bold tracking-wider uppercase mb-3 text-[13px]">
                            Notice
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
                            공지사항
                        </h1>
                        <p className="text-lg text-gray-400 font-medium">
                            우리들소아청소년과의 중요한 소식을 알려드립니다
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 max-w-lg mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="검색어를 입력하세요..."
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-blue/20 focus:border-deep-blue transition-all shadow-sm"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-9 md:py-[60px]">
                <div className="max-w-4xl mx-auto px-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin h-8 w-8 border-4 border-deep-blue border-t-transparent rounded-full" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">📋</div>
                            <p className="text-lg text-gray-300 font-semibold">
                                {search ? "검색 결과가 없습니다" : "아직 공지사항이 없습니다"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="space-y-3"
                            >
                                {paginatedNotices.map((notice) => (
                                    <motion.div key={notice.id} variants={itemVariant}>
                                        <Link
                                            href={`/notices/${notice.id}`}
                                            className={`group block p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${notice.is_pinned === 1
                                                ? "bg-amber-50/50 border-amber-200 hover:border-amber-300"
                                                : "bg-white border-gray-100 hover:border-blue-100"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {notice.is_pinned === 1 ? (
                                                            <Pin className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-deep-blue shrink-0" />
                                                        )}
                                                        <h3 className={`text-base font-bold group-hover:text-deep-blue transition-colors truncate ${notice.is_pinned === 1 ? "text-amber-900" : "text-gray-900"
                                                            }`}>
                                                            {notice.title_html && notice.title_html !== notice.title ? (
                                                                <span dangerouslySetInnerHTML={{ __html: notice.title_html }} />
                                                            ) : (
                                                                notice.title
                                                            )}
                                                        </h3>

                                                        {notice.image_path && (
                                                            <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                        )}
                                                        {notice.link_url && (
                                                            <ExternalLink className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 line-clamp-3 whitespace-pre-line ml-6">
                                                        {notice.content}
                                                    </p>
                                                    <div className="mt-3 ml-6 flex items-center gap-3 text-xs text-gray-300">
                                                        <span>{notice.author}</span>
                                                        <span>·</span>
                                                        <span>{new Date(notice.created_at).toLocaleDateString("ko-KR")}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-deep-blue group-hover:translate-x-1 transition-all shrink-0" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                                ? "bg-deep-blue text-white shadow-md"
                                                : "text-gray-400 hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
