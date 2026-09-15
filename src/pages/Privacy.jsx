import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="mg-pagehead text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
          <p className="mg-eyebrow mg-eyebrow-light">Laatste update: juni 2026</p>
          <h1 className="mg-display text-white">Privacy en <em>voorwaarden</em></h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 space-y-10">

        {/* Privacy Policy */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacybeleid</h2>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">1. Verwerkingsverantwoordelijke</h3>
              <p><span translate="no" className="notranslate">MijnGezinshereniging.be</span> is een website van het advocatenkantoor gevestigd te <span translate="no" className="notranslate">Holstraat 89A, 8790 Waregem</span>, België. Contactadres: <span translate="no" className="notranslate">advocaat@mijngezinshereniging.be</span>.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">2. Welke gegevens verzamelen wij?</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Naam en voornaam</li>
                <li>E-mailadres</li>
                <li>Telefoonnummer</li>
                <li>Nationaliteit van het gezinslid</li>
                <li>Informatie die u deelt in contactformulieren of de wizard</li>
                <li>Technische gegevens (IP-adres, browser, bezochte pagina's)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">3. Waarvoor gebruiken wij uw gegevens?</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Beantwoorden van uw contactvraag</li>
                <li>Verstrekken van juridisch advies (na toestemming)</li>
                <li>Opvolging van uw dossier</li>
                <li>Verbeteren van onze website en dienstverlening</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">4. Bewaartermijn</h3>
              <p>Gegevens van contactaanvragen bewaren wij maximaal 2 jaar, tenzij u actief cliënt bent. Dossiergegevens bewaren wij conform de verplichtingen voor advocaatn (10 jaar na afsluit dossier).</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">5. Delen met derden</h3>
              <p>Wij delen uw gegevens NIET met derden voor commerciële doeleinden. Gegevens kunnen worden gedeeld met technische dienstverleners (hosting, e-mail) onder verwerkersovereenkomst. Wij delen geen gegevens met overheidsinstanties zonder wettelijke verplichting.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">6. Uw rechten (AVG/GDPR)</h3>
              <p className="mb-2">Onder de Algemene Verordening Gegevensbescherming (AVG) heeft u het recht op:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Inzage in uw persoonsgegevens</li>
                <li>Correctie van onjuiste gegevens</li>
                <li>Verwijdering van uw gegevens ("recht om vergeten te worden")</li>
                <li>Beperking van de verwerking</li>
                <li>Overdraagbaarheid van gegevens</li>
                <li>Bezwaar tegen verwerking</li>
              </ul>
              <p className="mt-2">Verzoeken kunt u richten aan: <span translate="no" className="notranslate">advocaat@mijngezinshereniging.be</span></p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">7. Klacht indienen</h3>
              <p>U kunt een klacht indienen bij de Gegevensbeschermingsautoriteit (GBA): Drukpersstraat 35, 1000 Brussel, contact@apd-gba.be</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">8. Cookies</h3>
              <p>Wij gebruiken functionele cookies die noodzakelijk zijn voor het functioneren van de website (bijv. localStorage voor formulierdata). Wij gebruiken geen tracking-cookies van derden zonder uw expliciete toestemming.</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* AV */}
        <section id="av">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Algemene Voorwaarden</h2>

          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">1. Toepassingsgebied</h3>
              <p>Deze algemene voorwaarden zijn van toepassing op alle diensten aangeboden door <span translate="no" className="notranslate">MijnGezinshereniging.be</span> en het verbonden advocatenkantoor.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">2. Aard van de dienstverlening</h3>
              <p>De informatie op deze website is uitsluitend informatief en vormt geen juridisch advies. Een advocaat-cliëntrelatie ontstaat enkel na schriftelijke opdrachtbevestiging en betaling van het overeengekomen ereloon.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">3. Tarieven</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Consultatie (30 min, video of fysiek): €75 excl. btw</li>
                <li>Begeleiding van uw dossier: vaste prijs, afgesproken tijdens de consultatie</li>
                <li>Is een vaste prijs niet mogelijk: uurtarief van €125 excl. btw</li>
                <li>Beide pakketten omvatten schriftelijk advies, volledige documentencheck en voorbereiding van de aanvraag gezinshereniging</li>
              </ul>
              <p className="mt-2">Alle tarieven zijn exclusief BTW tenzij anders vermeld. Gerechtskosten en retributies zijn niet inbegrepen.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">4. Aansprakelijkheid</h3>
              <p>De online tool op deze website is louter indicatief. Er kunnen geen rechten aan de uitkomst van de tool worden ontleend. Beslissingen van DVZ zijn altijd finaal en kunnen niet worden beïnvloed door de uitkomst van de tool. Ons kantoor is niet aansprakelijk voor beslissingen genomen op basis van informatie op deze website.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">5. Toepasselijk recht</h3>
              <p>Belgisch recht is van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbanken van het arrondissement West-Vlaanderen.</p>
            </div>
          </div>
        </section>

        <div className="mg-note-box">
          <p className="mg-q-sub">Vragen over ons privacybeleid?</p>
          <Link to="/contact" className="mg-btn mg-btn-rust">
            Neem contact op
          </Link>
        </div>
      </div>
    </div>
  );
}
