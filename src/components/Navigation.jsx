import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const LINKS = [
  { to: "/tool", label: "Situatiecheck" },
  { to: "/informatie", label: "Informatie" },
  { to: "/over-ons", label: "Over ons" },
  { to: "/tarieven", label: "Tarieven" },
];

const INFO = [
  { to: "/informatie#voorwaarden", label: "Voorwaarden" },
  { to: "/informatie#procedure", label: "Procedure" },
  { to: "/informatie#inkomenseis", label: "Inkomenseis" },
  { to: "/informatie#faq", label: "Veelgestelde vragen" },
  { to: "/blog", label: "Blog" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setInfoOpen(false); }, [pathname]);

  const isActive = (path) => pathname === path;

  return (
    <nav className={`mg-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" translate="no" className="mg-wordmark notranslate" aria-label="MijnGezinshereniging.be, naar de startpagina">
            mijn<em>gezinshereniging</em>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) =>
              l.to === "/informatie" ? (
                <div key={l.to} className="relative" onMouseLeave={() => setInfoOpen(false)}>
                  <button
                    type="button"
                    onMouseEnter={() => setInfoOpen(true)}
                    onClick={() => setInfoOpen(!infoOpen)}
                    aria-expanded={infoOpen}
                    className={`mg-navlink flex items-center gap-1.5 ${isActive("/informatie") ? "is-current" : ""}`}
                  >
                    Informatie
                    <svg className={`w-3 h-3 transition-transform duration-300 ${infoOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`mg-dropdown ${infoOpen ? "is-open" : ""}`}>
                    {INFO.map((i) => (
                      <Link key={i.to} to={i.to} className="mg-dropdown-link" onClick={() => setInfoOpen(false)}>{i.label}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={l.to} to={l.to} className={`mg-navlink ${isActive(l.to) ? "is-current" : ""}`}>{l.label}</Link>
              )
            )}
            <LanguageSwitcher />
            <Link to="/contact" className="mg-btn mg-btn-rust mg-btn-sm">Contact</Link>
          </div>

          <button
            type="button"
            className="md:hidden mg-iconbtn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>

        <div className={`md:hidden mg-mobilemenu ${menuOpen ? "is-open" : ""}`}>
          <div className="flex flex-col py-4">
            {[{ to: "/", label: "Home" }, ...LINKS, { to: "/blog", label: "Blog" }].map((l) => (
              <Link key={l.to} to={l.to} className={`mg-mobilelink ${isActive(l.to) ? "is-current" : ""}`}>{l.label}</Link>
            ))}
            <div className="flex items-center justify-between gap-4 pt-5">
              <LanguageSwitcher />
              <Link to="/contact" className="mg-btn mg-btn-rust mg-btn-sm">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
