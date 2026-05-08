# AI használat leírása a szakdolgozatban

Az alábbi szöveg olyan alap, amelyet a szakdolgozat megfelelő fejezetében saját megfogalmazásra igazítva lehet felhasználni. A végleges dolgozatban érdemes természetesebb, személyesebb stílusra átírni.

## Javasolt fejezetcím

Mesterséges intelligencia használata a fejlesztés során

## Javasolt szöveg

A fejlesztés során mesterséges intelligencia alapú eszközöket is használtam, azonban ezek szerepe nem a projekt önálló elkészítése volt, hanem a fejlesztési folyamat támogatása. Az AI-t elsősorban ötletelésre, egyes megoldási lehetőségek összehasonlítására, dokumentációs vázlatok kialakítására, hibakeresési szempontok összegyűjtésére, valamint bizonyos kódrészletek átgondolására alkalmaztam. A rendszer végső felépítéséről, az üzleti logikáról, a jogosultsági modellről, a vizuális kialakításról és a projekt scope-járól minden esetben én hoztam meg a döntést.

Az AI által javasolt megoldásokat nem automatikusan emeltem be a projektbe. Minden lényegesebb változtatás után saját ellenőrzést végeztem, buildet és teszteket futtattam, valamint a kritikus működéseket manuálisan is kipróbáltam. Több esetben az AI által adott első javaslat nem került közvetlenül felhasználásra, hanem csak kiindulópontként szolgált egy később pontosított vagy átdolgozott megoldáshoz.

A projektben külön AI asszisztens funkció is készült. Ennek célja, hogy a felhasználó épületgépészeti témájú kérdésekben és a webshop termékkatalógusához kapcsolódó érdeklődésekben kapjon segítséget. Az asszisztens nem helyettesíti a szakembert vagy az ügyfélszolgálatot, hanem előzetes tájékoztatást ad. A pontos műszaki kiválasztáshoz, készlethez és beszerezhetőséghez a rendszer emailes vagy személyes egyeztetést javasolhat.

Biztonsági okból az OpenRouter API kulcs nem került be a frontend kódba. A hívás egy Cloudflare Worker proxy-n keresztül történik, ahol a kulcs secretként van tárolva. Így a böngészőből nem olvasható ki az API kulcs, és a modellválasztás sem a felhasználó által állítható felületi elem.

Fontosnak tartottam, hogy az AI használata átlátható maradjon, ezért külön dokumentáltam, hogy mely területeken segített, milyen jellegű feladatokra alkalmaztam, és milyen módon ellenőriztem az eredményeket. Ennek megfelelően a projekt szakmai tartalmáért, a végső implementációért és a leadott munka minőségéért teljes felelősséget vállalok.

## Rövid védési változat szóban

Használtam AI-eszközöket, de segítő szerepben. A funkciók kiválasztását, a döntéseket, a végleges kód beépítését és az ellenőrzést én végeztem. Az AI főleg ötletadásban, dokumentálásban, hibakeresési szempontokban és néhány részmegoldás gyorsításában segített, de a projekt mérnöki kontrollja végig nálam maradt.
