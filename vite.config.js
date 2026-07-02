import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// ── Build-time sitemap + robots generator ──
// Collects every tool route id from the registry + *Tools.jsx config files and
// writes dist/sitemap.xml and dist/robots.txt using the deploy URL. On Netlify,
// the `URL` env var is set automatically; otherwise set VITE_SITE_URL.
function seoFilesPlugin() {
  const collectToolIds = () => {
    const dir = path.resolve('src/tools');
    const files = fs
      .readdirSync(dir)
      .filter((f) => f === 'registry.js' || /Tools\.jsx$/.test(f));
    const ids = new Set();
    const re = /\bid:\s*'([a-z0-9-]+)'/g;
    for (const f of files) {
      const txt = fs.readFileSync(path.join(dir, f), 'utf8');
      let m;
      while ((m = re.exec(txt))) ids.add(m[1]);
    }
    return [...ids];
  };

  return {
    name: 'seo-files',
    apply: 'build',
    closeBundle() {
      const base = (
        process.env.VITE_SITE_URL ||
        process.env.URL ||
        'https://promptcraft.netlify.app'
      ).replace(/\/$/, '');
      const ids = collectToolIds();
      const routes = ['/', '/templates', '/tools', ...ids.map((id) => `/tools/${id}`)];
      const today = new Date().toISOString().slice(0, 10);

      const urls = routes
        .map(
          (r) =>
            `  <url>\n    <loc>${base}${r}</loc>\n    <lastmod>${today}</lastmod>\n` +
            `    <changefreq>weekly</changefreq>\n    <priority>${r === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
        )
        .join('\n');
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

      const outDir = path.resolve('dist');
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      );
      // eslint-disable-next-line no-console
      console.log(`\n[seo-files] wrote sitemap.xml (${routes.length} URLs) + robots.txt for ${base}`);
    },
  };
}

// Vite config — React + Tailwind v4 (via the official Vite plugin, no postcss config needed).
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFilesPlugin()],
  // Honor a PORT env var (used by the preview tooling) when present.
  server: { port: process.env.PORT ? Number(process.env.PORT) : 5173 },
});
