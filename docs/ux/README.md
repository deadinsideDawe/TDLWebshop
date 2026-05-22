# TDLWebshop GUI/UX dokumentáció

Ez a mappa a TDLWebshop felhasználói felületének és felhasználói élményének konzulensi kiírás szerinti dokumentációját tartalmazza. A cél az, hogy a vásárlói, adminisztrátori és dolgozói folyamatok képernyő-szinten is követhetőek legyenek.

## Tartalom

| Követelmény | Fájl / mappa | Állapot |
|---|---|---|
| Pageflow / képernyőtérkép | `pageflow.png`, `pageflow.mmd` | kész |
| Képernyőképek | `screenshots/` | desktop screenshot készlet elkészült, admin és PDF állapotokkal együtt |
| Képernyőkép-aláírások és védési jegyzetek | `screenshot_captions.md` | kész |
| Képernyő-leírás táblázat | `screens.csv` | kész |
| Top 3 user journey | `journeys.md` | kész |
| Design rendszer | `design_system.md` | kész |
| UX önértékelés | `self_assessment.md` | kész |
| Screen recording | `journey1.mp4` | kész |
| Tervezési artifactok | `mockups/` | opcionális |
| Benchmark / inspiráció | `inspirations/` | opcionális |

## Lefedett folyamatok

- vásárlói böngészés, keresés, termékadatlap, kosár és checkout;
- profil, rendeléskövetés és kívánságlista;
- admin áttekintés, rendeléskezelés, termékkezelés, CSV import és készletfigyelés;
- helyszíni vásárlás mentett vásárlóval és PDF bizonylattal;
- dolgozói korlátozott admin felület;
- AI asszisztens a saját termékkatalógushoz kötött válaszokkal.

## Képernyőképek

A konkrét screenshotokat a `screenshots/README.md` listája alapján kell elkészíteni. A fájlnevek egyeznek a `screens.csv` azonosítóival, ezért a szakdolgozatban és a UX dokumentációban is konzisztensen hivatkozhatóak.

## PR-be másolható checklist

- [x] `pageflow.png` + szerkeszthető `pageflow.mmd`
- [x] minden fontos képernyő screenshotja a `screenshots/` mappában, `S##` fájlnév-konvencióval
- [x] `screens.csv` minden képernyőre kitöltve
- [x] `journeys.md` top 3 user journey
- [x] `design_system.md`
- [x] `self_assessment.md`
- [x] ajánlott: `journey1.mp4` vagy GIF a fő vásárlói folyamatról
- [x] opcionális mappák: `mockups/`, `inspirations/`
