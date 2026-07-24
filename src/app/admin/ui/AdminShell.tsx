"use client";

import type { ReactNode } from "react";

export default function AdminShell({ children }: { children?: ReactNode }) {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6f7fb] px-4 py-10 text-slate-900 sm:px-6 lg:px-8"
    >
      <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 text-lg font-black text-white shadow-lg shadow-rose-200">
            DR
          </span>
          <p className="mt-6 text-xs font-black tracking-[0.2em] text-rose-500">RESTAURANT CMS</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">لوحة التحكم تحت إعادة البناء</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            تم حذف جميع الأقسام والقوائم القديمة مؤقتًا حتى لا يحدث أي تضارب. سيتم بناء لوحة جديدة من الصفر على نفس المسار.
          </p>
          {children ? <div className="hidden">{children}</div> : null}
        </div>
      </section>
    </main>
  );
}
