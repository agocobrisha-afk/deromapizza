"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { restaurant } from "@/lib/menu-data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-char-950/90 backdrop-blur-md border-b border-char-700/60"
          : "bg-gradient-to-b from-char-950/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span
            className="text-2xl font-semibold tracking-tight text-gold-400"
            style={{ fontFamily: "var(--font-display-lat)" }}
          >
            DE ROMA
          </span>
          <span
            className="hidden sm:inline text-sm text-cream-300"
            style={{ fontFamily: "var(--font-display-ar)" }}
          >
            دي روما
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8 text-[15px] text-cream-200"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          <Link href="/menu" className="hover:text-gold-400 transition-colors">
            المنيو
          </Link>
          <Link href="/#about" className="hover:text-gold-400 transition-colors">
            عن المطعم
          </Link>
          <Link href="/#location" className="hover:text-gold-400 transition-colors">
            الموقع والأوقات
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${restaurant.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-basil-500/60 px-3.5 py-2 text-sm text-basil-300 hover:bg-basil-700/30 transition-colors"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            <MessageCircle size={16} strokeWidth={2} />
            واتساب
          </a>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 rounded-full bg-pomodoro-500 px-4 py-2 text-sm font-semibold text-cream-100 shadow-[0_4px_18px_-4px_rgba(193,67,43,0.6)] hover:bg-pomodoro-400 transition-colors"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            اطلب الآن
          </Link>
        </div>
      </div>
    </header>
  );
}
