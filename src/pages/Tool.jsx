import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BOOKING_URL } from "../config";

const QUESTIONS = {
  nationaliteit: {
    id: "nationaliteit",
    label: "Stap 1",
    title: "Wat is uw huidige nationaliteit of statuut in België?",
    help: "Deze vraag bepaalt welke voorwaarden voor u gelden. De regels zijn anders per nationaliteit of statuut.",
    options: [
      { value: "belg", label: "Ik ben Belg", icon: "🇧🇪" },
      { value: "eu", label: "Ik ben EU-burger (of EER)", icon: "🇪🇺" },
      { value: "niet-eu", label: "Niet-EU nationaliteit met geldige verblijfskaart", icon: "🪪" },
      { value: "vluchteling", label: "Erkend vluchteling of subsidiair beschermd", icon: "🔰" },
    ],
    next: (answers) => {
      if (answers.nationaliteit === "niet-eu") return null;
      if (answers.nationaliteit === "vluchteling") return null;
      if (answers.nationaliteit === "belg") return "belg-type";
      if (answers.nationaliteit === "eu") return "eu-type";
      return "gezinslid";
    },
  },
  "belg-type": {
    id: "belg-type",
    label: "Stap 2",
    title: "Heeft u ooit gebruik gemaakt van uw recht op vrij verkeer in de EU?",
    help: "Dit onderscheid is juridisch cruciaal. Een Belg die gewoond of gewerkt heeft in een andere EU-lidstaat ('actieve Belg') valt onder Europees Unierecht (art. 40bis Vw.) en heeft gunstiger regels dan een Belg die altijd in België bleef ('statische Belg', art. 40ter Vw.).",
    options: [
      { value: "statisch", label: "Nee, ik heb altijd in België gewoond en nooit duurzaam in een andere EU-lidstaat gewerkt of gestudeerd", icon: "🏠" },
      { value: "actief", label: "Ja, ik heb gewoond, gewerkt of gestudeerd in een andere EU-lidstaat", icon: "🇪🇺" },
    ],
    next: (answers) => answers["belg-type"] === "actief" ? "eu-type" : "gezinslid",
  },
  "eu-type": {
    id: "eu-type",
    label: "Uw statuut",
    title: "Wat is uw huidige situatie in België?",
    help: "Dit onderscheid is juridisch cruciaal. Werknemers, zelfstandigen en werkzoekenden genieten de ruimste rechten (art. 40/40bis Verblijfswet). Studenten en beschikkers hebben beperkingen, o.a. voor het overkomen van (groot)ouders.",
    options: [
      { value: "economisch-actief", label: "Ik werk, ben zelfstandige of zoek actief werk in België", icon: "💼" },
      { value: "student", label: "Ik studeer in België (ingeschreven aan een erkende instelling)", icon: "🎓" },
      { value: "beschikker", label: "Ik beschik over voldoende eigen middelen (gepensioneerd, rentenier, ...)", icon: "🏦" },
    ],
    next: () => "gezinslid-eu",
  },
  "gezinslid-eu": {
    id: "gezinslid-eu",
    label: "Stap 3",
    title: "Wie wilt u naar België halen?",
    help: "Als EU-burger of actieve Belg valt u onder de Burgerschapsrichtlijn (art. 40/40bis Verblijfswet). Er geldt in principe GEEN inkomenseis voor uw echtgeno(o)t(e) of minderjarige kinderen.",
    options: [
      { value: "eu-partner", label: "Mijn echtgeno(o)t(e) of gelijkgestelde partner (al gehuwd of gelijkgesteld)", icon: "💑" },
      { value: "eu-geregistreerd", label: "Mijn wettelijk geregistreerde partner (niet gehuwd)", icon: "📝" },
      { value: "eu-kind", label: "Mijn (stief)kind (minderjarig of meerderjarig ten laste)", icon: "👶" },
      { value: "eu-ouder", label: "Mijn (schoon)grootouder (ten laste van mij of mijn partner)", icon: "👴" },
      { value: "eu-ander", label: "Ander familielid (broer, zus, feitelijke partner, ...)", icon: "👥" },
    ],
    next: () => null,
  },
  gezinslid: {
    id: "gezinslid",
    label: "Stap 2",
    title: "Wie wilt u naar België halen?",
    help: "Elk gezinslid heeft andere voorwaarden en regels. Kies de categorie die het beste past bij uw situatie.",
    options: [
      { value: "partner", label: "Mijn echtgeno(o)t(e) (wij zijn gehuwd)", icon: "💑" },
      { value: "partner-niet-gehuwd", label: "Mijn geregistreerde partner (wettelijk samenwonend of buitenlands partnerschap)", icon: "📝" },
      { value: "partner-toekomst", label: "Mijn partner, maar wij zijn (nog) niet gehuwd of geregistreerd", icon: "💍" },
      { value: "kind-min", label: "Mijn minderjarig kind (jonger dan 18)", icon: "👶" },
      { value: "kind-18", label: "Mijn meerderjarig kind (18 jaar of ouder)", icon: "🧑" },
      { value: "ouder", label: "Mijn (groot)ouder", icon: "👴" },
      { value: "ander-familielid", label: "Ander familielid (broer, zus, neef, nicht, ...)", icon: "👥" },
    ],
    next: (answers) => {
      if (answers.gezinslid === "partner") return "leeftijd";
      if (answers.gezinslid === "partner-niet-gehuwd") return "relatie";
      if (answers.gezinslid === "partner-toekomst") return null;
      if (answers.gezinslid === "kind-min") return "kind-voogdij";
      if (answers.gezinslid === "ouder") return "bent-u-minderjarig";
      if (answers.gezinslid === "ander-familielid") return null;
      return "inkomen"; // kind-18
    },
  },
  relatie: {
    id: "relatie",
    label: "Stap 3",
    title: "Kunt u een duurzame relatie bewijzen?",
    help: "Als geregistreerde partner moet u aantonen dat uw relatie duurzaam en stabiel is. Bij een huwelijk is dat niet nodig. Kies wat op u van toepassing is.",
    options: [
      { value: "samenwonen", label: "Wij woonden minstens 1 jaar onafgebroken samen vlak voor de aanvraag", icon: "🏠" },
      { value: "kennen", label: "Wij kennen elkaar minstens 2 jaar, hadden regelmatig contact en zagen elkaar minstens 3 keer (samen 45 dagen of meer)", icon: "✈️" },
      { value: "kind", label: "Wij hebben samen een kind", icon: "👶" },
      { value: "geen", label: "Geen van deze situaties", icon: "⚠️" },
    ],
    next: () => "leeftijd-partner",
  },
  "leeftijd-partner": {
    id: "leeftijd-partner",
    label: "Stap 4",
    title: "Hoe oud bent u en uw partner?",
    help: "Geregistreerde partners van een Belg moeten beiden ouder zijn dan 21 jaar. Woonden jullie al 1 jaar samen voor uw partner in België aankwam? Dan volstaat 18 jaar.",
    options: [
      { value: "ja", label: "Wij zijn beiden ouder dan 21 jaar", icon: "✅" },
      { value: "ja-18", label: "Een van ons is tussen 18 en 21, maar wij woonden al 1 jaar samen", icon: "✅" },
      { value: "nee", label: "Een van ons is jonger dan 21 en wij woonden niet 1 jaar samen", icon: "⚠️" },
    ],
    next: () => "inkomen",
  },
  leeftijd: {
    id: "leeftijd",
    label: "Stap 3",
    title: "Bent u beiden ouder dan 18 jaar?",
    help: "Als u gehuwd bent met een Belg, moeten u en uw partner allebei ouder zijn dan 18 jaar op het moment van de aanvraag. Voor aanvragen vanaf 18 augustus 2027 wordt dat 21 jaar.",
    options: [
      { value: "ja", label: "Ja, wij zijn beiden 18 jaar of ouder", icon: "✅" },
      { value: "nee-ik", label: "Nee, ik ben jonger dan 18", icon: "⚠️" },
      { value: "nee-partner", label: "Nee, mijn partner is jonger dan 18", icon: "⚠️" },
    ],
    next: () => "inkomen",
  },
  "kind-voogdij": {
    id: "kind-voogdij",
    label: "Stap 3",
    title: "Wie heeft momenteel de zorg over uw kind?",
    help: "U moet het ouderlijk gezag hebben. Deelt u het gezag met de andere ouder, dan moet die schriftelijk toestemming geven dat het kind bij u in België komt wonen.",
    options: [
      { value: "ik-alleen", label: "Ik alleen heb het ouderlijk gezag", icon: "✅" },
      { value: "samen", label: "Samen met de andere ouder (co-ouderschap)", icon: "👫" },
      { value: "ex", label: "De andere ouder heeft voornamelijk de zorg", icon: "⚠️" },
    ],
    next: () => "kind-extra",
  },
  "bent-u-minderjarig": {
    id: "bent-u-minderjarig",
    label: "Stap 3",
    title: "Is de Belg bij wie de ouder komt wonen jonger dan 18 jaar?",
    help: "De Verblijfswet geeft een verblijfsrecht aan de vader of moeder van een minderjarig Belgisch kind. Voor ouders van een meerderjarige Belg bestaat dat recht niet.",
    options: [
      { value: "ja", label: "Ja, het gaat om een minderjarig Belgisch kind", icon: "👶" },
      { value: "nee", label: "Nee, de Belg is 18 jaar of ouder", icon: "🧑" },
    ],
    next: () => null,
  },
  "kind-extra": {
    id: "kind-extra",
    label: "Stap 4",
    title: "Komen er ook andere gezinsleden mee naar België?",
    help: "Als u alleen gezinshereniging vraagt voor uw minderjarig kind, is er géén inkomenseis. Vraagt u tegelijk ook voor uw partner of een meerderjarig kind? Dan geldt de inkomenseis wél.",
    options: [
      { value: "alleen-kind", label: "Nee, enkel voor mijn minderjarig kind", icon: "👶" },
      { value: "ook-anderen", label: "Ja, ook voor mijn partner of een meerderjarig kind", icon: "👨‍👩‍👧" },
    ],
    next: (answers) => answers["kind-extra"] === "alleen-kind" ? null : "inkomen",
  },
  inkomen: {
    id: "inkomen",
    label: "Stap 4",
    title: "Beschikt u over een stabiel en voldoende inkomen?",
    help: "Het referentiebedrag is €2.217,47 netto per maand (sinds 1 september 2026). Loon, pensioen en een werkloosheidsuitkering (als u actief werk zoekt) tellen mee, net als het stabiele inkomen van uw partner. Leefloon, OCMW-steun, kindergeld en een wachtuitkering tellen niet mee.",
    options: [
      { value: "werk-voldoende", label: "Ja, wij hebben samen een stabiel inkomen van €2.217,47 netto/maand of meer", icon: "✅" },
      { value: "werk-twijfel", label: "Ons stabiele inkomen ligt onder €2.217,47 netto/maand", icon: "🤔" },
      { value: "zelfstandige", label: "Ik ben zelfstandige", icon: "💼" },
      { value: "werkloosheidsuitkering", label: "Ik ontvang werkloosheidsuitkering en zoek actief werk", icon: "🔍" },
      { value: "geen-werk", label: "Ik ontvang leefloon/OCMW of heb geen inkomen", icon: "❌" },
    ],
    next: () => null,
  },
};

function getExpectedSteps(answers) {
  const nat = answers.nationaliteit;
  if (nat === "niet-eu" || nat === "vluchteling") return 1;
  if (nat === "eu" || answers["belg-type"] === "actief") {
    const extraBelg = nat === "belg" ? 1 : 0;
    return 3 + extraBelg;
  }
  const extra = nat === "belg" ? 1 : 0;
  if (!answers.gezinslid) return 4 + extra;
  if (answers.gezinslid === "ouder") return 3 + extra;
  if (answers.gezinslid === "kind-18") return 3 + extra;
  if (answers.gezinslid === "partner") return 4 + extra;
  if (answers.gezinslid === "partner-niet-gehuwd") return 5 + extra;
  if (answers.gezinslid === "partner-toekomst") return 2 + extra;
  if (answers.gezinslid === "kind-min") {
    if (answers["kind-extra"] === "alleen-kind") return 4 + extra;
    return 5 + extra;
  }
  return 4 + extra;
}

function calculateResult(answers) {
  const {
    nationaliteit,
    "belg-type": belgType,
    "eu-type": euType,
    gezinslid,
    "gezinslid-eu": gezinslidEu,
    relatie,
    "leeftijd-partner": leeftijdPartner,
    leeftijd,
    "kind-voogdij": kindVoogdij,
    "kind-extra": kindExtra,
    "bent-u-minderjarig": bentUMinderjarig,
    inkomen,
  } = answers;

  // ── Erkend vluchteling of subsidiair beschermde: te complex voor de tool ──
  if (nationaliteit === "vluchteling") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Uw situatie vereist persoonlijk advies",
      summary: "Als erkend vluchteling of subsidiair beschermde heeft u in principe recht op gezinshereniging, maar de voorwaarden en procedure zijn sterk afhankelijk van uw specifiek beschermingsstatuut, de termijn van uw aanvraag en de gezinssamenstelling. Een persoonlijk gesprek is aangewezen.",
      points: [
        { icon: "📋", text: "Erkend vluchtelingen en subsidiair beschermden genieten specifieke regels op basis van de Verblijfswet en internationale verdragen (Vluchtelingenverdrag, art. 8 EVRM)." },
        { icon: "⚠️", text: "De termijn waarbinnen u de aanvraag indient na erkenning is cruciaal: te laat indienen kan uw rechten beperken." },
        { icon: "💡", text: "De precieze voorwaarden (inkomens- en huisvestingsvereisten, welke familieleden u kunt laten overkomen) verschillen per statuut. Een advocaat beoordeelt uw volledige situatie." },
      ],
      alternatives: [],
      cta: "Bespreek uw situatie met een advocaat",
    };
  }

  // ── Derdelander in België: te complex voor de tool ──
  if (nationaliteit === "niet-eu") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Uw situatie vereist persoonlijk advies",
      summary: "Als derdelander met verblijfskaart in België zijn de regels voor gezinshereniging afhankelijk van uw specifiek verblijfsstatuut. Er zijn heel veel hypotheses mogelijk en de voorwaarden verschillen sterk per geval. Een persoonlijk gesprek is aangewezen.",
      points: [
        { icon: "📋", text: "De regels hangen af van uw specifieke verblijfskaart: type A, B, C, D, F of F+ leidt tot heel andere voorwaarden en termijnen." },
        { icon: "⚠️", text: "Kreeg u uw verblijfsrecht vóór 18 augustus 2025? Dan geldt meestal het referentiebedrag van €2.217,47 netto per maand, zolang u aanvraagt vóór 18 augustus 2027. Kreeg u het op of na 18 augustus 2025? Dan gelden de nieuwe regels: €2.456,97 netto per maand, plus 10% per gezinslid ten laste, en een minimumleeftijd van 21 jaar voor partners." },
        { icon: "💡", text: "Sommige derdelanders vallen onder gunstiger Europese regels. Dit moet geval per geval worden beoordeeld door een advocaat." },
      ],
      alternatives: [],
      cta: "Bespreek uw situatie met een advocaat",
    };
  }

  // ── EU pad: actieve Belg of EU-burger ──
  if (gezinslidEu) {
    const isStudent = euType === "student";
    const isBeschikker = euType === "beschikker";
    const extraVereisten = isStudent || isBeschikker
      ? [{ icon: "⚠️", text: isStudent ? "Als EU-student moet u ook bewijzen dat u over voldoende bestaansmiddelen beschikt en dat uw partner een ziekteverzekering heeft die alle risico's in België dekt." : "Als beschikker moet u bewijzen dat u over voldoende eigen middelen beschikt en dat uw partner beschikt over een ziekteverzekering die alle risico's in België dekt." }]
      : [];

    if (gezinslidEu === "eu-partner") {
      return {
        status: "groen",
        emoji: "🟢",
        title: "U komt waarschijnlijk in aanmerking",
        summary: "Als EU-burger of actieve Belg heeft u het recht uw echtgeno(o)t(e) of gelijkgestelde partner naar België te halen op basis van de Burgerschapsrichtlijn (art. 40/40bis Verblijfswet). Er is GEEN klassieke inkomenseis.",
        points: [
          { icon: "✅", text: "Geen klassieke inkomenseis: de Burgerschapsrichtlijn legt geen minimumbedrag op. U moet wel aantonen dat u geen onredelijke belasting vormt voor de Belgische sociale bijstandsstelsels." },
          { icon: "📋", text: "Vereist: geldig paspoort van uw partner, huwelijksakte (gelegaliseerd, vertaald en eventueel erkend in België), bewijs van uw verblijfsrecht in België (EU-kaart of bijlage 19)." },
          ...extraVereisten,
          { icon: "⚠️", text: "DVZ controleert op schijnhuwelijk. Een sterk dossier met bewijs van uw relatie (foto's, communicatie, gezamenlijk verblijf) is sterk aanbevolen." },
          { icon: "✅", text: "Geen retributie: familieleden van een EU-burger of van een Belg die zijn recht op vrij verkeer gebruikte, betalen die niet." },
        ],
        alternatives: [],
        cta: "Laat uw dossier nakijken door een advocaat",
      };
    }

    if (gezinslidEu === "eu-geregistreerd") {
      return {
        status: "oranje",
        emoji: "🟡",
        title: "Mogelijk in aanmerking, maar bewijs van duurzame relatie is vereist",
        summary: "Een wettelijk geregistreerde partner van een EU-burger of actieve Belg heeft recht op gezinshereniging mits bewijs van een duurzame en stabiele relatie. Er is GEEN inkomenseis, maar DVZ hanteert strenge bewijscriteria.",
        points: [
          { icon: "✅", text: "Geen inkomenseis op basis van de Burgerschapsrichtlijn." },
          { icon: "📋", text: "Bewijs van duurzame en stabiele relatie vereist: minstens 1 jaar onafgebroken samenwonen, OF minstens 2 jaar kennen met minimaal 3 ontmoetingen van samen 45 dagen, OF een gemeenschappelijk kind." },
          { icon: "📋", text: "Leeftijd: u bent beiden ouder dan 21 jaar, of ouder dan 18 als u al 1 jaar samenwoonde voor uw partner in België aankwam." },
          { icon: "📋", text: "Vereist: akte van geregistreerd partnerschap (gelegaliseerd en vertaald waar nodig, en overgeschreven in de gemeente), bewijs van het verblijfsrecht van de EU-burger in België." },
          ...extraVereisten,
          { icon: "⚠️", text: "DVZ beoordeelt of uw relatie voldoende duurzaam en stabiel is. Zorg voor sterke bewijzen." },
          { icon: "✅", text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw situatie beoordelen door een advocaat",
      };
    }

    if (gezinslidEu === "eu-kind") {
      return {
        status: "groen",
        emoji: "🟢",
        title: "U komt waarschijnlijk in aanmerking",
        summary: "Kinderen van EU-burgers of actieve Belgen hebben recht op gezinshereniging op basis van de Burgerschapsrichtlijn. Een kind jonger dan 21 hoeft niet ten laste te zijn.",
        points: [
          { icon: "✅", text: "Is uw (stief)kind jonger dan 21? Dan hoeft u niet te bewijzen dat het ten laste is. Vanaf 21 jaar moet u aantonen dat het in het herkomstland financieel afhankelijk is van u." },
          { icon: "📋", text: "Vereist: geboorteakte of adoptieakte (gelegaliseerd, vertaald en erkend in België), bewijs van uw verblijfsrecht in België (EU-kaart of bijlage 19)." },
          ...extraVereisten,
          { icon: "⚠️", text: "Is uw kind minderjarig en deelt u het gezag met de andere ouder? Dan is een schriftelijke toestemming van de andere ouder nodig." },
          { icon: "💡", text: "Een ontbrekend of fout document kan uw aanvraag ernstig vertragen. Laat uw dossier eerst nakijken." },
          { icon: "✅", text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw dossier nakijken door een advocaat",
      };
    }

    if (gezinslidEu === "eu-ouder") {
      if (isStudent) {
        return {
          status: "rood",
          emoji: "🔴",
          title: "Geen recht op gezinshereniging als EU-student",
          summary: "Als EU-student heeft u géén recht om uw (groot)ouder naar België te halen. De Burgerschapsrichtlijn beperkt dit recht voor studenten tot de echtgeno(o)t(e), geregistreerde partner en (stief)kinderen.",
          points: [
            { icon: "❌", text: "EU-studenten hebben uitdrukkelijk géén recht op gezinshereniging met (groot)ouders. Dit is een bewuste beperking in de Verblijfswet (art. 40bis Vw.)." },
            { icon: "📌", text: "Bent u na uw studies economisch actief geworden (werknemer, zelfstandige)? Dan gelden er andere, ruimere regels." },
            { icon: "💡", text: "In uitzonderlijke situaties kan een humanitair visum of art. 20 VWEU een alternatief bieden. Een advocaat beoordeelt uw specifieke situatie." },
          ],
          alternatives: [
            { icon: "💼", title: "Na uw studies: economisch actief statuut", text: "Van zodra u werkt of als zelfstandige actief bent, heeft u wel het recht om (groot)ouders over te laten komen (mits ten-laste-bewijs)." },
            { icon: "🤝", title: "Humanitair visum (type D)", text: "In bijzondere omstandigheden (ernstige ziekte, noodsituatie) kan een humanitair visum worden aangevraagd bij de Belgische ambassade. Dit is een discretionaire beslissing." },
          ],
          cta: "Bespreek uw situatie met een advocaat",
        };
      }
      return {
        status: "oranje",
        emoji: "🟡",
        title: "Mogelijk in aanmerking als uw (groot)ouder ten laste is",
        summary: "Een (schoon)grootouder van een EU-burger of actieve Belg heeft recht op gezinshereniging als hij of zij aantoonbaar 'ten laste' is. Dit is een financiële afhankelijkheid in het herkomstland.",
        points: [
          { icon: "📋", text: "'Ten laste' betekent dat uw (groot)ouder voor zijn of haar basisbehoeften financieel afhankelijk was van uw steun in het land van herkomst. Bewijs hiervan is verplicht." },
          { icon: "📋", text: "Vereist: bewijs van afstamming (geboorteakte, gelegaliseerd en vertaald), bewijs van ten-laste-zijn (bankuittreksels van geldoverschrijvingen, verklaringen van bevoegde overheden), bewijs van uw verblijfsrecht in België." },
          ...extraVereisten,
          { icon: "⚠️", text: "DVZ beoordeelt de financiële afhankelijkheid strikt. Een louter emotionele band of de wens tot samenwonen volstaat niet." },
          { icon: "✅", text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw situatie beoordelen door een advocaat",
      };
    }

    if (gezinslidEu === "eu-ander") {
      return {
        status: "oranje",
        emoji: "🟡",
        title: "Uw situatie is complex: de wet voorziet vier uitzonderingsgronden",
        summary: "Andere familieleden van EU-burgers (broers, zussen, neven, nichten, feitelijke partners zonder registratie...) hebben géén automatisch recht op gezinshereniging. Toch zijn er vier situaties waarin verblijf mogelijk is. DVZ beoordeelt dit geval per geval.",
        points: [
          { icon: "📋", text: "Categorie 1: u heeft een deugdelijk bewezen duurzame relatie met de EU-burger en komt niet in aanmerking als geregistreerde partner (bewijs: minstens 1 jaar samenwonen of 2 jaar kennen met regelmatig contact)." },
          { icon: "📋", text: "Categorie 2: u bent in het herkomstland financieel ten laste van de EU-burger (bewijs van financiële afhankelijkheid voor uw basisbehoeften)." },
          { icon: "📋", text: "Categorie 3: u maakte deel uit van het gezin van de EU-burger in het herkomstland (aantoonbaar nauwe, duurzame en persoonlijke band)." },
          { icon: "📋", text: "Categorie 4: u heeft ernstige gezondheidsproblemen en heeft de persoonlijke zorg van de EU-burger nodig." },
          { icon: "⚠️", text: "DVZ heeft een ruime beoordelingsbevoegdheid. Juridisch advies is sterk aanbevolen om uw kansen correct in te schatten." },
        ],
        alternatives: [],
        cta: "Laat uw situatie beoordelen door een advocaat",
      };
    }
  }

  // ── Ouder: minderjarig Belgisch kind wiens niet-EU-ouder wil overkomen ──
  if (gezinslid === "ouder" && bentUMinderjarig === "ja") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Mogelijk: de ouder van een minderjarige Belg kan verblijf aanvragen",
      summary: "De Verblijfswet voorziet een verblijfsrecht voor de vader of moeder van een minderjarig Belgisch kind. De ouder moet het kind begeleiden of zich bij het kind voegen. Daarnaast kan ook het Europees recht (art. 20 VWEU) een verblijfsrecht openen als het kind zo afhankelijk is van de ouder dat het anders de EU zou moeten verlaten.",
      points: [
        { icon: "✅", text: "Er geldt geen inkomenseis voor de ouder van een minderjarig Belgisch kind." },
        { icon: "📋", text: "De ouder legt een identiteitsbewijs voor en een bewijs van afstamming (geboorteakte, gelegaliseerd en vertaald waar nodig)." },
        { icon: "⚠️", text: "DVZ kijkt naar de band tussen ouder en kind: wie zorgt er voor het kind en wonen ouder en kind samen?" },
        { icon: "💶", text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag bij DVZ of de ambassade." },
      ],
      alternatives: [],
      cta: "Laat uw situatie beoordelen door een advocaat",
    };
  }

  // ── Ouder/grootouder meerderjarig: geen wettelijk recht op gezinshereniging ──
  if (gezinslid === "ouder") {
    return {
      status: "rood",
      emoji: "🔴",
      title: "Geen wettelijk recht op gezinshereniging",
      summary: "De Belgische Verblijfswet geeft (groot)ouders van een meerderjarige Belg geen recht op gezinshereniging. De wet voorziet dit recht voor echtgenoten, partners, kinderen en de ouders van een minderjarige Belg.",
      points: [
        { icon: "❌", text: "Er is geen wettelijk recht op gezinshereniging voor (groot)ouders van een meerderjarige Belg. DVZ zal een klassieke aanvraag weigeren." },
        { icon: "📌", text: "Bent u de meerderjarige ouder van een meerderjarig kind? Dan biedt artikel 9bis of een humanitair visum soms een alternatief. Een advocaat beoordeelt uw situatie." },
        { icon: "💡", text: "In humanitaire gevallen (ernstige ziekte, noodsituatie) bestaan er andere wegen. Een advocaat beoordeelt welke weg voor uw situatie het meest kansrijk is." },
      ],
      alternatives: [
        {
          icon: "🤝",
          title: "Humanitair visum (type D)",
          text: "Als uw ouder ernstig ziek is of in een kwetsbare situatie verkeert, kan een humanitair visum aangevraagd worden via de ambassade. Dit is een discretionaire beslissing van de overheid.",
        },
        {
          icon: "📋",
          title: "Artikel 9bis: bijzondere omstandigheden",
          text: "Via artikel 9bis van de Verblijfswet kan verblijf worden aangevraagd op basis van buitengewone omstandigheden. Een advocaat beoordeelt of dit in uw situatie toepasbaar is.",
        },
        {
          icon: "⚖️",
          title: "Artikel 20 VWEU (Unierecht)",
          text: "In uitzonderlijke gevallen, wanneer er een bewezen afhankelijkheidsrelatie bestaat, kan Unierecht een verblijfsrecht openen. Dit is een complexe procedure die juridisch advies vereist.",
        },
      ],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Ander familielid: geen wettelijk recht op gezinshereniging ──
  if (gezinslid === "ander-familielid") {
    return {
      status: "rood",
      emoji: "🔴",
      title: "Geen wettelijk recht op gezinshereniging",
      summary: "De Belgische Verblijfswet geeft broers, zussen, neven, nichten en andere familieleden geen recht op gezinshereniging. De wet voorziet dit recht enkel voor echtgenoten, partners en kinderen.",
      points: [
        { icon: "❌", text: "Er is geen wettelijk recht op gezinshereniging voor dit type familielid. Een klassieke aanvraag bij DVZ zal worden geweigerd." },
        { icon: "📌", text: "In uitzonderlijke gevallen kan artikel 20 VWEU (Europees Unierecht) een oplossing bieden bij bewezen afhankelijkheid, maar dit is zeldzaam." },
        { icon: "💡", text: "Afhankelijk van uw concrete situatie kunnen er andere verblijfsopties zijn. Een advocaat beoordeelt welke weg voor u het meest kansrijk is." },
      ],
      alternatives: [
        {
          icon: "🤝",
          title: "Humanitair visum (type D)",
          text: "In geval van ernstige ziekte, noodsituatie of uitzonderlijke humanitaire omstandigheden kan een humanitair visum worden aangevraagd via de ambassade. Dit is een discretionaire beslissing.",
        },
        {
          icon: "📋",
          title: "Artikel 9bis: bijzondere omstandigheden",
          text: "Via artikel 9bis van de Verblijfswet kan verblijf worden aangevraagd op basis van buitengewone omstandigheden. Een advocaat beoordeelt of dit in uw situatie toepasbaar is.",
        },
        {
          icon: "🎓",
          title: "Studentenvisum of arbeidsvisum",
          text: "Als uw familielid wil studeren of werken in België, zijn er specifieke visa voor dat doel. Dit staat volledig los van gezinshereniging.",
        },
        {
          icon: "✈️",
          title: "Kort verblijf (max. 90 dagen)",
          text: "Uw familielid kan u bezoeken met een toeristenvisum voor maximaal 90 dagen. Dit is geen verblijfsrecht, maar kan tijd geven om alternatieven te onderzoeken.",
        },
      ],
      cta: "Bespreek uw opties met een advocaat",
    };
  }

  // ── Meerderjarig kind: 'ten laste'-vereiste ──
  if (gezinslid === "kind-18") {
    if (inkomen === "geen-werk") {
      return {
        status: "oranje",
        emoji: "🟡",
        title: "Inkomen én 'ten laste'-bewijs zijn aandachtspunten",
        summary: "Voor een meerderjarig kind gelden strengere regels. U moet zowel voldoende inkomen aantonen als bewijzen dat uw kind materieel afhankelijk van u is in zijn of haar land van herkomst.",
        points: [
          { icon: "⚠️", text: "Leefloon en OCMW-uitkering tellen niet mee als bewijs van voldoende inkomen bij DVZ." },
          { icon: "📌", text: "Naast inkomen moet u ook aantonen dat uw kind 'ten laste' is: materieel afhankelijk van uw steun in het buitenland." },
          { icon: "💡", text: "Via een behoefteanalyse kunt u uw volledige financiële situatie toelichten. De bewijslast ligt volledig bij u." },
        ],
        alternatives: [
          {
            icon: "📋",
            title: "Behoefteanalyse indienen",
            text: "Als uw inkomen onder de grens ligt, kunt u via een behoefteanalyse aantonen dat uw gezin niet ten laste van de overheid valt. U onderbouwt dit met al uw inkomsten én vaste uitgaven.",
          },
          {
            icon: "💼",
            title: "Wachten tot u werk heeft",
            text: "Zodra u een stabiel loon heeft boven €2.217,47 netto/maand, staat u veel sterker. Een inkomenseis én 'ten laste'-bewijs samen zijn haalbaar met een goed dossier.",
          },
        ],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Mogelijk, maar u moet 'ten laste' bewijzen",
      summary: "Voor een meerderjarig kind gelden andere regels dan voor minderjarige kinderen. Uw kind moet aantoonbaar 'ten laste' zijn: materieel afhankelijk van u in zijn of haar land van herkomst.",
      points: [
        { icon: "📌", text: "'Ten laste' betekent dat uw kind voor zijn/haar basisbehoeften (huur, voeding) afhankelijk is van uw financiële steun in het buitenland." },
        { icon: inkomen === "werk-voldoende" ? "✅" : "⚠️", text: inkomen === "werk-voldoende" ? "Uw inkomen lijkt voldoende, dat is een goede basis." : inkomen === "werk-twijfel" ? "Uw inkomen is een aandachtspunt. Onder €2.217,47 netto/maand moet DVZ eerst een behoefteanalyse maken." : inkomen === "werkloosheidsuitkering" ? "Uw werkloosheidsuitkering telt mee als u actief werk zoekt. Laat dit goed documenteren." : "Als zelfstandige bewijst u uw inkomen met specifieke fiscale en sociale documenten." },
        { icon: "📋", text: "U moet concrete bewijzen aanleveren van de afhankelijkheid: geldoverschrijvingen, verklaringen, bewijs dat uw kind geen eigen inkomen heeft in het buitenland." },
        { icon: "💶", text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag." },
        { icon: "💡", text: "Een advocaat helpt u beoordelen of uw kind aan de 'ten laste'-definitie voldoet en welke bewijsstukken het sterkst staan." },
      ],
      alternatives: [],
      cta: "Laat uw situatie vrijblijvend beoordelen door een advocaat",
    };
  }

  // ── Minderjarig kind — alleen het kind ──
  if (gezinslid === "kind-min" && kindExtra === "alleen-kind") {
    if (kindVoogdij === "ex") {
      return {
        status: "oranje",
        emoji: "🟡",
        title: "Mogelijk, maar de voogdijsituatie is een aandachtspunt",
        summary: "Als de andere ouder voornamelijk de zorg heeft, is de kans op weigering groter. DVZ vereist bewijs van uw ouderlijk gezag of een schriftelijke toestemming van de andere ouder.",
        points: [
          { icon: "⚠️", text: "U moet het ouderlijk gezag hebben. Delen u en de andere ouder het gezag, dan moet de andere ouder schriftelijk toestemming geven dat het kind in België bij u komt wonen." },
          { icon: "✅", text: "Er is geen inkomenseis: voor een minderjarig kind dat alleen overkomt, hoeft u geen minimuminkomen aan te tonen." },
          { icon: "📋", text: "Een geboorteakte (gelegaliseerd en vertaald waar nodig) en eventueel een rechterlijke beslissing over het ouderlijk gezag versterken uw dossier sterk." },
          { icon: "✅", text: "Geen retributie: wie jonger is dan 18, betaalt die nooit." },
        ],
        alternatives: [],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "groen",
      emoji: "🟢",
      title: "U komt waarschijnlijk in aanmerking",
      summary: "Voor een minderjarig kind dat alleen overkomt, is er géén inkomenseis. Op basis van uw antwoorden voldoet u aan de basisvoorwaarden.",
      points: [
        { icon: "✅", text: "Geen inkomenseis: als het enkel om uw minderjarig kind gaat, hoeft u geen minimuminkomen aan te tonen bij DVZ." },
        { icon: "✅", text: kindVoogdij === "ik-alleen" ? "U heeft het ouderlijk gezag, dat is de sterkste positie voor uw aanvraag." : "Bij gedeeld gezag is een schriftelijke toestemming van de andere ouder nodig." },
        { icon: "📋", text: "U heeft wel een bewijs van afstamming nodig (geboorteakte, gelegaliseerd en vertaald waar nodig) en een bewijs van huisvesting en ziekteverzekering." },
        { icon: "✅", text: "Geen retributie: wie jonger is dan 18, betaalt die nooit." },
        { icon: "💡", text: "Laat uw dossier nakijken om fouten te voorkomen. Een ontbrekend of fout document kan uw aanvraag ernstig vertragen." },
      ],
      alternatives: [],
      cta: "Laat uw dossier vrijblijvend nakijken door een advocaat",
    };
  }

  // ── Partner, nog niet gehuwd of geregistreerd ──
  if (gezinslid === "partner-toekomst") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Eerst trouwen of een partnerschap registreren",
      summary: "Een relatie zonder huwelijk of geregistreerd partnerschap geeft geen recht op gezinshereniging als partner. Er zijn wel wegen om dat te regelen, in België of in het buitenland.",
      points: [
        { icon: "📌", text: "Wilt u in België trouwen of wettelijk samenwonen en daarna gezinshereniging aanvragen? Dan vraagt uw partner daarvoor een specifiek visum D aan bij de Belgische ambassade." },
        { icon: "📌", text: "Trouwt u in het buitenland? Dan gelden de regels van dat land, en moet het huwelijk in België erkend worden." },
        { icon: "⚠️", text: "Kiest u voor een geregistreerd partnerschap, dan moet u later ook een duurzame relatie bewijzen." },
      ],
      alternatives: [],
      cta: "Bespreek de beste weg met een advocaat",
    };
  }

  if (gezinslid === "partner-niet-gehuwd" && relatie === "geen") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "De duurzaamheid van uw relatie is het aandachtspunt",
      summary: "Als geregistreerde partner moet u bewijzen dat uw relatie duurzaam en stabiel is. Op basis van uw antwoord voldoet u (nog) niet aan een van de drie situaties uit de wet.",
      points: [
        { icon: "📋", text: "De wet aanvaardt: 1 jaar onafgebroken samenwonen, of elkaar 2 jaar kennen met regelmatig contact en minstens 3 ontmoetingen van samen 45 dagen, of een gemeenschappelijk kind." },
        { icon: "💡", text: "Ook andere bewijzen kunnen meetellen, zoals een gezamenlijke lening voor een woning. Laat nagaan wat u wel kunt aantonen." },
        { icon: "📌", text: "Bij een huwelijk hoeft u de duurzaamheid van de relatie niet te bewijzen." },
      ],
      alternatives: [],
      cta: "Laat uw situatie beoordelen door een advocaat",
    };
  }

  if (leeftijdPartner === "nee") {
    return {
      status: "rood",
      emoji: "🔴",
      title: "Op dit moment komt u niet in aanmerking",
      summary: "Geregistreerde partners van een Belg moeten beiden ouder zijn dan 21 jaar, of ouder dan 18 als ze al 1 jaar samenwoonden voor de partner in België aankwam.",
      points: [
        { icon: "❌", text: "Een van u beiden voldoet nu niet aan de leeftijdsvoorwaarde." },
        { icon: "📌", text: "Bij een huwelijk met een Belg geldt vandaag een minimumleeftijd van 18 jaar. Voor aanvragen vanaf 18 augustus 2027 wordt dat 21 jaar." },
      ],
      alternatives: [],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Leeftijdseis gehuwde partner ──
  if (leeftijd && leeftijd !== "ja") {
    return {
      status: "rood",
      emoji: "🔴",
      title: "Op dit moment komt u niet in aanmerking",
      summary: "Voor gezinshereniging met een Belg als echtgenoot moeten beide partners ouder zijn dan 18 jaar op het moment van de aanvraag (art. 40ter Verblijfswet).",
      points: [
        { icon: "❌", text: "Een of beide partners is jonger dan 18 jaar." },
        { icon: "📌", text: "De leeftijdseis staat in de wet en kan niet worden omzeild." },
      ],
      alternatives: [
        {
          icon: "⏳",
          title: "Wachten tot u beiden 18 bent",
          text: "Dit is de eenvoudigste en meest zekere oplossing. Zodra de jongste partner 18 is, kunt u de aanvraag indienen.",
        },
        {
          icon: "✈️",
          title: "Kort verblijf (max. 90 dagen)",
          text: "Uw partner kan u bezoeken met een visum voor kort verblijf van maximaal 90 dagen. Dit is geen verblijfsrecht, maar geeft u wel tijd.",
        },
      ],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Inkomenstests (partner of kind-min met andere gezinsleden) ──
  if (inkomen === "geen-werk") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Uw inkomen is een aandachtspunt, maar geen automatische weigering",
      summary: "Leefloon en OCMW-uitkering tellen niet mee voor gezinshereniging. Dat betekent niet dat u automatisch geweigerd wordt. Via een behoefteanalyse zijn er mogelijkheden. Laat uw situatie bekijken.",
      points: [
        { icon: "⚠️", text: "Leefloon en OCMW-uitkering tellen NIET mee als bewijs van voldoende inkomen bij DVZ." },
        { icon: "📌", text: "DVZ weigert niet automatisch: via een individuele behoefteanalyse (arrest Chakroun) kunt u op andere manieren aantonen dat uw gezin niet ten laste van de overheid valt." },
        { icon: "💡", text: "Bij een behoefteanalyse kijkt DVZ naar uw volledige situatie: inkomsten, vaste uitgaven, toekomstige inkomsten, alimentatie, co-ouderschap, enz. De bewijslast ligt volledig bij u." },
        ...(kindVoogdij === "ex" ? [{ icon: "⚠️", text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
      ],
      alternatives: [
        {
          icon: "📋",
          title: "Behoefteanalyse aanvragen",
          text: "Als uw inkomen onder de grens ligt, kunt u een behoefteanalyse indienen. U toont aan de hand van al uw inkomsten én uitgaven (huur, facturen, verzekeringen...) dat uw gezin niet ten laste valt van de overheid.",
        },
        {
          icon: "💼",
          title: "Wachten tot u werk heeft",
          text: "Zodra u een stabiel loon heeft boven €2.217,47 netto/maand, kunt u de aanvraag indienen. Dit is de meest gebruikte weg en geeft de sterkste positie.",
        },
        {
          icon: "🤝",
          title: "Humanitair visum",
          text: "In uitzonderlijke situaties (ernstige ziekte, noodsituatie) kan een humanitair visum aangevraagd worden. Dit staat los van de inkomenseis.",
        },
        {
          icon: "👨‍👩‍👧",
          title: "Andere referentiepersoon",
          text: "Als een ander familielid in België wél voldoet aan de inkomenseis, kan die persoon de aanvraag indienen.",
        },
      ],
      cta: "Bespreek uw situatie vrijblijvend met een advocaat",
    };
  }

  if (inkomen === "werkloosheidsuitkering") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Werkloosheidsuitkering telt mee, maar aandacht is nodig",
      summary: "Een werkloosheidsuitkering telt in principe mee als inkomen voor gezinshereniging, op voorwaarde dat u aantoonbaar actief werk zoekt. DVZ beoordeelt dit echter nauwkeurig.",
      points: [
        { icon: "✅", text: "Een werkloosheidsuitkering telt mee bij DVZ, maar enkel als u aantoonbaar actief werk zoekt (inschrijving VDAB/Forem, bewijs van sollicitaties)." },
        { icon: "⚠️", text: "De uitkering moet boven de inkomensgrens van €2.217,47 netto/maand liggen. Ligt ze daaronder, dan gelden dezelfde regels als bij onvoldoende inkomen." },
        { icon: "📌", text: "DVZ kijkt ook naar de stabiliteit en duurzaamheid van uw inkomen. Een dalend bedrag of korte periode van uitkering kan een negatief signaal zijn." },
        { icon: "💡", text: "Een behoefteanalyse kan helpen als uw uitkering net niet voldoende is. Laat uw situatie beoordelen." },
        ...(kindVoogdij === "ex" ? [{ icon: "⚠️", text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
      ],
      alternatives: [],
      cta: "Laat uw inkomen vrijblijvend beoordelen door een advocaat",
    };
  }

  // ── Inkomen twijfelachtig of zelfstandige ──
  if (inkomen === "werk-twijfel" || inkomen === "zelfstandige") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Mogelijk in aanmerking, uw inkomen is het aandachtspunt",
      summary: "Op basis van uw antwoorden kunt u mogelijk in aanmerking komen. DVZ kijkt heel nauwkeurig naar uw inkomen. Een screening door een advocaat is sterk aangeraden.",
      points: [
        { icon: "⚠️", text: inkomen === "zelfstandige" ? "Als zelfstandige toont u uw inkomen aan met specifieke fiscale en sociale documenten. Loonfiches die u zelf als zaakvoerder uitreikt, volstaan op zich niet." : "Het referentiebedrag is €2.217,47 netto/maand. Ook het stabiele inkomen van uw partner kan meetellen." },
        { icon: "📌", text: "Ligt uw inkomen net onder de grens? Dat is geen automatische weigering. Via een individuele behoefteanalyse kunt u uw volledige situatie toelichten." },
        { icon: "✅", text: (gezinslid === "partner" || gezinslid === "partner-niet-gehuwd") ? "Uw leeftijd en relatie lijken in orde te zijn." : "Het type gezinslid is in principe toegestaan." },
        { icon: "💶", text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag." },
        { icon: "💡", text: "Bij een behoefteanalyse kijkt DVZ naar al uw inkomsten én uitgaven. De bewijslast ligt volledig bij u als aanvrager." },
        ...(kindVoogdij === "ex" ? [{ icon: "⚠️", text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
      ],
      alternatives: [],
      cta: "Laat uw inkomen vrijblijvend nakijken door een advocaat",
    };
  }

  // ── Groen: basisvoorwaarden lijken vervuld ──
  return {
    status: "groen",
    emoji: "🟢",
    title: "U komt waarschijnlijk in aanmerking",
    summary: "Goed nieuws! Op basis van uw antwoorden voldoet u aan de basisvoorwaarden voor gezinshereniging in België.",
    points: [
      { icon: "✅", text: "Uw inkomen lijkt voldoende (€2.217,47 netto/maand of meer)." },
      { icon: "✅", text: gezinslid === "partner" ? "U bent beiden ouder dan 18 jaar, de leeftijdseis is in orde." : gezinslid === "partner-niet-gehuwd" ? "U kunt een duurzame relatie aantonen en voldoet aan de leeftijdseis." : "Het type gezinslid valt binnen de toegestane categorieën." },
      { icon: "📋", text: "U heeft ook een bewijs van huisvesting en ziekteverzekering nodig." },
      { icon: "💶", text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag." },
      { icon: "⚠️", text: "DVZ controleert uw dossier heel grondig. Een ontbrekend document of fout in uw loonfiche kan leiden tot weigering." },
      { icon: "💡", text: "Laat uw dossier eerst vrijblijvend nakijken om vermijdbare fouten te voorkomen." },
      ...(kindVoogdij === "ex" ? [{ icon: "⚠️", text: "Aandachtspunt: de voogdijsituatie van uw kind vereist extra documentatie (toestemming andere ouder)." }] : []),
    ],
    alternatives: [],
    cta: "Laat uw dossier vrijblijvend nakijken door een advocaat",
  };
}

const statusColors = {
  groen: {
    bg: "bg-green-50",
    border: "border-green-400",
    badge: "bg-green-100 text-green-800 border-green-300",
    icon: "text-green-600",
  },
  oranje: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: "text-yellow-600",
  },
  rood: {
    bg: "bg-red-50",
    border: "border-red-400",
    badge: "bg-red-100 text-red-800 border-red-300",
    icon: "text-red-600",
  },
};

function ContactForm({ result, answers }) {
  const [form, setForm] = useState({ naam: "", voornaam: "", email: "", telefoon: "", fase: "", toelichting: "", privacy: false });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.naam.trim()) e.naam = "Naam is verplicht";
    if (!form.voornaam.trim()) e.voornaam = "Voornaam is verplicht";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Geldig e-mailadres verplicht";
    if (!form.telefoon.trim()) e.telefoon = "Telefoonnummer is verplicht";
    if (!form.fase) e.fase = "Selecteer een optie";
    if (!form.privacy) e.privacy = "U moet akkoord gaan met het privacybeleid";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const data = { ...form, result: result.status, answers, timestamp: new Date().toISOString() };
    localStorage.setItem("mgz_lead_" + Date.now(), JSON.stringify(data));
    console.log("[MijnGezinshereniging] Nieuw lead:", data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="mg-check" aria-hidden="true"></div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Dank u! Wij nemen vandaag nog contact op.</h3>
        <p className="text-green-700 text-sm leading-relaxed">
          Uw aanvraag is ontvangen. Een van onze advocaten neemt zo snel mogelijk contact met u op voor een vrijblijvende dossierbeoordeling.
        </p>
        <div className="mt-4 p-4 bg-white rounded-xl text-sm text-gray-600">
          <strong>Ondertussen kunt u alvast verzamelen:</strong>
          <ul className="mt-2 text-left space-y-1 list-disc list-inside">
            <li>Loonfiches van de laatste 3 maanden</li>
            <li>Aanslagbiljet (belastingbrief)</li>
            <li>Huurcontract of eigendomsakte</li>
            <li>Bewijs van relatie (huwelijksakte, geboorteakte, etc.)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
          <input
            type="text"
            value={form.naam}
            onChange={e => setForm({ ...form, naam: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.naam ? "border-red-400" : "border-gray-300"}`}
            placeholder="Familienaam"
          />
          {errors.naam && <p className="text-red-500 text-xs mt-1">{errors.naam}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam *</label>
          <input
            type="text"
            value={form.voornaam}
            onChange={e => setForm({ ...form, voornaam: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.voornaam ? "border-red-400" : "border-gray-300"}`}
            placeholder="Voornaam"
          />
          {errors.voornaam && <p className="text-red-500 text-xs mt-1">{errors.voornaam}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.email ? "border-red-400" : "border-gray-300"}`}
            placeholder="uw@email.be"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer *</label>
          <input
            type="tel"
            value={form.telefoon}
            onChange={e => setForm({ ...form, telefoon: e.target.value })}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.telefoon ? "border-red-400" : "border-gray-300"}`}
            placeholder="+32 4XX XX XX XX"
          />
          {errors.telefoon && <p className="text-red-500 text-xs mt-1">{errors.telefoon}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">In welke fase zit uw aanvraag? *</label>
        <select
          value={form.fase}
          onChange={e => setForm({ ...form, fase: e.target.value })}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.fase ? "border-red-400" : "border-gray-300"} bg-white`}
        >
          <option value="">Selecteer een optie...</option>
          <option value="nog-niet-begonnen">Ik moet nog beginnen</option>
          <option value="ingediend">Mijn aanvraag is al ingediend</option>
          <option value="weigering">Ik heb een weigering gekregen</option>
        </select>
        {errors.fase && <p className="text-red-500 text-xs mt-1">{errors.fase}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Uw situatie (optioneel)</label>
        <textarea
          value={form.toelichting}
          onChange={e => setForm({ ...form, toelichting: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
          placeholder="Vertel kort over uw specifieke situatie..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          checked={form.privacy}
          onChange={e => setForm({ ...form, privacy: e.target.checked })}
          className="mt-0.5 w-4 h-4 accent-primary-500"
        />
        <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
          Ik ga akkoord met de verwerking van mijn gegevens conform het{" "}
          <Link to="/privacy" className="text-primary-600 underline">privacybeleid</Link>. *
        </label>
      </div>
      {errors.privacy && <p className="text-red-500 text-xs -mt-2">{errors.privacy}</p>}

      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
      >
        Gegevens versturen, wij nemen contact op
      </button>
    </form>
  );
}

export default function Tool() {
  const location = useLocation();
  const preNationaliteit = location.state?.nationaliteit ?? null;

  const [currentQ, setCurrentQ] = useState(preNationaliteit ? "gezinslid" : "nationaliteit");
  const [answers, setAnswers] = useState(preNationaliteit ? { nationaliteit: preNationaliteit } : {});
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState(preNationaliteit ? ["nationaliteit"] : []);
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const question = QUESTIONS[currentQ];
  const progress = history.length + 1;
  const expectedSteps = getExpectedSteps(answers);

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (!selected) return;

    const newAnswers = { ...answers, [currentQ]: selected };
    setAnswers(newAnswers);
    setHistory([...history, currentQ]);

    const nextQ = question.next(newAnswers);
    if (!nextQ) {
      const r = calculateResult(newAnswers);
      setResult(r);
      setCurrentQ(null);
    } else {
      setCurrentQ(nextQ);
      setSelected(null);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newAnswers = { ...answers };
    delete newAnswers[currentQ || "result"];
    setHistory(newHistory);
    setCurrentQ(prev);
    setSelected(answers[prev]);
    setAnswers(newAnswers);
    setResult(null);
    setShowForm(false);
  };

  const handleReset = () => {
    setCurrentQ("nationaliteit");
    setAnswers({});
    setSelected(null);
    setHistory([]);
    setResult(null);
    setShowForm(false);
  };

  const colors = result ? statusColors[result.status] : null;

  return (
    <div className="bg-primary-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Situatiecheck
          </h1>
          <p className="text-gray-500 text-base">
            Kom ik in aanmerking voor gezinshereniging? Beantwoord een paar vragen en zie het meteen.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 text-xs text-yellow-800">
            ⚠️ Deze tool is indicatief en vormt geen juridisch advies
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Wizard */}
        {!result && question && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">{question.label}</span>
                <span className="text-xs text-gray-400">{progress} van {expectedSteps}</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: expectedSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full flex-1 transition-colors ${i < progress ? "bg-primary-500" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3">
              💡 {question.help}
            </p>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all text-sm ${
                    selected === opt.value
                      ? "border-primary-500 bg-primary-50 text-primary-900 font-semibold"
                      : "border-gray-200 bg-white text-gray-700 font-medium hover:border-primary-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected === opt.value ? "border-primary-500 bg-primary-500" : "border-gray-300"}`}>
                    {selected === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {history.length > 0 && (
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:border-gray-400 font-medium rounded-xl transition-colors text-sm"
                >
                  ← Terug
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  selected
                    ? "bg-primary-500 hover:bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selected && question.next({ ...answers, [currentQ]: selected }) === null ? "Bekijk resultaat →" : "Volgende vraag →"}
              </button>
            </div>
          </div>
        )}

        {/* Result Screen */}
        {result && (
          <div className="space-y-6">

            {/* Huwelijksprocedure: enkel voor partners die nog niet gehuwd of geregistreerd zijn */}
            {answers.gezinslid === "partner-toekomst" && (
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 sm:p-8">
                <div className="mb-4">
                  <h3 className="font-bold text-amber-900 text-base mb-2">⚠️ Eerste stap: de huwelijksprocedure</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Voordat u gezinshereniging kunt aanvragen, moeten u en uw partner eerst gehuwd zijn of een geregistreerd partnerschap hebben. Voor wie in België wil trouwen of wettelijk samenwonen met een partner uit het buitenland, bestaat een specifieke procedure.
                  </p>
                </div>
                <Link
                  to="/blog/trouwen-met-buitenlandse-partner"
                  className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm"
                >
                  Ik wil trouwen met iemand uit het buitenland. Wat moet ik doen? →
                </Link>
              </div>
            )}

            {/* Result card */}
            <div className={`rounded-2xl border-2 p-6 sm:p-8 ${colors.bg} ${colors.border}`}>
              {answers.gezinslid === "partner-toekomst" && (
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">
                  Uw situatie nu
                </p>
              )}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-2 ${result.status === "groen" ? "bg-green-500" : result.status === "oranje" ? "bg-yellow-500" : "bg-red-500"}`}></div>
                <div>
                  <div className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border mb-2 ${colors.badge}`}>
                    {result.title}
                  </div>
                  <p className="text-gray-800 text-base leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-5">
                {result.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">{p.text}</p>
                  </div>
                ))}
              </div>

              {result.alternatives && result.alternatives.length > 0 && (
                <div className="mt-6 pt-5 border-t border-black/10">
                  <h3 className="font-bold text-gray-900 mb-3 text-base">
                    Wat kunt u wél doen?
                  </h3>
                  <div className="space-y-3">
                    {result.alternatives.map((alt, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="font-semibold text-gray-900 text-sm mb-1">{alt.title}</div>
                        <p className="text-gray-500 text-sm leading-relaxed">{alt.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:border-gray-400 font-medium rounded-xl transition-colors text-sm"
                >
                  Opnieuw beginnen
                </button>
              </div>
            </div>

            {/* Intake — altijd zichtbaar na resultaat */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-primary-700 px-6 py-5 text-white">
                <h2 className="text-lg font-bold mb-1">Laat uw dossier beoordelen door een advocaat</h2>
                <p className="text-green-100 text-sm">Neem contact op of boek meteen een afspraak.</p>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Optie 1: gegevens achterlaten */}
                <div className={`rounded-xl border-2 p-5 transition-all ${showForm ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-primary-300"}`}>
                  <div className="font-bold text-gray-900 mb-1 text-sm">Gegevens achterlaten</div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">Laat uw gegevens achter. Wij nemen zo snel mogelijk contact op.</p>
                  {!showForm ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                      Gegevens invullen →
                    </button>
                  ) : (
                    <span className="text-primary-600 text-xs font-medium">Vul het formulier hieronder in</span>
                  )}
                </div>

                {/* Optie 2: gesprek inplannen */}
                <div className="rounded-xl border-2 border-gray-200 hover:border-primary-300 p-5 transition-all">
                  <div className="font-bold text-gray-900 mb-1 text-sm">Gesprek inplannen</div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">Videocall van 30 minuten met een advocaat. U betaalt <strong>€75 excl. btw</strong>. Direct inboeken.</p>
                  <a
                    href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Gesprek inplannen (€75 excl. btw)
                  </a>
                </div>
              </div>

              {/* Inline form */}
              {showForm && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                  <p className="text-sm text-gray-500 mb-4">Vul uw gegevens in. Wij nemen vandaag nog contact op.</p>
                  <ContactForm result={result} answers={answers} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 bg-gray-100 rounded-xl p-5 text-xs text-gray-500 leading-relaxed">
          <div className="font-semibold text-gray-700 mb-2">⚠️ Juridische Disclaimer</div>
          <p>
            Deze online tool is louter <strong>INDICATIEF</strong> en gebaseerd op algemene criteria van de Belgische Verblijfswet
            (in het bijzonder artikelen 10 en 40ter) en de rechtspraak van het Hof van Justitie (arrest Chakroun). Deze tool vervangt <strong>geen</strong> officieel juridisch consult en
            vormt <strong>geen</strong> juridisch bindend advies. Er kunnen geen rechten aan de uitkomst worden ontleend.
            Elk dossier is uniek en DVZ maakt uiteindelijk de beslissing.
          </p>
          <p className="mt-2">
            Voor een volledige, juridisch verantwoorde beoordeling van uw dossier: neem contact op met onze advocaten.{" "}
            <Link to="/privacy" className="text-primary-600 underline">Lees het volledige privacybeleid</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}


