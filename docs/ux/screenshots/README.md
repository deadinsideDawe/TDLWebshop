# Screenshot készítési lista

A screenshotokat a végleges, futtatott alkalmazásból kell elkészíteni. Minden képet a teljes viewporttal ments, ne vágd le a fejlécet vagy a láblécet. Webes beadáshoz javasolt méret: 1440x900 desktop.

## Automatikusan elkészítve az élő Firebase oldalról

Ezek a képek a `https://tdlwebshop.web.app` deployolt oldalról készültek, 1440x900 desktop viewporttal:

| Fájlnév | Képernyő | Megjegyzés |
|---|---|---|
| `S01_kezdolap_desktop.png` | Kezdőlap | Publikus nyitóállapot |
| `S02_kategoriak_lenyilo_desktop.png` | Kategóriák lenyíló | Header + nyitott kategóriák menü |
| `S03_termeklista_desktop.png` | Terméklista | Publikus termékkártyák |
| `S04_termekadatlap_desktop.png` | Termékadatlap | Termék részletes modal/nézete |
| `S05_kosar_desktop.png` | Kosár | Demo kosárállapottal előkészítve |
| `S06_checkout_desktop.png` | Checkout | Demo kosárállapottal előkészítve |
| `S07_checkout_validacio_desktop.png` | Checkout validáció | Hibás email/telefon példa |
| `S08_sikeres_rendeles_desktop.png` | Sikeres rendelés | Demo rendelés-összegzéssel előkészítve |
| `S10_kivansaglista_desktop.png` | Kívánságlista | Demo kívánságlista-elemekkel |
| `S16_ai_asszisztens_desktop.png` | AI asszisztens | Nyitott AI-asszisztens ablak |
| `S17_login_regisztracio_desktop.png` | Login / regisztráció | Bejelentkezési oldal |
| `S19_kapcsolat_desktop.png` | Kapcsolat | Publikus kapcsolat oldal |

Az automatikus screenshotok újragenerálása:

```powershell
& "C:\Users\Dell\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" tools\capture_live_ux_screenshots.py
```

## Teljes desktop lefedettségi tábla

| ID | Képernyő | Fájlnév | Állapot |
|---|---|---|---|
| S01 | Kezdőlap | `S01_kezdolap_desktop.png` | kész |
| S02 | Kategóriák lenyíló | `S02_kategoriak_lenyilo_desktop.png` | kész |
| S03 | Terméklista | `S03_termeklista_desktop.png` | kész |
| S04 | Termékadatlap | `S04_termekadatlap_desktop.png` | kész |
| S05 | Kosár | `S05_kosar_desktop.png` | kész |
| S06 | Checkout | `S06_checkout_desktop.png` | kész |
| S07 | Checkout validáció | `S07_checkout_validacio_desktop.png` | kész |
| S08 | Sikeres rendelés | `S08_sikeres_rendeles_desktop.png` | kész |
| S09 | Profil és rendelések | `S09_profil_rendelesek_desktop.png` | kész |
| S10 | Kívánságlista | `S10_kivansaglista_desktop.png` | kész |
| S11 | Admin áttekintés | `S11_admin_attekintes_desktop.png` | kész |
| S12 | Admin termékkezelés és CSV import | `S12_admin_termekkezeles_desktop.png` | kész |
| S13 | Admin rendelések | `S13_admin_rendelesek_desktop.png` | kész |
| S14 | Helyszíni vásárlás | `S14_helyszini_vasarlas_desktop.png` | kész |
| S15 | PDF bizonylat | `S15_pdf_bizonylat_desktop.png` | kész |
| S16 | AI asszisztens | `S16_ai_asszisztens_desktop.png` | kész |
| S17 | Login és regisztráció | `S17_login_regisztracio_desktop.png` | kész |
| S18 | Felhasználók és jogosultságok | `S18_felhasznalok_jogosultsagok_desktop.png` | kész |
| S19 | Kapcsolat | `S19_kapcsolat_desktop.png` | kész |

## Extra admin állapotképek

Ezek nem külön képernyők, hanem a fő admin képernyők további bizonyító állapotai:

| Fájlnév | Képernyő | Mit mutat? |
|---|---|---|
| `S11_admin_attekintes__low_stock_desktop.png` | Admin áttekintés | Alacsony készlet figyelmeztetés modal |
| `S12_admin_termekfelvitel_kepfeltoltes_desktop.png` | Admin termékkezelés | Új termék űrlap és képfeltöltés |
| `S12_admin_csv_import_desktop.png` | Admin termékkezelés | CSV csoportos termékimport |
| `S14_helyszini_vasarlas__success_desktop.png` | Helyszíni vásárlás | Sikeres helyszíni vásárlás visszajelzés |

## Screen recording

| Fájlnév | Mit mutat? |
|---|---|
| `journey1.mp4` | A fő vásárlói folyamatot: kezdőlap -> termék -> kosár -> checkout -> siker |

## Opcionális plusz képek

| Fájlnév | Állapot | Mikor hasznos? |
|---|---|---|
| `S03_termeklista__empty_desktop.png` | pótolható | Ha nincs találat egy keresésre |
| `S13_admin_rendelesek__empty_desktop.png` | pótolható | Ha nincs még rendelés |

## Mobil screenshotok, ha szeretnéd bizonyítani a reszponzivitást

- `S01_kezdolap_mobile.png`
- `S03_termeklista_mobile.png`
- `S06_checkout_mobile.png`
- `S09_profil_rendelesek_mobile.png`
- `S14_helyszini_vasarlas_mobile.png`

## Screen recording tartalma

Az ajánlott `journey1.mp4` a fő vásárlói folyamatot mutatja meg:

1. Kezdőlap megnyitása.
2. Terméklista megnyitása kategóriából vagy keresésből.
3. Termékadatlap megnyitása.
4. Kosárba helyezés.
5. Checkout kitöltése.
6. Sikeres rendelés visszajelzése.
