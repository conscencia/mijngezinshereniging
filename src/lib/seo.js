// Per pagina een eigen titel, omschrijving, canonieke link en gestructureerde data.
// Nodig omdat de site één pagina is die zelf van scherm wisselt: zonder dit krijgt
// elke pagina dezelfde titel in de zoekresultaten.
import { useEffect } from "react";

export const SITE = "https://mijngezinshereniging.be";
const MERK = "mijngezinshereniging.be";

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

export function useSeo({ title, description, path, jsonLd, type = "website" }) {
  useEffect(() => {
    const volledig = title.includes(MERK) ? title : `${title} | ${MERK}`;
    const url = SITE + path;
    document.title = volledig;
    zetMeta("name", "description", description);
    zetLink("canonical", url);
    zetMeta("property", "og:title", volledig);
    zetMeta("property", "og:description", description);
    zetMeta("property", "og:url", url);
    zetMeta("property", "og:type", type);
    zetMeta("property", "og:site_name", MERK);
    zetMeta("property", "og:locale", "nl_BE");
    zetMeta("name", "twitter:card", "summary");
    zetJsonLd(jsonLd);
  }, [title, description, path, type, JSON.stringify(jsonLd)]);
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
