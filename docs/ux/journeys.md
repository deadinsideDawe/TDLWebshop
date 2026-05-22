# Top 3 user journey

## 1. Vásárló terméket keres és rendelést ad le

**Persona:** lakossági vásárló, aki gyorsan szeretne épületgépészeti terméket keresni és rendelést leadni.

**Belépési pont:** S01 – Kezdőlap.

| Lépés | Képernyő | Felhasználói művelet | Rendszerválasz | Hibaág |
|---|---|---|---|---|
| 1 | S01 | Keresőszót ír be vagy kategóriát választ. | A rendszer a terméklistára navigál. | Ha nincs találat, üres állapot jelenik meg. |
| 2 | S03 | Megnyit egy terméket. | Megjelenik a termékadatlap. | Ha a termék nem található, hibaállapot jelenik meg. |
| 3 | S04 | Mennyiséget választ és kosárba teszi. | A termék bekerül a kosárba. | Nem pozitív mennyiség nem engedett. |
| 4 | S05 | Ellenőrzi a kosarat és továbbmegy. | Megnyílik a checkout. | Üres kosárnál nem indítható rendelés. |
| 5 | S06 | Megadja az adatokat, fizetési módot és elküldi. | Siker esetén rendelés jön létre. | Hibás email, telefon vagy hiányzó adat esetén S07 validációs állapot. |
| 6 | S08 | Megnézi a sikeres visszajelzést. | A rendelés az admin felületen is megjelenik. | Ha a mentés sikertelen, hibaüzenet jelenik meg. |

**Sikerkritérium:** a rendelés létrejön, a vásárló visszajelzést kap, az admin rendeléslistában megjelenik.

**Becsült idő:** 60–120 másodperc, kb. 8–12 kattintás.

## 2. Admin rendelést kezel és PDF bizonylatot tölt le

**Persona:** adminisztrátor, aki bejövő rendelést ellenőriz, státuszt módosít és bizonylatot generál.

**Belépési pont:** S17 – Login / regisztráció.

| Lépés | Képernyő | Felhasználói művelet | Rendszerválasz | Hibaág |
|---|---|---|---|---|
| 1 | S17 | Admin fiókkal bejelentkezik. | Megnyílik az admin áttekintés. | Hibás jogosultság esetén nincs admin hozzáférés. |
| 2 | S11 | A rendelések fülre lép. | Megjelenik a rendeléslista. | Üres lista esetén üres állapot látszik. |
| 3 | S13 | Kiválaszt egy rendelést és státuszt módosít. | A rendszer státuszt, auditot és készletváltozást kezel. | Készlethiány vagy jogosultsági hiba esetén figyelmeztetés. |
| 4 | S13 | Számla / bizonylat letöltésére kattint. | PDF generálódik. | Hiányos adatnál PDF hiba jelenik meg. |
| 5 | S15 | Megnyitja vagy lementi a PDF-et. | A bizonylat ellenőrizhető és dokumentálható. | Sikertelen generálásnál hibaüzenet. |

**Sikerkritérium:** a rendelés állapota frissül, az audit/készlet logika lefut, a PDF elérhető.

**Becsült idő:** 45–90 másodperc, kb. 6–9 kattintás.

## 3. Admin helyszíni vásárlást rögzít mentett vásárlóval

**Persona:** pultos/admin dolgozó, aki személyes vásárlást rögzít a webshop admin felületén.

**Belépési pont:** S17 – Login / regisztráció.

| Lépés | Képernyő | Felhasználói művelet | Rendszerválasz | Hibaág |
|---|---|---|---|---|
| 1 | S17 | Admin vagy dolgozói fiókkal bejelentkezik. | Megnyílik az engedélyezett admin felület. | Nem megfelelő szerepkörnél védett funkció nem látszik. |
| 2 | S11 | Helyszíni vásárlás rögzítéséhez navigál. | Megjelenik a helyszíni vásárlás űrlap. | Betöltési hiba esetén figyelmeztetés. |
| 3 | S14 | Mentett vásárlót választ vagy új adatot ad meg. | Az űrlap kitöltődik a vásárló adataival. | Tiltott vásárló esetén nem rögzíthet rendelést. |
| 4 | S14 | Terméket keres és tételekhez adja. | A rendszer árat, mennyiséget és végösszeget számol. | Nincs termék vagy hibás mennyiség esetén validáció. |
| 5 | S14 | Elmenti a vásárlást és PDF-et kér. | Helyszíni rendelés jön létre és bizonylat generálódik. | Mentési hiba esetén hibaüzenet. |
| 6 | S15 | Ellenőrzi a PDF bizonylatot. | A dokumentum nyomtatható vagy menthető. | PDF hiba esetén újrapróbálható. |

**Sikerkritérium:** a helyszíni vásárlás mentődik, a készlet frissül, a PDF bizonylat letölthető.

**Becsült idő:** 60–120 másodperc, kb. 8–12 kattintás.
