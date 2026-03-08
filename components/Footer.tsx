import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[#f8f9fa] border-t border-gray-200 py-5 text-gray-600 font-pretendard">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-4">
                {/* Left Section: Info */}
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                    {/* Logo (Hidden on mobile as requested) */}
                    <Link href="/" className="hidden md:inline-block w-fit">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/images/cloud_logo_clean.png"
                                alt="우리들소아청소년과의원 로고"
                                width={32}
                                height={19}
                                className="object-contain"
                            />
                            <span className="text-xs font-black text-gray-900 tracking-tight">
                                우리들소아청소년과의원
                            </span>
                        </div>
                    </Link>

                    {/* Business Info Layout */}
                    <div className="text-[13px] md:text-[13px] leading-snug text-gray-500 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="font-bold text-gray-700">상호명:</span>
                            <span>우리들소아청소년과의원</span>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span className="font-bold text-gray-700">대표자:</span>
                            <span>최지연, 김성현, 이진환</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1">
                            <div className="flex items-center gap-x-2">
                                <span className="font-bold text-gray-700">사업자등록번호:</span>
                                <span>314-92-85922</span>
                            </div>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <div className="flex items-center gap-x-2">
                                <span className="font-bold text-gray-700">주소:</span>
                                <span>대전 유성구 노은로 170 스타시티빌딩 602~603</span>
                            </div>
                        </div>
                        {/* Mobile Only Contact Info (integrated for consistent line height) */}
                        <div className="md:hidden flex items-baseline gap-3 pt-0.5">
                            <a
                                href="tel:042-862-7582"
                                className="text-[14px] font-black text-gray-500 hover:text-blue-800 transition-colors"
                            >
                                <span className="text-gray-400 text-xs font-bold mr-1 uppercase tracking-widest">TEL:</span>
                                042-862-7582
                            </a>
                            <span className="text-xs font-medium text-gray-500">
                                <span className="text-gray-300 mx-1">|</span>
                                FAX: 042-862-7583
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Contact (Hidden on mobile as it's integrated above) */}
                <div className="hidden md:flex flex-col w-full md:w-1/3 md:items-end">
                    <div className="flex flex-col gap-0.5 md:text-right">
                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            Customer Center
                        </span>
                        <a
                            href="tel:042-862-7582"
                            className="text-xl font-black text-[#355DBB] hover:text-blue-800 transition-colors"
                        >
                            042-862-7582
                        </a>
                        <span className="text-xs font-medium text-gray-500">
                            FAX: 042-862-7583
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Legal Section */}
            <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-col items-center justify-center text-[11px] text-gray-400">
                <p>Copyright ⓒ 우리들소아청소년과의원 All rights reserved.</p>
            </div>
        </footer>
    );
}
