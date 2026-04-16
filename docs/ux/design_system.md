# Design rendszer / vizuális nyelv

## UI könyvtár / komponens-könyvtár
- **Alap:** Angular standalone komponensek
- **UI réteg:** saját komponens- és CSS-rendszer (nem MUI/Bootstrap)
- **Fő minták:** kártyás elrendezés, modálok, badge-ek, toast visszajelzések

## Színpaletta
- `primary`: `#119DFF`
- `secondary`: `#84CC16`
- `accent`: `#38BDF8`
- `success`: `#22C55E`
- `warning`: `#F97316`
- `error`: `#EF4444`
- `surface`: `#161D27`
- `surface-alt`: `#111827`
- `background`: `#0B0F14`
- `text`: `#F8FAFC`
- `text-muted`: `#94A3B8`

## Tipográfia
- **Címsorok:** Oswald / Bebas Neue jellegű erős display stílus
- **Normál szöveg:** Inter jellegű sans-serif
- **Méret-skála (tipikus):**
  - hero cím: 48-72 px
  - szekciócím: 28-40 px
  - kártyacím: 20-28 px
  - törzsszöveg: 14-18 px
  - segédszöveg: 12-14 px
- **Súlyok:** 400 / 500 / 700 / 800

## Spacing / grid
- **Alapegység:** 8 px
- **Komponens belső spacing:** 12 / 16 / 24 px
- **Fő tartalom max szélesség:** kb. 1200-1320 px
- **Layout:** reszponzív grid (`auto-fit/minmax`) + rugalmas oszlopok

## Ikonkészlet
- Egyedi SVG elemek (brandhez igazítva)
- Kategória ikonok + termékfotó alapú kártyák
- Státuszjelző badge-ek (raktáron / kevés / nincs)

## Sötét mód
- **Támogatott**
- A projekt elsődleges vizuális iránya: sötét téma
- Világos mód külön kontraszt szabályokkal finomhangolva

## Reszponzív breakpoint-ok
- **Mobil:** 0-767 px
- **Tablet:** 768-1023 px
- **Desktop:** 1024 px+

## Forrás
- Kódalapú design rendszer (nincs külön Figma token file)
- Fő stílusforrások: globális `styles.css` + oldalszintű `*.css` fájlok
