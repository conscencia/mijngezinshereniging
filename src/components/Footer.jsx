import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hoofdrij */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-primary-700">
          <span className="font-bold text-white text-base">MijnGezinshereniging</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/tool" className="hover:text-white transition-colors">Situatiecheck</Link>
            <Link to="/informatie" className="hover:text-white transition-colors">Informatie</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <a href="mailto:advocaat@mijngezinshereniging.be" className="text-sm hover:text-white transition-colors">
            advocaat@mijngezinshereniging.be
          </a>
        </div>

        {/* Onderste balk */}
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-400">
          <p>© {new Date().getFullYear()} MijnGezinshereniging.be. Alle rechten voorbehouden.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/privacy#av" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}


