// Verstuurt een formulier via Netlify Forms. Netlify herkent de formulieren aan de verborgen
// kopieën in index.html en mailt elke inzending naar het adres dat in Netlify is ingesteld.
export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 8 * 1024 * 1024;

import { trackEvent } from "./analytics";

export async function sendForm(formName, fields, files = []) {
  const body = new FormData();
  body.append("form-name", formName);
  Object.entries(fields).forEach(([key, value]) => body.append(key, value == null ? "" : String(value)));
  files.slice(0, MAX_FILES).forEach((file, i) => body.append(`bijlage${i + 1}`, file, file.name));

  const res = await fetch("/", { method: "POST", body });
  if (!res.ok) throw new Error("Versturen mislukt (" + res.status + ")");
  trackEvent(formName === "contact" ? "contact_verstuurd" : "situatiecheck_verstuurd");
}
