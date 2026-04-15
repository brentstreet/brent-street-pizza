import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../../config/api';
import { RefreshCw, FileText, Printer, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvoicesManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/login');
          return;
        }
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleSelection = (orderId: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedInvoices(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.size === orders.length && orders.length > 0) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(orders.map(o => o.id)));
    }
  };

  // Build professional invoice HTML for each selected order and print via iframe
  const handlePrint = () => {
    if (selectedInvoices.size === 0) {
      alert('Please select at least one invoice to print.');
      return;
    }

    const printOrders = orders.filter(o => selectedInvoices.has(o.id));

    const invoicesHtml = printOrders.map((order, idx) => {
      const customerName =
        order.customerName ||
        (order.user?.name?.toLowerCase() === 'guest'
          ? `Guest (#${order.id.slice(0, 5).toUpperCase()})`
          : order.user?.name || 'Unknown Customer');

      const orderId = order.id.slice(0, 8).toUpperCase();
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-AU', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      const orderTime = new Date(order.createdAt).toLocaleTimeString('en-AU', {
        hour: '2-digit', minute: '2-digit'
      });
      const phone = order.customerPhone || order.user?.phone || 'N/A';
      const address = order.deliveryAddress || 'Pickup';
      const paymentStatus = order.paymentStatus || 'Pending';
      const total = Number(order.totalAmount);

      const itemsHtml = order.orderItems.map((item: any) => {
        const itemTotal = Number(item.price) * item.quantity;
        let customizations = '';
        if (item.removedToppings?.length > 0) {
          customizations += `<div class="custom-line removed">No: ${item.removedToppings.join(', ')}</div>`;
        }
        if (item.addedExtras?.length > 0) {
          item.addedExtras.forEach((ex: any) => {
            customizations += `<div class="custom-line extra">+ ${ex.name} <span class="extra-price">$${Number(ex.price).toFixed(2)}</span></div>`;
          });
        }
        return `
          <tr class="item-row">
            <td class="item-cell">
              <div class="item-name">${item.quantity} × ${item.product?.name || 'Item'}${item.size ? ` <span class="item-size">(${item.size})</span>` : ''}</div>
              ${customizations}
            </td>
            <td class="price-cell">$${itemTotal.toFixed(2)}</td>
          </tr>`;
      }).join('');

      const pageBreak = idx > 0 ? 'page-break-before: always;' : '';

      return `
        <div class="invoice" style="${pageBreak}">
          <!-- HEADER -->
          <div class="header">
            <div class="header-left">
              <div class="brand-name">BRENT STREET PIZZA</div>
              <div class="brand-sub">Official Tax Invoice</div>
            </div>
            <div class="header-right">
              <div class="invoice-label">INVOICE</div>
              <div class="invoice-num">#${orderId}</div>
            </div>
          </div>

          <!-- META ROW -->
          <div class="meta-row">
            <div class="meta-block">
              <div class="meta-label">Date &amp; Time</div>
              <div class="meta-value">${orderDate}</div>
              <div class="meta-value">${orderTime}</div>
            </div>
            <div class="meta-block">
              <div class="meta-label">Bill To</div>
              <div class="meta-value bold">${customerName}</div>
              <div class="meta-value">${phone}</div>
            </div>
            <div class="meta-block">
              <div class="meta-label">Delivery Address</div>
              <div class="meta-value">${address}</div>
            </div>
            <div class="meta-block">
              <div class="meta-label">Payment Status</div>
              <div class="meta-value bold status-${paymentStatus.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}">${paymentStatus}</div>
            </div>
          </div>

          <!-- ITEMS TABLE -->
          <table class="items-table">
            <thead>
              <tr>
                <th class="th-item">Item Description</th>
                <th class="th-price">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- TOTALS -->
          <div class="totals">
            <div class="total-row">
              <span>Subtotal (excl. GST)</span>
              <span>$${(total / 1.1).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>GST (10%)</span>
              <span>$${(total - total / 1.1).toFixed(2)}</span>
            </div>
            <div class="total-row grand">
              <span>TOTAL</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer">
            <div class="footer-thanks">Thank you for dining with Brent Street Pizza!</div>
            <div class="footer-contact">
              ABN: 00 000 000 000 &nbsp;|&nbsp; brentstreetpizza.com.au &nbsp;|&nbsp; Brent Street, Australia
            </div>
            <div class="footer-note">This is a computer-generated invoice and does not require a signature.</div>
          </div>
        </div>`;
    }).join('');

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoices – Brent Street Pizza</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 12px;
      color: #1a1a1a;
      background: #fff;
    }

    .invoice {
      width: 740px;
      margin: 0 auto;
      padding: 48px 48px 40px;
      min-height: 100vh;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #1a1a1a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-name {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #c8201a;
    }
    .brand-sub {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .invoice-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #888;
      text-align: right;
    }
    .invoice-num {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      text-align: right;
      letter-spacing: 0.04em;
    }

    /* META ROW */
    .meta-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      background: #f9f9f9;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }
    .meta-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
      color: #999;
      margin-bottom: 6px;
    }
    .meta-value { font-size: 12px; color: #1a1a1a; line-height: 1.5; }
    .meta-value.bold { font-weight: 600; }

    /* ITEMS TABLE */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
    }
    .items-table thead tr {
      background: #1a1a1a;
      color: #fff;
    }
    .th-item {
      padding: 10px 16px;
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }
    .th-price {
      padding: 10px 16px;
      text-align: right;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      width: 100px;
    }
    .item-row { border-bottom: 1px solid #f0f0f0; }
    .item-row:last-child { border-bottom: none; }
    .item-cell { padding: 12px 16px; vertical-align: top; }
    .price-cell {
      padding: 12px 16px;
      text-align: right;
      vertical-align: top;
      font-weight: 600;
      white-space: nowrap;
    }
    .item-name { font-weight: 600; font-size: 13px; color: #1a1a1a; }
    .item-size { font-weight: 400; color: #666; font-size: 11px; }
    .custom-line { font-size: 11px; color: #666; margin-top: 3px; }
    .custom-line.removed { color: #c8201a; }
    .custom-line.extra { color: #d4952a; }
    .extra-price { color: #888; }

    /* TOTALS */
    .totals {
      border-top: 2px solid #1a1a1a;
      padding-top: 16px;
      margin-top: 0;
      width: 240px;
      margin-left: auto;
      margin-bottom: 32px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      padding: 4px 0;
      color: #555;
    }
    .total-row.grand {
      font-size: 17px;
      font-weight: 700;
      color: #1a1a1a;
      border-top: 1px solid #e0e0e0;
      margin-top: 8px;
      padding-top: 12px;
    }

    /* STATUS COLORS */
    .status-success { color: #16a34a; }
    .status-paid { color: #16a34a; }
    .status-pending { color: #d97706; }
    .status-pending-cod { color: #d97706; }
    .status-initiated { color: #2563eb; }
    .status-failed { color: #dc2626; }

    /* FOOTER */
    .footer {
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
      text-align: center;
    }
    .footer-thanks {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .footer-contact {
      font-size: 10px;
      color: #888;
      margin-bottom: 6px;
    }
    .footer-note {
      font-size: 9px;
      color: #bbb;
      font-style: italic;
    }

    @media print {
      @page { size: A4; margin: 0; }
      .invoice { page-break-after: always; width: 100%; }
      .invoice:last-child { page-break-after: avoid; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  ${invoicesHtml}
</body>
</html>`;

    // Use a hidden iframe to print without navigating away from admin
    const iframe = printFrameRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(fullHtml);
    doc.close();
    // Wait for resources (fonts) then print
    iframe.contentWindow?.addEventListener('load', () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    });
    // Fallback if load already fired
    setTimeout(() => {
      try { iframe.contentWindow?.print(); } catch (_) {}
    }, 800);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8201A]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hidden print iframe */}
      <iframe
        ref={printFrameRef}
        title="print-frame"
        style={{ position: 'fixed', width: 0, height: 0, border: 'none', left: '-9999px', top: '-9999px' }}
      />

      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
              Invoices Manager
            </h2>
            <p className="font-inter text-[14px] text-[#555555]">
              Select orders and print professional A4 invoices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setLoading(true); fetchOrders(); }}
              className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] hover:bg-[#F0E8DC] text-[#1A1A1A] font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={handlePrint}
              disabled={selectedInvoices.size === 0}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-black font-barlow text-[12px] font-700 uppercase tracking-widest px-6 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4" /> Print Selected ({selectedInvoices.size})
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={toggleSelectAll} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors p-1">
                {selectedInvoices.size === orders.length && orders.length > 0 ? (
                  <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                ) : (
                  <Square className="w-6 h-6 text-[#888888]" />
                )}
              </button>
              <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
                Select All ({orders.length} orders)
              </span>
            </div>
            {selectedInvoices.size > 0 && (
              <span className="font-inter text-[12px] text-[#C8201A] font-600">
                {selectedInvoices.size} selected
              </span>
            )}
          </div>

          {/* Orders List */}
          <div className="divide-y divide-[#E8D8C8] max-h-[60vh] overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 flex items-center justify-between hover:bg-[#FDFAF6] transition-colors cursor-pointer ${selectedInvoices.has(order.id) ? 'bg-[#FAECE8]' : ''}`}
                onClick={() => toggleSelection(order.id)}
              >
                <div className="flex items-center gap-5">
                  <div className="p-1">
                    {selectedInvoices.has(order.id) ? (
                      <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                    ) : (
                      <Square className="w-6 h-6 text-[#AAAAAA]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-[#1A1A1A] text-white font-mono text-[13px] font-700 px-2 py-0.5 rounded shadow-inner">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-barlow text-[15px] font-700 text-[#1A1A1A]">
                        {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `Guest (#${order.id.slice(0, 5).toUpperCase()})` : order.user?.name)}
                      </span>
                    </div>
                    <div className="text-[13px] text-[#555555] font-inter">
                      {new Date(order.createdAt).toLocaleString()} &nbsp;·&nbsp; {order.orderItems.length} items
                      {order.customerPhone && <> &nbsp;·&nbsp; {order.customerPhone}</>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest ${
                    order.paymentStatus?.toLowerCase().includes('success') || order.paymentStatus?.toLowerCase().includes('paid')
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-[#E8D8C8] text-[#555555]'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                  <div className="font-bebas text-[22px] text-[#C8201A] leading-none">
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && !loading && (
              <div className="p-12 text-center text-[#888888]">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bebas text-[24px] text-[#1A1A1A] tracking-wider mb-2">No orders available</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
