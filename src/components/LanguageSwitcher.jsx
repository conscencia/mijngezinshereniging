import { useState } from "react";

const LANGS = [
  { code: "nl", label: "NL", title: "Nederlands" },
  { code: "en", label: "EN", title: "English" },
  { code: "fr", label: "FR", title: "Français" },
  { code: "ar", label: "ع", title: "العربية" },
  { code: "es", label: "ES", title: "Español" },
];

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState("nl");

  const switchLang = (code) => {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return;
    select.value = code === "nl" ? "" : code;
    select.dispatchEvent(new Event("change"));
    setCurrent(code);
  };

  return (
    <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg px-1 py-0.5">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLang(lang.code)}
          title={lang.title}
          className={`px-1.5 py-0.5 text-xs font-semibold rounded transition-all ${
            current === lang.code
              ? "bg-primary-500 text-white"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
