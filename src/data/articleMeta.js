// Extra gegevens per artikel, los van de inhoud in articles.js:
// - seoTitle: kortere titel voor zoekresultaten (max. 60 tekens); de kop op de pagina blijft de volledige titel
// - related: drie verwante artikels (slugs) voor het blok "Lees ook" onderaan het artikel
export const articleMeta = {
  "huisvesting-gezinshereniging": {
    seoTitle: "Huisvesting bij gezinshereniging: welk bewijs volstaat?",
    related: ["ziekteverzekering-gezinshereniging", "documenten-gezinshereniging-checklist", "inkomen-gezinshereniging-2026-2027"],
  },
  "ziekteverzekering-gezinshereniging": {
    seoTitle: "Ziekteverzekering bij gezinshereniging: welk bewijs?",
    related: ["huisvesting-gezinshereniging", "documenten-gezinshereniging-checklist", "procedure-gezinshereniging"],
  },
  "schijnhuwelijk-onderzoek": {
    seoTitle: "Onderzoek naar schijnhuwelijk: verloop en uw rechten",
    related: ["trouwen-met-buitenlandse-partner", "wettelijk-samenwonen-gezinshereniging", "weigering-gezinshereniging"],
  },
  "gezinshereniging-vluchteling-subsidiair-beschermde": {
    seoTitle: "Gezinshereniging met een vluchteling: wat verandert er?",
    related: ["wetswijziging-gezinshereniging-2025-2027", "kind-naar-belgie-gezinshereniging", "geen-officiele-documenten-gezinshereniging"],
  },
  "behoefteanalyse-gezinshereniging": {
    related: ["inkomen-gezinshereniging-2026-2027", "inkomen-partner-telt-mee-gezinshereniging", "weigering-gezinshereniging"],
  },
  "geen-officiele-documenten-gezinshereniging": {
    related: ["documenten-gezinshereniging-checklist", "kind-naar-belgie-gezinshereniging", "gezinshereniging-vluchteling-subsidiair-beschermde"],
  },
  "wetswijziging-gezinshereniging-2025-2027": {
    seoTitle: "Nieuwe wet gezinshereniging: wat verandert in 2025 en 2027",
    related: ["inkomen-gezinshereniging-2026-2027", "huisvesting-gezinshereniging", "gezinshereniging-vluchteling-subsidiair-beschermde"],
  },
  "documenten-gezinshereniging-checklist": {
    seoTitle: "Checklist: documenten voor gezinshereniging in België",
    related: ["geen-officiele-documenten-gezinshereniging", "procedure-gezinshereniging", "huisvesting-gezinshereniging"],
  },
  "hoe-lang-duurt-gezinshereniging": {
    related: ["procedure-gezinshereniging", "documenten-gezinshereniging-checklist", "fouten-weigering-gezinshereniging"],
  },
  "kosten-gezinshereniging": {
    related: ["hoe-lang-duurt-gezinshereniging", "procedure-gezinshereniging", "inkomen-gezinshereniging-2026-2027"],
  },
  "inkomen-partner-telt-mee-gezinshereniging": {
    related: ["inkomen-gezinshereniging-2026-2027", "behoefteanalyse-gezinshereniging", "partner-naar-belgie-gezinshereniging"],
  },
  "wettelijk-samenwonen-gezinshereniging": {
    seoTitle: "Gezinshereniging als wettelijk samenwonende partner",
    related: ["partner-naar-belgie-gezinshereniging", "trouwen-met-buitenlandse-partner", "schijnhuwelijk-onderzoek"],
  },
  "kind-naar-belgie-gezinshereniging": {
    seoTitle: "Uw kind naar België halen: voorwaarden gezinshereniging",
    related: ["partner-naar-belgie-gezinshereniging", "geen-officiele-documenten-gezinshereniging", "inkomen-gezinshereniging-2026-2027"],
  },
  "fouten-weigering-gezinshereniging": {
    seoTitle: "Gezinshereniging geweigerd? De 5 meest voorkomende fouten",
    related: ["weigering-gezinshereniging", "documenten-gezinshereniging-checklist", "inkomen-gezinshereniging-2026-2027"],
  },
  "partner-naar-belgie-gezinshereniging": {
    seoTitle: "Partner naar België halen: voorwaarden gezinshereniging",
    related: ["inkomen-gezinshereniging-2026-2027", "wettelijk-samenwonen-gezinshereniging", "procedure-gezinshereniging"],
  },
  "inkomen-gezinshereniging-2026-2027": {
    seoTitle: "Inkomenseis gezinshereniging 2026 en 2027: de bedragen",
    related: ["behoefteanalyse-gezinshereniging", "inkomen-partner-telt-mee-gezinshereniging", "wetswijziging-gezinshereniging-2025-2027"],
  },
  "procedure-gezinshereniging": {
    related: ["hoe-lang-duurt-gezinshereniging", "documenten-gezinshereniging-checklist", "kosten-gezinshereniging"],
  },
  "weigering-gezinshereniging": {
    related: ["fouten-weigering-gezinshereniging", "behoefteanalyse-gezinshereniging", "hoe-lang-duurt-gezinshereniging"],
  },
  "trouwen-met-buitenlandse-partner": {
    related: ["schijnhuwelijk-onderzoek", "partner-naar-belgie-gezinshereniging", "wettelijk-samenwonen-gezinshereniging"],
  },
};
