import { listLeads } from '@/lib/repositories';

export async function GET() {
  const items = await listLeads();
  return Response.json({ items });
}
