function getWooAuthUrl(path: string, params: Record<string, string> = {}) {
  const storeUrl = process.env.WOOCOMMERCE_STORE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!storeUrl || !consumerKey || !consumerSecret) {
    throw new Error('Missing WooCommerce environment variables');
  }

  const url = new URL(`/wp-json/wc/v3/${path.replace(/^\//, '')}`, storeUrl);
  url.searchParams.set('consumer_key', consumerKey);
  url.searchParams.set('consumer_secret', consumerSecret);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export async function fetchWooProducts(page = 1, perPage = 50) {
  const url = getWooAuthUrl('products', {
    page: String(page),
    per_page: String(perPage),
    status: 'publish',
  });

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`WooCommerce error: ${response.status} ${await response.text()}`);
  }

  return response.json();
}
