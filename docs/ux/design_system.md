# Design rendszer és vizuális nyelv

## UI technológia

A TDLWebshop Angular alapú felületet használ, saját CSS/SCSS stílusokkal. A projekt nem egy kész komponenskönyvtárra épül, hanem a webshophoz és az admin felülethez igazodó saját kártyákat, gombokat, űrlapokat, táblázatokat és modalokat használ.

## Vizuális irány

A fő vizuális irány ipari, modern, sötét alapú webshop design. A logóhoz illeszkedve a kék és piros hangsúlyok jelennek meg, a felület pedig masszív, szakmai jellegű marad. A liquid glass hatás csak kiemelt UI elemeknél jelenik meg, például a navigációs lenyílóknál és az AI asszisztens panelen.

## Színpaletta

| Szerep | Dark mode | Light mode |
|---|---|---|
| Háttér | `#0f172a`, `#111827` | `#f8fafc` |
| Kártya / surface | `#1f2937` | `#ffffff` |
| Szegély | `#334155` | `#e5e7eb` |
| Fő szöveg | `#f9fafb` | `#111827` |
| Másodlagos szöveg | `#94a3b8` | `#6b7280` |
| Primary | `#3b82f6` | `#2563eb` |
| Danger | `#ef4444` | `#dc2626` |
| Success | `#22c55e` | `#16a34a` |

## Tipográfia

A felület rendszerfontokra épül, hogy minden platformon gyorsan és jól olvashatóan jelenjen meg. A címek vastagabb, erősebb vizuális hierarchiát kapnak, a termék- és adminszövegek pedig rövidebb, scannelhető blokkokban jelennek meg.

## Spacing és layout

- Alap spacing egység: 8 px.
- A kártyák és toolbarok fix, stabil méretezést használnak, hogy hover vagy dinamikus tartalom ne törje meg a layoutot.
- A fő tartalom desktopon széles, grid-alapú elrendezésű; mobilon egyoszlopos, egyszerűbb navigációval.
- A kártyák lekerekítése visszafogott, általában 8 px vagy annál kisebb.

## Ikonok és interakciók

Az ikonok egyszerű vonalas vagy saját SVG jellegű elemek. A fontosabb gombok szöveges címkét is kapnak. Hover állapotban kék vagy piros glow jelenik meg, de a termékkártyák nem válnak üvegszerűvé, hogy megmaradjon a kontraszt és az olvashatóság.

## Sötét és világos mód

A rendszer támogat sötét és világos megjelenést. A layout nem változik módváltáskor, csak a színek, árnyékok és kontrasztok igazodnak az aktuális témához. Ez fontos UX döntés, mert a felhasználó nem veszti el a megszokott navigációt.

## Reszponzív breakpointok

| Méret | Tartomány | Cél |
|---|---|---|
| Mobile | 0–639 px | Egyoszlopos terméklista, egyszerűbb nav |
| Tablet | 640–1023 px | Kártyás elrendezés, több oszlop korlátozottan |
| Desktop | 1024 px felett | Teljes navbar, grid, admin táblázatok |

## Hozzáférhetőség

A rendszer több helyen használ egyértelmű gombfeliratokat, kontrasztos színeket és mezőlabel-eket. Továbbfejlesztési irány a teljes billentyűzet-navigáció és az ARIA attribútumok következetes bővítése.
