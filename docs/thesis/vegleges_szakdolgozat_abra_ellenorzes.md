# Végleges szakdolgozat ábra- és diagramellenőrzés

Ellenőrzött fájl:

- `docs/thesis/Toth_David_Laszlo_PTNRYG_szakdolgozata.docx`

Forrás:

- `C:\Users\Dell\OneDrive\Asztali gép\szakdoga\Toth_David_Laszlo_PTNRYG_szakdolgozata.docx`

## Eredmény

A végleges Word dokumentum bekerült a repóba a `docs/thesis/` mappába. A DOCX-ben 62 beágyazott kép található. A dolgozat fő szövegében és az M3 mellékletben látható diagramok, pageflow-k és képernyőképek külön exportként is bekerültek a `docs/thesis/figures/` mappába.

## Pontosan egyező képek

A mellékletben szereplő kódrészlet-képek közül 42 darab byte-szinten is egyezik a repóban található képekkel:

- `docs/code-snippet-images/M2_1_utvonalkezeles_es_lazy_loading.png`
- `docs/code-snippet-images/M2_2_admin_route_guard.png`
- `docs/code-snippet-images/M2_3_szerepkor_ellenorzes.png`
- `docs/code-snippet-images/M2_4a_firestore_admin_es_aktiv_user_helper.png`
- `docs/code-snippet-images/M2_4b_firestore_admin_jogosultsag_helper.png`
- `docs/code-snippet-images/M2_4c_firestore_termek_es_tartalom_szabalyok.png`
- `docs/code-snippet-images/M2_4d_firestore_rendeles_szabalyok.png`
- `docs/code-snippet-images/M2_5_rendeles_adatmodell.png`
- `docs/code-snippet-images/M2_6a_checkout_validacio_es_osszegszamitas.png`
- `docs/code-snippet-images/M2_6b_rendeles_objektum_osszeallitasa.png`
- `docs/code-snippet-images/M2_6c_rendeles_osszegzes_es_profilmentes.png`
- `docs/code-snippet-images/M2_7a_checkout_urlaphibak_gyujtese.png`
- `docs/code-snippet-images/M2_7b_email_validacio_helper.png`
- `docs/code-snippet-images/M2_7c_telefonszam_validacio_helper.png`
- `docs/code-snippet-images/M2_8a_rendelesstatusz_tranzakcio_inditasa.png`
- `docs/code-snippet-images/M2_8b_keszletkorrekcio_statuszvaltaskor.png`
- `docs/code-snippet-images/M2_8c_rendelesfrissites_es_audit_naplo.png`
- `docs/code-snippet-images/M2_9_admin_statuszvaltas_meghivasa.png`
- `docs/code-snippet-images/M2_10a_helyszini_vasarlas_osszeg_es_cimke.png`
- `docs/code-snippet-images/M2_10b_mentett_vasarlo_elozo_rendelesek.png`
- `docs/code-snippet-images/M2_10c_mentett_vasarlo_kivalasztas_es_kedvezmeny.png`
- `docs/code-snippet-images/M2_10d_helyszini_vasarlas_elovalidacio.png`
- `docs/code-snippet-images/M2_10e_helyszini_tetelek_es_osszegek.png`
- `docs/code-snippet-images/M2_10f_helyszini_rendeles_objektum.png`
- `docs/code-snippet-images/M2_10g_helyszini_szamla_es_pdf_inditas.png`
- `docs/code-snippet-images/M2_11_helyszini_vasarlas_tranzakcio.png`
- `docs/code-snippet-images/M2_12a_termek_torles_es_import_elokeszites.png`
- `docs/code-snippet-images/M2_12b_csv_termekek_normalizalasa.png`
- `docs/code-snippet-images/M2_12c_csv_insert_mod_termekmentes.png`
- `docs/code-snippet-images/M2_12d_csv_upsert_sku_alapu_frissites.png`
- `docs/code-snippet-images/M2_13a_szamlaszam_generalas_tranzakcioban.png`
- `docs/code-snippet-images/M2_13b_pdf_bizonylat_adatainak_elokeszitese.png`
- `docs/code-snippet-images/M2_13c_pdf_letoltes_bongeszoben.png`
- `docs/code-snippet-images/M2_14a_ai_kerdes_domain_szurese.png`
- `docs/code-snippet-images/M2_14b_ai_proxy_hivas_es_valaszfeldolgozas.png`
- `docs/code-snippet-images/M2_14c_ai_relevans_termekkatalogus.png`
- `docs/code-snippet-images/M2_14d_ai_katalogus_termek_dto.png`
- `docs/code-snippet-images/M2_15a_worker_cors_es_metodus_vedelem.png`
- `docs/code-snippet-images/M2_15b_worker_rate_limit_es_kulcsellenorzes.png`
- `docs/code-snippet-images/M2_15c_worker_uzenet_es_domain_validacio.png`
- `docs/code-snippet-images/M2_15d_openrouter_api_hivas.png`
- `docs/code-snippet-images/M2_15e_openrouter_valasz_parse.png`

## Diagramok és ábraforrások

A Wordben használt fő diagramokhoz a repóban elérhetők a források és a Wordből kinyert képváltozatok is:

- Use case diagram: `docs/02_architecture/diagram_kepek/01_use_case_attekintes.svg`
- Pageflow: `docs/ux/pageflow.png` és `docs/ux/pageflow.mmd`
- Komponens-architektúra: `docs/02_architecture/diagram_kepek/02_komponens_architektura.svg`
- További architektúradiagramok: `docs/02_architecture/diagram_kepek/`
- A dolgozatban látható exportált képváltozatok: `docs/thesis/figures/`

Megjegyzés: a Wordbe illesztett SVG/PNG ábrák nem minden esetben egyeznek byte-szinten a repóban tárolt forrásfájlokkal, mert a Word beillesztéskor átméretezheti vagy újratömörítheti őket. Emiatt a kódrészlet-képeknél a hash-egyezés bizonyító erejű, a diagramoknál pedig a repóban lévő SVG/Mermaid forrás a mérvadó.

## Következtetés

A mellékleti kódrészlet-képek egyeznek a repóban található aktuális képekkel. A pageflow és a fő diagramok forrásai megtalálhatók a repóban, a Wordben látható exportált képváltozatok pedig a `docs/thesis/figures/` mappában vannak, ezért a dolgozatban szereplő ábrák visszakereshetők és reprodukálhatók.
