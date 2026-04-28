# Deploy runbook

## Cél

Ez a dokumentum röviden összefoglalja, hogyan történik a projekt buildelése és publikálása, valamint mit kell tenni tipikus hibák esetén.

## Deploy folyamat

1. Lokális ellenőrzés:
   - `npm install`
   - `npm run build`
   - `npm test -- --watch=false`

2. Hosting deploy:
   - `firebase deploy --only hosting`

3. Firestore szabály deploy, ha szükséges:
   - `firebase deploy --only firestore:rules`

## Incident scenario 1: az alkalmazás nem buildel

Lehetséges okok:
- hibás TypeScript módosítás,
- hiányzó import,
- template vagy CSS hiba.

Teendők:
- nézd meg a build logot,
- az utolsó módosított oldalt vagy szolgáltatást ellenőrizd,
- szükség esetén térj vissza az utolsó stabil commitig vagy állapotig.

## Incident scenario 2: az admin funkció működik lokálisan, de nem ment Firebase-be

Lehetséges okok:
- Firestore rules megtagadják a műveletet,
- hibás szerepkör vagy employee permission,
- nem megfelelő mezőstruktúra kerül mentésre.

Teendők:
- ellenőrizd a bejelentkezett user szerepkörét,
- nézd meg a browser konzol hibát,
- hasonlítsd össze a mentett adat alakját a rules által elvárt mezőkkel,
- ha rules módosult, deploy-old újra a szabályokat.

## Rollback gondolatmenet

Mivel a projekt Firebase Hostingon fut, rollback esetén a legbiztonságosabb út:

- az utolsó ismert stabil verzió visszaállítása a repóból,
- új build készítése,
- újradeploy.

## Operatív megjegyzés

A jelenlegi környezet egy szakdolgozati és demó célú rendszer, ezért a runbook egyszerűbb, mint egy teljes éles termék esetén, de a fő hibaforgatókönyvek így is visszakövethetők.
