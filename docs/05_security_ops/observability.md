# Observability alapok

## Cél

Ha a rendszerben hiba történik, gyorsan meg lehessen állapítani, hogy melyik folyamat hibázott, milyen körülmények között és milyen szerepkörű felhasználót érintett.

## Jelenlegi alapok

- build és teszt visszajelzések,
- browser konzol hibák a fejlesztési környezetben,
- admin oldali státusz és visszajelző üzenetek,
- Firebase oldali adatellenőrzés és Firestore rules alapú visszautasítás.

## Javasolt alap metrikák

1. Sikeres rendelésleadások száma
2. Sikertelen rendelésmentések száma
3. Helyszíni vásárlás mentési hibák száma
4. Tiltott hozzáférési próbálkozások száma

## Logolási alapelv

- érzékeny személyes adat ne kerüljön feleslegesen logba,
- hibáknál a folyamat típusa legyen azonosítható,
- ahol értelmezhető, a szerepkör vagy művelet típusa jelenjen meg.

## Healthcheck gondolat

Firebase Hostingos frontendnél klasszikus backend health endpoint nincs, ezért a gyakorlatban a működőképesség igazolását a build, a deploy és a fő oldalak kézi validációja adja. Továbbfejlesztett backend esetén külön healthcheck endpoint lenne indokolt.
