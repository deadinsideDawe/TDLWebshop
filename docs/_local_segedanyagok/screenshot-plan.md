# Kepernyokep terv a szakdolgozathoz

Ez a lista abban segit, hogy melyik oldalt melyik belepessel erdemes lefotozni, es milyen celbol hasznos a kep a szakdolgozatban.

## 1. Nyilvanos webshop nezet

### Kezdolap

- Belepes: nem kell
- Oldal: `Kezdolap`
- Mit fotozz:
  - fejléc keresovel
  - kategoriak legordulo menuje nyitva
  - hero szekcio
  - kiemelt termekek blokk
- Mire jo:
  - nyilvanos felulet bemutatasa
  - arculat es UX ismertetese

### Termeklista

- Belepes: nem kell
- Oldal: `Termekek`
- Mit fotozz:
  - bal oldali szurok
  - termekkartyak
  - csomagajanlo blokk
- Mire jo:
  - szuresi lehetosegek
  - termekbongeszes

### Termekadatlap

- Belepes: nem kell
- Oldal: egy konkret termek reszletei
- Mit fotozz:
  - termekkep
  - ar, keszlet, kosar gomb
  - leiras vagy kapcsolodo termekek
- Mire jo:
  - termek reszletes nezet

### Kosar es checkout

- Belepes: nem kell
- Oldal: `Kosar`, majd `Checkout`
- Mit fotozz:
  - kosar tetelei
  - checkout urlap
  - ceges vasarlas opcio
  - szallitasi es fizetesi mod
- Mire jo:
  - rendelesi folyamat bemutatasa

### Kapcsolat oldal

- Belepes: nem kell
- Oldal: `Kapcsolat`
- Mit fotozz:
  - kapcsolatkartya
  - urlap
- Mire jo:
  - plusz informacios oldal bemutatasa

## 2. Vasarloi profil

- Belepes:
  - Email: `vasarlo.teszt@tdlwebshop.hu`
  - Jelszo: helyi tesztjelszo, ne commitold
- Oldal: `Profil`
- Mit fotozz:
  - profil adatok szerkesztese
  - korabbi rendelesek lista
  - rendelesi allapot kovetese
- Mire jo:
  - regisztralt felhasznaloi funkcionalitas

## 3. Admin felulet

- Belepes:
  - Email: `teszt@tdlwebshop.hu`
  - Jelszo: a sajat admin jelszavad

### Admin attekintes

- Oldal: `Admin > Attekintes`
- Mit fotozz:
  - statisztikai kartyak
  - beveteli blokk
  - legutobbi rendelesek
  - alacsony keszlet figyelo
- Mire jo:
  - vezetoi nezet bemutatasa

### Admin ertesitesek

- Oldal: `Admin > Ertesitesek`
- Mit fotozz:
  - jovahagyando fizetesi hataridok listaja
- Mire jo:
  - admin-only jovahagyasi folyamat bemutatasa

### Admin keszlet

- Oldal: `Admin > Keszlet`
- Mit fotozz:
  - kategoriara szurt keszletlista
  - okos keszletfigyeles blokk
- Mire jo:
  - keszletkezeles es utanrendelesi javaslat bemutatasa

### Admin termekkezeles

- Oldal: `Admin > Termekek`
- Mit fotozz:
  - uj termek felvetele urlap
  - kategoriavalaszto legordulo menu
  - csv import blokk
  - termeklista szerkesztesi nezet
- Mire jo:
  - kataloguskezeles ismertetese

### Admin rendelesek

- Oldal: `Admin > Rendelesek`
- Mit fotozz:
  - rendeleslista
  - helyszini vasarlas rogzitese blokk
  - rendelés reszletei modal
- Mire jo:
  - rendelesfeldolgozas es helyszini ertekesites bemutatasa

### Admin felhasznalok

- Oldal: `Admin > Felhasznalok`
- Mit fotozz:
  - uj profil letrehozasa blokk
  - dolgozoi jogosultsag checkboxok
  - felhasznalolista
- Mire jo:
  - jogosultsagi rendszer es belso profilkezeles bemutatasa

### Admin sajat adatok

- Oldal: `Admin > Sajat adatok`
- Mit fotozz:
  - sajat szerepkor es aktiv jogosultsagok
- Mire jo:
  - belso felhasznaloi nezet szemleltetese

## 4. Dolgozoi nezetek

### Ertekesito dolgozo

- Belepes:
  - Email: `ertekesito.teszt@tdlwebshop.hu`
  - Jelszo: helyi tesztjelszo, ne commitold
- Fotozd:
  - hogy a `Rendelesek`, `Keszlet`, `Sajat adatok` latszik
  - hogy a `Felhasznalok` es `Ertesitesek` nem
- Mire jo:
  - korlatozott dolgozoi hozzaferes bizonyitasa

### Raktaros dolgozo

- Belepes:
  - Email: `raktar.teszt@tdlwebshop.hu`
  - Jelszo: helyi tesztjelszo, ne commitold
- Fotozd:
  - hogy a `Termekek` es `Keszlet` latszik
  - hogy a `Rendelesek` nem
- Mire jo:
  - munkakorhoz kotott jogosultsagok bemutatasa

### Teljeskoru dolgozo

- Belepes:
  - Email: `dolgozo.profi@tdlwebshop.hu`
  - Jelszo: helyi tesztjelszo, ne commitold
- Fotozd:
  - hogy tobb dolgozoi modul latszik egyszerre
  - hogy admin-only ertesitesek tovabbra sem jelennek meg
- Mire jo:
  - dolgozoi szerepkor rugalmassaganak bemutatasa

## 5. Szamla / PDF

- Belepes: admin vagy olyan dolgozo, aki tud helyszini vasarlast rogzitni
- Oldal: `Admin > Rendelesek` vagy helyszini vasarlas mentese utan letoltott PDF
- Mit fotozz:
  - fejléc logoval
  - kiallitó es vevő blokk
  - tetellista
  - vegosszeg blokk
- Mire jo:
  - dokumentumgeneralas bemutatasa

## 6. Javasolt sorrend a kepernyokepekhez

1. Kezdolap
2. Termeklista
3. Termekadatlap
4. Kosar
5. Checkout
6. Vasarlo profil
7. Admin attekintes
8. Admin keszlet
9. Admin termekek
10. Admin rendelesek
11. Admin felhasznalok
12. Admin ertesitesek
13. Dolgozoi nezetek
14. Szamla PDF

## 7. Tipp a szakdolgozatba

Ha keves helyed van, akkor a legerosebb kepek altalaban ezek:

- kezdolap
- termeklista
- checkout
- admin attekintes
- admin felhasznalok / dolgozoi jogosultsagok
- helyszini vasarlas rogzitese
- szamla PDF
