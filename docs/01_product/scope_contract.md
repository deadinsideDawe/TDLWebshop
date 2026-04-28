# Scope Contract

## MVP cél

Az MVP célja egy működő, bemutatható és tesztelhető épületgépészeti webshop elkészítése, amely támogatja az online vásárlást és az adminisztratív belső folyamatokat.

## MVP-be tartozó fő felhasználói történetek

1. Vásárlóként termékeket tudok böngészni, keresni és kosárba helyezni.
2. Vásárlóként rendelést tudok leadni, és a profilomban látom a korábbi rendeléseimet.
3. Vásárlóként kívánságlistába tudok menteni termékeket.
4. Adminisztrátorként termékeket tudok létrehozni, szerkeszteni és készletet kezelni.
5. Adminisztrátorként helyszíni vásárlást tudok rögzíteni, majd PDF bizonylatot generálni.
6. Adminisztrátorként és dolgozóként mentett vásárlókat tudok kezelni.
7. Adminisztrátorként szerepköröket és dolgozói jogosultságokat tudok beállítani.
8. Dolgozóként csak azokat a funkciókat érem el, amelyekhez külön jogosultságot kaptam.

## Elfogadási kritériumok

### Vásárlói felület

- A kezdőoldal betöltődik és kategóriák, kiemelt termékek, hírek, valamint navigációs elemek jelennek meg.
- A terméklista oldalon a felhasználó keresni és szűrni tud.
- A termékadatlap oldalon a fő információk, készlet és kosárgomb látható.
- A kosár és checkout végigjárható.
- A regisztrált felhasználó a profiloldalon látja az előző rendeléseit.

### Adminisztráció

- Az admin panel kizárólag jogosult belső felhasználók számára érhető el.
- Termék feltöltésekor kötelező mezők validálva vannak.
- A készletlista kategória szerint szűrhető.
- A helyszíni vásárlás mentett vásárlóval és kézi adatokkal is felvehető.
- A helyszíni vásárláshoz PDF bizonylat generálható.
- Az admin felhasználói profilokat hozhat létre, és dolgozói jogosultságokat adhat.

### Jogosultságkezelés

- A vásárló nem fér hozzá a belső admin felülethez.
- A dolgozó csak a számára engedélyezett füleket és műveleteket látja.
- Az admin teljes jogosultsággal rendelkezik.

## Scope fegyelem

Az MVP fejlesztése során tudatos döntés volt, hogy a funkciók mélysége helyenként korlátozott maradjon, ha ez a stabilitást vagy a leadhatóságot támogatja. Emiatt például a teljes online fizetési integráció nem került be a kötelező scope-ba, viszont a helyszíni értékesítés és az adminisztratív folyamatok nagyobb hangsúlyt kaptak.

## Halasztott vagy jövőbeli elemek

- éles fizetési szolgáltató integráció,
- részletes analitika dashboard,
- automatikus e-mail kampányrendszer,
- összetettebb árképzési szabályok,
- többnyelvűség.
