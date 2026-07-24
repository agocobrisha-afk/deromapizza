export type SiteSettings = {
  id: number;
  theme_id: string;
  restaurant_name: string;
  logo_url: string | null;
  hero_image_url: string | null;
  primary_color: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  surface_color?: string;
  text_color?: string;
  muted_text_color?: string;
  font_body?: string;
  font_display?: string;
  base_font_size?: number;
  heading_scale?: number;
  border_radius?: number;
  shadow_strength?: number;
  header_style?: "solid" | "glass" | "transparent";
  hero_style?: "editorial" | "split" | "minimal";
  card_style?: "soft" | "bordered" | "flat";
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  presto_url: string | null;
  tagline: string;
  hero_badge: string;
  hero_headline: string;
  hero_headline_accent: string;
  hero_subheadline: string;
  about_badge: string;
  about_title: string;
  about_body: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  gallery_title?: string;
  gallery_subtitle?: string;
  gallery_images?: string[];
  footer_text?: string;
};

export type Category = {
  id: string;
  name_ar: string;
  subtitle_ar: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string;
  name_ar: string;
  description_ar: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type SitePage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  sort_order: number;
  show_in_nav: boolean;
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
};
