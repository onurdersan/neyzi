import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persentil Hesaplayıcı",
  description: "Türk çocukları için büyüme persentil hesaplayıcısı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
