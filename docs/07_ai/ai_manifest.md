# AI manifest

## Cél

Ez a dokumentum összefoglalja, hogy a projekt fejlesztése során milyen AI-eszközöket használtam, és ezek pontosan milyen szerepet töltöttek be.

## Fontos alapelv

Az AI használata a projektben segítő jellegű volt. A rendszer megtervezését, a funkciók kiválasztását, a döntések jóváhagyását, a hibák ellenőrzését és a végső integrációt én végeztem. Az AI főként gyorsító, ötletadó és ellenőrzést támogató eszközként jelent meg egyes részfeladatokban.

## Használt AI-eszközök és szerepük

### 1. Chat alapú AI asszisztens

Felhasználási területek:

- ötletelés és scope pontosítás;
- UI és UX finomítás;
- dokumentáció első vázlatainak kialakítása;
- kódrészletek és hibák átbeszélése;
- tesztelési és ellenőrzési lista összeállítása.

### 2. Kódközeli AI segítség

Felhasználási területek:

- kisebb implementációs blokkokhoz javaslatok;
- validációs logika és refaktorálási ötletek;
- spec fájlok bővítésének támogatása;
- admin jogosultsági logika és dokumentálási minták átbeszélése.

### 3. Dokumentációs AI segítség

Felhasználási területek:

- szakdolgozati szerkezet és fejezetvázlatok;
- tesztelési és biztonsági dokumentumok alapjainak kialakítása;
- AI használat átlátható dokumentálása;
- konzulensi visszajelzések alapján hiánylista készítése.

### 4. Beépített AI asszisztens a webshopban

A webshopban külön AI asszisztens is készült. Ennek célja, hogy a felhasználó épületgépészeti kérdésekre és a termékkatalógushoz kapcsolódó kérdésekre kapjon segítséget. Az OpenRouter API kulcs nem a frontendben szerepel, hanem Cloudflare Worker secretként van tárolva. A frontend csak a Worker publikus URL-jét ismeri.

## Mire nem használtam

- Nem vakon generáltam teljes rendszert ellenőrzés nélkül.
- Nem adtam át éles titkokat vagy érzékeny adatokat.
- Nem fogadtam el automatikusan minden javaslatot.
- Nem az AI döntötte el az MVP határait vagy a végleges üzleti logikát.

## Saját felelősségi kör

Az alábbiakat minden esetben én ellenőriztem vagy döntöttem el:

- mely funkciók kerülnek be a rendszerbe;
- milyen UI és üzleti logika marad a végleges verzióban;
- mely kód kerül ténylegesen a projektbe;
- a tesztek és build eredményei;
- a Firebase szabályok és jogosultságkezelés vállalhatósága;
- a beadásra kerülő szakdolgozati szöveg végső megfogalmazása.

## Validálás

Az AI által javasolt módosításokat builddel, automata tesztekkel, kézi teszteléssel és kódátolvasással ellenőriztem. A 2026-05-08-i ellenőrzés alapján a projekt buildelhető, és az automatizált tesztcsomag 14 tesztfájlban 41 sikeres tesztet futtatott.
