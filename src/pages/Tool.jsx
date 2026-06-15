import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    next: () => "gezinslid",
  },
  gezinslid: {
    id: "gezinslid",
    label: "Stap 2",
    title: "Wie wilt u naar België halen?",
    help: "Elk gezinslid heeft andere voorwaarden en regels. Kies de categorie die het beste past bij uw situatie.",
    options: [
      { value: "partner", label: "Mijn echtgeno(o)t(e) of wettelijk samenwonende partner (al gehuwd)", icon: "💑" },
      { value: "partner-niet-gehuwd", label: "Mijn toekomstige partner (nog niet gehuwd)", icon: "💍" },
      { value: "kind-min", label: "Mijn minderjarig kind (jonger dan 18)", icon: "👶" },
      { value: "kind-18", label: "Mijn meerderjarig kind (18 jaar of ouder)", icon: "🧑" },
      { value: "ouder", label: "Mijn (groot)ouder", icon: "👴" },
      { value: "ander-familielid", label: "Ander familielid (broer, zus, neef, nicht, ...)", icon: "👥" },
    ],
    next: (answers) => {
      if (answers.gezinslid === "partner" || answers.gezinslid === "partner-niet-gehuwd") return "leeftijd";
      if (answers.gezinslid === "kind-min") return "kind-voogdij";
      if (answers.gezinslid === "ouder") return "bent-u-minderjarig";
      if (answers.gezinslid === "ander-familielid") return null;
      return "inkomen"; // kind-18
    },
  },
  leeftijd: {
    id: "leeftijd",
    label: "Stap 3",
    title: "Bent u beiden minstens 18 jaar oud?",
    help: "Beide partners moeten minstens 18 jaar oud zijn op het moment van de aanvraag. Dit is een wettelijke minimumleeftijd (art. 40ter Verblijfswet).",
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
    help: "Dit bepaalt de haalbaarheid van de aanvraag. Bij co-ouderschap is een schriftelijke toestemming van de andere ouder vereist.",
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
    title: "Bent u jonger dan 18 jaar?",
    help: "De regels zijn heel anders naargelang uw leeftijd. Als u minderjarig Belgisch kind bent, heeft uw niet-EU-ouder mogelijk een verblijfsrecht op basis van Europees Unierecht (art. 20 VWEU), ook al voorziet de Belgische Verblijfswet dit niet uitdrukkelijk.",
    options: [
      { value: "ja", label: "Ja, ik ben jonger dan 18 jaar", icon: "👶" },
      { value: "nee", label: "Nee, ik ben 18 jaar of ouder", icon: "🧑" },
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
    help: "De inkomensgrens bedraagt €2.173,88 netto per maand (2026). Loon uit werk en werkloosheidsuitkering (als u actief werk zoekt) tellen mee. Leefloon en OCMW-steun tellen NIET mee.",
    options: [
      { value: "werk-voldoende", label: "Ja, ik verdien meer dan €2.173,88 netto/maand", icon: "✅" },
      { value: "werk-twijfel", label: "Ik verdien minder dan €2.173,88 netto/maand", icon: "🤔" },
      { value: "zelfstandige", label: "Ik ben zelfstandige (bewijs via belastingbrief)", icon: "💼" },
      { value: "werkloosheidsuitkering", label: "Ik ontvang werkloosheidsuitkering en zoek actief werk", icon: "🔍" },
      { value: "geen-werk", label: "Ik ontvang leefloon/OCMW of heb geen inkomen", icon: "❌" },
    ],
    next: () => null,
  },
};

function getExpectedSteps(answers) {
  if (!answers.gezinslid) return 5;
  if (answers.gezinslid === "ouder") return 3;
  if (answers.gezinslid === "kind-18") return 3;
  if (answers.gezinslid === "partner" || answers.gezinslid === "partner-niet-gehuwd") return 4;
  if (answers.gezinslid === "kind-min") {
    if (answers["kind-extra"] === "alleen-kind") return 4;
    return 5;
  }
  return 4;
}

function calculateResult(answers) {
  const {
    gezinslid,
    leeftijd,
    "kind-voogdij": kindVoogdij,
    "kind-extra": kindExtra,
    "bent-u-minderjarig": bentUMinderjarig,
    inkomen,
  } = answers;

  // ── Ouder: minderjarig Belgisch kind wiens niet-EU-ouder wil overkomen ──
  if (gezinslid === "ouder" && bentUMinderjarig === "ja") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Mogelijk — uw ouder heeft rechten op basis van Europees recht",
      summary: "Als minderjarig Belgisch kind heeft uw niet-EU-ouder een afgeleid verblijfsrecht wanneer u zo sterk afhankelijk bent van uw ouder dat weigering van zijn of haar verblijf u zou dwingen het volledige grondgebied van de Europese Unie te verlaten (art. 20 VWEU). De Belgische Verblijfswet voorziet dit niet uitdrukkelijk, maar het Europees Unierecht heeft voorrang.",
      points: [
        { icon: "✅", text: "Er geldt geen inkomenseis: voor de ouder van een minderjarig Belgisch kind is er geen minimum bestaansmiddelen vereist." },
        { icon: "📋", text: "Uw ouder moet een identiteitsbewijs voorleggen, een bewijs van afstamming (geboorteakte, eventueel gelegaliseerd en vertaald) en bewijs van ouderlijk gezag en daadwerkelijke zorg." },
        { icon: "⚠️", text: "DVZ beoordeelt de afhankelijkheidsverhouding: uw leeftijd, uw emotionele band met elk van uw ouders, wie de zorg draagt, en of u gedwongen zou zijn de EU te verlaten als uw ouder geen verblijfsrecht krijgt." },
        { icon: "💡", text: "Woont u samen met uw ouder, dan geldt een weerlegbaar vermoeden van afhankelijkheid. Dat is de sterkste positie voor de aanvraag." },
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
      summary: "De Belgische Verblijfswet geeft (groot)ouders van een Belg geen recht op gezinshereniging. De wet voorziet dit recht enkel voor echtgenoten, partners en kinderen.",
      points: [
        { icon: "❌", text: "Er is geen wettelijk recht op gezinshereniging voor (groot)ouders. DVZ zal een klassieke aanvraag weigeren." },
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
          title: "Artikel 9bis — bijzondere omstandigheden",
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
          title: "Artikel 9bis — bijzondere omstandigheden",
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
            text: "Zodra u een stabiel loon heeft boven €2.173,88 netto/maand, staat u veel sterker. Een inkomenseis én 'ten laste'-bewijs samen zijn haalbaar met een goed dossier.",
          },
        ],
        cta: "Bespreek uw situatie vrijblijvend met een advocaat",
      };
    }
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Mogelijk — maar u moet 'ten laste' bewijzen",
      summary: "Voor een meerderjarig kind gelden andere regels dan voor minderjarige kinderen. Uw kind moet aantoonbaar 'ten laste' zijn: materieel afhankelijk van u in zijn of haar land van herkomst.",
      points: [
        { icon: "📌", text: "'Ten laste' betekent dat uw kind voor zijn/haar basisbehoeften (huur, voeding) afhankelijk is van uw financiële steun in het buitenland." },
        { icon: inkomen === "werk-voldoende" ? "✅" : "⚠️", text: inkomen === "werk-voldoende" ? "Uw inkomen lijkt voldoende — dat is een goede basis." : inkomen === "werk-twijfel" ? "Uw inkomen is een aandachtspunt: het moet aantoonbaar boven €2.173,88 netto/maand liggen." : inkomen === "werkloosheidsuitkering" ? "Uw werkloosheidsuitkering telt mee als u actief werk zoekt — laat dit goed documenteren." : "Uw inkomen als zelfstandige wordt beoordeeld via de belastingbrief van de laatste 3 jaar." },
        { icon: "📋", text: "U moet concrete bewijzen aanleveren van de afhankelijkheid: geldoverschrijvingen, verklaringen, bewijs dat uw kind geen eigen inkomen heeft in het buitenland." },
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
        title: "Mogelijk — maar de voogdijsituatie is een aandachtspunt",
        summary: "Als de andere ouder voornamelijk de zorg heeft, is de kans op weigering groter. DVZ vereist bewijs van uw ouderlijk gezag of een schriftelijke toestemming van de andere ouder.",
        points: [
          { icon: "⚠️", text: "DVZ vereist ofwel uw ouderlijk gezag, ofwel een gelegaliseerde schriftelijke toestemming van de andere ouder die erkent dat het kind naar België komt." },
          { icon: "✅", text: "Goed nieuws: er is geen inkomenseis — voor een minderjarig kind dat alleen overkomt, hoeft u geen minimuminkomen aan te tonen." },
          { icon: "📋", text: "Een gelegaliseerde geboorteakte en eventueel een rechterlijk besluit over het ouderlijk gezag versterken uw dossier sterk." },
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
        { icon: "✅", text: kindVoogdij === "ik-alleen" ? "U heeft het ouderlijk gezag — dat is de sterkste positie voor uw aanvraag." : "Bij co-ouderschap is een gelegaliseerde schriftelijke toestemming van de andere ouder vereist." },
        { icon: "📋", text: "U heeft wel een bewijs van afstamming nodig (geboorteakte, gelegaliseerd en vertaald) en een bewijs van huisvesting en ziekteverzekering." },
        { icon: "💡", text: "Laat uw dossier nakijken om fouten te voorkomen — een ontbrekend of fout document kan uw aanvraag ernstig vertragen." },
      ],
      alternatives: [],
      cta: "Laat uw dossier vrijblijvend nakijken door een advocaat",
    };
  }

  // ── Inkomenstests (partner of kind-min met andere gezinsleden) ──
  if (inkomen === "geen-werk") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Uw inkomen is een aandachtspunt — maar geen automatische weigering",
      summary: "Leefloon en OCMW-uitkering tellen niet mee voor gezinshereniging. Dat betekent niet dat u automatisch geweigerd wordt — via een behoefteanalyse zijn er mogelijkheden. Laat uw situatie bekijken.",
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
          text: "Zodra u een stabiel loon heeft boven €2.173,88 netto/maand, kunt u de aanvraag indienen. Dit is de meest gebruikte weg en geeft de sterkste positie.",
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
      title: "Werkloosheidsuitkering telt mee — maar aandacht is nodig",
      summary: "Een werkloosheidsuitkering telt in principe mee als inkomen voor gezinshereniging, op voorwaarde dat u aantoonbaar actief werk zoekt. DVZ beoordeelt dit echter nauwkeurig.",
      points: [
        { icon: "✅", text: "Een werkloosheidsuitkering telt mee bij DVZ — maar enkel als u aantoonbaar actief werk zoekt (inschrijving VDAB/Forem, bewijs van sollicitaties)." },
        { icon: "⚠️", text: "De uitkering moet boven de inkomensgrens van €2.173,88 netto/maand liggen. Ligt ze daaronder, dan gelden dezelfde regels als bij onvoldoende inkomen." },
        { icon: "📌", text: "DVZ kijkt ook naar de stabiliteit en duurzaamheid van uw inkomen. Een dalend bedrag of korte periode van uitkering kan een negatief signaal zijn." },
        { icon: "💡", text: "Een behoefteanalyse kan helpen als uw uitkering net niet voldoende is. Laat uw situatie beoordelen." },
        ...(kindVoogdij === "ex" ? [{ icon: "⚠️", text: "Extra aandachtspunt: de voogdijsituatie van uw kind vereist ook aandacht (toestemming andere ouder)." }] : []),
      ],
      alternatives: [],
      cta: "Laat uw inkomen vrijblijvend beoordelen door een advocaat",
    };
  }

  // ── Leeftijdseis partner ──
  if (leeftijd && leeftijd !== "ja") {
    return {
      status: "rood",
      emoji: "🔴",
      title: "Op dit moment komt u niet in aanmerking",
      summary: "Voor gezinshereniging als koppel moeten beide partners minstens 18 jaar oud zijn op het moment van de aanvraag. Dit is een wettelijke minimumleeftijd (art. 40ter Verblijfswet).",
      points: [
        { icon: "❌", text: "Een of beide partners is jonger dan 18 jaar." },
        { icon: "📌", text: "De leeftijdseis van 18 jaar staat in de wet en kan niet worden omzeild." },
      ],
      alternatives: [
        {
          icon: "⏳",
          title: "Wachten tot u beiden 18 bent",
          text: "Dit is de eenvoudigste en meest zekere oplossing. Zodra de jongste partner 18 is, kunt u de aanvraag indienen.",
        },
        {
          icon: "🎓",
          title: "Studentenvisum",
          text: "Als uw partner in België wil studeren, kan hij of zij via een studentenvisum naar hier komen. Dit staat los van gezinshereniging.",
        },
        {
          icon: "🤝",
          title: "Humanitair visum",
          text: "In uitzonderlijke omstandigheden (bijv. zwangerschap, medische situatie) kan een humanitair visum worden aangevraagd.",
        },
        {
          icon: "✈️",
          title: "Kort verblijf (max. 90 dagen)",
          text: "Uw partner kan u bezoeken met een toeristenvisum voor maximaal 90 dagen. Dit is geen verblijfsrecht, maar geeft u wel tijd.",
        },
      ],
      cta: "Bespreek uw opties vrijblijvend met een advocaat",
    };
  }

  // ── Inkomen twijfelachtig of zelfstandige ──
  if (inkomen === "werk-twijfel" || inkomen === "zelfstandige") {
    return {
      status: "oranje",
      emoji: "🟡",
      title: "Mogelijk in aanmerking — uw inkomen is het aandachtspunt",
      summary: "Op basis van uw antwoorden kunt u mogelijk in aanmerking komen. DVZ kijkt heel nauwkeurig naar uw inkomen. Een screening door een advocaat is sterk aangeraden.",
      points: [
        { icon: "⚠️", text: inkomen === "zelfstandige" ? "Als zelfstandige toont u uw inkomen aan via de belastingbrief van de laatste 3 jaar. Uw netto belastbaar inkomen wordt beoordeeld." : "Uw inkomen moet aantoonbaar boven €2.173,88 netto/maand liggen." },
        { icon: "📌", text: "Ligt uw inkomen net onder de grens? Dat is geen automatische weigering. Via een individuele behoefteanalyse kunt u uw volledige situatie toelichten." },
        { icon: "✅", text: (gezinslid === "partner" || gezinslid === "partner-niet-gehuwd") ? "Uw leeftijd en relatie lijken in orde te zijn." : "Het type gezinslid is in principe toegestaan." },
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
      { icon: "✅", text: "Uw inkomen lijkt voldoende (boven €2.173,88 netto/maand)." },
      { icon: "✅", text: (gezinslid === "partner" || gezinslid === "partner-niet-gehuwd") ? "U bent beiden 18 jaar of ouder — leeftijdseis is in orde." : "Het type gezinslid valt binnen de toegestane categorieën." },
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
        <div className="text-4xl mb-3">✅</div>
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
        Gegevens versturen — wij nemen contact op
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

            {/* Huwelijksprocedure — enkel voor niet-gehuwde partner */}
            {answers.gezinslid === "partner-niet-gehuwd" && (
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 sm:p-8">
                <div className="mb-4">
                  <h3 className="font-bold text-amber-900 text-base mb-2">⚠️ Eerste stap: de huwelijksprocedure</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Voordat u een aanvraag gezinshereniging kunt indienen, moet u en uw partner eerst officieel gehuwd zijn of een wettelijke samenwoning hebben. In België gaat dit niet automatisch. Er is een specifieke procedure voor wie trouwt met iemand uit het buitenland.
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
              {answers.gezinslid === "partner-niet-gehuwd" && (
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">
                  Uw situatie na het huwelijk
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
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">Laat uw gegevens achter — wij nemen zo snel mogelijk contact op.</p>
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
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">Videocall van 30 minuten met een advocaat. U betaalt <strong>€50 excl. BTW</strong> — direct inboeken.</p>
                  <a
                    href={`mailto:advocaat@mijngezinshereniging.be?subject=Gesprek inplannen gezinshereniging&body=Ik wil graag een videocall van 30 minuten inplannen (€50 excl. BTW).%0A%0AMijn situatie:%0A- Nationaliteit: ${answers.nationaliteit || ""}%0A- Gezinslid: ${answers.gezinslid || ""}`}
                    className="block w-full text-center bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Gesprek inplannen — €50 excl. BTW
                  </a>
                </div>
              </div>

              {/* Inline form */}
              {showForm && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-5">
                  <p className="text-sm text-gray-500 mb-4">Vul uw gegevens in — wij nemen vandaag nog contact op.</p>
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


