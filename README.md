# mijngezinshereniging.be

Website van Mijn Gezinshereniging. Gebouwd met React en Vite, gehost op Netlify.

## Hoe de site gebouwd wordt

`npm run build` doet drie dingen na elkaar:

1. De gewone Vite-build (map `dist`).
2. Een server-build van `src/entry-server.jsx` (tijdelijke map `dist/.server`).
3. `scripts/prerender.mjs`: schrijft voor elke pagina een eigen HTML-bestand met de echte titel,
   omschrijving en tekst (`dist/contact/index.html`, `dist/blog/<slug>/index.html`, ...), plus
   `404.html`, `sitemap.xml` en `llms.txt`.

Daardoor zien Google en AI-bots de inhoud meteen, zonder JavaScript uit te voeren. In de browser
neemt React de vooraf gebouwde HTML over (hydration) en werkt alles zoals voorheen.

## Onderhoud

- **Nieuw artikel**: toevoegen in `src/data/articles.js`. De pagina, de sitemap en `llms.txt`
  volgen automatisch bij de volgende build. Een optioneel veld `updated` ("5 november 2026")
  wordt gebruikt als wijzigingsdatum.
- **Vaste pagina gewijzigd**: pas de datum aan in `src/routes.js`, zodat de sitemap klopt.
- **Nieuwe vaste pagina**: route toevoegen in `src/App.jsx` én in `src/routes.js`.
- Lokaal testen: `npm run build` en daarna `npm run preview`.

## Ontwikkelen

```
npm install
npm run dev
```
