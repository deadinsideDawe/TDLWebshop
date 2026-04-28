# Vision

## A projekt célja

A TDL Webshop célja egy olyan épületgépészeti webshop létrehozása, amely nemcsak az online vásárlókat szolgálja ki, hanem a kisebb vállalkozások és helyszíni értékesítést végző munkatársak számára is használható belső adminisztrációs felületet biztosít. A rendszer ezért egyszerre kezel webes termékböngészést, rendelésleadást, ügyfélprofilt, készletkezelést és belső helyszíni értékesítési folyamatokat.

## Célfelhasználók

1. Lakossági vásárlók  
Olyan felhasználók, akik gyorsan szeretnének épületgépészeti termékeket keresni, összehasonlítani és megrendelni.

2. Visszatérő szakmai vásárlók  
Szerelők, kisvállalkozók vagy céges partnerek, akik rendszeresen vásárolnak és értékelik a mentett adatok, a rendelési előzmények és a kedvezményes kezelés lehetőségét.

3. Belső dolgozók és adminisztrátorok  
Olyan munkatársak, akik termékeket kezelnek, készletet ellenőriznek, helyszíni vásárlást rögzítenek, ügyfélprofilokat hoznak létre vagy jóváhagyási döntéseket hoznak.

## Értékajánlat

- Egy rendszerben kezeli az online és helyszíni értékesítést.
- A szerepköralapú jogosultságkezelés miatt a belső felület a dolgozók számára is biztonságosan használható.
- A webshop felülete modern, reszponzív, dark és light módban is használható.
- A projekt a szakdolgozati cél mellett valós üzleti működéshez közeli funkciókat is megvalósít.

## Fő problémák, amelyekre a rendszer választ ad

- A kisebb vállalkozásoknál gyakran külön kezelik a webes rendeléseket és a helyszíni eladásokat.
- A belső készlet- és ügyfélkezelés sokszor nem integrált a webshopba.
- A jogosultságkezelés hiánya miatt a teljes admin felület túl széles hozzáférést adhat.
- A vásárlói élmény sok kisebb webshopnál gyenge mobilon vagy vizuálisan elavult.

## Non-goals

Az alábbi területek nem részei a jelenlegi MVP-nek:

- online bankkártyás fizetési szolgáltató teljes integrációja,
- könyvelő- vagy számlázó API-val való kötelező összekötés,
- több raktáras logisztikai modell,
- automatikus beszállítói rendelésindítás,
- teljes körű vállalatirányítási rendszer.

## Top kockázatok

- Az ingyenes Firebase Spark csomag korlátozza a szerveroldali automatizálási lehetőségeket.
- A túl sok funkció könnyen szétfeszítheti a szakdolgozati időkeretet.
- A belső jogosultságkezelés és a helyszíni értékesítés hibás működése üzleti szempontból is kritikus lenne.

## Személyes fejlesztői cél

A projekt során a fő célom nemcsak egy látványos felület elkészítése volt, hanem egy olyan webshop felépítése, amelynél a működés, a jogosultságkezelés, a tesztelhetőség és a dokumentálhatóság is szakdolgozati szinten értelmezhető.
