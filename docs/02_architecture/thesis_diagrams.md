# Szakdolgozati abrak Mermaid formaban

Ezek az abrak a konzulensi mintacsomag abra-javaslataihoz igazodnak. A dolgozatba kepkent is beilleszthetok, vagy Mermaid-kent forrasban tarthatok.

## Use case attekintes

```mermaid
flowchart LR
  Vendeg["Vendeg / vasarlo"] --> Bongeszes["Termek bongeszese"]
  Vendeg --> Kosar["Kosar osszeallitasa"]
  Vendeg --> Checkout["Rendeles leadasa"]
  Vasarlo["Regisztralt vasarlo"] --> Profil["Profil es rendeleskovetes"]
  Admin["Admin"] --> TermekAdmin["Termek es keszlet kezelese"]
  Admin --> UserAdmin["Felhasznalok es jogosultsagok kezelese"]
  Admin --> Kupon["Kupon es akcio kezelese"]
  Dolgozo["Dolgozo"] --> Helyszini["Helyszini vasarlas rogzitese"]
  Vasarlo --> AI["AI asszisztens hasznalata"]
```

## Komponens architektura

```mermaid
flowchart TB
  Browser["Bongeszo / Angular app"] --> Pages["Oldalak: Home, Products, Checkout, Profile, Admin"]
  Pages --> Services["Angular service reteg"]
  Services --> Auth["Firebase Auth"]
  Services --> Firestore["Cloud Firestore"]
  Services --> Hosting["Firebase Hosting"]
  Services --> AiFunction["Opcion AI Cloud Function"]
  AiFunction --> OpenRouter["OpenRouter API"]
  Firestore --> Rules["Firestore security rules"]
```

## Adatmodell roviditett nezete

```mermaid
erDiagram
  USER_PROFILE ||--o{ ORDER : places
  ORDER ||--o{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : referenced_by
  CUSTOMER_PROFILE ||--o{ ORDER : selected_for
  COUPON ||--o{ ORDER : applied_to
  NEWSLETTER_SUBSCRIBER }o--|| USER_PROFILE : optional_owner

  USER_PROFILE {
    string uid
    string email
    string role
    boolean disabled
    string accountType
  }

  PRODUCT {
    string id
    string sku
    string name
    string category
    number price
    number stock
  }

  ORDER {
    string id
    string customerEmail
    string status
    number total
    string paymentMethod
    date createdAt
  }

  ORDER_ITEM {
    string productId
    string sku
    string name
    number quantity
    number unitPrice
  }
```

## Checkout szekvencia

```mermaid
sequenceDiagram
  actor User as Vasarlo
  participant UI as Checkout oldal
  participant Cart as CartService
  participant Order as OrderService
  participant DB as Firestore

  User->>UI: adatok kitoltese
  UI->>UI: email, telefon, kupon validacio
  UI->>Cart: kosar tetelek lekerese
  Cart-->>UI: tetelek es osszeg
  UI->>Order: rendeles mentese
  Order->>DB: order dokumentum letrehozasa
  DB-->>Order: sikeres mentés
  Order-->>UI: rendelés azonosito
  UI-->>User: sikeroldal
```

## Helyszini vasarlas szekvencia

```mermaid
sequenceDiagram
  actor Staff as Admin/Dolgozo
  participant AdminUI as Admin oldal
  participant Customer as CustomerDirectoryService
  participant Product as ProductService
  participant Order as OrderService
  participant PDF as InvoiceService
  participant DB as Firestore

  Staff->>AdminUI: mentett vasarlo kivalasztasa
  AdminUI->>Customer: vasarlo adatok betoltese
  Customer-->>AdminUI: profiladatok
  Staff->>AdminUI: termekek es mennyisegek rogzitese
  AdminUI->>Product: keszlet ellenorzese
  Product-->>AdminUI: elerheto keszlet
  AdminUI->>Order: helyszini rendeles mentese
  Order->>DB: rendeles letrehozasa
  AdminUI->>PDF: bizonylat generalasa
  PDF-->>Staff: PDF letoltes
```
