import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NoSSRShell } from '@/src/components/layout/NoSSRShell'

export const metadata: Metadata = {
  title: "Paw Log · 宠物健康档案",
  description: "宠物健康记录与到期提醒",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        <NoSSRShell>
          {children}
        </NoSSRShell>
      </body>
    </html>
  );
}
