import { Link } from "react-router-dom";
import { BOOKING_URL } from "../config";

export default function Footer() {
  return (
    <footer className="mg-footer">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <Link to="/" className="mg-wordmark mg-wordmark-light">mijn<em>gezinshereniging</em></Link>
            <p className="mg-footer-text">Heldere uitleg en persoonlijke begeleiding bij gezinshereniging in België.</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mg-footer-h">Informatie</p>
            <Link to="/tool" className="mg-footer-link">Situatiecheck</Link>
            <Link to="/informatie" className="mg-footer-link">Voorwaarden en procedure</Link>
            <Link to="/blog" className="mg-footer-link">Blog</Link>
            <Link to="/tarieven" className="mg-footer-link">Tarieven</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mg-footer-h">Contact</p>
            <Link to="/contact" className="mg-footer-link">Stel uw vraag</Link>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mg-footer-link">Plan een gesprek</a>
            <a href="mailto:advocaat@mijngezinshereniging.be" className="mg-footer-link break-all">advocaat@mijngezinshereniging.be</a>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-primary-300">
          <p>© {new Date().getFullYear()} MijnGezinshereniging.be</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="mg-footer-link">Privacy</Link>
            <Link to="/privacy#av" className="mg-footer-link">Algemene voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
