# 0004 - Helyszíni vásárlás rögzítése és PDF bizonylat

Dátum: 2026-04-28  
Státusz: Accepted

## Context

A projekt egyik kiemelő funkciója, hogy ne csak klasszikus webshopként működjön, hanem a belső helyszíni értékesítést is támogassa.

## Decision

Az admin felületen külön helyszíni vásárlás modul készült, amely mentett vásárló kiválasztását, termékkeresést, rendelésrögzítést és PDF bizonylat készítést is lehetővé tesz.

## Alternatives

1. Helyszíni értékesítés külön rendszerben  
Előny: leválasztott felelősség.  
Hátrány: nem integrált adatkezelés.

2. Helyszíni értékesítés csak egyszerű rendelésként  
Előny: kisebb fejlesztési költség.  
Hátrány: nem mutat valódi belső üzleti támogatást.

## Consequences

Pozitív:
- a webshop üzletileg erősebb és szakdolgozatilag is különlegesebb lett,
- a mentett vásárlók és admin funkciók jobban összekapcsolódtak.

Negatív:
- a számlázási/bizonylati layout és validáció külön odafigyelést igényel,
- készletkezelési konzisztenciára külön figyelni kell.

## Verification

- a helyszíni vásárlás az admin felületen végigjárható,
- a PDF generálás megvalósult,
- a funkcióhoz külön hibajavítások és validációk készültek.
