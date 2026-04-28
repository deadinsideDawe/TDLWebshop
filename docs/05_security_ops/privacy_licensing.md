# Privacy és licensing

## Kezelt adatok

A rendszer az alábbi személyes vagy személyhez köthető adatokat kezelheti:

- név,
- e-mail-cím,
- telefonszám,
- szállítási vagy számlázási adatok,
- céges adatok és adószám,
- rendelési előzmények,
- belső szerepkör- és jogosultsági információk.

## Adatkezelési elv

A webshop a működéshez szükséges minimum adatokat tárolja. Az adatok a Firebase infrastruktúrában találhatók, és hozzáférésük szerepkörökhöz és Firestore szabályokhoz kötött.

## Tiltás és üzleti korlátozás

Külön üzleti szabály vonatkozik a tiltott vásárlókra. Ennek célja, hogy a rendszer kezelni tudja azokat az eseteket, amikor fizetési vagy üzleti okból egy ügyfél nem rendelhet újra.

## AI eszközökbe küldött adatok

A projekt fejlesztése során AI-eszközök támogatása is szerepet kapott, de törekedtem arra, hogy:

- éles titkokat ne küldjek AI eszközökbe,
- valódi érzékeny adatokat ne adjak meg,
- a promptok főként kódszerkezetre, hibajavításra, dokumentációra és tesztelési ötletekre vonatkozzanak.

Az AI használata segédeszközként jelent meg, nem helyettesítette a saját döntéseket, ellenőrzést vagy a manuális validációt.

## Licensing

A projekt elsődlegesen szakdolgozati célú fejlesztés. A felhasznált külső csomagok az adott open-source licenceik szerint kerültek beépítésre Angular, Firebase és egyéb frontend függőségek formájában. A statikus képek és assetek esetében külön figyelmet kell fordítani arra, hogy publikus felhasználásnál csak megfelelően licencelt vagy saját anyagok maradjanak a végleges verzióban.
