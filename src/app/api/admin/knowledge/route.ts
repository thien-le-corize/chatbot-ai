import { listKnowledgeItems } from '@/lib/repositories';

export async function GET() {
  const items = await listKnowledgeItems();
  return Response.json({ items });
}
