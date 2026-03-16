import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const storeUrl = process.env.WOOCOMMERCE_STORE_URL;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!supabaseUrl || !serviceRoleKey || !storeUrl || !consumerKey || !consumerSecret) {
  throw new Error('Missing env vars for Woo sync');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function buildUrl(page = 1, perPage = 50) {
  const url = new URL('/wp-json/wc/v3/products', storeUrl);
  url.searchParams.set('consumer_key', consumerKey);
  url.searchParams.set('consumer_secret', consumerSecret);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('status', 'publish');
  return url.toString();
}

function toNumber(value) {
  if (value === '' || value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function mapProduct(p) {
  return {
    woo_id: p.id,
    name: p.name,
    slug: p.slug,
    permalink: p.permalink,
    status: p.status,
    sku: p.sku || null,
    price: toNumber(p.price),
    regular_price: toNumber(p.regular_price),
    sale_price: toNumber(p.sale_price),
    stock_status: p.stock_status || null,
    stock_quantity: p.stock_quantity ?? null,
    short_description: p.short_description || '',
    description: p.description || '',
    image_url: p.images?.[0]?.src || null,
    categories: p.categories || [],
    attributes: p.attributes || [],
    tags: p.tags || [],
    raw: p,
  };
}

async function fetchPage(page) {
  const response = await fetch(buildUrl(page), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`WooCommerce fetch failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function main() {
  let page = 1;
  let total = 0;

  while (true) {
    const products = await fetchPage(page);
    if (!products.length) break;

    const rows = products.map(mapProduct);
    const { error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'woo_id' });

    if (error) throw error;

    total += rows.length;
    console.log(`Synced page ${page}: ${rows.length} products`);
    page += 1;
  }

  console.log(`Done. Total synced: ${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
