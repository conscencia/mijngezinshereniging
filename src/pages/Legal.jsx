import { Link } from "react-router-dom";
import { legal } from "../data/legal";

const PAGES = [
  { key: "privacy", to: "/privacy", label: "Privacyverklaring" },
  { key: "voorwaarden", to: "/algemene-voorwaarden", label: "Algemene voorwaarden" },
  { key: "cookies", to: "/cookies", label: "Cookiebeleid" },
  { key: "witwas", to: "/witwaspreventie", label: "Witwaspreventie" },
];

export default function Legal({ doc }) {
  const d = legal.docs[doc];

  return (
    <div className="bg-white">
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 sm:py-9">
          <p className="mg-eyebrow mg-eyebrow-light mb-2">Laatste update: {legal.updated}</p>
          <h1 className="mg-tool-h1 text-white">{d.title}</h1>
        </div>
      </section>

      <section className="pt-10 pb-20 sm:pt-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <nav className="lg:sticky lg:top-28" aria-label="Juridische informatie">
              <p className="mg-eyebrow">Juridische informatie</p>
              <ul className="mg-legal-nav">
                {PAGES.map((p) => (
                  <li key={p.key}>
                    <Link to={p.to} className={p.key === doc ? "is-current" : ""} aria-current={p.key === doc ? "page" : undefined}>{p.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="lg:col-span-9 order-1 lg:order-2 max-w-3xl mg-legal">
            <p className="mg-lead">{d.intro}</p>
            {d.sections.map(([title, blocks]) => (
              <section key={title}>
                <h2>{title}</h2>
                {blocks.map(([kind, val], i) =>
                  kind === "p" ? <p key={i}>{val}</p>
                    : kind === "h" ? <h3 key={i}>{val}</h3>
                    : <ul key={i}>{val.map((x) => <li key={x}>{x}</li>)}</ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}
