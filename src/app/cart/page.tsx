"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
};

const CART_KEY = "deroma_cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return;
    try {
      setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("deroma-cart-updated"));
  };

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const changeQuantity = (id: string, delta: number) => {
    persist(
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <main className="roma-cart-page" dir="rtl">
      <div className="roma-container roma-cart-shell">
        <div className="roma-cart-heading">
          <span>طلبك</span>
          <h1>سلة De Roma</h1>
          <p>راجع الأصناف والكميات قبل إرسال الطلب.</p>
        </div>

        {items.length === 0 ? (
          <section className="roma-empty-cart">
            <ShoppingBag size={42} />
            <h2>السلة فارغة</h2>
            <p>أضف الأصناف من صفحة المنيو وستظهر هنا مباشرة.</p>
            <Link href="/menu" className="roma-primary-cta">اذهب إلى المنيو</Link>
          </section>
        ) : (
          <div className="roma-cart-layout">
            <section className="roma-cart-list">
              {items.map((item) => (
                <article className="roma-cart-item" key={item.id}>
                  <div
                    className="roma-cart-thumb"
                    style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                  />
                  <div className="roma-cart-item-copy">
                    <h2>{item.name}</h2>
                    <strong>{item.price} د.ل</strong>
                  </div>
                  <div className="roma-cart-quantity">
                    <button onClick={() => changeQuantity(item.id, 1)} aria-label="زيادة الكمية"><Plus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQuantity(item.id, -1)} aria-label="تقليل الكمية"><Minus size={16} /></button>
                  </div>
                  <button className="roma-cart-remove" onClick={() => persist(items.filter((entry) => entry.id !== item.id))} aria-label="حذف الصنف"><Trash2 size={18} /></button>
                </article>
              ))}
            </section>

            <aside className="roma-cart-summary">
              <span>ملخص الطلب</span>
              <div><strong>عدد الأصناف</strong><b>{items.reduce((sum, item) => sum + item.quantity, 0)}</b></div>
              <div><strong>الإجمالي</strong><b>{total.toFixed(2)} د.ل</b></div>
              <a className="roma-primary-cta" href={`https://wa.me/?text=${encodeURIComponent(`طلب جديد من De Roma\n${items.map((item) => `${item.name} × ${item.quantity}`).join("\n")}\nالإجمالي: ${total.toFixed(2)} د.ل`)}`}>إرسال الطلب عبر واتساب</a>
              <Link href="/menu" className="roma-cart-back">إضافة أصناف أخرى</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
