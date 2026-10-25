import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cleanPhone, isValidPhone } from "../lib/phone";
import { sendForm } from "../lib/sendForm";
import { useSeo, kruimels } from "../lib/seo";

const QUESTIONS = {
  nationaliteit: {
    id: "nationaliteit",
    label: "Stap 1",
    title: "Wat is uw nationaliteit of verblijfsstatuut?",
    help: "Het gaat om u, de persoon die al in België woont. Welke regels gelden, hangt af van uw nationaliteit of statuut.",
    options: [
      { value: "belg", label: "Ik ben Belg" },
      { value: "eu", label: "Ik ben EU-burger (of EER)" },
      { value: "niet-eu", label: "Ik heb een andere nationaliteit en een geldige verblijfskaart" },
      { value: "vluchteling", label: "Ik ben erkend vluchteling of subsidiair beschermd" },
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
    title: "Woonde u samen met uw gezinslid in een ander EU-land?",
    help: "Woonde u als Belg langer dan 3 maanden in een ander EU-land, bijvoorbeeld om er te werken of te studeren, en had u daar al een gezinsleven met het familielid dat nu wil overkomen? Dan gelden de soepelere Europese regels. Een vakantie of een verblijf zonder uw gezinslid telt niet.",
    options: [
      { value: "statisch", label: "Nee" },
      { value: "actief", label: "Ja, wij woonden daar samen en keerden daarna terug naar België" },
    ],
    next: (answers) => answers["belg-type"] === "actief" ? "eu-type" : "gezinslid",
  },
  "eu-type": {
    id: "eu-type",
    label: "Uw statuut",
    title: "Wat doet u in België?",
    help: "Wie in België werkt, zelfstandige is of actief werk zoekt, heeft de ruimste rechten. Voor studenten en wie van eigen middelen leeft, gelden beperkingen, bijvoorbeeld om ouders te laten overkomen.",
    options: [
      { value: "economisch-actief", label: "Ik werk, ben zelfstandige of zoek actief werk in België" },
      { value: "student", label: "Ik studeer aan een erkende onderwijsinstelling" },
      { value: "beschikker", label: "Ik leef van eigen middelen, bijvoorbeeld een pensioen" },
    ],
    next: () => "gezinslid-eu",
  },
  "gezinslid-eu": {
    id: "gezinslid-eu",
    label: "Stap 3",
    title: "Wie wilt u naar België halen?",
    help: "Voor familie van een EU-burger gelden de Europese regels. Voor uw partner en uw kinderen geldt in principe geen vast inkomensbedrag.",
    options: [
      { value: "eu-partner", label: "Mijn echtgenoot of echtgenote" },
      { value: "eu-geregistreerd", label: "Mijn geregistreerde partner (wettelijk samenwonend, niet gehuwd)" },
      { value: "eu-kind", label: "Mijn kind of stiefkind" },
      { value: "eu-ouder", label: "Mijn ouder, schoonouder of grootouder" },
      { value: "eu-ander", label: "Een ander familielid, zoals een broer, zus of niet-geregistreerde partner" },
    ],
    next: () => null,
  },
  gezinslid: {
    id: "gezinslid",
    label: "Stap 2",
    title: "Wie wilt u naar België halen?",
    help: "Voor elk gezinslid gelden andere voorwaarden. Kies wat het best bij uw situatie past.",
    options: [
      { value: "partner", label: "Mijn echtgenoot of echtgenote" },
      { value: "partner-niet-gehuwd", label: "Mijn geregistreerde partner (wettelijk samenwonend, niet gehuwd)" },
      { value: "partner-toekomst", label: "Mijn partner, maar wij zijn nog niet gehuwd of geregistreerd" },
      { value: "kind-min", label: "Mijn minderjarig kind (jonger dan 18)" },
      { value: "kind-18", label: "Mijn meerderjarig kind (18 jaar of ouder)" },
      { value: "ouder", label: "Mijn ouder of grootouder" },
      { value: "ander-familielid", label: "Een ander familielid, zoals een broer, zus, neef of nicht" },
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
    help: "Als geregistreerde partners moet u aantonen dat uw relatie duurzaam en stabiel is. Bij een huwelijk is dat niet nodig. Kies wat voor u geldt.",
    options: [
      { value: "samenwonen", label: "Wij woonden minstens 1 jaar onafgebroken samen vlak voor de aanvraag" },
      { value: "kennen", label: "Wij kennen elkaar minstens 2 jaar, hebben regelmatig contact en zagen elkaar minstens 3 keer, samen minstens 45 dagen" },
      { value: "kind", label: "Wij hebben samen een kind" },
      { value: "geen", label: "Geen van deze situaties" },
    ],
    next: () => "leeftijd-partner",
  },
  "leeftijd-partner": {
    id: "leeftijd-partner",
    label: "Stap 4",
    title: "Hoe oud zijn u en uw partner?",
    help: "Geregistreerde partners van een Belg moeten allebei minstens 21 jaar zijn. Woonde u al 1 jaar samen voor uw partner naar België kwam? Dan volstaat 18 jaar.",
    options: [
      { value: "ja", label: "Wij zijn allebei 21 jaar of ouder" },
      { value: "ja-18", label: "Een van ons is 18, 19 of 20 jaar, maar wij woonden al 1 jaar samen" },
      { value: "nee", label: "Een van ons is jonger dan 21 en wij woonden nog geen jaar samen" },
    ],
    next: () => "inkomen",
  },
  leeftijd: {
    id: "leeftijd",
    label: "Stap 3",
    title: "Zijn u en uw partner allebei minstens 18 jaar?",
    help: "Bent u gehuwd met een Belg, dan moeten u en uw partner allebei minstens 18 jaar zijn op het moment van de aanvraag. Voor aanvragen vanaf 18 augustus 2027 wordt dat 21 jaar.",
    options: [
      { value: "ja", label: "Ja, wij zijn allebei 18 jaar of ouder" },
      { value: "nee-ik", label: "Nee, ik ben jonger dan 18" },
      { value: "nee-partner", label: "Nee, mijn partner is jonger dan 18" },
    ],
    next: () => "inkomen",
  },
  "kind-voogdij": {
    id: "kind-voogdij",
    label: "Stap 3",
    title: "Wie heeft het ouderlijk gezag over uw kind?",
    help: "U moet het ouderlijk gezag hebben. Deelt u het gezag met de andere ouder, dan moet die schriftelijk toestemming geven dat het kind bij u in België komt wonen.",
    options: [
      { value: "ik-alleen", label: "Alleen ik" },
      { value: "samen", label: "De andere ouder en ik samen" },
      { value: "ex", label: "Vooral de andere ouder" },
    ],
    next: () => "kind-extra",
  },
  "bent-u-minderjarig": {
    id: "bent-u-minderjarig",
    label: "Stap 3",
    title: "Is de Belg bij wie de ouder komt wonen jonger dan 18 jaar?",
    help: "De Verblijfswet geeft een verblijfsrecht aan de vader of moeder van een minderjarig Belgisch kind. Voor ouders van een meerderjarige Belg bestaat dat recht niet.",
    options: [
      { value: "ja", label: "Ja, het gaat om een minderjarig Belgisch kind" },
      { value: "nee", label: "Nee, de Belg is 18 jaar of ouder" },
    ],
    next: () => null,
  },
  "kind-extra": {
    id: "kind-extra",
    label: "Stap 4",
    title: "Komen er ook andere gezinsleden mee naar België?",
    help: "Vraagt u alleen gezinshereniging voor uw minderjarig kind, dan geldt er geen inkomenseis. Komen ook uw partner of een meerderjarig kind mee? Dan geldt die eis wel.",
    options: [
      { value: "alleen-kind", label: "Nee, alleen mijn minderjarig kind" },
      { value: "ook-anderen", label: "Ja, ook mijn partner of een meerderjarig kind" },
    ],
    next: (answers) => answers["kind-extra"] === "alleen-kind" ? null : "inkomen",
  },
  inkomen: {
    id: "inkomen",
    label: "Stap 4",
    title: "Heeft u een stabiel en voldoende inkomen?",
    help: "Het referentiebedrag is €2.217,47 netto per maand (sinds 1 september 2026). Loon, pensioen en een werkloosheidsuitkering (als u actief werk zoekt) tellen mee, net als het stabiele inkomen van uw partner. Leefloon, OCMW-steun, kindergeld en een wachtuitkering tellen niet mee.",
    options: [
      { value: "werk-voldoende", label: "Ja, samen minstens €2.217,47 netto per maand" },
      { value: "werk-twijfel", label: "Nee, samen minder dan €2.217,47 netto per maand" },
      { value: "zelfstandige", label: "Ik ben zelfstandige" },
      { value: "werkloosheidsuitkering", label: "Ik krijg een werkloosheidsuitkering en zoek actief werk" },
      { value: "geen-werk", label: "Ik krijg een leefloon of steun van het OCMW, of heb geen inkomen" },
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
      title: "Uw situatie vraagt persoonlijk advies",
      summary: "Als erkend vluchteling of subsidiair beschermde heeft u in principe recht op gezinshereniging, maar de voorwaarden en procedure zijn sterk afhankelijk van uw beschermingsstatuut, het moment van uw aanvraag en de samenstelling van uw gezin. Een persoonlijk gesprek is aangewezen.",
      points: [
        { text: "Voor erkende vluchtelingen en subsidiair beschermden gelden eigen regels, op basis van de Verblijfswet en internationale verdragen." },
        { text: "Het moment waarop u de aanvraag indient na uw erkenning, kan een groot verschil maken voor de voorwaarden." },
        { text: "De precieze voorwaarden, zoals inkomen, huisvesting en welke familieleden mogen overkomen, verschillen per statuut. Een advocaat beoordeelt uw volledige situatie." },
      ],
      alternatives: [],
      cta: "Bespreek uw situatie met een advocaat",
    };
  }

  // ── Derdelander in België: te complex voor de tool ──
  if (nationaliteit === "niet-eu") {
    return {
      status: "oranje",
      title: "Uw situatie vraagt persoonlijk advies",
      summary: "Heeft u een andere nationaliteit en een verblijfskaart in België, dan hangen de regels af van uw verblijfsstatuut. De voorwaarden verschillen sterk van geval tot geval. Een persoonlijk gesprek is aangewezen.",
      points: [
        { text: "Het type verblijfskaart (A, B, C, D, F of F+) bepaalt mee welke voorwaarden en termijnen gelden." },
        { text: "Kreeg u uw verblijfsrecht vóór 18 augustus 2025? Dan geldt meestal het referentiebedrag van €2.217,47 netto per maand, zolang u aanvraagt vóór 18 augustus 2027. Kreeg u het op of na 18 augustus 2025? Dan gelden de nieuwe regels: €2.456,97 netto per maand, plus 10% per gezinslid ten laste, en een minimumleeftijd van 21 jaar voor partners." },
        { text: "Soms gelden gunstigere Europese regels. Dat moet geval per geval bekeken worden." },
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
      ? [{ text: isStudent ? "Als student moet u ook bewijzen dat u genoeg bestaansmiddelen heeft en dat uw gezinslid een ziekteverzekering heeft die alle risico's in België dekt." : "U moet bewijzen dat u genoeg eigen middelen heeft en dat uw gezinslid een ziekteverzekering heeft die alle risico's in België dekt." }]
      : [];

    if (gezinslidEu === "eu-partner") {
      return {
        status: "groen",
        title: "U komt waarschijnlijk in aanmerking",
        summary: "Als EU-burger, of als Belg die samen met uw partner in een ander EU-land woonde, mag u uw echtgenoot of echtgenote naar België halen volgens de Europese regels. Werkt u of zoekt u werk, dan geldt er geen inkomensvoorwaarde.",
        points: [
          { text: "Nodig: een geldig paspoort van uw partner, de huwelijksakte (gelegaliseerd en vertaald waar nodig) en een bewijs van uw verblijfsrecht in België." },
          ...extraVereisten,
          { text: "DVZ kan nagaan of het om een schijnhuwelijk gaat. Bewijzen van uw relatie, zoals foto's, berichten en gezamenlijke reizen, versterken uw dossier." },
          { text: "Geen retributie: familieleden van een EU-burger of van een Belg die zijn recht op vrij verkeer gebruikte, betalen die niet." },
        ],
        alternatives: [],
        cta: "Laat uw dossier nakijken door een advocaat",
      };
    }

    if (gezinslidEu === "eu-geregistreerd") {
      return {
        status: "oranje",
        title: "Mogelijk in aanmerking, maar bewijs van duurzame relatie is vereist",
        summary: "Een geregistreerde partner van een EU-burger heeft recht op gezinshereniging, als u een duurzame en stabiele relatie kunt bewijzen. Er geldt geen vast inkomensbedrag, maar DVZ kijkt streng naar de bewijzen.",
        points: [
          { text: "Er geldt geen vast inkomensbedrag." },
          { text: "U bewijst een duurzame relatie met 1 jaar onafgebroken samenwonen, of 2 jaar elkaar kennen met minstens 3 ontmoetingen van samen 45 dagen, of een gemeenschappelijk kind." },
          { text: "U bent allebei minstens 21 jaar, of minstens 18 jaar als u al 1 jaar samenwoonde voor uw partner naar België kwam." },
          { text: "Nodig: de akte van het geregistreerd partnerschap (gelegaliseerd en vertaald waar nodig) en een bewijs van het verblijfsrecht van de EU-burger in België." },
          ...extraVereisten,
          { text: "DVZ beoordeelt of uw relatie voldoende duurzaam en stabiel is. Zorg voor sterke bewijzen." },
          { text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw situatie beoordelen door een advocaat",
      };
    }

    if (gezinslidEu === "eu-kind") {
      return {
        status: "groen",
        title: "U komt waarschijnlijk in aanmerking",
        summary: "Kinderen van een EU-burger hebben recht op gezinshereniging volgens de Europese regels. Een kind jonger dan 21 jaar hoeft niet ten laste te zijn.",
        points: [
          { text: "Is uw (stief)kind jonger dan 21? Dan hoeft u niet te bewijzen dat het ten laste is. Vanaf 21 jaar moet u aantonen dat het in het herkomstland financieel afhankelijk is van u." },
          { text: "Nodig: de geboorteakte of adoptieakte (gelegaliseerd en vertaald waar nodig) en een bewijs van uw verblijfsrecht in België." },
          ...extraVereisten,
          { text: "Is uw kind minderjarig en deelt u het gezag met de andere ouder? Dan is een schriftelijke toestemming van de andere ouder nodig." },
          { text: "Een ontbrekend of fout document kan uw aanvraag ernstig vertragen. Laat uw dossier eerst nakijken." },
          { text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw dossier nakijken door een advocaat",
      };
    }

    if (gezinslidEu === "eu-ouder") {
      if (isStudent) {
        return {
          status: "rood",
          title: "Geen recht op gezinshereniging als EU-student",
          summary: "Als student uit de EU mag u uw ouders of grootouders niet via gezinshereniging naar België halen. Voor studenten geldt dat recht alleen voor een partner en kinderen.",
          points: [
            { text: "De Verblijfswet sluit gezinshereniging met ouders en grootouders uitdrukkelijk uit voor studenten." },
            { text: "Gaat u na uw studies werken of wordt u zelfstandige? Dan gelden ruimere regels." },
            { text: "In uitzonderlijke situaties kan een humanitair visum een uitweg bieden." },
          ],
          alternatives: [
            { title: "Na uw studies", text: "Zodra u werkt of zelfstandige bent, kunt u uw ouders of grootouders wel laten overkomen, als u bewijst dat zij ten laste van u zijn." },
            { title: "Humanitair visum (type D)", text: "In bijzondere omstandigheden (ernstige ziekte, noodsituatie) kan een humanitair visum worden aangevraagd bij de Belgische ambassade. Dit is een discretionaire beslissing." },
          ],
          cta: "Bespreek uw situatie met een advocaat",
        };
      }
      return {
        status: "oranje",
        title: "Mogelijk, als uw familielid ten laste van u is",
        summary: "Een ouder, schoonouder of grootouder van een EU-burger heeft recht op gezinshereniging als die in het land van herkomst financieel afhankelijk is van u of uw partner.",
        points: [
          { text: "'Ten laste' betekent dat uw familielid voor zijn of haar basisbehoeften afhankelijk is van uw geld. Dat moet u bewijzen." },
          { text: "Nodig: een bewijs van de familieband (zoals een geboorteakte), bewijzen dat u uw familielid onderhoudt (zoals overschrijvingen) en een bewijs van uw verblijfsrecht in België." },
          ...extraVereisten,
          { text: "DVZ kijkt streng naar die financiële afhankelijkheid. Een hechte band of de wens om samen te wonen volstaat niet." },
          { text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw situatie beoordelen door een advocaat",
      };
    }

    if (gezinslidEu === "eu-ander") {
      return {
        status: "oranje",
        title: "Mogelijk, in vier uitzonderlijke situaties",
        summary: "Andere familieleden van een EU-burger, zoals broers, zussen of een partner zonder registratie, hebben geen automatisch recht op gezinshereniging. Toch is verblijf in vier situaties mogelijk. DVZ beoordeelt dat geval per geval.",
        points: [
          { text: "U heeft een bewezen duurzame relatie met de EU-burger, maar bent geen geregistreerde partner." },
          { text: "U bent in het land van herkomst financieel afhankelijk van de EU-burger." },
          { text: "U woonde in het land van herkomst in het gezin van de EU-burger." },
          { text: "U heeft ernstige gezondheidsproblemen en de EU-burger moet persoonlijk voor u zorgen." },
          { text: "DVZ heeft hier veel beoordelingsruimte. Laat uw kansen daarom goed inschatten." },
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
      title: "Mogelijk: de ouder van een minderjarige Belg kan verblijf aanvragen",
      summary: "De Verblijfswet voorziet een verblijfsrecht voor de vader of moeder van een minderjarig Belgisch kind. De ouder moet het kind begeleiden of zich bij het kind voegen. Daarnaast kan ook het Europees recht (art. 20 VWEU) een verblijfsrecht openen als het kind zo afhankelijk is van de ouder dat het anders de EU zou moeten verlaten.",
      points: [
        { text: "Er geldt geen inkomenseis voor de ouder van een minderjarig Belgisch kind." },
        { text: "De ouder legt een identiteitsbewijs voor en een bewijs van afstamming (geboorteakte, gelegaliseerd en vertaald waar nodig)." },
        { text: "DVZ kijkt naar de band tussen ouder en kind: wie zorgt er voor het kind en wonen ouder en kind samen?" },
        { text: "U betaalt een retributie van €218 wanneer u de aanvraag indient." },
      ],
      alternatives: [],
      cta: "Laat uw situatie beoordelen door een advocaat",
    };
  }

  // ── Ouder/grootouder meerderjarig: geen wettelijk recht op gezinshereniging ──
  if (gezinslid === "ouder") {
    return {
      status: "rood",
      title: "Geen wettelijk recht op gezinshereniging",
      summary: "De Verblijfswet geeft ouders en grootouders van een meerderjarige Belg geen recht op gezinshereniging. Dat recht bestaat wel voor partners, kinderen en de ouders van een minderjarige Belg.",
      points: [
        { text: "Ouders en grootouders van een meerderjarige Belg hebben geen recht op gezinshereniging. DVZ zal een gewone aanvraag weigeren." },
        { text: "Soms is een humanitair visum of een aanvraag om humanitaire redenen (artikel 9bis) mogelijk." },
        { text: "Welke weg het meeste kans maakt, hangt af van uw situatie." },
      ],
      alternatives: [
        {
          title: "Humanitair visum (type D)",
          text: "Is uw ouder ernstig ziek of in een kwetsbare situatie? Dan kan een humanitair visum aangevraagd worden via de ambassade. De overheid beslist daar vrij over.",
        },
        {
          title: "Aanvraag om humanitaire redenen",
          text: "Wie al in België is, kan in buitengewone omstandigheden verblijf aanvragen via artikel 9bis van de Verblijfswet.",
        },
        {
          title: "Europees recht",
          text: "In uitzonderlijke gevallen, bij een sterke afhankelijkheid, kan het Europees recht een verblijfsrecht openen.",
        },
      ],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Ander familielid: geen wettelijk recht op gezinshereniging ──
  if (gezinslid === "ander-familielid") {
    return {
      status: "rood",
      title: "Geen wettelijk recht op gezinshereniging",
      summary: "De Verblijfswet geeft broers, zussen, neven, nichten en andere familieleden van een Belg geen recht op gezinshereniging.",
      points: [
        { text: "Een gewone aanvraag voor gezinshereniging zal DVZ weigeren." },
        { text: "Heel uitzonderlijk kan het Europees recht een oplossing bieden, bij een sterke afhankelijkheid." },
        { text: "Afhankelijk van uw situatie zijn er soms andere manieren om verblijf te krijgen." },
      ],
      alternatives: [
        {
          title: "Humanitair visum (type D)",
          text: "Bij ernstige ziekte of een noodsituatie kan een humanitair visum aangevraagd worden via de ambassade. De overheid beslist daar vrij over.",
        },
        {
          title: "Aanvraag om humanitaire redenen",
          text: "Wie al in België is, kan in buitengewone omstandigheden verblijf aanvragen via artikel 9bis van de Verblijfswet.",
        },
        {
          title: "Studeren of werken",
          text: "Wil uw familielid in België studeren of werken? Daarvoor bestaan aparte procedures, los van gezinshereniging.",
        },
        {
          title: "Kort verblijf (max. 90 dagen)",
          text: "Uw familielid kan u bezoeken met een visum voor kort verblijf, maximaal 90 dagen. Dat geeft geen verblijfsrecht.",
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
        title: "Uw inkomen en de afhankelijkheid van uw kind zijn aandachtspunten",
        summary: "Voor een meerderjarig kind gelden strengere regels. U moet een voldoende inkomen aantonen en bewijzen dat uw kind in het land van herkomst financieel afhankelijk is van u.",
        points: [
          { text: "Een leefloon en steun van het OCMW tellen niet mee als inkomen." },
          { text: "U moet ook aantonen dat uw kind ten laste is: dat het voor zijn levensonderhoud afhankelijk is van uw steun." },
          { text: "In een behoefteanalyse kunt u uw volledige financiële situatie toelichten. Lever zelf meteen alle bewijzen aan." },
        ],
        alternatives: [
          {
            title: "Behoefteanalyse indienen",
            text: "Ligt uw inkomen onder het bedrag? Dan toont u met een overzicht van al uw inkomsten en vaste uitgaven aan dat uw gezin rondkomt zonder steun van de overheid.",
          },
          {
            title: "Wachten tot u werk heeft",
            text: "Met een stabiel inkomen van minstens €2.217,47 netto per maand staat uw aanvraag veel sterker.",
          },
        ],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "oranje",
      title: "Mogelijk, als uw kind ten laste van u is",
      summary: "Voor een meerderjarig kind gelden strengere regels dan voor een minderjarig kind. Uw kind moet in het land van herkomst financieel afhankelijk zijn van u.",
      points: [
        { text: "'Ten laste' betekent dat uw kind voor basisbehoeften zoals huur en voeding afhankelijk is van uw geld." },
        { text: inkomen === "werk-voldoende" ? "Uw inkomen lijkt voldoende, dat is een goede basis." : inkomen === "werk-twijfel" ? "Uw inkomen is een aandachtspunt. Onder €2.217,47 netto per maand moet DVZ eerst bekijken wat uw gezin echt nodig heeft." : inkomen === "werkloosheidsuitkering" ? "Uw werkloosheidsuitkering telt mee als u bewijst dat u actief werk zoekt." : "Als zelfstandige bewijst u uw inkomen met specifieke fiscale en sociale documenten." },
        { text: "Bewijs die afhankelijkheid, bijvoorbeeld met overschrijvingen en documenten die tonen dat uw kind geen eigen inkomen heeft." },
        { text: "U betaalt een retributie van €218 wanneer u de aanvraag indient." },
        { text: "Welke bewijzen het sterkst zijn, hangt af van uw situatie." },
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
        title: "Mogelijk, maar het ouderlijk gezag is een aandachtspunt",
        summary: "Heeft vooral de andere ouder het gezag, dan is de kans op een weigering groter. U heeft het ouderlijk gezag of de schriftelijke toestemming van de andere ouder nodig.",
        points: [
          { text: "U moet het ouderlijk gezag hebben. Delen u en de andere ouder het gezag, dan moet de andere ouder schriftelijk toestemming geven dat het kind in België bij u komt wonen." },
          { text: "Voor een minderjarig kind dat alleen overkomt, geldt geen inkomenseis." },
          { text: "Een geboorteakte (gelegaliseerd en vertaald waar nodig) en eventueel een rechterlijke beslissing over het gezag maken uw dossier sterker." },
          { text: "Geen retributie: wie jonger is dan 18, betaalt die nooit." },
        ],
        alternatives: [],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "groen",
      title: "U komt waarschijnlijk in aanmerking",
      summary: "Voor een minderjarig kind dat alleen overkomt, geldt geen inkomenseis. Op basis van uw antwoorden lijkt u te voldoen aan de basisvoorwaarden.",
      points: [
        { text: "Er geldt geen inkomenseis als alleen uw minderjarig kind overkomt." },
        { text: kindVoogdij === "ik-alleen" ? "U heeft alleen het ouderlijk gezag. Dat is de sterkste positie." : "Bij gedeeld gezag is een schriftelijke toestemming van de andere ouder nodig." },
        { text: "U heeft wel een bewijs van afstamming nodig (geboorteakte, gelegaliseerd en vertaald waar nodig) en een bewijs van huisvesting en ziekteverzekering." },
        { text: "Geen retributie: wie jonger is dan 18, betaalt die nooit." },
        { text: "Een ontbrekend of fout document kan uw aanvraag sterk vertragen." },
      ],
      alternatives: [],
      cta: "Laat uw dossier vrijblijvend nakijken door een advocaat",
    };
  }

  // ── Partner, nog niet gehuwd of geregistreerd ──
  if (gezinslid === "partner-toekomst") {
    return {
      status: "oranje",
      title: "Eerst trouwen of een partnerschap registreren",
      summary: "Een relatie zonder huwelijk of geregistreerd partnerschap geeft geen recht op gezinshereniging als partner. Er zijn wel wegen om dat te regelen, in België of in het buitenland.",
      points: [
        { text: "Wilt u in België trouwen of wettelijk samenwonen en daarna gezinshereniging aanvragen? Dan vraagt uw partner daarvoor een speciaal visum D aan bij de Belgische ambassade." },
        { text: "Trouwt u in het buitenland? Dan gelden de regels van dat land, en moet het huwelijk in België erkend worden." },
        { text: "Kiest u voor een geregistreerd partnerschap, dan moet u later ook een duurzame relatie bewijzen." },
      ],
      alternatives: [],
      cta: "Bespreek de beste weg met een advocaat",
    };
  }

  if (gezinslid === "partner-niet-gehuwd" && relatie === "geen") {
    return {
      status: "oranje",
      title: "De duurzaamheid van uw relatie is het aandachtspunt",
      summary: "Als geregistreerde partners moet u bewijzen dat uw relatie duurzaam en stabiel is. Op basis van uw antwoord voldoet u nog niet aan een van de drie situaties uit de wet.",
      points: [
        { text: "De wet aanvaardt: 1 jaar onafgebroken samenwonen, of elkaar 2 jaar kennen met regelmatig contact en minstens 3 ontmoetingen van samen 45 dagen, of een gemeenschappelijk kind." },
        { text: "Ook andere bewijzen kunnen meetellen, zoals een gezamenlijke lening voor een woning. Laat nagaan wat u wel kunt aantonen." },
        { text: "Bij een huwelijk hoeft u de duurzaamheid van de relatie niet te bewijzen." },
      ],
      alternatives: [],
      cta: "Laat uw situatie beoordelen door een advocaat",
    };
  }

  if (leeftijdPartner === "nee") {
    return {
      status: "rood",
      title: "Op dit moment komt u niet in aanmerking",
      summary: "Geregistreerde partners van een Belg moeten allebei minstens 21 jaar zijn, of minstens 18 jaar als ze al 1 jaar samenwoonden voor de partner naar België kwam.",
      points: [
        { text: "Een van u beiden voldoet nu niet aan de leeftijdsvoorwaarde." },
        { text: "Bij een huwelijk met een Belg is de minimumleeftijd vandaag 18 jaar. Voor aanvragen vanaf 18 augustus 2027 wordt dat 21 jaar." },
      ],
      alternatives: [],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Leeftijdseis gehuwde partner ──
  if (leeftijd && leeftijd !== "ja") {
    return {
      status: "rood",
      title: "Op dit moment komt u niet in aanmerking",
      summary: "Bent u gehuwd met een Belg, dan moeten u en uw partner allebei minstens 18 jaar zijn op het moment van de aanvraag.",
      points: [
        { text: "Een van u beiden is jonger dan 18 jaar." },
        { text: "Van die leeftijdsgrens kan niet afgeweken worden." },
      ],
      alternatives: [
        {
          title: "Wachten tot u beiden 18 bent",
          text: "Zodra u allebei 18 jaar bent, kunt u de aanvraag indienen.",
        },
        {
          title: "Kort verblijf (max. 90 dagen)",
          text: "Uw partner kan u bezoeken met een visum voor kort verblijf, maximaal 90 dagen. Dat geeft geen verblijfsrecht.",
        },
      ],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Inkomenstests (partner of kind-min met andere gezinsleden) ──
  if (inkomen === "geen-werk") {
    return {
      status: "oranje",
      title: "Uw inkomen is een aandachtspunt, maar geen reden voor een automatische weigering",
      summary: "Een leefloon en steun van het OCMW tellen niet mee voor gezinshereniging. Toch mag DVZ uw aanvraag niet automatisch weigeren: eerst moet bekeken worden wat uw gezin echt nodig heeft.",
      points: [
        { text: "Een leefloon en steun van het OCMW tellen niet mee als inkomen." },
        { text: "In een behoefteanalyse kunt u aantonen dat uw gezin toch rondkomt zonder steun van de overheid." },
        { text: "DVZ kijkt dan naar uw volledige situatie, zoals inkomsten, vaste uitgaven en onderhoudsgeld. Lever zelf meteen alle bewijzen aan." },
        ...(kindVoogdij === "ex" ? [{ text: "Let ook op het ouderlijk gezag: u heeft de toestemming van de andere ouder nodig." }] : []),
      ],
      alternatives: [
        {
          title: "Een behoefteanalyse",
          text: "Ligt uw inkomen onder het bedrag? Toon dan met al uw inkomsten en uitgaven, zoals huur, facturen en verzekeringen, aan dat uw gezin rondkomt.",
        },
        {
          title: "Wachten tot u werk heeft",
          text: "Met een stabiel inkomen van minstens €2.217,47 netto per maand staat uw aanvraag het sterkst.",
        },
        {
          title: "Humanitair visum",
          text: "Bij ernstige ziekte of een noodsituatie kan een humanitair visum aangevraagd worden. Daarvoor geldt de inkomenseis niet.",
        },
      ],
      cta: "Bespreek uw situatie vrijblijvend met een advocaat",
    };
  }

  if (inkomen === "werkloosheidsuitkering") {
    return {
      status: "oranje",
      title: "Uw werkloosheidsuitkering telt mee, onder voorwaarden",
      summary: "Een werkloosheidsuitkering telt mee als inkomen, op voorwaarde dat u bewijst dat u actief werk zoekt. DVZ kijkt daar nauwkeurig naar.",
      points: [
        { text: "Bewijs dat u actief werk zoekt, bijvoorbeeld met uw inschrijving bij de VDAB en uw sollicitaties." },
        { text: "Ligt de uitkering onder €2.217,47 netto per maand, dan gelden dezelfde regels als bij een te laag inkomen." },
        { text: "DVZ kijkt ook naar hoe stabiel uw inkomen is. Een dalend bedrag of een korte uitkeringsperiode kan in uw nadeel spelen." },
        { text: "Is uw uitkering net te laag, dan kan een behoefteanalyse helpen." },
        ...(kindVoogdij === "ex" ? [{ text: "Let ook op het ouderlijk gezag: u heeft de toestemming van de andere ouder nodig." }] : []),
      ],
      alternatives: [],
      cta: "Laat uw inkomen vrijblijvend beoordelen door een advocaat",
    };
  }

  // ── Inkomen twijfelachtig of zelfstandige ──
  if (inkomen === "werk-twijfel" || inkomen === "zelfstandige") {
    return {
      status: "oranje",
      title: "Mogelijk in aanmerking, uw inkomen is het aandachtspunt",
      summary: "Op basis van uw antwoorden komt u mogelijk in aanmerking. DVZ kijkt wel heel nauwkeurig naar uw inkomen.",
      points: [
        { text: inkomen === "zelfstandige" ? "Als zelfstandige toont u uw inkomen aan met specifieke fiscale en sociale documenten. DVZ publiceert een overzicht van de vereiste stukken." : "Het referentiebedrag is €2.217,47 netto per maand. Ook het stabiele inkomen van uw partner kan meetellen." },
        { text: "Ligt uw inkomen onder dat bedrag? Dan mag DVZ niet automatisch weigeren en moet eerst bekeken worden wat uw gezin nodig heeft." },
        { text: (gezinslid === "partner" || gezinslid === "partner-niet-gehuwd") ? "Uw leeftijd en relatie lijken in orde." : "Voor dit gezinslid is gezinshereniging in principe mogelijk." },
        { text: "U betaalt een retributie van €218 wanneer u de aanvraag indient." },
        { text: "DVZ kijkt dan naar al uw inkomsten en uitgaven. Lever zelf meteen alle bewijzen aan." },
        ...(kindVoogdij === "ex" ? [{ text: "Let ook op het ouderlijk gezag: u heeft de toestemming van de andere ouder nodig." }] : []),
      ],
      alternatives: [],
      cta: "Laat uw inkomen vrijblijvend nakijken door een advocaat",
    };
  }

  // ── Groen: basisvoorwaarden lijken vervuld ──
  return {
    status: "groen",
    title: "U komt waarschijnlijk in aanmerking",
    summary: "Op basis van uw antwoorden lijkt u te voldoen aan de basisvoorwaarden voor gezinshereniging in België.",
    points: [
      { text: "Uw inkomen lijkt voldoende: €2.217,47 netto per maand of meer." },
      { text: gezinslid === "partner" ? "U bent allebei minstens 18 jaar." : gezinslid === "partner-niet-gehuwd" ? "U kunt een duurzame relatie aantonen en voldoet aan de leeftijdseis." : "Voor dit gezinslid is gezinshereniging in principe mogelijk." },
      { text: "U heeft ook een bewijs van huisvesting en ziekteverzekering nodig." },
      { text: "U betaalt een retributie van €218 wanneer u de aanvraag indient." },
      { text: "DVZ controleert uw dossier grondig. Een ontbrekend of fout document kan tot een weigering leiden." },
            ...(kindVoogdij === "ex" ? [{ text: "Let op het ouderlijk gezag: u heeft de toestemming van de andere ouder nodig." }] : []),
    ],
    alternatives: [],
    cta: "Laat uw dossier vrijblijvend nakijken door een advocaat",
  };
}

const SHORT_LABELS = {
  nationaliteit: "Uw statuut",
  "belg-type": "Samen in een ander EU-land",
  "eu-type": "Uw situatie in België",
  "gezinslid-eu": "Wie komt over",
  gezinslid: "Wie komt over",
  relatie: "Duurzame relatie",
  "leeftijd-partner": "Leeftijd",
  leeftijd: "Leeftijd",
  "kind-voogdij": "Ouderlijk gezag",
  "kind-extra": "Andere gezinsleden",
  "bent-u-minderjarig": "Leeftijd van de Belg",
  inkomen: "Inkomen",
};

const STATUS_LABELS = {
  groen: "Waarschijnlijk in aanmerking",
  oranje: "Mogelijk, met aandachtspunten",
  rood: "Nu niet in aanmerking",
};

function answerLabel(questionId, value) {
  const opt = QUESTIONS[questionId]?.options.find((o) => o.value === value);
  return opt ? opt.label : value;
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mg-label">{label}</span>
      {children}
      {error && <span className="mg-field-error">{error}</span>}
    </label>
  );
}

function ContactForm({ result, answers }) {
  const [form, setForm] = useState({ naam: "", voornaam: "", email: "", telefoon: "", fase: "", toelichting: "", privacy: false });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [botField, setBotField] = useState("");

  const validate = () => {
    const e = {};
    if (!form.naam.trim()) e.naam = "Vul uw naam in";
    if (!form.voornaam.trim()) e.voornaam = "Vul uw voornaam in";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Vul een geldig e-mailadres in";
    if (!form.telefoon.trim()) e.telefoon = "Vul uw telefoonnummer in";
    else if (!isValidPhone(form.telefoon)) e.telefoon = "Vul een geldig telefoonnummer in, enkel cijfers";
    if (!form.fase) e.fase = "Kies een optie";
    if (!form.privacy) e.privacy = "Ga akkoord met het privacybeleid om verder te gaan";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Antwoorden leesbaar maken: vraag en gekozen antwoord in plaats van interne codes
    const antwoorden = Object.entries(answers).map(([id, value]) => {
      const q = QUESTIONS[id];
      const option = q?.options?.find((o) => o.value === value);
      return `${q?.title || id}: ${option?.label || value}`;
    }).join("\n");

    setSending(true);
    setSendError("");
    try {
      await sendForm("situatiecheck", {
        naam: form.naam, voornaam: form.voornaam, email: form.email, telefoon: form.telefoon,
        fase: form.fase, toelichting: form.toelichting, privacy: "akkoord",
        resultaat: `${STATUS_LABELS[result.status] || result.status}: ${result.title}`,
        antwoorden, "bot-field": botField,
      });
      setSubmitted(true);
    } catch (err) {
      setSendError("Uw gegevens konden niet verstuurd worden. Probeer het opnieuw, of mail naar");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-2">
        <div className="mg-check" aria-hidden="true"></div>
        <h3 className="mg-q-sub">Dank u, wij hebben uw gegevens goed ontvangen.</h3>
        <p className="mg-body mg-justify mt-3">
          Wij nemen zo snel mogelijk contact met u op. Ondertussen kunt u alvast deze documenten verzamelen:
        </p>
        <ul className="mg-points mt-5">
          <li>Bewijs van inkomen, bij voorkeur van de laatste 12 maanden</li>
          <li>Uw meest recente aanslagbiljet</li>
          <li>Huurcontract of eigendomsakte</li>
          <li>Bewijs van de familieband, zoals een huwelijksakte of geboorteakte</li>
        </ul>
      </div>
    );
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form name="situatiecheck" onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p hidden><label>Niet invullen: <input name="bot-field" value={botField} onChange={(e) => setBotField(e.target.value)} tabIndex={-1} autoComplete="off" /></label></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Naam" error={errors.naam}>
          <input type="text" autoComplete="family-name" value={form.naam} onChange={set("naam")} className={`mg-input ${errors.naam ? "is-invalid" : ""}`} />
        </Field>
        <Field label="Voornaam" error={errors.voornaam}>
          <input type="text" autoComplete="given-name" value={form.voornaam} onChange={set("voornaam")} className={`mg-input ${errors.voornaam ? "is-invalid" : ""}`} />
        </Field>
        <Field label="E-mailadres" error={errors.email}>
          <input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={`mg-input ${errors.email ? "is-invalid" : ""}`} />
        </Field>
        <Field label="Telefoonnummer" error={errors.telefoon}>
          <input type="tel" inputMode="tel" autoComplete="tel" value={form.telefoon} onChange={(e) => setForm((f) => ({ ...f, telefoon: cleanPhone(e.target.value) }))} className={`mg-input ${errors.telefoon ? "is-invalid" : ""}`} placeholder="+32470123456" />
        </Field>
      </div>

      <Field label="In welke fase zit uw aanvraag?" error={errors.fase}>
        <select value={form.fase} onChange={set("fase")} className={`mg-input ${errors.fase ? "is-invalid" : ""}`}>
          <option value="">Kies een optie</option>
          <option value="nog-niet-begonnen">Ik moet nog beginnen</option>
          <option value="ingediend">Mijn aanvraag is al ingediend</option>
          <option value="weigering">Ik heb een weigering gekregen</option>
        </select>
      </Field>

      <Field label="Uw situatie in het kort (niet verplicht)">
        <textarea value={form.toelichting} onChange={set("toelichting")} rows={4} className="mg-input resize-none" />
      </Field>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.privacy}
            onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
            className="mt-1 w-4 h-4 accent-[#A15C38] flex-shrink-0"
          />
          <span className="mg-body text-[0.92rem]">
            Ik ga akkoord met de verwerking van mijn gegevens volgens het{" "}
            <Link to="/privacy" className="underline underline-offset-2">privacybeleid</Link>.
          </span>
        </label>
        {errors.privacy && <span className="mg-field-error">{errors.privacy}</span>}
      </div>

      <p className="mg-disclaimer">Uw vraag wordt behandeld door een advocaat ingeschreven aan de balie West-Vlaanderen. U ontvangt de volledige gegevens van de advocaat in de eerste reactie, vóór er een opdracht is.</p>
      {sendError && <p className="mg-field-error" role="alert">{sendError} <a href="mailto:info@mijngezinshereniging.be" translate="no" className="notranslate underline">info@mijngezinshereniging.be</a>.</p>}
      <button type="submit" className="mg-btn mg-btn-rust" disabled={sending}>{sending ? "Bezig met versturen…" : "Verstuur mijn gegevens"}</button>
    </form>
  );
}

export default function Tool() {
  useSeo({
    path: "/tool",
    title: "Gratis situatiecheck gezinshereniging",
    description: "Beantwoord enkele vragen en ontdek in twee minuten of u in aanmerking komt voor gezinshereniging in België, en welke voorwaarden voor u gelden.",
    jsonLd: kruimels([{ naam: "Home", pad: "/" }, { naam: "Situatiecheck", pad: "/tool" }]),
  });

  const location = useLocation();
  const preNationaliteit = location.state?.nationaliteit ?? null;

  const [currentQ, setCurrentQ] = useState(preNationaliteit ? "gezinslid" : "nationaliteit");
  const [answers, setAnswers] = useState(preNationaliteit ? { nationaliteit: preNationaliteit } : {});
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState(preNationaliteit ? ["nationaliteit"] : []);
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const topRef = useRef(null);

  const question = QUESTIONS[currentQ];
  const progress = history.length + 1;
  const expectedSteps = Math.max(getExpectedSteps(answers), progress);
  const advancing = useRef(false);

  const scrollToTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChoose = (value) => {
    if (advancing.current) return;
    advancing.current = true;
    setSelected(value);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      handleNext(value);
      advancing.current = false;
    }, reduce ? 0 : 260);
  };

  const handleNext = (value) => {
    if (!value) return;
    const newAnswers = { ...answers, [currentQ]: value };
    setAnswers(newAnswers);
    setHistory([...history, currentQ]);

    const nextQ = question.next(newAnswers);
    if (!nextQ) {
      setResult(calculateResult(newAnswers));
      setCurrentQ(null);
    } else {
      setCurrentQ(nextQ);
      setSelected(newAnswers[nextQ] ?? null);
    }
    scrollToTop();
  };

  const goToStep = (index) => {
    const target = history[index];
    const kept = history.slice(0, index);
    const newAnswers = {};
    kept.forEach((q) => { newAnswers[q] = answers[q]; });
    setHistory(kept);
    setCurrentQ(target);
    setSelected(answers[target] ?? null);
    setAnswers(newAnswers);
    setResult(null);
    setShowForm(false);
    scrollToTop();
  };

  const handleBack = () => {
    if (history.length === 0) return;
    goToStep(history.length - 1);
  };

  const handleReset = () => {
    setCurrentQ("nationaliteit");
    setAnswers({});
    setSelected(null);
    setHistory([]);
    setResult(null);
    setShowForm(false);
    advancing.current = false;
    scrollToTop();
  };

  return (
    <div className="bg-white">
      {/* Kop */}
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 sm:py-9">
          <p className="mg-eyebrow mg-eyebrow-light mb-2">Situatiecheck</p>
          <h1 className="mg-tool-h1 text-white">Komt u in aanmerking voor <em>gezinshereniging</em>?</h1>
        </div>
      </section>

      <section ref={topRef} className="pt-8 pb-16 sm:pt-12 sm:pb-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Hoofdkolom */}
          <div className="lg:col-span-8">
            {!result && question && (
              <div key={currentQ} className="mg-fade">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="mg-eyebrow mb-0">Vraag {progress} van {expectedSteps}</p>
                </div>
                <div className="mg-progress mt-4" aria-hidden="true">
                  <span style={{ width: `${(progress / expectedSteps) * 100}%` }} />
                </div>

                <h2 className="mg-q-title mt-7">{question.title}</h2>
                <p className="mg-body mg-justify mt-3 max-w-2xl">{question.help}</p>

                <div className="mg-options mt-6" role="radiogroup" aria-label={question.title}>
                  {question.options.map((opt, i) => {
                    const isSel = selected === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={isSel}
                        onClick={() => handleChoose(opt.value)}
                        className={`mg-option ${isSel ? "is-selected" : ""}`}
                      >
                        <span className="mg-option-num">{String.fromCharCode(65 + i)}</span>
                        <span className="mg-option-label">{opt.label}</span>
                        <span className="mg-option-dot" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 min-h-[2rem]">
                  {history.length > 0 && (
                    <button type="button" onClick={handleBack} className="mg-textlink mg-textlink-back py-2">
                      <span aria-hidden="true">&larr;</span> Vorige vraag
                    </button>
                  )}
                </div>
              </div>
            )}

            {result && (
              <div className="mg-fade">
                <p className="mg-eyebrow mb-3">Uw resultaat</p>
                <p className={`mg-status mg-status-${result.status}`}>{STATUS_LABELS[result.status]}</p>
                <h2 className="mg-q-title mt-4">{result.title}</h2>
                <p className="mg-lead mg-justify mt-6">{result.summary}</p>

                {answers.gezinslid === "partner-toekomst" && (
                  <div className="mg-note mt-10">
                    <p className="mg-q-sub">Eerst trouwen of samenwonen</p>
                    <p className="mg-body mg-justify mt-2">
                      Voor wie in België wil trouwen of wettelijk samenwonen met een partner uit het buitenland, bestaat een specifieke procedure. Wij leggen de stappen uit in een apart artikel.
                    </p>
                    <Link to="/blog/trouwen-met-buitenlandse-partner" className="mg-textlink inline-block mt-4">
                      Lees hoe u dat aanpakt <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                )}

                <h3 className="mg-q-sub mt-14">Wat dit voor u betekent</h3>
                <ul className="mg-points mt-6">
                  {result.points.map((p, i) => <li key={i}>{p.text}</li>)}
                </ul>
                {[result.summary, ...result.points.map((p) => p.text), ...(result.alternatives || []).map((a) => a.text)].some((t) => typeof t === "string" && t.includes("DVZ")) && (
                  <p className="mg-disclaimer mt-6">DVZ is de Dienst Vreemdelingenzaken: de federale overheidsdienst die beslist over uw aanvraag.</p>
                )}

                {result.alternatives && result.alternatives.length > 0 && (
                  <>
                    <h3 className="mg-q-sub mt-14">Wat kunt u wel doen?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 mt-8">
                      {result.alternatives.map((alt, i) => (
                        <div key={i} className="mg-step">
                          <span className="mg-step-num">{String(i + 1).padStart(2, "0")}</span>
                          <h4 className="mg-step-title">{alt.title}</h4>
                          <p className="mg-body mg-justify">{alt.text}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-10">
                  <button type="button" onClick={handleReset} className="mg-textlink">
                    Opnieuw beginnen
                  </button>
                </div>

                {/* Oproep */}
                <div className="mg-cta mg-cta-card mt-16">
                  <p className="mg-eyebrow mg-eyebrow-light">Persoonlijk advies</p>
                  <h3 className="mg-h2 text-white max-w-xl">Laat uw dossier <em>nakijken</em></h3>
                  <p className="mg-lead mg-justify text-primary-100 mt-5 max-w-xl">
                    In een videogesprek van 30 minuten krijgt u een eerlijk beeld van uw kansen en de volgende stappen. Een gesprek kost €75 excl. btw.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link to="/afspraak" className="mg-btn mg-btn-rust">Maak een afspraak</Link>
                    <button type="button" onClick={() => setShowForm(!showForm)} aria-expanded={showForm} className="mg-btn mg-btn-ghost">
                      {showForm ? "Formulier sluiten" : "Laat uw gegevens achter"}
                    </button>
                  </div>
                </div>

                <div className={`mg-collapse ${showForm ? "is-open" : ""}`}>
                  <div>
                    <div className="mg-formpanel mt-6">
                      <p className="mg-body mg-justify mb-8">Laat uw gegevens achter. Wij nemen zo snel mogelijk contact met u op.</p>
                      <ContactForm result={result} answers={answers} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zijkolom: antwoorden en disclaimer */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="mg-eyebrow">Uw antwoorden</p>
              {history.length === 0 ? (
                <p className="mg-body mg-justify">Uw antwoorden verschijnen hier. U kunt ze op elk moment aanpassen.</p>
              ) : (
                <ol className="mg-answers">
                  {history.map((q, i) => (
                    <li key={q}>
                      <div className="min-w-0">
                        <span className="mg-answers-q">{SHORT_LABELS[q] || QUESTIONS[q].title}</span>
                        <span className="mg-answers-a">{answerLabel(q, answers[q])}</span>
                      </div>
                      <button type="button" onClick={() => goToStep(i)} className="mg-answers-edit" aria-label={`Wijzig: ${SHORT_LABELS[q] || QUESTIONS[q].title}`}>
                        Wijzig
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              <p className="mg-disclaimer mg-justify mt-10">
                Deze situatiecheck geeft een eerste inschatting op basis van de algemene regels van de Verblijfswet. Het is geen juridisch advies: elk dossier is anders en de Dienst Vreemdelingenzaken neemt de beslissing. Lees ook ons <Link to="/privacy" className="underline underline-offset-2">privacybeleid</Link>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
