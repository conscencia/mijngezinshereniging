import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-1 h-6 rounded-full bg-primary-500 flex-shrink-0" />
            <span className="font-black tracking-tight text-xl text-gray-900 leading-none">
              mijn<span className="text-primary-600">gezins</span>hereniging
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive("/") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
            >
              Home
            </Link>
            <Link
              to="/tool"
              className={`text-sm font-medium transition-colors ${isActive("/tool") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
            >
              Situatiecheck
            </Link>

            {/* Dropdown Informatie */}
            <div className="relative" onMouseLeave={() => setInfoOpen(false)}>
              <button
                onMouseEnter={() => setInfoOpen(true)}
                onClick={() => setInfoOpen(!infoOpen)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive("/informatie") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
              >
                Informatie
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {infoOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                  <Link to="/informatie#voorwaarden" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600" onClick={() => setInfoOpen(false)}>Voorwaarden</Link>
                  <Link to="/informatie#procedure" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600" onClick={() => setInfoOpen(false)}>Procedure</Link>
                  <Link to="/informatie#inkomenseis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600" onClick={() => setInfoOpen(false)}>Inkomenseis</Link>
                  <Link to="/informatie#faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600" onClick={() => setInfoOpen(false)}>FAQ</Link>
                  <Link to="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600" onClick={() => setInfoOpen(false)}>Blog</Link>
                </div>
              )}
            </div>

            <Link
              to="/over-ons"
              className={`text-sm font-medium transition-colors ${isActive("/over-ons") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
            >
              Over ons
            </Link>
            <Link
              to="/tarieven"
              className={`text-sm font-medium transition-colors ${isActive("/tarieven") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
            >
              Tarieven
            </Link>
            <Link
              to="/contact"
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu openen"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <Link to="/" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/tool" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setMenuOpen(false)}>Situatiecheck</Link>
            <Link to="/informatie" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setMenuOpen(false)}>Informatie</Link>
            <Link to="/blog" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/over-ons" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setMenuOpen(false)}>Over ons</Link>
            <Link to="/tarieven" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600" onClick={() => setMenuOpen(false)}>Tarieven</Link>
            <div className="pt-2">
              <Link
                to="/contact"
                className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}


