// Nederlandse woordafbreking voor uitgevulde tekst.
// Browsers breken Nederlands niet overal af, waardoor uitgevulde tekst grote gaten krijgt.
// We voegen zachte afbreekstreepjes (U+00AD) toe aan tekst in alinea's en lijsten;
// de browser toont een streepje alleen waar een woord effectief wordt afgebroken.

const SHY = "­";
const SELECTOR = "p, li, dd";
let hyphenate = null;
let enabled = true;
let observer = null;
let scheduled = false;

function shouldSkip(el) {
  return !el || el.closest(".notranslate, [translate='no'], input, textarea, select, button, a[href^='mailto:'], a[href^='tel:']");
}

function processNode(node) {
  const el = node.parentElement;
  if (!el || !el.closest(SELECTOR) || shouldSkip(el)) return;
  const text = node.nodeValue;
  if (!text || text.length < 8 || !/[A-Za-zÀ-ÿ]{7,}/.test(text)) return;
  const out = hyphenate(text.replaceAll(SHY, ""), { minWordLength: 7 });
  if (out !== text) node.nodeValue = out;
}

function run(root = document.getElementById("root")) {
  scheduled = false;
  if (!enabled || !hyphenate || !root) return;
  observer?.disconnect();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) processNode(n);
  observer?.observe(root, { childList: true, subtree: true, characterData: true });
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => run());
}

export async function startHyphenation() {
  const root = document.getElementById("root");
  if (!root || observer) return;
  const mod = await import("hyphen/nl");
  hyphenate = (mod.default || mod).hyphenateSync;
  observer = new MutationObserver(schedule);
  run(root);
}

// Voor een vertaling: streepjes weghalen zodat de vertaler hele woorden ziet.
export function setHyphenation(on) {
  enabled = on;
  const root = document.getElementById("root");
  if (!root) return;
  if (on) { schedule(); return; }
  observer?.disconnect();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeValue.includes(SHY)) n.nodeValue = n.nodeValue.replaceAll(SHY, "");
  }
}
