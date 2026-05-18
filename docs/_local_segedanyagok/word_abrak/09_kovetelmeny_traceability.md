# Kovetelmeny-traceability osszefoglalo

## Javasolt helye a szakdolgozatban

Ezt a reszt a kovetelmenyek fejezet utan, a fo use case-ek bemutatasa ele erdemes beilleszteni.

Javasolt fejezethely:

**3. Kovetelmenyek es use case-ek**  
**3.1. Kovetelmeny-traceability osszefoglalo**  
**3.2. Fo use case-ek**

Javasolt tablazatfelirat:

**3. tablazat: Kovetelmeny-traceability osszefoglalo**

## Beillesztheto bevezeto szoveg

A kovetelmeny-traceability tablazat celja, hogy a rendszerrel szemben megfogalmazott fo elvarasokat osszekosse a hozza tartozo felhasznaloi folyamatokkal, megvalositott modulokkal es bizonyitekokkal. Ez segit abban, hogy a dolgozatban ne csak felsorolasszeruen jelenjenek meg a funkciok, hanem ellenorizheto legyen, hogy az egyes kovetelmenyek melyik rendszerreszben valosultak meg, es hogyan lehet oket tesztelni vagy bemutatni.

## 3. tablazat - Kovetelmeny-traceability osszefoglalo

| Azonosito | Kovetelmeny | Use case | Modul / bizonyitek |
|---|---|---|---|
| K1 | A felhasznalo tudjon termeket keresni es kategoriak szerint bongeszni. | Termekek bongeszese | Termeklista oldal, keresesi mezo, kategoriak |
| K2 | A felhasznalo tudjon termeket kosarba tenni es mennyiseget modositani. | Kosarkezeles | CartService, kosar oldal |
| K3 | A checkout ellenorizze az e-mailt, telefonszamot es kotelezo adatokat. | Rendeles leadasa | checkout.ts validacios logika |
| K4 | A rendeles letrejotte utan az admin lassa es modositani tudja az allapotot. | Admin rendeleskezeles | admin.ts, order.service.ts |
| K5 | A statuszvaltas audit es keszletvaltozas mellett tortenjen. | Rendeles teljesitese | OrderService tranzakcios logika |
| K6 | A dolgozo csak korlatozott admin funkciokat erjen el. | Dolgozoi felulet | Firestore rules, admin jogosultsagi logika |
| K7 | A PDF-bizonylat tartalmazza a rendelest, vevot, tetelek es osszegeket. | Szamla / bizonylat letoltese | invoice.service.ts |
| K8 | Az AI-asszisztens ne talaljon ki termeket, csak katalogushoz kototten ajanljon. | AI-kerdes megvalaszolasa | chatbot-llm.service.ts, Worker-proxy |

## Beillesztheto magyarazat a tablazat utan

A tablazat alapjan lathato, hogy minden fontosabb funkciohoz rendelheto legalabb egy felhasznaloi folyamat es egy konkret megvalositasi bizonyitek. A TDLWebshop eseteben a kovetelmenyek nem kulonallo technikai elemekkent jelennek meg, hanem egymasra epulo folyamatokat alkotnak. A termekkereses es a kosarkezeles a vasarloi ut elejet fedi le, a checkout es a rendeleskezeles a tranzakcios folyamatot bizonyitja, mig az admin, dolgozoi jogosultsag, keszletvaltozas es PDF-bizonylat a rendszer uzemeltetesi oldalat erositi.

Kulon figyelmet kapott az AI-asszisztens is, mert ez nem altalanos chatbotkent mukodik, hanem a sajat termekkatalogushoz es az epuletgepeszeti temakorhoz kototten ad valaszt. Ez fontos MVP-korlat, mert csokkenti annak kockazatat, hogy a rendszer nem letezo termeket vagy tul bizonytalan szakmai ajanlast adjon.

## Kapcsolodo kepernyokepek es kodreszletek

Ezeket a bizonyitekokat erdemes a dolgozat kesobbi fejezeteiben keppel vagy rovid kodreszlettel alatamasztani:

| Kovetelmeny | Javasolt kepernyokep / kodreszlet |
|---|---|
| K1 | Termeklista oldal keresessel es kategoriaval |
| K2 | Kosar oldal tobb termekkel, mennyisegmodositassal |
| K3 | Checkout oldal hibas e-mail vagy telefonszam peldaval, valamint a validacios kodreszlet |
| K4 | Admin rendeleslista es statuszmodositas |
| K5 | OrderService statusz/audit/keszlet tranzakcios mukodese |
| K6 | Firestore rules jogosultsagi resz es dolgozoi admin nezet |
| K7 | General PDF-bizonylat kepernyokepe, invoice.service.ts relevans resze |
| K8 | AI-asszisztens ablaka es az OpenRouter Worker-proxy kodreszlete |

