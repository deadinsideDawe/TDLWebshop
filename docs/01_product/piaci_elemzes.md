# Piaci es teruleti elemzes - TDL Webshop

## Cel

Az elemzes celja annak bemutatasa, hogy a TDL Webshop nem csak altalanos webshop-masolat, hanem epuletegepeszeti domainre szabott rendszer. A hasonlo megoldasokbol a projekt atveszi a vasarloi webshop alapmintait, de erosebben hangsulyozza a belso adminisztraciot, a helyszini vasarlast, a keszletfigyelest es a dolgozoi szerepkoroket.

## Osszehasonlitas

| Megoldas | Celcsoport | Fo funkciok | Erossegek | Hianyossagok | UX tanulsag | Technologiai / biztonsagi tanulsag | Sajatra kovetkeztetes |
|---|---|---|---|---|---|---|---|
| Altalanos epuletegepeszeti webshop | lakossagi es szereloi vasarlok | termeklista, kosar, checkout | megszokott vasarloi folyamat | belso dolgozoi folyamat kevesbe lathato | gyors kereses es szures kell | jogosultsag es rendelesadat vedelme fontos | eros termeklista es checkout kell |
| Nagy barkacsaruhazi webshop | lakossagi tomegpiac | kategoriak, akciok, keszletinformacio | jo kereshetoseg, eros vizualis termekkartyak | szakmai csomagok kevesbe specifikusak | kategoria es keszlet kiemelese hasznos | nagy rendszernel erosebb audit kell | keszlet es akcio kulon lathato legyen |
| B2B/nagyker portal | szerelok, cegek | belepes, egyedi ar, rendelestortenet | cegeknek hatekony | lakossagi UX gyakran gyengebb | gyors ujrarendeles hasznos lenne | szerepkor es arkezeles kritikus | dolgozoi es ceges kedvezmeny hasznos plusz |
| Helyszini ertekesitesi rendszer | bolt/dolgozo | gyors termekvalasztas, bizonylat | gyors adminisztracio | nem webshop jellegu | gepeleses termekkereses kell | hibas adatbol hibas bizonylat keszulhet | helyszini vasarlas kulon domain-ertek |

## Kovetkeztetesek

- A projekt legfontosabb sajat erteke az, hogy a webshop es az admin/dolgozoi mukodes egy rendszerben jelenik meg.
- Az MVP-ben indokolt megtartani a termeklista, kosar, checkout, profil, admin, keszlet, kupon es helyszini vasarlas funkciokat.
- A valos bankkartyas fizetes es NAV-szintu szamlazo integracio tudatosan kivul maradt, mert kulso szolgaltatot, jogi/penzugyi beallitast es tobb idot igenyelne.
- UX szempontbol a keresheto termeklista, a lathato keszlet, a validalt checkout es az admin gyors termekkeresese a legfontosabb.
- Biztonsagi szempontbol a szerepkor-alapu hozzaferes, a Firestore szabalyok es a titokkezeles a legfontosabb bizonyitando terulet.

