# TDLWebshop zarasi audit es teendolista

Ez a dokumentum a konzulensi visszajelzesek alapjan osszefoglalja, hogy a szakdolgozathoz mi tekintheto kesznek, mit kell meg bizonyitani, es mely anyagok keruljenek a beadando reszbe.

## Jelenlegi allapot

A TDLWebshop jelenleg termekszeru webshop/admin rendszerkent ertekelheto. A vasarloi oldalon mukodik a termekbongeszes, kereses, kosar, kivansaglista, checkout, profil es rendeleskovetes. Az admin oldalon elkeszult a termekkezeles, CSV import, rendeleskezeles, helyszini vasarlas, mentett vasarlok kezelese, jogosultsagi rendszer, keszletfigyeles, szamlaszeru PDF es az AI asszisztens.

Szakdolgozati szempontbol a fo feladat mar nem uj funkciok hozzaadasa, hanem a meglevo rendszer mernoki bizonyitasa: cel, MVP-hatar, architektura, adatmodell, jogosultsag, biztonsag, teszteles es reprodukalhatosag.

## Konzulensi elvarasok szerinti megfeleles

| Terulet | Allapot | Bizonyitek / hely |
| --- | --- | --- |
| MVP-hatar | Elkeszult, meg sajat nyelvezetre at kell huzni | `docs/01_product/mvp_brief.md` |
| Piaci osszehasonlitas | Alap elkeszult, sajat megfogalmazas kell | `docs/01_product/piaci_elemzes.md`, piackutatasi Excel fajlok |
| Kovetelmenyek | Elkeszult traceability formaban | `docs/01_product/kovetelmenyek_traceability.md` |
| Use case-ek | Elkeszultek, screenshotokkal erosithendok | `docs/01_product/use_cases.md` |
| UX / kepernyospecifikacio | Elkeszult, vegigtesztelessel pontositando | `docs/ux/ux_screen_spec.md` |
| Architektura es ADR-ek | Tobb ADR megvan, abrakkal erosithendo | `docs/02_architecture/`, `docs/02_architecture/thesis_diagrams.md` |
| Adatmodell | Elkeszult osszefoglalo | `docs/adatmodell-osszefoglalo.md` |
| Modulok es interfeszek | Elkeszult osszefoglalo | `docs/02_architecture/modules_interfaces.md` |
| Biztonsagi minimum | Jo allapot, secret scan es szabalyok tamasztjak ala | `docs/05_security_ops/security_minimum.md`, `firestore.rules` |
| Teszteles es validacio | Dokumentalt, kezi teszt pipalassal meg vegig kell vinni | `docs/teszteles-validacio-osszefoglalo.md`, `docs/leadando_checklist.md` |
| Reprodukalhatosag | README es env minta megvan, vegso build utan frissitendo | `README.md`, `.env.example`, `docs/reprodukcios_README.md` |
| MI hasznalat | Dokumentalt, sajat hangra atirando | `docs/07_ai/`, `docs/ai-asszisztens-openrouter.md` |

## Legutobbi zarokori ellenorzes

- `npm test -- --watch=false`: sikeres futas, 14 tesztfajl es 41 teszt lefutott.
- `npm run build`: sikeres production build, kimenet: `dist/webshop`.
- OpenRouter kulcs a kodban: a working tree-ben nem talalhato valodi `sk-or-v1` kulcs, csak placeholder es dokumentacios emlites.
- Git history ellenorzes `sk-or-v1` mintara: nem adott talalatot.
- `functions/node_modules`: kikerult a kovetett fajlokbol, commit utan nem lesz a repoban.
- AI asszisztens: a modell nem allithato a feluleten, es pontos katalushiany eseten nem ad veletlen termekajanlast.

## Beadandoba keruljon

- `README.md`
- `.env.example`
- `.github/workflows/ci.yml`
- `firestore.rules`
- `src/`
- `functions/` node_modules nelkul
- `workers/openrouter-proxy/`
- `public/` kepekkel es importalt termekfotokkal
- `docs/01_product/`
- `docs/02_architecture/`
- `docs/04_quality/`
- `docs/05_security_ops/`
- `docs/06_release/`
- `docs/07_ai/`
- `docs/reprodukcios_README.md`
- `docs/leadando_checklist.md`
- vegleges szakdolgozat DOCX/PDF

## Segedanyagkent kulon kezelendo

Ezek hasznosak a munka kozben, de ne keveredjenek a beadando bizonyito anyagok koze:

- regi szakdolgozat DOCX verziok,
- renderelt Word/PDF ellenorzo mappak,
- ideiglenes fajlok es Word lock fajlok,
- termekimport sablonok, ha mar a vegleges import megtortent,
- szemelyes munkajegyzetek, amelyek nem a dolgozat reszei.

Ezek helye a projektben: `docs/_segedanyagok/`.

## Ami meg hatra van ezen a heten

1. Teljes kezi teszt vegigpipalasa a `docs/leadando_checklist.md` alapjan.
2. GitHub Actions zold allapotanak kepernyokepezese.
3. A fontos dokumentumok sajat nyelvezetre atirasa: MVP, piaci elemzes, kovetelmenyek, use case, biztonsag, teszteles, MI hasznalat.
4. A dolgozat fo DOCX-ben a konkret screenshotok es kodreszletek tenyleges beillesztese az `docs/abra_es_kod_kepernyokep_terv.md` alapjan.
5. A Firebase/Firestore eles kornyezet gyors ellenorzese: termeklista, rendeles, admin muvelet, AI asszisztens.
6. Vegso repo-higienia commit elott: ne legyen valodi API kulcs, jelszo, token, `node_modules`, build mappa vagy Word lock fajl commitolva.

## Oszinte ertekeles

Szigoruan nezve a kod es a funkciok jelenleg eros 4-es / 5-kozeli szinten vannak. A konzulensi elvarasok alapjan az 5-os szinthez mar nem elsosorban uj funkcio kell, hanem tiszta bizonyitas: reprodukalhato repo, kezi teszteredmenyek, abrak, screenshotok, sajat hangra atirt dokumentacio es rendezett vegleges dolgozat.

Ha a fenti heti teendok elkeszulnek, a projekt szakdolgozati kod- es dokumentacios resze vedhetoen 5-os kozeli, jo esellyel 5-os szintre huzhato.
