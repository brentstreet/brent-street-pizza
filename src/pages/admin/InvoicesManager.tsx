// import { useEffect, useState } from 'react';
// import { API_URL } from '../../config/api';
// import { RefreshCw, FileText, Printer, CheckSquare, Square, Filter, Calendar, Search, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function InvoicesManager() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  
//   // Filters & Search
//   const [filterStatus, setFilterStatus] = useState<string>('ALL');
//   const [filterDate, setFilterDate] = useState<string>('');
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   const navigate = useNavigate();

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(`${API_URL}/api/admin/orders`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (!res.ok) {
//         if (res.status === 401 || res.status === 403) {
//           localStorage.removeItem('adminToken');
//           localStorage.removeItem('adminUser');
//           navigate('/admin/login');
//           return;
//         }
//         return;
//       }
//       const data = await res.json();
//       setOrders(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//         setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     const interval = setInterval(fetchOrders, 30000);
//     return () => clearInterval(interval);
//   }, [navigate]);

//   const toggleSelection = (orderId: string) => {
//     const newSelection = new Set(selectedInvoices);
//     if (newSelection.has(orderId)) {
//       newSelection.delete(orderId);
//     } else {
//       newSelection.add(orderId);
//     }
//     setSelectedInvoices(newSelection);
//   };

//   // Extract unique payment statuses for the filter dropdown
//   const uniqueStatuses = ['ALL', ...Array.from(new Set(orders.map(o => o.paymentStatus || 'Pending')))];

//   // Apply filters and search
//   const filteredOrders = orders.filter(o => {
//     // 1. Status Match
//     const matchStatus = filterStatus === 'ALL' || (o.paymentStatus || 'Pending') === filterStatus;
    
//     // 2. Date Match
//     let matchDate = true;
//     if (filterDate) {
//       const orderDate = new Date(o.createdAt);
//       // Format order date to local YYYY-MM-DD to match the date input exactly
//       const localDate = new Date(orderDate.getTime() - (orderDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
//       matchDate = localDate === filterDate;
//     }

//     // 3. Search Match (Order ID, Name, Phone)
//     let matchSearch = true;
//     if (searchQuery.trim() !== '') {
//       const query = searchQuery.toLowerCase().trim();
//       const orderId = o.id.toLowerCase();
//       const customerName = (o.customerName || o.user?.name || '').toLowerCase();
//       const customerPhone = (o.customerPhone || o.user?.phone || '').toLowerCase();

//       matchSearch = orderId.includes(query) || customerName.includes(query) || customerPhone.includes(query);
//     }
    
//     return matchStatus && matchDate && matchSearch;
//   });

//   const toggleSelectAll = () => {
//     // Only select/deselect the CURRENTLY FILTERED orders
//     if (selectedInvoices.size === filteredOrders.length && filteredOrders.length > 0) {
//       setSelectedInvoices(new Set());
//     } else {
//       setSelectedInvoices(new Set(filteredOrders.map(o => o.id)));
//     }
//   };

//   const handlePrint = () => {
//     if (selectedInvoices.size === 0) {
//       alert("Please select at least one invoice to print.");
//       return;
//     }
//     window.print();
//   };

//   if (loading && orders.length === 0) {
//     return (
//       <div className="flex items-center justify-center p-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8201A]"></div>
//       </div>
//     );
//   }

//   // Get only the selected orders for printing
//   const printOrders = orders.filter(o => selectedInvoices.has(o.id));

//   return (
//     <>
//       <div className="max-w-6xl mx-auto animate-in fade-in duration-500 print:hidden">
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
//           <div>
//             <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
//               Invoices Manager
//             </h2>
//             <p className="font-inter text-[14px] text-[#555555]">
//               Select orders to print or download as thermal-style receipts.
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={() => { setLoading(true); fetchOrders(); }}
//               className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] hover:bg-[#F0E8DC] text-[#1A1A1A] font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
//             </button>
//             <button 
//               onClick={handlePrint}
//               disabled={selectedInvoices.size === 0}
//               className="flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-black font-barlow text-[12px] font-700 uppercase tracking-widest px-6 py-2 rounded-xl transition-all disabled:opacity-50"
//             >
//               <Printer className="w-4 h-4" /> Print Selected ({selectedInvoices.size})
//             </button>
//           </div>
//         </div>

//         <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm">
//           {/* Header Row with Filters and Search */}
//           <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <button onClick={toggleSelectAll} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors p-1">
//                 {selectedInvoices.size === filteredOrders.length && filteredOrders.length > 0 ? (
//                   <CheckSquare className="w-6 h-6 text-[#C8201A]" />
//                 ) : (
//                   <Square className="w-6 h-6 text-[#888888]" />
//                 )}
//               </button>
//               <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
//                 Select All Filtered
//               </span>
//             </div>

//             {/* Filters & Search Bar */}
//             <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
//               {/* Search Bar */}
//               <div className="flex items-center gap-2 bg-white border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none md:min-w-[240px]">
//                 <Search className="w-4 h-4 text-[#888]" />
//                 <input 
//                   type="text" 
//                   placeholder="Search ID, Name, Phone..." 
//                   value={searchQuery}
//                   onChange={e => setSearchQuery(e.target.value)}
//                   className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full"
//                 />
//                 {searchQuery && (
//                   <button onClick={() => setSearchQuery('')} className="text-[#888] hover:text-[#C8201A]">
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               {/* Status Filter */}
//               <div className="flex items-center gap-2 bg-white border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
//                 <Filter className="w-4 h-4 text-[#888]" />
//                 <select 
//                   value={filterStatus} 
//                   onChange={e => setFilterStatus(e.target.value)}
//                   className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full cursor-pointer"
//                 >
//                   {uniqueStatuses.map(s => (
//                     <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Date Filter */}
//               <div className="flex items-center gap-2 bg-white border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
//                 <Calendar className="w-4 h-4 text-[#888]" />
//                 <input 
//                   type="date" 
//                   value={filterDate} 
//                   onChange={e => setFilterDate(e.target.value)}
//                   className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full cursor-pointer"
//                 />
//                 {filterDate && (
//                   <button onClick={() => setFilterDate('')} className="text-[#C8201A] hover:text-red-800 text-[12px] font-barlow font-700 uppercase ml-2">
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Orders List */}
//           <div className="divide-y divide-[#E8D8C8] max-h-[60vh] overflow-y-auto">
//             {filteredOrders.map((order) => (
//               <div 
//                 key={order.id} 
//                 className={`p-4 flex items-center justify-between hover:bg-[#FDFAF6] transition-colors cursor-pointer ${selectedInvoices.has(order.id) ? 'bg-[#FAECE8]' : ''}`}
//                 onClick={() => toggleSelection(order.id)}
//               >
//                 <div className="flex items-center gap-5">
//                   <div className="p-1">
//                     {selectedInvoices.has(order.id) ? (
//                       <CheckSquare className="w-6 h-6 text-[#C8201A]" />
//                     ) : (
//                       <Square className="w-6 h-6 text-[#AAAAAA]" />
//                     )}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-3 mb-1">
//                       <span className="bg-[#1A1A1A] text-white font-mono text-[13px] font-700 px-2 py-0.5 rounded shadow-inner">
//                         #{order.id.slice(0, 8).toUpperCase()}
//                       </span>
//                       <span className="font-barlow text-[15px] font-700 text-[#1A1A1A]">
//                         {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `Guest (#${order.id.slice(0, 5).toUpperCase()})` : order.user?.name)}
//                       </span>
//                     </div>
//                     <div className="text-[13px] text-[#555555] font-inter">
//                       {new Date(order.createdAt).toLocaleString()} • {order.orderItems.length} items
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right flex flex-col items-end gap-1">
//                   <span className={`inline-block px-2 py-0.5 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest bg-[#E8D8C8] text-[#555555]`}>
//                     {order.paymentStatus || 'Pending'}
//                   </span>
//                   <div className="font-bebas text-[22px] text-[#C8201A] leading-none">
//                     ${Number(order.totalAmount).toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {filteredOrders.length === 0 && !loading && (
//               <div className="p-12 text-center text-[#888888]">
//                 <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <h3 className="font-bebas text-[24px] text-[#1A1A1A] tracking-wider mb-2">No matching orders</h3>
//                 <p className="font-inter text-[14px]">Try adjusting your filters or search query to see more results.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Printable Area - Hidden on screen, shown when printing */}
//       <div className="hidden print:block font-sans text-black w-full max-w-full">
//         {printOrders.map((order, idx) => {
//           const customerCode = order.id.slice(0, 5).toUpperCase();
//           const isDelivery = order.deliveryAddress && order.deliveryAddress.trim().toLowerCase() !== 'pickup';
          
//           // Calculate true food subtotal
//           const foodSubtotal = order.orderItems.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);

//           return (
//             <div key={order.id} className={`w-[320px] mx-auto bg-white p-4 ${idx > 0 ? 'mt-12 [page-break-before:always]' : ''}`}>
//               {/* Receipt Header */}
//               <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
//                 <h1 className="text-[20px] font-extrabold tracking-tight">Brent Street Pizza</h1>
//                 <span className="text-[18px] font-normal tracking-wide">{isDelivery ? 'DELIVERY' : 'PICKUP'}</span>
//               </div>

//               {/* Customer ID Banner */}
//               <div className="bg-black text-white px-2 py-1.5 flex justify-between items-center font-bold text-[22px] tracking-wide mb-3">
//                 <span className="flex-1">
//                   {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `Guest (#${order.id.slice(0, 5).toUpperCase()})` : order.user?.name)}
//                 </span>
//                 <span className="ml-2 shrink-0">{customerCode}</span>
//               </div>

//               <div className="mb-4 text-[15px] font-bold leading-tight border-b-2 border-black pb-4">
//                 <p>PHONE: {order.customerPhone || order.user?.phone || 'N/A'}</p>
//                 {isDelivery && (
//                   <p className="mt-1">ADDR: {order.deliveryAddress}</p>
//                 )}
//               </div>

//               {/* Items List */}
//               <div className="space-y-4 text-[15px] font-semibold border-b-2 border-black pb-4">
//                 {order.orderItems.map((item: any, i: number) => {
//                   return (
//                     <div key={i} className="flex flex-col">
//                       <div className="flex justify-between items-start">
//                         <span className="mr-2 flex-1">{item.quantity} x {item.product?.name || 'Unknown Item'} {item.size ? `(${item.size})` : ''}</span>
//                         <span>${Number(item.price * item.quantity).toFixed(2)}</span>
//                       </div>
                      
//                       {/* Choices / Modifications */}
//                       {((item.removedToppings && item.removedToppings.length > 0) || (item.addedExtras && item.addedExtras.length > 0)) && (
//                         <div className="ml-4 mt-1 space-y-1 text-[13px] font-normal">
//                           {item.removedToppings && item.removedToppings.length > 0 && (
//                             <>
//                               <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Removed Toppings</div>
//                               <div className="flex justify-between items-center">
//                                 <span>1x {item.removedToppings.join(', ')}</span>
//                                 <span>$0.00</span>
//                               </div>
//                             </>
//                           )}
                          
//                           {item.addedExtras && item.addedExtras.length > 0 && (
//                             <>
//                               <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Add Extras</div>
//                               {item.addedExtras.map((ex: any, exIdx: number) => (
//                                 <div key={exIdx} className="flex justify-between items-center">
//                                   <span>1x {ex.name}</span>
//                                   <span>${Number(ex.price).toFixed(2)}</span>
//                                 </div>
//                               ))}
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>

//               {/* Totals Section */}
//               <div className="mt-4 border-b-2 border-black pb-4 space-y-1 text-[15px] font-semibold">
//                 <div className="flex justify-between">
//                   <span>Subtotal (Food)</span>
//                   <span>${foodSubtotal.toFixed(2)}</span>
//                 </div>
                
//                 <div className="flex justify-between text-[13px] font-normal mt-1">
//                   <span>Platform Fee</span>
//                   <span>$0.50</span>
//                 </div>

//                 {isDelivery && (
//                   <div className="flex justify-between text-[13px] font-normal mt-0.5">
//                     <span>Delivery Fee</span>
//                     <span>$5.00</span>
//                   </div>
//                 )}
                
//                 <div className="flex justify-between font-bold text-[18px] pt-2 mt-2 border-t border-black border-dashed">
//                   <span>Amount Paid</span>
//                   <span>${Number(order.totalAmount).toFixed(2)}</span>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="mt-4 text-center text-[12px] font-medium italic px-4 pb-8">
//                 Thank you for ordering from Brent Street Pizza
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }
import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { RefreshCw, FileText, Printer, CheckSquare, Square, Filter, Calendar, Search, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvoicesManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  
  // Filters & Search
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // --- NEW: Delete Single Invoice (Order) ---
  const handleDeleteInvoice = async (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete invoice/order #${orderId.slice(0, 8).toUpperCase()}? This cannot be undone.`)) return;

    setUpdating(orderId);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setSelectedInvoices(prev => {
          const newSel = new Set(prev);
          newSel.delete(orderId);
          return newSel;
        });
        fetchOrders();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete invoice');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the invoice.');
    } finally {
      setUpdating(null);
    }
  };

  // --- NEW: Delete Multiple Invoices (Bulk) ---
  const handleBulkDeleteInvoices = async () => {
    if (selectedInvoices.size === 0) return;
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete ${selectedInvoices.size} selected invoice(s)? This action cannot be undone.`)) return;

    setUpdating('bulk');
    try {
      const token = localStorage.getItem('adminToken');
      
      const deletePromises = Array.from(selectedInvoices).map(orderId =>
        fetch(`${API_URL}/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      setSelectedInvoices(new Set()); // clear selection
      fetchOrders();
    } catch (err) {
      console.error('Bulk delete failed', err);
      alert('An error occurred during bulk deletion.');
    } finally {
      setUpdating(null);
    }
  };

  const toggleSelection = (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedInvoices(newSelection);
  };

  // Extract unique payment statuses for the filter dropdown
  const uniqueStatuses = ['ALL', ...Array.from(new Set(orders.map(o => o.paymentStatus || 'Pending')))];

  // Apply filters and search
  const filteredOrders = orders.filter(o => {
    // 1. Status Match
    const matchStatus = filterStatus === 'ALL' || (o.paymentStatus || 'Pending') === filterStatus;
    
    // 2. Date Match
    let matchDate = true;
    if (filterDate) {
      const orderDate = new Date(o.createdAt);
      // Format order date to local YYYY-MM-DD to match the date input exactly
      const localDate = new Date(orderDate.getTime() - (orderDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      matchDate = localDate === filterDate;
    }

    // 3. Search Match (Order ID, Name, Phone)
    let matchSearch = true;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const orderId = o.id.toLowerCase();
      const customerName = (o.customerName || o.user?.name || '').toLowerCase();
      const customerPhone = (o.customerPhone || o.user?.phone || '').toLowerCase();

      matchSearch = orderId.includes(query) || customerName.includes(query) || customerPhone.includes(query);
    }
    
    return matchStatus && matchDate && matchSearch;
  });

  const toggleSelectAll = () => {
    // Only select/deselect the CURRENTLY FILTERED orders
    if (selectedInvoices.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handlePrint = () => {
    if (selectedInvoices.size === 0) {
      alert("Please select at least one invoice to print.");
      return;
    }
    window.print();
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8201A]"></div>
      </div>
    );
  }

  // Get only the selected orders for printing
  const printOrders = orders.filter(o => selectedInvoices.has(o.id));

  return (
    <>
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 print:hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
              Invoices Manager
            </h2>
            <p className="font-inter text-[14px] text-[#555555]">
              Select orders to print or download as thermal-style receipts.
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

        {/* --- NEW: Bulk Delete Button Panel --- */}
        {selectedInvoices.size > 0 && (
          <div className="bg-white border border-[#E8D8C8] rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
              {selectedInvoices.size} Invoice(s) Selected
            </span>
            <button
              onClick={handleBulkDeleteInvoices}
              disabled={updating === 'bulk'}
              className="flex items-center gap-2 bg-white border border-[#C8201A] text-[#C8201A] hover:bg-[#C8201A]/10 font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete Selected
            </button>
          </div>
        )}

        <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm">
          {/* Header Row with Filters and Search */}
          <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={toggleSelectAll} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors p-1">
                {selectedInvoices.size === filteredOrders.length && filteredOrders.length > 0 ? (
                  <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                ) : (
                  <Square className="w-6 h-6 text-[#888888]" />
                )}
              </button>
              <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
                Select All Filtered
              </span>
            </div>

            {/* Filters & Search Bar */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-white border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none md:min-w-[240px]">
                <Search className="w-4 h-4 text-[#888]" />
                <input 
                  type="text" 
                  placeholder="Search ID, Name, Phone..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#888] hover:text-[#C8201A]">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
                <Filter className="w-4 h-4 text-[#888]" />
                <select 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full cursor-pointer"
                >
                  {uniqueStatuses.map(s => (
                    <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2 bg-white border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
                <Calendar className="w-4 h-4 text-[#888]" />
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={e => setFilterDate(e.target.value)}
                  className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full cursor-pointer"
                />
                {filterDate && (
                  <button onClick={() => setFilterDate('')} className="text-[#C8201A] hover:text-red-800 text-[12px] font-barlow font-700 uppercase ml-2">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Orders/Invoices List */}
          <div className="divide-y divide-[#E8D8C8] max-h-[60vh] overflow-y-auto">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={`p-4 flex items-center justify-between hover:bg-[#FDFAF6] transition-colors cursor-pointer ${selectedInvoices.has(order.id) ? 'bg-[#FAECE8]' : ''}`}
                onClick={(e) => toggleSelection(order.id, e)}
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
                      {new Date(order.createdAt).toLocaleString()} • {order.orderItems.length} items
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest bg-[#E8D8C8] text-[#555555]`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                    <div className="font-bebas text-[22px] text-[#C8201A] leading-none">
                      ${Number(order.totalAmount).toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Single Delete Button */}
                  <div className="w-px h-8 bg-[#E8D8C8] mx-2 hidden sm:block"></div>
                  <button 
                    onClick={(e) => handleDeleteInvoice(order.id, e)}
                    disabled={updating === order.id}
                    title="Delete Invoice"
                    className="p-2 text-[#888888] hover:bg-red-50 hover:text-[#C8201A] rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredOrders.length === 0 && !loading && (
              <div className="p-12 text-center text-[#888888]">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bebas text-[24px] text-[#1A1A1A] tracking-wider mb-2">No matching orders</h3>
                <p className="font-inter text-[14px]">Try adjusting your filters or search query to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Area - Hidden on screen, shown when printing */}
      <div className="hidden print:block font-sans text-black w-full max-w-full">
        {printOrders.map((order, idx) => {
          const customerCode = order.id.slice(0, 5).toUpperCase();
          const isDelivery = order.deliveryAddress && order.deliveryAddress.trim().toLowerCase() !== 'pickup';
          
          // Calculate true food subtotal
          const foodSubtotal = order.orderItems.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);

          return (
            <div key={order.id} className={`w-[320px] mx-auto bg-white p-4 ${idx > 0 ? 'mt-12 [page-break-before:always]' : ''}`}>
              {/* Receipt Header */}
              <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
                <h1 className="text-[20px] font-extrabold tracking-tight">Brent Street Pizza</h1>
                <span className="text-[18px] font-normal tracking-wide">{isDelivery ? 'DELIVERY' : 'PICKUP'}</span>
              </div>

              {/* Customer ID Banner */}
              <div className="bg-black text-white px-2 py-1.5 flex justify-between items-center font-bold text-[22px] tracking-wide mb-3">
                <span className="flex-1">
                  {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `Guest (#${order.id.slice(0, 5).toUpperCase()})` : order.user?.name)}
                </span>
                <span className="ml-2 shrink-0">{customerCode}</span>
              </div>

              <div className="mb-4 text-[15px] font-bold leading-tight border-b-2 border-black pb-4">
                <p>PHONE: {order.customerPhone || order.user?.phone || 'N/A'}</p>
                {isDelivery && (
                  <p className="mt-1">ADDR: {order.deliveryAddress}</p>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-4 text-[15px] font-semibold border-b-2 border-black pb-4">
                {order.orderItems.map((item: any, i: number) => {
                  return (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className="mr-2 flex-1">{item.quantity} x {item.product?.name || item.deal?.title || 'Unknown Item'} {item.size ? `(${item.size})` : ''}</span>
                        <span>${Number(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      {/* Choices / Modifications */}
                      {((item.removedToppings && item.removedToppings.length > 0) || (item.addedExtras && item.addedExtras.length > 0)) && (
                        <div className="ml-4 mt-1 space-y-1 text-[13px] font-normal">
                          {item.removedToppings && item.removedToppings.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Removed Toppings</div>
                              <div className="flex justify-between items-center">
                                <span>1x {item.removedToppings.join(', ')}</span>
                                <span>$0.00</span>
                              </div>
                            </>
                          )}
                          
                          {item.addedExtras && item.addedExtras.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Add Extras</div>
                              {item.addedExtras.map((ex: any, exIdx: number) => (
                                <div key={exIdx} className="flex justify-between items-center">
                                  <span>1x {ex.name}</span>
                                  <span>${Number(ex.price).toFixed(2)}</span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Totals Section */}
              <div className="mt-4 border-b-2 border-black pb-4 space-y-1 text-[15px] font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal (Food)</span>
                  <span>${foodSubtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-[13px] font-normal mt-1">
                  <span>Platform Fee</span>
                  <span>$0.50</span>
                </div>

                {isDelivery && (
                  <div className="flex justify-between text-[13px] font-normal mt-0.5">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-[18px] pt-2 mt-2 border-t border-black border-dashed">
                  <span>Amount Paid</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 text-center text-[12px] font-medium italic px-4 pb-8">
                Thank you for ordering from Brent Street Pizza
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
