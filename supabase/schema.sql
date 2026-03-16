create extension if not exists vector;

create table if not exists knowledge_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null,
  status text not null default 'published',
  source text,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  source text not null default 'website',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  confidence numeric(4,3),
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  interest text,
  source text not null default 'website',
  status text not null default 'new',
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  bot_name text not null,
  welcome_message text not null,
  fallback_message text not null,
  handoff_message text not null,
  notification_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
