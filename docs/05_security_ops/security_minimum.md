# Biztonsagi minimum ellenorzes

Ez a dokumentum a konzulensi mintacsomag `09_biztonsagi_minimum_sablon.md` tartalmahoz igazodik. A cel az, hogy a TDL Webshop biztonsagi alapjai ne csak kodban, hanem ellenorizheto formaban is latszodjanak.

## 1. Ellenorzo tabla

| Terulet | Ellenorzes | Bizonyitek | Aktualis allapot |
|---|---|---|---|
| Titkok kezelese | Nincs valodi jelszo, token vagy privat API kulcs a repoban. | `.env.example`, `.gitignore`, `git grep` jellegu ellenorzes | OK, commit/push elott ujra futtatando |
| OpenRouter kulcs | A kulcs nem frontend fajlban van. | `workers/openrouter-proxy`, Cloudflare Worker secret | OK |
| Firebase config | A web config nem klasszikus titok, de a rules vedik az adatokat. | `src/environments/*`, `firestore.rules` | OK, dolgozatban magyarazando |
| Generalt mappak | `node_modules`, `functions/node_modules`, `dist`, `.angular` nincs verziozva. | `.gitignore`, `git status` | OK, vegso commit elott ellenorizendo |
| Auth | Vasarlo, dolgozo es admin szerepkor kulon kezelve. | `AuthService`, admin guard, Firestore rules | OK |
| Authorization | Dolgozo nem kap teljes admin jogot. | admin role/permission logika | OK, manualis teszt szukseges |
| Tiltott profil | Tiltott user vagy mentett vasarlo ne tudjon rendelni. | profil `disabled` logika, rules es UI ellenorzes | OK, manualis teszt szukseges |
| Input validacio | Email, telefon, ceges adatok es checkout mezok validaltak. | checkout/admin urlapok | OK, manualis teszt szukseges |
| Kupon visszaeles | Kedvezmeny csak ervenyes kuponnal szamolhato. | checkout es kuponkezeles | OK, tesztelendő |
| PDF/szamla | A PDF a rendelés adataibol generalodik, nem kulso titokbol. | invoice/PDF logika | OK, layout manualisan ellenorizendo |
| XSS alapvedelem | Angular template binding escape-el. | Angular komponensek | OK |
| Audit | Rendelés statuszvaltas naplozhato. | status audit / rendelés update logika | OK |

## 2. Titokkezeles

A repoban csak mintakonfiguracio szerepelhet. Az `.env.example` celja, hogy megmutassa, milyen valtozokra lehet szukseg, de valodi kulcsot vagy jelszot nem tartalmazhat.

Kiemelt szabalyok:

- OpenRouter API kulcs nem kerulhet Angular environment fajlba.
- Demo jelszo nem kerulhet dokumentacioba vagy forraskodba.
- Ha egy kulcs valaha bekerult fajlba vagy chatbe, azt vissza kell vonni es ujat kell generalni.
- Cloudflare Worker eseteben a kulcs `OPENROUTER_API_KEY` secretkent van tarolva.

## 3. Firebase biztonsagi modell

A Firebase web app config tartalmaz `apiKey` mezot, de webes Firebase alkalmazasnal ez nem tekintheto klasszikus privat titoknak. A valodi adatvedelmi kontrollt a Firestore security rules adja:

- szerepkor alapu hozzaferes admin, dolgozo es vasarlo kozott;
- tiltott felhasznalo ellenorzese;
- guest rendelés korlatozott letrehozasa;
- audit log vedelme;
- validalt mezok es tipusok.

Ezt a dolgozatban roviden erdemes ugy megfogalmazni, hogy a kliensoldali config publikus azonosito jellegu, a jogosulatlan adatmuveleteket viszont a szerveroldali Firestore szabalyok akadalyozzak meg.

## 4. AI asszisztens biztonsaga

Az AI asszisztens nem kozvetlenul hivja az OpenRouter API-t a bongeszobol. A frontend csak a Cloudflare Worker URL-t ismeri. A Worker:

- ellenorzi az engedelyezett origin-t;
- csak domainhez kapcsolodo kerdeseket enged tovabb;
- nem ad vissza modellt vagy secretet a kliensnek;
- nem ajanlhat olyan termeket, amely nem szerepel a megadott katalogusreszletben;
- ha nincs relevans talalat, ovatos szakmai valaszt ad es szemelyes/emailes egyeztetest javasol.

## 5. Beadas elotti parancsok

```bash
git grep -n -i -E "password|secret|api[_-]?key|sk-or|openrouter" -- . ':!functions/node_modules' ':!node_modules' ':!dist' ':!.angular'
git status --short -- . ':!functions/node_modules'
npm run build
npm test -- --watch=false
```

A talalatok kozott lehetnek jogos mintak is, peldaul `.env.example`, Firebase `apiKey`, vagy koddal kapcsolatos `password` valtozonevek. Ezeket egyesevel kell ertelmezni, nem automatikusan hibanak tekinteni.
