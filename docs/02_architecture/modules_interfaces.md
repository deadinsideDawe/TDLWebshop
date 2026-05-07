# Modulok, interfeszek es adatkapcsolatok

Ez a dokumentum a konzulensi mintacsomag modul/API sablonjahoz igazodik. A TDL Webshop jelenlegi architekturaja elsosorban Angular frontendbol, Firebase szolgaltatasokbol es opcionális Cloudflare Worker AI proxybol all.

## 1. Frontend oldalak es komponensek

| Modul / oldal | Felelosseg | Lenyegi interfesz | Fuggosegek | Ellenorzes |
|---|---|---|---|---|
| `Home` | kezdolap, hirek, kategoriak, kiemelt termekek | navigacio, promo linkek, AI gomb | `ProductService`, news/admin adatok | manualis UX teszt |
| `Products` | termeklista, kereses, szures, akcios termekek | kategoriaval es keresessel szurt lista | `ProductService`, `CartService` | manualis + service teszt |
| `ProductDetails` | termekadatlap, galeria, kosarba helyezes | termekazonosito alapjan betoltes | `ProductService`, `CartService` | manualis |
| `Cart` | kosar es osszegzes | mennyiseg modositas, tetel torles | `CartService` | manualis + unit |
| `Checkout` | rendelés leadasa | validalt vasarloi adatok, kupon, fizetes | `OrderService`, `CartService`, `AuthService` | manualis |
| `Profile` | profiladatok es rendeleskovetes | sajat adatok, rendeléslista | `AuthService`, `UserService`, `OrderService` | manualis |
| `Wishlist` | kivansaglista | kedvelt termekek listaja | `WishlistService` | manualis |
| `Contact` | kapcsolat oldal | kapcsolatfelveteli sablon | statikus/adat alapu | manualis |
| `Admin` | admin/dolgozoi dashboard | termek, rendeles, keszlet, user, kupon, PDF, CSV | tobb service | manualis regresszio |
| `ShopAssistantComponent` | AI asszisztens UI | uzenetkuldes, termekajanlas megjelenites | `ChatbotLlmService`, `ChatbotRecommendationService` | automata + manualis |

## 2. Szolgaltatasok

| Service | Felelosseg | Fontos adat / metodus | Kulso fuggoseg |
|---|---|---|---|
| `AuthService` | bejelentkezes, regisztracio, szerepkor ellenorzes | login, logout, register, role lookup | Firebase Auth, Firestore |
| `ProductService` | termek CRUD, CSV import, katalogus | termeklista, mentes, torles, SKU alapu frissites | Firestore |
| `OrderService` | webes es helyszini rendelesek | rendelés letrehozas, statusz modositas | Firestore |
| `CartService` | kliensoldali kosar | tetelek, mennyiseg, vegosszeg | localStorage |
| `UserService` | profilok es jogosultsagok | role, permissions, disabled allapot | Firestore |
| `CustomerDirectoryService` | mentett vasarlok | kivalasztas, szerkesztes, tiltás | Firestore |
| `CouponService` | kuponok kezelese | kod validalas, kedvezmeny szamitas | Firestore |
| `InvoiceService` | PDF/szamla/bizonylat | rendelés alapjan PDF generalas | kliensoldali PDF logika |
| `NewsletterService` | hirlevel feliratkozas | email mentese | Firestore |
| `ChatbotLlmService` | AI proxy hivas es valaszszures | domain filter, katalogus kontextus, endpoint hivas | Cloudflare Worker |
| `ChatbotRecommendationService` | helyi/fallback ajanlas | katalogus alapú relevancia | Firestore / termeklista |

## 3. Kulso szolgaltatasok

| Szolgaltatas | Szerep | Megjegyzes |
|---|---|---|
| Firebase Auth | hitelesites | vasarlo, dolgozo es admin belepes |
| Firestore | adatbazis | termekek, rendelesek, profilok, kuponok, hirek |
| Firebase Hosting | eles frontend hosting | Spark-kompatibilis |
| Cloudflare Worker | OpenRouter proxy | secret kezeles miatt, mert Firebase Spark nem tud Functions secretet |
| OpenRouter | LLM API | csak szerveroldali proxyn keresztul hivott |

## 4. Adataramlas - vasarloi rendeles

1. A vasarlo termeket keres vagy kategoriat nyit.
2. A frontend a `ProductService` segitsegevel Firestore-bol olvas.
3. A vasarlo kosarba teszi a termeket, ezt a `CartService` kezeli.
4. Checkoutnal az adatok validalasa kliensoldalon tortenik.
5. Az `OrderService` menti a rendelest Firestore-ba.
6. A profil oldal ugyaninnen olvassa vissza a rendeléseket.

## 5. Adataramlas - admin/dolgozoi helyszini vasarlas

1. Admin vagy dolgozo bejelentkezik.
2. A jogosultsag alapjan csak az engedelyezett admin reszek jelennek meg.
3. A dolgozo mentett vasarlot valaszt vagy kezzel rogzit adatot.
4. A termek keresessel/SKU-val kivalaszthato.
5. A rendelés helyszini csatornakent mentodik.
6. A rendszer PDF bizonylatot/szamlat general.

## 6. Adataramlas - AI asszisztens

1. A felhasznalo kerdest ir az AI asszisztensbe.
2. A frontend eloszor domainhez kapcsolodo kerdeskent szuri a bemenetet.
3. A `ChatbotLlmService` csak relevans katalogusreszletet kuld a Workernek.
4. A Worker szerveroldali OpenRouter kulccsal meghivja a modellt.
5. A Worker es a frontend is korlatozza a termekajanlast: csak a kapott katalogusbol lehet ajanlani.
6. Ha nincs relevans termek, a valasz ovatos szakmai tanacs es egyeztetesi javaslat.

## 7. Jogosultsagi interfesz

| Szerepkor | Fo jogok | Tiltott vagy korlatozott muveletek |
|---|---|---|
| `customer` | termekbongeszes, kosar, rendelés, profil | admin es dolgozoi felulet |
| `employee` | helyszini vasarlas, keszlet, termekfeltoltes, vasarlo kezeles | admin jovahagyas, melyebb rendszerbeallitasok |
| `admin` | teljes adminisztracio, jogosultsagok, kuponok, rendelesek | nincs uzleti szintu korlatozas |

## 8. Tesztelesi kapcsolodas

- Checkout: `TC-03`, `TC-04`.
- Stock update es rendelésstatusz: `TC-07`, `TC-09`.
- Forbidden role: `TC-08`.
- Coupon validation: `TC-10`.
- AI valaszszures: `TC-11`.
