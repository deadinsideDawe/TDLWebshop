# TDLWebshop GUI/UX dokumentacio

Ez a mappa a TDLWebshop felhasznaloi feluletenek es felhasznaloi elmenyenek konzulensi kiiras szerinti dokumentaciojat tartalmazza. A cel az, hogy a vasarloi, adminisztratori es dolgozoi folyamatok kepernyo-szinten is kovethetoek legyenek.

## Tartalom

| Kovetelmeny | Fajl / mappa | Allapot |
|---|---|---|
| Pageflow / kepernyoterkep | `pageflow.png`, `pageflow.mmd` | kesz |
| Kepernyokepek | `screenshots/` | publikus es vasarloi desktop kepek elkeszultek, admin/PDF allapotok bejelentkezessel potolandok |
| Kepernyokep-alairasok es vedesi jegyzetek | `screenshot_captions.md` | kesz |
| Kepernyo-leiras tablazat | `screens.csv` | kesz |
| Top 3 user journey | `journeys.md` | kesz |
| Design rendszer | `design_system.md` | kesz |
| UX onertekeles | `self_assessment.md` | kesz |
| Screen recording | `journey1.mp4` | erosen ajanlott, kezzel potolando |
| Tervezesi artifactok | `mockups/` | opcionalis |
| Benchmark / inspiracio | `inspirations/` | opcionalis |

## Lefedett folyamatok

- vasarloi bongeszes, kereses, termekadatlap, kosar es checkout;
- profil, rendeleskovetes es kivansaglista;
- admin attekintes, rendeleskezeles, termekkezeles, CSV import es keszletfigyeles;
- helyszini vasarlas mentett vasarloval es PDF bizonylattal;
- dolgozoi korlatozott admin felulet;
- AI asszisztens a sajat termekkatalogushoz kotott valaszokkal.

## Kepernyokepek

A konkret screenshotokat a `screenshots/README.md` listaja alapjan kell elkesziteni. A fajlnevek egyeznek a `screens.csv` azonositoival, ezert a szakdolgozatban es a UX dokumentacioban is konzisztensen hivatkozhatoak.

## PR-be masolhato checklist

- [x] `pageflow.png` + szerkesztheto `pageflow.mmd`
- [ ] minden fontos kepernyo screenshotja a `screenshots/` mappaban, `S##` fajlnev-konvencioval (publikus/vasarloi kepek keszek, admin/PDF kepek potolandok)
- [x] `screens.csv` minden kepernyore kitoltve
- [x] `journeys.md` top 3 user journey
- [x] `design_system.md`
- [x] `self_assessment.md`
- [ ] ajanlott: `journey1.mp4` vagy GIF a fo vasarloi folyamatrol
- [x] opcionalis mappak: `mockups/`, `inspirations/`
