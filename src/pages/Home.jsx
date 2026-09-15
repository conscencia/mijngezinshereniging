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
    <div className="mg-faq">
      <button type="button" className="mg-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className={`mg-faq-plus ${open ? "is-open" : ""}`} aria-hidden="true">+</span>
      </button>
      <div className={`mg-faq-a ${open ? "is-open" : ""}`}><div><p>{a}</p></div></div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO */}
      <section className="relative text-white overflow-hidden flex items-center mg-hero">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover mg-hero-video">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 mg-hero-shade" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <p className="mg-eyebrow mg-eyebrow-light">Gezinshereniging in België</p>
            <h1 className="mg-display text-white">
              Samen zijn met <em>uw dierbaren</em>
            </h1>
            <p className="mg-lead text-primary-50 mt-6 max-w-xl">
              Uw partner, kinderen of ouders naar België laten overkomen. Wij leggen u uit wat er nodig is en begeleiden u stap voor stap.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link to="/tool" className="mg-btn mg-btn-rust">Doe de situatiecheck</Link>
              <Link to="/contact" className="mg-btn mg-btn-ghost">Stel uw vraag</Link>
            </div>
            <p className="text-sm text-primary-100/80 mt-6">Binnen twee minuten een eerste antwoord.</p>
          </div>
        </div>
      </section>

      {/* DIENSTEN */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <p className="mg-eyebrow">Onze hulp</p>
            <h2 className="mg-h2">Waarmee kunnen wij u <em>helpen</em>?</h2>
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
              ].map((d, i) => (
                <Link key={d.title} to={d.link} className="mg-card flex-shrink-0 w-72">
                  <span className="mg-card-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mg-card-title">{d.title}</h3>
                  <span className="mg-card-line" />
                  <p className="mg-card-text">{d.desc}</p>
                  <span className="mg-card-more">{d.cta} <span aria-hidden="true">&rarr;</span></span>
                </Link>
              ))}
            </div>
          </Scroller>
        </div>
      </section>

      {/* TOOL TEASER */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* Foto links */}
            <div className="w-full lg:w-1/2 mg-photo flex-shrink-0" style={{ maxHeight: "480px" }}>
              <img
                src="/gezin.jpg"
                alt="Gezin"
                className="w-full h-full object-cover"
                style={{ maxHeight: "480px" }}
              />
            </div>

            {/* Tool rechts */}
            <div className="w-full lg:w-1/2">
              <p className="mg-eyebrow">Situatiecheck</p>
              <h2 className="mg-h2">Komt u in aanmerking voor <em>gezinshereniging</em>?</h2>
              <p className="mg-body mt-5 mb-9 text-justify">
                Doe hier de check of u in aanmerking komt voor gezinshereniging. Binnen enkele minuten een eerste beeld van uw situatie.
              </p>
              <button type="button" onClick={() => navigate("/tool")} className="mg-btn mg-btn-olive">
                Doe de check <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOE WERKT HET */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <p className="mg-eyebrow">Van eerste vraag tot ingediend dossier</p>
            <h2 className="mg-h2">Wat wij voor u <em>doen</em></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {[
              {
                title: "Algemeen gesprek",
                desc: "In een videocall van 30 minuten bespreken wij uw situatie en geven wij u een eerlijk beeld van uw mogelijkheden en slaagkansen.",
              },
              {
                title: "Begeleiding van A tot Z",
                desc: "Beslist u een aanvraag in te dienen? Dan adviseren wij u doorheen de volledige procedure, van voorbereiding tot beslissing.",
              },
              {
                title: "Documentencheck",
                desc: "Wij controleren uw dossier grondig en geven concrete tips over welke stukken u toevoegt en welke niet.",
              },
              {
                title: "Behoefteanalyse en beroep",
                desc: "Te weinig inkomen? Wij stellen een behoefteanalyse op. Werd u geweigerd? Wij tekenen hoger beroep aan.",
              },
            ].map((s, i) => (
              <div key={s.title} className="mg-step">
                <span className="mg-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mg-step-title">{s.title}</h3>
                <p className="mg-body">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link to="/tarieven" className="mg-btn mg-btn-olive">Bekijk onze tarieven</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="mb-10">
            <p className="mg-eyebrow">Goed om te weten</p>
            <h2 className="mg-h2">Veelgestelde <em>vragen</em></h2>
          </div>
          <div>
            {faqs.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
          <div className="mt-8">
            <Link to="/informatie#faq" className="mg-textlink">Alle vragen bekijken <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 mg-cta">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <p className="mg-eyebrow mg-eyebrow-light">Persoonlijk advies</p>
            <h2 className="mg-h2 text-white">Klaar om uw situatie te <em>bespreken</em>?</h2>
            <p className="mg-lead text-primary-100 mt-5">Stel eerst uw vraag, of plan meteen een gesprek van 30 minuten.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/afspraak" className="mg-btn mg-btn-rust">Maak een afspraak</Link>
            <Link to="/contact" className="mg-btn mg-btn-ghost">Stel uw vraag</Link>
          </div>
        </div>
      </section>
    </div>
  );
}


