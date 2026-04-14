import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AntdProvider from "@/components/AntdProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="zh-CN" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col antialiased">
        <AntdProvider>
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
