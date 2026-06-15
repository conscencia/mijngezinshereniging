import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scroller } from "../components/ui/Scroller";

const faqs = [
  {
    q: "Hoeveel inkomen moet ik hebben voor gezinshereniging?",
    a: "De inkomensgrens bedraagt in 2026 €2.173,88 netto per maand (120% leefloon voor persoon met gezin ten laste). Loon uit werk en werkloosheidsuitkering (als u actief werk zoekt) tellen mee. Leefloon en OCMW-steun tellen niet mee.",
  },
  {
    q: "Hoe lang duurt een aanvraag voor gezinshereniging?",
    a: "Gemiddeld 3 tot 6 maanden. De Dienst Vreemdelingenzaken (DVZ) beslist binnen deze termijn. Bij onvolledige dossiers kan dit langer duren. Een goed voorbereid dossier verkort de doorlooptijd aanzienlijk.",
  },
  {
    q: "Wat als mijn aanvraag wordt geweigerd?",
    a: "U kunt binnen 30 dagen beroep aantekenen bij de Raad voor Vreemdelingenbetwistingen. Met professionele juridische begeleiding kan uw dossier herbekeken en sterker ingediend worden. Een weigering is geen eindpunt.",
  },
];


function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full text-left px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
        <svg className={`w-5 h-5 text-primary-500 flex-shrink-0 ml-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100">{a}</div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO — video achtergrond */}
      <section className="relative text-white overflow-hidden flex items-center" style={{ minHeight: "620px" }}>
        {/* Achtergrondvideo — sla uw videobestand op als public/hero.mp4 */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Groen overlay voor leesbaarheid */}
        <div className="absolute inset-0 bg-primary-900/65" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-300 rounded-full"></span>
              Juridisch advies · Actief in heel Vlaanderen
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Samen zijn met{" "}
              <span className="text-green-300">uw dierbaren?</span>
            </h1>
            <p className="text-lg text-green-100 leading-relaxed mb-8">
              Uw kinderen of ouders naar België halen, trouwen met iemand uit het buitenland of een verblijfsvergunning regelen: wij begeleiden u van A tot Z.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/contact" className="border-2 border-white/40 hover:border-white text-white font-semibold px-7 py-3.5 rounded-xl text-center transition-colors text-base">
                Vraag hier meer advies
              </Link>
            </div>
            <p className="text-sm text-green-200">
              Eerst zelf nagaan of u in aanmerking komt voor gezinshereniging?{" "}
              <Link to="/tool" className="underline underline-offset-2 hover:text-white transition-colors font-semibold">Doe hier onze check</Link>
              {" "}Binnen twee minuten een antwoord.
            </p>
          </div>
        </div>
      </section>


      {/* DIENSTEN */}
      <section className="py-14 bg-primary-100/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Waarmee kunnen wij u helpen?</h2>
          </div>
          <Scroller overflow="x" width="100%" withButtons>
            <div className="flex gap-5 pb-2">
              {[
                {
                  title: "Gezinshereniging",
                  desc: "Herenigen met een geliefde in België? Welke voorwaarden gelden er? Wat als mijn inkomen net niet volstaat? Hoe lang duurt de procedure? Juridisch advies en bijstand bij elke stap.",
                  link: "/informatie",
                  cta: "Meer informatie",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></>,
                },
                {
                  title: "Huwen met een buitenlandse partner",
                  desc: "Welke documenten heb ik nodig? Wat is een apostille en hoe vraag ik die aan? Waar voer ik de huwelijksprocedure? Moet mijn partner naar België komen voor het huwelijk?",
                  link: "/contact",
                  cta: "Meer informatie",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></>,
                },
                {
                  title: "Visumaanvraag",
                  desc: "Welk visum is er nodig voor mijn situatie? Vraag ik dit aan in het buitenland of in België? Hoe lang duurt een visumaanvraag? Wat als het visum geweigerd wordt?",
                  link: "/contact",
                  cta: "Meer informatie",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></>,
                },
                {
                  title: "Weigering van een aanvraag",
                  desc: "Uw aanvraag werd geweigerd. Wat nu? Wat zijn de slaagkansen van een beroep? Hoe lang heeft u de tijd om beroep aan te tekenen? Welke procedure volgt u bij de Raad voor Vreemdelingenbetwistingen?",
                  link: "/contact",
                  cta: "Meer informatie",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></>,
                },
                {
                  title: "Weigering erkenning huwelijk",
                  desc: "België erkent niet elk buitenlands huwelijk automatisch. Wat als uw huwelijk geweigerd wordt? Welke gronden worden gebruikt? Hoe tekent u beroep aan en wat zijn uw kansen?",
                  link: "/contact",
                  cta: "Meer informatie",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></>,
                },
                {
                  title: "Weigering wettelijke samenwoning",
                  desc: "Uw aanvraag voor wettelijke samenwoning werd geweigerd of niet erkend? Wat zijn uw rechten? Welke stappen kunt u zetten en binnen welke termijn?",
                  link: "/contact",
                  cta: "Meer informatie",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></>,
                },
                {
                  title: "Iets anders?",
                  desc: "Ziet u uw situatie niet meteen staan maar is het familie of migratie gerelateerd? Neem gerust contact op.",
                  link: "/contact",
                  cta: "Neem contact op",
                  svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></>,
                },
              ].map((d) => (
                <Link key={d.title} to={d.link} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group flex-shrink-0 w-72">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">{d.svg}</svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{d.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{d.desc}</p>
                  <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">{d.cta} →</span>
                </Link>
              ))}
            </div>
          </Scroller>
        </div>
      </section>

      {/* TOOL TEASER */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

            {/* Foto links */}
            <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-md flex-shrink-0" style={{ maxHeight: "480px" }}>
              <img
                src="/trouwen-header.jpg"
                alt="Gezin"
                className="w-full h-full object-cover"
                style={{ maxHeight: "480px" }}
              />
            </div>

            {/* Tool rechts */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Kom ik in aanmerking?</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8 text-justify">Beantwoord een paar vragen en ontdek binnen een aantal minuten of u in aanmerking komt voor gezinshereniging.</p>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1.5 flex-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 rounded-full flex-1 ${i === 1 ? "bg-primary-500" : "bg-gray-200"}`}></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">Stap 1 van 4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Wat is uw nationaliteit of statuut in België?</h3>
                <div className="space-y-2 mb-6">
                  {[
                    { label: "Ik ben Belg", value: "belg" },
                    { label: "Ik ben EU-burger (of EER)", value: "eu" },
                    { label: "Niet-EU nationaliteit met verblijfskaart", value: "niet-eu" },
                    { label: "Erkend vluchteling of subsidiair beschermd", value: "vluchteling" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => navigate("/tool", { state: { nationaliteit: opt.value } })}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:border-primary-400 hover:bg-primary-50 hover:text-primary-800 transition-all text-left"
                    >
                      <div className="w-3.5 h-3.5 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => navigate("/tool")} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                  Kom ik in aanmerking?
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOE WERKT HET */}
      <section className="py-14 bg-primary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Wat wij voor u doen</h2>
            <p className="text-gray-500 text-base">Van eerste vraag tot ingediend dossier</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Algemeen gesprek", desc: "In een videocall van 30 minuten bespreken wij uw situatie en geven wij u een eerlijk beeld van uw mogelijkheden." },
              { step: "2", title: "Begeleiding van A tot Z", desc: "Wij adviseren u stap voor stap doorheen de volledige procedure, van aanvraag tot beslissing." },
              { step: "3", title: "Documentencheck", desc: "Wij controleren uw dossier grondig en geven concrete tips over welke stukken u toevoegt en welke niet." },
              { step: "4", title: "Behoefteanalyse en beroep", desc: "Te weinig inkomen? Wij stellen een behoefteanalyse op. Werd u geweigerd? Wij tekenen hoger beroep aan." },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed text-justify">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/tarieven" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors inline-block">
              Bekijk onze tarieven
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-primary-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Veelgestelde vragen</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
          <div className="text-center mt-6">
            <Link to="/informatie#faq" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">
              Alle vragen bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Wenst u een persoonlijk advies?
          </h2>
          <p className="text-green-100 text-base mb-8 leading-relaxed">
            Neem contact op met een vraag of boek direct uw intakegesprek van 30 minuten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-700 hover:bg-gray-50 font-bold px-8 py-3.5 rounded-xl transition-colors">
              Neem contact op
            </Link>
            <a href="https://calendly.com/mijngezinshereniging" target="_blank" rel="noopener noreferrer" className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Intakegesprek inboeken
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


