import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFonts from "next/font/local";
import "./globals.css";


const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

const display = localFonts({
  src: '../public/assets/fonts/ClashDisplay-Variable.woff2',
  variable: "--font-clash",
  weight: '200 700',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Tau fincorp",
  description: "Tau fincorp pvt.ltd manages, analyzes and tracks you daily transactions in a single web application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
