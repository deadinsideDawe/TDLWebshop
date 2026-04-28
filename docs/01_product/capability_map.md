# Capability Map

Az alábbi capability map azt mutatja meg, hogy mely termékképességek készültek el, melyek részben készültek el, és melyek tekinthetők tudatosan halasztott elemnek.

| Képesség | Státusz | Rövid leírás | Evidence |
|---|---|---|---|
| Kezdőoldal és fő navigáció | Done | Reszponzív nyitófelület dark/light témával, keresővel és kategórianavigációval. | `src/pages/home/*`, élő oldal |
| Terméklista és keresés | Done | Termékek listázása, keresés, kategóriás böngészés. | `src/pages/products/*` |
| Termékadatlap | Done | Részletes terméknézet, ár, készlet, kosárműveletek. | `src/pages/product-details/*` |
| Kosár és checkout | Done | Vásárlási folyamat a kosártól a rendelés leadásáig. | `src/pages/cart/*`, `src/pages/checkout/*` |
| Profil és rendelési előzmények | Done | Regisztrált felhasználó saját adatainak és rendeléseinek megtekintése. | `src/pages/profile/*` |
| Kívánságlista | Done | Mentett termékek külön oldalon való kezelése. | `src/pages/wishlist/*` vagy kapcsolódó komponensek |
| Admin termékkezelés | Done | Új termék létrehozása, szerkesztés, kategóriaválasztás, készletkezelés. | `src/pages/admin/*` |
| Készletnézet kategóriaszűrővel | Done | Az admin a készletet kategória szerint tudja szűrni. | `src/pages/admin/*` |
| Helyszíni vásárlás rögzítése | Done | Belső rendelésrögzítés, mentett vásárló választás és PDF. | `src/pages/admin/*`, `src/app/services/invoice.service.ts` |
| Mentett vásárlók kezelése | Done | Magánszemély és céges ügyfélprofilok létrehozása, szerkesztése, tiltása. | `src/pages/admin/*` |
| Szerepkör és dolgozói jogosultság | Done | Admin, dolgozó és vásárló szerepkörök, finomhangolt dolgozói jogokkal. | `src/app/services/auth.service.ts`, `firestore.rules` |
| Értesítések és jóváhagyás | Done | Hosszabb fizetési határidők kezelése admin oldalon. | `src/pages/admin/*` |
| Online fizetési szolgáltató | Planned | Jelenleg nincs teljes éles integráció. | Tudatosan scope-on kívül hagyva |
| Mélyebb analitika és monitoring | Partial | Van alap hibakezelés és admin összesítés, de nincs teljes dashboard. | részben dokumentált |

## Megjegyzés a státuszokról

A táblázatban tudatosan jelöltem külön a `Done`, `Partial` és `Planned` állapotokat. A cél nem az volt, hogy minden elképzelést késznek mutassak, hanem hogy a projekt jelenlegi állapota őszintén visszakövethető legyen.
