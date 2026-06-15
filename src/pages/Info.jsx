import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

const tabs = [
  { id: "voorwaarden", label: "Voorwaarden" },
  { id: "procedure", label: "Procedure" },
  { id: "inkomenseis", label: "Inkomenseis" },
  { id: "faq", label: "Veelgestelde vragen" },
];

const faqs = [
  {
    q: "Hoelang duurt een procedure voor gezinshereniging?",
    a: "Gemiddeld 4 tot 6 maanden. De Dienst Vreemdelingenzaken heeft wettelijk 6 maanden de tijd (voor Belgen) of 5 maanden (voor EU-burgers) om te beslissen. Reageert DVZ niet op tijd, dan kunt u juridische stappen zetten. Een volledig en correct ingediend dossier helpt de doorlooptijd te beperken.",
  },
  {
    q: "Moet ik getrouwd zijn om gezinshereniging als partner aan te vragen?",
    a: "U moet officieel gehuwd of wettelijk samenwonend zijn. Een feitelijke samenwoning of langdurige relatie zonder officiële erkenning geeft geen recht op gezinshereniging als partner. Wilt u trouwen met een partner van buiten de EU? Dan is er een aparte huwelijksprocedure voorzien.",
  },
  {
    q: "Welk inkomen heb ik nodig?",
    a: "Tot 18 augustus 2027 heeft u minstens €2.173,88 netto per maand nodig. Vanaf 18 augustus 2027 stijgt dit naar €2.408,79, met een toeslag van 10% per extra gezinslid dat overkomt. Niet elk inkomen telt mee. Leefloon, OCMW-bijstand en kindergeld tellen bijvoorbeeld niet.",
  },
  {
    q: "Wat als mijn inkomen net niet volstaat?",
    a: "DVZ mag uw aanvraag niet automatisch weigeren als u onder het minimum zit. U kunt een behoefteanalyse indienen: een gedetailleerd overzicht van uw inkomsten en uitgaven waaruit blijkt dat uw gezin niet ten laste zal vallen van de overheid. De manier waarop u dit opbouwt, kan het verschil maken.",
  },
  {
    q: "Welke documenten heb ik nodig?",
    a: "Dat hangt af van wie u naar België haalt en via welke procedure. Bij een hereniging met een partner zijn andere documenten nodig dan bij een hereniging met kinderen. Wat wel altijd terugkomt: uw identiteitsbewijs, het paspoort van uw gezinslid en een bewijs van de familieband. Afhankelijk van uw situatie komen daar documenten bij over uw inkomen, uw woning en de burgerlijke staat. Een advocaat bekijkt welke documenten specifiek voor uw dossier vereist zijn.",
  },
  {
    q: "Wat is het verschil tussen een statische en een mobiele Belg?",
    a: "Een statische Belg is iemand die altijd in België heeft gewoond en nooit gebruik heeft gemaakt van het Europese recht op vrij verkeer. Op die situatie is het Belgische recht van toepassing, wat doorgaans strenger is. Een mobiele Belg is iemand die samen met zijn of haar gezinslid in een andere EU-lidstaat heeft gewoond en daarna samen naar België is teruggekeerd. In dat geval is het Europese recht van toepassing, wat gunstiger kan zijn. Welke Europese regels precies gelden, hangt af van de hoedanigheid die de Belg had in het andere EU-land: was hij of zij daar economisch actief als werknemer of zelfstandige, of verbleef hij of zij er als student of EU-beschikker? Dit onderscheid heeft concrete gevolgen voor de voorwaarden waaraan uw gezinslid moet voldoen. Of u als mobiele Belg wordt beschouwd, is niet altijd vanzelfsprekend en vraagt een concrete beoordeling van uw situatie.",
  },
  {
    q: "Mijn aanvraag werd geweigerd. Wat nu?",
    a: "U heeft 30 dagen om beroep aan te tekenen bij de Raad voor Vreemdelingenbetwistingen. Miss deze termijn niet, want daarna zijn uw mogelijkheden zeer beperkt. U kunt ook vragen dat uw gezinslid niet onmiddellijk het land moet verlaten terwijl de zaak nog loopt.",
  },
  {
    q: "Kan ik mijn minderjarige kinderen laten overkomen?",
    a: "In principe wel. Voor minderjarige kinderen (jonger dan 18) geldt de inkomenseis in principe niet, als u het ouderlijk gezag heeft. Let op: als er tegelijk ook andere gezinsleden overkomen voor wie de inkomenseis wel geldt, kan de situatie anders liggen.",
  },
  {
    q: "Kan ik mijn meerderjarig kind laten overkomen?",
    a: "Dat is mogelijk als uw kind aantoonbaar financieel afhankelijk is van u en in het herkomstland niet zelfstandig kan voorzien in zijn of haar levensonderhoud. De voorwaarden zijn strenger dan voor minderjarige kinderen en de inkomenseis geldt wel.",
  },
  {
    q: "Kan ik een ouder, broer of zus laten overkomen?",
    a: "Voor ouders, broers of zussen bestaat er geen automatisch recht op gezinshereniging als u een Belg bent die altijd in België heeft gewoond. In uitzonderlijke omstandigheden, bij bewezen medische of financiële afhankelijkheid, zijn er soms mogelijkheden. Elke situatie is anders.",
  },
  {
    q: "Wat is een humanitair visum?",
    a: "Een humanitair visum (ook wel visum om humanitaire redenen genoemd) is een verblijfsmachtiging die in uitzonderlijke omstandigheden wordt toegekend wanneer een reguliere procedure niet mogelijk is of te lang duurt. Denk aan ernstige medische situaties of schrijnende humanitaire omstandigheden. Het gaat niet om een standaardprocedure en er is geen automatisch recht op. DVZ beslist geval per geval. Een advocaat kan beoordelen of uw situatie in aanmerking komt.",
  },
  {
    q: "Wat is een D-visum?",
    a: "Een D-visum is een visum voor lang verblijf, langer dan 90 dagen. Wie van buiten België een gezinshereniging aanvraagt, heeft dit visum nodig om naar België te kunnen reizen en de procedure te starten. Het wordt aangevraagd bij de Belgische ambassade of het visumkantoor in het land waar uw gezinslid verblijft. DVZ in België neemt de eindbeslissing.",
  },
  {
    q: "Wanneer moeten buitenlandse documenten gelegaliseerd worden?",
    a: "Buitenlandse officiële documenten, zoals een huwelijksakte of geboorteakte, worden in België niet automatisch aanvaard. Ze moeten gelegaliseerd worden zodat de echtheid van de handtekening en het zegel wordt bevestigd. Voor landen die het Verdrag van Den Haag hebben ondertekend, gebeurt dit via een apostille. Voor andere landen loopt de legalisatie via de Belgische ambassade in het betrokken land. Daarna moet het document ook vertaald worden door een beëdigd vertaler.",
  },
  {
    q: "Wat is de Raad voor Vreemdelingenbetwistingen?",
    a: "De Raad voor Vreemdelingenbetwistingen (RvV) is de administratieve rechtbank die beroepen behandelt tegen beslissingen van DVZ. Als uw aanvraag voor gezinshereniging wordt geweigerd, kunt u binnen 30 dagen beroep instellen bij de RvV. De Raad toetst de beslissing op juridische gronden. Een sterk en goed onderbouwd beroepschrift is daarbij van groot belang.",
  },
  {
    q: "Wat is het verschil tussen wettelijke en feitelijke samenwoning?",
    a: "Wettelijke samenwoning is een officieel geregistreerde samenlevingsvorm die u via de gemeente afsluit. Dit geeft recht op gezinshereniging als partner, net als een huwelijk. Feitelijke samenwoning, waarbij u zonder officiële registratie samenleeft, geeft dat recht niet. Voor DVZ telt enkel de officieel erkende relatievorm.",
  },
  {
    q: "Wat is een schijnhuwelijk en hoe wordt dit onderzocht?",
    a: "Een schijnhuwelijk is een huwelijk waarbij het minstens één van beide partners niet om een echt samenleven te doen is, maar enkel om een verblijfsvoordeel te verkrijgen. DVZ en het parket kunnen een onderzoek instellen. Daarbij kunnen u en uw partner apart worden bevraagd over uw relatie, uw dagelijks leven en uw toekomstplannen. Een schijnhuwelijk kan leiden tot weigering van de aanvraag en kan ook strafrechtelijke gevolgen hebben.",
  },
  {
    q: "Kan ik als zelfstandige gezinshereniging aanvragen?",
    a: "Ja, maar de bewijslast is zwaarder dan voor werknemers. U kunt geen loonfiches voorleggen. DVZ kijkt naar uw belastingaangiften van de afgelopen jaren, uw jaarrekeningen en uw netto-inkomen na aftrek van sociale bijdragen en belastingen. Een stabiel en voldoende inkomen over meerdere jaren weegt sterk mee.",
  },
  {
    q: "Wat als ik de beroepstermijn van 30 dagen heb gemist?",
    a: "Als u de termijn van 30 dagen na de weigeringsbeslissing hebt overschreden, vervalt het recht om die specifieke beslissing nog aan te vechten bij de Raad voor Vreemdelingenbetwistingen. In sommige gevallen kunt u een nieuwe aanvraag indienen bij DVZ, maar dat is geen garantie. Elk verloren dag na een weigering telt, handelen is dus dringend.",
  },
  {
    q: "Wat is de meerwaarde van professionele begeleiding?",
    a: "Gezinshereniging is complex en de informatie die online circuleert is niet altijd correct of van toepassing op uw situatie. Een advocaat kent de valkuilen en helpt u die vermijden. Veelvoorkomende problemen zijn: ontbrekende of verkeerd gelegaliseerde documenten, een onvolledige bewijsvoering van de familieband, een verkeerde berekening van het inkomen, of een dossier dat te mager is om standhouden bij DVZ. Fouten kunnen soms niet meer worden rechtgezet en maken een weigering ook in de toekomst moeilijker te vermijden. Een advocaat bekijkt ook hoe u uw aanvraag kracht bijzet: welke stukken u beter toevoegt, hoe u uw inkomenssituatie het sterkst omschrijft, en welke documenten net beter weggelaten worden. Professionele begeleiding geeft geen garantie op goedkeuring, maar verhoogt de slaagkansen aanzienlijk van bij het begin.",
  },
  {
    q: "Wat kost een intakegesprek?",
    a: <>Een videocall van 30 minuten kost €50 excl. btw. Dat bedrag wordt afgetrokken als u daarna kiest voor verdere begeleiding. Bekijk het volledige overzicht op de pagina <Link to="/tarieven" className="text-primary-600 underline hover:text-primary-700">Tarieven</Link>.</>,
  },
  {
    q: "Kan een advocaat een visum of gezinsherenigingsaanvraag voor mij indienen?",
    a: "Nee. Een advocaat kan uw aanvraag niet namens u indienen. De aanvraag moet u zelf indienen: bij de Belgische ambassade in het land van uw gezinslid, bij de gemeente of stad waar u bent ingeschreven, of bij de Dienst Vreemdelingenzaken. Wat een advocaat wél voor u doet: uw dossier volledig voorbereiden, uw documenten grondig nalezen en u begeleiden zodat uw aanvraag zo sterk mogelijk staat op het moment dat u deze indient.",
  },
];

function FaqAccordion({ items }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={String(i)}
          className="border-b border-gray-200 last:border-b-0"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between py-4 text-left text-sm font-semibold text-gray-900 hover:text-primary-700 transition-colors [&[data-state=open]>svg]:rotate-180">
              <span className="pr-4">{item.q}</span>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="pb-4 pt-1 text-sm text-gray-600 leading-relaxed text-justify">{item.a}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

export default function Info() {
  const [activeTab, setActiveTab] = useState("voorwaarden");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && tabs.find(t => t.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  return (
    <div className="bg-primary-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Alles wat u moet weten over gezinshereniging in België
          </h1>
          <p className="text-green-100 text-base max-w-2xl mx-auto">
            Begrijpelijke uitleg over voorwaarden, procedure en veelgestelde vragen. In mensentaal.
          </p>
        </div>

        {/* Tab Nav */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-1 pb-0 -mb-px">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); window.history.replaceState(null, "", "#" + t.id); }}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                  activeTab === t.id
                    ? "border-white text-white"
                    : "border-transparent text-green-100 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* VOORWAARDEN */}
        {activeTab === "voorwaarden" && (
          <div id="voorwaarden" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Basisvoorwaarden voor gezinshereniging</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Gezinshereniging in België is geregeld via twee hoofdartikelen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="font-bold text-blue-900 mb-1">Artikel 40ter Verblijfswet</div>
                  <div className="text-blue-700 text-sm">Voor Belgen en niet-EU burgers die gezinsleden willen laten overkomen.</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="font-bold text-emerald-900 mb-1">Artikel 10 Verblijfswet</div>
                  <div className="text-emerald-700 text-sm">Voor EU-burgers die hun familieleden naar België halen.</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Partners (Art. 40ter)</h3>
              <div className="space-y-2">
                {[
                  { ok: true, text: "Getrouwde partners of wettelijk samenwonenden" },
                  { ok: true, text: "Beide partijen minstens 21 jaar oud" },
                  { ok: null, text: "Stabiel, regelmatig en voldoende inkomen (~€1.487 netto/mnd in 2026)", warn: true },
                  { ok: null, text: "Toereikende huisvesting voor het hele gezin", warn: true },
                  { ok: null, text: "Ziekteverzekering voor het gezinslid", warn: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.warn ? "bg-yellow-50" : "bg-green-50"}`}>
                    <span className="text-lg flex-shrink-0">{item.warn ? "⚠️" : "✅"}</span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Kinderen</h3>
              <div className="space-y-2">
                {[
                  { icon: "✅", text: "Minderjarigen (0 tot 18 jaar), meest haalbaar" },
                  { icon: "✅", text: "Economisch afhankelijke kinderen (18 tot 25) die studeren" },
                  { icon: "⚠️", text: "U moet kunnen aantonen dat u voor het kind kunt zorgen (financieel en huisvesting)" },
                  { icon: "⚠️", text: "Als de andere ouder gezag heeft, kan dit complicaties geven" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.icon === "✅" ? "bg-green-50" : "bg-yellow-50"}`}>
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. (Groot)ouders</h3>
              <div className="space-y-2">
                {[
                  { icon: "❌", text: "Alleen mogelijk in uitzonderlijke humanitaire omstandigheden" },
                  { icon: "❌", text: "Zeer strenge voorwaarden, zelden toegekend" },
                  { icon: "⚠️", text: "U moet bewijzen dat u de enige persoon bent die voor de ouder kan zorgen" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.icon === "❌" ? "bg-red-50" : "bg-yellow-50"}`}>
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
              <p className="text-primary-800 font-medium mb-4">Niet zeker of u voldoet aan de voorwaarden?</p>
              <Link to="/tool" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
                Kom ik in aanmerking?
              </Link>
            </div>
          </div>
        )}

        {/* PROCEDURE */}
        {activeTab === "procedure" && (
          <div id="procedure" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stappen voor gezinshereniging</h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                Van voorbereiding tot goedkeuring: hier is een overzicht van het volledige traject.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary-200 hidden sm:block"></div>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Voorbereiding (2 tot 3 maanden)",
                    color: "bg-blue-500",
                    items: [
                      "Bewijs van relatie (huwelijksakte / verklaring samenwoning)",
                      "Inkomstbewijzen: loonfiches van de laatste 3 maanden",
                      "Aanslagbiljet / belastingbrief van het laatste jaar",
                      "Huisvestingbewijs: huurcontract of eigendomsakte",
                      "Bewijs van ziekteverzekering voor het gezinslid",
                      "Medische verklaring gezinslid (indien vereist)",
                    ],
                  },
                  {
                    step: "2",
                    title: "Indiening aanvraag bij DVZ",
                    color: "bg-primary-500",
                    items: [
                      "Aanvraag indienen via balie Dienst Vreemdelingenzaken (DVZ) of online portaal",
                      "Betaling retributie (bijdrage verwerking dossier)",
                      "DVZ geeft bevestiging van ontvangst",
                      "Start van de onderzoekstermijn",
                    ],
                  },
                  {
                    step: "3",
                    title: "Beoordeling door DVZ (3 tot 6 maanden)",
                    color: "bg-yellow-500",
                    items: [
                      "DVZ controleert alle ingediende documenten",
                      "Mogelijk bijkomende onderzoeken of verzoeken om aanvullende info",
                      "DVZ kan een interview afnemen bij u of het gezinslid",
                      "Gemiddelde doorlooptijd: 4 tot 6 maanden",
                    ],
                  },
                  {
                    step: "4",
                    title: "Uitkomst en beslissing",
                    color: "bg-green-500",
                    items: [
                      "✅ Goedkeuring → Gezinslid ontvangt visum type D en kan naar België reizen",
                      "❌ Afwijzing → U heeft 30 dagen om beroep aan te tekenen bij RvV",
                      "Bij goedkeuring: gezinslid meldt zich aan bij gemeente",
                      "Verblijfskaart wordt uitgereikt na aankomst",
                    ],
                  },
                ].map((s, i) => (
                  <div key={i} className="sm:pl-16 relative">
                    <div className={`absolute left-0 top-0 w-12 h-12 ${s.color} text-white rounded-full flex items-center justify-center font-bold text-lg hidden sm:flex`}>
                      {s.step}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 sm:hidden`}>
                        <div className={`w-6 h-6 ${s.color} text-white rounded-full flex items-center justify-center text-xs font-bold`}>{s.step}</div>
                        <span className="text-gray-500">Stap {s.step}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">Stap {s.step}: {s.title}</h3>
                      <ul className="space-y-2">
                        {s.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
              <p className="text-primary-800 font-medium mb-4">Laat uw dossier vooraf controleren om fouten te voorkomen</p>
              <Link to="/contact" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
                Dossierbeoordeling Aanvragen
              </Link>
            </div>
          </div>
        )}

        {/* INKOMENSEIS */}
        {activeTab === "inkomenseis" && (
          <div id="inkomenseis" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">De inkomenseis: wat telt wel en niet mee?</h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                De inkomenseis is vaak de grootste drempel bij gezinshereniging. DVZ controleert of uw inkomen
                "stabiel, regelmatig en voldoende" is. Hier is de exacte uitleg.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">✅</span> Wat telt WEL mee
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  {[
                    "Loon uit een vaste arbeidsovereenkomst",
                    "Inkomsten als zelfstandige (via belastingbrief, gemiddeld 3 jaar)",
                    "Werkloosheidsuitkering (mits actief werkzoekend)",
                    "Pensioenuitkering (ouderdomspensioen of vervroegd)",
                    "Alimentatie (indien stabiel en aanwijsbaar)",
                    "Inkomsten uit verhuur (mits stabiel)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">❌</span> Wat telt NIET mee
                </h3>
                <ul className="space-y-2 text-sm text-red-800">
                  {[
                    "Leefloon (OCMW-uitkering / bijstand)",
                    "Kinderopvangtoeslag / kinderbijslag",
                    "Financiële steun van familieleden",
                    "Onregelmatige, wisselende inkomsten",
                    "Inkomen van het gezinslid dat nog niet in België is",
                    "Tijdelijke of interimcontracten (met voorbehoud)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 18L18 6M6 6l12 12" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bedragen */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-bold text-yellow-900 mb-1">💰 Inkomensgrens, vanaf 18 augustus 2027</h3>
              <p className="text-yellow-800 text-sm mb-4 leading-relaxed">
                Vanaf 18 augustus 2027 geldt een nieuw referentiebedrag gebaseerd op het <strong>Gewaarborgd Gemiddeld Minimum Maandinkomen (GGMMI)</strong>.
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="text-left px-4 py-2 text-yellow-900 font-semibold">Situatie</th>
                      <th className="text-right px-4 py-2 text-yellow-900 font-semibold">Netto/maand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-100">
                    {[
                      ["1 gezinslid doet aanvraag (110% GGMMI)", "€2.408,79"],
                      ["+ 1 extra ten laste (+10%)", "€2.649,67"],
                      ["+ 2 extra ten laste (+20%)", "€2.890,55"],
                    ].map(([situatie, bedrag], i) => (
                      <tr key={i} className="bg-white/50">
                        <td className="px-4 py-2.5 text-gray-700">{situatie}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-yellow-900">{bedrag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-800">Voorbeeld:</strong> U woont alleen in België en uw partner + 2 kinderen vragen gezinshereniging aan.
                Het referentiebedrag is 110% (partner) + 20% van 110% (2 kinderen × 10%) van het GGMMI.
              </div>
              <p className="text-xs text-yellow-700 mt-3">
                * Bedragen zijn gebaseerd op het GGMMI en worden periodiek geïndexeerd. Raadpleeg het Agentschap Integratie en Inburgering voor de meest actuele cijfers.
              </p>
            </div>

            {/* Behoefteanalyse */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-xl">📋</span> Inkomen onder de grens? Er is een alternatief: de behoefteanalyse
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed text-justify mb-4">
                Een inkomen onder de inkomensgrens is <strong>geen automatische weigering</strong>. U kunt een <strong>behoefteanalyse</strong> indienen waarbij u aantoont dat uw gezin niet ten laste zal vallen van de overheid.
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Wat is een behoefteanalyse?",
                    text: "U toont via documenten aan dat u ondanks een inkomen onder de grens, uw gezin kunt onderhouden. DVZ bekijkt uw totale financiële situatie.",
                  },
                  {
                    title: "Wat kunt u voorleggen?",
                    text: "Loonfiches, bankuittreksels, én bewijzen van uw vaste uitgaven: huur/hypotheek, verzekeringen, water, gas, elektriciteit, internet, belastingen, supermarkt, mobiliteit, vrije tijd.",
                  },
                  {
                    title: "Toekomstig inkomen telt ook mee",
                    text: "Een simulatie van uw werkgever van uw toekomstige wedde (na aftrek van gezinslasten) kan ook dienen als bewijs. DVZ houdt hier rekening mee.",
                  },
                  {
                    title: "Co-ouderschap",
                    text: "Heeft u kinderen in co-ouderschap? Als zij 50% bij de andere ouder verblijven, houdt DVZ daar rekening mee en worden zij slechts voor de helft als ten laste beschouwd.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4">
                    <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                    <p className="text-gray-600 text-sm leading-relaxed text-justify">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-100 rounded-xl p-3 text-xs text-blue-800 leading-relaxed">
                ⚠️ <strong>Belangrijk:</strong> De bewijslast ligt volledig bij de aanvrager. DVZ is niet meer verplicht om zelf stukken op te vragen. U moet proactief alle bewijzen indienen.
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
              <p className="text-primary-800 font-medium mb-2">Twijfel over uw inkomen of behoefteanalyse?</p>
              <p className="text-primary-700 text-sm mb-4">Een advocate bekijkt uw situatie en zegt u eerlijk wat uw opties zijn.</p>
              <Link to="/contact" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
                Inkomenscheck Aanvragen
              </Link>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <div id="faq" className="grid gap-10 md:grid-cols-5 md:gap-16">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Veelgestelde vragen</h2>
              <p className="text-gray-500 text-sm leading-relaxed text-justify">De meest gestelde vragen over gezinshereniging in België, helder beantwoord.</p>
              <div className="hidden md:block mt-8">
                <p className="text-gray-500 text-sm mb-3">Staat uw vraag er niet bij?</p>
                <Link to="/contact" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                  Neem contact op
                </Link>
              </div>
            </div>
            <div className="md:col-span-3">
              <FaqAccordion items={faqs} />
              <div className="md:hidden mt-8 text-center">
                <p className="text-gray-500 text-sm mb-3">Staat uw vraag er niet bij?</p>
                <Link to="/contact" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                  Neem contact op
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

