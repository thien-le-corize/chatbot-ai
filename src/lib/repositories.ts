import { supabaseAdmin } from '@/lib/supabase-admin';
import { conversations, knowledgeItems, leads, settings } from '@/lib/mock-data';

type SearchableProduct = {
  woo_id: number;
  name: string;
  permalink: string;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  stock_status: string | null;
  short_description: string | null;
  description?: string | null;
  categories: unknown[] | null;
  attributes: unknown[] | null;
  image_url: string | null;
  sku?: string | null;
};

const QUERY_SYNONYMS: Record<string, string[]> = {
  'máy lạnh': ['dieu hoa', 'may lanh', 'air conditioner'],
  'điều hòa': ['dieu hoa', 'may lanh', 'điều hoà'],
  tivi: ['tv', 'smart tv', 'google tv'],
  tv: ['tivi', 'smart tv', 'google tv'],
  'máy giặt': ['may giat', 'giat', 'cua ngang', 'cua truoc', 'cua tren'],
  'tủ lạnh': ['tu lanh', 'ngan da', 'side by side'],
  inverter: ['tiet kiem dien', 'inverter'],
  'tiết kiệm điện': ['inverter', 'tiet kiem dien'],
  'cửa ngang': ['cua ngang', 'cua truoc', 'front load'],
  'cửa trước': ['cua ngang', 'cua truoc', 'front load'],
  'cửa trên': ['cua tren', 'top load'],
  '1hp': ['1 hp', '9000btu', '9000 btu'],
  '1.5hp': ['1.5 hp', '12000btu', '12000 btu'],
  '2hp': ['2 hp', '18000btu', '18000 btu'],
  'máy khoan': ['may khoan', 'khoan pin', 'khoan dong luc', 'khoan be tong', 'drill'],
  'máy cắt': ['may cat', 'may mai', 'cua dia'],
  'máy bắn vít': ['may ban vit', 'bat vit', 'khoan pin'],
};

const PRODUCT_GROUPS: Array<{ label: string; keywords: string[] }> = [
  { label: 'máy khoan', keywords: ['may khoan', 'khoan pin', 'khoan dong luc', 'khoan be tong', 'drill'] },
  { label: 'máy lạnh', keywords: ['may lanh', 'dieu hoa', '9000btu', '12000btu', '18000btu'] },
  { label: 'tủ lạnh', keywords: ['tu lanh', 'ngan da', 'side by side'] },
  { label: 'máy giặt', keywords: ['may giat', 'cua ngang', 'cua truoc', 'cua tren'] },
  { label: 'tivi', keywords: ['tivi', 'tv', 'google tv', 'smart tv', '4k'] },
  { label: 'máy bắn vít', keywords: ['may ban vit', 'bat vit', 'khoan pin'] },
  { label: 'máy cắt', keywords: ['may cat', 'may mai', 'cua dia'] },
];

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, ' ');
}

function normalizeText(input: string) {
  return stripHtml(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toArrayText(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === 'string') return [item];
    if (!item || typeof item !== 'object') return [];

    const obj = item as Record<string, unknown>;
    const fields: string[] = [];

    if (typeof obj.name === 'string') fields.push(obj.name);
    if (typeof obj.slug === 'string') fields.push(obj.slug);
    if (Array.isArray(obj.options)) {
      for (const option of obj.options) {
        if (typeof option === 'string') fields.push(option);
      }
    }

    return fields;
  });
}

function expandTokens(query: string) {
  const normalized = normalizeText(query);
  const baseTokens = normalized.split(/\s+/).filter(Boolean);
  const tokenSet = new Set(baseTokens);

  for (const [phrase, synonyms] of Object.entries(QUERY_SYNONYMS)) {
    const normalizedPhrase = normalizeText(phrase);
    if (normalized.includes(normalizedPhrase)) {
      tokenSet.add(normalizedPhrase);
      for (const synonym of synonyms) {
        tokenSet.add(normalizeText(synonym));
      }
    }
  }

  for (const token of [...tokenSet]) {
    const synonyms = QUERY_SYNONYMS[token];
    if (synonyms) {
      for (const synonym of synonyms) {
        tokenSet.add(normalizeText(synonym));
      }
    }
  }

  return [...tokenSet].filter(Boolean);
}

function detectProductGroup(query: string) {
  const normalized = normalizeText(query);
  for (const group of PRODUCT_GROUPS) {
    if (group.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))) {
      return group;
    }
  }
  return null;
}

function buildProductSearchBlob(item: SearchableProduct) {
  return normalizeText(
    [
      item.name,
      item.sku ?? '',
      item.short_description ?? '',
      item.description ?? '',
      ...toArrayText(item.categories),
      ...toArrayText(item.attributes),
    ].join(' ')
  );
}

function scoreProduct(item: SearchableProduct, tokens: string[], detectedGroupKeywords: string[]) {
  const name = normalizeText(item.name);
  const shortDescription = normalizeText(item.short_description ?? '');
  const description = normalizeText(item.description ?? '');
  const categories = normalizeText(toArrayText(item.categories).join(' '));
  const attributes = normalizeText(toArrayText(item.attributes).join(' '));
  const sku = normalizeText(item.sku ?? '');
  const blob = [name, shortDescription, description, categories, attributes, sku].join(' ');

  let score = 0;

  for (const token of tokens) {
    if (!token) continue;
    if (name.includes(token)) score += 8;
    if (categories.includes(token)) score += 9;
    if (attributes.includes(token)) score += 7;
    if (shortDescription.includes(token)) score += 4;
    if (description.includes(token)) score += 2;
    if (sku.includes(token)) score += 10;
  }

  if (detectedGroupKeywords.length > 0) {
    const groupHit = detectedGroupKeywords.some((keyword) => blob.includes(normalizeText(keyword)));
    if (groupHit) score += 20;
    else score -= 8;
  }

  const normalizedQuery = tokens.join(' ');
  if (normalizedQuery && name.includes(normalizedQuery)) score += 12;
  if (item.stock_status === 'instock') score += 2;
  if (blob.includes('inverter') && tokens.some((t) => t.includes('inverter') || t.includes('tiet kiem dien'))) score += 3;

  return score;
}

export async function listKnowledgeItems() {
  const { data, error } = await supabaseAdmin
    .from('knowledge_items')
    .select('id,title,content,category,status,source,created_at,updated_at')
    .order('created_at', { ascending: false });

  if (error || !data) return knowledgeItems;
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    content: item.content,
    keywords: [],
  }));
}

export async function listLeads() {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('id,name,phone,email,interest,source,status,created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return leads;
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email ?? '',
    interest: item.interest ?? '',
    source: item.source,
    status: item.status,
    createdAt: item.created_at,
  }));
}

export async function listConversations() {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('id,session_id,source,status,created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return conversations;
  return data.map((item) => ({
    id: item.id,
    customer: item.session_id,
    source: item.source,
    status: item.status,
    lastMessage: 'Load messages from messages table in next step',
    updatedAt: item.created_at,
  }));
}

export async function getAppSettings() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('company_name,bot_name,welcome_message,fallback_message,handoff_message,notification_email')
    .limit(1)
    .maybeSingle();

  if (error || !data) return settings;
  return {
    companyName: data.company_name,
    botName: data.bot_name,
    welcomeMessage: data.welcome_message,
    fallbackMessage: data.fallback_message,
    handoffMessage: data.handoff_message,
    notificationEmail: data.notification_email ?? '',
  };
}

export async function createLead(input: {
  conversationId?: string | null;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  source?: string;
}) {
  const payload = {
    conversation_id: input.conversationId ?? null,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    interest: input.interest ?? null,
    source: input.source ?? 'website',
    status: 'new',
  };

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert(payload)
    .select('id,name,phone,email,interest,source,status,created_at')
    .single();

  if (error || !data) {
    return {
      id: `mock_${Date.now()}`,
      name: input.name,
      phone: input.phone,
      email: input.email ?? '',
      interest: input.interest ?? '',
      source: input.source ?? 'website',
      status: 'new',
      createdAt: new Date().toISOString(),
      fallback: true,
      error: error?.message,
    };
  }

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email ?? '',
    interest: data.interest ?? '',
    source: data.source,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function searchProducts(query: string) {
  const tokens = expandTokens(query);
  const normalizedQuery = normalizeText(query);
  const detectedGroup = detectProductGroup(query);
  const detectedGroupKeywords = detectedGroup?.keywords ?? [];

  const { data, error } = await supabaseAdmin
    .from('products')
    .select(
      'woo_id,name,permalink,price,regular_price,sale_price,stock_status,short_description,description,categories,attributes,image_url,sku'
    )
    .eq('status', 'publish')
    .limit(500);

  if (error || !data) return [];

  const scored = (data as SearchableProduct[])
    .map((item) => {
      const blob = buildProductSearchBlob(item);
      const score = scoreProduct(item, tokens, detectedGroupKeywords);

      if (!normalizedQuery) return null;
      if (score <= 0 && !blob.includes(normalizedQuery)) return null;

      return {
        wooId: item.woo_id,
        name: item.name,
        permalink: item.permalink,
        price: item.sale_price ?? item.price ?? item.regular_price,
        stockStatus: item.stock_status,
        shortDescription: stripHtml(item.short_description ?? '').trim(),
        imageUrl: item.image_url,
        categories: item.categories ?? [],
        attributes: item.attributes ?? [],
        score,
      };
    })
    .filter(
      (
        item
      ): item is {
        wooId: number;
        name: string;
        permalink: string;
        price: number | null;
        stockStatus: string | null;
        shortDescription: string;
        imageUrl: string | null;
        categories: unknown[];
        attributes: unknown[];
        score: number;
      } => item !== null
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return scored;
}
