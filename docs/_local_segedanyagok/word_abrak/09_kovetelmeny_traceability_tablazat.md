# Kovetelmeny-traceability osszefoglalo

Javasolt hely a dolgozatban: **3. Kovetelmenyek es use case-ek** fejezet, a funkcionális kovetelmenyek utan.

Javasolt bevezeto szoveg:

A kovetelmenyek teljesuleset traceability tablazatban foglaltam ossze. A tablazat celja, hogy minden fontosabb funkcionális elvarashoz lathato legyen a hozza kapcsolodo use case, valamint az a modul vagy bizonyitek, amely igazolja a megvalositast. Ez a megkozelites segit abban, hogy a rendszer mukodese ne csak felsorolt funkciokent jelenjen meg, hanem ellenorizheto fejlesztesi eredmenykent is.

## 3. tablazat - Kovetelmeny-traceability osszefoglalo

| Azonosito | Kovetelmeny | Use case | Modul / bizonyitek |
|---|---|---|---|
| K1 | A felhasznalo tudjon termeket keresni es kategoriak szerint bongeszni. | Termekek bongeszese | Termeklista oldal, keresesi mezo, kategoriak |
| K2 | A felhasznalo tudjon termeket kosarba tenni es mennyiseget modositani. | Kosarkezeles | `CartService`, kosar oldal |
| K3 | A checkout ellenorizze az e-mailt, telefonszamot es kotelezo adatokat. | Rendeles leadása | `checkout.ts` validacios logika |
| K4 | A rendeles letrejotte utan az admin lassa es modositani tudja az allapotot. | Admin rendeleskezeles | `admin.ts`, `order.service.ts` |
| K5 | A statuszvaltas audit es keszletvaltozas mellett tortenjen. | Rendeles teljesitese | `OrderService` tranzakcios logika |
| K6 | A dolgozo csak korlatozott admin funkciokat erjen el. | Dolgozoi felulet | `firestore.rules`, admin jogosultsagi logika |
| K7 | A PDF-bizonylat tartalmazza a rendelest, vevot, tetelekt es osszegeket. | Szamla / bizonylat letoltese | `invoice.service.ts` |
| K8 | Az AI-asszisztens ne talaljon ki termeket, csak katalogushoz kototten ajanljon. | AI-kerdes megvalaszolasa | `chatbot-llm.service.ts`, Worker-proxy |

Javasolt magyarazat a tablazat utan:

A traceability tablazat alapjan lathato, hogy a legfontosabb kovetelmenyekhez kapcsolodik konkret use case es megvalositasi bizonyitek. A vasarloi oldalhoz tartozo kovetelmenyek elsosorban a termekkeresesre, kosarkezelesre es rendelesleadasra epulnek. Az adminisztracios kovetelmenyek a rendelesek feldolgozasat, a statuszvaltasok naplozasat, a keszletvaltozasokat es a szerepkor alapu hozzaferest fedik le. Kulon kovetelmenykent jelenik meg a PDF bizonylat generalasa es az AI asszisztens korlatozott, katalogushoz kotott mukodese is, mert ezek a rendszer termekszeru jellegét es szakdolgozati tobbleterteket erosítik.

Javasolt rovid kod-kapcsolodas a dolgozatba:

- `checkout.ts`: checkout urlap validacioja es rendelesinditas.
- `order.service.ts`: rendelesmentes, statuszvaltas, audit es keszletkezeles.
- `invoice.service.ts`: PDF bizonylat felepitese.
- `firestore.rules`: jogosultsagi es adatvedelmi szabalyok.
- `chatbot-llm.service.ts`: AI asszisztens kliensoldali logikaja.
- `workers/openrouter-proxy/src/index.js`: szerveroldali OpenRouter proxy.
