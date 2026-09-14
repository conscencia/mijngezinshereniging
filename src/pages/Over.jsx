import { Link } from "react-router-dom";

const values = [
  {
    title: "Juridische kennis",
    desc: "Advocaat met diepgaande kennis van en ervaring in familie- en migratierecht.",
    svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
  },
  {
    title: "Menselijk",
    desc: "Achter elk dossier zit een gezin dat wacht. U krijgt persoonlijke aandacht, geen standaardmails.",
    svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  },
  {
    title: "Transparant",
    desc: "U weet altijd wat u betaalt. Offerte op voorhand, geen verrassingen achteraf.",
    svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    title: "Juridisch sterk",
    desc: "Wij volgen elke wetswijziging op de voet zodat uw dossier altijd op de meest actuele wetgeving steunt.",
    svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
  },
  {
    title: "100% vertrouwelijk",
    desc: "Alles valt onder het beroepsgeheim van de advocaat. Uw gegevens worden nooit gedeeld zonder uw toestemming.",
    svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  },
  {
    title: "Online én op kantoor",
    desc: "Online bereikbaar voor heel België. Een consultatie op kantoor is steeds mogelijk in Oost- en West-Vlaanderen.",
    svg: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
  },
];

export default function Over() {
  return (
    <div>
      {/* HEADER */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-300 rounded-full" />
            Advocaat met ervaring in familie- en migratierecht
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Over<br />
            <span className="text-green-300">MijnGezinshereniging.be</span>
          </h1>
          <p className="text-green-100 text-lg leading-relaxed max-w-2xl text-justify">
            MijnGezinshereniging.be brengt gespecialiseerd juridisch advies over gezinshereniging toegankelijk naar iedereen die het nodig heeft, zonder drempel, zonder onnodige complexiteit.
          </p>
        </div>
      </section>

      {/* VERHAAL */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <div className="rounded-2xl overflow-hidden shadow-lg h-[540px]">
              <video autoPlay muted playsInline onTimeUpdate={(e) => { if (e.target.currentTime >= 10) e.target.pause(); }} className="w-full h-full object-cover">
                <source src="/over.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Waarom dit platform?</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Juridische hulp die écht begrijpelijk is</h2>
              <div className="w-12 h-1 rounded-full bg-primary-500 mb-6" />
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed text-justify">
                <p>
                  Misschien woont uw partner nog in het buitenland. Of ziet u uw kinderen of ouders alleen via een scherm. Wij weten hoe zwaar dat wachten is, soms maanden, soms jaren.
                </p>
                <p>
                  De regels voor gezinshereniging in België zijn streng en niet altijd duidelijk. Een document dat ontbreekt, een fout formulier of een inkomen dat net te laag lijkt: vaak is dat genoeg voor een weigering. Veel mensen geven dan op. Niet omdat hun situatie hopeloos is, maar omdat niemand hen de regels goed heeft uitgelegd.
                </p>
                <p>
                  Daarom is er MijnGezinshereniging.be. Wij leggen u in eenvoudige woorden uit wat u nodig heeft en wat u moet doen, stap voor stap. U weet vooraf wat het kost en wat u kunt verwachten. Zo staat uw aanvraag zo sterk mogelijk.
                </p>
                <p>
                  Waar u ook woont in België: een gesprek kan online. Liever iemand in levenden lijve spreken? Dat kan op kantoor in Oost- en West-Vlaanderen.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-primary-600 to-primary-400 hover:-translate-y-0.5 transition text-white text-sm font-semibold py-3 px-7 rounded-full"
              >
                Plan een gesprek
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <path d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z" fill="#fff" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WAARDEN */}
      <section className="py-20 bg-primary-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">Waar wij voor staan</h2>
          <p className="text-sm text-gray-500 text-center mt-2 max-w-md mx-auto">
            Wat u van ons mag verwachten, van het eerste contact tot de eindbeslissing.
          </p>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 pt-14">
            <div className="absolute w-[520px] h-[520px] -top-40 left-1/2 -translate-x-1/2 rounded-full blur-[280px] bg-primary-200/50 pointer-events-none" />
            {values.map((v) => (
              <div key={v.title} className="relative">
                <div className="w-10 h-10 p-2 bg-white border border-primary-200 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">{v.svg}</svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed text-justify">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Heeft u vragen over uw situatie?</h2>
          <p className="text-green-100 text-base mb-8">
            Een eerste gesprek helpt u klaarheid te krijgen. Wij luisteren, geven een eerlijk beeld en zetten de mogelijke stappen uiteen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-700 hover:bg-gray-50 font-bold px-8 py-3.5 rounded-xl transition-colors">
              Plan een gesprek
            </Link>
            <Link to="/tool" className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Kom ik in aanmerking?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
