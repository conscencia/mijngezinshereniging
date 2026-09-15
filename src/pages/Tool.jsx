import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BOOKING_URL } from "../config";

const QUESTIONS = {
  nationaliteit: {
    id: "nationaliteit",
    label: "Stap 1",
    title: "Wat is uw huidige nationaliteit of statuut in België?",
    help: "Het gaat om de persoon die al in België woont. Van zijn of haar statuut hangt af welke regels gelden.",
    options: [
      { value: "belg", label: "Ik ben Belg" },
      { value: "eu", label: "Ik ben EU-burger (of EER)" },
      { value: "niet-eu", label: "Niet-EU nationaliteit met geldige verblijfskaart" },
      { value: "vluchteling", label: "Erkend vluchteling of subsidiair beschermd" },
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
    help: "Woonde, werkte of studeerde u als Belg een tijd in een ander EU-land? Dan gelden vaak de Europese regels, en die zijn soepeler dan de regels voor een Belg die altijd in België woonde.",
    options: [
      { value: "statisch", label: "Nee, ik heb altijd in België gewoond en nooit duurzaam in een andere EU-lidstaat gewerkt of gestudeerd" },
      { value: "actief", label: "Ja, ik heb gewoond, gewerkt of gestudeerd in een andere EU-lidstaat" },
    ],
    next: (answers) => answers["belg-type"] === "actief" ? "eu-type" : "gezinslid",
  },
  "eu-type": {
    id: "eu-type",
    label: "Uw statuut",
    title: "Wat is uw huidige situatie in België?",
    help: "Wie in België werkt, zelfstandige is of actief werk zoekt, heeft de ruimste rechten. Voor studenten en wie van eigen middelen leeft, gelden beperkingen, bijvoorbeeld om ouders te laten overkomen.",
    options: [
      { value: "economisch-actief", label: "Ik werk, ben zelfstandige of zoek actief werk in België" },
      { value: "student", label: "Ik studeer in België (ingeschreven aan een erkende instelling)" },
      { value: "beschikker", label: "Ik beschik over voldoende eigen middelen (gepensioneerd, rentenier, ...)" },
    ],
    next: () => "gezinslid-eu",
  },
  "gezinslid-eu": {
    id: "gezinslid-eu",
    label: "Stap 3",
    title: "Wie wilt u naar België halen?",
    help: "Voor familie van een EU-burger gelden de Europese regels. Voor uw echtgeno(o)t(e) of minderjarige kinderen is er in principe geen vast inkomensbedrag.",
    options: [
      { value: "eu-partner", label: "Mijn echtgeno(o)t(e) of gelijkgestelde partner (al gehuwd of gelijkgesteld)" },
      { value: "eu-geregistreerd", label: "Mijn wettelijk geregistreerde partner (niet gehuwd)" },
      { value: "eu-kind", label: "Mijn (stief)kind (minderjarig of meerderjarig ten laste)" },
      { value: "eu-ouder", label: "Mijn (schoon)grootouder (ten laste van mij of mijn partner)" },
      { value: "eu-ander", label: "Ander familielid (broer, zus, feitelijke partner, ...)" },
    ],
    next: () => null,
  },
  gezinslid: {
    id: "gezinslid",
    label: "Stap 2",
    title: "Wie wilt u naar België halen?",
    help: "Voor elk gezinslid gelden andere voorwaarden. Kies wat het best bij uw situatie past.",
    options: [
      { value: "partner", label: "Mijn echtgeno(o)t(e) (wij zijn gehuwd)" },
      { value: "partner-niet-gehuwd", label: "Mijn geregistreerde partner (wettelijk samenwonend of buitenlands partnerschap)" },
      { value: "partner-toekomst", label: "Mijn partner, maar wij zijn (nog) niet gehuwd of geregistreerd" },
      { value: "kind-min", label: "Mijn minderjarig kind (jonger dan 18)" },
      { value: "kind-18", label: "Mijn meerderjarig kind (18 jaar of ouder)" },
      { value: "ouder", label: "Mijn (groot)ouder" },
      { value: "ander-familielid", label: "Ander familielid (broer, zus, neef, nicht, ...)" },
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
      { value: "samenwonen", label: "Wij woonden minstens 1 jaar onafgebroken samen vlak voor de aanvraag" },
      { value: "kennen", label: "Wij kennen elkaar minstens 2 jaar, hadden regelmatig contact en zagen elkaar minstens 3 keer (samen 45 dagen of meer)" },
      { value: "kind", label: "Wij hebben samen een kind" },
      { value: "geen", label: "Geen van deze situaties" },
    ],
    next: () => "leeftijd-partner",
  },
  "leeftijd-partner": {
    id: "leeftijd-partner",
    label: "Stap 4",
    title: "Hoe oud bent u en uw partner?",
    help: "Geregistreerde partners van een Belg moeten beiden ouder zijn dan 21 jaar. Woonden jullie al 1 jaar samen voor uw partner in België aankwam? Dan volstaat 18 jaar.",
    options: [
      { value: "ja", label: "Wij zijn beiden ouder dan 21 jaar" },
      { value: "ja-18", label: "Een van ons is tussen 18 en 21, maar wij woonden al 1 jaar samen" },
      { value: "nee", label: "Een van ons is jonger dan 21 en wij woonden niet 1 jaar samen" },
    ],
    next: () => "inkomen",
  },
  leeftijd: {
    id: "leeftijd",
    label: "Stap 3",
    title: "Bent u beiden ouder dan 18 jaar?",
    help: "Als u gehuwd bent met een Belg, moeten u en uw partner allebei ouder zijn dan 18 jaar op het moment van de aanvraag. Voor aanvragen vanaf 18 augustus 2027 wordt dat 21 jaar.",
    options: [
      { value: "ja", label: "Ja, wij zijn beiden 18 jaar of ouder" },
      { value: "nee-ik", label: "Nee, ik ben jonger dan 18" },
      { value: "nee-partner", label: "Nee, mijn partner is jonger dan 18" },
    ],
    next: () => "inkomen",
  },
  "kind-voogdij": {
    id: "kind-voogdij",
    label: "Stap 3",
    title: "Wie heeft momenteel de zorg over uw kind?",
    help: "U moet het ouderlijk gezag hebben. Deelt u het gezag met de andere ouder, dan moet die schriftelijk toestemming geven dat het kind bij u in België komt wonen.",
    options: [
      { value: "ik-alleen", label: "Ik alleen heb het ouderlijk gezag" },
      { value: "samen", label: "Samen met de andere ouder (co-ouderschap)" },
      { value: "ex", label: "De andere ouder heeft voornamelijk de zorg" },
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
    help: "Als u alleen gezinshereniging vraagt voor uw minderjarig kind, is er geen inkomenseis. Vraagt u tegelijk ook gezinshereniging voor uw partner of een meerderjarig kind? Dan geldt die wel.",
    options: [
      { value: "alleen-kind", label: "Nee, enkel voor mijn minderjarig kind" },
      { value: "ook-anderen", label: "Ja, ook voor mijn partner of een meerderjarig kind" },
    ],
    next: (answers) => answers["kind-extra"] === "alleen-kind" ? null : "inkomen",
  },
  inkomen: {
    id: "inkomen",
    label: "Stap 4",
    title: "Beschikt u over een stabiel en voldoende inkomen?",
    help: "Het referentiebedrag is €2.217,47 netto per maand (sinds 1 september 2026). Loon, pensioen en een werkloosheidsuitkering (als u actief werk zoekt) tellen mee, net als het stabiele inkomen van uw partner. Leefloon, OCMW-steun, kindergeld en een wachtuitkering tellen niet mee.",
    options: [
      { value: "werk-voldoende", label: "Ja, wij hebben samen een stabiel inkomen van €2.217,47 netto/maand of meer" },
      { value: "werk-twijfel", label: "Ons stabiele inkomen ligt onder €2.217,47 netto/maand" },
      { value: "zelfstandige", label: "Ik ben zelfstandige" },
      { value: "werkloosheidsuitkering", label: "Ik ontvang werkloosheidsuitkering en zoek actief werk" },
      { value: "geen-werk", label: "Ik ontvang leefloon/OCMW of heb geen inkomen" },
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
      title: "Uw situatie vereist persoonlijk advies",
      summary: "Als erkend vluchteling of subsidiair beschermde heeft u in principe recht op gezinshereniging, maar de voorwaarden en procedure zijn sterk afhankelijk van uw specifiek beschermingsstatuut, de termijn van uw aanvraag en de gezinssamenstelling. Een persoonlijk gesprek is aangewezen.",
      points: [
        { text: "Erkend vluchtelingen en subsidiair beschermden genieten specifieke regels op basis van de Verblijfswet en internationale verdragen (Vluchtelingenverdrag, art. 8 EVRM)." },
        { text: "Wanneer u de aanvraag indient na uw erkenning, kan een groot verschil maken voor de voorwaarden." },
        { text: "De precieze voorwaarden (inkomens- en huisvestingsvereisten, welke familieleden u kunt laten overkomen) verschillen per statuut. Een advocaat beoordeelt uw volledige situatie." },
      ],
      alternatives: [],
      cta: "Bespreek uw situatie met een advocaat",
    };
  }

  // ── Derdelander in België: te complex voor de tool ──
  if (nationaliteit === "niet-eu") {
    return {
      status: "oranje",
      title: "Uw situatie vereist persoonlijk advies",
      summary: "Als derdelander met verblijfskaart in België zijn de regels voor gezinshereniging afhankelijk van uw specifiek verblijfsstatuut. Er zijn heel veel hypotheses mogelijk en de voorwaarden verschillen sterk per geval. Een persoonlijk gesprek is aangewezen.",
      points: [
        { text: "De regels hangen af van uw specifieke verblijfskaart: type A, B, C, D, F of F+ leidt tot heel andere voorwaarden en termijnen." },
        { text: "Kreeg u uw verblijfsrecht vóór 18 augustus 2025? Dan geldt meestal het referentiebedrag van €2.217,47 netto per maand, zolang u aanvraagt vóór 18 augustus 2027. Kreeg u het op of na 18 augustus 2025? Dan gelden de nieuwe regels: €2.456,97 netto per maand, plus 10% per gezinslid ten laste, en een minimumleeftijd van 21 jaar voor partners." },
        { text: "Sommige derdelanders vallen onder gunstiger Europese regels. Dit moet geval per geval worden beoordeeld door een advocaat." },
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
      ? [{ text: isStudent ? "Als EU-student moet u ook bewijzen dat u over voldoende bestaansmiddelen beschikt en dat uw partner een ziekteverzekering heeft die alle risico's in België dekt." : "Als beschikker moet u bewijzen dat u over voldoende eigen middelen beschikt en dat uw partner beschikt over een ziekteverzekering die alle risico's in België dekt." }]
      : [];

    if (gezinslidEu === "eu-partner") {
      return {
        status: "groen",
        title: "U komt waarschijnlijk in aanmerking",
        summary: "Als EU-burger of actieve Belg heeft u het recht uw echtgeno(o)t(e) of gelijkgestelde partner naar België te halen op basis van de Burgerschapsrichtlijn (art. 40/40bis Verblijfswet). Er is geen vast inkomensbedrag.",
        points: [
          { text: "Geen klassieke inkomenseis: de Burgerschapsrichtlijn legt geen minimumbedrag op. U moet wel aantonen dat u geen onredelijke belasting vormt voor de Belgische sociale bijstandsstelsels." },
          { text: "Vereist: geldig paspoort van uw partner, huwelijksakte (gelegaliseerd, vertaald en eventueel erkend in België), bewijs van uw verblijfsrecht in België (EU-kaart of bijlage 19)." },
          ...extraVereisten,
          { text: "DVZ controleert op schijnhuwelijk. Een sterk dossier met bewijs van uw relatie (foto's, communicatie, gezamenlijk verblijf) is sterk aanbevolen." },
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
        summary: "Een wettelijk geregistreerde partner van een EU-burger of actieve Belg heeft recht op gezinshereniging mits bewijs van een duurzame en stabiele relatie. Er is geen vast inkomensbedrag, maar DVZ kijkt streng naar de bewijzen.",
        points: [
          { text: "Geen inkomenseis op basis van de Burgerschapsrichtlijn." },
          { text: "Bewijs van duurzame en stabiele relatie vereist: minstens 1 jaar onafgebroken samenwonen, OF minstens 2 jaar kennen met minimaal 3 ontmoetingen van samen 45 dagen, OF een gemeenschappelijk kind." },
          { text: "Leeftijd: u bent beiden ouder dan 21 jaar, of ouder dan 18 als u al 1 jaar samenwoonde voor uw partner in België aankwam." },
          { text: "Vereist: akte van geregistreerd partnerschap (gelegaliseerd en vertaald waar nodig, en overgeschreven in de gemeente), bewijs van het verblijfsrecht van de EU-burger in België." },
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
        summary: "Kinderen van EU-burgers of actieve Belgen hebben recht op gezinshereniging op basis van de Burgerschapsrichtlijn. Een kind jonger dan 21 hoeft niet ten laste te zijn.",
        points: [
          { text: "Is uw (stief)kind jonger dan 21? Dan hoeft u niet te bewijzen dat het ten laste is. Vanaf 21 jaar moet u aantonen dat het in het herkomstland financieel afhankelijk is van u." },
          { text: "Vereist: geboorteakte of adoptieakte (gelegaliseerd, vertaald en erkend in België), bewijs van uw verblijfsrecht in België (EU-kaart of bijlage 19)." },
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
          summary: "Als EU-student heeft u géén recht om uw (groot)ouder naar België te halen. De Burgerschapsrichtlijn beperkt dit recht voor studenten tot de echtgeno(o)t(e), geregistreerde partner en (stief)kinderen.",
          points: [
            { text: "EU-studenten hebben uitdrukkelijk géén recht op gezinshereniging met (groot)ouders. Dit is een bewuste beperking in de Verblijfswet (art. 40bis Vw.)." },
            { text: "Bent u na uw studies economisch actief geworden (werknemer, zelfstandige)? Dan gelden er andere, ruimere regels." },
            { text: "In uitzonderlijke situaties kan een humanitair visum of art. 20 VWEU een alternatief bieden. Een advocaat beoordeelt uw specifieke situatie." },
          ],
          alternatives: [
            { title: "Na uw studies: economisch actief statuut", text: "Van zodra u werkt of als zelfstandige actief bent, heeft u wel het recht om (groot)ouders over te laten komen (mits ten-laste-bewijs)." },
            { title: "Humanitair visum (type D)", text: "In bijzondere omstandigheden (ernstige ziekte, noodsituatie) kan een humanitair visum worden aangevraagd bij de Belgische ambassade. Dit is een discretionaire beslissing." },
          ],
          cta: "Bespreek uw situatie met een advocaat",
        };
      }
      return {
        status: "oranje",
        title: "Mogelijk in aanmerking als uw (groot)ouder ten laste is",
        summary: "Een (schoon)grootouder van een EU-burger of actieve Belg heeft recht op gezinshereniging als hij of zij aantoonbaar 'ten laste' is. Dit is een financiële afhankelijkheid in het herkomstland.",
        points: [
          { text: "'Ten laste' betekent dat uw (groot)ouder voor zijn of haar basisbehoeften financieel afhankelijk was van uw steun in het land van herkomst. Bewijs hiervan is verplicht." },
          { text: "Vereist: bewijs van afstamming (geboorteakte, gelegaliseerd en vertaald), bewijs van ten-laste-zijn (bankuittreksels van geldoverschrijvingen, verklaringen van bevoegde overheden), bewijs van uw verblijfsrecht in België." },
          ...extraVereisten,
          { text: "DVZ beoordeelt de financiële afhankelijkheid strikt. Een louter emotionele band of de wens tot samenwonen volstaat niet." },
          { text: "Geen retributie voor familieleden van een EU-burger." },
        ],
        alternatives: [],
        cta: "Laat uw situatie beoordelen door een advocaat",
      };
    }

    if (gezinslidEu === "eu-ander") {
      return {
        status: "oranje",
        title: "Uw situatie is complex: de wet voorziet vier uitzonderingsgronden",
        summary: "Andere familieleden van EU-burgers (broers, zussen, neven, nichten, feitelijke partners zonder registratie...) hebben géén automatisch recht op gezinshereniging. Toch zijn er vier situaties waarin verblijf mogelijk is. DVZ beoordeelt dit geval per geval.",
        points: [
          { text: "Categorie 1: u heeft een deugdelijk bewezen duurzame relatie met de EU-burger en komt niet in aanmerking als geregistreerde partner (bewijs: minstens 1 jaar samenwonen of 2 jaar kennen met regelmatig contact)." },
          { text: "Categorie 2: u bent in het herkomstland financieel ten laste van de EU-burger (bewijs van financiële afhankelijkheid voor uw basisbehoeften)." },
          { text: "Categorie 3: u maakte deel uit van het gezin van de EU-burger in het herkomstland (aantoonbaar nauwe, duurzame en persoonlijke band)." },
          { text: "Categorie 4: u heeft ernstige gezondheidsproblemen en heeft de persoonlijke zorg van de EU-burger nodig." },
          { text: "DVZ heeft een ruime beoordelingsbevoegdheid. Juridisch advies is sterk aanbevolen om uw kansen correct in te schatten." },
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
        { text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag bij DVZ of de ambassade." },
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
      summary: "De Belgische Verblijfswet geeft (groot)ouders van een meerderjarige Belg geen recht op gezinshereniging. De wet voorziet dit recht voor echtgenoten, partners, kinderen en de ouders van een minderjarige Belg.",
      points: [
        { text: "Er is geen wettelijk recht op gezinshereniging voor (groot)ouders van een meerderjarige Belg. DVZ zal een klassieke aanvraag weigeren." },
        { text: "Bent u de meerderjarige ouder van een meerderjarig kind? Dan biedt artikel 9bis of een humanitair visum soms een alternatief. Een advocaat beoordeelt uw situatie." },
        { text: "In humanitaire gevallen (ernstige ziekte, noodsituatie) bestaan er andere wegen. Een advocaat beoordeelt welke weg voor uw situatie het meest kansrijk is." },
      ],
      alternatives: [
        {
          title: "Humanitair visum (type D)",
          text: "Als uw ouder ernstig ziek is of in een kwetsbare situatie verkeert, kan een humanitair visum aangevraagd worden via de ambassade. Dit is een discretionaire beslissing van de overheid.",
        },
        {
          title: "Artikel 9bis: bijzondere omstandigheden",
          text: "Via artikel 9bis van de Verblijfswet kan verblijf worden aangevraagd op basis van buitengewone omstandigheden. Een advocaat beoordeelt of dit in uw situatie toepasbaar is.",
        },
        {
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
      title: "Geen wettelijk recht op gezinshereniging",
      summary: "De Belgische Verblijfswet geeft broers, zussen, neven, nichten en andere familieleden geen recht op gezinshereniging. De wet voorziet dit recht enkel voor echtgenoten, partners en kinderen.",
      points: [
        { text: "Er is geen wettelijk recht op gezinshereniging voor dit type familielid. Een klassieke aanvraag bij DVZ zal worden geweigerd." },
        { text: "In uitzonderlijke gevallen kan artikel 20 VWEU (Europees Unierecht) een oplossing bieden bij bewezen afhankelijkheid, maar dit is zeldzaam." },
        { text: "Afhankelijk van uw concrete situatie kunnen er andere verblijfsopties zijn. Een advocaat beoordeelt welke weg voor u het meest kansrijk is." },
      ],
      alternatives: [
        {
          title: "Humanitair visum (type D)",
          text: "In geval van ernstige ziekte, noodsituatie of uitzonderlijke humanitaire omstandigheden kan een humanitair visum worden aangevraagd via de ambassade. Dit is een discretionaire beslissing.",
        },
        {
          title: "Artikel 9bis: bijzondere omstandigheden",
          text: "Via artikel 9bis van de Verblijfswet kan verblijf worden aangevraagd op basis van buitengewone omstandigheden. Een advocaat beoordeelt of dit in uw situatie toepasbaar is.",
        },
        {
          title: "Studentenvisum of arbeidsvisum",
          text: "Als uw familielid wil studeren of werken in België, zijn er specifieke visa voor dat doel. Dit staat volledig los van gezinshereniging.",
        },
        {
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
        title: "Inkomen én 'ten laste'-bewijs zijn aandachtspunten",
        summary: "Voor een meerderjarig kind gelden strengere regels. U moet zowel voldoende inkomen aantonen als bewijzen dat uw kind materieel afhankelijk van u is in zijn of haar land van herkomst.",
        points: [
          { text: "Leefloon en OCMW-uitkering tellen niet mee als bewijs van voldoende inkomen bij DVZ." },
          { text: "Naast inkomen moet u ook aantonen dat uw kind 'ten laste' is: materieel afhankelijk van uw steun in het buitenland." },
          { text: "Via een behoefteanalyse kunt u uw volledige financiële situatie toelichten. Lever daarom zelf meteen alle bewijzen aan." },
        ],
        alternatives: [
          {
            title: "Behoefteanalyse indienen",
            text: "Als uw inkomen onder de grens ligt, kunt u via een behoefteanalyse aantonen dat uw gezin niet ten laste van de overheid valt. U onderbouwt dit met al uw inkomsten én vaste uitgaven.",
          },
          {
            title: "Wachten tot u werk heeft",
            text: "Zodra u een stabiel loon heeft boven €2.217,47 netto/maand, staat u veel sterker. Een inkomenseis én 'ten laste'-bewijs samen zijn haalbaar met een goed dossier.",
          },
        ],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "oranje",
      title: "Mogelijk, maar u moet 'ten laste' bewijzen",
      summary: "Voor een meerderjarig kind gelden andere regels dan voor minderjarige kinderen. Uw kind moet aantoonbaar 'ten laste' zijn: materieel afhankelijk van u in zijn of haar land van herkomst.",
      points: [
        { text: "'Ten laste' betekent dat uw kind voor zijn/haar basisbehoeften (huur, voeding) afhankelijk is van uw financiële steun in het buitenland." },
        { text: inkomen === "werk-voldoende" ? "Uw inkomen lijkt voldoende, dat is een goede basis." : inkomen === "werk-twijfel" ? "Uw inkomen is een aandachtspunt. Onder €2.217,47 netto/maand moet DVZ eerst een behoefteanalyse maken." : inkomen === "werkloosheidsuitkering" ? "Uw werkloosheidsuitkering telt mee als u actief werk zoekt. Laat dit goed documenteren." : "Als zelfstandige bewijst u uw inkomen met specifieke fiscale en sociale documenten." },
        { text: "U moet concrete bewijzen aanleveren van de afhankelijkheid: geldoverschrijvingen, verklaringen, bewijs dat uw kind geen eigen inkomen heeft in het buitenland." },
        { text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag." },
        { text: "Een advocaat helpt u beoordelen of uw kind aan de 'ten laste'-definitie voldoet en welke bewijsstukken het sterkst staan." },
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
        title: "Mogelijk, maar de voogdijsituatie is een aandachtspunt",
        summary: "Als de andere ouder voornamelijk de zorg heeft, is de kans op weigering groter. DVZ vereist bewijs van uw ouderlijk gezag of een schriftelijke toestemming van de andere ouder.",
        points: [
          { text: "U moet het ouderlijk gezag hebben. Delen u en de andere ouder het gezag, dan moet de andere ouder schriftelijk toestemming geven dat het kind in België bij u komt wonen." },
          { text: "Er is geen inkomenseis: voor een minderjarig kind dat alleen overkomt, hoeft u geen minimuminkomen aan te tonen." },
          { text: "Een geboorteakte (gelegaliseerd en vertaald waar nodig) en eventueel een rechterlijke beslissing over het ouderlijk gezag versterken uw dossier sterk." },
          { text: "Geen retributie: wie jonger is dan 18, betaalt die nooit." },
        ],
        alternatives: [],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "groen",
      title: "U komt waarschijnlijk in aanmerking",
      summary: "Voor een minderjarig kind dat alleen overkomt, is er géén inkomenseis. Op basis van uw antwoorden voldoet u aan de basisvoorwaarden.",
      points: [
        { text: "Geen inkomenseis: als het enkel om uw minderjarig kind gaat, hoeft u geen minimuminkomen aan te tonen bij DVZ." },
        { text: kindVoogdij === "ik-alleen" ? "U heeft het ouderlijk gezag, dat is de sterkste positie voor uw aanvraag." : "Bij gedeeld gezag is een schriftelijke toestemming van de andere ouder nodig." },
        { text: "U heeft wel een bewijs van afstamming nodig (geboorteakte, gelegaliseerd en vertaald waar nodig) en een bewijs van huisvesting en ziekteverzekering." },
        { text: "Geen retributie: wie jonger is dan 18, betaalt die nooit." },
        { text: "Laat uw dossier nakijken om fouten te voorkomen. Een ontbrekend of fout document kan uw aanvraag ernstig vertragen." },
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
        { text: "Wilt u in België trouwen of wettelijk samenwonen en daarna gezinshereniging aanvragen? Dan vraagt uw partner daarvoor een specifiek visum D aan bij de Belgische ambassade." },
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
      summary: "Als geregistreerde partner moet u bewijzen dat uw relatie duurzaam en stabiel is. Op basis van uw antwoord voldoet u (nog) niet aan een van de drie situaties uit de wet.",
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
      summary: "Geregistreerde partners van een Belg moeten beiden ouder zijn dan 21 jaar, of ouder dan 18 als ze al 1 jaar samenwoonden voor de partner in België aankwam.",
      points: [
        { text: "Een van u beiden voldoet nu niet aan de leeftijdsvoorwaarde." },
        { text: "Bij een huwelijk met een Belg geldt vandaag een minimumleeftijd van 18 jaar. Voor aanvragen vanaf 18 augustus 2027 wordt dat 21 jaar." },
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
      summary: "Voor gezinshereniging met een Belg als echtgenoot moeten beide partners ouder zijn dan 18 jaar op het moment van de aanvraag (art. 40ter Verblijfswet).",
      points: [
        { text: "Een of beide partners is jonger dan 18 jaar." },
        { text: "De leeftijdseis staat in de wet en kan niet worden omzeild." },
      ],
      alternatives: [
        {
          title: "Wachten tot u beiden 18 bent",
          text: "Dit is de eenvoudigste en meest zekere oplossing. Zodra de jongste partner 18 is, kunt u de aanvraag indienen.",
        },
        {
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
      title: "Uw inkomen is een aandachtspunt, maar geen automatische weigering",
      summary: "Leefloon en OCMW-uitkering tellen niet mee voor gezinshereniging. Dat betekent niet dat u automatisch geweigerd wordt. Via een behoefteanalyse zijn er mogelijkheden. Laat uw situatie bekijken.",
      points: [
        { text: "Leefloon en OCMW-uitkering tellen niet mee als bewijs van voldoende inkomen bij DVZ." },
        { text: "DVZ weigert niet automatisch: via een individuele behoefteanalyse (arrest Chakroun) kunt u op andere manieren aantonen dat uw gezin niet ten laste van de overheid valt." },
        { text: "Bij een behoefteanalyse kijkt DVZ naar uw volledige situatie: inkomsten, vaste uitgaven, toekomstige inkomsten, alimentatie, co-ouderschap, enz. Lever daarom zelf meteen alle bewijzen aan." },
        ...(kindVoogdij === "ex" ? [{ text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
      ],
      alternatives: [
        {
          title: "Behoefteanalyse aanvragen",
          text: "Als uw inkomen onder de grens ligt, kunt u een behoefteanalyse indienen. U toont aan de hand van al uw inkomsten én uitgaven (huur, facturen, verzekeringen...) dat uw gezin niet ten laste valt van de overheid.",
        },
        {
          title: "Wachten tot u werk heeft",
          text: "Zodra u een stabiel loon heeft boven €2.217,47 netto/maand, kunt u de aanvraag indienen. Dit is de meest gebruikte weg en geeft de sterkste positie.",
        },
        {
          title: "Humanitair visum",
          text: "In uitzonderlijke situaties (ernstige ziekte, noodsituatie) kan een humanitair visum aangevraagd worden. Dit staat los van de inkomenseis.",
        },
        {
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
      title: "Werkloosheidsuitkering telt mee, maar aandacht is nodig",
      summary: "Een werkloosheidsuitkering telt in principe mee als inkomen voor gezinshereniging, op voorwaarde dat u aantoonbaar actief werk zoekt. DVZ beoordeelt dit echter nauwkeurig.",
      points: [
        { text: "Een werkloosheidsuitkering telt mee bij DVZ, maar enkel als u aantoonbaar actief werk zoekt (inschrijving VDAB/Forem, bewijs van sollicitaties)." },
        { text: "De uitkering moet boven de inkomensgrens van €2.217,47 netto/maand liggen. Ligt ze daaronder, dan gelden dezelfde regels als bij onvoldoende inkomen." },
        { text: "DVZ kijkt ook naar de stabiliteit en duurzaamheid van uw inkomen. Een dalend bedrag of korte periode van uitkering kan een negatief signaal zijn." },
        { text: "Een behoefteanalyse kan helpen als uw uitkering net niet voldoende is. Laat uw situatie beoordelen." },
        ...(kindVoogdij === "ex" ? [{ text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
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
      summary: "Op basis van uw antwoorden kunt u mogelijk in aanmerking komen. DVZ kijkt heel nauwkeurig naar uw inkomen. Een screening door een advocaat is sterk aangeraden.",
      points: [
        { text: inkomen === "zelfstandige" ? "Als zelfstandige toont u uw inkomen aan met specifieke fiscale en sociale documenten. Loonfiches die u zelf als zaakvoerder uitreikt, volstaan op zich niet." : "Het referentiebedrag is €2.217,47 netto/maand. Ook het stabiele inkomen van uw partner kan meetellen." },
        { text: "Ligt uw inkomen net onder de grens? Dat is geen automatische weigering. Via een individuele behoefteanalyse kunt u uw volledige situatie toelichten." },
        { text: (gezinslid === "partner" || gezinslid === "partner-niet-gehuwd") ? "Uw leeftijd en relatie lijken in orde te zijn." : "Het type gezinslid is in principe toegestaan." },
        { text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag." },
        { text: "Bij een behoefteanalyse kijkt DVZ naar al uw inkomsten én uitgaven. Lever daarom zelf meteen alle bewijzen aan." },
        ...(kindVoogdij === "ex" ? [{ text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
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
      { text: "Uw inkomen lijkt voldoende (€2.217,47 netto/maand of meer)." },
      { text: gezinslid === "partner" ? "U bent beiden ouder dan 18 jaar, de leeftijdseis is in orde." : gezinslid === "partner-niet-gehuwd" ? "U kunt een duurzame relatie aantonen en voldoet aan de leeftijdseis." : "Het type gezinslid valt binnen de toegestane categorieën." },
      { text: "U heeft ook een bewijs van huisvesting en ziekteverzekering nodig." },
      { text: "Er is een retributie van €218 verschuldigd bij het indienen van de aanvraag." },
      { text: "DVZ controleert uw dossier heel grondig. Een ontbrekend document of fout in uw loonfiche kan leiden tot weigering." },
      { text: "Laat uw dossier eerst vrijblijvend nakijken om vermijdbare fouten te voorkomen." },
      ...(kindVoogdij === "ex" ? [{ text: "Aandachtspunt: de voogdijsituatie van uw kind vereist extra documentatie (toestemming andere ouder)." }] : []),
    ],
    alternatives: [],
    cta: "Laat uw dossier vrijblijvend nakijken door een advocaat",
  };
}

const SHORT_LABELS = {
  nationaliteit: "Uw statuut",
  "belg-type": "Vrij verkeer in de EU",
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

  const validate = () => {
    const e = {};
    if (!form.naam.trim()) e.naam = "Vul uw naam in";
    if (!form.voornaam.trim()) e.voornaam = "Vul uw voornaam in";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Vul een geldig e-mailadres in";
    if (!form.telefoon.trim()) e.telefoon = "Vul uw telefoonnummer in";
    if (!form.fase) e.fase = "Kies een optie";
    if (!form.privacy) e.privacy = "Ga akkoord met het privacybeleid om verder te gaan";
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
          <input type="tel" autoComplete="tel" value={form.telefoon} onChange={set("telefoon")} className={`mg-input ${errors.telefoon ? "is-invalid" : ""}`} placeholder="+32" />
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

      <button type="submit" className="mg-btn mg-btn-rust">Verstuur mijn gegevens</button>
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
  const topRef = useRef(null);

  const question = QUESTIONS[currentQ];
  const progress = history.length + 1;
  const expectedSteps = Math.max(getExpectedSteps(answers), progress);
  const isLast = selected && question && question.next({ ...answers, [currentQ]: selected }) === null;

  const scrollToTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [currentQ]: selected };
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
    scrollToTop();
  };

  return (
    <div className="bg-white">
      {/* Kop */}
      <section className="mg-pagehead text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <p className="mg-eyebrow mg-eyebrow-light">Situatiecheck</p>
          <h1 className="mg-display text-white max-w-3xl">Komt u in aanmerking voor <em>gezinshereniging</em>?</h1>
          <p className="mg-lead text-primary-100 mt-6 max-w-2xl">
            Beantwoord een paar korte vragen. U krijgt meteen een eerste inschatting van uw situatie.
          </p>
        </div>
      </section>

      <section ref={topRef} className="py-16 sm:py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">

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

                <h2 className="mg-q-title mt-10">{question.title}</h2>
                <p className="mg-body mg-justify mt-5 max-w-2xl">{question.help}</p>

                <div className="mg-options mt-10" role="radiogroup" aria-label={question.title}>
                  {question.options.map((opt, i) => {
                    const isSel = selected === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={isSel}
                        onClick={() => setSelected(opt.value)}
                        className={`mg-option ${isSel ? "is-selected" : ""}`}
                      >
                        <span className="mg-option-num">{String.fromCharCode(65 + i)}</span>
                        <span className="mg-option-label">{opt.label}</span>
                        <span className="mg-option-dot" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
                  {history.length > 0 ? (
                    <button type="button" onClick={handleBack} className="mg-textlink mg-textlink-back">
                      <span aria-hidden="true">&larr;</span> Vorige vraag
                    </button>
                  ) : <span />}
                  <button type="button" onClick={handleNext} disabled={!selected} className="mg-btn mg-btn-rust w-full sm:w-auto disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed">
                    {isLast ? "Bekijk mijn resultaat" : "Volgende vraag"} <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="mg-fade">
                <p className="mg-eyebrow">Uw resultaat</p>
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
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mg-btn mg-btn-rust">Plan een gesprek</a>
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
