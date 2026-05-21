# Design rendszer es vizualis nyelv

## UI technologia

A TDLWebshop Angular alapu feluletet hasznal, sajat CSS/SCSS stilusokkal. A projekt nem egy kesz komponenskonyvtarra epul, hanem a webshophoz es az admin felulethez igazodo sajat kartyakat, gombokat, urlapokat, tablazatokat es modalokat hasznal.

## Vizualis irany

A fo vizualis irany ipari, modern, sotet alapu webshop design. A logohoz illeszkedve a kek es piros hangsulyok jelennek meg, a felulet pedig massziv, szakmai jellegu marad. A liquid glass hatas csak kiemelt UI elemeknel jelenik meg, peldaul a navigacios lenyiloknal es az AI asszisztens panelen.

## Szinpaletta

| Szerep | Dark mode | Light mode |
|---|---|---|
| Hatter | `#0f172a`, `#111827` | `#f8fafc` |
| Kartya / surface | `#1f2937` | `#ffffff` |
| Szegely | `#334155` | `#e5e7eb` |
| Fo szoveg | `#f9fafb` | `#111827` |
| Masodlagos szoveg | `#94a3b8` | `#6b7280` |
| Primary | `#3b82f6` | `#2563eb` |
| Danger | `#ef4444` | `#dc2626` |
| Success | `#22c55e` | `#16a34a` |

## Tipografia

A felulet rendszerfontokra epul, hogy minden platformon gyorsan es jol olvashatoan jelenjen meg. A cimek vastagabb, erosebb vizualis hierarchiat kapnak, a termek- es adminszovegek pedig rovidebb, scannelheto blokkokban jelennek meg.

## Spacing es layout

- Alap spacing egyseg: 8 px.
- A kartyak es toolbarok fix, stabil meretezest hasznalnak, hogy hover vagy dinamikus tartalom ne torje meg a layoutot.
- A fo tartalom desktopon szeles, grid-alapu elrendezesu; mobilon egyoszlopos, egyszerubb navigacioval.
- A kartyak lekerekitese visszafogott, altalaban 8 px vagy annal kisebb.

## Ikonok es interakciok

Az ikonok egyszeru vonalas vagy sajat SVG jellegu elemek. A fontosabb gombok szoveges cimket is kapnak. Hover allapotban kek vagy piros glow jelenik meg, de a termekkartyak nem valnak uvegszeruve, hogy megmaradjon a kontraszt es az olvashatosag.

## Sötét és világos mód

A rendszer támogat sötét és világos megjelenést. A layout nem változik módváltáskor, csak a színek, árnyékok és kontrasztok igazodnak az aktuális témához. Ez fontos UX döntés, mert a felhasználó nem veszti el a megszokott navigációt.

## Reszponziv breakpointok

| Meret | Tartomany | Cel |
|---|---|---|
| Mobile | 0-639 px | Egyoszlopos termeklista, egyszerubb nav |
| Tablet | 640-1023 px | Kartyas elrendezes, tobb oszlop korlatozottan |
| Desktop | 1024 px felett | Teljes navbar, grid, admin tablazatok |

## Hozzaferhetoseg

A rendszer tobb helyen hasznal egyertelmu gombfeliratokat, kontrasztos szineket es mezolabel-eket. Tovabbfejlesztesi irany a teljes billentyuzet-navigacio es az ARIA attributumok kovetkezetes bovitése.
