# AI Customer Care MVP

Bộ skeleton cho MVP chatbot AI bán hàng/chăm sóc khách hàng trên website doanh nghiệp.

## Có gì trong project
- Landing page demo
- Chat widget chạy qua API nội bộ + OpenAI
- Admin dashboard demo
- API routes mẫu
- Schema SQL cho Supabase/Postgres
- WooCommerce → Supabase sync script
- Backlog kỹ thuật để dev tiếp

## Chạy local
```bash
npm install
npm run dev
```

Mở:
- `/` landing page + chat widget
- `/admin` admin demo
- `/api/chat/message` API chat

## Đồng bộ WooCommerce
1. Chạy `supabase/schema.sql`
2. Chạy `supabase/products.sql`
3. Chạy `supabase/seed.sql`
4. Điền env WooCommerce
5. Chạy:
```bash
node scripts/sync-woo-products.mjs
```

## Việc cần làm tiếp để ra production
1. Lưu conversations/messages thật vào DB
2. Tạo product filters/search tốt hơn
3. Tích hợp Google Sheets/CRM
4. Thêm auth admin
5. Viết test E2E
6. Deploy Vercel

## File quan trọng
- `src/app/page.tsx` — landing page
- `src/components/chat-widget.tsx` — widget chat
- `src/app/admin/page.tsx` — admin demo
- `src/lib/openai.ts` — OpenAI integration
- `src/lib/repositories.ts` — repository layer qua Supabase
- `src/lib/woocommerce.ts` — helper WooCommerce
- `scripts/sync-woo-products.mjs` — sync sản phẩm
- `supabase/schema.sql` — schema DB
- `supabase/products.sql` — schema products
- `supabase/seed.sql` — seed dữ liệu mẫu
- `supabase/policies.sql` — RLS policies mẫu
- `docs/SUPABASE_SETUP.md` — hướng dẫn setup nhanh
- `docs/BACKLOG.md` — backlog triển khai
