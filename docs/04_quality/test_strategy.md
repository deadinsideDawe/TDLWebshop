# Teszt stratégia

## Cél

A tesztelés célja az volt, hogy a webshop fő felhasználói folyamatai, az adminisztratív belső műveletek és a kritikus szolgáltatási logikák stabilan működjenek, és egy változtatás után gyorsan észlelhető legyen a regresszió.

## Tesztelési szintek

### 1. Unit / komponens közeli tesztek

Főként Angular spec fájlokban jelennek meg. Ezek ellenőrzik:

- szolgáltatások alap logikáját,
- űrlapvalidációt,
- kosár- és invoice logikát,
- egyes oldalak fő működési feltételeit.

### 2. Manuális funkcionális tesztelés

Különösen fontos volt a következő folyamatoknál:

- regisztráció és belépés,
- terméklista és termékadatlap,
- kosár és checkout,
- profil és rendelési előzmények,
- admin termékkezelés,
- helyszíni vásárlás,
- mentett vásárlók kezelése,
- szerepkörök és jogosultságok.

### 3. Jogosultsági tesztek

Külön tesztfiókokkal történt ellenőrzés:

- vásárlói szerepkör,
- több eltérő jogosultságú dolgozó,
- adminisztrátori szerepkör.

## Negatív tesztelés

Kifejezetten ellenőrzött hibás vagy tiltott esetek:

- hibás e-mail-cím,
- hibás telefonszám,
- hiányzó kötelező mezők,
- tiltott vásárló kiválasztása,
- jogosulatlan admin felület elérés,
- hosszabb fizetési határidő jóváhagyás nélkül.

## Automatikus minőségi kapuk

- `npm run build`
- `npm test -- --watch=false`

Ezek minden nagyobb fejlesztési kör után futtatásra kerültek.

## Jelenlegi korlátok

- nincs teljes E2E automatizáció minden fő user flow-ra,
- a Firebase-alapú valós integrációk többsége manuális ellenőrzéssel lett validálva,
- a számlagenerálás vizuális helyességét főként kézi ellenőrzés támogatta.
