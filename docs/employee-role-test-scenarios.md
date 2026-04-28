# Dolgozoi jogosultsagok tesztforgatokonyve

Ez a dokumentum a belso szerepkorok gyors vegigtesztelesehez keszult. A cel, hogy a szakdolgozat bemutatoja elott rovid idon belul ellenorizni tudd, hogy az `admin`, a `dolgozo` es a `vasarlo` szerepkor tenyleg a vart feluleteket es muveleteket eri el.

## 1. Tesztfiókok

### Admin

- Email: `teszt@tdlwebshop.hu`
- Jelszo: a sajat admin jelszavad

### Dolgozo 1 - Ertekesito

- Email: `ertekesito.teszt@tdlwebshop.hu`
- Jelszo: kulon helyi tesztjelszo, ne tarold a repoban
- Elvart jogok:
  - helyszini vasarlas rogzitese: igen
  - keszlet megtekintese: igen
  - termekkezeles: nem
  - vasarlok kezelese: igen
  - vasarlok tiltasa: nem

### Dolgozo 2 - Raktaros

- Email: `raktar.teszt@tdlwebshop.hu`
- Jelszo: kulon helyi tesztjelszo, ne tarold a repoban
- Elvart jogok:
  - helyszini vasarlas rogzitese: nem
  - keszlet megtekintese: igen
  - termekkezeles: igen
  - vasarlok kezelese: nem
  - vasarlok tiltasa: nem

### Dolgozo 3 - Teljeskoru dolgozo

- Email: `dolgozo.profi@tdlwebshop.hu`
- Jelszo: kulon helyi tesztjelszo, ne tarold a repoban
- Elvart jogok:
  - helyszini vasarlas rogzitese: igen
  - keszlet megtekintese: igen
  - termekkezeles: igen
  - vasarlok kezelese: igen
  - vasarlok tiltasa: igen

### Vasarlo

- Email: `vasarlo.teszt@tdlwebshop.hu`
- Jelszo: kulon helyi tesztjelszo, ne tarold a repoban

## Fontos megjegyzes

A tesztfiokokhoz tartozó jelszavakat beadás előtt vagy publikus repo használata esetén ne tartsd dokumentációban vagy commitolt fájlban. Ezeket csak helyi, nem verziókezelt jegyzetben vagy jelszókezelőben érdemes tárolni.

## 2. Admin szerepkor tesztje

- [ ] Belep az admin feluletre.
- [ ] Latszik: `Attekintes`, `Ertesitesek`, `Keszlet`, `Termekek`, `Rendelesek`, `Felhasznalok`, `Sajat adatok`.
- [ ] Lathato a fizetesi hatarido-jovahagyasi lista.
- [ ] Tud uj profilt letrehozni.
- [ ] Tud dolgozo profilt letrehozni jogosultsagokkal.
- [ ] Tud vasarlo profilt letrehozni teljes adatokkal.
- [ ] Tud felhasznalot szerepkor szerint modositani.
- [ ] Tud felhasznalot tiltani.
- [ ] Tud termeket torolni.
- [ ] Tud teljes rendelesi es keszletfolyamatot kezelni.

## 3. Ertekesito dolgozo tesztje

- [ ] Belep a belso feluletre.
- [ ] Nem latszik az `Attekintes` fül.
- [ ] Nem latszik az `Ertesitesek` fül.
- [ ] Nem latszik a `Felhasznalok` fül.
- [ ] Latszik a `Keszlet` fül.
- [ ] Latszik a `Rendelesek` fül.
- [ ] Nem latszik a `Termekek` fül.
- [ ] Latszik a `Sajat adatok` fül.
- [ ] Tud helyszini vasarlast rogzitni.
- [ ] Tud mentett vasarlot kivalasztani.
- [ ] Tud uj vasarlo profilt menteni.
- [ ] Nem tud vasarlot letiltani.
- [ ] Nem tud termeket torolni vagy szerkeszteni.

## 4. Raktaros dolgozo tesztje

- [ ] Belep a belso feluletre.
- [ ] Nem latszik az `Attekintes` fül.
- [ ] Nem latszik az `Ertesitesek` fül.
- [ ] Nem latszik a `Felhasznalok` fül.
- [ ] Latszik a `Keszlet` fül.
- [ ] Latszik a `Termekek` fül.
- [ ] Nem latszik a `Rendelesek` fül.
- [ ] Latszik a `Sajat adatok` fül.
- [ ] Tud uj termeket felvenni.
- [ ] Tud termeket szerkeszteni.
- [ ] Nem tud termeket torolni.
- [ ] Nem tud helyszini vasarlast menteni.
- [ ] Nem tud vasarlo profilt kezelni.

## 5. Teljeskoru dolgozo tesztje

- [ ] Belep a belso feluletre.
- [ ] Nem latszik az `Attekintes` fül.
- [ ] Nem latszik az `Ertesitesek` fül.
- [ ] Nem latszik a `Felhasznalok` fül.
- [ ] Latszik a `Keszlet` fül.
- [ ] Latszik a `Termekek` fül.
- [ ] Latszik a `Rendelesek` fül.
- [ ] Latszik a `Sajat adatok` fül.
- [ ] Tud helyszini vasarlast menteni.
- [ ] Tud uj termeket feltolteni.
- [ ] Tud vasarlot felvenni.
- [ ] Tud vasarlot letiltani.
- [ ] Nem tud fizetesi hataridot jovahagyni.
- [ ] Nem tud admin vagy customer szerepkort kiosztani a teljes felhasznalolistan.

## 6. Vasarlo tesztje

- [ ] Belep a webshopba.
- [ ] Nem jelenik meg admin/belso felulet link.
- [ ] A sajat profiloldal elerheto.
- [ ] A korabbi rendelesek latszanak.
- [ ] A rendeles allapot nyomon kovetheto.
- [ ] A belso admin oldalra nem jut be.

## 7. Tesztelesi javaslat a bemutato elott

1. Eloszor adminnal ellenorizd, hogy a szerepkorok helyesen vannak beallitva.
2. Masodik korben jelentkezz be az `ertekesito` fiokkal, es probalj helyszini vasarlast felvenni.
3. Harmadik korben jelentkezz be a `raktaros` fiokkal, es probalj termeket feltolteni.
4. Negyedik korben jelentkezz be a `dolgozo.profi` fiokkal, es nezd meg, hogy minden dolgozoi funkcio egyszerre elerheto.
5. Vegul egy sima vasarloval ellenorizd, hogy nincs belso hozzaferes.
