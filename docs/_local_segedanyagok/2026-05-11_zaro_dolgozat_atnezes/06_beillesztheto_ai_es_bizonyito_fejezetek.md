# Beillesztheto AI es bizonyito fejezetek

Ez a fajl csak helyi segedanyag. Nem beadando valtozat, nem GitHubra szant dokumentum, hanem olyan szovegalap, amelybol a szakdolgozat megfelelo fejezeteit fel lehet tolteni.

Fontos: a lenti szovegeket ne egy az egyben add be. A technikai tartalom jo alap, de a vegleges dolgozatban a sajat nyelvezeteddel, sajat peldakkal es a tenyleges kepernyokepeiddel kell szerepelnie.

## Mesterseges intelligencia hasznalata a fejlesztes soran

A szakdolgozat keszitese soran mesterseges intelligencia alapu eszkozoket is hasznaltam, de ezek nem helyettesitettek a sajat fejlesztoi munkamat. Az MI-t elsosorban tamogato eszkozkent alkalmaztam: otleteleshez, hibakereseshez, kodreview-jellegu ellenorzeshez, dokumentacios vazlatok keszitesehez, valamint a tesztelesi es biztonsagi szempontok rendszerezesehez. A projekt megvalositasaval kapcsolatos donteseket, a kod vegleges formajat, a futtatast es az ellenorzest sajat felelosseggel vegeztem.

A fejlesztes egyik fontos tapasztalata az volt, hogy az MI gyorsan tud javaslatot adni egy-egy problema megoldasara, de a valaszait nem lehet kesz tenynek tekinteni. A javaslatokat minden esetben ellenorizni kellett a projekt tenyleges mukodese, a hasznalt technologiak dokumentacioja es a sajat teszteles alapjan. Peldaul a rendelest, keszletkezelesi logikat es jogosultsagokat erinto reszeknel nem volt eleg egy altalanos megoldasi javaslat, mert a webshop mukodesehez illeszkedo, Firestore-szabalyokkal es szolgaltatasokkal osszhangban allo megoldasra volt szukseg.

Az MI hasznalata a projektben ket szinten jelent meg. Az elso szint a fejlesztes tamogatasa volt. Ide tartoztak a kodreszletek atnezesere, a hibak okainak keresere, a dokumentacio szerkezetenek kialakitasara es a szakdolgozati kovetelmenyek ertelmezesere hasznalt beszelgetesek. A masodik szint maga a webshop egyik funkcioja: a vasarloi AI asszisztens. Ez az asszisztens a termekkatalogushoz es az epulegepesszeti temakhoz kapcsolodo kerdesekben segit, de nem celja, hogy hivatalos szakvelemenyt vagy kotelezo ervenyu ajanlatot adjon.

A vasarloi AI asszisztens megvalositasa soran kulon figyelmet kellett forditani arra, hogy a rendszer ne tegyen megalapozatlan termekajanlasokat. A kezdeti probak alapjan latszott, hogy egy altalanos nyelvi modell hajlamos lehet akkor is termeket ajanlani, ha nincs eleg pontos talalat a katalogusban. Emiatt a mukodest szukitettem: a valaszoknak a TDLWebshop termekkorehez es epulegepesszeti temakhoz kell kapcsolodniuk, nem relevans kerdeseknel pedig a rendszer udvariasan jelzi, hogy csak a webshop termekeivel es a kapcsolodo szakmai temakkal tud segiteni. Ha egy termek elerhetosege vagy pontos megfelelosege nem dontheto el biztosan, akkor a valasz nem vegleges ajanlatkent jelenik meg, hanem iranymutataskent, es a felhasznalot emailes vagy szemelyes egyeztetesre iranyitja.

Az AI asszisztens biztonsagi szempontbol sem kozvetlenul a frontendbol hivja az OpenRouter API-t. Az API-kulcs nem kerulhet kliensoldalra, ezert a hivas egy Cloudflare Worker proxyn keresztul tortenik. A kulcs a Worker oldalan titokkent van kezelve, a frontend csak a proxy URL-jet ismeri. Ez azert fontos, mert egy bongeszoben futtatott alkalmazasbol a valodi API-kulcs konnyen kiszivaroghatna. A felhasznaloi feluleten a modell sem valaszthato szabadon, mert ez egyszerusiti a mukodest es csokkenti a hibalehetoseget.

A validalas soran tobbfele modszert hasznaltam. A kodreszleteket helyben futtattam, a buildet es a teszteket tobbszor ellenoriztem, valamint GitHub Actions CI is futott a repositoryban. A tesztelesben szerepeltek kosarhoz, checkout logikahoz, kuponkezeleshez, admin rendeleskezeleshez, PDF generalashoz, validaciohoz es AI asszisztenshez kapcsolodo tesztek. A kezi teszteles kulonosen fontos volt azoknal a folyamatoknal, amelyek tobb kepernyot vagy szerepkort erintenek, peldaul a rendeles leadasa, admin statuszvaltas, helyszini vasarlas, mentett vasarlo kivalasztasa es profil/rendelestortenet.

Volt olyan eset is, amikor az MI altal javasolt iranyt nem lehetett valtoztatas nelkul elfogadni. Ilyen volt peldaul a jogosultsagi es keszletkezelesi logika, ahol a kliensoldali megoldas onmagaban nem eleg biztonsagos. Emiatt a Firestore szabalyok, az admin/dolgozo/vasarlo szerepkorok es a rendelesi allapotvaltasok kulon ellenorzesre kerultek. Hasonlo pelda volt az OpenRouter kulcs kezelese: a valodi kulcs nem maradhatott a kodban, ezert visszavonas utan szerveroldali titokkent kellett kezelni.

Az MI-t nem hasznaltam arra, hogy ellenorzes nelkul kesznek tekintsek kodot vagy dokumentaciot. A vegleges donteseknel figyelembe vettem a projekt celjat, a szakdolgozati MVP-hatart, a konzulensi visszajelzeseket es a sajat tesztelesi eredmenyeket. A szakdolgozat vegleges szovegenek sajat megfogalmazasban kell elkeszulnie, mert a dokumentum nem csak a technikai megoldast, hanem a sajat fejlesztoi gondolkodasomat is bemutatja.

Osszessegeben az MI a projektben hasznos tamogato eszkoz volt, mert felgyorsitotta a hibakeresest, segitett rendszerezni a kovetelmenyeket, es tobb olyan szempontra is felhivta a figyelmet, amelyet egy webshop jellegu alkalmazasnal ellenorizni kell. Ugyanakkor a hasznalata akkor bizonyult hasznosnak, amikor a kimenetet nem kesz megoldaskent, hanem ellenorizendo javaslatkent kezeltem. A kovetkezo hasonlo projektben is hasznalnek MI-t, de mar a fejlesztes elejetol pontosabban dokumentalnam, hogy melyik resznel mire hasznaltam, mit fogadtam el belole, es mit valtoztattam meg sajat dontes alapjan.

## Biztonsagi minimum - dolgozatba illesztheto kiegeszites

A TDLWebshop biztonsagi kialakitasanal az volt a cel, hogy a rendszer szakdolgozati MVP-kent is kezelje az alapveto webalkalmazasi kockazatokat. A felhasznaloi jogosultsagok harom fo szerepkorre epulnek: vasarlo, dolgozo es admin. A vasarlo a sajat profiljat, kosarat es rendelesi adatait kezelheti, a dolgozo korlatozott adminisztracios muveleteket vegezhet, az admin pedig a teljesebb uzemeltetoi funkciokhoz fer hozza.

A hozzaferes-vedelem nem csak a frontendben jelenik meg, hanem a Firestore biztonsagi szabalyokban is. Ez kulonosen fontos, mert egy kliensoldali Angular alkalmazasnal a felulet elrejtese onmagaban nem jelent valodi vedelmet. A Firestore szabalyok ellenorzik a bejelentkezett felhasznalot, a szerepkort, valamint tobb collection es dokumentum eseteben a megengedett muveleteket is. A tiltott felhasznalok kezelesere is van logika, igy egy letiltott profil nem vegezhet tovabbi muveleteket a rendszerben.

A rendelesi adatok es a rendelesallapotok vedelme kulon figyelmet kapott. A rendelesek statuszvaltasai audit jelleggel kovethetoek, ami segit abban, hogy utolag is lathato legyen, mikor es milyen valtozas tortent. A helyszini vasarlasoknal a keszletvaltozas es a rendeleselemek kezelese szigorubb logikaban tortenik, mert ott az admin vagy dolgozo kozvetlenul a keszletbol ertekesit.

A kuponoknal es kedvezmenyeknel fontos MVP-korlat, hogy a webes checkout egy resze kliensoldali adatokra is tamaszkodik. Ez szakdolgozati bemutatokornyezetben elfogadhato lehet, de eles kereskedelmi rendszerben erosebb szerveroldali ujraszamolasra lenne szukseg. Ezt a dolgozatban tudatos korlatkent erdemes megemliteni. Ugyanez igaz a vendeg rendelesek email-alapu azonositasi logikajara is, amely egyszeru MVP-megoldas, de adatvedelmi es adatintegritasi szempontbol tovabbfejlesztheto.

Az API-kulcsok es titkok kezelese szinten fontos resze volt a zarasi munkanak. A repositoryban nem maradhat valodi jelszo, token vagy OpenRouter API-kulcs. A projektben `.env.example` fajl mutatja meg a szukseges konfiguracios mezoket, de valodi ertekeket nem tartalmaz. Az AI asszisztens OpenRouter hivasai Cloudflare Worker proxyn keresztul futnak, ahol az API-kulcs szerveroldali titokkent kezelheto. A frontend igy nem kap kozvetlen hozzaferest a kulcshoz.

Az MVP tovabbfejlesztesi iranyai koze tartozik a teljes szerveroldali ar- es kedvezmeny-ellenorzes, az AI proxy rate limitje, a reszletesebb naplozas, valamint a dolgozoi jogosultsagok meg szukebb alapertelmezese. Ezek nem teszik ervenytelenne a jelenlegi megoldast, de jol mutatjak, hogy egy szakdolgozati MVP es egy eles kereskedelmi rendszer kovetelmenyei kozott kulonbseg van.

## Teszteles es validacio - dolgozatba illesztheto kiegeszites

A projekt ellenorzesere automata es kezi tesztelesi modszereket is alkalmaztam. Az automata tesztek celja az volt, hogy a legfontosabb uzleti logikai reszek legalabb izolaltan ellenorizhetoek legyenek. A tesztek erintik a kosar mukodeset, a checkout es kuponlogikat, az admin rendeleskezeles egyes reszeit, a PDF generalast, az inputvalidaciot es az AI asszisztens domainhez kotott mukodeset.

A friss ellenorzes soran a build sikeresen lefutott, az automata tesztek pedig hiba nelkul teljesultek. A tesztjelentes alapjan 14 tesztfajlban osszesen 41 teszt futott le sikeresen, sikertelen teszt nelkul. Ezt az eredmenyt a dolgozatban erdemes konkretan feltuntetni, valamint a GitHub Actions zold futasarol kepernyokepet is beilleszteni.

Kezi tesztelesre azert is szukseg volt, mert a webshop tobb olyan folyamatot tartalmaz, amely egyszerre tobb komponenst, adatmodellt es szerepkort erint. Ilyen peldaul a regisztracio, bejelentkezes, termekkereses, kosarba helyezes, checkout validacio, sikeres rendeles, profilban torteno rendeleskovetes, admin statuszvaltas, CSV import, keszletfigyeles, helyszini vasarlas es dolgozoi jogosultsagellenorzes.

A kezi teszteles soran nem csak a sikeres folyamatokat kell ellenorizni, hanem a hibas bemeneteket es jogosulatlan muveleteket is. Peldaul hibas email vagy telefonszam eseten a checkout nem engedheti tovabb a felhasznalot, normal vasarlo nem ferhet hozza admin funkciokhoz, letiltott felhasznalo nem vegezhet muveletet, illetve a dolgozo csak a sajat szerepkorenek megfelelo adminisztracios reszeket lathatja.

A teszteles egyik korlatja, hogy a projektben jelenleg nem minden kritikus folyamatra keszult teljes vegponttol vegpontig tarto E2E teszt. Ezt a dolgozatban erdemes tovabbfejlesztesi iranykent megjelolni. Ugyanakkor a build, az automata tesztek, a CI es a kezi tesztjegyzokonyv egyutt megfelelo bizonyitekai annak, hogy a szakdolgozati MVP fo folyamatai ellenorzotten mukodnek.

## Reprodukalhatosag - dolgozatba illesztheto kiegeszites

A repository rendezese soran cel volt, hogy a projekt tiszta kornyezetben is erthetoen elindithato es ellenorizheto legyen. Ehhez a README tartalmazza a telepitesi, inditasi, buildelesi es tesztelesi lepeseket, valamint a szukseges kornyezeti valtozok leirasat. A valodi titkok helyett `.env.example` mutatja meg, milyen konfiguracios adatokra van szukseg.

A repositoryban nem szabad verziozni a generalt vagy gepfuggo allomanyokat, peldaul a `node_modules`, `dist`, cache, lokalis temporary mappakat vagy valodi `.env` fajlokat. Ezeket a `.gitignore` kezeli. Ez azert fontos, mert a biralo vagy temavezeto szamara a projektnek a forraskodbol es dokumentalt lepesekbol kell ujraepitheto formaban rendelkezesre allnia.

A projekt ellenorzeset GitHub Actions CI is tamogatja. A CI futas bizonyitja, hogy a repositoryban levo kod kulso kornyezetben is telepitheto, buildelheto es tesztelheto. A dolgozatba erdemes beilleszteni a zold CI futas kepernyokepet, mert ez egyszeru es eros bizonyitek a reprodukalhatosagra.

Az OpenRouter alapú AI asszisztens eseteben kulon konfiguracio szukseges, mivel az API-kulcs nem lehet a frontendben vagy a GitHub repositoryban. Emiatt a hivas Cloudflare Worker proxyn keresztul tortenik, ahol az API-kulcs titokkent tarolhato. A dolgozatban fontos kiemelni, hogy a rendszer demo vagy fejlesztoi kornyezetben akkor mukodik teljesen, ha a szukseges kulso szolgaltatasok es kulcsok is be vannak allitva.

## Osszefoglalas vegere sajat reflexio minta

A projekt megvalositasa soran szamomra a legfontosabb tanulsag az volt, hogy egy webshop nem csak termekkartyak es kosar oldalak osszessege. Egy mukodo rendszerhez jogosultsagkezeles, adatmodell, validacio, rendelesi folyamat, adminisztracio, teszteles es dokumentalt uzemeltetesi leiras is szukseges. A TDLWebshop fejlesztese kozben fokozatosan valt vilagossa, hogy a szakdolgozat erteket nem csak az adja, mennyi funkcio keszult el, hanem az is, hogy ezek mennyire ellenorizhetoek es mennyire kovetheto a mogottuk allo mernoki gondolkodas.

Nehezseget jelentett a szerepkorok es a Firestore jogosultsagok osszehangolasa, a rendeles es keszletkezeles kovetkezetes kialakitasa, a PDF bizonylat elrendezese, valamint az AI asszisztens olyan korlatozasa, hogy ne adjon bizonytalan vagy nem relevans valaszokat. Ezek a problemak rairanyitottak a figyelmet arra, hogy egy latszolag egyszeru funkcio mogott sokszor tobb biztonsagi es adatminosegi kerdes is all.

Ha a projektet tovabbfejlesztenem, eloszor a teljes szerveroldali ar- es keszletellenorzest erositenem meg, majd reszletesebb E2E teszteket keszitenek a checkout, admin rendeleskezeles es jogosultsagi folyamatokhoz. Emellett az AI asszisztenshez kvotazast vagy rate limitet adnek, hogy eles kornyezetben is jobban vedheto legyen a szolgaltatas. A jelenlegi valtozatot szakdolgozati MVP-kent ertekelnem: bemutatja a vasarloi es adminisztracios alapfolyamatokat, mikozben lathatoak azok a pontok is, amelyek egy eles kereskedelmi rendszerben tovabbi megerositest igenyelnenek.

## Mit kell ebbol sajat nyelvre huzni?

Ezeket mindenkepp sajat megfogalmazasra kell atirni:

- a teljes MI-hasznalati fejezetet;
- az osszefoglalo sajat reflexiot;
- a "mit tanultam" es "mit csinalnek maskepp" reszeket;
- minden olyan mondatot, amely tul altalanosnak vagy tul kereknek hangzik;
- a technologiai dontesek indoklasat, mert azt neked kell megvedened.

A technikai kifejezeseket nem kell minden aron atfogalmazni. Az olyan szavak, mint Angular, Firebase, Firestore szabaly, Cloudflare Worker, OpenRouter, CI, build, teszt, role vagy MVP maradhatnak pontosan igy. A lenyeg az, hogy a korulottuk levo magyarazo szoveg termeszetesen a te hangodon szoljon.

## Hova illeszd a dolgozatban?

- "Mesterseges intelligencia hasznalata a fejlesztes soran": az osszefoglalas elott vagy utan onallo fejezetkent.
- "Biztonsagi minimum": a Biztonsag vagy Megvalositas fejezetbe.
- "Teszteles es validacio": a Teszteles fejezetbe.
- "Reprodukalhatosag": a Reprodukcio, Uzemeltetes vagy Repo fejezetbe.
- "Sajat reflexio": az Osszefoglalas vegere.

