import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { CONTACT_EMAIL, COPY } from "@/lib/copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-950">
        <nav className="border-b">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <img
                src="/images/logo.jpg"
                alt="Hiveborn"
                className="h-8 w-auto shrink-0"
              />
              <span className="font-semibold tracking-tighter text-2xl hidden sm:inline">Hiveborn</span>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 text-sm shrink-0">
              <a href="/#products" className="hover:underline">Shop</a>
              <a href="/cart" className="hover:underline">Cart</a>
              <span className="flex items-center gap-4 hidden sm:flex text-sm">
                <a href="https://www.instagram.com/hivebornhoney/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                <a href="https://www.facebook.com/p/Hiveborn-61578893080880/" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
              </span>
            </div>
          </div>
        </nav>
        {children}
        <Analytics />
        <footer className="border-t mt-auto py-8 text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              {COPY.footerPickup}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a>
              <div className="mt-1">{COPY.footerHoney}</div>
            </div>
            <span className="flex items-center gap-4">
              <a href="https://www.instagram.com/hivebornhoney/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
              <a href="https://www.facebook.com/p/Hiveborn-61578893080880/" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
