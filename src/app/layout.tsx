import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/AppWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FreshBus Dashboard",
  description: "FreshBus Alerts tracking and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className}`}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
