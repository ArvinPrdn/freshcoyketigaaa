import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freshcoy — Pantau perubahan. Tentukan pemanfaatan.",
  description: "Freshcoy membantu memberi konteks tambahan saat kondisi pakcoy berubah selama penyimpanan."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
