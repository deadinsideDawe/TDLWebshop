# Többképes termékimport útmutató

Ez a sablon akkor hasznos, ha egy termékhez nem csak egy fő képet, hanem több galériaképet is szeretnél feltölteni.

## Fájlok

- `docs/termek-import-tobbkepes-sablon.csv`
- `docs/termeklista-tobbkepes-sablon.xlsx`

## Fontos mezők

- `image`
  - Ez legyen a termék **főképe**.
  - Példa: `products/radiator-szelep-fo.jpg`

- `galleryImages`
  - Ide kerülnek a további képek.
  - Több képet `|` jellel kell elválasztani.
  - Példa:
    `products/radiator-szelep-1.jpg|products/radiator-szelep-2.jpg|products/radiator-szelep-3.jpg`

## Javasolt képnév logika

Érdemes egységesen elnevezni a fájlokat:

- fő kép: `termeknev-fo.jpg`
- további képek:
  - `termeknev-1.jpg`
  - `termeknev-2.jpg`
  - `termeknev-3.jpg`

Példa:

- `products/klima-rezcso-fo.jpg`
- `products/klima-rezcso-1.jpg`
- `products/klima-rezcso-2.jpg`

## Kategóriák

A sablon a végleges webshop kategóriákkal számol:

- `Fűtés`
- `Hűtés`
- `Víz`
- `Szellőzés`
- `Szerelvények`
- `Lakossági megoldások`

## Mire figyelj kitöltéskor

- a `sku` mindig legyen egyedi,
- a `price` és `stockQuantity` csak szám legyen,
- a `isWeeklyDeal` és `isTopProduct` mező értéke `true` vagy `false` legyen,
- ha nincs akció, akkor:
  - `salePercent = 0`
  - `saleStartsAt = 0`
  - `saleEndsAt = 0`

## Javasolt munkamenet

1. Gyűjtsd össze a termékadatokat az Excel sablonban.
2. A képeket nevezd el egységesen.
3. A fő képet írd az `image` mezőbe.
4. A további képeket írd a `galleryImages` mezőbe `|` jellel elválasztva.
5. Ha kész vagy, ebből gyorsan tudok importálható adatfájlt csinálni neked.
