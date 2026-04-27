import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatPrice = (amount) =>
  `Rs. ${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // ─── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 80, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 140, 0);
  doc.text('ClickMart', margin, 50);

  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Smart Shopping Destination', margin, 65);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', pageWidth - margin, 45, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`#${order.orderNumber}`, pageWidth - margin, 62, { align: 'right' });
  doc.text(`Date: ${formatDate(order.createdAt)}`, pageWidth - margin, 75, { align: 'right' });

  // ─── INVOICE META ───────────────────────────────────────────────────────────
  let y = 105;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 140, 0);
  doc.text('Billed To:', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const name = order.shippingName || order.customerName || 'Customer';
  doc.text(name, margin, y + 14);
  if (order.customerEmail) doc.text(order.customerEmail, margin, y + 26);
  const addr1 = [order.shippingAddr1, order.shippingAddr2].filter(Boolean).join(', ');
  if (addr1) doc.text(addr1, margin, y + 38);
  const addr2 = [order.shippingCity, order.shippingState, order.shippingPin].filter(Boolean).join(', ');
  if (addr2) doc.text(addr2, margin, y + 50);
  if (order.shippingPhone) doc.text(`Phone: ${order.shippingPhone}`, margin, y + 62);

  // Order info (right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 140, 0);
  doc.text('Order Details:', pageWidth - margin - 140, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Order No: ${order.orderNumber}`, pageWidth - margin - 140, y + 14);
  doc.text(`Status: ${order.status}`, pageWidth - margin - 140, y + 26);
  doc.text(`Payment: ${order.paymentMethod}`, pageWidth - margin - 140, y + 38);
  doc.text(`Date: ${formatDate(order.createdAt)}`, pageWidth - margin - 140, y + 50);

  // ─── DIVIDER ────────────────────────────────────────────────────────────────
  y += 85;
  doc.setDrawColor(255, 140, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // ─── ITEMS TABLE ────────────────────────────────────────────────────────────
  const tableBody = (order.items || []).map((item, i) => [
    i + 1,
    item.productName || 'Product',
    item.quantity,
    formatPrice(item.unitPrice || item.price),
    formatPrice((item.unitPrice || item.price) * item.quantity),
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 10,
      cellPadding: 8,
      textColor: [50, 50, 50],
    },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 140, 0],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
    },
  });

  // ─── TOTALS ─────────────────────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 20;
  const totalsX = pageWidth - margin - 200;

  const drawRow = (label, value, yPos, bold = false, highlight = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(highlight ? 12 : 10);
    doc.setTextColor(highlight ? 255 : 80, highlight ? 140 : 80, highlight ? 0 : 80);
    doc.text(label, totalsX, yPos);
    doc.setTextColor(highlight ? 255 : 50, highlight ? 140 : 50, highlight ? 0 : 50);
    doc.text(value, pageWidth - margin, yPos, { align: 'right' });
  };

  drawRow('Subtotal:', formatPrice(order.subtotal), finalY);
  drawRow('Delivery:', formatPrice(order.deliveryCharge), finalY + 18);
  if (order.discount > 0) {
    doc.setTextColor(40, 167, 69);
    doc.text(`Discount:`, totalsX, finalY + 36);
    doc.text(`-${formatPrice(order.discount)}`, pageWidth - margin, finalY + 36, { align: 'right' });
  }
  const totalRowY = order.discount > 0 ? finalY + 60 : finalY + 42;

  // Total box
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(totalsX - 10, totalRowY - 14, pageWidth - margin - totalsX + 20, 30, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('Total:', totalsX, totalRowY + 5);
  doc.setTextColor(255, 140, 0);
  doc.text(formatPrice(order.total), pageWidth - margin, totalRowY + 5, { align: 'right' });

  // ─── FOOTER ─────────────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setFillColor(30, 30, 30);
  doc.rect(0, footerY - 10, pageWidth, 50, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for shopping with ClickMart!', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 18, { align: 'center' });

  // ─── SAVE ───────────────────────────────────────────────────────────────────
  doc.save(`ClickMart_Invoice_${order.orderNumber}.pdf`);
};
