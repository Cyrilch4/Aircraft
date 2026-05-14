import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aircraft",
  description: "Gestion de réseau MLM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`${inter.className} min-h-full bg-white text-[#1D1D1F]`}>
        {children}
      </body>
    </html>
  );
}
