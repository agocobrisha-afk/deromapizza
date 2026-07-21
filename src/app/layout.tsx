import type { Metadata } from "next";
import { Cairo, El_Messiri, Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  variable: "--font-el-messiri",
  weight: ["500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "دي روما | De Roma — بيتزا ولازانيا إيطالية، بنغازي",
  description:
    "دي روما، بيتزا ولازانيا إيطالية أصيلة في بنغازي. اطلب أونلاين وتوصلك جاهزة، أو احجز طاولتك. بيتزا حجر، معجنات، وأطباق إيطالية بنكهة أصلية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${elMessiri.variable} ${fraunces.variable} ${manrope.variable} antialiased bg-char-900 text-cream-100`}
      >
        {children}
      </body>
    </html>
  );
}
