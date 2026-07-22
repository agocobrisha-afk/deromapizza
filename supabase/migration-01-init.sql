-- الترقية 1: الجداول الأساسية (منتجات، تصنيفات، طلبات)
-- شغّلتها سابقًا في Supabase — محفوظة هنا للمرجع فقط

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name_ar text not null,
  description_ar text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name_ar text not null,
  extra_price numeric(10,2) default 0
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  order_type text not null check (order_type in ('delivery','pickup')),
  address text,
  latitude numeric,
  longitude numeric,
  status text default 'pending' check (status in ('pending','confirmed','preparing','out_for_delivery','ready','completed','cancelled')),
  total numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  options jsonb
);

alter table categories enable row level security;
alter table products enable row level security;
alter table product_options enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read options" on product_options for select using (true);
create policy "public insert orders" on orders for insert with check (true);
create policy "public insert order_items" on order_items for insert with check (true);
