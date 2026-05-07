# UX es kepernyospecifikacio - TDL Webshop

## Design celok

- A webshop legyen gyorsan ertheto lakossagi vasarlonak es szereloi/profi felhasznalonak is.
- A dark/light tema ugyanazt a layoutot hasznalja, csak a szinek valtozzanak.
- A fo folyamatokban legyen egyertelmu sikeres, hibas es ures allapot.
- Az admin felulet legyen surubb, de meg mindig kezelheto: gyors kereses, szures, kompakt listak.
- Mobilon a vasarloi oldalak elvezzenek prioritast; az admin mobil hasznalata masodlagos, de ne torjon szet.

## Kepernyospecifikacio

| ID | Nev | Cel | Fo elemek | Use case | Allapotok | Hiba es uzenet | Akadalymentesseg |
|---|---|---|---|---|---|---|---|
| SCR-HOME | Kezdolap | bizalom es gyors belepes a katalogusba | hero, kategoriak, kiemelt termekek, hirek, AI asszisztens | UC-01, UC-09 | betoltott, ures termeklista, tema valtas | kep hianyzik, termek nincs | kontraszt, gombfeliratok |
| SCR-PRODUCTS | Termeklista | termekkereses es szures | kereso, kategoriak, akcios szures, kartyak | UC-01, UC-02 | lista, ures lista, loading | nincs talalat | fokusz, olvashato ar/keszlet |
| SCR-DETAILS | Termekadatlap | termek dontes tamogatasa | kepgaleria, ar, keszlet, kosar gomb | UC-02 | raktaron, kifogyott, loading | termek nem talalhato | alt szoveg, gombmeret |
| SCR-CART | Kosar | rendelés elokeszitese | tetelek, mennyiseg, osszegzes | UC-02 | ures, tetelek, modositas | ervenytelen mennyiseg | billentyuzetes mennyiseg |
| SCR-CHECKOUT | Checkout | rendelés leadasa | adatok, fizetes, kupon, osszegzes | UC-03 | valid, invalid, loading, success | hibas email, hibas telefon, ervenytelen kupon | label, hibaszoveg |
| SCR-PROFILE | Profil | sajat adatok es rendelesek | profil urlap, rendeleslista, statusz | UC-04 | nincs rendelés, lista, hibas betoltes | sikertelen mentés | tabok, fokusz |
| SCR-ADMIN-ORDERS | Admin rendelesek | webes es helyszini rendelesek kezelese | listak, statusz, PDF, email sablon | UC-06 | aktiv, teljesitett, helyszini | sikertelen mentés | kompakt gombok |
| SCR-ADMIN-PRODUCTS | Admin termekek | katalogus karbantartasa | termekurlap, CSV import, lista | UC-05 | import preview, valid/invalid sorok | CSV hibak | tablazatos olvashatosag |
| SCR-ADMIN-USERS | Admin felhasznalok | role es tiltott allapot kezeles | user lista, letrehozas, szerkesztes | UC-07 | admin, dolgozo, vasarlo | hianyos jogosultsag | szerepkor cimkek |
| SCR-AI | AI asszisztens | katalogus es szakmai kerdesek tamogatasa | chat panel, gyors kerdesek, termek ajanlas | UC-09 | helyi fallback, AI aktiv, hiba | AI szolgaltatas nem elerheto | aria label, kontraszt |

## UX validacios jegyzet

A beadashoz legalabb ezeket a folyamatokat erdemes kepernyokepen es checklistben igazolni:

- vendeg termeket keres, kosarba teszi es checkoutot indit;
- regisztralt vasarlo profilban latja a rendeleseit;
- admin termeket szerkeszt vagy CSV-bol importal;
- dolgozo helyszini vasarlast rogzit mentett vasarloval;
- jogosulatlan vasarlo nem eri el az admin feluletet;
- mobil nezetben termeklista, kosar es checkout nem torik szet.

