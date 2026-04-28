# 0005 - Spark-kompatibilis architektúra és kompromisszumok

Dátum: 2026-04-28  
Státusz: Accepted

## Context

A projekt alap Firebase csomagon fut, ezért a fizetős funkciókra építő szerveroldali megoldásokat nem lehetett teljes mértékben használni.

## Decision

Az architektúra úgy lett kialakítva, hogy a legfontosabb üzleti funkciók Spark csomag alatt is működjenek, és csak opcionális továbbfejlesztési út maradjon a fejlettebb backend automatizálás.

## Alternatives

1. Blaze csomagra optimalizált megoldás  
Előny: több szerveroldali lehetőség.  
Hátrány: fizetős környezetet igényel.

2. Saját backend szerver használata  
Előny: teljes kontroll.  
Hátrány: jelentősen nagyobb komplexitás.

## Consequences

Pozitív:
- a projekt olcsón és egyszerűen demózható,
- a fő funkcionalitás publikus hostingon elérhető.

Negatív:
- bizonyos tranzakciós vagy automatizálási elemek kompromisszumosak,
- néhány szerveroldali működés csak dokumentált fejlesztési irányként szerepel.

## Verification

- a rendszer publikus Firebase Hosting alatt működik,
- a README és deploy script-ek Spark-kompatibilis használatra épülnek,
- a projekt jelenlegi feature-szintje működőképes külön fizetős backend nélkül is.
