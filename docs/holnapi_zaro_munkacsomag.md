# TDLWebshop holnapi zaro munkacsomag

Cel: 8:00 es 13:00 kozott a szakdolgozatot es a repot olyan allapotba hozni, hogy mar csak sajat nyelvezetre huzas, apro formai javitas es vegso atnezes maradjon.

## 0. Fontos szabaly holnapra

- Ne kezdjunk uj nagy funkcioba.
- Ami mukodik, azt bizonyitsuk: screenshot, teszt, dokumentacio.
- Ami nem kritikus, az menjen tovabbfejlesztesi iranyba.
- A sajat nyelvezetre atiras a vegen jon, most a szerkezet es bizonyitek legyen kesz.

## 1. Idobeosztas 8:00-13:00

### 8:00-8:30 Repo es GitHub ellenorzes

- [ ] GitHubon a legutolso commit zold CI-vel latszik.
- [ ] A commit uzenete rendben van: `konzulensi javítások elvégzése`.
- [ ] A repo gyokerben van ertheto `README.md`.
- [ ] Van `.env.example`, de nincs benne valodi jelszo vagy API kulcs.
- [ ] Nincs commitolva `node_modules`.
- [ ] Nincs commitolva `.env`, build mappa, cache vagy gepfuggo fajl.
- [ ] A `workers/openrouter-proxy` mappa benne van, de OpenRouter kulcs nincs benne.
- [ ] Firestore rules fajl benne van: `firestore.rules`.

Kep:
- [ ] GitHub Actions zold CI screenshot.

Javasolt abracim:
> GitHub Actions CI futas sikeres eredmenye.

### 8:30-9:45 Webshop kepernyokepek

Keszits screenshotot ezekrol:

- [ ] Kezdolap dark mode, latszodjon a navbar es a hero resz.
  - Abracim: A TDLWebshop kezdolapja dark mode megjelenessel.

- [ ] Kezdolap kategoria lenyilo menuvel.
  - Abracim: A kategoria lenyilo menu liquid glass jellegu megjelenese.

- [ ] Kezdolap AI asszisztens nyitott ablakkal.
  - Abracim: A katalogushoz kotott AI asszisztens mukodese a kezdolapon.

- [ ] Termeklista oldal keresessel vagy kategoria szuresevel.
  - Abracim: Termeklista oldal kategoriaval es keresesi lehetoseggel.

- [ ] Egy konkret termek adatlapja.
  - Abracim: Termekadatlap kepgaleriaval, arral es keszletinformacioval.

- [ ] Kivansaglista oldal.
  - Abracim: Regisztralt vasarlo kivansaglista nezete.

- [ ] Kosar oldal legalabb ket termekkel.
  - Abracim: Kosar oldal mennyisegmodositassal es osszegzessel.

- [ ] Checkout oldal hibas email vagy telefonszam validacioval.
  - Abracim: Checkout urlap mezoszintu validacios hibaval.

- [ ] Checkout sikeres rendeles utan.
  - Abracim: Sikeres rendelesleadast koveto visszajelzes.

- [ ] Profil oldal rendelestortenettel.
  - Abracim: Vasarloi profil oldal korabbi rendelesekkel es statuszkovetessel.

### 9:45-10:45 Admin kepernyokepek

Keszits screenshotot ezekrol:

- [ ] Admin attekintes / dashboard.
  - Abracim: Admin attekinto felulet statisztikai kartyakkal.

- [ ] Admin termekkezeles.
  - Abracim: Admin termekkezelesi felulet.

- [ ] CSV import resz.
  - Abracim: CSV alapu tomeges termekimport admin feluleten.

- [ ] Keszletfigyeles / keszletlista.
  - Abracim: Keszletfigyeles es alacsony keszlet admin nezete.

- [ ] Helyszini vasarlas mentett vasarlo kivalasztassal.
  - Abracim: Helyszini vasarlas rogzitese mentett vasarlo adataival.

- [ ] Mentett vasarlok listaja szerkesztes/tiltas gombbal.
  - Abracim: Mentett vasarlok kezelese es tiltasi lehetoseg.

- [ ] Admin felhasznalo/jogosultsag kezeles.
  - Abracim: Felhasznalok es szerepkorok kezelese admin feluleten.

- [ ] PDF szamla vagy helyszini bizonylat megnyitva.
  - Abracim: A rendszer altal generalt PDF szamla/bizonylat.

### 10:45-11:30 Diagramok beillesztese

Diagramok helye:

- [ ] Use case diagram: `docs/02_architecture/diagram_kepek/01_use_case_attekintes.svg`
- [ ] Komponens architektura: `docs/02_architecture/diagram_kepek/02_komponens_architektura.svg`
- [ ] Adatmodell: `docs/02_architecture/diagram_kepek/03_adatmodell.svg`
- [ ] Checkout folyamat: `docs/02_architecture/diagram_kepek/04_checkout_folyamat.svg`
- [ ] Admin statusz/keszlet: `docs/02_architecture/diagram_kepek/05_admin_statusz_keszlet.svg`
- [ ] Helyszini vasarlas: `docs/02_architecture/diagram_kepek/06_helyszini_vasarlas.svg`
- [ ] AI asszisztens: `docs/02_architecture/diagram_kepek/07_ai_asszisztens.svg`
- [ ] Biztonsagi attekintes: `docs/02_architecture/diagram_kepek/08_biztonsagi_attekintes.svg`

Javasolt sorrend a dolgozatban:

1. Use case diagram a kovetelmenyek fejezetbe.
2. Komponens architektura az architektura fejezetbe.
3. Adatmodell az adatmodell fejezetbe.
4. Checkout, admin statuszvaltas, helyszini vasarlas a megvalositas fejezetbe.
5. AI asszisztens diagram az AI asszisztens fejezetbe.
6. Biztonsagi attekintes a biztonsag fejezetbe.

### 11:30-12:15 Kodreszlet screenshotok

Ezeket csak akkor fotozd, ha kell kodreszlet a dolgozatba. Ha nincs ido, eleg 4-5 kulcsresz.

- [ ] `src/pages/checkout/checkout.ts`
  - Mit mutasson: rendeles veglegesitese, validacio, order service hivas.
  - Miért jo: a vasarloi ut kritikus pontja.

- [ ] `src/app/services/order.service.ts`
  - Mit mutasson: rendelesstatusz, audit es keszlet tranzakcio.
  - Miért jo: ez bizonyitja, hogy a keszlet es rendelés nem kulon-kulon, hanem kontrollalt folyamatban mozog.

- [ ] `src/app/services/order.service.ts`
  - Mit mutasson: helyszini vasarlas mentese.
  - Miért jo: admin/dolgozoi domainfunkcio, szakdolgozati plusz ertek.

- [ ] `src/app/services/invoice.service.ts`
  - Mit mutasson: PDF szamla/bizonylat felepites.
  - Miért jo: kimeneti dokumentum generalas, webshopos realis funkcio.

- [ ] `firestore.rules`
  - Mit mutasson: admin, dolgozo, vasarlo, disabled user ellenorzes.
  - Miért jo: jogosultsagi rendszer es biztonsagi minimum bizonyitasa.

- [ ] `src/pages/admin/admin.ts`
  - Mit mutasson: admin/dolgozoi jogosultsagkezeles.
  - Miért jo: szerepkoralapu mukodes bemutatasa.

- [ ] `src/pages/admin/admin.ts`
  - Mit mutasson: CSV import validacio es mentés.
  - Miért jo: tomeges termekfeltoltes bizonyitasa.

- [ ] `src/app/services/chatbot-llm.service.ts`
  - Mit mutasson: AI asszisztens domainellenorzes es kataloguslogika.
  - Miért jo: AI nem csak szabad chatbot, hanem webshop adatokhoz kotott funkcio.

- [ ] `workers/openrouter-proxy/src/index.js`
  - Mit mutasson: OpenRouter proxy es szerveroldali kulcskezeles.
  - Miért jo: API kulcs nem kerul kliensoldali kodba.

### 12:15-12:45 Legfontosabb dokumentumok atnezese

Kotelezoen nezd at:

- [ ] `README.md`
- [ ] `docs/09_biztonsagi_minimum.md`
- [ ] `docs/10_teszteles_validacio.md`
- [ ] `docs/07_adatmodell.md`
- [ ] `docs/11_MI_hasznalati_nyilatkozat_es_naplo.md`
- [ ] `docs/szakdolgozat_fejezetvaz_kepernyokep_kodterv.md`
- [ ] `docs/02_architecture/thesis_diagrams.md`

Ezeknel most eleg:

- [ ] Nincs benne jelszo vagy API kulcs.
- [ ] Nincs benne tul AI-s, tul altalanos, kamu hangulatu allitas.
- [ ] Vilagosan leirja, hogy mi keszult el.
- [ ] Latszik, hogy te felelsz a kodert es validalasert.

### 12:45-13:00 Vegso gyors audit

- [ ] Van mukodo repo.
- [ ] Van zold CI screenshot.
- [ ] Van legalabb 12-15 webshop/admin screenshot.
- [ ] Van legalabb 5 kodreszlet screenshot.
- [ ] Be vannak keszitve a diagramok.
- [ ] A README es a kulcsdokumentumok rendben vannak.
- [ ] A tovabbfejlesztesi iranyok kulon vannak kezelve, nem ugy tunnek, mint felkesz hianyok.

## 2. Minimum kepernyokep csomag, ha szorit az ido

Ha keves az ido, ezek legyenek meg biztosan:

1. Kezdolap.
2. Termeklista.
3. Termekadatlap.
4. Kosar.
5. Checkout validacio.
6. Sikeres rendeles.
7. Profil/rendeleskovetes.
8. Admin dashboard.
9. Admin CSV import.
10. Helyszini vasarlas.
11. PDF szamla.
12. AI asszisztens.
13. GitHub Actions zold CI.

## 3. Minimum kodreszlet csomag

Ha csak 5 kodreszlet fer bele:

1. Checkout rendelesmentes.
2. OrderService tranzakcio.
3. InvoiceService PDF.
4. Firestore rules jogosultsag.
5. ChatbotLlmService + Worker proxy.

## 4. Amit en tudok holnap gyorsan segiteni

- [ ] Megnezem, hogy a screenshot lista teljes-e.
- [ ] Pontositom a kodsorokat aktualis sorok alapjan.
- [ ] Megnezem a Wordbe beillesztett abrak sorrendjet.
- [ ] Atnezem, hogy a szoveg tul AI-snak hat-e.
- [ ] Javitasokat javaslok a bevezeteshez, megvalositashoz, teszteleshez.
- [ ] Ellenorzom a vegso repo allapotot.

## 5. Oszinte allapot

Ha ezt a munkacsomagot holnap vegig tudjuk vinni, akkor a projekt beadashoz kozeli, erosen vedheto allapotban lesz.

A kod es funkciok jelenleg mar jo alapot adnak. A legnagyobb maradek feladat nem uj fejlesztes, hanem:

- bizonyitek osszerakasa,
- kepernyokepek,
- sajat nyelvezetre atiras,
- vegso dokumentacios osszerendezes.

Szigoru becsles:

- Holnap 8:00-13:00 utan: eros 4-es / 5-os kozeli beadási allapot.
- Ha hetfon vagy kedden meg egyszer atmegyunk rajta: realisan vedheto 5-os szint.
