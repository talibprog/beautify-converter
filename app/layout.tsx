import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeautifyConverterKit - Free Online Developer Tools & Converters",
  description: "Fast, secure, client-side web tools. Format JSON, minification tools, network calculators, and converters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f6f9] text-gray-800">
        {/* GLOBAL HEADER NAVBAR */}
        <Header />

        {/* MAIN PAGE CONTENT */}
        <div className="flex-1">
          {children}
        </div>

        {/* GOOGLE ANALYTICS */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}