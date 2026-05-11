# Konzulensi visszajelzes szerinti megfelelesi allapot

Ez a dokumentum a konzulensi e-mailben kapott elvarasokat forditja le konkret repo- es szakdolgozati teendokre. A cel az, hogy a kod, a dokumentacio es a dolgozat ugyanazt a mernoki tortenetet mondja el.

## 1. Rovid osszkep

A TDL Webshop funkcionalis szempontbol eros MVP allapotban van. A vasarloi ut, a termeklista, a kosar, a checkout, a profil/rendeleskovetes, valamint az admin oldal termek-, rendeles-, keszlet-, felhasznalo-, kupon- es PDF folyamatai megfelelo szakdolgozati volument adnak.

A konzulensi visszajelzes alapjan a fo feladat mar nem uj funkciok hozzaadasa, hanem:

- repo-higienia es reprodukalhatosag bizonyitasa;
- biztonsagi minimum dokumentalasa;
- adatmodell es architektura bemutatasa;
- teszteles es validacio lathatova tetele;
- szakdolgozati narrativaba rendezett, sajat nyelven megirt szoveg.

## 2. Elvarasok es bizonyitekok

| Konzulensi elvaras | Projektbeli bizonyitek | Allapot | Kovetkezo lepes |
|---|---|---|---|
| Mukodokepes repo README-vel | [README.md](../README.md), [reprodukcios_README.md](reprodukcios_README.md) | kesz | vegso build/test utan frissiteni, ha valtozik |
| `.env.example`, de nincs valodi titok | [.env.example](../.env.example), [.gitignore](../.gitignore) | kesz | commit elott secret scan |
| Nincs `node_modules` a vegleges repoban | `.gitignore`, git status ellenorzes | kesz irany | vegso commitban ellenorizni |
| MVP hatar kimondasa | [01_product/mvp_brief.md](01_product/mvp_brief.md) | kesz | dolgozatba atemelni sajat stilusban |
| Piaci/teruleti osszehasonlitas | [01_product/piaci_elemzes.md](01_product/piaci_elemzes.md) | kesz | dolgozatba roviditett forma |
| Kovetelmenyek es use case-ek | [01_product/kovetelmenyek_traceability.md](01_product/kovetelmenyek_traceability.md), [01_product/use_cases.md](01_product/use_cases.md) | kesz | abrakkal kiegeszitheto |
| GUI/UX bizonyitasa | [ux/ux_screen_spec.md](ux/ux_screen_spec.md), [ux/screens.csv](ux/screens.csv), [ux/screenshots/README.md](ux/screenshots/README.md) | kesz | kepernyokepek beillesztese |
| Architektura | [02_architecture/c4_context_container.md](02_architecture/c4_context_container.md), [02_architecture/modules_interfaces.md](02_architecture/modules_interfaces.md) | kesz | dolgozatba abraval |
| Adatmodell | [adatmodell-osszefoglalo.md](adatmodell-osszefoglalo.md) | kesz | Product, Cart, Order, OrderItem, UserProfile, Coupon, Invoice kiemelese |
| Biztonsagi minimum | [05_security_ops/security_minimum.md](05_security_ops/security_minimum.md), [05_security_ops/threat_model.md](05_security_ops/threat_model.md) | kesz | manualis jogosultsagi teszt |
| Teszteles | [teszteles-validacio-osszefoglalo.md](teszteles-validacio-osszefoglalo.md), [testing/regression-checklist.md](testing/regression-checklist.md) | kesz | vegigpipalni es bizonyitek kepernyokep |
| MI-hasznalat | [07_ai/ai-usage-thesis-section.md](07_ai/ai-usage-thesis-section.md), [07_ai/ai_manifest.md](07_ai/ai_manifest.md) | kesz | sajat hangra athuzni |

## 3. Kritikus lezaro teendok

1. `npm run build` es `npm test -- --watch=false` futtatasa.
2. GitHub Actions CI zold futasanak ellenorzese.
3. Secret scan futtatasa es talalatok ertelmezese.
4. Manualis tesztlista vegigpipalasa.
5. Kepernyokepek elkeszitese a dolgozathoz.
6. A dokumentumok es a dolgozat fo szovegenek sajat nyelvezetre atirasa.
7. Vegleges commit es push a GitHub repoba.

## 4. Miben eros a projekt?

- Nem csak CRUD alkalmazas: van teljes vasarloi es admin/dolgozoi folyamat.
- Domainhez kotott plusz funkciok: helyszini vasarlas, mentett vasarlok, keszletfigyeles, PDF/szamla, kupon, AI asszisztens.
- Jogosultsagi modell: admin, dolgozo, vasarlo es tiltott allapot.
- Firestore rules oldalrol is vedett adatmodell.
- CI es dokumentacios csomag segiti a biralhatosagot.

## 5. Mire kell figyelni leadas elott?

- A szakdolgozat ne legyen sablonszagu: a dokumentumokbol atvett reszeket sajat megfogalmazasra kell huzni.
- A demo belepesi adatok ne legyenek publikus repoban.
- A Firebase config magyarazata legyen benne a biztonsagi fejezetben.
- Az AI hasznalatot oszinten kell dokumentalni: mire hasznaltad, hogyan ellenorizted, hol nem hasznaltad.
- A kepernyokepek legyenek frissek, az eles vagy vegleges lokalis allapotot mutassak.
