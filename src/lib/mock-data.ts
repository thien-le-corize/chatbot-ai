export type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interest: string;
  source: string;
  status: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  customer: string;
  source: string;
  status: string;
  lastMessage: string;
  updatedAt: string;
};

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: 'k1',
    title: 'Chính sách giao hàng',
    category: 'policy',
    content:
      'Doanh nghiệp hỗ trợ giao hàng toàn quốc trong 2-5 ngày làm việc. Miễn phí giao hàng cho đơn từ 1.000.000 VNĐ.',
    keywords: ['giao hàng', 'ship', 'vận chuyển', 'phí ship'],
  },
  {
    id: 'k2',
    title: 'Chính sách đổi trả',
    category: 'policy',
    content:
      'Khách hàng được đổi trả trong vòng 7 ngày nếu sản phẩm lỗi kỹ thuật hoặc giao sai mẫu.',
    keywords: ['đổi trả', 'bảo hành', 'lỗi'],
  },
  {
    id: 'k3',
    title: 'Tư vấn sản phẩm',
    category: 'sales',
    content:
      'Bot có thể tư vấn gói cơ bản, gói nâng cao và gói doanh nghiệp, tùy theo nhu cầu sử dụng và ngân sách.',
    keywords: ['giá', 'gói', 'tư vấn', 'sản phẩm'],
  },
];

export const leads: Lead[] = [
  {
    id: 'l1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'vana@example.com',
    interest: 'Muốn demo chatbot website',
    source: 'website',
    status: 'new',
    createdAt: '2026-03-15 09:00',
  },
  {
    id: 'l2',
    name: 'Trần Thị B',
    phone: '0912345678',
    email: 'tranb@example.com',
    interest: 'Hỏi gói Growth',
    source: 'landing-page',
    status: 'pending_followup',
    createdAt: '2026-03-15 11:30',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'c1',
    customer: 'Khách ẩn danh #001',
    source: 'website',
    status: 'open',
    lastMessage: 'Cho mình xin báo giá gói chatbot',
    updatedAt: '2026-03-15 13:20',
  },
  {
    id: 'c2',
    customer: 'Khách ẩn danh #002',
    source: 'website',
    status: 'handoff',
    lastMessage: 'Tôi muốn nói chuyện với nhân viên',
    updatedAt: '2026-03-15 15:45',
  },
];

export const settings = {
  companyName: 'TTMKT AI',
  botName: 'Ami',
  welcomeMessage: 'Chào anh/chị, em là trợ lý AI. Em có thể hỗ trợ thông tin sản phẩm, chính sách và nhận nhu cầu tư vấn.',
  fallbackMessage:
    'Em chưa chắc thông tin này. Anh/chị để lại số điện thoại, bên em sẽ liên hệ tư vấn ngay nhé.',
  handoffMessage:
    'Em sẽ chuyển yêu cầu cho tư vấn viên. Anh/chị vui lòng để lại số điện thoại giúp em nhé.',
  notificationEmail: 'sales@example.com',
};
