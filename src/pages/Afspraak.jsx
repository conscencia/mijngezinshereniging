import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CAL_LINK } from "../config";
import { startBooking } from "../lib/booking";

// Voorlopig enkel gesprekken op weekdagen tussen 19 en 20 uur, en in het weekend (Belgische tijd).
function isConsultMoment(startIso) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date(startIso));
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const weekday = get("weekday");
  if (weekday === "Sat" || weekday === "Sun") return true;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return minutes >= 19 * 60 && minutes + 30 <= 20 * 60;
}

export default function Afspraak() {
  const embedRef = useRef(null);

  useEffect(() => {
    startBooking(embedRef.current, CAL_LINK, { videoOnly: true, allowSlot: isConsultMoment });
  }, []);

  return (
    <div className="bg-white">
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 sm:py-9">
          <p className="mg-eyebrow mg-eyebrow-light mb-2">Videogesprek van 30 minuten &middot; &euro;75 excl. btw</p>
          <h1 className="mg-tool-h1 text-white">Maak een <em>afspraak</em></h1>
        </div>
      </section>

      <section className="pt-8 pb-16 sm:pt-12 sm:pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div ref={embedRef} className="booking-embed" aria-live="polite" />
          </div>

          <div className="lg:col-span-5 order-2 lg:order-1">
            <p className="mg-eyebrow">Zo werkt het</p>
            <ol className="mg-steps-list">
              <li><strong>Kies een dag en een uur</strong> in de agenda. U ziet alleen de momenten die nog vrij zijn.</li>
              <li><strong>Vul uw gegevens in</strong> en omschrijf kort uw vraag, zodat het gesprek goed voorbereid kan worden.</li>
              <li><strong>U krijgt een bevestiging</strong> per e-mail, met de link naar het videogesprek.</li>
            </ol>
            <p className="mg-body mg-justify mt-8">
              In een videogesprek van 30 minuten bekijken we uw situatie en uw kansen. U heeft enkel een smartphone, tablet of computer met internet nodig. Beslist u daarna om verder te gaan, dan spreken we een vaste prijs af voor uw dossier.
            </p>
            <p className="mg-disclaimer mt-6">
              Liever eerst een vraag stellen? Gebruik dan het <Link to="/contact" className="underline underline-offset-2">contactformulier</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
