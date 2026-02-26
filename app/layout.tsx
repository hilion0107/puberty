import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "성조숙증 바로 알기 | 보호자 설명 가이드",
  description:
    "우리 아이의 건강한 성장을 위한 성조숙증 보호자 설명 가이드. HPG 축 기전, 진단 검사, 치료 방법, 안전성 정보를 쉽게 확인하세요.",
  keywords: "성조숙증, 조기 사춘기, 보호자 가이드, 소아내분비, GnRH, 성장",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
