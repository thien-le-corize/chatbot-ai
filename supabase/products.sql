create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  woo_id bigint not null unique,
  name text not null,
  slug text,
  permalink text,
  status text,
  sku text,
  price numeric,
  regular_price numeric,
  sale_price numeric,
  stock_status text,
  stock_quantity integer,
  short_description text,
  description text,
  image_url text,
  categories jsonb not null default '[]'::jsonb,
  attributes jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_name on products using gin (to_tsvector('simple', coalesce(name, '')));
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_stock_status on products(stock_status);
