// /api/products.js
// Vercel serverless function — proxies WooCommerce product requests so the
// consumer key/secret never reach the browser. Credentials are read from
// Vercel Environment Variables (server-side only):
//
//   WOO_CONSUMER_KEY
//   WOO_CONSUMER_SECRET
//   WOO_STORE_URL
//
// The frontend calls this same-origin endpoint instead of calling
// shop.wearbvx.com directly. Two modes:
//
//   GET /api/products?per_page=20&status=publish
//     -> proxies GET /wc/v3/products (product list, unchanged behaviour)
//
//   GET /api/products?variations_of=123
//     -> proxies GET /wc/v3/products/123/variations (that product's real
//        WooCommerce variations — id, attributes, stock status, etc.)
//        Fetched on-demand only when a customer opens a variable product's
//        detail page, never bundled into the main list call.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { WOO_CONSUMER_KEY, WOO_CONSUMER_SECRET, WOO_STORE_URL } = process.env;

  if (!WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET || !WOO_STORE_URL) {
    console.error('Missing WooCommerce environment variables on the server.');
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }

  try {
    const credentials = Buffer
      .from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`)
      .toString('base64');

    let wooUrl;

    if (req.query.variations_of) {
      const productId = parseInt(req.query.variations_of, 10);
      if (!productId || productId <= 0) {
        return res.status(400).json({ error: 'Invalid variations_of product id.' });
      }
      const params = new URLSearchParams();
      params.set('per_page', '100'); // WooCommerce's max — comfortably covers any real variation count
      wooUrl = `${WOO_STORE_URL}/wp-json/wc/v3/products/${productId}/variations?${params.toString()}`;
    } else {
      // Forward the same query params the frontend previously sent directly
      // to WooCommerce, defaulting to match existing behaviour if omitted.
      const params = new URLSearchParams(req.query);
      if (!params.has('per_page')) params.set('per_page', '20');
      if (!params.has('status')) params.set('status', 'publish');
      wooUrl = `${WOO_STORE_URL}/wp-json/wc/v3/products?${params.toString()}`;
    }

    const wooRes = await fetch(wooUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!wooRes.ok) {
      console.error(`WooCommerce API responded with ${wooRes.status}`);
      return res.status(wooRes.status).json({ error: 'WooCommerce API error' });
    }

    const data = await wooRes.json();

    // Brief edge caching to reduce redundant upstream calls; short enough to
    // keep stock/price data reasonably fresh.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
