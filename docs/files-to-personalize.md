# Saját nyelvezetre átírandó fájlok

Ezeket a fájlokat érdemes beadás előtt átolvasni és saját megfogalmazásra igazítani. A kódot nem kell átírni csak emiatt, főleg a dokumentációs részeket.

## Legfontosabb fájlok

- [ ] `README.md`
  - Projektösszefoglaló, funkciólista, technológiai leírás.
  - Ezt mindenképp írd át saját hangra, mert ezt könnyen megnézhetik GitHubon.

- [ ] `docs/thesis-feature-summary.md`
  - A szakdolgozatban kiemelhető funkciók összefoglalója.
  - Ezt érdemes a dolgozatod stílusához igazítani.

- [ ] `docs/thesis-defense-notes.md`
  - Védésre használható kérdés-válasz jellegű jegyzet.
  - Ezt mindenképp olvasd át, hogy úgy tudd mondani, mintha a saját jegyzeted lenne.

- [ ] `docs/demo-script.md`
  - Bemutató forgatókönyv.
  - A sorrendet megtarthatod, de a mondatokat írd át úgy, ahogy te természetesen elmondanád.

- [ ] `docs/final-manual-checklist.md`
  - Végső ellenőrző lista.
  - Itt főleg akkor kell átírni, ha máshogy akarod végigtesztelni.

- [ ] `docs/manual-site-test-checklist.md`
  - Részletes pipálható tesztlista.
  - Ezt használhatod változtatás nélkül, de ha saját tesztelési sorrended van, egészítsd ki.

- [ ] `docs/employee-role-test-scenarios.md`
  - A dolgozói és admin jogosultsági tesztek forgatókönyve.
  - Akkor érdemes átírni, ha más tesztfiókokkal vagy más sorrendben akarod bemutatni.

- [ ] `docs/role-system-thesis-section.md`
  - A jogosultsági rendszer szakdolgozatos leírása.
  - Ezt mindenképp írd át a saját fogalmazásodra, mert jó eséllyel bekerül a dolgozat szövegébe.

- [ ] `docs/screenshot-plan.md`
  - Képernyőkép terv belépésekkel és oldalakkal.
  - Praktikus, ha ugyanebben a sorrendben készíted el az ábrákat a dolgozathoz.

- [ ] `docs/testing-thesis-section.md`
  - A tesztelés fejezet kész szakdolgozatos alapja.
  - Ezt mindenképp érdemes a saját fogalmazásodra formálni, mert jó eséllyel közvetlenül bekerül a dolgozatba.

- [ ] `docs/figure-captions.md`
  - Kész ábrafeliratok a képernyőképekhez.
  - Általában kisebb átírás elég, de jó, ha a saját szóhasználatodra igazítod.

- [ ] `docs/role-system-table.md`
  - Táblázatos jogosultsági összefoglaló.
  - Ezt szinte egy az egyben is be lehet tenni, de a kísérőszöveget érdemes saját stílusra igazítani.

## UX dokumentáció

- [ ] `docs/ux/README.md`
  - UX dokumentáció összefoglalója.

- [ ] `docs/ux/design_system.md`
  - Színek, dark/light mód, arculati döntések.
  - Itt érdemes saját indoklást írni arról, miért ezt a stílust választottad.

- [ ] `docs/ux/journeys.md`
  - Felhasználói folyamatok.
  - Ha a dolgozatban persona/user journey részt is írsz, ezt igazítsd saját fogalmazásra.

- [ ] `docs/ux/self_assessment.md`
  - Önálló értékelés.
  - Ezt mindenképp írd át saját hangra, mert személyesebb rész.

- [ ] `docs/ux/PR_DESCRIPTION_TEMPLATE.md`
  - Nem feltétlen kell a dolgozatba, de ha GitHub dokumentációként bent marad, érdemes átnézni.

- [ ] `docs/ux/EDIT_GUIDE.md`
  - Segédanyag a dokumentáció átírásához.
  - Ezt akár törölni is lehet beadás előtt, ha nem szeretnéd, hogy segédfájlként látszódjon.

## Tesztelési dokumentáció

- [ ] `docs/testing/regression-checklist.md`
  - Regressziós tesztlista.
  - Ha dolgozatban hivatkozol rá, írd át a saját tesztelési szokásaid szerint.

## Kódkommentek, amiket nem muszáj átírni

Ezekben vannak kommentek, de normál fejlesztői kommentek, nem feltűnőek:

- `src/pages/admin/admin.ts`
- `src/pages/checkout/checkout.ts`
- `src/pages/products/products.ts`
- `src/pages/home/home.ts`
- `src/app/services/order.service.ts`
- `src/app/services/invoice.service.ts`
- `src/app/services/product.service.ts`
- `firestore.rules`

Ezeket csak akkor írd át, ha valamelyik kommentet túl idegennek érzed. A legtöbb komment röviden azt magyarázza, hogy az adott blokk mit csinál.

## Amit nem kell saját nyelvezetre átírni

- `package.json`
- `firebase.json`
- `functions/package.json`
- képfájlok a `public/` mappában
- CSS fájlok, kivéve ha konkrét megjegyzést akarsz módosítani
- spec/test fájlok, ha nem zavar a jelenlegi megfogalmazás

## Javasolt sorrend

1. `README.md`
2. `docs/thesis-feature-summary.md`
3. `docs/thesis-defense-notes.md`
4. `docs/demo-script.md`
5. `docs/ux/self_assessment.md`
6. `docs/ux/design_system.md`
7. `docs/ux/journeys.md`

Ha kevés időd van, elég az első négyet átírni.
