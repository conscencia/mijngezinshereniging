import { Link } from "react-router-dom";
import { BOOKING_URL } from "../config";

export default function Tarieven() {
  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <p className="mg-eyebrow mg-eyebrow-light">Tarieven</p>
          <h1 className="mg-display text-white max-w-3xl">Duidelijke prijzen, <em>vooraf</em></h1>
          <p className="mg-lead text-primary-100 mt-6 max-w-2xl">
            Geen verrassingen achteraf. U kent altijd de volledige prijs voor we beginnen.
          </p>
        </div>
      </section>

      {/* Pro-deo melding */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong>Heeft u beperkte financiële middelen?</strong> Laat dit gerust weten. Wij bekijken samen of u eventueel in aanmerking komt voor gratis juridische bijstand (pro-deo).
          </p>
        </div>
      </div>

      {/* Tariefkaarten */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Stap 1: Intakegesprek */}
            <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Stap 1</p>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Consultatie</h2>
                <p className="text-sm text-gray-500">Videocall van 30 minuten</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-primary-700">€75</span>
                <span className="text-gray-400 text-sm ml-1">excl. btw</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-8 flex-1">
                {["Bespreking van uw situatie en slaagkansen", "Brede analyse van uw mogelijkheden", "Algemene vragen beantwoord", "U krijgt een vaste prijs voor uw dossier"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm mb-3"
              >
                Direct inboeken
              </a>
              <Link
                to="/contact"
                className="block w-full text-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Of neem contact op
              </Link>
            </div>

            {/* Stap 2: Begeleiding A tot Z */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Stap 2</p>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Begeleiding van A tot Z</h2>
                <p className="text-sm text-gray-500">Bij uw aanvraag</p>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-black text-gray-900">Vaste prijs</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">We spreken tijdens de consultatie één vast bedrag af voor uw volledige dossier. Is een vaste prijs niet mogelijk, dan geldt een uurtarief van €125 excl. btw.</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8 flex-1">
                {["Schriftelijk juridisch advies", "Volledige documentencheck", "Voorbereiding van uw aanvraag", "Volledige prijs vooraf, geen verrassingen"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center border border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Neem contact op
              </Link>
            </div>

            {/* Stap 3: Hoger beroep */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Stap 3</p>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Hoger beroep</h2>
                <p className="text-sm text-gray-500">Tegen een weigeringsbeslissing</p>
              </div>
              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-900">Vaste prijs op maat</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-8 flex-1">
                {["Beoordeling van de weigeringsbeslissing", "Opmaak beroepschrift", "Vertegenwoordiging bij de Raad voor Vreemdelingenbetwistingen"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center border border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Neem contact op
              </Link>
            </div>
          </div>

          {/* Toelichting */}
          <div className="mt-10 bg-gray-50 rounded-2xl p-6 sm:p-8 text-sm text-gray-600 leading-relaxed space-y-3 text-justify">
            <p>
              Tijdens de consultatie van €75 excl. btw spreken we een vaste prijs af voor uw volledige dossier, zodat u exact weet waar u aan toe bent. Is een vaste prijs niet mogelijk, dan rekenen we af aan €125 excl. btw per uur.
            </p>
            <p>
              Wij dienen geen aanvragen in namens u. Wij adviseren u en controleren uw documenten zodat uw aanvraag zo sterk mogelijk staat.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-primary-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Veelgestelde vragen over tarieven</h2>
          <div className="space-y-5">
            {[
              {
                q: "Wat kost een consultatie?",
                a: "Een consultatie van 30 minuten kost €75 excl. btw. We bekijken samen uw situatie en spreken een vaste prijs af voor uw dossier.",
              },
              {
                q: "Wanneer weet ik wat de exacte prijs wordt?",
                a: "Tijdens de consultatie spreken we een vaste prijs af op basis van uw specifieke situatie. U beslist zelf of u verdergaat.",
              },
              {
                q: "Waarom start u met een consultatie?",
                a: "Gezinshereniging is maatwerk. Om u correct te kunnen adviseren, moeten wij uw situatie volledig begrijpen. Dat vraagt een persoonlijk gesprek. Zonder dat beeld is het niet mogelijk om gerichte begeleiding op te starten.",
              },
              {
                q: "Is mijn situatie vertrouwelijk?",
                a: "Alles wat u deelt valt onder het beroepsgeheim van de advocaat. Uw gegevens worden nooit gedeeld zonder uw uitdrukkelijke toestemming.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-l-2 border-primary-200 pl-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed text-justify">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
