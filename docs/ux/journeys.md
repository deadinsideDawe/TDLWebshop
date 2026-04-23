# Top 3 user journey

## 1) Vásárló rendelést ad le személyes átvétellel
**Persona:** Olyan vásárló, aki gyorsan szeretné lefoglalni a szükséges termékeket, és személyesen venné át.

**Belépési pont:** `S01` (Főoldal)

1. **S01 - Főoldal**  
   A felhasználó kategóriát választ vagy a terméklistára megy.  
   Rendszerválasz: megnyílik a `S02` (Terméklista).  
   Hibaág: ha nincs találat, üres állapot jelenik meg.
2. **S02 - Terméklista**  
   A felhasználó kiválaszt egy terméket és kosárba teszi.  
   Rendszerválasz: `S16` (Kosárba visszajelző modál) megjelenik.
3. **S16 - Kosárba modál**  
   A felhasználó „Ugrás a kosárra” opciót választ.  
   Rendszerválasz: `S05` (Kosár) oldal nyílik.
4. **S05 - Kosár**  
   A felhasználó ellenőrzi a tételeket és a tovább gombra kattint.  
   Rendszerválasz: `S06` (Checkout) oldal nyílik.
5. **S06 - Checkout**  
   A felhasználó megadja az adatokat és leadja a rendelést.  
   Rendszerválasz: `S07` (Rendelés sikeres).  
   Hibaág: hibás mező vagy mentési hiba esetén hibaüzenet.

**Sikerkritérium:** létrejön a rendelés, és megjelenik a sikeroldal.  
**Mért időtartam:** kb. 1-2 perc, 8-12 kattintás.

---

## 2) Bejelentkezett felhasználó profiladatot frissít
**Persona:** Visszatérő vásárló, aki módosítani szeretné a profil adatait.

**Belépési pont:** `S10` (Profilom + rendeléseim)

1. **S10 - Profilom**  
   A felhasználó módosítja a szállítási/számlázási adatokat.  
   Rendszerválasz: mentés után siker visszajelzés jelenik meg.  
   Hibaág: hiányzó kötelező mező.
2. **S10 - Rendeléseim szekció**  
   A felhasználó átnézi a rendeléslista státuszait.  
   Rendszerválasz: rendelések betöltődnek.  
   Hibaág: üres állapot jelenik meg.

**Sikerkritérium:** profil mentve, rendelések láthatók.  
**Mért időtartam:** kb. 30-60 mp, 4-7 kattintás.

---

## 3) Admin rendelést kezel és készletet figyel
**Persona:** Az üzlet adminisztrátora, aki a napi rendeléseket állítja és készletet ellenőriz.

**Belépési pont:** `S08` (Login), majd `S11` (Admin áttekintés)

1. **S08 - Login**  
   Az admin bejelentkezik.  
   Rendszerválasz: `S11` admin oldal megnyílik.  
   Hibaág: hibás belépési adat.
2. **S11 - Admin áttekintés**  
   Az admin ellenőrzi a statisztikákat és az alacsony készlet jelzéseket.
3. **S14 - Admin rendeléskezelés**  
   Az admin kiválaszt egy rendelést és státuszt vált.  
   Rendszerválasz: `S17` megerősítő modál.
4. **S17 - Státusz megerősítő modál**  
   Az admin megerősíti a műveletet.  
   Rendszerválasz: státusz frissül, készlet módosul.

**Sikerkritérium:** a rendelés státusza frissül és az adat konzisztens marad.  
**Mért időtartam:** kb. 40-90 mp, 5-9 kattintás.

---

## Osszegzes
A legerosebb felhasznaloi folyamat a termekkeresesbol indul, majd kosaron es checkouton keresztul jut el a rendelésig. Admin oldalon ezt a keszletkezeles, statuszvaltas es bizonylatletoltes egesziti ki, igy a rendszer nem csak vasarloi, hanem uzemeltetoi oldalrol is bemutathato.
