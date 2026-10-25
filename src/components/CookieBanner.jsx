import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GA_ID } from "../config";
import { readConsent, saveConsent, initConsentDefaults, enableAnalytics, clearAnalyticsCookies, trackPageview } from "../lib/analytics";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const dialoog = useRef(null);
  const eersteKnop = useRef(null);

  useEffect(() => {
    if (!GA_ID) return;
    initConsentDefaults();
    const keuze = readConsent();
    if (!keuze) setOpen(true);
    else if (keuze.keuze === "alles") enableAnalytics();
  }, []);

  // Andere pagina binnen de site: apart doorgeven, anders telt alleen de eerste pagina mee.
  useEffect(() => { trackPageview(pathname); }, [pathname]);

  // De voettekst kan de keuze opnieuw openen.
  useEffect(() => {
    const opnieuw = () => setOpen(true);
    window.addEventListener("mgz-cookievoorkeuren", opnieuw);
    return () => window.removeEventListener("mgz-cookievoorkeuren", opnieuw);
  }, []);

  // Zolang de vraag openstaat: focus in het venster houden en de pagina niet laten scrollen.
  useEffect(() => {
    if (!open) return;
    eersteKnop.current?.focus();
    const vorigeOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opTab = (e) => {
      if (e.key !== "Tab" || !dialoog.current) return;
      const velden = dialoog.current.querySelectorAll("a[href], button");
      if (!velden.length) return;
      const eerste = velden[0];
      const laatste = velden[velden.length - 1];
      if (e.shiftKey && document.activeElement === eerste) { e.preventDefault(); laatste.focus(); }
      else if (!e.shiftKey && document.activeElement === laatste) { e.preventDefault(); eerste.focus(); }
    };
    document.addEventListener("keydown", opTab);
    return () => { document.removeEventListener("keydown", opTab); document.body.style.overflow = vorigeOverflow; };
  }, [open]);

  const kies = (keuze) => {
    saveConsent(keuze);
    setOpen(false);
    if (keuze === "alles") { enableAnalytics(); trackPageview(pathname); }
    else clearAnalyticsCookies();
  };

  if (!open) return null;

  return (
    <div className="mg-cookieoverlay">
      <div className="mg-cookiekaart" role="dialog" aria-modal="true" aria-labelledby="cookietitel" ref={dialoog}>
        <p className="mg-cookiebar-title" id="cookietitel">Mogen wij bijhouden hoe de website gebruikt wordt?</p>
        <p className="mg-cookiebar-text">
          Wij gebruiken Google Analytics om te zien welke pagina's bezocht worden. Daarvoor worden cookies geplaatst en gegevens doorgegeven aan Google.
          Zonder uw toestemming gebeurt dit niet en werkt de website gewoon.{" "}
          <Link to="/cookies" className="mg-cookiebar-link" onClick={() => kies("noodzakelijk")}>Lees het cookiebeleid</Link>.
        </p>
        <div className="mg-cookiebar-buttons">
          <button type="button" ref={eersteKnop} className="mg-btn mg-btn-outline mg-btn-sm" onClick={() => kies("noodzakelijk")}>Weigeren</button>
          <button type="button" className="mg-btn mg-btn-rust mg-btn-sm" onClick={() => kies("alles")}>Aanvaarden</button>
        </div>
      </div>
    </div>
  );
}
