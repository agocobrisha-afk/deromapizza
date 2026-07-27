"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function OrderFloatingButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/resha") || pathname === "/order") return null;
  return (
    <Link href="/order" className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 font-black text-white shadow-2xl shadow-rose-300 transition hover:-translate-y-1" dir="rtl">
      <ShoppingBag size={18} /> اطلب الآن
    </Link>
  );
}
