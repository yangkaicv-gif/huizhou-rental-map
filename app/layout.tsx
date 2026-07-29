import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "惠州租房选址地图｜宙邦化工项目通勤",
  description: "围绕惠州宙邦化工20万吨电池化学品项目，筛选三房两卫、3500元内、30分钟通勤及相对防涝的小区。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
