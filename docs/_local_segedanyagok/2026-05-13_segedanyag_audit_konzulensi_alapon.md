# Segedanyag audit a konzulensi levelek alapjan

Ez a fajl csak helyi segedanyag. Nem beadando, nem GitHubra szant dokumentum, es nem szabad egy az egyben bemasolni a szakdolgozatba. A celja az, hogy latszodjon, az eddig keszitett segedanyagok hogyan illeszkednek a konzulensi elvarasokhoz.

## Gyors allapot

- A `docs/_local_segedanyagok/` mappa `.gitignore` alatt van.
- A legutobbi ellenorzes alapjan a git munkaterulet tiszta volt.
- A publikus `docs/*.md` fajlokban nem talaltam nyilvanvalo `Codex`, `ChatGPT`, `IDE KERUL`, `ATIRVA`, emoji/jellegu munkautasitas-maradvanyt.
- A secret scan nem mutatott eles OpenRouter kulcsot vagy jelszot. A talalatok tobbsege `.env.example`, dokumentalt placeholder, mezonnev vagy package-lock bejegyzes volt.
- A konzulensi elvarasokhoz a segedanyagok jo terkepet adnak, de a dolgozatba kerulo szoveget sajat nyelvezetre kell huzni.

## Atnezett fo segedanyagok

### `2026-05-11_zaro_dolgozat_atnezes/01_konzulensi_megfeleles_hianylista_ertekeles.md`

Hasznos fo checklist. A konzulensi levelek legfontosabb pontjait jol bontja:

- repo rendezes es reprodukalhatosag,
- biztonsagi minimum,
- tesztelesi bizonyitas,
- architektura es adatmodell,
- MI-hasznalat,
- dolgozati sajat narracio.

Javaslat: ezt hasznald hetfoi/zarasi ellenorzo listanak. Beadando dokumentumba ne keruljon be valtozatlanul.

### `2026-05-11_zaro_dolgozat_atnezes/02_kepernyokep_abra_kodterv.md`

Ez jelenleg a legerosebb gyakorlati segedanyag. Tartalmazza:

- milyen webshop-oldalakrol kell kepernyokep,
- milyen allapotban kell fotozni oket,
- melyik kodreszletek erdemesek szakmai bemutatasra,
- milyen abrak kellenek az architekturahoz es adatmodellhez.

Javaslat: ezt hasznald kozvetlenul a kepernyokepek es kodreszletek behelyezesekor. A sorok jo kiindulopontok, de a vegleges kodhoz meg egyszer frissitsd oket, mielott beadod.

### `2026-05-11_zaro_dolgozat_atnezes/03_40_50_oldalas_szakdolgozat_vaz.md`

Jo 40-50 oldalas szerkezeti vaz. Illeszkedik ahhoz, amit a konzulens kert:

- problemafelvetes,
- MVP-hatar,
- piaci osszehasonlitas,
- kovetelmenyek,
- use case-ek,
- GUI/UX,
- technologiai hatter,
- architektura,
- adatmodell,
- megvalositas,
- biztonsag,
- teszteles,
- MI-hasznalat,
- osszefoglalas.

Fontos: ez meg vazlat, nem vegleges dolgozati szoveg. A benne levo placeholder jellegu reszeket, zarojeles utasitasokat es altalanos mondatokat ki kell cserelni sajat megfogalmazasra es valodi abrakra.

### `2026-05-11_zaro_dolgozat_atnezes/06_beillesztheto_ai_es_bizonyito_fejezetek.md`

Tartalmilag hasznos, mert van benne:

- MI-hasznalati fejezet alap,
- biztonsagi minimum,
- tesztelesi bizonyitas,
- reprodukcios leiras,
- sajat reflexiohoz otletek.

Kockazat: ez a leginkabb "kesz szoveg" jellegu segedanyag, ezert ezt kell a legjobban sajat hangra atirni. Talaltam benne egy kodolasi hibas reszt is (`OpenRouter alap...` torz karakterrel), ezt beadando szovegbe semmikepp ne vidd at.

## Regi segedanyagok

A `docs/_local_segedanyagok/` gyokerben levo regi segedanyagok tovabbra is hasznosak, de masodlagosak:

- `abra_es_kod_kepernyokep_terv.md`
- `screenshot-plan.md`
- `figure-captions.md`
- `files-to-personalize.md`
- `top-10-maradek-feladat.md`
- `defense-likely-questions.md`
- `thesis-defense-notes.md`
- `ai-detektor-kockazatos-dokumentumok.md`

Javaslat: ha keves az ido, a `2026-05-11_zaro_dolgozat_atnezes` mappaban levo friss fajlokat hasznald elsokent. A regi fajlok inkabb tartalekok.

## Konzulensi elvarasok szerinti megfeleles

### Repo es reprodukalhatosag

Lefedett segedanyagok:

- reprodukcios README jellegu leirasok,
- `.env.example` es titokkezeles emlitese,
- GitHub CI es build/teszt bizonyitas.

Meg teendo:

- a dolgozatban roviden leirni, hogyan indithato a rendszer tiszta kornyezetben,
- beleirni, hogy a valodi API-kulcsok nem kerulnek repoba,
- GitHub Actions zold CI kepernyokepet betenni.

### Biztonsagi minimum

Lefedett segedanyagok:

- Firestore rules,
- admin/dolgozo/vasarlo szerepkorok,
- rendelesei adatok vedelme,
- kupon/PDF/input validacio kockazatok,
- AI proxy kulcskezeles.

Meg teendo:

- a dolgozatban MVP-korlatkent vallalni, hogy bizonyos webes checkout adatok kliensoldalrol indulnak,
- megemliteni az AI proxy rate limit/kvota kockazatat,
- npm audit talalatokat vagy javitani, vagy korlatkent dokumentalni.

### Teszteles es validacio

Lefedett segedanyagok:

- kezi teszt checklist,
- build/test/CI bizonyitas,
- checkout, kupon, admin statusz, PDF, AI asszisztens es validacio tesztek emlitese.

Meg teendo:

- a kezi teszt checklistet tenylegesen vegigpipalni,
- a dolgozatba konkret teszteredmenyt irni: milyen parancs futott, milyen eredmennyel,
- 1-2 hibas bemenetrol/sikertelen es sikeres folyamatrol kepernyokep.

### Architektura es adatmodell

Lefedett segedanyagok:

- komponensabra terv,
- adatmodell abra terv,
- Product, Cart, Order, OrderItem, UserProfile, Coupon, Invoice entitasok.

Meg teendo:

- a vegleges abrakat beilleszteni,
- minden abra ala rovid magyarazatot irni,
- megmutatni az adatfolyamot: checkout -> order -> stock/audit -> PDF/email/AI.

### MI-hasznalat

Lefedett segedanyagok:

- fejlesztest tamogato MI hasznalat,
- webshopban mukodo AI asszisztens kulon valasztasa,
- OpenRouter/Worker proxy,
- ellenorzes, korlatok, felelosseg.

Meg teendo:

- a fejezetet sajat hangra atirni,
- ne maradjon benne munkautasitas vagy "kesz sablon" stilus,
- kulon mondatban leirni: a dontesekert, tesztelesert es vegleges kodert te vallalsz felelosseget.

## Legfontosabb kockazatok

1. A dolgozati Word/PDF ne maradjon placeholderes.
2. A kesz szoveg ne tunjon tul sablonosnak, foleg az MI-hasznalati es biztonsagi fejezetben.
3. A kodreszlet-sorok legyenek frissitve a vegleges kodhoz.
4. A publikus repoba ne keruljenek vissza helyi segedanyagok.
5. A kepernyokepek es abrak nelkul a dolgozat meg munkaverzionak fog hatni.

## Hetfoi/zarasi prioritas

1. Kepernyokepek elkeszitese a `02_kepernyokep_abra_kodterv.md` alapjan.
2. Abrak behelyezese: use case, komponensarchitektura, adatmodell, checkout/rendeles szekvencia.
3. Kodreszletek vegleges sorainak frissitese.
4. Cimplap, A4, tartalomjegyzek, irodalomjegyzek, feladatkiiras rendezese.
5. Biztonsagi es tesztelesi fejezet sajat nyelvre atirasa.
6. MI-hasznalati fejezet sajat nyelvre atirasa.
7. Kezi teszt checklist vegigpipalasa.
8. Vegso build, teszt, CI kepernyokep.

## Oszinte ertekeles a segedanyagokrol

A segedanyagok a konzulensi levelek alapjan jo iranyba vannak osszerakva. Nem az a fo gond, hogy hianyozna beloluk valami nagy blokk, hanem az, hogy a dolgozatba kerulo vegleges anyagnak sajat hangon, konkret kepekkel, abrakkal es bizonyitekokkal kell megszuletnie.

Ha ezek alapjan dolgozol, a szakdolgozat szerkezete vedheto. Ha viszont a segedanyagok sablonmondatai vagy placeholder-ei bekerulnek valtozatlanul, az rontana az osszkepet. A kulcs most: bizonyitas + sajat megfogalmazas.
