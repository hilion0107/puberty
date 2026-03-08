import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리들소아청소년과 | 대전 성장 발달 전문 소아청소년과",
  description:
    "대전 유성구 노은동에 위치한 성장, 성조숙증, 아동발달 전문 우리들소아청소년과입니다. 전문의 3인 진료로 우리 아이의 건강한 성장을 함께합니다.",
  keywords: "대전 소아과, 유성 소아과, 노은동 소아과, 성장판 검사, 성조숙증 치료, 아동발달센터, 우리들소아청소년과",
  icons: {
    icon: "/images/cloud_logo_new.png",
  },
};

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import FloatingQuesButton from "../components/FloatingQuesButton";

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
      <body className="font-pretendard antialiased">
        <Navigation />
        {children}
        <Footer />
        <FloatingQuesButton />
      </body>
    </html>
  );
}
