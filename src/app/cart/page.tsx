"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

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

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
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

  const whatsappMessage = encodeURIComponent(
    `طلب جديد من De Roma\n\n${items
      .map(
        (item) =>
          `${item.name} × ${item.quantity} — ${(item.price * item.quantity).toFixed(2)} د.ل`,
      )
      .join("\n")}\n\nالإجمالي: ${total.toFixed(2)} د.ل`,
  );

  return (
    <main className="roma-cart-page" dir="rtl">
      <div className="roma-container roma-cart-shell">
        <div className="roma-cart-topbar">
          <Link href="/menu" className="roma-cart-return">
            <ArrowLeft size={18} />
            الرجوع إلى المنيو
          </Link>
          <div className="roma-cart-mini-brand">
            <span>DR</span>
            <strong>De Roma</strong>
          </div>
        </div>

        <div className="roma-cart-heading">
          <span>طلبك</span>
          <h1>سلة De Roma</h1>
          <p>راجع الأصناف والكميات قبل إرسال الطلب عبر واتساب.</p>
        </div>

        {items.length === 0 ? (
          <section className="roma-empty-cart">
            <div className="roma-empty-cart-icon"><ShoppingBag size={34} /></div>
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
                    aria-label={item.name}
                  />

                  <div className="roma-cart-item-copy">
                    <span>صنف مختار</span>
                    <h2>{item.name}</h2>
                    <strong>{item.price.toFixed(2)} د.ل</strong>
                  </div>

                  <div className="roma-cart-item-actions">
                    <div className="roma-cart-quantity" aria-label={`كمية ${item.name}`}>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label="زيادة الكمية">
                        <Plus size={17} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label="تقليل الكمية">
                        <Minus size={17} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="roma-cart-remove"
                      onClick={() => persist(items.filter((entry) => entry.id !== item.id))}
                      aria-label={`حذف ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="roma-cart-line-total">
                    <span>إجمالي الصنف</span>
                    <strong>{(item.price * item.quantity).toFixed(2)} د.ل</strong>
                  </div>
                </article>
              ))}
            </section>

            <aside className="roma-cart-summary">
              <span className="roma-cart-summary-kicker">ملخص الطلب</span>
              <h2>طلبك جاهز للإرسال</h2>
              <p>راجع الإجمالي ثم أرسله مباشرة عبر واتساب.</p>

              <div className="roma-cart-summary-row">
                <strong>عدد القطع</strong>
                <b>{totalQuantity}</b>
              </div>
              <div className="roma-cart-summary-row">
                <strong>عدد الأصناف</strong>
                <b>{items.length}</b>
              </div>
              <div className="roma-cart-summary-row roma-cart-summary-total">
                <strong>الإجمالي</strong>
                <b>{total.toFixed(2)} د.ل</b>
              </div>

              <a
                className="roma-primary-cta roma-cart-whatsapp"
                href={`https://wa.me/?text=${whatsappMessage}`}
              >
                إرسال الطلب عبر واتساب
              </a>
              <Link href="/menu" className="roma-cart-back">إضافة أصناف أخرى</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
