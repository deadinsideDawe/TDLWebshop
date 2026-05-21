# Top 3 user journey

## 1. Vasarlo termeket keres es rendelest ad le

**Persona:** lakossagi vasarlo, aki gyorsan szeretne epületgepeszeti termeket keresni es rendelest leadni.

**Belepesi pont:** S01 - Kezdolap.

| Lepes | Kepernyo | Felhasznaloi muvelet | Rendszervalasz | Hibaag |
|---|---|---|---|---|
| 1 | S01 | Keresoszot ir be vagy kategoriat valaszt. | A rendszer a termeklistara navigal. | Ha nincs talalat, ures allapot jelenik meg. |
| 2 | S03 | Megnyit egy termeket. | Megjelenik a termekadatlap. | Ha a termek nem talalhato, hibaallapot jelenik meg. |
| 3 | S04 | Mennyiseget valaszt es kosarba teszi. | A termek bekerul a kosarba. | Nem pozitiv mennyiseg nem engedett. |
| 4 | S05 | Ellenorzi a kosarat es tovabbmegy. | Megnyilik a checkout. | Ures kosarnal nem indithato rendelés. |
| 5 | S06 | Megadja az adatokat, fizetesi modot es elkuldi. | Siker eseten rendelés jon letre. | Hibas email, telefon vagy hianyzo adat eseten S07 validacios allapot. |
| 6 | S08 | Megnezi a sikeres visszajelzest. | A rendelés az admin feluleten is megjelenik. | Ha a mentes sikertelen, hiba uzenet jelenik meg. |

**Sikerkriterium:** a rendelés letrejon, a vasarlo visszajelzest kap, az admin rendeleslistaban megjelenik.

**Becsult ido:** 60-120 masodperc, kb. 8-12 kattintas.

## 2. Admin rendelest kezel es PDF bizonylatot tolt le

**Persona:** adminisztrator, aki bejovo rendelest ellenoriz, statuszt modosit es bizonylatot general.

**Belepesi pont:** S17 - Login / regisztracio.

| Lepes | Kepernyo | Felhasznaloi muvelet | Rendszervalasz | Hibaag |
|---|---|---|---|---|
| 1 | S17 | Admin fiokkal bejelentkezik. | Megnyilik az admin attekintes. | Hibas jogosultsag eseten nincs admin hozzaferes. |
| 2 | S11 | A rendelesek fulre lep. | Megjelenik a rendeleslista. | Ures lista eseten ures allapot latszik. |
| 3 | S13 | Kivalaszt egy rendelest es statuszt modosit. | A rendszer statuszt, auditot es keszletvaltozast kezel. | Keszlethiany vagy jogosultsagi hiba eseten figyelmeztetes. |
| 4 | S13 | Szamla / bizonylat letoltesere kattint. | PDF generalodik. | Hianyos adatnal PDF hiba jelenik meg. |
| 5 | S15 | Megnyitja vagy lementi a PDF-et. | A bizonylat ellenorizheto es dokumentalhato. | Sikertelen generalasnal hiba uzenet. |

**Sikerkriterium:** a rendelés allapota frissul, az audit/keszlet logika lefut, a PDF elerheto.

**Becsult ido:** 45-90 masodperc, kb. 6-9 kattintas.

## 3. Admin helyszini vasarlast rogzit mentett vasarloval

**Persona:** pultos/admin dolgozo, aki szemelyes vasarlast rogzit a webshop admin feluleten.

**Belepesi pont:** S17 - Login / regisztracio.

| Lepes | Kepernyo | Felhasznaloi muvelet | Rendszervalasz | Hibaag |
|---|---|---|---|---|
| 1 | S17 | Admin vagy dolgozoi fiokkal bejelentkezik. | Megnyilik az engedelyezett admin felulet. | Nem megfelelo szerepkornal vedett funkcio nem latszik. |
| 2 | S11 | Helyszini vasarlas rogzitesehez navigal. | Megjelenik a helyszini vasarlas urlap. | Betoltesi hiba eseten figyelmeztetes. |
| 3 | S14 | Mentett vasarlot valaszt vagy uj adatot ad meg. | Az urlap kitoltodik a vasarlo adataival. | Tiltott vasarlo eseten nem rogzithet rendelest. |
| 4 | S14 | Termeket keres es tetelekhez adja. | A rendszer arat, mennyiseget es vegosszeget szamol. | Nincs termek vagy hibas mennyiseg eseten validacio. |
| 5 | S14 | Elmenti a vasarlast es PDF-et ker. | Helyszini rendelés jon letre es bizonylat generalodik. | Mentesi hiba eseten hiba uzenet. |
| 6 | S15 | Ellenorzi a PDF bizonylatot. | A dokumentum nyomtathato vagy mentheto. | PDF hiba eseten ujraprobalhato. |

**Sikerkriterium:** a helyszini vasarlas mentodik, a keszlet frissul, a PDF bizonylat letoltheto.

**Becsult ido:** 60-120 masodperc, kb. 8-12 kattintas.
