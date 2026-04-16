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
    const buyerAddress = `${order.shipping?.zip || '-'}, ${order.shipping?.city || '-'}, ${order.shipping?.address || '-'}`;
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
      salesChannel: order.salesChannel === 'local-admin' ? 'Helyszíni' : 'Webes',
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
    // Egyszeru, de testreszabhato PDF generator kulso library nelkul.
    const c: string[] = [];

    c.push('q 0.96 0.97 0.99 rg 36 760 523 64 re f Q');
    c.push('q 0.74 0.80 0.90 RG 1 w 36 760 523 64 re S Q');
    c.push(this.drawText(50, 806, 'F2', 20, 'SZÁMLA'));
    c.push(this.drawText(50, 786, 'F1', 11, `Számlaszám: ${data.invoiceNumber}`));
    c.push(this.drawText(270, 786, 'F1', 11, `Kiállítás: ${data.issueDate}`));
    c.push(this.drawText(50, 770, 'F1', 11, `Rendelés azonosító: ${data.orderId}`));
    c.push(this.drawText(320, 770, 'F1', 11, `Csatorna: ${data.salesChannel}`));

    c.push('q 0.92 0.94 0.97 rg 36 620 255 126 re f Q');
    c.push('q 0.92 0.94 0.97 rg 304 620 255 126 re f Q');
    c.push('q 0.78 0.82 0.90 RG 1 w 36 620 255 126 re S 304 620 255 126 re S Q');

    c.push(this.drawText(48, 730, 'F2', 12, 'Kiállító'));
    c.push(this.drawText(48, 712, 'F1', 11, `Név: ${data.issuerName}`));
    c.push(this.drawText(48, 696, 'F1', 10, `Cím: ${data.issuerAddress}`));
    c.push(this.drawText(48, 680, 'F1', 10, `Adószám: ${data.issuerTaxNumber}`));

    c.push(this.drawText(316, 730, 'F2', 12, 'Vevő'));
    c.push(this.drawText(316, 712, 'F1', 11, `Név: ${data.buyerName}`));
    c.push(this.drawText(316, 696, 'F1', 10, `Cím: ${data.buyerAddress}`));
    c.push(this.drawText(316, 680, 'F1', 10, `Email: ${data.buyerEmail}`));
    c.push(this.drawText(316, 664, 'F1', 10, `Telefon: ${data.buyerPhone}`));
    c.push(this.drawText(316, 648, 'F1', 10, `Cég: ${data.buyerCompany}`));
    c.push(this.drawText(316, 632, 'F1', 10, `Vevő adószám: ${data.buyerTaxNumber}`));

    c.push(this.drawText(48, 600, 'F1', 10, `Fizetés módja: ${data.paymentLabel}`));
    c.push(this.drawText(290, 600, 'F1', 10, `Szállítás módja: ${data.shippingLabel}`));

    c.push('q 0.18 0.24 0.38 rg 36 566 523 24 re f Q');
    c.push(this.drawText(48, 573, 'F2', 10, 'Megnevezés'));
    c.push(this.drawText(320, 573, 'F2', 10, 'Menny.'));
    c.push(this.drawText(382, 573, 'F2', 10, 'Egységár'));
    c.push(this.drawText(460, 573, 'F2', 10, 'Bruttó'));

    let y = 552;
    for (const item of data.items.slice(0, 18)) {
      c.push('q 0.92 0.94 0.97 rg 36 ' + (y - 6) + ' 523 20 re f Q');
      c.push(this.drawText(48, y, 'F1', 10, this.truncate(item.name, 38)));
      c.push(this.drawText(326, y, 'F1', 10, `${item.quantity} db`));
      c.push(this.drawText(380, y, 'F1', 10, `${this.formatFt(item.unitPrice)} Ft`));
      c.push(this.drawText(458, y, 'F1', 10, `${this.formatFt(item.gross)} Ft`));
      y -= 22;
    }

    const summaryY = Math.max(120, y - 24);
    c.push('q 0.95 0.96 0.99 rg 300 ' + summaryY + ' 259 90 re f Q');
    c.push('q 0.78 0.82 0.90 RG 1 w 300 ' + summaryY + ' 259 90 re S Q');
    c.push(this.drawText(314, summaryY + 64, 'F1', 11, `Nettó: ${this.formatFt(data.netTotal)} Ft`));
    c.push(this.drawText(314, summaryY + 46, 'F1', 11, `Áfa (27%): ${this.formatFt(data.vatTotal)} Ft`));
    c.push(this.drawText(314, summaryY + 24, 'F2', 13, `Fizetendő végösszeg: ${this.formatFt(data.grossTotal)} Ft`));

    c.push(this.drawText(36, 60, 'F1', 9, 'Köszönjük a vásárlást! Ez a dokumentum webshop bizonylat.'));
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

  private drawText(x: number, y: number, font: 'F1' | 'F2', size: number, text: string): string {
    // PDF text parancs generalasa.
    const normalized = this.escapePdfText(this.stripDiacritics(text));
    return `BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${normalized}) Tj ET`;
  }

  private truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
  }

  private formatFt(value: number): string {
    return new Intl.NumberFormat('hu-HU').format(Math.round(value));
  }

  private escapePdfText(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  private stripDiacritics(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
