# Regressziós Ellenőrzőlista (Kézi)

Ez a lista a végső szakdolgozati bemutató előtti gyors kézi körhöz készült.

## 1. Nyitó oldal és navigáció
- [ ] A főoldal betölt, a hero blokk és a kategóriák látszanak.
- [ ] A felső kereső és a kategória gombok működnek.
- [ ] A light/dark mód váltás működik, szövegek olvashatók maradnak.

## 2. Terméklista és szűrés
- [ ] A `/products` oldal azonnal betölt termékeket.
- [ ] Kategória szűrés működik (legalább 2 kategórián tesztelve).
- [ ] Ár és készlet szűrés működik.
- [ ] A “Részletek” popup megnyílik és bezárható.

## 3. Kosár és checkout
- [ ] “Kosárba” után felugró ablak jelenik meg.
- [ ] Kosár oldalon tétel törlés működik.
- [ ] Checkout oldalon kötelező mező validációk működnek.
- [ ] “Személyes átvétel” választható, időpont megadható.

## 4. Rendelés leadás
- [ ] Rendelés menthető, hiba nélkül visszajelzést ad.
- [ ] Sikeres rendelés után kosár ürül.
- [ ] Profil oldalon a rendelés megjelenik.

## 5. Admin panel
- [ ] Nem admin user nem éri el az admin oldalt.
- [ ] Admin belépés után áttekintés betölt (termék/rendelés/felhasználó számok).
- [ ] Rendelés státusz módosítás működik.
- [ ] Státuszváltás után rendelés és készlet változása konzisztens.
- [ ] Alacsony készlet figyelmeztetés megjelenik.

## 6. Hírek és promó
- [ ] Adminban új hír menthető.
- [ ] Főoldalon a hír megjelenik és váltakozik.
- [ ] Hír kattintási cél (kategória/promó) helyesen navigál.

## 7. Stabilitás és minőség
- [ ] `npm run build` sikeres.
- [ ] `npm test -- --watch=false` sikeres.
- [ ] Firebase hosting URL működik (https://tdlwebshop.web.app).

## Eredmény összegzés (kitöltendő)
- Teszt dátum:
- Tesztelő:
- Talált hibák:
- Javítás után újratesztelve: Igen / Nem
