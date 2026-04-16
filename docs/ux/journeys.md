# Top 3 user journey

## 1) Webes rendelés leadása személyes átvétellel
**Persona:** Lakossági vásárló, aki gyorsan le akarja foglalni a szükséges termékeket, és üzletben venné át.

**Belépési pont:** `S01` Főoldal vagy közvetlen terméklista link (`S02`).

1. **S01 - Főoldal**  
   A felhasználó rákattint egy kategóriára vagy a "Termékek böngészése" gombra.  
   Rendszerválasz: megnyílik a terméklista (`S02`) előszűrve.  
   Hibaág: ha nincs találat, üres állapot jelenik meg.
2. **S02 - Terméklista**  
   A felhasználó szűr, majd kosárba rak egy terméket.  
   Rendszerválasz: kosár-visszajelző modál jelenik meg (`S16`).  
   Hibaág: készlethiánynál a kosárba gomb tiltott vagy hibaüzenet jelenik meg.
3. **S16 - Kosárba visszajelző modál**  
   A felhasználó az "Ugrás a kosárra" gombra kattint.  
   Rendszerválasz: megnyílik a kosár oldal (`S05`).
4. **S05 - Kosár**  
   A felhasználó ellenőrzi a tételeket és a "Rendelés véglegesítése" gombot választja.  
   Rendszerválasz: checkout oldal (`S06`).  
   Hibaág: üres kosárnál nincs továbblépés.
5. **S06 - Checkout**  
   A felhasználó kitölti az adatokat, kiválasztja a személyes átvételt és leadja a rendelést.  
   Rendszerválasz: rendelés mentése, készletfrissítés, sikeroldal (`S07`).  
   Hibaág: validációs hiba, jogosultsági hiba vagy Firestore mentési hiba.
6. **S07 - Rendelés sikeres**  
   A felhasználó visszaigazolást lát rendelésazonosítóval.

**Sikerkritérium:** a rendelés bekerül a Firestore-ba, a készlet csökken, és megjelenik a sikeres státusz.  
**Mért időtartam (kb.):** 70-120 mp, 8-12 kattintás.

---

## 2) Profilfrissítés és rendelések megtekintése
**Persona:** Bejelentkezett vásárló, aki módosítani szeretné az adatait és ellenőrizné korábbi rendeléseit.

**Belépési pont:** fejléc "Profilom" menüpont (`S10`).

1. **S10 - Profilom + rendeléseim**  
   A felhasználó módosítja az adatokat (szállítási/számlázási adatok, céges adatok), majd ment.  
   Rendszerválasz: sikeres mentési visszajelzés.  
   Hibaág: hibás formátum vagy hiányzó kötelező mező.
2. **S10 - Profilom + rendeléseim**  
   A felhasználó a rendeléslistához görget.  
   Rendszerválasz: megjelennek a saját rendelések státuszai.  
   Hibaág: üres lista állapot.

**Sikerkritérium:** a profil adatai mentésre kerülnek, és a user látja a rendelési előzményeit.  
**Mért időtartam (kb.):** 30-60 mp, 4-7 kattintás.

---

## 3) Admin rendeléskezelés és készletfigyelés
**Persona:** Üzlet adminisztrátora, aki a rendelések státuszát kezeli és figyeli az alacsony készletet.

**Belépési pont:** login (`S08`) admin fiókkal, majd admin panel (`S11`).

1. **S08 - Login**  
   Az admin bejelentkezik.  
   Rendszerválasz: admin áttekintés oldal (`S11`).  
   Hibaág: rossz jelszó vagy nem admin jogosultság.
2. **S11 - Admin áttekintés**  
   Az admin ellenőrzi az alacsony készlet jelzéseket és gyors statisztikákat.  
   Rendszerválasz: dashboard adatok betöltése Firestore-ból.  
   Hibaág: hálózati vagy Firestore hiba.
3. **S14 - Admin rendeléskezelés**  
   Az admin kiválaszt egy rendelést és státuszt vált.  
   Rendszerválasz: megerősítő modál nyílik (`S17`).
4. **S17 - Státusz megerősítő modál**  
   Az admin megerősíti a műveletet.  
   Rendszerválasz: státusz frissül, készlet módosul.  
   Hibaág: írási jogosultság vagy tranzakciós hiba.
5. **S14 - Admin rendeléskezelés**  
   Az admin PDF bizonylatot generál/letölt.

**Sikerkritérium:** a státusz frissül, a készlet konzisztens marad, és a bizonylat letölthető.  
**Mért időtartam (kb.):** 40-90 mp, 5-9 kattintás.
