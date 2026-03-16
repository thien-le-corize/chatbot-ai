import { getAppSettings } from '@/lib/repositories';

export async function GET() {
  const settings = await getAppSettings();
  return Response.json(settings);
}
