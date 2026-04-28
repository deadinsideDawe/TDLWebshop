# 0001 - Firebase backend választása

Dátum: 2026-04-28  
Státusz: Accepted

## Context

A projekt célja egy működő webshop létrehozása volt rövid idő alatt, külön szerverüzemeltetés nélkül. Fontos szempont volt a gyors autentikáció, a hosztolhatóság és az, hogy az admin felülethez szükséges adatok is egy könnyen kezelhető backendben legyenek.

## Decision

A backend központi szolgáltatásainak megvalósításához Firebase Authentication + Cloud Firestore + Firebase Hosting kombinációt választottam.

## Alternatives

1. Saját Node.js backend + SQL adatbázis  
Előny: nagyobb kontroll, tranzakciókezelés, klasszikus backend architektúra.  
Hátrány: több infrastruktúra, több setup, nagyobb időigény.

2. Supabase  
Előny: SQL-alapú adattárolás, auth támogatás.  
Hátrány: a projekt elején nem erre épült a környezet, plusz átállási költség lett volna.

## Consequences

Pozitív:
- gyors fejlesztési indulás,
- egyszerű deploy,
- kész auth és hosting támogatás.

Negatív:
- a Spark csomag korlátozza a szerveroldali automatizálást,
- összetettebb tranzakciós logikánál több kompromisszum kell,
- a Firestore szabályok külön figyelmet igényelnek.

## Verification

- az autentikáció és hosting működését valós deploy igazolja,
- a Firestore alapú adatműveletek a webshop teljes működésében használatban vannak,
- a build és manuális tesztek alapján a választott stack képes kiszolgálni az MVP scope-ot.
