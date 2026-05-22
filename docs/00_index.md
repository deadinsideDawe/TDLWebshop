# Dokumentációs index

Ez a dokumentációs csomag a TDL Webshop szakdolgozati projekt legfontosabb termék-, architektúra-, minőségbiztosítási, biztonsági és AI-asszisztált fejlesztési anyagait fogja össze. A cél az, hogy a projekt működő alkalmazásként és visszakövethetően dokumentált mérnöki munkaként is értelmezhető legyen.

## Konzulensi elvárásokhoz kötött fő dokumentumok

| Konzulensi terület | Repó dokumentum | Állapot |
|---|---|---|
| Probléma, cél, MVP-határ | [01_product/mvp_brief.md](01_product/mvp_brief.md), [01_product/scope_contract.md](01_product/scope_contract.md) | kidolgozva, saját stílusra még áthúzandó |
| Piaci / területi összehasonlítás | [01_product/piaci_elemzes.md](01_product/piaci_elemzes.md) | kidolgozva |
| Követelmények és use case-ek | [01_product/kovetelmenyek_traceability.md](01_product/kovetelmenyek_traceability.md), [01_product/use_cases.md](01_product/use_cases.md) | kidolgozva |
| GUI/UX és reszponzív működés | [ux/ux_screen_spec.md](ux/ux_screen_spec.md), [ux/screens.csv](ux/screens.csv) | kidolgozva, képernyőképekkel kiegészítendő |
| Architektúra és adatmodell | [02_architecture/c4_context_container.md](02_architecture/c4_context_container.md), [02_architecture/modules_interfaces.md](02_architecture/modules_interfaces.md), [adatmodell-osszefoglalo.md](adatmodell-osszefoglalo.md) | kidolgozva |
| Biztonság és titokkezelés | [05_security_ops/security_minimum.md](05_security_ops/security_minimum.md), [05_security_ops/threat_model.md](05_security_ops/threat_model.md) | kidolgozva, commit előtt újra ellenőrizendő |
| Tesztelés és validáció | [teszteles-validacio-osszefoglalo.md](teszteles-validacio-osszefoglalo.md), [testing/regression-checklist.md](testing/regression-checklist.md) | kidolgozva, manuális tesztelés közben pipálandó |
| Reprodukálhatóság | [reprodukcios_README.md](reprodukcios_README.md), [../README.md](../README.md), [../.env.example](../.env.example) | kidolgozva |
| MI-használat dokumentálása | [07_ai/ai-usage-thesis-section.md](07_ai/ai-usage-thesis-section.md), [07_ai/ai_manifest.md](07_ai/ai_manifest.md) | kidolgozva, saját hangra áthúzandó |

## 01 Product

- [Vision](01_product/vision.md)
- [Scope Contract](01_product/scope_contract.md)
- [Capability Map](01_product/capability_map.md)
- [MVP brief](01_product/mvp_brief.md)
- [Piaci elemzés](01_product/piaci_elemzes.md)
- [Követelmények és traceability](01_product/kovetelmenyek_traceability.md)
- [Use case specifikáció](01_product/use_cases.md)

## 02 Architecture

- [C4 Context és Container nézet](02_architecture/c4_context_container.md)
- [Modulok és interfészek](02_architecture/modules_interfaces.md)
- [A szakdolgozatba illeszthető ábrák](02_architecture/thesis_diagrams.md)
- [ADR-001 Firebase backend](02_architecture/adr/0001-firebase-backend.md)
- [ADR-002 Angular standalone frontend](02_architecture/adr/0002-angular-standalone.md)
- [ADR-003 Role alapú jogosultságkezelés](02_architecture/adr/0003-role-based-access.md)
- [ADR-004 Helyszíni vásárlás és PDF számla](02_architecture/adr/0004-onsite-sales-and-pdf.md)
- [ADR-005 Spark-kompatibilis architektúra](02_architecture/adr/0005-spark-compatible-architecture.md)

## 04 Quality

- [Tesztelési szakdolgozati fejezet](testing-thesis-section.md)
- [Tesztelés és validáció összefoglaló](teszteles-validacio-osszefoglalo.md)
- [Teszt stratégia](04_quality/test_strategy.md)
- [Teszt riport](04_quality/test_report.md)
- [Regressziós ellenőrző lista](testing/regression-checklist.md)
- [M1 kézi tesztjegyzőkönyv](testing/manual-test-log.md)

## 05 Security és üzemeltetés

- [Threat model](05_security_ops/threat_model.md)
- [Biztonsági minimum](05_security_ops/security_minimum.md)
- [Privacy és licensing](05_security_ops/privacy_licensing.md)
- [Deploy runbook](05_security_ops/deploy_runbook.md)
- [Observability alapok](05_security_ops/observability.md)

## 06 Release

- [Készültségi scorecard](06_release/scorecard.md)
- [Konzulensi visszajelzés szerinti megfelelés](konzulensi-visszajelzes-megfeleles.md)
- [Zárási audit és heti teendők](00_zarasi_audit_es_teendok.md)
- [Leadandó checklist](leadando_checklist.md)
- [Végleges szakdolgozati Word-dokumentum](thesis/Toth_David_Laszlo_PTNRYG_szakdolgozata.docx)
- [Szakdolgozatban szereplő ábrák exportja](thesis/figures/README.md)

## 07 AI

- [AI manifest](07_ai/ai_manifest.md)
- [Prompt log](07_ai/prompt_log.md)
- [Verification log](07_ai/verification_log.md)
- [AI használat leírása a szakdolgozatban](07_ai/ai-usage-thesis-section.md)
- [OpenRouter AI asszisztens beüzemelés](ai-asszisztens-openrouter.md)

## Kiegészítő anyagok

- [Adatmodell összefoglaló](adatmodell-osszefoglalo.md)
- [Reprodukciós README](reprodukcios_README.md)
- [Funkcióösszefoglaló](thesis-feature-summary.md)
- [Demo script](demo-script.md)
- [Jogosultsági táblázat](role-system-table.md)
