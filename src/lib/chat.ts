export function createSessionId() {
  return `sess_${Math.random().toString(36).slice(2, 10)}`;
}

export function detectIntent(message: string) {
  const buyingIntent = /(giá|báo giá|demo|tư vấn|đăng ký|mua|liên hệ)/i.test(message);
  const handoffIntent = /(nhân viên|người thật|gọi lại|tư vấn viên)/i.test(message);

  if (handoffIntent) return 'handoff';
  if (buyingIntent) return 'capture_lead';
  return 'answer';
}
