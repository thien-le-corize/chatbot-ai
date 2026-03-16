import { createSessionId } from '@/lib/chat';

export async function POST() {
  return Response.json({ sessionId: createSessionId() });
}
