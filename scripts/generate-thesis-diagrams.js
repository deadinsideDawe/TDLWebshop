const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', '02_architecture', 'diagram_kepek');
fs.mkdirSync(outDir, { recursive: true });

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(text, max = 24) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function svg(width, height, title, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M2,2 L10,6 L2,10 Z" fill="#2563eb"/>
    </marker>
    <linearGradient id="blueRed" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc"/>
  <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="18" fill="#ffffff" stroke="#dbeafe"/>
  <text x="46" y="64" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#0f172a">${esc(title)}</text>
  <line x1="46" y1="84" x2="${width - 46}" y2="84" stroke="url(#blueRed)" stroke-width="4"/>
  ${content}
</svg>`;
}

function box(x, y, w, h, title, subtitle = '', fill = '#ffffff', stroke = '#2563eb') {
  const lines = wrap(title, Math.max(12, Math.floor(w / 9)));
  const subLines = subtitle ? wrap(subtitle, Math.max(14, Math.floor(w / 8))) : [];
  const titleY = y + 28;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2" filter="url(#shadow)"/>
  ${lines.map((line, i) => `<text x="${x + 16}" y="${titleY + i * 20}" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="#0f172a">${esc(line)}</text>`).join('')}
  ${subLines.map((line, i) => `<text x="${x + 16}" y="${titleY + lines.length * 20 + 10 + i * 17}" font-family="Arial, sans-serif" font-size="14" fill="#475569">${esc(line)}</text>`).join('')}`;
}

function pill(x, y, w, h, text, fill = '#eff6ff', stroke = '#3b82f6') {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#0f172a">${esc(text)}</text>`;
}

function arrow(x1, y1, x2, y2, label = '') {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 8;
  return `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow)"/>
  ${label ? `<text x="${midX}" y="${midY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#1e3a8a">${esc(label)}</text>` : ''}`;
}

function sequence(title, participants, steps, file) {
  const width = 1500;
  const height = 190 + steps.length * 62;
  const startX = 90;
  const gap = (width - 180) / (participants.length - 1);
  let content = '';
  participants.forEach((p, i) => {
    const x = startX + i * gap;
    content += pill(x - 90, 110, 180, 44, p, '#eef2ff', '#2563eb');
    content += `<line x1="${x}" y1="154" x2="${x}" y2="${height - 60}" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8 8"/>`;
  });
  steps.forEach((s, i) => {
    const y = 210 + i * 62;
    const fromX = startX + s.from * gap;
    const toX = startX + s.to * gap;
    content += arrow(fromX, y, toX, y, s.label);
  });
  write(file, svg(width, height, title, content));
}

function write(name, content) {
  fs.writeFileSync(path.join(outDir, name), content, 'utf8');
}

write('01_use_case_attekintes.svg', svg(1500, 980, '1. Use case attekintes', `
  ${box(70, 140, 230, 90, 'Vendeg vasarlo', 'Regisztracio nelkul is bongeszhet es rendelhet', '#f8fafc', '#64748b')}
  ${box(70, 290, 230, 90, 'Regisztralt vasarlo', 'Profil, rendelestortenet es kivansaglista', '#eff6ff', '#2563eb')}
  ${box(70, 470, 230, 90, 'Dolgozo', 'Helyszini eladas, keszlet es termekfeltoltes', '#ecfeff', '#0891b2')}
  ${box(70, 650, 230, 90, 'Admin', 'Teljes adminisztracio es jogosultsagkezeles', '#fff1f2', '#dc2626')}

  ${box(430, 120, 260, 80, 'Termekek bongeszese')}
  ${box(430, 225, 260, 80, 'Kosar es checkout')}
  ${box(430, 330, 260, 80, 'AI asszisztens')}
  ${box(430, 455, 260, 80, 'Helyszini vasarlas')}
  ${box(430, 560, 260, 80, 'Keszlet megtekintese')}
  ${box(430, 665, 260, 80, 'Termekfeltoltes')}

  ${box(830, 130, 280, 80, 'Rendeleskezeles')}
  ${box(830, 250, 280, 80, 'Profil es statuszkovetes')}
  ${box(830, 370, 280, 80, 'Kuponok es akciok')}
  ${box(830, 490, 280, 80, 'Felhasznalok kezelese')}
  ${box(830, 610, 280, 80, 'Mentett vasarlok kezelese')}
  ${box(830, 730, 280, 80, 'PDF szamla/bizonylat')}

  ${arrow(300, 185, 430, 160)}
  ${arrow(300, 185, 430, 265)}
  ${arrow(300, 335, 430, 265)}
  ${arrow(300, 335, 430, 370)}
  ${arrow(300, 515, 430, 495)}
  ${arrow(300, 515, 430, 600)}
  ${arrow(300, 515, 430, 705)}
  ${arrow(300, 695, 830, 170)}
  ${arrow(300, 695, 830, 410)}
  ${arrow(300, 695, 830, 530)}
  ${arrow(690, 265, 830, 170)}
  ${arrow(690, 495, 830, 770)}
`));

write('02_komponens_architektura.svg', svg(1500, 940, '2. Komponens architektura', `
  ${box(80, 140, 230, 95, 'Felhasznaloi bongeszo', 'Vasarloi es admin felulet', '#f8fafc', '#64748b')}
  ${box(410, 120, 300, 135, 'Angular frontend', 'Komponensalapu SPA: kezdolap, termekek, checkout, profil, admin', '#eff6ff', '#2563eb')}
  ${box(810, 120, 300, 135, 'Angular service reteg', 'AuthService, ProductService, CartService, OrderService, InvoiceService, ChatbotLlmService', '#ecfeff', '#0891b2')}

  ${box(150, 360, 240, 110, 'Firebase Hosting', 'Publikus webalkalmazas kiszolgalasa', '#ffffff', '#2563eb')}
  ${box(470, 340, 240, 130, 'Firebase Auth', 'Bejelentkezes es szerepkorhöz kotott felhasznaloazonositas', '#ffffff', '#2563eb')}
  ${box(790, 340, 240, 130, 'Cloud Firestore', 'Termekek, rendelesek, profilok es admin adatok', '#ffffff', '#2563eb')}
  ${box(1110, 340, 240, 130, 'Firestore rules', 'Admin, dolgozo, vasarlo es tiltott user ellenorzes', '#fff1f2', '#dc2626')}

  ${box(470, 610, 250, 110, 'Kliensoldali PDF', 'Szamla es helyszini bizonylat letoltese', '#f8fafc', '#64748b')}
  ${box(790, 595, 250, 135, 'Cloudflare Worker proxy', 'OpenRouter kulcs szerveroldali vedelme', '#fff7ed', '#ea580c')}
  ${box(1110, 610, 250, 110, 'OpenRouter API', 'AI modell valaszadas katalogus kontextussal', '#fff7ed', '#ea580c')}

  ${arrow(310, 188, 410, 188)}
  ${arrow(710, 188, 810, 188)}
  ${arrow(560, 255, 270, 360)}
  ${arrow(960, 255, 590, 340)}
  ${arrow(960, 255, 910, 340)}
  ${arrow(1030, 405, 1110, 405)}
  ${arrow(960, 255, 595, 610)}
  ${arrow(960, 255, 915, 595)}
  ${arrow(1040, 662, 1110, 662)}
`));

write('03_adatmodell.svg', svg(1500, 1040, '3. Adatmodell', `
  ${box(595, 170, 310, 120, 'Order', 'Rendelesazonosito, userId, statusz, csatorna, fizetesi mod, vegosszeg', '#eff6ff', '#2563eb')}
  ${box(120, 140, 300, 120, 'UserProfile', 'uid, email, role, disabled, nev, telefon', '#ffffff', '#2563eb')}
  ${box(120, 340, 300, 120, 'SavedCustomer', 'mentett magan vagy ceges vasarlo, kedvezmeny, tiltott allapot', '#ffffff', '#2563eb')}
  ${box(595, 390, 310, 120, 'OrderItem', 'productId, sku, nev, mennyiseg, egysegar, osszeg', '#ffffff', '#2563eb')}
  ${box(1080, 340, 300, 130, 'Product', 'sku, nev, kategoria, ar, keszlet, aktiv, akcios, kiemelt', '#ffffff', '#2563eb')}
  ${box(1080, 135, 300, 115, 'Coupon', 'kod, tipus, ertek, ervenyesseg, aktiv allapot', '#ffffff', '#2563eb')}

  ${box(120, 590, 300, 115, 'WishlistItem', 'userId, productId, letrehozas ideje', '#f8fafc', '#64748b')}
  ${box(595, 600, 310, 115, 'OrderStatusAudit', 'elozo statusz, uj statusz, modosito, idopont', '#fff1f2', '#dc2626')}
  ${box(1080, 590, 300, 115, 'NewsletterSubscriber', 'email, feliratkozas ideje, aktiv allapot', '#f8fafc', '#64748b')}
  ${box(595, 805, 310, 115, 'InstallerPackage', 'szereloi csomag neve, leiras, aktiv allapot', '#ecfeff', '#0891b2')}
  ${box(1080, 805, 300, 115, 'InstallerPackageItem', 'productId es csomagbeli mennyiseg', '#ecfeff', '#0891b2')}

  ${arrow(420, 200, 595, 220, 'places')}
  ${arrow(420, 400, 595, 230, 'selected_for')}
  ${arrow(750, 290, 750, 390, 'contains')}
  ${arrow(905, 450, 1080, 405, 'referenced_by')}
  ${arrow(1080, 195, 905, 220, 'applied_to')}
  ${arrow(750, 290, 750, 600, 'has audit')}
  ${arrow(270, 260, 270, 590, 'saves')}
  ${arrow(420, 650, 1080, 405, 'saved product')}
  ${arrow(905, 862, 1080, 862, 'contains')}
  ${arrow(1230, 805, 1230, 470, 'package product')}
`));

sequence('4. Checkout folyamat', ['Vasarlo', 'Checkout oldal', 'CartService', 'OrderService', 'Firestore', 'Profil'], [
  { from: 0, to: 1, label: 'Adatok kitoltese' },
  { from: 1, to: 1, label: 'Email, telefon es kotelezo mezok validalasa' },
  { from: 1, to: 2, label: 'Kosar tartalmanak lekerese' },
  { from: 2, to: 1, label: 'Tetelek es vegosszeg' },
  { from: 1, to: 3, label: 'Rendeles letrehozasa' },
  { from: 3, to: 4, label: 'Order es OrderItem mentese' },
  { from: 4, to: 3, label: 'Sikeres mentés' },
  { from: 3, to: 1, label: 'Rendelesazonosito' },
  { from: 1, to: 2, label: 'Kosar uritese' },
  { from: 1, to: 5, label: 'Sikeres rendeles visszajelzese' },
], '04_checkout_folyamat.svg');

sequence('5. Admin statuszvaltas es keszletkezeles', ['Admin felulet', 'OrderService', 'Firestore tranzakcio', 'Orders', 'Products', 'Audit'], [
  { from: 0, to: 1, label: 'Statuszvaltas kerese' },
  { from: 1, to: 2, label: 'Tranzakcio inditasa' },
  { from: 2, to: 3, label: 'Rendeles olvasasa' },
  { from: 2, to: 4, label: 'Keszlet olvasasa' },
  { from: 2, to: 3, label: 'Uj statusz mentese' },
  { from: 2, to: 4, label: 'Keszlet korrekcio' },
  { from: 2, to: 5, label: 'Audit bejegyzes' },
  { from: 2, to: 1, label: 'Tranzakcio sikeres' },
  { from: 1, to: 0, label: 'Admin visszajelzes' },
], '05_admin_statusz_keszlet.svg');

sequence('6. Helyszini vasarlas rogzitese', ['Dolgozo/Admin', 'Admin felulet', 'Mentett vasarlok', 'Termekkatalogus', 'OrderService', 'PDF'], [
  { from: 0, to: 1, label: 'Helyszini vasarlas inditasa' },
  { from: 1, to: 2, label: 'Mentett vasarlo kivalasztasa' },
  { from: 2, to: 1, label: 'Adatok automatikus kitoltese' },
  { from: 1, to: 3, label: 'Termek keresese nev vagy SKU alapjan' },
  { from: 3, to: 1, label: 'Talalatok es keszlet' },
  { from: 0, to: 1, label: 'Tetelek es fizetesi mod megadasa' },
  { from: 1, to: 4, label: 'Rendeles mentese tranzakcioban' },
  { from: 4, to: 1, label: 'Sikeres mentes' },
  { from: 1, to: 5, label: 'Bizonylat generalasa' },
], '06_helyszini_vasarlas.svg');

sequence('7. AI asszisztens folyamata', ['Vasarlo', 'AI ablak', 'ChatbotLlmService', 'Katalogus', 'Worker proxy', 'OpenRouter'], [
  { from: 0, to: 1, label: 'Kerdes bekuldese' },
  { from: 1, to: 2, label: 'Kerdes feldolgozasa' },
  { from: 2, to: 2, label: 'Domain ellenorzes' },
  { from: 2, to: 3, label: 'Relevans termekek keresese' },
  { from: 3, to: 2, label: 'Katalogus talalatok' },
  { from: 2, to: 4, label: 'Kerdes + roviditett kontextus' },
  { from: 4, to: 5, label: 'Szerveroldali API hivas' },
  { from: 5, to: 4, label: 'Modell valasza' },
  { from: 4, to: 2, label: 'Szurt valasz' },
  { from: 2, to: 1, label: 'Szakmai valasz + ovatos ajanlas' },
  { from: 1, to: 0, label: 'Megjelenites' },
], '07_ai_asszisztens.svg');

write('08_biztonsagi_attekintes.svg', svg(1500, 920, '8. Biztonsagi attekintes', `
  ${box(90, 150, 250, 100, 'Felhasznalo', 'Vendeg, vasarlo, dolgozo vagy admin', '#f8fafc', '#64748b')}
  ${box(440, 130, 270, 130, 'Angular kliens', 'Validacio, feluleti jogosultsagi allapotok, API hivasi pontok', '#eff6ff', '#2563eb')}
  ${box(820, 130, 270, 130, 'Firebase Auth token', 'Azonositas es szerepkorhoz kotott uid', '#ffffff', '#2563eb')}
  ${box(1150, 130, 270, 130, 'Firestore rules', 'Admin, dolgozo, vasarlo es disabled ellenorzes', '#fff1f2', '#dc2626')}

  ${box(820, 390, 270, 120, 'Cloud Firestore', 'Vedett adatok: termekek, rendelesek, profilok, audit', '#ffffff', '#2563eb')}
  ${box(440, 390, 270, 120, 'Cloudflare Worker', 'OpenRouter hivas proxyzasa, kulcs nem kerul kliensre', '#fff7ed', '#ea580c')}
  ${box(90, 390, 250, 120, 'OpenRouter secret', 'OPENROUTER_API_KEY csak szerveroldalon', '#fff7ed', '#ea580c')}

  ${box(440, 650, 270, 110, 'GitHub repo', 'Forraskod, dokumentacio, .env.example valodi titok nelkul', '#f8fafc', '#64748b')}
  ${box(820, 650, 270, 110, 'GitHub Actions CI', 'Build es tesztek futtatasa beadashoz bizonyitekkent', '#ecfeff', '#0891b2')}
  ${box(1150, 650, 270, 110, 'Secret hygiene', 'Nincs commitolt jelszo, token, API kulcs vagy node_modules', '#ecfeff', '#0891b2')}

  ${arrow(340, 200, 440, 195)}
  ${arrow(710, 195, 820, 195)}
  ${arrow(1090, 195, 1150, 195)}
  ${arrow(1285, 260, 955, 390)}
  ${arrow(575, 260, 575, 390)}
  ${arrow(440, 450, 340, 450)}
  ${arrow(710, 705, 820, 705)}
  ${arrow(1090, 705, 1150, 705)}
`));

const readme = `# Diagram kepek

Ezek a fajlok kozvetlenul beilleszthetok Wordbe kepkent.

| Fajl | Tartalom | Javasolt abracim |
| --- | --- | --- |
| 01_use_case_attekintes.svg | Felhasznaloi szerepkorok es fo funkciok | A TDLWebshop fo felhasznaloi szerepkorei es funkcioi |
| 02_komponens_architektura.svg | Angular, Firebase, Firestore, Worker es OpenRouter kapcsolata | A TDLWebshop magas szintu komponens-architekturaja |
| 03_adatmodell.svg | Fo adatentitasok es kapcsolatok | A rendszer fo adatentitasai es kapcsolatai |
| 04_checkout_folyamat.svg | Vasarloi rendelesleadas szekvencia | A rendelesleadas folyamata |
| 05_admin_statusz_keszlet.svg | Admin statuszvaltas es keszletkorrekcio | Rendelestatusz valtas es keszletmodositas tranzakcioban |
| 06_helyszini_vasarlas.svg | Helyszini vasarlas mentett vasarloval | Helyszini vasarlas rogzitese mentett vasarloval |
| 07_ai_asszisztens.svg | AI asszisztens es OpenRouter proxy folyamat | A katalogushoz kotott AI asszisztens mukodesi folyamata |
| 08_biztonsagi_attekintes.svg | Auth, rules, secret hygiene es CI | Hitelesites, jogosultsagok es titokkezeles attekintese |
`;

write('README.md', readme);

console.log(`Generated diagrams in ${outDir}`);
