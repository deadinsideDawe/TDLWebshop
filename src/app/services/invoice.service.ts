import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  downloadInvoicePdf(order: Order & { id: string }): void {
    // Rendeles adat -> PDF byte tomb -> bongeszos letoltes.
    const issuer = environment.invoiceIssuer;
    const invoiceNumber = order.invoiceNumber || `INV-${order.id}`;
    const issueDate = order.invoicedAt || Date.now();
    const paymentLabel = order.paymentMethod?.label || '-';
    const shippingLabel = order.shippingMethod?.label || '-';
    const buyerAddress = order.salesChannel === 'local-admin'
      ? `${order.shipping?.city || 'Helyszini vasarlas'}, ${order.shipping?.address || 'Ugyfelszolgalati pult'}`
      : `${order.shipping?.zip || '-'}, ${order.shipping?.city || '-'}, ${order.shipping?.address || '-'}`;
    const buyerCompany = order.business?.isBusinessBuyer
      ? (order.business.companyName || order.customerName)
      : '-';
    const buyerTaxNumber = order.business?.isBusinessBuyer ? (order.business.taxNumber || '-') : '-';
    const netTotal = Math.round(order.total / 1.27);
    const vatTotal = Math.max(0, order.total - netTotal);
    const pdfBytes = this.buildInvoicePdf({
      issuerName: issuer.name,
      issuerAddress: issuer.address,
      issuerTaxNumber: issuer.taxNumber,
      invoiceNumber,
      issueDate: new Date(issueDate).toLocaleDateString('hu-HU'),
      orderId: order.id,
      salesChannel: order.salesChannel === 'local-admin' ? 'Helyszini' : 'Webes',
      buyerName: order.customerName,
      buyerEmail: order.customerEmail,
      buyerPhone: order.customerPhone,
      buyerCompany,
      buyerTaxNumber,
      buyerAddress,
      paymentLabel,
      shippingLabel,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        gross: item.price * item.quantity
      })),
      netTotal,
      vatTotal,
      grossTotal: order.total
    });
    const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date(issueDate).toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.download = `szamla-${invoiceNumber}-${stamp}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private buildInvoicePdf(data: {
    issuerName: string;
    issuerAddress: string;
    issuerTaxNumber: string;
    invoiceNumber: string;
    issueDate: string;
    orderId: string;
    salesChannel: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerCompany: string;
    buyerTaxNumber: string;
    buyerAddress: string;
    paymentLabel: string;
    shippingLabel: string;
    items: Array<{ name: string; quantity: number; unitPrice: number; gross: number }>;
    netTotal: number;
    vatTotal: number;
    grossTotal: number;
  }): Uint8Array {
    // Egyszeru, kliensoldali PDF generator rendelési bizonylathoz.
    // Eles szamlazashoz NAV-kompatibilis szamlazo vagy szerveroldali integracio kell.
    const c: string[] = [];

    c.push('q 0.03 0.05 0.10 rg 36 760 523 66 re f Q');
    c.push('q 0.12 0.48 0.86 RG 1.4 w 36 760 523 66 re S Q');
    c.push('q 0.92 0.10 0.12 RG 1.3 w 392 768 146 0 m 538 768 l S Q');
    c.push('q 0.80 0.85 0.92 rg 55 788 32 14 re f Q');
    c.push('q 0.05 0.45 0.82 rg 96 787 4 18 re f Q');
    c.push(this.drawText(108, 797, 'F2', 22, 'TDL', '0.05 0.50 0.90 rg'));
    c.push(this.drawText(168, 797, 'F2', 18, 'Webshop', '0.88 0.91 0.95 rg'));
    c.push(this.drawText(438, 806, 'F2', 22, 'SZAMLA', '1 1 1 rg'));
    c.push(this.drawText(438, 787, 'F1', 10, `Szamlaszam: ${data.invoiceNumber}`, '0.86 0.91 0.98 rg'));
    c.push(this.drawText(438, 772, 'F1', 10, `Kiallitas: ${data.issueDate}`, '0.86 0.91 0.98 rg'));

    c.push(this.drawText(50, 740, 'F1', 11, `Rendeles azonosito: ${this.truncate(data.orderId, 30)}`));
    c.push(this.drawText(340, 740, 'F1', 11, `Csatorna: ${data.salesChannel}`));

    c.push('q 0.92 0.94 0.97 rg 36 622 255 96 re f Q');
    c.push('q 0.92 0.94 0.97 rg 304 622 255 96 re f Q');
    c.push('q 0.78 0.82 0.90 RG 1 w 36 622 255 96 re S 304 622 255 96 re S Q');

    c.push(this.drawText(48, 700, 'F2', 12, 'Kiallito'));
    c.push(this.drawText(48, 682, 'F1', 11, `Nev: ${data.issuerName}`));
    c.push(this.drawText(48, 666, 'F1', 10, `Cim: ${this.truncate(data.issuerAddress, 37)}`));
    c.push(this.drawText(48, 650, 'F1', 10, `Adoszam: ${data.issuerTaxNumber}`));

    c.push(this.drawText(316, 700, 'F2', 12, 'Vevo'));
    c.push(this.drawText(316, 682, 'F1', 11, `Nev: ${this.truncate(data.buyerName, 32)}`));
    c.push(this.drawText(316, 666, 'F1', 10, `Cim: ${this.truncate(data.buyerAddress, 40)}`));
    c.push(this.drawText(316, 650, 'F1', 10, `Email: ${this.truncate(data.buyerEmail, 34)}`));
    c.push(this.drawText(316, 634, 'F1', 10, `Telefon: ${this.truncate(data.buyerPhone, 28)}`));

    c.push(this.drawText(48, 598, 'F1', 10, `Fizetes modja: ${this.truncate(data.paymentLabel, 38)}`));
    c.push(this.drawText(304, 598, 'F1', 10, `Szallitas modja: ${this.truncate(data.shippingLabel, 34)}`));
    c.push(this.drawText(48, 580, 'F1', 10, `Ceg: ${this.truncate(data.buyerCompany, 40)}`));
    c.push(this.drawText(304, 580, 'F1', 10, `Vevo adoszam: ${data.buyerTaxNumber}`));

    c.push('q 0.95 0.96 0.99 rg 322 506 237 66 re f Q');
    c.push('q 0.78 0.82 0.90 RG 1 w 322 506 237 66 re S Q');
    c.push(this.drawText(340, 552, 'F1', 11, `Netto: ${this.formatFt(data.netTotal)} Ft`));
    c.push(this.drawText(340, 535, 'F1', 11, `Afa (27%): ${this.formatFt(data.vatTotal)} Ft`));
    c.push(this.drawText(340, 516, 'F2', 12, `Fizetendo vegosszeg: ${this.formatFt(data.grossTotal)} Ft`));

    c.push('q 0.18 0.24 0.38 rg 36 458 523 24 re f Q');
    c.push(this.drawText(48, 465, 'F2', 10, 'Megnevezes', '1 1 1 rg'));
    c.push(this.drawText(318, 465, 'F2', 10, 'Menny.', '1 1 1 rg'));
    c.push(this.drawText(382, 465, 'F2', 10, 'Egysegar', '1 1 1 rg'));
    c.push(this.drawText(462, 465, 'F2', 10, 'Brutto', '1 1 1 rg'));

    let y = 438;
    const visibleItems = data.items.slice(0, 12);
    // A jelenlegi szakdolgozati PDF egyoldalas; hosszú rendelésnél jelzést teszünk,
    // hogy ne tűnjön úgy, mintha a fennmaradó tételek elvesztek volna.
    for (const item of visibleItems) {
      const fill = visibleItems.indexOf(item) % 2 === 0 ? '0.92 0.94 0.97' : '0.97 0.98 0.99';
      c.push(`q ${fill} rg 36 ${y - 7} 523 22 re f Q`);
      c.push(this.drawText(48, y, 'F1', 10, this.truncate(item.name, 38)));
      c.push(this.drawText(326, y, 'F1', 10, `${item.quantity} db`));
      c.push(this.drawText(380, y, 'F1', 10, `${this.formatFt(item.unitPrice)} Ft`));
      c.push(this.drawText(458, y, 'F1', 10, `${this.formatFt(item.gross)} Ft`));
      y -= 24;
    }

    if (data.items.length > visibleItems.length) {
      c.push(this.drawText(48, y, 'F1', 9, `Tovabbi ${data.items.length - visibleItems.length} tetel a rendelesben.`));
      y -= 18;
    }

    c.push('q 0.74 0.80 0.90 RG 0.8 w 36 118 523 0 m 559 118 l S Q');
    c.push(this.drawText(36, 96, 'F2', 10, 'Megjegyzes'));
    c.push(this.drawText(36, 80, 'F1', 9, 'Koszonjuk a vasarlast! Ez a dokumentum webshop bizonylat.'));
    c.push(this.drawText(36, 48, 'F1', 8, 'A dokumentum szakdolgozati/demo rendszerben generalt bizonylat.'));
    const stream = `${c.join('\n')}\n`;

    const objects: string[] = [];
    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objects[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>';
    objects[4] = `<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
    objects[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objects[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [];

    for (let i = 1; i <= 6; i += 1) {
      offsets[i] = pdf.length;
      pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const xrefStart = pdf.length;
    pdf += 'xref\n0 7\n0000000000 65535 f \n';

    for (let i = 1; i <= 6; i += 1) {
      const offset = String(offsets[i]).padStart(10, '0');
      pdf += `${offset} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  }

  private drawText(x: number, y: number, font: 'F1' | 'F2', size: number, text: string, color = '0 0 0 rg'): string {
    // PDF text parancs generalasa.
    const normalized = this.escapePdfText(this.stripDiacritics(text));
    return `BT ${color} /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${normalized}) Tj ET`;
  }

  private truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
  }

  private formatFt(value: number): string {
    return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private escapePdfText(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  private stripDiacritics(text: string): string {
    // A beépített Helvetica font nem kezeli megbízhatóan a magyar ékezeteket nyers PDF-ben.
    return text
      .replace(/[\u00a0\u202f]/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, ' ');
  }
}

