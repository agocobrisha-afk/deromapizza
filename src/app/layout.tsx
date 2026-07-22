import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans, El_Messiri } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/queries";
import { getThemePreset } from "@/lib/theme-presets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  variable: "--font-el-messiri",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "دي روما | De Roma — بيتزا ولازانيا إيطالية، بنغازي",
  description:
    "دي روما، بيتزا ولازانيا إيطالية أصيلة في بنغازي. اطلب أونلاين وتوصلك جاهزة، أو احجز طاولتك.",
};

const headingFontVar: Record<string, string> = {
  bold: "var(--font-jakarta)",
  elegant: "var(--font-el-messiri)",
  minimal: "var(--font-cairo)",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const theme = getThemePreset(settings.theme_id);
  const c = theme.colors;

  const themeStyle = `
    :root {
      --red: ${c.accent};
      --red-dark: ${c.accentDark};
      --red-tint: ${c.accentTint};
      --cream: ${c.bg};
      --white: ${c.surface};
      --ink: ${c.ink};
      --ink-soft: ${c.inkSoft};
      --ink-faint: ${c.inkFaint};
      --dark: ${c.dark};
      --dark-soft: ${c.darkSoft};
      --font-heading: ${headingFontVar[theme.fontPairing]};
      --font-body: var(--font-cairo);
    }
  `;

  return (
    <html lang="ar" dir="rtl">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body
        className={`${cairo.variable} ${jakarta.variable} ${elMessiri.variable} antialiased bg-cream text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
