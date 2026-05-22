# Screenshot keszitesi lista

A screenshotokat a vegleges, futtatott alkalmazasbol kell elkesziteni. Minden kepet a teljes viewporttal ments, ne vagd le a fejlecet vagy a lablecet. Webes beadashoz javasolt meret: 1440x900 desktop.

## Automatikusan elkeszitve az elo Firebase oldalrol

Ezek a kepek a `https://tdlwebshop.web.app` deployolt oldalrol keszultek, 1440x900 desktop viewporttal:

| Fajlnev | Kepernyo | Megjegyzes |
|---|---|---|
| `S01_kezdolap_desktop.png` | Kezdolap | Publikus nyitoallapot |
| `S02_kategoriak_lenyilo_desktop.png` | Kategoriak lenyilo | Header + nyitott kategoriak menu |
| `S03_termeklista_desktop.png` | Termeklista | Publikus termekkartyak |
| `S04_termekadatlap_desktop.png` | Termekadatlap | Termek reszletes modal/nezete |
| `S05_kosar_desktop.png` | Kosar | Demo kosarallapottal elokeszitve |
| `S06_checkout_desktop.png` | Checkout | Demo kosarallapottal elokeszitve |
| `S07_checkout_validacio_desktop.png` | Checkout validacio | Hibas email/telefon pelda |
| `S08_sikeres_rendeles_desktop.png` | Sikeres rendeles | Demo rendeleseosszegzessel elokeszitve |
| `S10_kivansaglista_desktop.png` | Kivansaglista | Demo kivansaglista-elemekkel |
| `S16_ai_asszisztens_desktop.png` | AI asszisztens | Nyitott AI-asszisztens ablak |
| `S17_login_regisztracio_desktop.png` | Login / regisztracio | Bejelentkezesi oldal |
| `S19_kapcsolat_desktop.png` | Kapcsolat | Publikus kapcsolat oldal |

Az automatikus screenshotok ujrageneralasa:

```powershell
& "C:\Users\Dell\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" tools\capture_live_ux_screenshots.py
```

## Teljes desktop lefedettsegi tabla

| ID | Kepernyo | Fajlnev | Allapot |
|---|---|---|---|
| S01 | Kezdolap | `S01_kezdolap_desktop.png` | kesz |
| S02 | Kategoriak lenyilo | `S02_kategoriak_lenyilo_desktop.png` | kesz |
| S03 | Termeklista | `S03_termeklista_desktop.png` | kesz |
| S04 | Termekadatlap | `S04_termekadatlap_desktop.png` | kesz |
| S05 | Kosar | `S05_kosar_desktop.png` | kesz |
| S06 | Checkout | `S06_checkout_desktop.png` | kesz |
| S07 | Checkout validacio | `S07_checkout_validacio_desktop.png` | kesz |
| S08 | Sikeres rendeles | `S08_sikeres_rendeles_desktop.png` | kesz |
| S09 | Profil es rendelesek | `S09_profil_rendelesek_desktop.png` | kesz |
| S10 | Kivansaglista | `S10_kivansaglista_desktop.png` | kesz |
| S11 | Admin attekintes | `S11_admin_attekintes_desktop.png` | kesz |
| S12 | Admin termekkezeles es CSV import | `S12_admin_termekkezeles_desktop.png` | kesz |
| S13 | Admin rendelesek | `S13_admin_rendelesek_desktop.png` | kesz |
| S14 | Helyszini vasarlas | `S14_helyszini_vasarlas_desktop.png` | kesz |
| S15 | PDF bizonylat | `S15_pdf_bizonylat_desktop.png` | kesz |
| S16 | AI asszisztens | `S16_ai_asszisztens_desktop.png` | kesz |
| S17 | Login es regisztracio | `S17_login_regisztracio_desktop.png` | kesz |
| S18 | Felhasznalok es jogosultsagok | `S18_felhasznalok_jogosultsagok_desktop.png` | kesz |
| S19 | Kapcsolat | `S19_kapcsolat_desktop.png` | kesz |

## Extra admin allapotkepek

Ezek nem kulon kepernyok, hanem a fo admin kepernyok tovabbi bizonyito allapotai:

| Fajlnev | Kepernyo | Mit mutat? |
|---|---|---|
| `S11_admin_attekintes__low_stock_desktop.png` | Admin attekintes | Alacsony keszlet figyelmeztetes modal |
| `S12_admin_termekfelvitel_kepfeltoltes_desktop.png` | Admin termekkezeles | Uj termek urlap es kepfeltoltes |
| `S12_admin_csv_import_desktop.png` | Admin termekkezeles | CSV csoportos termekimport |
| `S14_helyszini_vasarlas__success_desktop.png` | Helyszini vasarlas | Sikeres helyszini vasarlas visszajelzes |

## Meg potolando elem

| Javasolt fajlnev | Mit mutasson? |
|---|---|
| `journey1.mp4` | 30-90 mp: kezdolap -> termek -> kosar -> checkout -> siker |

## Opcionalis plusz kepek

| Fajlnev | Allapot | Mikor hasznos? |
|---|---|---|
| `S03_termeklista__empty_desktop.png` | potolhato | Ha nincs talalat egy keresesre |
| `S13_admin_rendelesek__empty_desktop.png` | potolhato | Ha nincs meg rendeles |

## Mobil screenshotok, ha szeretned bizonyitani a reszponzivitast

- `S01_kezdolap_mobile.png`
- `S03_termeklista_mobile.png`
- `S06_checkout_mobile.png`
- `S09_profil_rendelesek_mobile.png`
- `S14_helyszini_vasarlas_mobile.png`

## Screen recording javaslat

Az ajanlott `journey1.mp4` 30-90 masodpercben mutassa meg:

1. Kezdolap megnyitasa.
2. Termeklista megnyitasa kategoriabol vagy keresesbol.
3. Termekadatlap megnyitasa.
4. Kosarba helyezes.
5. Checkout kitoltese.
6. Sikeres rendeles visszajelzese.
