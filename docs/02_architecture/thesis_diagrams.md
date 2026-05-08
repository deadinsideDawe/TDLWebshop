# TDLWebshop szakdolgozati diagramcsomag

Ez a fajl a szakdolgozatba beillesztheto, aktualis diagramokat tartalmazza Mermaid formatumban.
A diagramok GitHubon es sok Markdown editorban automatikusan megjelennek. Wordbe legegyszerubben
PNG/SVG kepkent erdemes beilleszteni oket, majd az alabbi abracimeket hasznalni.

## Kesz kepfajlok

A Wordbe kozvetlenul beszurhato SVG kepek itt vannak:

- [01_use_case_attekintes.svg](diagram_kepek/01_use_case_attekintes.svg)
- [02_komponens_architektura.svg](diagram_kepek/02_komponens_architektura.svg)
- [03_adatmodell.svg](diagram_kepek/03_adatmodell.svg)
- [04_checkout_folyamat.svg](diagram_kepek/04_checkout_folyamat.svg)
- [05_admin_statusz_keszlet.svg](diagram_kepek/05_admin_statusz_keszlet.svg)
- [06_helyszini_vasarlas.svg](diagram_kepek/06_helyszini_vasarlas.svg)
- [07_ai_asszisztens.svg](diagram_kepek/07_ai_asszisztens.svg)
- [08_biztonsagi_attekintes.svg](diagram_kepek/08_biztonsagi_attekintes.svg)

## Beillesztesi javaslat

| Abra | Hova keruljon a dolgozatban | Javasolt abracim |
| --- | --- | --- |
| 1. Use case attekintes | Kovetelmenyek / Funkcionalis specifikacio | A TDLWebshop fo felhasznaloi szerepkorei es funkcioi |
| 2. Komponens architektura | Tervezes / Architektura | A TDLWebshop magas szintu komponens-architekturaja |
| 3. Adatmodell | Tervezes / Adatmodell | A rendszer fo adatentitasai es kapcsolatai |
| 4. Checkout szekvencia | Megvalositas / Vasarloi folyamatok | A rendelesleadas folyamata |
| 5. Admin statuszvaltas es keszletkezeles | Megvalositas / Admin folyamatok | Rendelestatusz valtas es keszletmodositas tranzakcioban |
| 6. Helyszini vasarlas | Megvalositas / Admin vagy dolgozoi folyamatok | Helyszini vasarlas rogzitese mentett vasarloval |
| 7. AI asszisztens | Megvalositas / AI asszisztens | A katalogushoz kotott AI asszisztens mukodesi folyamata |
| 8. Biztonsagi attekintes | Biztonsag / Jogosultsagkezeles | Hitelesites, jogosultsagok es titokkezeles attekintese |

## 1. Use case attekintes

```mermaid
flowchart LR
  Guest["Vendeg vasarlo"]
  Customer["Regisztralt vasarlo"]
  Staff["Dolgozo"]
  Admin["Admin"]

  Guest --> Browse["Termekek bongeszese"]
  Guest --> Search["Kereses es kategoria szures"]
  Guest --> Cart["Kosar osszeallitasa"]
  Guest --> Checkout["Rendeles leadasa"]
  Guest --> AiAssistant["AI asszisztens hasznalata"]

  Customer --> Browse
  Customer --> Cart
  Customer --> Checkout
  Customer --> Wishlist["Kivansaglista kezelese"]
  Customer --> Profile["Profiladatok kezelese"]
  Customer --> OrderHistory["Rendeleselozmeny es statuszkovetes"]
  Customer --> AiAssistant

  Staff --> LocalSale["Helyszini vasarlas rogzitese"]
  Staff --> Inventory["Keszlet megtekintese"]
  Staff --> ProductUpload["Termekek feltoltese"]
  Staff --> SavedCustomers["Mentett vasarlok kezelese"]

  Admin --> ProductMgmt["Termekek, akciok es CSV import kezelese"]
  Admin --> OrderMgmt["Rendelesek es statuszok kezelese"]
  Admin --> UserMgmt["Felhasznalok es jogosultsagok kezelese"]
  Admin --> CouponMgmt["Kuponok kezelese"]
  Admin --> Reports["Ertesitesek es admin adatok"]
  Admin --> SavedCustomers
```

## 2. Komponens architektura

```mermaid
flowchart TB
  Browser["Felhasznaloi bongeszo"]
  Angular["Angular frontend"]
  Pages["Oldalak: kezdolap, termekek, checkout, profil, admin"]
  Services["Angular service reteg"]

  AuthService["AuthService"]
  ProductService["ProductService"]
  CartService["CartService"]
  OrderService["OrderService"]
  InvoiceService["InvoiceService"]
  ChatbotService["ChatbotLlmService"]

  FirebaseHosting["Firebase Hosting"]
  FirebaseAuth["Firebase Authentication"]
  Firestore["Cloud Firestore"]
  Rules["Firestore security rules"]
  Pdf["Kliensoldali PDF generalas"]
  Worker["Cloudflare Worker OpenRouter proxy"]
  OpenRouter["OpenRouter API"]

  Browser --> Angular
  Angular --> Pages
  Pages --> Services
  Angular --> FirebaseHosting

  Services --> AuthService
  Services --> ProductService
  Services --> CartService
  Services --> OrderService
  Services --> InvoiceService
  Services --> ChatbotService

  AuthService --> FirebaseAuth
  ProductService --> Firestore
  OrderService --> Firestore
  Firestore --> Rules
  InvoiceService --> Pdf
  ChatbotService --> Worker
  Worker --> OpenRouter
```

## 3. Adatmodell

```mermaid
erDiagram
  USER_PROFILE ||--o{ ORDER : places
  SAVED_CUSTOMER ||--o{ ORDER : selected_for
  ORDER ||--o{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : referenced_by
  COUPON ||--o{ ORDER : applied_to
  ORDER ||--o{ ORDER_STATUS_AUDIT : has
  USER_PROFILE ||--o{ WISHLIST_ITEM : saves
  PRODUCT ||--o{ WISHLIST_ITEM : saved_product
  USER_PROFILE ||--o{ NEWSLETTER_SUBSCRIBER : optional_owner
  INSTALLER_PACKAGE ||--o{ INSTALLER_PACKAGE_ITEM : contains
  PRODUCT ||--o{ INSTALLER_PACKAGE_ITEM : package_product

  USER_PROFILE {
    string uid
    string email
    string role
    boolean disabled
    string name
    string phone
  }

  PRODUCT {
    string id
    string sku
    string name
    string category
    number price
    number stock
    boolean active
    boolean featured
    boolean sale
  }

  ORDER {
    string id
    string userId
    string customerEmail
    string status
    string channel
    number total
    string paymentMethod
    timestamp createdAt
  }

  ORDER_ITEM {
    string productId
    string sku
    string name
    number quantity
    number unitPrice
    number lineTotal
  }

  SAVED_CUSTOMER {
    string id
    string name
    string email
    string phone
    boolean companyCustomer
    boolean disabled
    number totalSpent
  }

  COUPON {
    string code
    string type
    number value
    boolean active
    timestamp validUntil
  }

  ORDER_STATUS_AUDIT {
    string orderId
    string previousStatus
    string newStatus
    string actorUid
    timestamp createdAt
  }

  WISHLIST_ITEM {
    string userId
    string productId
    timestamp createdAt
  }

  NEWSLETTER_SUBSCRIBER {
    string email
    timestamp createdAt
    boolean active
  }

  INSTALLER_PACKAGE {
    string id
    string name
    string description
    boolean active
  }

  INSTALLER_PACKAGE_ITEM {
    string productId
    number quantity
  }
```

## 4. Checkout szekvencia

```mermaid
sequenceDiagram
  actor User as Vasarlo
  participant Checkout as Checkout oldal
  participant Cart as CartService
  participant Order as OrderService
  participant Firestore as Firestore
  participant Profile as Profil/Rendeles oldal

  User->>Checkout: Szallitasi es szamlazasi adatok kitoltese
  Checkout->>Checkout: Mezoszintu validacio
  Checkout->>Cart: Kosar tartalmanak lekerese
  Cart-->>Checkout: Termekek, mennyisegek, osszegzes
  Checkout->>Order: Rendeles letrehozasa
  Order->>Firestore: Rendeles es tetelek mentese
  Firestore-->>Order: Sikeres mentes
  Order-->>Checkout: Rendelesazonosito
  Checkout->>Cart: Kosar uritese
  Checkout->>Profile: Sikeres rendeles visszajelzese
```

## 5. Admin statuszvaltas es keszletkezeles

```mermaid
sequenceDiagram
  actor Admin as Admin vagy dolgozo
  participant AdminUI as Admin felulet
  participant OrderService as OrderService
  participant Tx as Firestore tranzakcio
  participant Products as Products collection
  participant Orders as Orders collection
  participant Audit as OrderStatusAudit collection

  Admin->>AdminUI: Rendelestatusz modositasa
  AdminUI->>OrderService: Statuszvaltas kerese
  OrderService->>Tx: Tranzakcio inditasa
  Tx->>Orders: Rendelés aktualis allapotanak olvasasa
  Tx->>Products: Erintett termekek keszletenek olvasasa
  Tx->>Orders: Uj statusz mentese
  Tx->>Products: Keszlet korrekcio
  Tx->>Audit: Audit bejegyzes letrehozasa
  Tx-->>OrderService: Tranzakcio sikeres
  OrderService-->>AdminUI: Visszajelzes
```

## 6. Helyszini vasarlas

```mermaid
sequenceDiagram
  actor Staff as Admin vagy dolgozo
  participant AdminUI as Admin rendelesi felulet
  participant Customers as Mentett vasarlok
  participant Products as Termekkatalogus
  participant OrderService as OrderService
  participant Firestore as Firestore
  participant Invoice as InvoiceService

  Staff->>AdminUI: Helyszini vasarlas rogzitese
  AdminUI->>Customers: Mentett vasarlo kivalasztasa
  Customers-->>AdminUI: Vasarlo adatai
  AdminUI->>Products: Termek kereses nev, SKU vagy kategoria alapjan
  Products-->>AdminUI: Valaszthato termekek
  Staff->>AdminUI: Tetelek es fizetesi mod megadasa
  AdminUI->>OrderService: Helyszini rendeles mentese
  OrderService->>Firestore: Rendeles es keszletvaltozas mentese tranzakcioban
  Firestore-->>OrderService: Sikeres mentés
  AdminUI->>Invoice: PDF bizonylat generalasa
  Invoice-->>Staff: Letoltheto PDF
```

## 7. AI asszisztens folyamata

```mermaid
sequenceDiagram
  actor User as Vasarlo
  participant Widget as AI asszisztens ablak
  participant Service as ChatbotLlmService
  participant Catalog as Termekkatalogus
  participant Worker as Cloudflare Worker proxy
  participant OpenRouter as OpenRouter modell

  User->>Widget: Kerdes megadasa
  Widget->>Service: Kerdes tovabbitasa
  Service->>Service: Domain ellenorzes
  Service->>Catalog: Relevans termekek keresese
  Catalog-->>Service: Katalogus talalatok
  alt Relevans epületgepeszeti kerdes
    Service->>Worker: Kerdes es roviditett katalogus kontextus
    Worker->>OpenRouter: Szerveroldali API hivas
    OpenRouter-->>Worker: Valasz
    Worker-->>Service: Szurt valasz
    Service-->>Widget: Szakmai valasz es katalogushoz kotott ajanlas
  else Nem relevans kerdes
    Service-->>Widget: Udvarias elutasitas es temakor ajanlas
  end
  Widget-->>User: Valasz megjelenitese
```

## 8. Biztonsagi attekintes

```mermaid
flowchart TB
  User["Felhasznalo"]
  Browser["Angular kliens"]
  Auth["Firebase Auth token"]
  Rules["Firestore security rules"]
  Firestore["Firestore adatok"]
  AdminRole["Admin/dolgozo/vasarlo szerepkor"]
  Disabled["Tiltott felhasznalo ellenorzes"]
  Worker["Cloudflare Worker"]
  Secret["OPENROUTER_API_KEY szerveroldali secret"]
  Repo["GitHub repo"]
  CI["GitHub Actions CI"]
  EnvExample[".env.example valodi titkok nelkul"]

  User --> Browser
  Browser --> Auth
  Auth --> Rules
  Rules --> AdminRole
  Rules --> Disabled
  Rules --> Firestore

  Browser --> Worker
  Worker --> Secret

  Repo --> CI
  Repo --> EnvExample
  CI --> Build["Build es tesztek"]
```

## Exportalas Wordhoz

1. Nyisd meg ezt a fajlt GitHubon vagy Markdown/Mermaid elonezetben.
2. Minden diagramot kulon exportalj vagy kepernyokepezz PNG/SVG formatumban.
3. Wordben a megfelelo fejezetbe illeszd be kepkent.
4. Az abracimeket a fenti tablazatbol hasznald, majd a sajat dolgozati stilusodhoz igazitsd.

Ha a dolgozatban pontosabb hivatkozast szeretnel, a fenti diagramokra lehet igy utalni:
"A rendszer fo szerepkoreit es funkcioit az X. abra mutatja be.", illetve
"Az adatmodell fo entitasait es kapcsolatait az Y. abra foglalja ossze."
