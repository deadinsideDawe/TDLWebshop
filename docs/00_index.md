# Dokumentacios index

Ez a dokumentacios csomag a TDL Webshop szakdolgozati projekt legfontosabb termek-, architektura-, minosegbiztositasi, biztonsagi es AI-asszisztalt fejlesztesi anyagait fogja ossze. A cel az, hogy a projekt ne csak mukodo alkalmazaskent, hanem visszakovethetoen dokumentalt mernoki munkakent is ertelmezheto legyen.

## Konzulensi elvarasokhoz kotott fo dokumentumok

| Konzulensi terulet | Repo dokumentum | Allapot |
|---|---|---|
| Problema, cel, MVP-hatar | [01_product/mvp_brief.md](01_product/mvp_brief.md), [01_product/scope_contract.md](01_product/scope_contract.md) | kidolgozva, sajat stilusra meg athuzando |
| Piaci / teruleti osszehasonlitas | [01_product/piaci_elemzes.md](01_product/piaci_elemzes.md) | kidolgozva |
| Kovetelmenyek es use case-ek | [01_product/kovetelmenyek_traceability.md](01_product/kovetelmenyek_traceability.md), [01_product/use_cases.md](01_product/use_cases.md) | kidolgozva |
| GUI/UX es reszponziv mukodes | [ux/ux_screen_spec.md](ux/ux_screen_spec.md), [ux/screens.csv](ux/screens.csv) | kidolgozva, kepernyokepekkel kiegeszitendo |
| Architektura es adatmodell | [02_architecture/c4_context_container.md](02_architecture/c4_context_container.md), [02_architecture/modules_interfaces.md](02_architecture/modules_interfaces.md), [adatmodell-osszefoglalo.md](adatmodell-osszefoglalo.md) | kidolgozva |
| Biztonsag es titokkezeles | [05_security_ops/security_minimum.md](05_security_ops/security_minimum.md), [05_security_ops/threat_model.md](05_security_ops/threat_model.md) | kidolgozva, commit elott ujra ellenorizendo |
| Teszteles es validacio | [teszteles-validacio-osszefoglalo.md](teszteles-validacio-osszefoglalo.md), [testing/regression-checklist.md](testing/regression-checklist.md) | kidolgozva, manualis teszteles kozben pipalando |
| Reprodukalhatosag | [reprodukcios_README.md](reprodukcios_README.md), [../README.md](../README.md), [../.env.example](../.env.example) | kidolgozva |
| MI-hasznalat dokumentalasa | [07_ai/ai-usage-thesis-section.md](07_ai/ai-usage-thesis-section.md), [07_ai/ai_manifest.md](07_ai/ai_manifest.md) | kidolgozva, sajat hangra athuzando |

## 01 Product

- [Vision](01_product/vision.md)
- [Scope Contract](01_product/scope_contract.md)
- [Capability Map](01_product/capability_map.md)
- [MVP brief](01_product/mvp_brief.md)
- [Piaci elemzes](01_product/piaci_elemzes.md)
- [Kovetelmenyek es traceability](01_product/kovetelmenyek_traceability.md)
- [Use case specifikacio](01_product/use_cases.md)

## 02 Architecture

- [C4 Context es Container nezet](02_architecture/c4_context_container.md)
- [Modulok es interfeszek](02_architecture/modules_interfaces.md)
- [A szakdolgozatba illesztheto abrak](02_architecture/thesis_diagrams.md)
- [ADR-001 Firebase backend](02_architecture/adr/0001-firebase-backend.md)
- [ADR-002 Angular standalone frontend](02_architecture/adr/0002-angular-standalone.md)
- [ADR-003 Role alapu jogosultsagkezeles](02_architecture/adr/0003-role-based-access.md)
- [ADR-004 Helyszini vasarlas es PDF szamla](02_architecture/adr/0004-onsite-sales-and-pdf.md)
- [ADR-005 Spark-kompatibilis architektura](02_architecture/adr/0005-spark-compatible-architecture.md)

## 04 Quality

- [Tesztelesi szakdolgozati fejezet](testing-thesis-section.md)
- [Teszteles es validacio osszefoglalo](teszteles-validacio-osszefoglalo.md)
- [Teszt strategia](04_quality/test_strategy.md)
- [Teszt riport](04_quality/test_report.md)
- [Regresszios ellenorzo lista](testing/regression-checklist.md)
- [Manualis oldalteszt checklist](manual-site-test-checklist.md)
- [Beadas elotti teszt checklist](beadas-elotti-teszt-checklist.md)

## 05 Security es uzemeltetes

- [Threat model](05_security_ops/threat_model.md)
- [Biztonsagi minimum](05_security_ops/security_minimum.md)
- [Privacy es licensing](05_security_ops/privacy_licensing.md)
- [Deploy runbook](05_security_ops/deploy_runbook.md)
- [Observability alapok](05_security_ops/observability.md)

## 06 Release

- [Keszultsegi scorecard](06_release/scorecard.md)
- [Konzulensi visszajelzes szerinti megfeleles](konzulensi-visszajelzes-megfeleles.md)
- [Zarasi audit es heti teendok](00_zarasi_audit_es_teendok.md)
- [Leadando checklist](leadando_checklist.md)
- [Vegleges szakdolgozati Word-dokumentum](thesis/TothDavidLaszlo_PTNRYG_szakdolgozat_vegleges.docx)

## 07 AI

- [AI manifest](07_ai/ai_manifest.md)
- [Prompt log](07_ai/prompt_log.md)
- [Verification log](07_ai/verification_log.md)
- [AI hasznalat leirasa a szakdolgozatban](07_ai/ai-usage-thesis-section.md)
- [OpenRouter AI asszisztens beuzemeles](ai-asszisztens-openrouter.md)

## Kiegeszito anyagok

- [Adatmodell osszefoglalo](adatmodell-osszefoglalo.md)
- [Reprodukcios README](reprodukcios_README.md)
- [Funkcioosszefoglalo](thesis-feature-summary.md)
- [Demo script](demo-script.md)
- [Jogosultsagi tablazat](role-system-table.md)
