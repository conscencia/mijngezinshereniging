/* eslint-disable react-refresh/only-export-components -- draait enkel bij het bouwen, niet in de browser */
// Wordt enkel gebruikt bij het bouwen (scripts/prerender.mjs): rendert elke pagina
// één keer naar HTML, zodat Google en AI-bots meteen de echte inhoud zien.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { seoVerzamelaar } from "./lib/seo.js";

export { routes } from "./routes.js";
export { articles } from "./data/articles.js";
export { SITE, headHtml, isoDatum } from "./lib/seo.js";

export function render(pad) {
  seoVerzamelaar.huidig = null;
  const html = renderToString(
    <StaticRouter location={pad}>
      <App />
    </StaticRouter>
  );
  return { html, seo: seoVerzamelaar.huidig };
}
