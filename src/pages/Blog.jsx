import { useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../data/articles";

const categories = ["Alle", "Tips", "Procedure", "Inkomenseis", "Beroep", "Huwelijk"];

const categoryColors = {
  Tips: "bg-blue-100 text-blue-700",
  Procedure: "bg-green-100 text-green-700",
  Inkomenseis: "bg-yellow-100 text-yellow-700",
  Beroep: "bg-red-100 text-red-700",
  Huwelijk: "bg-rust-500/10 text-rust-600",
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Alles over gezinshereniging</h1>
          <p className="text-green-100 text-base max-w-xl mx-auto">
            Duidelijke uitleg zonder moeilijke taal, geschreven door onze advocaat.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

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
        <div className="mt-16 bg-primary-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Heeft u een vraag over uw situatie?</h2>
          <p className="text-green-100 text-sm mb-6">Doe de Situatiecheck of plan een gesprek met onze advocaat.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tool" className="bg-white text-primary-600 hover:bg-gray-50 font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              Kom ik in aanmerking?
            </Link>
            <Link to="/contact" className="border border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Plan een gesprek
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

