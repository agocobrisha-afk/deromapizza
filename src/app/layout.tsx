import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "دي روما | De Roma — بيتزا ولازانيا إيطالية، بنغازي",
  description:
    "دي روما، بيتزا ولازانيا إيطالية أصيلة في بنغازي. اطلب أونلاين وتوصلك جاهزة، أو احجز طاولتك.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${jakarta.variable} antialiased bg-cream text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
