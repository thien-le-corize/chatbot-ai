import { createLead, listLeads } from '@/lib/repositories';

export async function GET() {
  const items = await listLeads();
  return Response.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();

  const item = await createLead({
    conversationId: body?.conversationId ?? null,
    name: body?.name ?? 'Unknown',
    phone: body?.phone ?? '',
    email: body?.email ?? '',
    interest: body?.interest ?? '',
    source: body?.source ?? 'website',
  });

  return Response.json({ success: true, item });
}
