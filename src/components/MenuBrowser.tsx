"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Category, Product } from "@/lib/types";

type CategoryWithProducts = Category & { products: Product[] };
type CartItem = { id: string; name: string; price: number; image?: string | null; quantity: number };
const CART_KEY = "deroma_cart";

export default function MenuBrowser({ categories }: { categories: CategoryWithProducts[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  useEffect(() => {
    try {
      setCart(JSON.parse(window.localStorage.getItem(CART_KEY) || "[]"));
    } catch {
      setCart([]);
    }
  }, []);

  const persist = (next: CartItem[]) => {
    setCart(next);
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("deroma-cart-updated"));
  };

  const add = (item: Product) => {
    const id = String(item.id);
    const existing = cart.find((entry) => entry.id === id);
    if (existing) {
      persist(cart.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry));
      return;
    }
    persist([...cart, { id, name: item.name_ar, price: Number(item.price || 0), image: item.image_url, quantity: 1 }]);
  };

  const change = (item: Product, delta: number) => {
    const id = String(item.id);
    persist(cart.map((entry) => entry.id === id ? { ...entry, quantity: Math.max(0, entry.quantity + delta) } : entry).filter((entry) => entry.quantity > 0));
  };

  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  if (!active) return null;

  return (
    <div className="roma-menu-browser" dir="rtl">
      <div className="roma-menu-tabs-wrap">
        <div className="roma-menu-tabs">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveId(cat.id)} className={cat.id === activeId ? "is-active" : ""}>
              {cat.name_ar}
            </button>
          ))}
        </div>
        <Link href="/cart" className="roma-menu-cart-link"><ShoppingBag size={18} /><span>السلة</span><b>{count}</b></Link>
      </div>

      {active.subtitle_ar && <p className="roma-menu-subtitle">{active.subtitle_ar}</p>}

      <div className="roma-menu-grid">
        {active.products.map((item) => {
          const quantity = cart.find((entry) => entry.id === String(item.id))?.quantity || 0;
          return (
            <article className="roma-menu-card" key={item.id}>
              <div className="roma-menu-image">
                {item.image_url && <Image src={item.image_url} alt={item.name_ar} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />}
                <span>مميز</span>
              </div>
              <div className="roma-menu-card-body">
                <div className="roma-menu-card-head"><h3>{item.name_ar}</h3><strong>{item.price} د.ل</strong></div>
                {item.description_ar && <p>{item.description_ar}</p>}
                {quantity === 0 ? (
                  <button className="roma-menu-add" onClick={() => add(item)}><ShoppingBag size={16} />أضف للسلة</button>
                ) : (
                  <div className="roma-menu-stepper">
                    <button onClick={() => change(item, 1)} aria-label="زيادة"><Plus size={15} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => change(item, -1)} aria-label="تقليل"><Minus size={15} /></button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
