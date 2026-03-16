# Deployment guide

## Vercel
1. Import project vào Vercel
2. Set env theo `.env.example`
3. Deploy app

## Supabase
1. Tạo project Supabase
2. Chạy `supabase/schema.sql`
3. Tạo seed knowledge items
4. Lấy URL + keys đưa vào env

## Google Sheets
Có 2 hướng:
- Apps Script webhook nhận lead mới
- service account dùng Sheets API

## Model AI
Có thể dùng OpenAI/Gemini/Claude.
Production flow khuyến nghị:
- embed knowledge items
- retrieve top-k
- inject vào prompt
- trả lời có guardrails
