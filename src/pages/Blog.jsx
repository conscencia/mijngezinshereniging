import { useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../data/articles";

const categories = ["Alle", "Tips", "Procedure", "Inkomenseis", "Kosten", "Wetgeving", "Beroep", "Huwelijk"];

const categoryColors = {
  Tips: "bg-blue-100 text-blue-700",
  Procedure: "bg-green-100 text-green-700",
  Inkomenseis: "bg-yellow-100 text-yellow-700",
  Beroep: "bg-red-100 text-red-700",
  Huwelijk: "bg-rust-500/10 text-rust-600",
  Kosten: "bg-primary-100 text-primary-700",
  Wetgeving: "bg-gray-200 text-gray-800",
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Alle");

  const filtered = activeCategory === "Alle"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <p className="mg-eyebrow mg-eyebrow-light">Blog</p>
          <h1 className="mg-display text-white max-w-3xl">Alles over <em>gezinshereniging</em></h1>
          <p className="mg-lead text-primary-100 mt-6 max-w-2xl">
            Duidelijke uitleg zonder moeilijke taal, geschreven door onze advocaat.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="text-left group hover:-translate-y-1 transition-transform duration-300 block"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover rounded-2xl"
              />
              <div className="mt-4">
                <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h3>
                <p className={`text-xs font-semibold mt-2 ${categoryColors[article.category].split(" ")[1]}`}>
                  {article.category} · {article.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mg-cta mg-cta-card mt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl">
            <p className="mg-eyebrow mg-eyebrow-light">Persoonlijk advies</p>
            <h2 className="mg-h2 text-white">Heeft u een vraag over uw <em>situatie</em>?</h2>
            <p className="mg-lead text-primary-100 mt-4">Doe de situatiecheck of plan een gesprek met onze advocaat.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/tool" className="mg-btn mg-btn-rust">Doe de situatiecheck</Link>
            <Link to="/contact" className="mg-btn mg-btn-ghost">Plan een gesprek</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

