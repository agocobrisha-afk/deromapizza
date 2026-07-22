import { supabase } from "./supabase";
import { SiteSettings, Category, Product, SitePage, Review } from "./types";
import { defaultSettings } from "./default-settings";
import { menu as fallbackMenu } from "./menu-data";

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return defaultSettings;
    return { ...defaultSettings, ...data };
  } catch {
    return defaultSettings;
  }
}

export async function getCategoriesWithProducts(): Promise<
  (Category & { products: Product[] })[]
> {
  try {
    const { data: categories, error: catErr } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (catErr || !categories || categories.length === 0) {
      return fallbackMenu.map((c, i) => ({
        id: c.id,
        name_ar: c.title,
        subtitle_ar: c.subtitle ?? null,
        sort_order: i,
        products: c.items.map((item, j) => ({
          id: item.id,
          category_id: c.id,
          name_ar: item.name,
          description_ar: item.description ?? null,
          price: item.price,
          image_url: item.image ?? null,
          is_available: true,
          is_featured: false,
          sort_order: j,
        })),
      }));
    }

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    return categories.map((cat) => ({
      ...cat,
      products: (products ?? []).filter((p) => p.category_id === cat.id),
    }));
  } catch {
    return fallbackMenu.map((c, i) => ({
      id: c.id,
      name_ar: c.title,
      subtitle_ar: c.subtitle ?? null,
      sort_order: i,
      products: c.items.map((item, j) => ({
        id: item.id,
        category_id: c.id,
        name_ar: item.name,
        description_ar: item.description ?? null,
        price: item.price,
        image_url: item.image ?? null,
        is_available: true,
        is_featured: false,
        sort_order: j,
      })),
    }));
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const cats = await getCategoriesWithProducts();
  const all = cats.flatMap((c) => c.products);
  const featured = all.filter((p) => p.is_featured);
  const pool = featured.length > 0 ? featured : all;
  return pool.length >= 5 ? pool.slice(0, 6) : all.slice(0, 6);
}

export async function getPublishedPages(): Promise<SitePage[]> {
  try {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<SitePage | null> {
  try {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    return data ?? [];
  } catch {
    return [];
  }
}
