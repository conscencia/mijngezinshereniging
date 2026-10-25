import { useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cleanPhone, isValidPhone } from "../lib/phone";
import { sendForm, MAX_FILES, MAX_TOTAL_BYTES } from "../lib/sendForm";
import { useSeo } from "../lib/seo";

export const ONDERWERPEN = [
  ["gezinshereniging", "Gezinshereniging"],
  ["huwelijk", "Huwen met een buitenlandse partner"],
  ["visum", "Visumaanvraag"],
  ["weigering", "Weigering van een aanvraag"],
  ["erkenning-huwelijk", "Weigering erkenning huwelijk"],
  ["wettelijke-samenwoning", "Weigering wettelijke samenwoning"],
  ["anders", "Iets anders"],
];

export default function Contact() {
  useSeo({
    path: "/contact",
    title: "Stel uw vraag over gezinshereniging",
    description: "Leg uw situatie voor aan een advocaat ingeschreven aan de balie West-Vlaanderen. U krijgt zo snel mogelijk een antwoord per e-mail.",
  });

  const [params] = useSearchParams();
  const gekozen = params.get("onderwerp");
  const [form, setForm] = useState({
    naam: "", voornaam: "", telefoon: "", email: "",
    onderwerp: ONDERWERPEN.some(([v]) => v === gekozen) ? gekozen : "",
    fase: "", vraag: "", privacy: false,
  });
  const [bestanden, setBestanden] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [botField, setBotField] = useState("");
  const fileRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.naam.trim()) e.naam = "Naam is verplicht";
    if (!form.voornaam.trim()) e.voornaam = "Voornaam is verplicht";
    if (!form.telefoon.trim()) e.telefoon = "Telefoonnummer is verplicht";
    else if (!isValidPhone(form.telefoon)) e.telefoon = "Vul een geldig telefoonnummer in, enkel cijfers";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Geldig e-mailadres verplicht";
    if (!form.vraag.trim()) e.vraag = "Uw vraag of situatie is verplicht";
    if (!form.privacy) e.privacy = "U moet akkoord gaan met het privacybeleid";
    if (bestanden.length > MAX_FILES) e.bestanden = `U kunt maximaal ${MAX_FILES} bestanden meesturen`;
    else if (bestanden.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) e.bestanden = "De bestanden zijn samen groter dan 8 MB. Stuur grotere documenten later per e-mail.";
    return e;
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setBestanden(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (i) => setBestanden(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    setSendError("");
    try {
      await sendForm("contact", {
        naam: form.naam, voornaam: form.voornaam, telefoon: form.telefoon, email: form.email,
        onderwerp: ONDERWERPEN.find(([v]) => v === form.onderwerp)?.[1] || "",
        fase: ({ "nog-niet-begonnen": "Nog niet begonnen", ingediend: "Aanvraag al ingediend", weigering: "Weigering ontvangen" })[form.fase] || "",
        vraag: form.vraag, privacy: "akkoord", "bot-field": botField,
      }, bestanden);
      setSubmitted(true);
    } catch (err) {
      setSendError("Uw bericht kon niet verstuurd worden. Probeer het opnieuw, of mail naar");
    } finally {
      setSending(false);
    }
  };

  const inputClass = (name) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white ${errors[name] ? "border-red-400" : "border-gray-300"}`;

  return (
    <div className="bg-gray-50">

      {/* MAIN — Contact2 layout */}
      <section className="pt-12 pb-14 sm:pt-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 lg:gap-16">

            {/* Links: titel + contactgegevens */}
            <div className="flex flex-col gap-8 max-w-sm w-full lg:sticky lg:top-28">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                  Hoe kunnen<br />wij u helpen?
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                  Stel uw vraag of plan een videogesprek. U krijgt zo snel mogelijk een antwoord per e-mail.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Intakegesprek inboeken</h3>
                <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-5">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Kies zelf een moment voor een videogesprek van 30 minuten (€75 excl. btw).
                  </p>
                  <Link to="/afspraak" className="mg-btn mg-btn-rust w-full">Maak een afspraak</Link>
                </div>
                <div className="mt-3">
                  <Link to="/tarieven" className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                    Bekijk onze tarieven →
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contactgegevens</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>
                    <span className="font-semibold text-gray-800">E-mail: </span>
                    <a href="mailto:info@mijngezinshereniging.be" translate="no" className="notranslate underline hover:text-primary-600 transition-colors break-all">info@mijngezinshereniging.be</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Rechts: formulier */}
            <div className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full">
              <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bericht ontvangen</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Wij nemen zo snel mogelijk contact op om een afspraak in te plannen.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-5 text-left text-sm text-gray-700">
                      <strong className="block mb-2 text-gray-900">Alvast verzamelen om tijd te winnen:</strong>
                      <ul className="space-y-1 list-disc list-inside text-gray-600">
                        <li>Loonfiches van de laatste 3 maanden</li>
                        <li>Meest recente belastingaangifte</li>
                        <li>Huurcontract of eigendomsakte</li>
                        <li>Huwelijksakte of bewijs samenwoning</li>
                        <li>Paspoort van het gezinslid</li>
                      </ul>
                    </div>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-primary-600 text-sm underline hover:text-primary-700">
                      Nog een bericht sturen
                    </button>
                  </div>
                ) : (
                  <form name="contact" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <p hidden><label>Niet invullen: <input name="bot-field" value={botField} onChange={e => setBotField(e.target.value)} tabIndex={-1} autoComplete="off" /></label></p>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Stel uw vraag</h2>
                      <p className="text-gray-400 text-sm">Een advocaat neemt zo snel mogelijk contact met u op.</p>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
                        <input type="text" value={form.naam} onChange={e => setForm({ ...form, naam: e.target.value })} placeholder="Familienaam" className={inputClass("naam")} />
                        {errors.naam && <p className="text-red-500 text-xs mt-1">{errors.naam}</p>}
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam *</label>
                        <input type="text" value={form.voornaam} onChange={e => setForm({ ...form, voornaam: e.target.value })} placeholder="Voornaam" className={inputClass("voornaam")} />
                        {errors.voornaam && <p className="text-red-500 text-xs mt-1">{errors.voornaam}</p>}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer *</label>
                        <input type="tel" inputMode="tel" autoComplete="tel" value={form.telefoon} onChange={e => setForm({ ...form, telefoon: cleanPhone(e.target.value) })} placeholder="+32470123456" className={inputClass("telefoon")} />
                        {errors.telefoon && <p className="text-red-500 text-xs mt-1">{errors.telefoon}</p>}
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="uw@email.be" className={inputClass("email")} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="onderwerp" className="block text-sm font-medium text-gray-700 mb-1">Waarover gaat uw vraag?</label>
                      <select id="onderwerp" value={form.onderwerp} onChange={e => setForm({ ...form, onderwerp: e.target.value })} className={inputClass("onderwerp")}>
                        <option value="">Kies een onderwerp</option>
                        {ONDERWERPEN.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Wat is de stand van zaken van uw aanvraag?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          ["nog-niet-begonnen", "Nog niet begonnen"],
                          ["ingediend", "Aanvraag al ingediend"],
                          ["weigering", "Weigering ontvangen"],
                        ].map(([val, label]) => (
                          <label key={val} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-all ${form.fase === val ? "border-primary-500 bg-primary-50 text-primary-800 font-medium" : "border-gray-200 text-gray-600 hover:border-primary-300"}`}>
                            <input type="radio" name="fase" value={val} checked={form.fase === val} onChange={e => setForm({ ...form, fase: e.target.value })} className="accent-primary-500" />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uw vraag of situatie *</label>
                      <textarea
                        value={form.vraag}
                        onChange={e => setForm({ ...form, vraag: e.target.value })}
                        rows={4}
                        placeholder="Beschrijf kort uw situatie en wat u specifiek wilt weten..."
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none bg-white ${errors.vraag ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors.vraag && <p className="text-red-500 text-xs mt-1">{errors.vraag}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Documenten opladen <span className="text-gray-400 font-normal">(optioneel)</span></label>
                      <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all">
                        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-500">Klik om bestanden te selecteren</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max. 3 bestanden, samen max. 8 MB)</p>
                        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} className="hidden" />
                      </div>
                      {errors.bestanden && <p className="text-red-500 text-xs mt-1">{errors.bestanden}</p>}
                      {bestanden.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {bestanden.map((bestand, i) => (
                            <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                              <span className="truncate">{bestand.name}</span>
                              <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="privacy-contact" checked={form.privacy} onChange={e => setForm({ ...form, privacy: e.target.checked })} className="mt-0.5 w-4 h-4 accent-primary-500" />
                      <label htmlFor="privacy-contact" className="text-sm text-gray-600 leading-relaxed">
                        Ik ga akkoord met de verwerking van mijn gegevens conform het{" "}
                        <Link to="/privacy" className="text-primary-600 underline">privacybeleid</Link>. *
                      </label>
                    </div>
                    {errors.privacy && <p className="text-red-500 text-xs -mt-3">{errors.privacy}</p>}

                    <p className="text-xs text-gray-500 leading-relaxed">Uw vraag wordt behandeld door een advocaat ingeschreven aan de balie West-Vlaanderen. U ontvangt de volledige gegevens van de advocaat in de eerste reactie, vóór er een opdracht is.</p>
                    {sendError && <p className="text-red-600 text-sm" role="alert">{sendError} <a href="mailto:info@mijngezinshereniging.be" translate="no" className="notranslate underline">info@mijngezinshereniging.be</a>.</p>}
                    <button type="submit" disabled={sending} className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
                      {sending ? "Bezig met versturen…" : "Verstuur bericht"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-4 pb-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Veelgestelde vragen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 border-t border-primary-200 pt-6">
            {[
              { q: "Hoe snel word ik geholpen?", a: "Na uw bericht of boeking nemen wij zo snel mogelijk contact op. Loopt er een termijn, zoals de beroepstermijn van 30 dagen na een weigering? Vermeld dat dan duidelijk in uw bericht." },
              { q: "Wat zijn de voordelen van professionele begeleiding?", a: "Gezinshereniging is complex. Er is veel informatie te vinden, maar die is niet altijd correct of van toepassing op uw situatie. Een advocaat helpt u het bos door de bomen te zien. Fouten in een dossier kunnen soms niet meer worden rechtgezet en kunnen ook een latere aanvraag bemoeilijken. Professionele begeleiding geeft geen garantie op goedkeuring, maar verhoogt de slaagkansen wel van bij het begin." },
              { q: "Is mijn situatie vertrouwelijk?", a: "Wat u aan een advocaat toevertrouwt, valt onder het beroepsgeheim. Uw gegevens worden enkel gedeeld voor zover dat nodig is voor uw dossier of wettelijk verplicht is. Meer daarover leest u in de privacyverklaring." },
            ].map((faq) => (
              <div key={faq.q}>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ textAlign: "left" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
