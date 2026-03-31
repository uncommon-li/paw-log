import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomNav } from '@/src/components/layout/BottomNav'
import { ReminderSyncProvider } from '@/src/components/ReminderSyncProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paw Log · 宠物健康档案",
  description: "宠物健康记录与到期提醒",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${geistSans.variable}`}>
      <body className="antialiased">
        <ReminderSyncProvider>
          {children}
          <BottomNav />
        </ReminderSyncProvider>
      </body>
    </html>
  );
}
