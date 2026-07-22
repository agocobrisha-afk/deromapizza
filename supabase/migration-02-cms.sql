-- ============================================
-- الترقية 2: تحويل الموقع لنظام إدارة محتوى كامل
-- شغّل هذا كامل في Supabase → SQL Editor → Run
-- ============================================

-- إعدادات الموقع (صف واحد يحكم كل الموقع)
create table if not exists site_settings (
  id int primary key default 1,
  restaurant_name text default 'De Roma',
  logo_url text,
  hero_image_url text,
  primary_color text default '#E63C2F',
  phone text default '0944400150',
  whatsapp text default '218944400150',
  address text default 'بنغازي، ليبيا',
  hours text default 'يوميًا · 1:00 ظهرًا — 1:00 صباحًا',
  presto_url text,
  tagline text default 'بيتزا ولازانيا إيطالية، تُخبز طازجة في بنغازي',
  hero_badge text default '🔥 تُخبز طازجة لطلبك — مو من الفريزر',
  hero_headline text default 'بيتزا إيطالية حقيقية،',
  hero_headline_accent text default 'توصلك سخنة',
  hero_subheadline text default 'عجينة تُخمّر يوميًا وجبنة موزاريلا أصلية.',
  about_badge text default 'قصتنا',
  about_title text default 'من الفرن إلى بابك، بدون اختصارات',
  about_body text default 'كل بيتزا تتعجن وتُخبز من جديد وقت الطلب.',
  cta_primary_label text default 'شاهد المنيو واطلب',
  cta_secondary_label text default 'اطلب واتساب',
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- صفحات فرعية ديناميكية (من نحن، الوظائف...)
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text,
  is_published boolean default true,
  show_in_nav boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- تقييمات الزبائن
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- إضافة أعمدة جديدة لجدول المنتجات إن كانت ناقصة
alter table products add column if not exists is_featured boolean default false;
alter table categories add column if not exists subtitle_ar text;

-- ---- الحماية (RLS) ----
alter table site_settings enable row level security;
alter table pages enable row level security;
alter table reviews enable row level security;

-- قراءة عامة
drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);

drop policy if exists "public read pages" on pages;
create policy "public read pages" on pages for select using (is_published = true);

drop policy if exists "public read approved reviews" on reviews;
create policy "public read approved reviews" on reviews for select using (is_approved = true);

drop policy if exists "public insert reviews" on reviews;
create policy "public insert reviews" on reviews for insert with check (true);

-- تعديل من لوحة التحكم (لازم تسجيل دخول Supabase Auth)
drop policy if exists "auth manage settings" on site_settings;
create policy "auth manage settings" on site_settings for update using (auth.role() = 'authenticated');

drop policy if exists "auth manage pages" on pages;
create policy "auth manage pages" on pages for all using (auth.role() = 'authenticated');

drop policy if exists "auth manage reviews" on reviews;
create policy "auth manage reviews" on reviews for all using (auth.role() = 'authenticated');

drop policy if exists "auth manage categories" on categories;
create policy "auth manage categories" on categories for all using (auth.role() = 'authenticated');

drop policy if exists "auth manage products" on products;
create policy "auth manage products" on products for all using (auth.role() = 'authenticated');

-- ---- تخزين الصور (Storage) ----
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read site-assets" on storage.objects;
create policy "public read site-assets" on storage.objects
  for select using (bucket_id = 'site-assets');

drop policy if exists "auth upload site-assets" on storage.objects;
create policy "auth upload site-assets" on storage.objects
  for insert with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');

drop policy if exists "auth update site-assets" on storage.objects;
create policy "auth update site-assets" on storage.objects
  for update using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

-- ---- تعبئة المنيو الحالي (لو الجداول فاضية) ----
do $$
declare
  cat_pastries uuid;
  cat_pizza uuid;
  cat_sides uuid;
  cat_extras uuid;
begin
  if (select count(*) from categories) = 0 then
    insert into categories (name_ar, subtitle_ar, sort_order) values
      ('المعجنات', 'كالزوني وباقيت محشو، يخرج طازج من الفرن', 0) returning id into cat_pastries;
    insert into categories (name_ar, subtitle_ar, sort_order) values
      ('بيتزا متوسطة', 'عجينة مخمّرة وجبنة موزاريلا تُخبز طازجة لطلبك', 1) returning id into cat_pizza;
    insert into categories (name_ar, sort_order) values
      ('بطاطا ولازانيا', 2) returning id into cat_sides;
    insert into categories (name_ar, sort_order) values
      ('الإضافات والمشروبات', 3) returning id into cat_extras;

    insert into products (category_id, name_ar, description_ar, price, sort_order, is_featured, image_url) values
      (cat_pastries, 'كالازوني مفروم', 'باستا، لحم مفروم، جبنة، خضرة، بطاطا مقلية', 22, 0, true, '/images/pizza-beef.jpg'),
      (cat_pastries, 'مشتعلة دجاج', 'دجاج مشوي بصوص السماق الحار، جبنة، بطاطا', 24, 1, false, null),
      (cat_pastries, 'مقلوبة دجاج', 'دجاج مشوي، قشطة، باركيسوس، جبنة', 18, 2, false, null),
      (cat_pastries, 'باقيت دجاج', 'دجاج متبل مع البطاطا العقنية والسلطة المشوية وجبنة وصوصات', 23, 3, false, null),
      (cat_pastries, 'كالازوني دجاج', 'دجاج متبل، جبنة، بطاطا، صوص', 22, 4, false, null),
      (cat_pastries, 'ليباني دجاج', 'دجاج متبل مع البطاطا العقنية والسلطة المشوية وجبنة موزاريلا وزيت زيتون', 23, 5, false, null),

      (cat_pizza, 'مارجيتا', 'صلصة نابولي، جبنة موزاريلا، شيدر', 16, 0, true, '/images/pizza-tomato-olive.jpg'),
      (cat_pizza, 'بيتزا خضروات', 'جبنة، فلفل حلو، بصل، طماطم أخضر، ذرة، زيتون', 17, 1, false, '/images/pizza-veggie-corn.jpg'),
      (cat_pizza, 'بيتزا هاوس', 'صلصة نابولي، جبنة، تونة، زيتون قطاع، فلفل حلو', 18, 2, false, null),
      (cat_pizza, 'بيتزا جبنة وثوم', 'صوص ثوم، جبنة موزاريلا، زيت زيتون، زعتر', 16, 3, false, null),
      (cat_pizza, 'موجة حارة', 'صلصة حارة، جبنة موزاريلا، فلفل مقلي، دجاج حار، بصل أحمر', 19, 4, true, '/images/pizza-chicken-sauce.jpg'),
      (cat_pizza, 'بيتزا سموكي', 'صلصة طماطم، جبنة، فلفل حار أخضر، زيتون، باركيسوس', 20, 5, false, null),
      (cat_pizza, 'بيتزا مكسيكانا', 'صلصة حارة، جبنة، فروم لحم، فلفل حار، بصل', 20, 6, false, null),
      (cat_pizza, 'بيتزا ميت فيست', 'صلصة، جبنة، كباب لحم، بصل، فلفل حار', 19, 7, false, null),
      (cat_pizza, 'بيتزا فونقي', 'صلصة، جبنة، فطر، زيتون، طماطم أخضر', 17, 8, false, '/images/pizza-olives-pepper.jpg'),
      (cat_pizza, 'بيتزا ميامي', 'صلصة، جبنة، دجاج، فقّاع، ذرة', 20, 9, false, '/images/pizza-chicken.jpg'),

      (cat_sides, 'بطاطا صغير', null, 6, 0, false, null),
      (cat_sides, 'بطاطا كبير', null, 11, 1, false, null),
      (cat_sides, 'لازانيا لحم', 'طبقات باستا ولحم وجبنة مشوية بالفرن', 28, 2, true, '/images/lasagna-cheesepull.jpg'),

      (cat_extras, 'إضافة جبنة', null, 3, 0, false, null),
      (cat_extras, 'إضافة صوص', null, 1, 1, false, null),
      (cat_extras, 'مشروب غازي', null, 3, 2, false, null),
      (cat_extras, 'ماء', null, 1, 3, false, null);
  end if;
end $$;
