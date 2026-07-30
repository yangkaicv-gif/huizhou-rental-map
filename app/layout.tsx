import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yangkaicv-gif.github.io/huizhou-rental-map/"),
  title: "大亚湾万达租房地图｜山景·精装·全配",
  description: "围绕大亚湾万达商圈，筛选山景不看海、三房两卫、精装修、家具齐全，并兼顾宙邦化工项目通勤与防涝的小区。",
  openGraph: {
    title: "大亚湾万达租房地图",
    description: "山景·精装·全配，兼顾宙邦化工项目通勤与防涝。",
    images: ["/huizhou-rental-map/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "大亚湾万达租房地图",
    description: "山景·精装·全配，兼顾通勤与防涝。",
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
