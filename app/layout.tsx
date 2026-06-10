import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hiveborn",
  description: "Quality products from the hive. Shop our selection and have them shipped to you.",
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
            <a href="/" className="flex items-center gap-2">
              <img 
                src="/images/logo.jpg" 
                alt="Hiveborn" 
                className="h-8 w-auto" 
              />
              <span className="font-semibold tracking-tighter text-2xl">Hiveborn</span>
            </a>
            <div className="flex items-center gap-6 text-sm">
              <a href="#products" className="hover:underline">Shop</a>
              <a href="/cart" className="hover:underline">Cart</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t mt-auto py-8 text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-6">© Hiveborn. Quality products, shipped with care.</div>
        </footer>
      </body>
    </html>
  );
}
