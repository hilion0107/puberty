"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingQuesButton() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin") || pathname.startsWith("/ques")) return null;

    return (
        <>
            <style>{`
                .ques-fab {
                    width: 52px;
                    transition: width 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
                    overflow: hidden;
                }
                @media (min-width: 640px) {
                    .ques-fab:hover {
                        width: 162px;
                    }
                    .ques-fab:hover .ques-fab-label {
                        opacity: 1;
                        max-width: 110px;
                    }
                    .ques-fab:hover .ques-fab-icon {
                        transform: scale(1.1);
                    }
                }
                .ques-fab-label {
                    opacity: 0;
                    max-width: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    transition: opacity 0.25s ease 0.05s, max-width 0.3s ease;
                }
                .ques-fab-icon {
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }
            `}</style>
            <Link
                href="/ques"
                className="ques-fab fixed bottom-6 right-6 z-40 flex items-center gap-2 px-[14px] py-3.5 rounded-full bg-deep-blue text-white font-bold text-sm shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:-translate-y-1"
            >
                <ClipboardList className="ques-fab-icon w-5 h-5" />
                <span className="ques-fab-label hidden sm:block text-sm font-bold">사전 문진표</span>
            </Link>
        </>
    );
}
