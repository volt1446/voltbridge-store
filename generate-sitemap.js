import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// 1. Replace these strings with your actual Supabase URL and Anon Key
const SUPABASE_URL = "https://nljehgymahdfnqnhgtyb.supabase.co";
const SUPABASE_KEY = "sb_publishable_365mr0RATA17guLQ6xFlWg_P4HaFrez"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SITE_URL = "https://voltbridgetechnologies.com";

async function generateSitemap() {
  try {
    // 2. This queries your Supabase database table named 'products'
    const { data: products, error } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true);

    if (error) throw error;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://sitemaps.org">\n`;

    // Core Static Website Pages
    const staticPaths = ['', '/about', '/contact', '/faqs'];
    staticPaths.forEach(path => {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${path}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${path === '' ? '1.0' : '0.7'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Product Pages matching your React Router parameters (/product/:id)
    products?.forEach(product => {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/product/${product.id}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    // Writes the finished map directly to your public folder
    fs.writeFileSync('./public/sitemap.xml', xml);
    console.log('✅ sitemap.xml generated successfully with live inventory data!');
  } catch (err) {
    console.error('❌ Failed to generate sitemap:', err);
  }
}

generateSitemap();
