import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yangkaicv-gif.github.io/huizhou-rental-map/"),
  title: "大亚湾山景租房地图｜精装·全配·通勤",
  description: "筛选大亚湾山景不看海、至少三房两卫、精装修、家具齐全，并兼顾宙邦化工项目通勤与防涝的小区。",
  openGraph: {
    title: "大亚湾山景租房地图",
    description: "精装·全配·通勤，兼顾宙邦化工项目通勤与防涝。",
    images: ["/huizhou-rental-map/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "大亚湾山景租房地图",
    description: "精装·全配·通勤，兼顾防涝。",
    images: ["/huizhou-rental-map/og.png"],
  },
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
