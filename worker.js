
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/sitemap.xml") {
      return generateSitemap(env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function generateSitemap(env) {
  const siteUrl = "https://voltbridgetechnologies.com";

  const staticPages = [
    "/",
    "/about",
    "/contact",
    "/service-center",
    "/privacy-policy",
    "/extended-warranty",
    "/terms-and-conditions",
    "/shipping-and-return-policy",
    "/faqs",
  ];

  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return new Response("Sitemap configuration is incomplete.", {
      status: 500,
    });
  }

  try {
    const productsUrl = new URL(
      "/rest/v1/products",
      env.SUPABASE_URL
    );

    productsUrl.searchParams.set("select", "id");
    productsUrl.searchParams.set("is_active", "eq.true");

    const response = await fetch(productsUrl, {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
      },
    });

    if (!response.ok) {
      return new Response("Unable to retrieve products.", {
        status: 502,
      });
    }

    const products = await response.json();

    const urls = [
      ...staticPages.map((page) => `${siteUrl}${page}`),
      ...products.map(
        (product) => `${siteUrl}/product/${product.id}`
      ),
    ];

    const xmlEscape = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`)
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Error generating sitemap.", {
      status: 500,
    });
  }
}
