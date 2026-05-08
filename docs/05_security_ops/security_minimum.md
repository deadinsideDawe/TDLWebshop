# Biztonsági minimum ellenőrzés

Ez a dokumentum a konzulensi mintacsomag `09_biztonsagi_minimum_sablon.md` szempontrendszeréhez igazodik. A cél az, hogy a TDLWebshop biztonsági alapjai ne csak a kódban, hanem ellenőrizhető formában is látszódjanak.

## 1. Ellenőrző tábla

| Terület | Ellenőrzés | Bizonyíték | Aktuális állapot |
|---|---|---|---|
| Titkok kezelése | Nincs valódi jelszó, token vagy privát API kulcs a repóban. | `.env.example`, `.gitignore`, `git grep` jellegű ellenőrzés | OK, 2026-05-08 ellenőrizve |
| OpenRouter kulcs | A kulcs nem frontend fájlban van. | `workers/openrouter-proxy`, Cloudflare Worker secret | OK |
| Firebase config | A web config nem klasszikus titok, de a rules védik az adatokat. | `src/environments/*`, `firestore.rules` | OK, dolgozatban magyarázandó |
| Generált mappák | `node_modules`, `functions/node_modules`, `dist`, `.angular` nincs verziózva. | `.gitignore`, `git ls-files` | OK, 2026-05-08 ellenőrizve |
| Auth | Vásárló, dolgozó és admin szerepkör külön kezelve. | `AuthService`, admin guard, Firestore rules | OK |
| Authorization | Dolgozó nem kap teljes admin jogot. | admin role/permission logika | OK, manuális teszt szükséges |
| Tiltott profil | Tiltott user vagy mentett vásárló ne tudjon rendelni. | profil `disabled` logika, rules és UI ellenőrzés | OK, manuális teszt szükséges |
| Input validáció | Email, telefon, céges adatok és checkout mezők validáltak. | checkout/admin űrlapok | OK, manuális teszt szükséges |
| Kupon visszaélés | Kedvezmény csak érvényes kuponnal számolható. | checkout és kuponkezelés | OK, tesztelendő |
| PDF/számla | A PDF a rendelés adataiból generálódik, nem külső titokból. | invoice/PDF logika | OK, layout manuálisan ellenőrizendő |
| XSS alapvédelem | Angular template binding escape-el. | Angular komponensek | OK |
| Audit | Rendelés státuszváltás naplózható. | status audit / rendelés update logika | OK |

## 2. Titokkezelés

A repóban csak mintakonfiguráció szerepelhet. Az `.env.example` célja, hogy megmutassa, milyen változókra lehet szükség, de valódi kulcsot vagy jelszót nem tartalmazhat.

Kiemelt szabályok:

- OpenRouter API kulcs nem kerülhet Angular environment fájlba.
- Demo jelszó nem kerülhet dokumentációba vagy forráskódba.
- Ha egy kulcs valaha bekerült fájlba vagy chatbe, azt vissza kell vonni és újat kell generálni.
- Cloudflare Worker esetében a kulcs `OPENROUTER_API_KEY` secretként van tárolva.

## 3. Firebase biztonsági modell

A Firebase web app config tartalmaz `apiKey` mezőt, de webes Firebase alkalmazásnál ez nem tekinthető klasszikus privát titoknak. A valódi adatvédelmi kontrollt a Firestore security rules adja:

- szerepkör alapú hozzáférés admin, dolgozó és vásárló között;
- tiltott felhasználó ellenőrzése;
- guest rendelés korlátozott létrehozása;
- audit log védelme;
- validált mezők és típusok.

Ezt a dolgozatban röviden érdemes úgy megfogalmazni, hogy a kliensoldali config publikus azonosító jellegű, a jogosulatlan adatmozgásokat viszont a szerveroldali Firestore szabályok akadályozzák meg.

## 4. AI asszisztens biztonsága

Az AI asszisztens nem közvetlenül hívja az OpenRouter API-t a böngészőből. A frontend csak a Cloudflare Worker URL-t ismeri. A Worker:

- ellenőrzi az engedélyezett origin-t;
- csak domainhez kapcsolódó kérdéseket enged tovább;
- nem ad vissza modellt vagy secretet a kliensnek;
- nem ajánlhat biztos terméket olyan esetben, amikor nincs pontos katalógus-találat;
- ha nincs releváns találat, óvatos szakmai választ ad és személyes vagy emailes egyeztetést javasol.

## 5. 2026-05-08-i ellenőrzés

A beadás előtti állapothoz az alábbi ellenőrzések történtek:

- `npm run build`: sikeres Angular build.
- `npm test -- --watch=false`: 14 tesztfájl, 41 sikeres teszt, 0 hiba.
- `git ls-files` ellenőrzés: `node_modules`, `functions/node_modules`, `dist`, `.angular`, `.env` jellegű gépfüggő vagy érzékeny állomány nincs verziózva.
- secret scan: nem talált valódi privát kulcsot vagy jelszót; a találatok `.env.example` mintákra, Firebase web configra, dokumentációs magyarázatra, jelszó mezőnevekre és OpenRouter secret hivatkozásokra korlátozódtak.

Lokális fejlesztés közben a Node.js 25 figyelmeztetést adott, mert nem LTS verzió. A GitHub Actions és a javasolt reprodukciós környezet Node 22-t használ, ezért ez nem funkcionális hiba, hanem lokális környezeti megjegyzés.

## 6. Beadás előtti parancsok

```bash
git grep -n -i -E "password|secret|api[_-]?key|sk-or|openrouter" -- . ':!functions/node_modules' ':!node_modules' ':!dist' ':!.angular'
git ls-files node_modules functions/node_modules dist .angular .env .env.local .env.production
npm run build
npm test -- --watch=false
```

A találatok között lehetnek jogos minták is, például `.env.example`, Firebase `apiKey`, vagy kóddal kapcsolatos `password` változónevek. Ezeket egyesével kell értelmezni, nem automatikusan hibának tekinteni.
