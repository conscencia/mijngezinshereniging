import { Link } from "react-router-dom";
import { BOOKING_URL } from "../config";


export default function Over() {
  return (
    <div>
      {/* HEADER */}
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <p className="mg-eyebrow mg-eyebrow-light">Over ons</p>
          <h1 className="mg-display text-white max-w-3xl">Juridische hulp die u <em>begrijpt</em></h1>
          <p className="mg-lead text-primary-100 mt-6 max-w-2xl">
            MijnGezinshereniging.be maakt juridisch advies over gezinshereniging toegankelijk, in eenvoudige woorden en zonder drempels.
          </p>
        </div>
      </section>

      {/* VERHAAL */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <div className="mg-photo h-[540px]">
              <video autoPlay muted playsInline onTimeUpdate={(e) => { if (e.target.currentTime >= 10) e.target.pause(); }} className="w-full h-full object-cover">
                <source src="/over.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="pt-2">
              <p className="mg-eyebrow">Waarom dit platform</p>
              <h2 className="mg-h2 mb-6">Niemand zou alleen door deze <em>procedure</em> moeten</h2>
              <div className="space-y-4 mg-body text-justify">
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
                className="mg-btn mg-btn-rust mt-8"
              >
                Plan een gesprek <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 mg-cta">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <p className="mg-eyebrow mg-eyebrow-light">Persoonlijk advies</p>
            <h2 className="mg-h2 text-white">Heeft u vragen over uw <em>situatie</em>?</h2>
            <p className="mg-lead text-primary-100 mt-5">In een eerste gesprek krijgt u een eerlijk beeld van uw mogelijkheden en de volgende stappen.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mg-btn mg-btn-rust">Plan een gesprek</a>
            <Link to="/tool" className="mg-btn mg-btn-ghost">Kom ik in aanmerking?</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
