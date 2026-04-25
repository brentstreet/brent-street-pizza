// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { API_URL } from '../config/api';
// import { useCart } from '../context/CartContext';
// import {
//   MapPin, CreditCard, Banknote, ChevronRight, ShieldCheck,
//   ArrowLeft, Bike, Store, Trash2, CheckCircle2, Clock, Package,
//   FileText, MessageSquare
// } from 'lucide-react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import StripePaymentForm from '../components/StripePaymentForm';
// import toast, { Toaster } from 'react-hot-toast';

// const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
// if (!STRIPE_KEY) {
//   console.warn('VITE_STRIPE_PUBLISHABLE_KEY is missing from .env');
// }
// const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

// type Step = 'address' | 'payment' | 'success';

// export default function Checkout() {
//   const navigate = useNavigate();
//   const { cartItems, cartTotalPrice, clearCart, token, orderType, setOrderType } = useCart();
//   const [step, setStep] = useState<Step>('address');
//   const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [orderId, setOrderId] = useState('');
//   const [clientSecret, setClientSecret] = useState('');
//   const [finalTotal, setFinalTotal] = useState(0);
//   const [address, setAddress] = useState({
//     name: '',
//     phone: '',
//     street: '',
//     suburb: '',
//     state: '',
//     postcode: '',
//     notes: '',
//   });

//   // If cart is empty, redirect to menu
//   useEffect(() => {
//     if (cartItems.length === 0 && step !== 'success') {
//       navigate('/menu');
//     }
//   }, [cartItems, navigate, step]);

//   const deliveryFee = orderType === 'delivery' ? 5.00 : 0;
//   const platformFee = orderType === 'delivery' ? 0.50 : 0.50;
//   const subtotal = cartTotalPrice;
//   const total = subtotal + platformFee + deliveryFee;

//   const handleAddressSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setStep('payment');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handlePlaceOrder = async () => {
//     setIsProcessing(true);
//     if (!token) {
//       toast.error('Authentication error. Please refresh the page and try again.', { duration: 4000 });
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       // ─── Step 1: Validate prices against current DB prices ───────────────
//       const freshRes = await fetch(`${API_URL}/api/catalog/products`);
//       if (freshRes.ok) {
//         const freshData = await freshRes.json();
//         const freshProducts: any[] = freshData.products || [];

//         const mismatchedItems: string[] = [];
        
//         for (const cartItem of cartItems) {
//           const dbProduct = freshProducts.find(
//             (p: any) => p.id === (cartItem.menuItemId || cartItem.id)
//           );
          
//           if (dbProduct) {
//             // FIX: Skip price validation for Custom Ice Cream since the price is dynamically built
//             if (dbProduct.name === 'Custom Ice Cream' || dbProduct.id === 'ice-cream-custom') {
//               continue;
//             }

//             let expectedPrice = Number(dbProduct.price);

//             if (cartItem.size && dbProduct.sizes && Array.isArray(dbProduct.sizes)) {
//               const matchingSize = dbProduct.sizes.find((s: any) => s.name === cartItem.size);
//               if (matchingSize) {
//                 expectedPrice = Number(matchingSize.price);
//               }
//             }

//             if (cartItem.addedExtras && Array.isArray(cartItem.addedExtras)) {
//               for (const extra of cartItem.addedExtras) {
//                 expectedPrice += Number(extra.price || 0);
//               }
//             }

//             const cartPrice = Number(cartItem.price);
            
//             if (Math.abs(expectedPrice - cartPrice) > 0.001) {
//               mismatchedItems.push(
//                 `• ${cartItem.name} ${cartItem.size ? `(${cartItem.size})` : ''}: was $${cartPrice.toFixed(2)}, now $${expectedPrice.toFixed(2)}`
//               );
//             }
//           }
//         }

//         if (mismatchedItems.length > 0) {
//           toast.error(
//             <div className="flex flex-col gap-2">
//               <strong>Prices Updated!</strong>
//               <p className="text-sm">Please go back and update your cart. The following prices changed:</p>
//               <ul className="text-xs space-y-1">
//                 {mismatchedItems.map((msg, i) => <li key={i}>{msg}</li>)}
//               </ul>
//             </div>, 
//             { duration: 6000 }
//           );
//           setIsProcessing(false);
//           return;
//         }
//       }
//       // ─────────────────────────────────────────────────────────────────────

//       const res = await fetch(`${API_URL}/api/orders`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           totalAmount: total.toFixed(2),
//           paymentMethod,
//           deliveryAddress: orderType === 'delivery' ? `${address.street}, ${address.suburb} ${address.state} ${address.postcode}` : 'Pickup',
//           customerName: address.name,
//           customerPhone: address.phone,
//           cartItems: cartItems.map(item => ({
//             productId: item.menuItemId || item.id,
//             quantity: item.quantity,
//             price: Number(item.price),
//             size: item.size || null,
//             removedToppings: item.removedToppings || [],
//             addedExtras: item.addedExtras || [],
//           })),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || 'Failed to place order');

//       setOrderId(data.order.id);

//       if (paymentMethod === 'COD') {
//         setFinalTotal(total);
//         setStep('success');
//         clearCart();
//         return;
//       }

//       if (paymentMethod === 'ONLINE') {
//         setClientSecret(data.clientSecret);
//         setIsProcessing(false);
//         return;
//       }

//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.message || 'Something went wrong. Please try again.', { duration: 5000 });
//       setIsProcessing(false);
//     }
//   };

//   const generateWhatsAppMessage = () => {
//     const itemsList = cartItems.map((item: any) => {
//       let details = `*${item.quantity}x ${item.name}*`;
//       if (item.size) details += ` (${item.size})`;
//       if (item.removedToppings?.length) details += `\n   - No: ${item.removedToppings.join(', ')}`;
//       if (item.addedExtras?.length) details += `\n   - Extras: ${item.addedExtras.map((e: any) => e.name).join(', ')}`;
//       details += ` - $${(Number(item.price) * item.quantity).toFixed(2)}`;
//       return details;
//     }).join('\n');

//     const message = `*🍕 NEW ORDER RECEIVED!* \n` +
//       `--------------------------\n` +
//       `*Order ID:* #${orderId.slice(0, 8).toUpperCase()}\n` +
//       `*Customer:* ${address.name}\n` +
//       `*Phone:* ${address.phone}\n` +
//       `*Type:* ${orderType.toUpperCase()}\n` +
//       `*Address:* ${orderType === 'delivery' ? `${address.street}, ${address.suburb}` : 'Pickup'}\n` +
//       `--------------------------\n` +
//       `*ITEMS:*\n${itemsList}\n` +
//       `--------------------------\n` +
//       `*Subtotal:* $${subtotal.toFixed(2)}\n` +
//       `*Platform Fee:* $${platformFee.toFixed(2)}\n` +
//       `*Delivery Fee:* $${deliveryFee.toFixed(2)}\n` +
//       `*TOTAL:* $${total.toFixed(2)}\n` +
//       `--------------------------\n` +
//       `*Payment:* ${paymentMethod === 'ONLINE' ? '✅ PAID ONLINE' : '💵 CASH ON DELIVERY'}\n` +
//       `*Notes:* ${address.notes || 'None'}`;

//     return encodeURIComponent(message);
//   };

//   const handleWhatsAppNotify = () => {
//     const ownerNumber = '61362724004';
//     window.open(`https://wa.me/${ownerNumber}?text=${generateWhatsAppMessage()}`, '_blank');
//   };

//   if (step === 'success') {
//     return (
//       <div className="min-h-screen bg-[#FDF8F2] pt-32 pb-20 px-4 md:px-8">
//         <Toaster position="top-center" />
//         <div className="max-w-[600px] mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#E8D8C8] text-center animate-in zoom-in-95 duration-500">
//           <div className="w-24 h-24 bg-[#C8201A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle2 className="w-12 h-12 text-[#C8201A]" />
//           </div>
//           <h1 className="font-bebas text-[48px] text-[#1A1A1A] leading-none mb-2 tracking-wide">
//             Order Confirmed!
//           </h1>
//           <p className="font-inter text-[16px] text-[#555555] mb-8">
//             Thank you for your order. We've received it and will start preparing it right away.
//           </p>

//           <div className="bg-[#FDFAF6] border border-[#E8D8C8] rounded-2xl p-6 text-left mb-8">
//             <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] mb-4">Order Details</p>
//             <div className="space-y-4">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <Package className="w-5 h-5 text-[#C8201A]" />
//                   <div>
//                     <p className="font-barlow font-700 text-[13px] uppercase tracking-wide text-[#1A1A1A]">Order Number</p>
//                     <p className="font-inter text-[14px] text-[#555555]">#{orderId.slice(0, 8).toUpperCase()}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-barlow font-700 text-[13px] uppercase tracking-wide text-[#1A1A1A]">Total Amount</p>
//                   <p className="font-bebas text-[20px] text-[#C8201A] leading-none">${finalTotal.toFixed(2)}</p>
//                 </div>
//               </div>
//               <div className="h-px bg-[#E8D8C8]" />
//               <div className="flex items-center gap-3">
//                 <Clock className="w-5 h-5 text-[#D4952A]" />
//                 <div>
//                   <p className="font-barlow font-700 text-[13px] uppercase tracking-wide text-[#1A1A1A]">Estimated Time</p>
//                   <p className="font-inter text-[14px] text-[#555555]">25 - 35 minutes</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <button
//               onClick={() => navigate('/menu')}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-8 py-4 rounded-xl transition-all"
//             >
//               <FileText className="w-4 h-4" />
//               Back to Menu
//             </button>
//             <button
//               onClick={handleWhatsAppNotify}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5C] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(37,211,102,0.3)]"
//             >
//               <MessageSquare className="w-4 h-4" />
//               Get Updates via WhatsApp
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FDF8F2] pt-24 pb-20 px-4 md:px-8">
//       <Toaster position="top-center" />
//       <div className="max-w-[1200px] mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <button
//           onClick={() => step === 'payment' ? setStep('address') : navigate('/menu')}
//           className="flex items-center gap-2 text-[#555555] hover:text-[#C8201A] font-barlow font-700 text-[13px] uppercase tracking-wider transition-colors w-fit"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           {step === 'payment' ? 'Back to Details' : 'Back to Menu'}
//         </button>
//         <h1 className="font-bebas text-[36px] md:text-[48px] text-[#1A1A1A] tracking-wider leading-none">
//           Secure Checkout
//         </h1>
//       </div>

//       <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12 items-start">
//         {/* ── LEFT PANEL: Form / Payment ── */}
//         <div className="space-y-6">
//           {/* STEP 1: Address */}
//           {step === 'address' && (
//             <>
//               {/* Order Type Toggle */}
//               <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5">
//                 <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-3">Order Type</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   {(['delivery', 'pickup'] as const).map(type => (
//                     <button
//                       key={type}
//                       onClick={() => setOrderType(type)}
//                       className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${orderType === type ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
//                     >
//                       {type === 'delivery' ? <Bike className="w-5 h-5 text-[#C8201A]" /> : <Store className="w-5 h-5 text-[#C8201A]" />}
//                       <div className="text-left">
//                         <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A] capitalize">{type}</p>
//                         <p className="font-inter text-[11px] text-[#555555]">
//                           {type === 'delivery' ? '25–35 min · $4.99' : '15–20 min · Free'}
//                         </p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Address Form */}
//               <form onSubmit={handleAddressSubmit} className="bg-white border border-[#E8D8C8] rounded-2xl p-5 space-y-4">
//                 <div className="flex items-center gap-2 mb-1">
//                   <MapPin className="w-4 h-4 text-[#C8201A]" />
//                   <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555]">
//                     {orderType === 'delivery' ? 'Delivery Address' : 'Your Details'}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Full Name*</label>
//                     <input
//                       required
//                       type="text"
//                       value={address.name}
//                       onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
//                       placeholder="John Smith"
//                       className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Phone*</label>
//                     <input
//                       required
//                       type="tel"
//                       value={address.phone}
//                       onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
//                       placeholder="04xx xxx xxx"
//                       className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
//                     />
//                   </div>
//                 </div>

//                 {orderType === 'delivery' && (
//                   <>
//                     <div>
//                       <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Street Address*</label>
//                       <input
//                         required
//                         type="text"
//                         value={address.street}
//                         onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
//                         placeholder="123 Collins Street"
//                         className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
//                       />
//                     </div>
//                     <div className="grid grid-cols-3 gap-3">
//                       <div className="col-span-1">
//                         <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Suburb*</label>
//                         <input
//                           required
//                           type="text"
//                           value={address.suburb}
//                           onChange={e => setAddress(a => ({ ...a, suburb: e.target.value }))}
//                           placeholder="Melbourne"
//                           className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">State</label>
//                         <select
//                           value={address.state}
//                           onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
//                           className="w-full border border-[#E8D8C8] rounded-xl px-3 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
//                         >
//                           <option value="VIC">VIC</option>
//                           <option value="NSW">NSW</option>
//                           <option value="QLD">QLD</option>
//                           <option value="WA">WA</option>
//                           <option value="SA">SA</option>
//                           <option value="TAS">TAS</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Postcode*</label>
//                         <input
//                           required
//                           type="text"
//                           maxLength={4}
//                           value={address.postcode}
//                           onChange={e => setAddress(a => ({ ...a, postcode: e.target.value }))}
//                           placeholder="3000"
//                           className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {orderType === 'delivery' && (
//                   <div>
//                     <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">
//                       Delivery Notes (optional)
//                     </label>
//                     <textarea
//                       value={address.notes}
//                       onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))}
//                       placeholder="Leave at door, ring doorbell, etc."
//                       rows={2}
//                       className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6] resize-none"
//                     />
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)] hover:shadow-[0_12px_32px_rgba(200,32,26,0.5)]"
//                 >
//                   <span>Continue to Payment</span>
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </form>
//             </>
//           )}

//           {/* STEP 2: Payment */}
//           {step === 'payment' && (
//             <div className="space-y-5">
//               {/* Address summary */}
//               <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5 flex items-start gap-3">
//                 <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-0.5">
//                     {orderType === 'delivery' ? 'Delivering to' : 'Pickup · Self Collection'}
//                   </p>
//                   <p className="font-inter text-[14px] text-[#1A1A1A]">
//                     {address.name} · {address.phone}
//                     {orderType === 'delivery' && <><br />{address.street}, {address.suburb} {address.state} {address.postcode}</>}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setStep('address')}
//                   className="text-[#C8201A] font-barlow text-[11px] font-700 uppercase tracking-wider hover:underline flex-shrink-0"
//                 >
//                   Edit
//                 </button>
//               </div>

//               {/* Payment Method */}
//               <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5">
//                 <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-4">Payment Method</p>
//                 <div className="space-y-3">
//                   <button
//                     onClick={() => setPaymentMethod('ONLINE')}
//                     className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'ONLINE' ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
//                   >
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'ONLINE' ? 'border-[#C8201A]' : 'border-[#E8D8C8]'}`}>
//                       {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
//                     </div>
//                     <CreditCard className="w-5 h-5 text-[#C8201A]" />
//                     <div className="text-left flex-1">
//                       <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A]">Pay Online</p>
//                       <p className="font-inter text-[11px] text-[#555555]">Secure Credit / Debit Card payment via Stripe</p>
//                     </div>
//                     <div className="flex gap-1.5 flex-shrink-0">
//                       <div className="bg-[#1A1A1A] text-white font-barlow font-700 text-[9px] px-2 py-0.5 rounded uppercase">Visa</div>
//                       <div className="bg-[#EB001B]/10 text-[#EB001B] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#EB001B]/20 uppercase">MC</div>
//                       <div className="bg-[#0070BA]/10 text-[#0070BA] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#0070BA]/20 uppercase">Amex</div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => setPaymentMethod('COD')}
//                     className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'COD' ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
//                   >
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'COD' ? 'border-[#C8201A]' : 'border-[#E8D8C8]'}`}>
//                       {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
//                     </div>
//                     <Banknote className="w-5 h-5 text-[#C8201A]" />
//                     <div className="text-left">
//                       <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A]">
//                         {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Pickup'}
//                       </p>
//                       <p className="font-inter text-[11px] text-[#555555]">Pay when your order arrives</p>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Trust badges */}
//               <div className="flex items-center gap-2 px-1 text-[#555555]">
//                 <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//                 <p className="font-inter text-[12px]">
//                   Payments secured by <span className="font-semibold text-[#1A1A1A]">Stripe</span>. Your info is never stored.
//                 </p>
//               </div>

//               {/* Online Payment Form or Place Order button */}
//               {paymentMethod === 'ONLINE' && clientSecret ? (
//                 <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
//                   <p className="font-barlow text-[13px] font-800 uppercase tracking-widest text-[#1A1A1A] mb-6 flex items-center gap-2">
//                     <CreditCard className="w-4 h-4 text-[#C8201A]" />
//                     Complete Your Secure Payment
//                   </p>
//                   {stripePromise ? (
//                     <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
//                       <StripePaymentForm 
//                         orderId={orderId}
//                         clientSecret={clientSecret} 
//                         total={total}
//                         onSuccess={async () => {
//                           setFinalTotal(total);
//                           await clearCart();
//                           setStep('success');
//                         }}
//                         onCancel={() => setClientSecret('')}
//                       />
//                     </Elements>
//                   ) : (
//                     <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[13px]">
//                       Stripe configuration missing. Please ensure VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file.
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={handlePlaceOrder}
//                   disabled={isProcessing}
//                   className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] disabled:opacity-70 disabled:cursor-wait text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-5 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)]"
//                 >
//                   <span>{isProcessing ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Initialize Payment' : 'Place Order'}</span>
//                   <span className="font-bebas text-[22px] leading-none">${total.toFixed(2)}</span>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── RIGHT PANEL: Order Summary ── */}
//         <div className="lg:sticky lg:top-[72px] self-start">
//           <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden">
//             <div className="px-5 py-4 border-b border-[#E8D8C8] flex items-center justify-between">
//               <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-[#555555]">Your Order</p>
//               <button onClick={() => navigate('/menu')} className="text-[#C8201A] hover:text-[#9E1510] transition-colors">
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="divide-y divide-[#F0E8DC]">
//               {cartItems.map((item: any) => (
//                 <div key={item.id} className="px-5 py-3.5 flex items-start gap-3">
//                   <span className="w-5 h-5 rounded-full bg-[#C8201A] text-white font-barlow font-700 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
//                     {item.quantity}
//                   </span>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-barlow text-[13px] font-700 text-[#1A1A1A] truncate">{item.name}</p>
//                     {item.size && <p className="font-inter text-[11px] text-[#555555]">{item.size}</p>}
//                     {item.removedToppings && item.removedToppings.length > 0 && (
//                       <p className="font-inter text-[10px] text-[#C8201A]">No {item.removedToppings.join(', ')}</p>
//                     )}
//                     {item.addedExtras && item.addedExtras.length > 0 && (
//                       <p className="font-inter text-[10px] text-[#D4952A]">+ {item.addedExtras.map((e: any) => e.name).join(', ')}</p>
//                     )}
//                   </div>
//                   <span className="font-barlow font-700 text-[13px] text-[#1A1A1A] flex-shrink-0">
//                     ${(Number(item.price) * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Price breakdown */}
//             <div className="px-5 pt-4 pb-5 space-y-2.5 border-t border-[#E8D8C8]">
//               <div className="flex justify-between font-inter text-[13px] text-[#555555]">
//                 <span>Subtotal</span>
//                 <span>${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between font-inter text-[13px] text-[#555555]">
//                 <span>Platform Fee</span>
//                 <span>${platformFee.toFixed(2)}</span>
//               </div>
//               {orderType === 'delivery' && (
//                 <div className="flex justify-between font-inter text-[13px] text-[#555555]">
//                   <span>Delivery Fee</span>
//                   <span>${deliveryFee.toFixed(2)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bebas text-[22px] text-[#1A1A1A] pt-2 border-t border-[#E8D8C8]">
//                 <span>Total</span>
//                 <span className="text-[#C8201A]">${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { useCart } from '../context/CartContext';
import {
  MapPin, CreditCard, Banknote, ChevronRight, ShieldCheck,
  ArrowLeft, Bike, Store, Trash2, CheckCircle2, Clock, Package,
  FileText, MessageSquare
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';
import toast, { Toaster } from 'react-hot-toast';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!STRIPE_KEY) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is missing from .env');
}
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

type Step = 'address' | 'payment' | 'success';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotalPrice, clearCart, token, orderType, setOrderType } = useCart();
  const [step, setStep] = useState<Step>('address');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  
  // FIX: Store the pre-baked WhatsApp URL right before clearing the cart
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    notes: '',
  });

  // If cart is empty, redirect to menu
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'success') {
      navigate('/menu');
    }
  }, [cartItems, navigate, step]);

  const deliveryFee = orderType === 'delivery' ? 5.00 : 0;
  const platformFee = orderType === 'delivery' ? 0.50 : 0.50;
  const subtotal = cartTotalPrice;
  const total = subtotal + platformFee + deliveryFee;

  const buildWhatsAppUrl = (generatedOrderId: string) => {
    const itemsList = cartItems.map((item: any) => {
      let details = `*${item.quantity}x ${item.name}*`;
      if (item.size) details += ` (${item.size})`;
      if (item.removedToppings?.length) details += `\n   - No: ${item.removedToppings.join(', ')}`;
      if (item.addedExtras?.length) details += `\n   - Extras: ${item.addedExtras.map((e: any) => e.name).join(', ')}`;
      details += ` - $${(Number(item.price) * item.quantity).toFixed(2)}`;
      return details;
    }).join('\n');

    const message = `*🍕 NEW ORDER RECEIVED!*\n` +
      `--------------------------\n` +
      `*Order ID:* #${generatedOrderId.slice(0, 8).toUpperCase()}\n` +
      `*Customer:* ${address.name}\n` +
      `*Phone:* ${address.phone}\n` +
      `*Type:* ${orderType.toUpperCase()}\n` +
      `*Address:* ${orderType === 'delivery' ? `${address.street}, ${address.suburb}` : 'Pickup'}\n` +
      `--------------------------\n` +
      `*ITEMS:*\n${itemsList}\n` +
      `--------------------------\n` +
      `*Subtotal:* $${subtotal.toFixed(2)}\n` +
      `*Platform Fee:* $${platformFee.toFixed(2)}\n` +
      `*Delivery Fee:* $${deliveryFee.toFixed(2)}\n` +
      `*TOTAL:* $${total.toFixed(2)}\n` +
      `--------------------------\n` +
      `*Payment:* ${paymentMethod === 'ONLINE' ? '✅ PAID ONLINE' : '💵 CASH ON DELIVERY'}\n` +
      `*Notes:* ${address.notes || 'None'}`;

    return `https://wa.me/61362724004?text=${encodeURIComponent(message)}`;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    if (!token) {
      toast.error('Authentication error. Please refresh the page and try again.', { duration: 4000 });
      setIsProcessing(false);
      return;
    }

    try {
      // ─── Step 1: Validate prices against current DB prices ───────────────
      const freshRes = await fetch(`${API_URL}/api/catalog/products`);
      if (freshRes.ok) {
        const freshData = await freshRes.json();
        const freshProducts: any[] = freshData.products || [];

        const mismatchedItems: string[] = [];
        
        for (const cartItem of cartItems) {
          const dbProduct = freshProducts.find(
            (p: any) => p.id === (cartItem.menuItemId || cartItem.id)
          );
          
          if (dbProduct) {
            // FIX: Skip price validation for Custom Ice Cream since the price is dynamically built
            if (dbProduct.name === 'Custom Ice Cream' || dbProduct.id === 'ice-cream-custom') {
              continue;
            }

            let expectedPrice = Number(dbProduct.price);

            if (cartItem.size && dbProduct.sizes && Array.isArray(dbProduct.sizes)) {
              const matchingSize = dbProduct.sizes.find((s: any) => s.name === cartItem.size);
              if (matchingSize) {
                expectedPrice = Number(matchingSize.price);
              }
            }

            if (cartItem.addedExtras && Array.isArray(cartItem.addedExtras)) {
              for (const extra of cartItem.addedExtras) {
                expectedPrice += Number(extra.price || 0);
              }
            }

            const cartPrice = Number(cartItem.price);
            
            if (Math.abs(expectedPrice - cartPrice) > 0.001) {
              mismatchedItems.push(
                `• ${cartItem.name} ${cartItem.size ? `(${cartItem.size})` : ''}: was $${cartPrice.toFixed(2)}, now $${expectedPrice.toFixed(2)}`
              );
            }
          }
        }

        if (mismatchedItems.length > 0) {
          toast.error(
            <div className="flex flex-col gap-2">
              <strong>Prices Updated!</strong>
              <p className="text-sm">Please go back and update your cart. The following prices changed:</p>
              <ul className="text-xs space-y-1">
                {mismatchedItems.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>, 
            { duration: 6000 }
          );
          setIsProcessing(false);
          return;
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: total.toFixed(2),
          paymentMethod,
          deliveryAddress: orderType === 'delivery' ? `${address.street}, ${address.suburb} ${address.state} ${address.postcode}` : 'Pickup',
          customerName: address.name,
          customerPhone: address.phone,
          cartItems: cartItems.map(item => ({
            productId: item.menuItemId || item.id,
            quantity: item.quantity,
            price: Number(item.price),
            size: item.size || null,
            removedToppings: item.removedToppings || [],
            addedExtras: item.addedExtras || [],
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      const newOrderId = data.order.id;
      setOrderId(newOrderId);
      
      // FIX: Pre-generate WhatsApp message while cartItems and subtotals are 100% accurate
      setWhatsappUrl(buildWhatsAppUrl(newOrderId));

      if (paymentMethod === 'COD') {
        setFinalTotal(total);
        setStep('success');
        clearCart();
        return;
      }

      if (paymentMethod === 'ONLINE') {
        setClientSecret(data.clientSecret);
        setIsProcessing(false);
        return;
      }

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong. Please try again.', { duration: 5000 });
      setIsProcessing(false);
    }
  };

  const handleWhatsAppNotify = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#FDF8F2] pt-32 pb-20 px-4 md:px-8">
        <Toaster position="top-center" />
        <div className="max-w-[600px] mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#E8D8C8] text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-[#C8201A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#C8201A]" />
          </div>
          <h1 className="font-bebas text-[48px] text-[#1A1A1A] leading-none mb-2 tracking-wide">
            Order Confirmed!
          </h1>
          <p className="font-inter text-[16px] text-[#555555] mb-8">
            Thank you for your order. We've received it and will start preparing it right away.
          </p>

          <div className="bg-[#FDFAF6] border border-[#E8D8C8] rounded-2xl p-6 text-left mb-8">
            <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] mb-4">Order Details</p>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#C8201A]" />
                  <div>
                    <p className="font-barlow font-700 text-[13px] uppercase tracking-wide text-[#1A1A1A]">Order Number</p>
                    <p className="font-inter text-[14px] text-[#555555]">#{orderId.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-barlow font-700 text-[13px] uppercase tracking-wide text-[#1A1A1A]">Total Amount</p>
                  <p className="font-bebas text-[20px] text-[#C8201A] leading-none">${finalTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="h-px bg-[#E8D8C8]" />
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4952A]" />
                <div>
                  <p className="font-barlow font-700 text-[13px] uppercase tracking-wide text-[#1A1A1A]">Estimated Time</p>
                  <p className="font-inter text-[14px] text-[#555555]">25 - 35 minutes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-8 py-4 rounded-xl transition-all"
            >
              <FileText className="w-4 h-4" />
              Back to Menu
            </button>
            <button
              onClick={handleWhatsAppNotify}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5C] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(37,211,102,0.3)]"
            >
              <MessageSquare className="w-4 h-4" />
              Get Updates via WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F2] pt-24 pb-20 px-4 md:px-8">
      <Toaster position="top-center" />
      <div className="max-w-[1200px] mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => step === 'payment' ? setStep('address') : navigate('/menu')}
          className="flex items-center gap-2 text-[#555555] hover:text-[#C8201A] font-barlow font-700 text-[13px] uppercase tracking-wider transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 'payment' ? 'Back to Details' : 'Back to Menu'}
        </button>
        <h1 className="font-bebas text-[36px] md:text-[48px] text-[#1A1A1A] tracking-wider leading-none">
          Secure Checkout
        </h1>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12 items-start">
        {/* ── LEFT PANEL: Form / Payment ── */}
        <div className="space-y-6">
          {/* STEP 1: Address */}
          {step === 'address' && (
            <>
              {/* Order Type Toggle */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-3">Order Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['delivery', 'pickup'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${orderType === type ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
                    >
                      {type === 'delivery' ? <Bike className="w-5 h-5 text-[#C8201A]" /> : <Store className="w-5 h-5 text-[#C8201A]" />}
                      <div className="text-left">
                        <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A] capitalize">{type}</p>
                        <p className="font-inter text-[11px] text-[#555555]">
                          {type === 'delivery' ? '25–35 min · $4.99' : '15–20 min · Free'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Form */}
              <form onSubmit={handleAddressSubmit} className="bg-white border border-[#E8D8C8] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-[#C8201A]" />
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555]">
                    {orderType === 'delivery' ? 'Delivery Address' : 'Your Details'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Full Name*</label>
                    <input
                      required
                      type="text"
                      value={address.name}
                      onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
                      placeholder="John Smith"
                      className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                    />
                  </div>
                  <div>
                    <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Phone*</label>
                    <input
                      required
                      type="tel"
                      value={address.phone}
                      onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                      placeholder="04xx xxx xxx"
                      className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                    />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <>
                    <div>
                      <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Street Address*</label>
                      <input
                        required
                        type="text"
                        value={address.street}
                        onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                        placeholder="123 Collins Street"
                        className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Suburb*</label>
                        <input
                          required
                          type="text"
                          value={address.suburb}
                          onChange={e => setAddress(a => ({ ...a, suburb: e.target.value }))}
                          placeholder="Melbourne"
                          className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                        />
                      </div>
                      <div>
                        <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">State</label>
                        <select
                          value={address.state}
                          onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                          className="w-full border border-[#E8D8C8] rounded-xl px-3 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                        >
                          <option value="VIC">VIC</option>
                          <option value="NSW">NSW</option>
                          <option value="QLD">QLD</option>
                          <option value="WA">WA</option>
                          <option value="SA">SA</option>
                          <option value="TAS">TAS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">Postcode*</label>
                        <input
                          required
                          type="text"
                          maxLength={4}
                          value={address.postcode}
                          onChange={e => setAddress(a => ({ ...a, postcode: e.target.value }))}
                          placeholder="3000"
                          className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {orderType === 'delivery' && (
                  <div>
                    <label className="block font-barlow text-[10px] font-700 uppercase tracking-wider text-[#555555] mb-1.5">
                      Delivery Notes (optional)
                    </label>
                    <textarea
                      value={address.notes}
                      onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))}
                      placeholder="Leave at door, ring doorbell, etc."
                      rows={2}
                      className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] transition-colors bg-[#FDFAF6] resize-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)] hover:shadow-[0_12px_32px_rgba(200,32,26,0.5)]"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Address summary */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-0.5">
                    {orderType === 'delivery' ? 'Delivering to' : 'Pickup · Self Collection'}
                  </p>
                  <p className="font-inter text-[14px] text-[#1A1A1A]">
                    {address.name} · {address.phone}
                    {orderType === 'delivery' && <><br />{address.street}, {address.suburb} {address.state} {address.postcode}</>}
                  </p>
                </div>
                <button
                  onClick={() => setStep('address')}
                  className="text-[#C8201A] font-barlow text-[11px] font-700 uppercase tracking-wider hover:underline flex-shrink-0"
                >
                  Edit
                </button>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-5">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-4">Payment Method</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'ONLINE' ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'ONLINE' ? 'border-[#C8201A]' : 'border-[#E8D8C8]'}`}>
                      {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
                    </div>
                    <CreditCard className="w-5 h-5 text-[#C8201A]" />
                    <div className="text-left flex-1">
                      <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A]">Pay Online</p>
                      <p className="font-inter text-[11px] text-[#555555]">Secure Credit / Debit Card payment via Stripe</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <div className="bg-[#1A1A1A] text-white font-barlow font-700 text-[9px] px-2 py-0.5 rounded uppercase">Visa</div>
                      <div className="bg-[#EB001B]/10 text-[#EB001B] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#EB001B]/20 uppercase">MC</div>
                      <div className="bg-[#0070BA]/10 text-[#0070BA] font-barlow font-700 text-[9px] px-2 py-0.5 rounded border border-[#0070BA]/20 uppercase">Amex</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'COD' ? 'border-[#C8201A] bg-[#C8201A]/8' : 'border-[#E8D8C8] hover:border-[#E8D8C8]/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'COD' ? 'border-[#C8201A]' : 'border-[#E8D8C8]'}`}>
                      {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#C8201A]" />}
                    </div>
                    <Banknote className="w-5 h-5 text-[#C8201A]" />
                    <div className="text-left">
                      <p className="font-barlow text-[13px] font-700 uppercase tracking-wide text-[#1A1A1A]">
                        {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Pickup'}
                      </p>
                      <p className="font-inter text-[11px] text-[#555555]">Pay when your order arrives</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-2 px-1 text-[#555555]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="font-inter text-[12px]">
                  Payments secured by <span className="font-semibold text-[#1A1A1A]">Stripe</span>. Your info is never stored.
                </p>
              </div>

              {/* Online Payment Form or Place Order button */}
              {paymentMethod === 'ONLINE' && clientSecret ? (
                <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="font-barlow text-[13px] font-800 uppercase tracking-widest text-[#1A1A1A] mb-6 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C8201A]" />
                    Complete Your Secure Payment
                  </p>
                  {stripePromise ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                      <StripePaymentForm 
                        orderId={orderId}
                        clientSecret={clientSecret} 
                        total={total}
                        onSuccess={async () => {
                          setFinalTotal(total);
                          await clearCart();
                          setStep('success');
                        }}
                        onCancel={() => setClientSecret('')}
                      />
                    </Elements>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[13px]">
                      Stripe configuration missing. Please ensure VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file.
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-between bg-[#C8201A] hover:bg-[#9E1510] disabled:opacity-70 disabled:cursor-wait text-white font-barlow font-700 text-[14px] uppercase tracking-wider px-6 py-5 rounded-xl transition-all shadow-[0_8px_24px_rgba(200,32,26,0.35)]"
                >
                  <span>{isProcessing ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Initialize Payment' : 'Place Order'}</span>
                  <span className="font-bebas text-[22px] leading-none">${total.toFixed(2)}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Order Summary ── */}
        <div className="lg:sticky lg:top-[72px] self-start">
          <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8D8C8] flex items-center justify-between">
              <p className="font-barlow text-[12px] font-700 uppercase tracking-wider text-[#555555]">Your Order</p>
              <button onClick={() => navigate('/menu')} className="text-[#C8201A] hover:text-[#9E1510] transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#F0E8DC]">
              {cartItems.map((item: any) => (
                <div key={item.id} className="px-5 py-3.5 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#C8201A] text-white font-barlow font-700 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.quantity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-barlow text-[13px] font-700 text-[#1A1A1A] truncate">{item.name}</p>
                    {item.size && <p className="font-inter text-[11px] text-[#555555]">{item.size}</p>}
                    {item.removedToppings && item.removedToppings.length > 0 && (
                      <p className="font-inter text-[10px] text-[#C8201A]">No {item.removedToppings.join(', ')}</p>
                    )}
                    {item.addedExtras && item.addedExtras.length > 0 && (
                      <p className="font-inter text-[10px] text-[#D4952A]">+ {item.addedExtras.map((e: any) => e.name).join(', ')}</p>
                    )}
                  </div>
                  <span className="font-barlow font-700 text-[13px] text-[#1A1A1A] flex-shrink-0">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="px-5 pt-4 pb-5 space-y-2.5 border-t border-[#E8D8C8]">
              <div className="flex justify-between font-inter text-[13px] text-[#555555]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-inter text-[13px] text-[#555555]">
                <span>Platform Fee</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between font-inter text-[13px] text-[#555555]">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bebas text-[22px] text-[#1A1A1A] pt-2 border-t border-[#E8D8C8]">
                <span>Total</span>
                <span className="text-[#C8201A]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
