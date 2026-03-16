const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateAnswer(params: {
  message: string;
  knowledge: Array<{ title: string; content: string; category: string }>;
  products?: Array<{ name: string; permalink: string; price?: number | null; shortDescription?: string }>;
  fallbackMessage: string;
  handoffMessage: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const context = params.knowledge
    .map((item, index) => `${index + 1}. [${item.category}] ${item.title}: ${item.content}`)
    .join('\n');

  const productContext = (params.products ?? [])
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} | Giá: ${item.price ?? 'Liên hệ'} | Link: ${item.permalink} | Mô tả: ${item.shortDescription ?? ''}`
    )
    .join('\n');

  const systemPrompt = [
    'Bạn là trợ lý AI tư vấn bán hàng điện máy cho website thương mại điện tử.',
    'Chỉ trả lời dựa trên knowledge base và danh sách sản phẩm được cung cấp.',
    'Nếu có sản phẩm phù hợp, hãy gợi ý ngắn gọn, nêu vì sao phù hợp và luôn kèm link sản phẩm.',
    'Không bịa giá, chính sách, tồn kho, thông số ngoài dữ liệu.',
    'Nếu người dùng có ý định mua hàng, demo, báo giá hoặc muốn được tư vấn, hãy khuyến khích để lại tên và số điện thoại.',
    'Nếu người dùng muốn gặp người thật, hãy hướng sang handoff.',
    'Trả lời ngắn gọn, dễ hiểu, ưu tiên tiếng Việt tự nhiên.',
    '',
    'Knowledge base:',
    context || 'Không có knowledge.',
    '',
    'Sản phẩm gợi ý:',
    productContext || 'Không có sản phẩm phù hợp được tìm thấy.',
  ].join('\n');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.message },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${text}`);
  }

  const json = await response.json();
  const answer = json?.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    return params.fallbackMessage;
  }
  return answer;
}
