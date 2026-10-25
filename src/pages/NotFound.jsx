import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

const LINKS = [
  { to: "/", label: "Startpagina" },
  { to: "/informatie", label: "Voorwaarden en procedure" },
  { to: "/blog", label: "Alle artikels" },
  { to: "/tool", label: "Gratis situatiecheck" },
  { to: "/contact", label: "Stel uw vraag" },
];

export default function NotFound() {
  useSeo({
    path: "/404",
    title: "Pagina niet gevonden",
    description: "Deze pagina bestaat niet of is verplaatst.",
    robots: "noindex, follow",
  });

  return (
    <div className="bg-primary-50 min-h-screen">
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <p className="mg-eyebrow mg-eyebrow-light">Fout 404</p>
          <h1 className="mg-display text-white max-w-3xl">Deze pagina bestaat <em>niet</em></h1>
          <p className="mg-lead text-primary-100 mt-6 max-w-2xl">
            Het adres is misschien verkeerd getypt, of de pagina is verplaatst. Hieronder vindt u de belangrijkste pagina's.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ul className="mg-points max-w-xl">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="mg-textlink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
