import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_KR({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-sans",
});

const serif = Noto_Serif_KR({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-serif",
});

export const metadata: Metadata = {
    title: "경기고 89회 불어반 골프회",
    description: "품격 있는 리더들의 특별한 만남, 경기고 89회 불어반 골프회",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="scroll-smooth">
            <body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
