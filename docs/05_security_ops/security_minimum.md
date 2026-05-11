# Biztonsagi minimum ellenorzes

Ez a dokumentum a konzulensi mintacsomag `09_biztonsagi_minimum_sablon.md` szempontrendszerehez igazodik. A cel az, hogy a TDLWebshop biztonsagi alapjai ne csak a kodban, hanem ellenorizheto formaban is latszodjanak.

## 1. Ellenorzo tabla

| Terulet | Ellenorzes | Bizonyitek | Aktualis allapot |
|---|---|---|---|
| Titkok kezelese | Nincs valodi jelszo, token vagy privat API kulcs a repoban. | `.env.example`, `.gitignore`, secret scan jellegu ellenorzes | OK, beadas elott ujra ellenorizendo |
| OpenRouter kulcs | A kulcs nem frontend fajlban van. | `workers/openrouter-proxy`, Cloudflare Worker secret | OK |
| AI kvota/rate limit | CORS mellett alap keresszam-korlat is van. | `workers/openrouter-proxy/src/index.js` | OK, Worker szinten bevezetve |
| NPM audit | Teljes es production fuggosegek ismert serulekenysegei. | `npm audit`, `npm audit --omit=dev` | OK, 2026-05-11: 0 talalat |
| Firebase config | A web config nem klasszikus titok, de a rules vedik az adatokat. | `src/environments/*`, `firestore.rules` | OK, dolgozatban magyarazando |
| Generalt mappak | `node_modules`, `functions/node_modules`, `dist`, `.angular` nincs verziozva. | `.gitignore`, `git ls-files` | OK |
| Auth | Vasarlo, dolgozo es admin szerepkor kulon kezelve. | `AuthService`, admin guard, Firestore rules | OK |
| Authorization | Dolgozo csak explicit megadott joggal kap muveleti hozzaferest. | admin permission logika, Firestore rules | OK |
| Tiltott profil | Tiltott user vagy mentett vasarlo ne tudjon rendelni. | profil `disabled` logika, rules es UI ellenorzes | OK, kezi teszttel bizonyitando |
| Input validacio | Email, telefon, ceges adatok es checkout mezok validaltak. | checkout/admin urlapok | OK, kezi teszttel bizonyitando |
| Kupon visszaeles | Kedvezmeny csak ervenyes kuponnal szamolhato. | checkout es kuponkezeles | OK, automata es kezi teszttel bizonyitando |
| Webes arszamitas | Kosar, arak es kedvezmenyek kliensoldalrol indulnak. | checkout logika, dolgozati korlatleiras | MVP-korlatkent dokumentalando |
| Keszletkezeles | Teljesiteskor keszlethiany eseten a folyamat hibaval megall. | `OrderService.updateOrderStatusWithAudit` | OK, szigoritas bevezetve |
| PDF/szamla | A PDF a rendeles adataibol generalodik, nem kulso titokbol. | invoice/PDF logika | OK, layout kezi teszttel bizonyitando |
| Guest profil | A guest profil azonositoja nem tartalmaz olvashato email cimet. | `CustomerDirectoryService` | OK, hash alapu azonosito |
| XSS alapvedelem | Angular template binding escape-el. | Angular komponensek | OK |
| Audit | Rendeles statuszvaltas naplozhato. | status audit / rendeles update logika | OK |

## 2. Titokkezeles

A repoban csak mintakonfiguracio szerepelhet. Az `.env.example` celja, hogy megmutassa, milyen valtozokra lehet szukseg, de valodi kulcsot vagy jelszot nem tartalmazhat.

Kiemelt szabalyok:

- OpenRouter API kulcs nem kerulhet Angular environment fajlba.
- Demo jelszo nem kerulhet dokumentacioba vagy forraskodba.
- Ha egy kulcs valaha bekerult fajlba, parancssorba vagy chatbe, azt vissza kell vonni es ujat kell generalni.
- Cloudflare Worker eseteben a kulcs `OPENROUTER_API_KEY` secretkent van tarolva.
- A Worker publikusan hivhato endpoint, ezert CORS mellett alap rate limit is korlatozza a tul gyakori kerdeseket.

## 3. Firebase biztonsagi modell

A Firebase web app config tartalmaz `apiKey` mezot, de webes Firebase alkalmazasnal ez nem tekintheto klasszikus privat titoknak. A valodi adatvedelmi kontrollt a Firestore security rules adja:

- szerepkor alapu hozzaferes admin, dolgozo es vasarlo kozott;
- tiltott felhasznalo ellenorzese;
- guest rendeles korlatozott letrehozasa;
- audit log vedelme;
- validalt mezok es tipusok;
- dolgozoi muveleteknel explicit jogosultsag ellenorzese.

Ezt a dolgozatban roviden erdemes ugy megfogalmazni, hogy a kliensoldali config publikus azonosito jellegu, a jogosulatlan adatmozgast viszont a szerveroldali Firestore szabalyok akadalyozzak meg.

## 4. Webes checkout es MVP-korlat

A webes checkout jelenlegi MVP-megoldasaban a kosar tartalma, az arak, a kuponkedvezmeny es a vegosszeg a kliensoldali folyamatbol indul. A rendeles adatai Firestore szabalyokkal es alkalmazaslogikaval validaltak, de egy teljes eles webshopban ezt erdemes lenne szerveroldali ar- es kuponellenorzessel megerositeni.

A dolgozatban ezt nem hibakent, hanem tudatos MVP-korlatkent kell leirni. A tovabbfejlesztesi irany: szerveroldali Cloud Function vagy mas backend vegpont, amely a termekar, kupon, szallitasi dij es fizetesi dij alapjan ujraszamolja a vegosszeget.

## 5. AI asszisztens biztonsaga

Az AI asszisztens nem kozvetlenul hivja az OpenRouter API-t a bongeszobol. A frontend csak a Cloudflare Worker URL-t ismeri. A Worker:

- ellenorzi az engedelyezett origin-t;
- alap rate limitet alkalmaz kliensenkent;
- csak domainhez kapcsolodo kerdeseket enged tovabb;
- nem ad vissza modellt vagy secretet a kliensnek;
- nem ajanl biztos termeket olyan esetben, amikor nincs pontos katalogus-talalat;
- ha nincs relevans talalat, ovatos szakmai valaszt ad es szemelyes vagy emailes egyeztetest javasol.

## 6. 2026-05-11-i ellenorzes

A konzulensi visszajelzes utan az alabbi ellenorzesek frissen lefutottak:

- `npm run build`: sikeres Angular production build, kimenet: `dist/webshop`.
- `npm test -- --watch=false`: 14 tesztfajl, 41 sikeres teszt, 0 hiba.
- `npm audit`: 0 ismert serulekenyseg.
- `npm audit --omit=dev`: 0 ismert production serulekenyseg.

Lokalis fejlesztes kozben Node.js 25 figyelmeztetes jelent meg, mert ez nem LTS verzio. A GitHub Actions es a javasolt reprodukcios kornyezet Node 22-t hasznal, ezert ez nem funkcionalis hiba, hanem kornyezeti megjegyzes.

## 7. Beadas elotti ellenorzes

A beadas elotti allapothoz az alabbi ellenorzeseket kell frissen lefuttatni es a dolgozat tesztelesi fejezeteben rogziteni:

```bash
git grep -n -i -E "password|secret|api[_-]?key|sk-or|openrouter" -- . ':!functions/node_modules' ':!node_modules' ':!dist' ':!.angular'
git ls-files node_modules functions/node_modules dist .angular .env .env.local .env.production
npm run build
npm test -- --watch=false
npm audit
npm audit --omit=dev
```

A talalatok kozott lehetnek jogos mintak is, peldaul `.env.example`, Firebase `apiKey`, vagy koddal kapcsolatos `password` valtozonevek. Ezeket egyesevel kell ertelmezni, nem automatikusan hibanak tekinteni.
