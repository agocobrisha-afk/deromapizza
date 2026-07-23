import type { Metadata } from "next";
import { Cairo, Changa, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./cart.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const changa = Changa({
  subsets: ["arabic", "latin"],
  variable: "--font-changa",
  weight: ["500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "De Roma Pizza",
  description: "بيتزا ومعجنات إيطالية بطابع عصري وخدمة طلب سريعة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${changa.variable} ${jakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}
