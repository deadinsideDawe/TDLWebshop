# Konzulensi megfeleles, hianylista es ertekeles

## Kiindulasi helyzet

A konzulensi visszajelzesek alapjan a TDLWebshop funkcionalis volumene megfelelo szakdolgozati alapot ad. A lenyeg most mar nem uj nagy funkciok hozzaadasa, hanem a meglevo rendszer bizonyitasa: tiszta repo, reprodukalhato futtatas, biztonsagi minimum, tesztelesi bizonyitekok, kepernyokepek, abrak es sajat megfogalmazasu dolgozati szoveg.

## Konzulensi elvarasok szerinti allapot

| Elvaras | Jelenlegi allapot | Bizonyitek a projektben | Hatralevo feladat |
|---|---|---|---|
| Repo-rendezes es reprodukalhatosag | Jo iranyban van, a repo mar tisztabb. | `README.md`, `.env.example`, `docs/reprodukcios_README.md`, zold GitHub Actions futas. | A vegleges PDF-be keruljon be a friss CI kep es a futtatasi leiras rovid osszefoglalasa. |
| Node_modules, build, lokalis fajlok kezelese | A kritikus generalt mappak nincsenek verziozva. | `.gitignore`, git status, repo struktura. | Beadas elott meg egyszer ellenorizni: `node_modules`, `.env`, build/cache ne legyen commitolva. |
| Biztonsagi minimum | Szakdolgozati MVP szinten eros, de nehany korlatot le kell irni. | `firestore.rules`, `docs/05_security_ops/security_minimum.md`, `docs/05_security_ops/threat_model.md`, `workers/openrouter-proxy/src/index.js`. | Leirni: npm audit maradek kockazat, AI proxy kvota/rate limit, kliensoldali checkout korlat. |
| Adatmodell es architektura | Dokumentalhato es abrakkal alatamaszthato. | `docs/02_architecture/`, `docs/adatmodell-osszefoglalo.md`, diagram SVG-k. | Abrak beillesztese a Word dolgozatba es rovid magyarazat minden abra utan. |
| Fo use case-ek | Megvannak: vasarloi ut, admin ut, helyszini vasarlas, jogosultsagok. | `docs/03_requirements/`, `docs/02_architecture/`, alkalmazas kepernyoi. | Kepernyokepekkel bizonyitani a mukodest. |
| Teszteles es validacio | Van alap, de a kezi bizonyitast vegig kell pipalni. | `docs/04_quality/test_report.md`, `docs/manual-site-test-checklist.md`, CI zold futas. | Friss build/test datum, tesztszam, manual checklist kitoltese. |
| AI-hasznalat dokumentalasa | Jo iranyban van. | `docs/07_ai/`, `docs/ai-asszisztens-openrouter.md`. | Vegleges dolgozatban sajat hangra atirni, kulonvalasztva fejlesztoi AI-segitseg es webshop AI asszisztens. |
| Dolgozati szoveg | Szerkezetileg jo munkaverzio, de nem kesz. | `docs/TDLWebshop_szakdolgozat_vazlat_javitott.docx` es kapcsolodo dolgozati anyagok. | Placeholder csere, kepek/abrak/kodreszletek, cimlap, A4, TOC, irodalomjegyzek, sajat zaro reflexio. |

## Hatralevo kritikus pontok

1. A Word/PDF dolgozatban minden placeholdert valodi keppel, abraval vagy szoveggel kell lecserelni.
2. A tartalomjegyzeket Wordben kell frissiteni, oldalszamokkal.
3. A cimlapon legyen kitoltve: szak, intezmeny, kar/tanszek, temavezeto: Dr. Bilicki Vilmos, egyetemi docens.
4. Kell feladatkiiras jellegu resz vagy melleklet.
5. Kell irodalomjegyzek.
6. Kell sajat zaro reflexio: mit tanultal, mi volt nehez, mit csinalnal maskent.
7. A kezi teszt checklistet tenylegesen vegig kell pipalni.
8. A kritikus kockazatokat nem elrejteni kell, hanem MVP-korlatkent megfogalmazni.

## Kodolddali kockazatok, amelyeket erdemes leirni

- `npm audit` jelezhet maradek serulekenysegeket. Ezt be lehet vallani ugy, hogy a szakdolgozat idokerete miatt az MVP fokusza a funkcionalis bizonyitas volt, a production hardening pedig tovabbfejlesztesi irany.
- A webes checkoutnal a kosar es arak kliensoldalrol indulnak. Firestore szabalyok es validaciok vannak, de egy eles webshopnal erosebb szerveroldali ar- es keszlet-ujraszamolas kellene.
- A helyszini rendelest erosebb tranzakcios logika kezeli, a webes folyamatnal a keszletkezeles korlatait kulon erdemes megemliteni.
- A dolgozoi jogosultsagoknal a szukebb alapertelmezes lenne idealis egy eles rendszerben.
- A vendeg rendelesek email-alapu azonositasanal van adatvedelmi/adatintegritasi kockazat.
- Az AI proxy CORS vedelem mellett is igenyelhet rate limitet vagy kvotat, ha elesben sok felhasznalo hasznalja.

## Oszinte ertekeles

Kodolddal: eros 4-es, 5-os kozeli szakdolgozati MVP. A funkcionalitas mennyisege, az admin oldal, jogosultsagkezeles, PDF, CSV import, AI asszisztens es CI egyutt mar kifejezetten jo bizonyito ero.

Dokumentacio: jo alap, de a vegleges jegyet nagyon erosen befolyasolja, hogy a dolgozatba bekerulnek-e a valodi kepek, abrak, teszteredmenyek es sajat magyarazatok.

AI-erzet: a repoban nem talaltam latvanyos `Codex`, `ChatGPT`, `TODO`, `PLACEHOLDER`, `ATIRVA` jellegu nyomokat a vizsgalt tracked fajlokban. A dolgozati szoveg viszont akkor lesz igazan vedheto, ha a vegleges fogalmazast sajat hangra huzod. Nem az AI-hasznalat a gond, hanem az, ha a szoveg tul egyenletesen altalanos vagy tul steril marad.

Jelen allapotban beadva: eros 4-es irany.

Kepekkel, abrakkal, tesztekkel, sajat stilusu vegleges szoveggel: realisan 5-os kozeli, akar 5-os vedheto anyag.
