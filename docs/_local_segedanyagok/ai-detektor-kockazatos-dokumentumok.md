# AI-detektor szempontból legkockázatosabb dokumentumok

Ez a lista nem azt jelenti, hogy ezek a dokumentumok "rosszak", hanem azt, hogy ezek azok a fájlok, amelyeknél egy bíráló vagy AI-alapú szövegelemző a legkönnyebben érezheti azt, hogy túl egységes, túl sima vagy túl általános a megfogalmazás. Ezeket érdemes elsőként a saját nyelvezetre átírni.

## 1. `docs/TDLWebshop_szakdolgozat_alap.docx`

### Miért kockázatos?
- Ez a dolgozat fő szövege, ezért ez a legfontosabb anyag.
- Több hosszú, kerek, jól strukturált bekezdésből áll, ami könnyen "túl kész" hatást kelthet.
- Ha minden fejezet azonos ritmusban és túl hasonló mondatszerkezettel íródik, az mesterséges érzetet adhat.

### Hogyan írd át természetesebbre?
- Rövidíts le néhány túl hosszú mondatot két mondatra.
- Tegyél bele saját tapasztalati megjegyzéseket, például:
  - "A fejlesztés során azt tapasztaltam..."
  - "Számomra fontos volt, hogy..."
  - "Végül ezt a megoldást választottam, mert..."
- Ne mindig ugyanazzal a mintával induljon a bekezdés.
- A továbbfejlesztési résznél írj bele 1-2 valódi kompromisszumot vagy nehézséget.

### Mire figyelj különösen?
- Bevezetés
- Technológiai döntések
- Tesztelési fejezet
- Összegzés

## 2. `README.md`

### Miért kockázatos?
- A README-k könnyen válnak sablonossá.
- Ha túl "termékbemutató" vagy túl steril, akkor kevésbé látszik, hogy a projekt mögött valódi fejlesztői munka és szakdolgozati cél volt.

### Hogyan írd át természetesebbre?
- Az első bekezdést írd át úgy, mintha szóban mutatnád be a projektet.
- Írd bele, hogy ez szakdolgozati projekt.
- A funkciólistánál ne csak felsorolj, hanem csoportosíts:
  - vásárlói funkciók
  - admin funkciók
  - dolgozói funkciók
- Használj olyan mondatokat, amelyekből látszik, hogy te döntöttél az irányról.

### Mire figyelj különösen?
- Nyitó bekezdés
- Fő funkciók felsorolása
- AI vagy dokumentáció megemlítése

## 3. `docs/07_ai/ai-usage-thesis-section.md`

### Miért kockázatos?
- Ez az a dokumentum, ahol a bíráló eleve érzékenyebb lesz.
- Ha túl szabályos vagy túl óvatosan megfogalmazott, akkor az épp ellenkező hatást válthatja ki.

### Hogyan írd át természetesebbre?
- Konkrétabban fogalmazd meg, mire használtad az AI-t:
  - hibakeresés
  - ötletelés
  - dokumentációs vázlat
  - egyes UI-részletek finomítása
- Írd bele, hogy mit nem bíztál rá:
  - végső döntések
  - üzleti logika ellenőrzése
  - tesztelés utáni jóváhagyás
- Kerüld a túl hivatalos, túl "policy-szerű" mondatokat.

### Jó irányú mondatpélda
- "Az AI-eszközöket főleg gyorsabb ötletelésre és ellenőrzésre használtam, de a végleges megoldásokat minden esetben én választottam ki és külön teszteltem."

## 4. `docs/07_ai/ai_manifest.md`

### Miért kockázatos?
- A manifest műfaja önmagában formális.
- Emiatt könnyen tűnhet úgy, mintha "készen kapott megfelelési dokumentum" lenne.

### Hogyan írd át természetesebbre?
- Tartsd meg a struktúrát, de a magyarázó mondatokat írd át egyszerűbbre.
- Ahol lehet, használj kevesebb absztrakt szót és több konkrétumot.
- Írd le röviden, hogy a projekt mely részein volt valódi segítség az AI.
- Tedd világossá, hogy a fejlesztés iránya nem az AI-tól jött, hanem a szakdolgozati célból.

### Mire figyelj különösen?
- "Az AI szerepe"
- "Fejlesztői felelősség"
- "Ellenőrzési folyamat"

## 5. `docs/07_ai/verification_log.md`

### Miért kockázatos?
- Ha túl tökéletesen egyforma szerkezetűek a pontok, az gépiesnek hat.
- Egy log akkor természetesebb, ha látszik benne döntés, elvetett ötlet és finomhangolás is.

### Hogyan írd át természetesebbre?
- Ne minden pontot ugyanazzal a szerkezettel írj le.
- Néhány helyen írd bele, ha egy javaslatot nem vettél át teljesen.
- Használj ilyen fordulatokat:
  - "ezt nem változtatás nélkül építettem be"
  - "a javaslat alapötlete hasznos volt, de módosítottam"
  - "a végső megoldás eltért az eredeti javaslattól"

### Mire figyelj különösen?
- Azokra a pontokra, ahol most túl szépen követi egymást a:
  - javaslat
  - ellenőrzés
  - eredmény

## Plusz: melyik kettőt érdemes még utána átírni?

Ha marad idő, ezeket is érdemes áthúzni:

### `docs/01_product/vision.md`
- mert könnyen túl "projektterves" lehet

### `docs/testing-thesis-section.md`
- mert a tesztelési fejezetek gyakran túlságosan tankönyvszerűek lesznek

## Gyors átírási módszer

Ha kevés időd van, ezt a módszert kövesd:

1. Olvasd el a bekezdést.
2. Fogalmazd meg magadnak szóban egyszerűbben.
3. Írd le úgy, ahogy elmondanád.
4. Hagyj benne 1-2 saját hangsúlyt vagy tapasztalati elemet.
5. Törd meg az egyforma mondathosszakat.

## Rövid prioritási sorrend

1. `docs/TDLWebshop_szakdolgozat_alap.docx`
2. `README.md`
3. `docs/07_ai/ai-usage-thesis-section.md`
4. `docs/07_ai/ai_manifest.md`
5. `docs/07_ai/verification_log.md`

Ha ezt az ötöt természetesebbre írod, az már nagyon sokat javít azon, hogy a teljes anyag mennyire tűnik személyes, saját munkára épülő szakdolgozatnak.
