# Supabase setup nhanh

## 1) Chạy schema
Trong Supabase SQL Editor, chạy file:
- `supabase/schema.sql`

## 2) Seed dữ liệu mẫu
Chạy tiếp file:
- `supabase/seed.sql`

## 3) Optional: bật RLS policies
Nếu cần public insert/select có kiểm soát, chạy:
- `supabase/policies.sql`

## 4) Kiểm tra data
Mở Table Editor và kiểm tra:
- `settings` có 1 dòng
- `knowledge_items` có vài dòng seed

## 5) Chạy app local
```bash
npm run dev
```

Mở:
- `/admin` để xem settings, knowledge, leads, conversations
- `/api/admin/knowledge` để xem JSON

## Ghi chú
- App hiện dùng `service_role` cho server-side repositories
- Vì vậy admin/API server có thể đọc/ghi DB ổn định hơn
- Tuyệt đối không đưa `service_role` ra client/browser
