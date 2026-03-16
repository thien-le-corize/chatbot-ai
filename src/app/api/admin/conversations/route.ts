import { listConversations } from '@/lib/repositories';

export async function GET() {
  const items = await listConversations();
  return Response.json({ items });
}
