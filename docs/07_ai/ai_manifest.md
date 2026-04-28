# AI manifest

## Cél

Ez a dokumentum összefoglalja, hogy a projekt fejlesztése során milyen AI-eszközöket használtam, és ezek pontosan milyen szerepet töltöttek be.

## Fontos alapelv

Az AI használata a projektben segítő jellegű volt. A rendszer megtervezését, a funkciók kiválasztását, a döntések jóváhagyását, a hibák ellenőrzését és a végső integrációt én végeztem. Az AI főként gyorsító és ötletadó eszközként jelent meg egyes részfeladatokban.

## Használt AI-eszközök és szerepük

### 1. Chat alapú AI asszisztens

Felhasználási területek:

- ötletelés és scope pontosítás,
- UI és UX finomítás,
- dokumentáció első vázlatai,
- kódrészletek és hibák átbeszélése,
- tesztelési és ellenőrzési lista összeállítása.

### 2. Kódközeli AI segítség

Felhasználási területek:

- kisebb implementációs blokkokhoz javaslatok,
- validációs logika és refaktorálási ötletek,
- spec fájlok bővítésének támogatása,
- admin jogosultsági logika és dokumentálási minták.

### 3. Dokumentációs AI segítség

Felhasználási területek:

- szakdolgozati szerkezet és fejezetvázlatok,
- tesztelési és biztonsági dokumentumok alapjainak kialakítása,
- AI használat átlátható dokumentálása.

## Mire nem használtam

- Nem vakon generáltam teljes rendszert ellenőrzés nélkül.
- Nem adtam át éles titkokat vagy érzékeny adatokat.
- Nem fogadtam el automatikusan minden javaslatot.

## Saját felelősségi kör

Az alábbiakat minden esetben én ellenőriztem vagy döntöttem el:

- mely funkciók kerülnek be a rendszerbe,
- milyen UI és üzleti logika marad a végleges verzióban,
- mely kód kerül ténylegesen a projektbe,
- a tesztek és build eredményei,
- a Firebase szabályok és jogosultságkezelés vállalhatósága.
