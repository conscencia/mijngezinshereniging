// Per pagina een eigen titel, omschrijving, canonieke link en gestructureerde data.
// Nodig omdat de site één pagina is die zelf van scherm wisselt: zonder dit krijgt
// elke pagina dezelfde titel in de zoekresultaten.
import { useEffect } from "react";

export const SITE = "https://mijngezinshereniging.be";
const MERK = "mijngezinshereniging.be";

// Bij het bouwen (zonder browser) worden de gegevens hier verzameld, zodat
// scripts/prerender.mjs ze in de HTML van elke pagina kan zetten.
export const seoVerzamelaar = { huidig: null };
const inBrowser = typeof document !== "undefined";
function registreerVoorServer(h) {
  if (!inBrowser) seoVerzamelaar.huidig = h;
}

// Google toont ongeveer 60 tekens van een titel en voegt de sitenaam zelf toe.
// De sitenaam komt er dus alleen achter als de titel daarmee niet te lang wordt.
const MAX_TITEL = 60;
export function volledigeTitel(title) {
  if (title.includes(MERK)) return title;
  const met = `${title} | ${MERK}`;
  return met.length <= MAX_TITEL ? met : title;
}

// Alles wat in de <head> van een pagina hoort, als één object (gebruikt in de browser én bij het bouwen).
export function headGegevens({ title, description, path, jsonLd, type = "website", robots }) {
  const url = SITE + path;
  return {
    title: volledigeTitel(title),
    description,
    url,
    type,
    robots,
    locale: "nl_BE",
    lang: "nl-BE",
    jsonLd: (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean),
  };
}

function zetMeta(attr, naam, inhoud) {
  let el = document.head.querySelector(`meta[${attr}="${naam}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, naam);
    document.head.appendChild(el);
  }
  el.setAttribute("content", inhoud);
}

function zetLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function zetAlternate(hreflang, href) {
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function zetJsonLd(data) {
  document.head.querySelectorAll('script[data-seo="1"]').forEach((el) => el.remove());
  (Array.isArray(data) ? data : [data]).filter(Boolean).forEach((blok) => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.seo = "1";
    el.textContent = JSON.stringify(blok);
    document.head.appendChild(el);
  });
}

export function useSeo(opties) {
  registreerVoorServer(headGegevens(opties));
  // Als tekst doorgeven, zodat het effect enkel opnieuw loopt als er echt iets wijzigt.
  const sleutel = JSON.stringify(headGegevens(opties));

  useEffect(() => {
    const h = JSON.parse(sleutel);
    document.title = h.title;
    zetMeta("name", "description", h.description);
    zetLink("canonical", h.url);
    // Taalkoppeling: nu enkel Nederlands; zodra er een Franse versie is, komt hier een fr-BE-regel bij.
    zetAlternate(h.lang, h.url);
    zetAlternate("x-default", h.url);
    zetMeta("property", "og:title", h.title);
    zetMeta("property", "og:description", h.description);
    zetMeta("property", "og:url", h.url);
    zetMeta("property", "og:type", h.type);
    zetMeta("property", "og:site_name", MERK);
    zetMeta("property", "og:locale", h.locale);
    zetMeta("name", "twitter:card", "summary");
    if (h.robots) zetMeta("name", "robots", h.robots);
    else document.head.querySelector('meta[name="robots"]')?.remove();
    zetJsonLd(h.jsonLd);
  }, [sleutel]);
}

// Dezelfde gegevens als HTML-regels, voor de vooraf gebouwde pagina's.
export function headHtml(h) {
  const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const regels = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${esc(h.url)}" />`,
    `<link rel="alternate" hreflang="${esc(h.lang)}" href="${esc(h.url)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${esc(h.url)}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.url)}" />`,
    `<meta property="og:type" content="${esc(h.type)}" />`,
    `<meta property="og:site_name" content="${MERK}" />`,
    `<meta property="og:locale" content="${esc(h.locale)}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ];
  if (h.robots) regels.push(`<meta name="robots" content="${esc(h.robots)}" />`);
  for (const blok of h.jsonLd) {
    regels.push(`<script type="application/ld+json" data-seo="1">${JSON.stringify(blok).replace(/</g, "\\u003c")}</script>`);
  }
  return regels.join("\n    ");
}

// De advocaat wordt genoemd zonder naam, zolang het kantoor niet publiek mag zijn.
export const organisatie = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: MERK,
  url: SITE,
  email: "info@mijngezinshereniging.be",
  areaServed: { "@type": "Country", name: "België" },
  availableLanguage: ["nl", "fr", "en"],
  knowsAbout: ["gezinshereniging", "verblijfsrecht", "vreemdelingenrecht"],
};

export function faqSchema(vragen) {
  if (!vragen || !vragen.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vragen.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: typeof a === "string" ? a : "" },
    })).filter((v) => v.acceptedAnswer.text),
  };
}

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

// "14 september 2026" omzetten naar 2026-09-14, zoals zoekmachines het verwachten
export function isoDatum(datum) {
  const m = /^(\d{1,2}) ([a-zé]+) (\d{4})$/i.exec((datum || "").trim());
  if (!m) return undefined;
  const maand = MAANDEN.indexOf(m[2].toLowerCase());
  if (maand < 0) return undefined;
  return `${m[3]}-${String(maand + 1).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
}

export function artikelSchema(artikel) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artikel.title,
    description: artikel.excerpt,
    datePublished: isoDatum(artikel.date),
    dateModified: isoDatum(artikel.updated || artikel.date),
    inLanguage: "nl-BE",
    mainEntityOfPage: `${SITE}/blog/${artikel.slug}`,
    author: { "@type": "Person", jobTitle: "Advocaat", affiliation: "Balie West-Vlaanderen", name: "Advocaat, balie West-Vlaanderen" },
    publisher: { "@type": "Organization", name: MERK, url: SITE },
  };
}

export function kruimels(paden) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: paden.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.naam,
      item: SITE + p.pad,
    })),
  };
}
