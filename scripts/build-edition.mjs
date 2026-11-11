// Génère data/latest.json (+ archive du jour) : presse, Évangile. Exécuté par GitHub Actions.
// Aucune donnée inventée : un flux indisponible reste simplement vide.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const ROOT = new URL('../', import.meta.url);
const MAX_AGE_H = 48;
const TARGET = { france: 10, monde: 5 };

// Sources reconnues, françaises et étrangères. lang : langue des titres.
const FEEDS = {
  france: [
    ['franceinfo', 'https://www.francetvinfo.fr/france.rss', 'fr'],
    ['Le Monde', 'https://www.lemonde.fr/rss/une.xml', 'fr'],
    ['Ouest-France', 'https://www.ouest-france.fr/rss/une', 'fr'],
    ['Le Figaro', 'https://www.lefigaro.fr/rss/figaro_actualites-a-la-une.xml', 'fr'],
    ['Libération', 'https://www.liberation.fr/arc/outboundfeeds/rss-all/?outputType=xml', 'fr'],
  ],
  monde: [
    ['BBC News (Royaume-Uni, en anglais)', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'en'],
    ['The Guardian (Royaume-Uni, en anglais)', 'https://www.theguardian.com/world/rss', 'en'],
    ['Deutsche Welle (Allemagne, en anglais)', 'https://rss.dw.com/rdf/rss-en-world', 'en'],
    ['Al Jazeera (Qatar, en anglais)', 'https://www.aljazeera.com/xml/rss/all.xml', 'en'],
    ['France 24', 'https://www.france24.com/fr/rss', 'fr'],
    ['Le Monde International', 'https://www.lemonde.fr/international/rss_full.xml', 'fr'],
  ],
};

const parisDay = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const today = parisDay();

async function get(url, accept = '*/*') {
  const r = await fetch(url, { headers: { 'User-Agent': 'LaBonneInfoBot/1.0', Accept: accept }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r;
}

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
const tag = (block, name) => { const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')); return m ? decode(m[1]) : ''; };

function parseFeed(xml) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blocks.map(b => {
    let link = tag(b, 'link');
    if (!link) { const m = b.match(/<link[^>]*href="([^"]+)"/i); link = m ? m[1] : ''; }
    const date = tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated');
    const t = new Date(date);
    return { title: tag(b, 'title'), link, publishedAt: Number.isFinite(t.getTime()) ? t.toISOString() : null };
  });
}

async function readFeed([name, url, lang]) {
  try {
    const xml = await (await get(url, 'application/rss+xml, application/xml, text/xml')).text();
    const min = Date.now() - MAX_AGE_H * 3600e3;
    const items = parseFeed(xml)
      .filter(a => a.title && /^https:\/\//.test(a.link) && a.publishedAt && new Date(a.publishedAt).getTime() >= min && new Date(a.publishedAt).getTime() <= Date.now() + 3600e3)
      .map(a => ({ id: 'a' + createHash('sha1').update(a.link).digest('hex').slice(0, 10), title: a.title, link: a.link, source: name, lang, publishedAt: a.publishedAt }))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return { name, url, ok: items.length > 0, items };
  } catch (e) {
    console.warn('Flux KO :', name, e.message);
    return { name, url, ok: false, items: [] };
  }
}

// Tourniquet entre les médias pour que la sélection soit variée, titres les plus récents d'abord.
function interleave(results, n) {
  const queues = results.filter(r => r.items.length).map(r => [...r.items]);
  const out = [], seen = new Set();
  while (out.length < n && queues.some(q => q.length)) {
    for (const q of queues) {
      while (q.length && seen.has(q[0].link)) q.shift();
      const a = q.shift();
      if (a) { seen.add(a.link); out.push(a); if (out.length >= n) break; }
    }
  }
  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function evangile() {
  try {
    const j = await (await get(`https://api.aelf.org/v1/messes/${today}/france`, 'application/json')).json();
    const lect = (j.messes?.[0]?.lectures || []).find(l => l.type === 'evangile');
    if (!lect) throw new Error('pas d\'évangile');
    return { ok: true, reference: (lect.ref || '').trim(), title: decode(lect.titre || ''), source: 'AELF', link: `https://www.aelf.org/${today}/france/messe`, validation: 'automatique' };
  } catch (e) { console.warn('Évangile KO :', e.message); return null; }
}

async function previous() { try { return JSON.parse(await readFile(new URL('data/latest.json', ROOT), 'utf8')); } catch { return null; } }

const prev = await previous();
const [fr, mo, gospel] = await Promise.all([
  Promise.all(FEEDS.france.map(readFeed)),
  Promise.all(FEEDS.monde.map(readFeed)),
  evangile(),
]);
const news = { france: interleave(fr, TARGET.france), monde: interleave(mo, TARGET.monde) };
const sources = [...fr.map(r => ({ name: r.name + ' (France)', url: r.url, ok: r.ok, count: r.items.length })), ...mo.map(r => ({ name: r.name + ' (Monde)', url: r.url, ok: r.ok, count: r.items.length }))];

const keepPrev = prev && prev.date === today;
const edition = {
  schemaVersion: 2,
  date: today,
  generatedAt: new Date().toISOString(),
  status: news.france.length >= TARGET.france && news.monde.length >= TARGET.monde ? 'complète' : 'partielle',
  news,
  sources,
  // Météo et carburants sont récupérés en direct par le navigateur (live.js).
  meteo: { ok: false, city: 'Montaigu-Vendée', source: 'Open-Meteo', sourceUrl: 'https://open-meteo.com/en/docs', fetchedAt: null },
  carburants: { ok: false, prices: [], best: {}, stationsVerifiees: 0, source: 'prix-carburants.gouv.fr', sourceUrl: 'https://www.prix-carburants.gouv.fr/rubrique/opendata/' },
  evangile: gospel || (keepPrev ? prev.evangile : { ok: false }),
  // Les événements culturels sont conservés tant qu'ils ne sont pas terminés (saisie manuelle dans le fichier).
  culture: (prev?.culture || []).filter(e => e.end >= today),
  history: keepPrev ? prev.history || [] : [],
  checks: { actualites: news.france.length + news.monde.length > 0, meteo: false, carburants: false, evangile: !!gospel },
};

const dataDir = new URL('data/', ROOT);
await mkdir(new URL('editions/', dataDir), { recursive: true });
const json = JSON.stringify(edition, null, 2);
await writeFile(new URL('latest.json', dataDir), json);
await writeFile(new URL(`editions/${today}.json`, dataDir), json);

let index = [];
try { index = JSON.parse(await readFile(new URL('index.json', dataDir), 'utf8')); } catch {}
index = [{ date: today, path: `data/editions/${today}.json` }, ...index.filter(x => x.date !== today)].slice(0, 60);
await writeFile(new URL('index.json', dataDir), JSON.stringify(index, null, 2));

console.log(`OK ${today} : France ${news.france.length}, Monde ${news.monde.length}, Évangile ${gospel ? gospel.reference : 'non'}`);
