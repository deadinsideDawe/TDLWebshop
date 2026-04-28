# 0002 - Angular standalone komponens alapú frontend

Dátum: 2026-04-28  
Státusz: Accepted

## Context

A frontendhez olyan keretrendszer kellett, amely támogatja a nagyobb, több oldalas kliensalkalmazásokat, a típusbiztos fejlesztést és a jól szétválasztható page/service struktúrát.

## Decision

A frontend Angularra épül, standalone komponenses szervezéssel.

## Alternatives

1. React  
Előny: rugalmas, népszerű, sok UI eszköz.  
Hátrány: több döntést kellett volna külön meghozni a struktúrához.

2. Vue  
Előny: könnyen tanulható, gyors UI-fejlesztés.  
Hátrány: a projektben a típusos, nagyobb alkalmazásszervezéshez Angular jobban illett.

## Consequences

Pozitív:
- egységes komponens- és service-szervezés,
- TypeScript-központú működés,
- jól kezelhető routing és form logika.

Negatív:
- összetettebb boilerplate,
- néhány egyszerű képernyőhöz is nagyobb szerkezeti fegyelem kell.

## Verification

- a webshop minden fő nézete Angular oldalakra épül,
- a tesztelt komponensek és szolgáltatások mutatják, hogy a szerkezet karbantartható,
- a build sikeresen lefut a jelenlegi projektstruktúrával.
