import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({
    naam: "", voornaam: "", telefoon: "", email: "",
    fase: "", vraag: "", privacy: false,
  });
  const [bestanden, setBestanden] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.naam.trim()) e.naam = "Naam is verplicht";
    if (!form.voornaam.trim()) e.voornaam = "Voornaam is verplicht";
    if (!form.telefoon.trim()) e.telefoon = "Telefoonnummer is verplicht";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Geldig e-mailadres verplicht";
    if (!form.vraag.trim()) e.vraag = "Uw vraag of situatie is verplicht";
    if (!form.privacy) e.privacy = "U moet akkoord gaan met het privacybeleid";
    return e;
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setBestanden(prev => [...prev, ...files.map(f => f.name)]);
  };

  const removeFile = (i) => setBestanden(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const data = { ...form, bestanden, timestamp: new Date().toISOString(), bron: "contact-pagina" };
    localStorage.setItem("mgz_contact_" + Date.now(), JSON.stringify(data));
    setSubmitted(true);
  };

  const inputClass = (name) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white ${errors[name] ? "border-red-400" : "border-gray-300"}`;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* MAIN — Contact2 layout */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-20">

            {/* Links: titel + contactgegevens */}
            <div className="flex flex-col justify-between gap-10 max-w-sm mx-auto lg:mx-0 w-full">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                  Hoe kunnen<br />wij u helpen?
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                  Stel uw vraag of plan een gesprek. Wij nemen zo snel mogelijk contact op.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center lg:text-left">Intakegesprek inboeken</h3>
                <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-5">
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Boek rechtstreeks een videocall van 30 minuten. Betaling gebeurt bij bevestiging.
                  </p>
                  <a
                    href="https://calendly.com/mijngezinshereniging"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Direct inboeken (€50)
                  </a>
                </div>
                <div className="mt-4 text-center lg:text-left">
                  <Link to="/tarieven" className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                    Bekijk onze tarieven →
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">Contactgegevens</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>
                    <span className="font-semibold text-gray-800">Telefoon: </span>
                    <a href="tel:+3250673206" className="hover:text-primary-600 transition-colors">+32 50 67 32 06</a>
                    <span className="text-gray-400 ml-1 text-xs">· ma–vr 9:00–18:00</span>
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">WhatsApp: </span>
                    <a href="https://wa.me/3250673206" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600 transition-colors">Direct chatten</a>
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">E-mail: </span>
                    <a href="mailto:advocaat@mijngezinshereniging.be" className="underline hover:text-primary-600 transition-colors break-all">advocaat@mijngezinshereniging.be</a>
                  </li>
                  <li>
                    <span className="font-semibold text-gray-800">Kantoor: </span>
                    Holstraat 89A, 8790 Waregem
                  </li>
                </ul>
              </div>
            </div>

            {/* Rechts: formulier */}
            <div className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full">
              <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-10">
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
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

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
                        <input type="tel" value={form.telefoon} onChange={e => setForm({ ...form, telefoon: e.target.value })} placeholder="+32 4XX XX XX XX" className={inputClass("telefoon")} />
                        {errors.telefoon && <p className="text-red-500 text-xs mt-1">{errors.telefoon}</p>}
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="uw@email.be" className={inputClass("email")} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
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
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max. 10 MB per bestand</p>
                        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} className="hidden" />
                      </div>
                      {bestanden.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {bestanden.map((naam, i) => (
                            <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                              <span className="truncate">{naam}</span>
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

                    <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base">
                      Verstuur bericht
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-primary-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Veelgestelde vragen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { q: "Hoe snel word ik geholpen?", a: "Na uw bericht of boeking nemen wij zo snel mogelijk contact op. Spoedeisende zaken kunnen vaak dezelfde dag worden ingepland." },
              { q: "Wat zijn de voordelen van professionele begeleiding?", a: "Gezinshereniging is complex. Er is veel informatie te vinden, maar die is niet altijd correct of van toepassing op uw situatie. Een advocaat helpt u het bos door de bomen te zien. Fouten in een dossier kunnen soms niet meer worden rechtgezet en maken een weigering ook in de toekomst onvermijdelijk. Professionele begeleiding geeft geen garantie op goedkeuring, maar verhoogt de slaagkansen wel van bij het begin." },
              { q: "Is mijn situatie vertrouwelijk?", a: "Alles wat u deelt valt onder het beroepsgeheim van de advocaat. Uw gegevens worden nooit gedeeld zonder uw uitdrukkelijke toestemming." },
            ].map((faq) => (
              <div key={faq.q} className="border-l-2 border-primary-200 pl-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed text-justify">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
