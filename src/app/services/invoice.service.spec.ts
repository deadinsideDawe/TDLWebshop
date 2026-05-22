import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  it('builds a readable PDF document stream', () => {
    const service = new InvoiceService();
    const pdfBytes = (service as unknown as {
      buildInvoicePdf(data: {
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
      }): Uint8Array;
    }).buildInvoicePdf({
      issuerName: 'TDL Webshop',
      issuerAddress: '1111 Budapest, Minta utca 10.',
      issuerTaxNumber: '12345678-2-42',
      invoiceNumber: 'INV-2026-0001',
      issueDate: '2026. 04. 21.',
      orderId: 'order-1',
      salesChannel: 'Helyszini',
      buyerName: 'Teszt Vevő',
      buyerEmail: 'teszt@example.com',
      buyerPhone: '+361234567',
      buyerCompany: '-',
      buyerTaxNumber: '-',
      buyerAddress: '1111 Budapest, Teszt utca 1.',
      paymentLabel: 'Készpénz',
      shippingLabel: 'Személyes átvétel',
      items: [{ name: 'Radiátor szelep', quantity: 2, unitPrice: 1000, gross: 2000 }],
      netTotal: 1575,
      vatTotal: 425,
      grossTotal: 2000
    });

    const pdfText = new TextDecoder().decode(pdfBytes);
    expect(pdfText).toContain('%PDF-1.4');
    expect(pdfText).toContain('SZAMLA');
    expect(pdfText).toContain('INV-2026-0001');
    expect(pdfText).toContain('Radiator szelep');
    expect(pdfText).toContain('1 575 Ft');
    expect(pdfText).not.toContain('?');
  });
});
