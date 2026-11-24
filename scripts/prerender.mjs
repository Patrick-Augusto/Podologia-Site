// After `vite build`: puts the rendered page into dist/index.html (so search engines and AI crawlers that don't run
// JavaScript read the whole site), adds the schema.org data and the tags that need the site's address, and writes
// robots.txt and sitemap.xml. The address comes from SITE_URL, or on Vercel from its production domain.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const host = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) || ''
const site = host.replace(/\/+$/, '')

const { render, schema } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const file = resolve('dist/index.html')
let html = readFileSync(file, 'utf8')

const appHtml = render()
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

const json = schema(site).map(s => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n')
const head = [
  site && `<link rel="canonical" href="${site}/">`,
  site && `<meta property="og:url" content="${site}/">`,
  json,
].filter(Boolean).join('\n')
html = html.replace('</head>', `${head}\n</head>`)
if (site) html = html.replace('content="/share.jpg"', `content="${site}/share.jpg"`)
writeFileSync(file, html)

// every crawler is welcome, AI search ones included (they cite the site in their answers)
writeFileSync(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`)
if (site) {
  writeFileSync(resolve('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`)
}
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`prerender: ${(appHtml.length / 1024).toFixed(0)} KB of HTML${site ? `, site ${site}` : ', no SITE_URL (no canonical or sitemap)'}`)
