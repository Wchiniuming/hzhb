import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AntdProvider from "@/components/AntdProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "合作伙伴支撑能力全景管理平台",
  description: "合作平台支撑能力管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdProvider>
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
