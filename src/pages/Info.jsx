import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "voorwaarden", label: "Voorwaarden" },
  { id: "procedure", label: "Procedure" },
  { id: "inkomenseis", label: "Inkomenseis" },
  { id: "faq", label: "Veelgestelde vragen" },
];

const faqs = [
  {
    q: "Hoelang duurt een procedure voor gezinshereniging?",
    a: "Dat hangt af van uw situatie. Bij een aanvraag in België beslist DVZ binnen 6 maanden, zowel voor familie van een Belg als van een EU-burger. Bij een visum vanuit het buitenland is dat 6 maanden voor familie van een Belg en 9 maanden (maximaal 15 maanden) voor familie van een derdelander. Een volledig en correct ingediend dossier helpt vertraging te vermijden.",
  },
  {
    q: "Moet ik getrouwd zijn om gezinshereniging als partner aan te vragen?",
    a: "U moet gehuwd zijn of een geregistreerd partnerschap hebben, zoals een wettelijke samenwoning. Als geregistreerde partner moet u ook bewijzen dat uw relatie duurzaam is: bijvoorbeeld 1 jaar samenwonen, of elkaar 2 jaar kennen met minstens 3 ontmoetingen van samen 45 dagen, of een gemeenschappelijk kind. Een feitelijke samenwoning zonder registratie geeft geen recht op gezinshereniging als partner.",
  },
  {
    q: "Welk inkomen heb ik nodig?",
    a: "Voor familie van een Belg is het referentiebedrag vandaag €2.217,47 netto per maand (sinds 1 september 2026). Voor aanvragen vanaf 18 augustus 2027 wordt dat 110% van het GGMMI: vandaag €2.456,97, verhoogd met 10% per gezinslid ten laste. Voor familie van een derdelander die zijn verblijfsrecht kreeg op of na 18 augustus 2025 geldt dat hogere bedrag nu al. Niet elk inkomen telt mee: leefloon, OCMW-steun en kindergeld tellen bijvoorbeeld niet. Het stabiele inkomen van uw partner kan wel meetellen.",
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
    a: "In principe wel, als u het ouderlijk gezag heeft. Deelt u het gezag met de andere ouder, dan is diens schriftelijke toestemming nodig. Komt enkel uw minderjarig kind over (of samen met andere minderjarige kinderen), dan geldt er voor kinderen van een Belg geen inkomenseis. Komt tegelijk uw partner of een meerderjarig kind mee, dan geldt die wel.",
  },
  {
    q: "Kan ik mijn meerderjarig kind laten overkomen?",
    a: "Dat is mogelijk als uw kind in het herkomstland 'ten laste' is: financieel afhankelijk van uw steun om rond te komen. Voor kinderen van een Belg geldt dat vanaf 18 jaar, en ook de inkomenseis geldt dan. Bent u EU-burger, dan hoeft een kind jonger dan 21 niet ten laste te zijn.",
  },
  {
    q: "Kan ik een ouder, broer of zus laten overkomen?",
    a: "Voor ouders, broers of zussen van een meerderjarige Belg die altijd in België woonde, bestaat er geen recht op gezinshereniging. Uitzondering: de vader of moeder van een minderjarig Belgisch kind kan wel verblijf aanvragen. Bent u EU-burger en werkt u in België, dan kan een ouder die ten laste is wel in aanmerking komen. In andere gevallen blijft soms een humanitair visum mogelijk.",
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
    a: "Wettelijke samenwoning is een officieel geregistreerde samenlevingsvorm die u via de gemeente afsluit. Dit kan recht geven op gezinshereniging als partner, maar anders dan bij een huwelijk moet u dan ook bewijzen dat uw relatie duurzaam en stabiel is. Feitelijke samenwoning, zonder officiële registratie, geeft dat recht niet.",
  },
  {
    q: "Wat is een schijnhuwelijk en hoe wordt dit onderzocht?",
    a: "Een schijnhuwelijk is een huwelijk waarbij het minstens één van beide partners niet om een echt samenleven te doen is, maar enkel om een verblijfsvoordeel te verkrijgen. DVZ en het parket kunnen een onderzoek instellen. Daarbij kunnen u en uw partner apart worden bevraagd over uw relatie, uw dagelijks leven en uw toekomstplannen. Een schijnhuwelijk kan leiden tot weigering van de aanvraag en kan ook strafrechtelijke gevolgen hebben.",
  },
  {
    q: "Kan ik als zelfstandige gezinshereniging aanvragen?",
    a: "Ja, maar de bewijslast is zwaarder dan voor werknemers. DVZ vraagt specifieke documenten, zowel fiscaal (zoals uw aanslagbiljet) als over uw sociale bijdragen. Loonfiches die u als zaakvoerder aan uzelf uitreikt, volstaan op zich niet. Een stabiel en voldoende inkomen over een langere periode weegt sterk mee.",
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
    a: <>Een videocall van 30 minuten kost €75 excl. btw. Daarin spreken we ook een vaste prijs af voor uw volledige dossier. Bekijk het volledige overzicht op de pagina <Link to="/tarieven" className="text-primary-600 underline hover:text-primary-700">Tarieven</Link>.</>,
  },
  {
    q: "Kan een advocaat een visum of gezinsherenigingsaanvraag voor mij indienen?",
    a: "Nee. Een advocaat kan uw aanvraag niet namens u indienen. De aanvraag moet u zelf indienen: bij de Belgische ambassade in het land van uw gezinslid, bij de gemeente of stad waar u bent ingeschreven, of bij de Dienst Vreemdelingenzaken. Wat een advocaat wél voor u doet: uw dossier volledig voorbereiden, uw documenten grondig nalezen en u begeleiden zodat uw aanvraag zo sterk mogelijk staat op het moment dat u deze indient.",
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
        <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{q}</span>
        <svg className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100 text-justify">{a}</div>
      )}
    </div>
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
      <div className="mg-pagehead text-white">
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
                Welke regels gelden, hangt af van wie de persoon in België is. De belangrijkste artikels:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="font-bold text-blue-900 mb-1">Artikel 40ter Verblijfswet</div>
                  <div className="text-blue-700 text-sm">Voor Belgen die familieleden naar België halen. Voor EU-burgers geldt artikel 40bis.</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="font-bold text-emerald-900 mb-1">Artikel 10 Verblijfswet</div>
                  <div className="text-emerald-700 text-sm">Voor derdelanders (geen Belg of EU-burger) met verblijfsrecht in België.</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Partner van een Belg</h3>
              <div className="space-y-2">
                {[
                  { ok: true, text: "Gehuwd, of geregistreerd partner met bewijs van een duurzame relatie" },
                  { ok: true, text: "Gehuwd: beiden ouder dan 18 jaar. Geregistreerd partner: ouder dan 21 jaar, of 18 jaar na 1 jaar samenwonen" },
                  { ok: null, text: "Stabiel, regelmatig en voldoende inkomen (referentiebedrag €2.217,47 netto per maand sinds 1 september 2026)", warn: true },
                  { ok: null, text: "Voldoende huisvesting", warn: true },
                  { ok: null, text: "Ziekteverzekering voor u beiden", warn: true },
                  { ok: null, text: "Retributie van €218", warn: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.warn ? "bg-yellow-50" : "bg-green-50"}`}>
                    <span className={`mg-bullet ${item.warn ? "" : "mg-bullet-ok"}`} aria-hidden="true"></span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Kinderen</h3>
              <div className="space-y-2">
                {[
                  { icon: "✅", text: "Minderjarige kinderen: geen inkomenseis als enkel kinderen overkomen, geen retributie" },
                  { icon: "✅", text: "Kinderen van 18 jaar of ouder: mogelijk als ze in het herkomstland ten laste zijn van u (bij een EU-burger vanaf 21 jaar)" },
                  { icon: "⚠️", text: "U heeft het ouderlijk gezag nodig. Bij gedeeld gezag: schriftelijke toestemming van de andere ouder" },
                  { icon: "⚠️", text: "Bewijs van huisvesting en ziekteverzekering" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.icon === "✅" ? "bg-green-50" : "bg-yellow-50"}`}>
                    <span className={`mg-bullet ${item.icon === "✅" ? "mg-bullet-ok" : ""}`} aria-hidden="true"></span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. (Groot)ouders</h3>
              <div className="space-y-2">
                {[
                  { icon: "❌", text: "Meerderjarige Belg: geen recht op gezinshereniging met (groot)ouders" },
                  { icon: "✅", text: "Vader of moeder van een minderjarig Belgisch kind: wel mogelijk" },
                  { icon: "⚠️", text: "EU-burger die werkt in België: (groot)ouder die ten laste is, kan in aanmerking komen" },
                  { icon: "⚠️", text: "In andere gevallen soms een humanitair visum, zonder automatisch recht" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.icon === "❌" ? "bg-red-50" : item.icon === "✅" ? "bg-green-50" : "bg-yellow-50"}`}>
                    <span className={`mg-bullet ${item.icon === "✅" ? "mg-bullet-ok" : ""}`} aria-hidden="true"></span>
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
                      "Bewijs van de familieband (huwelijksakte, partnerschapsakte of geboorteakte), gelegaliseerd en vertaald waar nodig",
                      "Bewijs van inkomen, bij voorkeur van de laatste 12 maanden",
                      "Meest recent aanslagbiljet",
                      "Bewijs van huisvesting (bij een derdelander: geregistreerd huurcontract of notariële eigendomsakte)",
                      "Bewijs van ziekteverzekering",
                      "Bij een visum met een derdelander: medisch attest en uittreksel strafregister (max. 6 maanden oud)",
                    ],
                  },
                  {
                    step: "2",
                    title: "Indiening van de aanvraag",
                    color: "bg-primary-500",
                    items: [
                      "Gezinslid in het buitenland: visumaanvraag bij de Belgische ambassade of het visumcentrum",
                      "Gezinslid al in België: aanvraag bij de gemeente (familie van een Belg of EU-burger: bijlage 19ter)",
                      "Bewijs van betaling van de retributie (€218), tenzij vrijgesteld",
                      "De datum van de aanvraag doet de beslissingstermijn lopen",
                    ],
                  },
                  {
                    step: "3",
                    title: "Beoordeling door DVZ",
                    color: "bg-yellow-500",
                    items: [
                      "DVZ controleert alle ingediende documenten",
                      "Mogelijk bijkomende onderzoeken of verzoeken om aanvullende info",
                      "DVZ kan een interview afnemen bij u of het gezinslid",
                      "Termijn: 6 maanden (familie van Belg of EU-burger), 9 tot max. 15 maanden (visum met derdelander)",
                    ],
                  },
                  {
                    step: "4",
                    title: "Uitkomst en beslissing",
                    color: "bg-green-500",
                    items: [
                      "Goedkeuring vanuit het buitenland: gezinslid krijgt een visum en reist naar België",
                      "Na aankomst: binnen 8 werkdagen aanmelden bij de gemeente, daarna volgt een woonstcontrole",
                      "Verblijfskaart wordt uitgereikt na een positieve woonstcontrole",
                      "Weigering: in de meeste gevallen 30 dagen om beroep in te dienen bij de RvV",
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
                    "Inkomsten als zelfstandige (met fiscale en sociale documenten)",
                    "Werkloosheidsuitkering (mits actief werkzoekend)",
                    "Pensioenuitkering (ouderdomspensioen of vervroegd)",
                    "Stabiel inkomen van uw partner (Grondwettelijk Hof, april 2026)",
                    "Netto huurinkomsten en maaltijdcheques",
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
                    "Leefloon en maatschappelijke dienstverlening (OCMW)",
                    "Gezinsbijslag (kindergeld)",
                    "Wachtuitkering en overbruggingsuitkering",
                    "Werkloosheidsuitkering zonder bewijs van actief zoeken naar werk",
                    "Onregelmatige, wisselende inkomsten",
                    "Interim, tijdelijke contracten of artikel 60 (vaak geweigerd)",
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
              <h3 className="font-bold text-yellow-900 mb-1">Inkomensgrens: welk bedrag geldt voor u?</h3>
              <p className="text-yellow-800 text-sm mb-4 leading-relaxed">
                Welk referentiebedrag geldt, hangt af van wie de persoon in België is en van de datum van de aanvraag of van het verblijfsrecht. Het nieuwe bedrag is gebaseerd op het <strong>gewaarborgd gemiddeld minimummaandinkomen (GGMMI)</strong>.
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
                      ["Familie van een Belg, aanvraag vóór 18 augustus 2027 (120% leefloon)", "€2.217,47"],
                      ["Familie van een derdelander met verblijfsrecht vóór 18 augustus 2025 (120% leefloon)", "€2.217,47"],
                      ["Familie van een derdelander met verblijfsrecht vanaf 18 augustus 2025 (110% GGMMI, 1 gezinslid)", "€2.456,97"],
                      ["Familie van een Belg, aanvraag vanaf 18 augustus 2027 (110% GGMMI, 1 gezinslid)", "€2.456,97*"],
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
                <strong className="text-gray-800">Let op:</strong> bij het GGMMI-bedrag komt er 10% bij per gezinslid ten laste. Hoe groter het gezin, hoe hoger het bedrag. Zit u onder het bedrag, dan mag DVZ niet automatisch weigeren.
              </div>
              <p className="text-xs text-yellow-700 mt-3">
                Leefloonbedrag sinds 1 september 2026, GGMMI-bedrag sinds 1 juli 2026. * Het bedrag in 2027 kan nog geïndexeerd worden. Bron: Agentschap Integratie en Inburgering.
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
          <div id="faq" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Veelgestelde vragen</h2>
              <p className="text-gray-500 text-base text-justify">De meest gestelde vragen over gezinshereniging in België, helder beantwoord.</p>
            </div>
            <div className="space-y-3">
              {faqs.map(faq => (
                <FaqItem key={faq.q} {...faq} />
              ))}
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
              <p className="text-primary-800 font-medium mb-4">Staat uw vraag er niet tussen?</p>
              <Link to="/contact" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
                Stel uw vraag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

