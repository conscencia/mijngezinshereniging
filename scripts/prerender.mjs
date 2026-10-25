// Bouwt na "vite build" elke pagina als volwaardige HTML (titel, omschrijving, tekst),
// zodat Google en AI-bots de inhoud zien zonder JavaScript uit te voeren.
// Maakt ook sitemap.xml, llms.txt en een 404-pagina aan in de map dist.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const serverMap = path.join(dist, ".server");
const { render, routes, articles, SITE } = await import(pathToFileURL(path.join(serverMap, "entry-server.js")).href);
const { headHtml, isoDatum } = await import(pathToFileURL(path.join(serverMap, "entry-server.js")).href);

const sjabloon = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!sjabloon.includes('<div id="root"></div>')) throw new Error("Geen <div id=\"root\"></div> gevonden in dist/index.html");

function schrijfPagina(pad, bestand) {
  const { html, seo } = render(pad);
  if (!seo) throw new Error(`Geen SEO-gegevens voor ${pad}`);
  const pagina = sjabloon
    .replace(/\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace("</head>", `    ${headHtml(seo)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  fs.mkdirSync(path.dirname(bestand), { recursive: true });
  fs.writeFileSync(bestand, pagina);
  return html.length;
}

const paginas = [
  ...routes.map((r) => ({ path: r.path, lastmod: r.lastmod, prioriteit: r.prioriteit })),
  ...articles.map((a) => ({ path: `/blog/${a.slug}`, lastmod: isoDatum(a.updated || a.date), prioriteit: "0.8" })),
];

let totaal = 0;
for (const p of paginas) {
  const bestand = p.path === "/" ? path.join(dist, "index.html") : path.join(dist, p.path, "index.html");
  const n = schrijfPagina(p.path, bestand);
  totaal += n;
  console.log(`${p.path.padEnd(60)} ${String(n).padStart(7)} tekens`);
}
schrijfPagina("/pagina-bestaat-niet", path.join(dist, "404.html"));
console.log(`404.html gebouwd. ${paginas.length} pagina's, ${totaal} tekens HTML.`);

// Sitemap met wijzigingsdatums
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.prioriteit}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

// llms.txt: korte wegwijzer voor AI-systemen, opgebouwd uit de bestaande teksten van de site
const llms = `# mijngezinshereniging.be

> Juridische informatie over gezinshereniging in België, geschreven door een advocaat ingeschreven aan de balie West-Vlaanderen. Uitleg over de voorwaarden, de inkomenseis, de procedure en wat u kunt doen bij een weigering, met een gratis situatiecheck en de mogelijkheid om een videogesprek te plannen.

Taal: Nederlands. Alle bedragen en termijnen gelden voor België.

## Hoofdpagina's

- [Voorwaarden en procedure](${SITE}/informatie): de voorwaarden per gezinslid, de stappen van de procedure, de inkomenseis met de bedragen van 2026 en 2027 en veelgestelde vragen
- [Gratis situatiecheck](${SITE}/tool): korte vragenlijst die aangeeft of u in aanmerking komt
- [Tarieven](${SITE}/tarieven): wat een advocaat kost bij gezinshereniging
- [Afspraak](${SITE}/afspraak): een videogesprek met de advocaat plannen
- [Contact](${SITE}/contact): uw vraag voorleggen
- [Over ons](${SITE}/over-ons)

## Artikels

${articles.map((a) => `- [${a.title}](${SITE}/blog/${a.slug}): ${a.excerpt}`).join("\n")}
`;
fs.writeFileSync(path.join(dist, "llms.txt"), llms);

fs.rmSync(serverMap, { recursive: true, force: true });
console.log("sitemap.xml en llms.txt geschreven.");
