# Kovetelmenyek es nyomonkovetes

## Funkcionalis kovetelmenyek

| ID | Kovetelmeny | Felhasznaloi ertek | Prioritas | Elfogadasi kriterium | Use case | Kepernyo | Teszt |
|---|---|---|---|---|---|---|---|
| FK-01 | A vasarlo bongeszhet kategoriak es termekek kozott. | gyors termektalalas | Must | termekek listazodnak es szurhetok | UC-01 | SCR-PRODUCTS | TC-01 |
| FK-02 | A vasarlo kosarba tehet termeket. | rendeles elokeszitese | Must | termek mennyiseggel bekerul a kosarba | UC-02 | SCR-PRODUCTS, SCR-CART | TC-02 |
| FK-03 | A vasarlo rendelest adhat le. | teljes vasarloi ut | Must | valid adatokkal rendelés mentodik | UC-03 | SCR-CHECKOUT | TC-03 |
| FK-04 | A regisztralt vasarlo latja korabbi rendeleseit. | rendeléskovetes | Should | profilban rendeleslista megjelenik | UC-04 | SCR-PROFILE | TC-04 |
| FK-05 | Az admin termeket hozhat letre es modosithat. | katalogus karbantartas | Must | termek Firestore-ban megjelenik | UC-05 | SCR-ADMIN-PRODUCTS | TC-05 |
| FK-06 | Az admin/dolgozo helyszini vasarlast rogzithet. | bolti folyamat tamogatasa | Must | rendelés es PDF bizonylat keszul | UC-06 | SCR-ADMIN-ORDERS | TC-06 |
| FK-07 | A rendszer kezeli a szerepkoroket. | biztonsagos mukodes | Must | admin, dolgozo es vasarlo mas funkciot er el | UC-07 | SCR-ADMIN-USERS | TC-SEC-01 |
| FK-08 | A rendszer keszletfigyelest ad. | raktari dontestamogatas | Should | alacsony keszlet jelzodik | UC-08 | SCR-ADMIN-INVENTORY | TC-08 |
| FK-09 | A rendszer kuponokat es akciokat kezel. | uzleti promociok | Should | kedvezmeny helyesen szamolodik | UC-09 | SCR-CHECKOUT, SCR-ADMIN | TC-09 |
| FK-10 | Az AI asszisztens katalogus-alapu valaszokat ad. | gyors termektanacsadas | Could | termekhez kotott kerdesre relevans valasz jon vagy fallback | UC-10 | SCR-AI | TC-AI-01 |

## Nem funkcionalis kovetelmenyek

| ID | Minosegi attributum | Kovetelmeny | Meresi mod | Cel ertek | Teszt |
|---|---|---|---|---|---|
| NFK-01 | Biztonsag | Nincs valodi titok a repoban. | kodertekezes, keresesi parancsok | nincs talalat | TC-SEC-SECRET |
| NFK-02 | Jogosultsag | Tiltott vagy nem megfelelo szerepkoru user nem fer admin funkciohoz. | kezi jogosultsagi teszt | tiltott muvelet elutasitva | TC-SEC-ROLE |
| NFK-03 | Reprodukalhatosag | README alapjan telepitheto es buildelheto. | tiszta kornyezetben build | sikeres build | TC-REP-01 |
| NFK-04 | UX | A fo vasarloi folyamat hiba es siker allapotot is mutat. | kezi teszt | ertheto visszajelzes | TC-UX-01 |
| NFK-05 | Reszponzivitas | Fo oldalak mobilon is hasznalhatok. | mobil meretu bongeszo ellenorzes | nincs torott layout | TC-MOB-01 |

