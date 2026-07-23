import Link from "next/link";
import {
  BarChart3,
  Brush,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquareText,
  PackageOpen,
  Palette,
  Settings,
  ShoppingBag,
  Tags,
  Type,
} from "lucide-react";
import { getCategoriesWithProducts, getSiteSettings } from "@/lib/queries";
import AdminShell from "./ui/AdminShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const sections = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "products", label: "الأصناف", icon: PackageOpen },
  { id: "categories", label: "التصنيفات", icon: Tags },
  { id: "content", label: "النصوص والمحتوى", icon: FileText },
  { id: "media", label: "الصور والمعرض", icon: ImageIcon },
  { id: "appearance", label: "المظهر والقوالب", icon: Palette },
  { id: "typography", label: "الخطوط والأحجام", icon: Type },
  { id: "orders", label: "الطلبات", icon: ShoppingBag },
  { id: "reviews", label: "التقييمات", icon: MessageSquareText },
  { id: "analytics", label: "الإحصائيات", icon: BarChart3 },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export default async function AdminV2Page() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategoriesWithProducts(),
  ]);

  const productCount = categories.reduce((sum, category) => sum + category.products.length, 0);

  return (
    <AdminShell
      restaurantName={settings.restaurant_name}
      settings={settings}
      categories={categories}
      sections={sections.map(({ id, label }) => ({ id, label }))}
      productCount={productCount}
    >
      <div className="admin-v2-brand-card">
        <div className="admin-v2-brand-icon"><Brush size={22} /></div>
        <div>
          <strong>{settings.restaurant_name}</strong>
          <span>لوحة إدارة المطعم الجديدة</span>
        </div>
      </div>
      <nav className="admin-v2-sidebar-nav" aria-label="أقسام لوحة التحكم">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <button
              type="button"
              data-admin-section-trigger={section.id}
              className={index === 0 ? "is-active" : ""}
              key={section.id}
            >
              <Icon size={18} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="admin-v2-sidebar-footer">
        <Link href="/" target="_blank">معاينة الموقع</Link>
        <Link href="/menu" target="_blank">معاينة المنيو</Link>
      </div>
    </AdminShell>
  );
}
