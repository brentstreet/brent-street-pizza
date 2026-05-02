// import { useEffect, useState } from 'react';
// import { API_URL } from '../../config/api';
// import { 
//   RefreshCw, MapPin, Phone, ChefHat, Bike, CheckCircle2, 
//   ShoppingBag, Square, CheckSquare, Search, X, Filter, Calendar, Printer 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function OrdersManager() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<string | null>(null);
//   const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
//   const [bulkPaymentStatus, setBulkPaymentStatus] = useState('Paid');
  
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
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     // Auto refresh every 30 seconds
//     const interval = setInterval(fetchOrders, 30000);
//     return () => clearInterval(interval);
//   }, [navigate]);

//   const handleUpdateStatus = async (orderId: string, status: string, paymentStatus?: string) => {
//     setUpdating(orderId);
//     try {
//       const token = localStorage.getItem('adminToken');
//       const payload: any = { status };
//       if (paymentStatus) payload.paymentStatus = paymentStatus;

//       const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });
//       if (res.ok) fetchOrders();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const handleBulkUpdatePayment = async () => {
//     if (selectedOrders.size === 0) return;
//     setUpdating('bulk');
//     try {
//       const token = localStorage.getItem('adminToken');
      
//       const updatePromises = Array.from(selectedOrders).map(orderId => {
//         const order = orders.find(o => o.id === orderId);
//         if (!order) return Promise.resolve();

//         return fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ status: order.status, paymentStatus: bulkPaymentStatus })
//         });
//       });

//       await Promise.all(updatePromises);
//       setSelectedOrders(new Set()); // clear selection
//       fetchOrders();
//     } catch (err) {
//       console.error('Bulk update failed', err);
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const toggleSelection = (id: string, e?: React.MouseEvent) => {
//     if (e) e.stopPropagation();
//     const newSel = new Set(selectedOrders);
//     if (newSel.has(id)) newSel.delete(id);
//     else newSel.add(id);
//     setSelectedOrders(newSel);
//   };

//   // Filter Logic
//   const uniqueStatuses = ['ALL', ...Array.from(new Set(orders.map(o => o.status || 'Placed')))];

//   const filteredOrders = orders.filter(o => {
//     // Status Match
//     const matchStatus = filterStatus === 'ALL' || (o.status || 'Placed') === filterStatus;
    
//     // Date Match
//     let matchDate = true;
//     if (filterDate) {
//       const orderDate = new Date(o.createdAt);
//       const localDate = new Date(orderDate.getTime() - (orderDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
//       matchDate = localDate === filterDate;
//     }

//     // Search Match (Order ID, Name, Phone)
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
//     if (selectedOrders.size === filteredOrders.length && filteredOrders.length > 0) {
//       setSelectedOrders(new Set());
//     } else {
//       setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
//     }
//   };

//   const handlePrint = () => {
//     if (selectedOrders.size === 0) {
//       alert("Please select at least one order to print.");
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

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Preparing': return <ChefHat className="w-4 h-4" />;
//       case 'Out for Delivery': return <Bike className="w-4 h-4" />;
//       case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
//       default: return null;
//     }
//   };

//   const printOrders = orders.filter(o => selectedOrders.has(o.id));

//   return (
//     <>
//       <div className="max-w-6xl mx-auto animate-in fade-in duration-500 print:hidden">
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
//           <div>
//             <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
//               Orders Manager
//             </h2>
//             <p className="font-inter text-[14px] text-[#555555]">
//               View, filter, search, manage, and print customer orders in real-time.
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
//               disabled={selectedOrders.size === 0}
//               className="flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-black font-barlow text-[12px] font-700 uppercase tracking-widest px-6 py-2 rounded-xl transition-all disabled:opacity-50"
//             >
//               <Printer className="w-4 h-4" /> Print Selected ({selectedOrders.size})
//             </button>
//           </div>
//         </div>

//         {/* Filters and Search Bar */}
//         <div className="bg-white border border-[#E8D8C8] rounded-xl p-4 mb-4 flex flex-wrap items-center gap-4 shadow-sm">
//           {/* Search Bar */}
//           <div className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 min-w-[240px]">
//             <Search className="w-4 h-4 text-[#888]" />
//             <input 
//               type="text" 
//               placeholder="Search ID, Name, Phone..." 
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full"
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery('')} className="text-[#888] hover:text-[#C8201A]">
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Order Status Filter */}
//           <div className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
//             <Filter className="w-4 h-4 text-[#888]" />
//             <select 
//               value={filterStatus} 
//               onChange={e => setFilterStatus(e.target.value)}
//               className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full cursor-pointer"
//             >
//               {uniqueStatuses.map(s => (
//                 <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
//               ))}
//             </select>
//           </div>

//           {/* Date Filter */}
//           <div className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
//             <Calendar className="w-4 h-4 text-[#888]" />
//             <input 
//               type="date" 
//               value={filterDate} 
//               onChange={e => setFilterDate(e.target.value)}
//               className="bg-transparent border-none outline-none font-inter text-[13px] text-[#1A1A1A] w-full cursor-pointer"
//             />
//             {filterDate && (
//               <button onClick={() => setFilterDate('')} className="text-[#C8201A] hover:text-red-800 text-[12px] font-barlow font-700 uppercase ml-2">
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Bulk Actions Panel */}
//         {orders.length > 0 && (
//           <div className="bg-white border border-[#E8D8C8] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
//             <div className="flex items-center gap-3">
//               <button onClick={toggleSelectAll} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors p-1">
//                 {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 ? (
//                   <CheckSquare className="w-6 h-6 text-[#C8201A]" />
//                 ) : (
//                   <Square className="w-6 h-6 text-[#888888]" />
//                 )}
//               </button>
//               <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
//                 Select All Filtered ({selectedOrders.size})
//               </span>
//             </div>

//             <div className="flex items-center gap-3">
//               <select
//                 value={bulkPaymentStatus}
//                 onChange={(e) => setBulkPaymentStatus(e.target.value)}
//                 className="bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A]"
//               >
//                 <option value="Paid">Mark as Paid</option>
//                 <option value="Pending">Mark as Pending</option>
//                 <option value="Refunded">Mark as Refunded</option>
//               </select>
//               <button
//                 onClick={handleBulkUpdatePayment}
//                 disabled={selectedOrders.size === 0 || updating === 'bulk'}
//                 className="bg-[#C8201A] text-white hover:bg-[#A01612] font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 Apply to Selected
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="space-y-6">
//           {filteredOrders.map((order) => (
//             <div key={order.id} className={`bg-white border ${selectedOrders.has(order.id) ? 'border-[#C8201A] shadow-md ring-1 ring-[#C8201A]' : 'border-[#E8D8C8] shadow-sm'} rounded-2xl overflow-hidden transition-all`}>
//               {/* Order Header */}
//               <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-5 flex flex-wrap items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <button onClick={(e) => toggleSelection(order.id, e)} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors">
//                     {selectedOrders.has(order.id) ? (
//                       <CheckSquare className="w-6 h-6 text-[#C8201A]" />
//                     ) : (
//                       <Square className="w-6 h-6 text-[#AAAAAA]" />
//                     )}
//                   </button>
//                   <div className="bg-[#1A1A1A] text-white font-mono text-[16px] font-700 px-3 py-1.5 rounded-lg shadow-inner">
//                     #{order.id.slice(0, 8).toUpperCase()}
//                   </div>
//                   <div>
//                     <h3 className="font-barlow text-[16px] font-700 text-[#1A1A1A]">
//                       {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `#${order.id.slice(0, 8).toUpperCase()}` : order.user?.name)}
//                     </h3>
//                     <div className="flex flex-wrap items-center gap-3 text-[#555555] font-inter text-[13px] mt-0.5">
//                       <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {order.customerPhone || order.user?.phone || 'N/A'}</span>
//                       <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {order.deliveryAddress || 'Pickup'}</span>
//                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
//                         ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
//                           order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
//                           'bg-[#E8D8C8] text-[#555555]'}`}
//                       >
//                         {getStatusIcon(order.status)}
//                         {order.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-6">
//                   <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
//                     ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
//                       order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
//                       'bg-[#E8D8C8] text-[#555555]'}`}
//                   >
//                     {getStatusIcon(order.status)}
//                     {order.status}
//                   </span>
//                   <div className="text-right">
//                     <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888] mb-0.5">Total</p>
//                     <p className="font-bebas text-[28px] text-[#C8201A] leading-none">${Number(order.totalAmount).toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Body */}
//               <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Items List */}
//                 <div className="md:col-span-2 space-y-3">
//                   <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#C8201A] mb-2 border-b border-[#E8D8C8] pb-2">
//                     Order Items ({order.orderItems.length})
//                   </p>
//                   <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2">
//                     {order.orderItems.map((item: any) => (
//                       <div key={item.id} className="flex gap-3 text-[14px]">
//                         <span className="font-barlow font-700 text-[#1A1A1A] w-6 flex-shrink-0 text-right">{item.quantity}x</span>
//                         <div className="flex-1 font-inter">
//                           <p className="font-medium text-[#1A1A1A]">{item.product?.name || item.deal?.title || 'Unknown Item'} {item.size ? `(${item.size})` : ''}</p>
//                           {item.removedToppings?.length > 0 && <p className="text-[12px] text-[#C8201A] italic">No {item.removedToppings.join(', ')}</p>}
//                           {item.addedExtras?.length > 0 && <p className="text-[12px] text-[#D4952A]">+ {item.addedExtras.map((e:any)=>e.name).join(', ')}</p>}
//                         </div>
//                         <span className="font-barlow font-700">${Number(item.price).toFixed(2)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Status Controls */}
//                 <div className="space-y-5 bg-[#FDFAF6] rounded-xl p-4 border border-[#E8D8C8]">
//                    <div>
//                     <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Delivery Details</p>
//                     <p className="font-inter text-[13px] text-[#1A1A1A] flex items-start gap-2">
//                       <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0 mt-0.5" />
//                       {order.payments?.[0]?.provider === 'Stripe' ? 'Online Order' : 'Cash Order'}<br/>
//                       {new Date(order.createdAt).toLocaleString()}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Order Progress</p>
//                     <select
//                       disabled={updating === order.id}
//                       value={order.status}
//                       onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                       className="w-full bg-white border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] disabled:opacity-50 transition-colors"
//                     >
//                       <option value="Placed">Placed (New)</option>
//                       <option value="Preparing">Preparing</option>
//                       <option value="Out for Delivery">Out for Delivery</option>
//                       <option value="Ready for Pickup">Ready for Pickup</option>
//                       <option value="Delivered">Delivered / Completed</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>

//                   <div>
//                     <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Payment Status</p>
//                     <select
//                       disabled={updating === order.id}
//                       value={order.paymentStatus}
//                       onChange={(e) => handleUpdateStatus(order.id, order.status, e.target.value)}
//                       className="w-full bg-white border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] disabled:opacity-50 transition-colors"
//                     >
//                       <option value="Pending">Pending (COD/Unpaid)</option>
//                       <option value="Paid">Paid Online</option>
//                       <option value="Refunded">Refunded</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {filteredOrders.length === 0 && !loading && (
//             <div className="bg-white border-2 border-dashed border-[#E8D8C8] rounded-3xl p-12 text-center text-[#888888]">
//               <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
//               <h3 className="font-bebas text-[28px] text-[#1A1A1A] tracking-wider leading-none mb-2">No matching orders</h3>
//               <p className="font-inter text-[15px]">Try adjusting your search or filters to find what you're looking for.</p>
//             </div>
//           )}
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
//                         <span className="mr-2 flex-1">{item.quantity} x {item.product?.name || item.deal?.title || 'Unknown Item'} {item.size ? `(${item.size})` : ''}</span>
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
import { 
  RefreshCw, MapPin, Phone, ChefHat, Bike, CheckCircle2, 
  ShoppingBag, Square, CheckSquare, Search, X, Filter, Calendar, Printer, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkPaymentStatus, setBulkPaymentStatus] = useState('Paid');
  
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
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleUpdateStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem('adminToken');
      const payload: any = { status };
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleBulkUpdatePayment = async () => {
    if (selectedOrders.size === 0) return;
    setUpdating('bulk');
    try {
      const token = localStorage.getItem('adminToken');
      
      const updatePromises = Array.from(selectedOrders).map(orderId => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return Promise.resolve();

        return fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: order.status, paymentStatus: bulkPaymentStatus })
        });
      });

      await Promise.all(updatePromises);
      setSelectedOrders(new Set()); // clear selection
      fetchOrders();
    } catch (err) {
      console.error('Bulk update failed', err);
    } finally {
      setUpdating(null);
    }
  };

  // --- Delete Single Order ---
  const handleDeleteOrder = async (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete order #${orderId.slice(0, 8).toUpperCase()}? This cannot be undone.`)) return;

    setUpdating(orderId);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setSelectedOrders(prev => {
          const newSel = new Set(prev);
          newSel.delete(orderId);
          return newSel;
        });
        fetchOrders();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the order.');
    } finally {
      setUpdating(null);
    }
  };

  // --- Delete Multiple Orders (Bulk) ---
  const handleBulkDeleteOrders = async () => {
    if (selectedOrders.size === 0) return;
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete ${selectedOrders.size} selected order(s)? This action cannot be undone.`)) return;

    setUpdating('bulk');
    try {
      const token = localStorage.getItem('adminToken');
      
      const deletePromises = Array.from(selectedOrders).map(orderId =>
        fetch(`${API_URL}/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(deletePromises);
      setSelectedOrders(new Set()); // clear selection
      fetchOrders();
    } catch (err) {
      console.error('Bulk delete failed', err);
      alert('An error occurred during bulk deletion.');
    } finally {
      setUpdating(null);
    }
  };

  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSel = new Set(selectedOrders);
    if (newSel.has(id)) newSel.delete(id);
    else newSel.add(id);
    setSelectedOrders(newSel);
  };

  // Filter Logic
  const uniqueStatuses = ['ALL', ...Array.from(new Set(orders.map(o => o.status || 'Placed')))];

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || (o.status || 'Placed') === filterStatus;
    
    let matchDate = true;
    if (filterDate) {
      const orderDate = new Date(o.createdAt);
      const localDate = new Date(orderDate.getTime() - (orderDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      matchDate = localDate === filterDate;
    }

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
    if (selectedOrders.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handlePrint = () => {
    if (selectedOrders.size === 0) {
      alert("Please select at least one order to print.");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Preparing': return <ChefHat className="w-4 h-4" />;
      case 'Out for Delivery': return <Bike className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const printOrders = orders.filter(o => selectedOrders.has(o.id));

  return (
    <>
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 print:hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
              Orders Manager
            </h2>
            <p className="font-inter text-[14px] text-[#555555]">
              View, filter, search, manage, and print customer orders in real-time.
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
              disabled={selectedOrders.size === 0}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-black font-barlow text-[12px] font-700 uppercase tracking-widest px-6 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4" /> Print Selected ({selectedOrders.size})
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white border border-[#E8D8C8] rounded-xl p-4 mb-4 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 min-w-[240px]">
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

          <div className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
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

          <div className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-1.5 flex-1 md:flex-none">
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

        {/* Bulk Actions Panel */}
        {orders.length > 0 && (
          <div className="bg-white border border-[#E8D8C8] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={toggleSelectAll} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors p-1">
                {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 ? (
                  <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                ) : (
                  <Square className="w-6 h-6 text-[#888888]" />
                )}
              </button>
              <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
                Select All Filtered ({selectedOrders.size})
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              <button
                onClick={handleBulkDeleteOrders}
                disabled={selectedOrders.size === 0 || updating === 'bulk'}
                className="flex items-center gap-2 bg-white border border-[#C8201A] text-[#C8201A] hover:bg-[#C8201A]/10 font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected
              </button>

              <div className="w-px h-6 bg-[#E8D8C8] mx-1 hidden sm:block"></div>

              <select
                value={bulkPaymentStatus}
                onChange={(e) => setBulkPaymentStatus(e.target.value)}
                className="bg-[#FDFAF6] border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A]"
              >
                <option value="Paid">Mark as Paid</option>
                <option value="Pending">Mark as Pending</option>
                <option value="Refunded">Mark as Refunded</option>
              </select>
              <button
                onClick={handleBulkUpdatePayment}
                disabled={selectedOrders.size === 0 || updating === 'bulk'}
                className="bg-[#C8201A] text-white hover:bg-[#A01612] font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Apply to Selected
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`bg-white border ${selectedOrders.has(order.id) ? 'border-[#C8201A] shadow-md ring-1 ring-[#C8201A]' : 'border-[#E8D8C8] shadow-sm'} rounded-2xl overflow-hidden transition-all`}>
              {/* Order Header */}
              <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={(e) => toggleSelection(order.id, e)} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors">
                    {selectedOrders.has(order.id) ? (
                      <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                    ) : (
                      <Square className="w-6 h-6 text-[#AAAAAA]" />
                    )}
                  </button>
                  <div className="bg-[#1A1A1A] text-white font-mono text-[16px] font-700 px-3 py-1.5 rounded-lg shadow-inner">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-barlow text-[16px] font-700 text-[#1A1A1A]">
                      {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `#${order.id.slice(0, 8).toUpperCase()}` : order.user?.name)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[#555555] font-inter text-[13px] mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {order.customerPhone || order.user?.phone || 'N/A'}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {order.deliveryAddress || 'Pickup'}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
                        ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
                          'bg-[#E8D8C8] text-[#555555]'}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
                    ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
                      'bg-[#E8D8C8] text-[#555555]'}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                  <div className="text-right">
                    <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888] mb-0.5">Total</p>
                    <p className="font-bebas text-[28px] text-[#C8201A] leading-none">${Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <div className="w-px h-8 bg-[#E8D8C8] mx-1"></div>
                  
                  <button 
                    onClick={(e) => handleDeleteOrder(order.id, e)}
                    disabled={updating === order.id}
                    title="Delete Order"
                    className="p-2 text-[#888888] hover:bg-red-50 hover:text-[#C8201A] rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="md:col-span-2 space-y-3">
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#C8201A] mb-2 border-b border-[#E8D8C8] pb-2">
                    Order Items ({order.orderItems.length})
                  </p>
                  <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="flex gap-3 text-[14px]">
                        <span className="font-barlow font-700 text-[#1A1A1A] w-6 flex-shrink-0 text-right">{item.quantity}x</span>
                        <div className="flex-1 font-inter">
                          <p className="font-medium text-[#1A1A1A]">
                            {item.product?.name || item.deal?.title || 'Unknown Item'} {item.size ? `(${item.size})` : ''}
                          </p>

                          {/* COMBO DEAL ITEMS DISPLAY */}
                          {item.selectedDealItems && item.selectedDealItems.length > 0 && (
                            <div className="mt-1 space-y-0.5 border-l-2 border-[#E8D8C8] pl-2 ml-1">
                              {item.selectedDealItems.map((sel: any, selIdx: number) => (
                                <p key={selIdx} className={`text-[12px] leading-snug ${sel.type === 'fixed' ? 'text-[#888888]' : 'text-[#555555]'}`}>
                                  • {sel.quantity || 1}x {sel.name} {sel.size ? `(${sel.size})` : ''} {sel.type === 'fixed' && <span className="italic">(Included)</span>}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* CUSTOMIZATIONS */}
                          {item.removedToppings?.length > 0 && <p className="text-[12px] text-[#C8201A] italic mt-0.5">No {item.removedToppings.join(', ')}</p>}
                          {item.addedExtras?.length > 0 && <p className="text-[12px] text-[#D4952A] mt-0.5">+ {item.addedExtras.map((e:any)=>e.name).join(', ')}</p>}
                        </div>
                        <span className="font-barlow font-700">${Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Controls */}
                <div className="space-y-5 bg-[#FDFAF6] rounded-xl p-4 border border-[#E8D8C8]">
                   <div>
                    <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Delivery Details</p>
                    <p className="font-inter text-[13px] text-[#1A1A1A] flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0 mt-0.5" />
                      {order.payments?.[0]?.provider === 'Stripe' ? 'Online Order' : 'Cash Order'}<br/>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Order Progress</p>
                    <select
                      disabled={updating === order.id}
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="w-full bg-white border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] disabled:opacity-50 transition-colors"
                    >
                      <option value="Placed">Placed (New)</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Delivered">Delivered / Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Payment Status</p>
                    <select
                      disabled={updating === order.id}
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdateStatus(order.id, order.status, e.target.value)}
                      className="w-full bg-white border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] disabled:opacity-50 transition-colors"
                    >
                      <option value="Pending">Pending (COD/Unpaid)</option>
                      <option value="Paid">Paid Online</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && !loading && (
            <div className="bg-white border-2 border-dashed border-[#E8D8C8] rounded-3xl p-12 text-center text-[#888888]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-bebas text-[28px] text-[#1A1A1A] tracking-wider leading-none mb-2">No matching orders</h3>
              <p className="font-inter text-[15px]">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* Printable Area - Hidden on screen, shown when printing */}
      <div className="hidden print:block font-sans text-black w-full max-w-full">
        {printOrders.map((order, idx) => {
          const customerCode = order.id.slice(0, 5).toUpperCase();
          const isDelivery = order.deliveryAddress && order.deliveryAddress.trim().toLowerCase() !== 'pickup';
          
          const foodSubtotal = order.orderItems.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);

          return (
            <div key={order.id} className={`w-[320px] mx-auto bg-white p-4 ${idx > 0 ? 'mt-12 [page-break-before:always]' : ''}`}>
              <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
                <h1 className="text-[20px] font-extrabold tracking-tight">Brent Street Pizza</h1>
                <span className="text-[18px] font-normal tracking-wide">{isDelivery ? 'DELIVERY' : 'PICKUP'}</span>
              </div>

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

              <div className="space-y-4 text-[15px] font-semibold border-b-2 border-black pb-4">
                {order.orderItems.map((item: any, i: number) => {
                  return (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className="mr-2 flex-1">{item.quantity} x {item.product?.name || item.deal?.title || 'Unknown Item'} {item.size ? `(${item.size})` : ''}</span>
                        <span>${Number(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      {/* Choices / Modifications */}
                      {((item.removedToppings && item.removedToppings.length > 0) || 
                        (item.addedExtras && item.addedExtras.length > 0) || 
                        (item.selectedDealItems && item.selectedDealItems.length > 0)) && (
                        <div className="ml-4 mt-1 space-y-1 text-[13px] font-normal">
                          
                          {/* COMBO DEAL ITEMS PRINT */}
                          {item.selectedDealItems && item.selectedDealItems.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Combo Items</div>
                              {item.selectedDealItems.map((sel: any, selIdx: number) => (
                                <div key={selIdx} className={`flex justify-between items-center ${sel.type === 'fixed' ? 'text-gray-500' : ''}`}>
                                  <span>- {sel.quantity || 1}x {sel.name} {sel.size ? `(${sel.size})` : ''} {sel.type === 'fixed' && '(Included)'}</span>
                                </div>
                              ))}
                            </>
                          )}

                          {item.removedToppings && item.removedToppings.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Removed Toppings</div>
                              <div className="flex justify-between items-center">
                                <span>- No {item.removedToppings.join(', ')}</span>
                                <span>$0.00</span>
                              </div>
                            </>
                          )}
                          
                          {item.addedExtras && item.addedExtras.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Add Extras</div>
                              {item.addedExtras.map((ex: any, exIdx: number) => (
                                <div key={exIdx} className="flex justify-between items-center">
                                  <span>- + {ex.name}</span>
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
