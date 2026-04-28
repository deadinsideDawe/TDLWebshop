# 0003 - Szerepköralapú hozzáférés és dolgozói jogosultságok

Dátum: 2026-04-28  
Státusz: Accepted

## Context

A webshop nemcsak vásárlói felületet tartalmaz, hanem belső admin funkciókat is. Ezért nem volt elég egyetlen admin szerepkör, mert a dolgozók csak részleges hozzáférést igényelnek.

## Decision

A rendszer három fő szerepkört használ: `customer`, `employee`, `admin`, és a dolgozó szerepkörön belül további finomhangolt jogosultságok vannak.

## Alternatives

1. Csak user/admin modell  
Előny: egyszerűbb megvalósítás.  
Hátrány: túl széles adminjogokat adna.

2. Minden dolgozónak azonos belső jog  
Előny: gyorsabb UI-szintű megvalósítás.  
Hátrány: gyengébb biztonság és rosszabb üzleti kontroll.

## Consequences

Pozitív:
- jól elválasztható felelősségi körök,
- biztonságosabb belső felület,
- a dolgozói nézet rugalmasabban szabható.

Negatív:
- összetettebb guard és Firestore rules logika,
- több tesztelési szcenárió szükséges.

## Verification

- a login és admin guard a szerepkörökre épül,
- a Firestore szabályok külön ellenőrzik az admin és dolgozói jogokat,
- több tesztfiókkal manuális ellenőrzés történt.
