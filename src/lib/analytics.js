// Google Analytics 4 wordt pas geladen nadat de bezoeker toestemming geeft.
// De keuze wordt bewaard in localStorage; bij weigeren wordt niets van Google geladen.
import { GA_ID } from "../config";

const KEY = "mgz-cookiekeuze";

export function readConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return saved && (saved.keuze === "alles" || saved.keuze === "noodzakelijk") ? saved : null;
  } catch {
    return null;
  }
}

export function saveConsent(keuze) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ keuze, datum: new Date().toISOString() }));
  } catch {
    // Zonder opslag vragen wij het bij het volgende bezoek opnieuw.
  }
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

// Standaard staat alles op geweigerd (Google Consent Mode).
export function initConsentDefaults() {
  if (!GA_ID) return;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  window.gtag = window.gtag || gtag;
}

export function enableAnalytics() {
  if (!GA_ID || window.__mgzGaGeladen) return;
  window.__mgzGaGeladen = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
  gtag("consent", "update", { analytics_storage: "granted" });
}

// Bij weigeren of intrekken: cookies van Google weghalen.
export function clearAnalyticsCookies() {
  document.cookie.split(";").forEach((c) => {
    const naam = c.split("=")[0].trim();
    if (naam.startsWith("_ga")) {
      const host = location.hostname.replace(/^www\./, "");
      document.cookie = `${naam}=; Max-Age=0; path=/`;
      document.cookie = `${naam}=; Max-Age=0; path=/; domain=.${host}`;
    }
  });
}

// Elke paginawissel doorgeven, want de site is één pagina die zelf van scherm wisselt.
export function trackPageview(pad) {
  if (!GA_ID || !window.__mgzGaGeladen || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", { page_path: pad, page_location: location.origin + pad });
}

// Belangrijke acties meten: enkel als de bezoeker toestemming gaf en Analytics geladen is.
export function trackEvent(naam, params = {}) {
  if (!GA_ID || !window.__mgzGaGeladen || typeof window.gtag !== "function") return;
  window.gtag("event", naam, params);
}
