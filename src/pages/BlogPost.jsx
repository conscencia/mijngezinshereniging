import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { articles } from "../data/articles";

const categoryColors = {
  Tips: "bg-blue-100 text-blue-700",
  Procedure: "bg-green-100 text-green-700",
  Inkomenseis: "bg-yellow-100 text-yellow-700",
  Beroep: "bg-red-100 text-red-700",
  Huwelijk: "bg-rust-500/10 text-rust-600",
  Kosten: "bg-primary-100 text-primary-700",
  Wetgeving: "bg-gray-200 text-gray-800",
};

function parseInline(text) {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function Accordion({ title, blocks }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 space-y-3 border-t border-gray-100 bg-gray-50">
          {blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}
    </div>
  );
}

function renderBlock(block, i) {
  switch (block.type) {
    case "intro":
      return <p key={i} className="text-gray-600 text-base leading-relaxed text-justify">{parseInline(block.text)}</p>;

    case "intro-list":
      return (
        <ul key={i} className="space-y-1 mt-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-600 text-base">
              <span className="text-primary-500 mt-1">→</span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "h2":
      return <h2 key={i} className="text-xl font-bold text-gray-900 mt-10 mb-3 pt-6 border-t border-gray-100">{block.text}</h2>;

    case "h3":
      return <h3 key={i} className="text-base font-bold text-gray-900 mt-6 mb-2">{block.text}</h3>;

    case "p":
      return <p key={i} className="text-gray-700 text-base leading-relaxed text-justify">{parseInline(block.text)}</p>;

    case "list":
      return (
        <ul key={i} className="space-y-2 mt-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-700 text-base">
              <span className="text-primary-500 font-bold mt-0.5">✓</span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "numbered-list":
      return (
        <ol key={i} className="space-y-3 mt-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-700 text-base">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div key={i} className="overflow-x-auto rounded-xl border border-gray-200 mt-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-50">
                {block.headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left font-semibold text-gray-800 text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-gray-700 border-t border-gray-100">{parseInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout":
      return (
        <div key={i} className="bg-primary-50 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mt-2">
          <p className="text-2xl font-bold text-primary-700">{block.text}</p>
          {block.sub && <p className="text-sm text-primary-600 mt-1">{block.sub}</p>}
        </div>
      );

    case "accordion":
      return <Accordion key={i} title={block.title} blocks={block.blocks} />;

    case "inline-cta":
      return (
        <div key={i} className="bg-primary-50 border border-primary-200 rounded-xl p-4 mt-2">
          <p className="text-sm font-semibold text-primary-800 mb-3">{block.text}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {block.links.map((link, j) => (
              <Link key={j} to={link.to} className={`text-sm font-semibold px-4 py-2 rounded-lg text-center transition-colors ${j === 0 ? "bg-primary-500 text-white hover:bg-primary-600" : "border border-primary-400 text-primary-700 hover:bg-primary-100"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      );

    case "source":
      return (
        <p key={i} className="text-xs text-gray-500 border-t border-gray-100 pt-6 mt-6">
          Bron: <a href={block.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">{block.label}</a>{block.checked ? `, geraadpleegd op ${block.checked}` : ""}.
        </p>
      );

    case "note":
      return (
        <p key={i} className="text-xs text-gray-400 italic border-t border-gray-100 pt-6 mt-6">
          {block.text}
        </p>
      );

    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-56 sm:h-72 object-cover rounded-2xl"
        />
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[article.category]}`}>
            {article.category}
          </span>
          <span className="text-sm text-gray-400">{article.date}</span>
          <span className="text-sm text-gray-400">· {article.readTime} leestijd</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-6">
          {article.title}
        </h1>

        {/* Content */}
        <div className="space-y-4">
          {article.content.map((block, i) => renderBlock(block, i))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-lg font-bold mb-2">Heeft u een vraag over uw situatie?</h2>
          <p className="text-green-100 text-sm mb-5">Doe de Situatiecheck of plan een gesprek met onze advocaat.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tool" className="bg-white text-primary-600 hover:bg-gray-50 font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              Kom ik in aanmerking?
            </Link>
            <Link to="/contact" className="border border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Plan een gesprek
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link to="/blog" className="text-sm text-gray-400 hover:text-primary-600 transition-colors">
            ← Terug naar alle artikels
          </Link>
        </div>
      </article>
    </div>
  );
}

