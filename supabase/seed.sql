-- Seed data for AI Customer Care MVP

insert into settings (
  company_name,
  bot_name,
  welcome_message,
  fallback_message,
  handoff_message,
  notification_email
)
values (
  'TTMKT AI',
  'Ami',
  'Chào anh/chị, em là trợ lý AI. Em có thể hỗ trợ thông tin sản phẩm, chính sách và nhận nhu cầu tư vấn.',
  'Em chưa chắc thông tin này. Anh/chị để lại số điện thoại, bên em sẽ liên hệ tư vấn ngay nhé.',
  'Em sẽ chuyển yêu cầu cho tư vấn viên. Anh/chị vui lòng để lại số điện thoại giúp em nhé.',
  'sales@example.com'
)
on conflict do nothing;

insert into knowledge_items (title, content, category, status, source)
values
  (
    'Chính sách giao hàng',
    'Doanh nghiệp hỗ trợ giao hàng toàn quốc trong 2-5 ngày làm việc. Miễn phí giao hàng cho đơn từ 1.000.000 VNĐ.',
    'policy',
    'published',
    'seed'
  ),
  (
    'Chính sách đổi trả',
    'Khách hàng được đổi trả trong vòng 7 ngày nếu sản phẩm lỗi kỹ thuật hoặc giao sai mẫu.',
    'policy',
    'published',
    'seed'
  ),
  (
    'Gói Starter',
    'Gói Starter phù hợp doanh nghiệp nhỏ, gồm chatbot web, FAQ bot, lead capture và đồng bộ Google Sheets.',
    'product',
    'published',
    'seed'
  ),
  (
    'Gói Growth',
    'Gói Growth gồm toàn bộ Starter và bổ sung handoff, analytics cơ bản, dashboard admin tốt hơn.',
    'product',
    'published',
    'seed'
  ),
  (
    'Quy trình tư vấn',
    'Khi khách có nhu cầu mua hàng hoặc demo, bot sẽ xin tên và số điện thoại để đội ngũ tư vấn liên hệ lại.',
    'sales',
    'published',
    'seed'
  )
on conflict do nothing;
