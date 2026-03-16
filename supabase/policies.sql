-- Optional RLS policies for AI Customer Care MVP
-- If you only use service_role on server-side, these policies can stay restrictive.

alter table knowledge_items enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table leads enable row level security;
alter table settings enable row level security;

-- Public read for published knowledge items
create policy if not exists "public can read knowledge"
on knowledge_items
for select
using (status = 'published');

-- Public insert conversation shell if needed later
create policy if not exists "public can insert conversations"
on conversations
for insert
with check (true);

-- Public insert messages if needed later
create policy if not exists "public can insert messages"
on messages
for insert
with check (true);

-- Public insert leads if needed later
create policy if not exists "public can insert leads"
on leads
for insert
with check (true);

-- No public read for leads/settings/messages by default
