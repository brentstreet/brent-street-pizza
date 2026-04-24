// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { type MenuItem, type CartItem } from '../types/menu';
// import { API_URL } from '../config/api';

// interface CartContextType {
//   cartItems: CartItem[];
//   token: string | null;
//   addToCart: (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => void;
//   incrementItem: (id: string) => void;
//   decrementItem: (id: string) => void;
//   clearCart: () => void;
//   cartTotalItems: number;
//   cartTotalPrice: number;
//   isCartOpen: boolean;
//   setIsCartOpen: (isOpen: boolean) => void;
//   orderType: 'pickup' | 'delivery';
//   setOrderType: (t: 'pickup' | 'delivery') => void;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const createGuestUser = async (): Promise<string | null> => {
//   try {
//     const rand = Math.floor(Math.random() * 10000000);
//     const res = await fetch(`${API_URL}/api/auth/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: `guest${rand}@brentstreet.guest`,
//         password: 'guestpassword123',
//         name: `Guest ${rand}`
//       })
//     });
//     const data = await res.json();
//     return data.token || null;
//   } catch {
//     return null;
//   }
// };

// // Helper function to ensure images always have the correct full URL
// const formatImageUrl = (imagePath?: string): string => {
//   if (!imagePath) return '';
//   if (imagePath.startsWith('http')) return imagePath;
//   return `${API_URL}${imagePath}`;
// };

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [token, setToken] = useState<string | null>(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);
  
//   // Initialize orderType from localStorage to persist across page reloads
//   const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('pizza_order_type');
//       if (saved === 'delivery' || saved === 'pickup') {
//         return saved as 'pickup' | 'delivery';
//       }
//     }
//     return 'pickup'; // default
//   });

//   // Save orderType to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('pizza_order_type', orderType);
//   }, [orderType]);

//   // 1. On mount: validate existing token, or create guest
//   useEffect(() => {
//     const initAuth = async () => {
//       const stored = localStorage.getItem('pizza_token');

//       if (stored) {
//         // Validate the token by hitting a protected endpoint
//         const res = await fetch(`${API_URL}/api/cart`, {
//           headers: { 'Authorization': `Bearer ${stored}` }
//         });
//         if (res.ok) {
//           // Token is valid — use it
//           const data = await res.json();
//           setToken(stored);
//           if (data.cartItems?.length) {
//             // Ensure DB items have full image URLs on load
//             const formattedItems = data.cartItems.map((ci: any) => ({
//               ...ci,
//               image: formatImageUrl(ci.image)
//             }));
//             setCartItems(formattedItems);
//           }
//           return;
//         } else {
//           // Token invalid/expired — clear it
//           localStorage.removeItem('pizza_token');
//         }
//       }

//       // No valid token — create a new guest
//       const newToken = await createGuestUser();
//       if (newToken) {
//         localStorage.setItem('pizza_token', newToken);
//         setToken(newToken);
//       }
//     };

//     initAuth();
//   }, []);

//   const authHeaders = (t?: string | null) => ({
//     'Authorization': `Bearer ${t ?? token}`,
//     'Content-Type': 'application/json'
//   });

//   // 3. addToCart — always updates local state immediately, syncs to DB in background
//   const addToCart = async (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => {
    
//     // Ensure we are using the final calculated unit price
//     const unitPrice = Number(customizations?.price || item.price || 0);
//     const effectiveSize = customizations?.size ?? (item.sizes?.length ? item.sizes[0].name : undefined);

//     console.log(`[Cart] Adding ${item.name}:`, {
//       originalPrice: item.price,
//       customizedUnitPrice: unitPrice,
//       quantity: customizations?.quantity || 1,
//       total: unitPrice * (customizations?.quantity || 1)
//     });

//     const localItem: CartItem = {
//       id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
//       menuItemId: item.id,
//       name: item.name,
//       price: unitPrice,
//       quantity: customizations?.quantity || 1,
//       // Fix: Empty string fallback for TypeScript compatibility
//       image: formatImageUrl(item.image),
//       size: effectiveSize,
//       removedToppings: customizations?.removedToppings || [],
//       addedExtras: customizations?.addedExtras || [],
//     };

//     // Always update local state immediately
//     setCartItems(prev => [...prev, localItem]);

//     // Background DB sync — best effort
//     if (token) {
//       try {
//         const payload = {
//           menuItemId: item.id,
//           quantity: localItem.quantity,
//           price: localItem.price,
//           size: localItem.size || null,
//           removedToppings: localItem.removedToppings || [],
//           addedExtras: localItem.addedExtras || []
//         };
        
//         console.log('[Cart] Syncing to DB:', payload);

//         const res = await fetch(`${API_URL}/api/cart`, {
//           method: 'POST',
//           headers: authHeaders(),
//           body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//           const cartRes = await fetch(`${API_URL}/api/cart`, { headers: authHeaders() });
//           const data = await cartRes.json();
//           if (data.cartItems) {
//             // Ensure synced items also get formatted image URLs
//             const formattedItems = data.cartItems.map((ci: any) => ({
//               ...ci,
//               image: formatImageUrl(ci.image)
//             }));
//             setCartItems(formattedItems);
//           }
//         }
//       } catch (err) {
//         console.error('Cart sync failed (item still in local state):', err);
//       }
//     }
//   };

//   const incrementItem = async (id: string) => {
//     const item = cartItems.find(i => i.id === id);
//     if (!item) return;
//     setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
//     if (token && !id.startsWith('local_')) {
//       fetch(`${API_URL}/api/cart/${id}`, {
//         method: 'PUT', headers: authHeaders(),
//         body: JSON.stringify({ quantity: item.quantity + 1 })
//       }).catch(console.error);
//     }
//   };

//   const decrementItem = async (id: string) => {
//     const item = cartItems.find(i => i.id === id);
//     if (!item) return;
//     if (item.quantity === 1) {
//       setCartItems(prev => prev.filter(i => i.id !== id));
//       if (token && !id.startsWith('local_')) {
//         fetch(`${API_URL}/api/cart/${id}`, { method: 'DELETE', headers: authHeaders() }).catch(console.error);
//       }
//     } else {
//       setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
//       if (token && !id.startsWith('local_')) {
//         fetch(`${API_URL}/api/cart/${id}`, {
//           method: 'PUT', headers: authHeaders(),
//           body: JSON.stringify({ quantity: item.quantity - 1 })
//         }).catch(console.error);
//       }
//     }
//   };

//   const clearCart = async () => {
//     setCartItems([]);
//     if (token) {
//       fetch(`${API_URL}/api/cart`, { method: 'DELETE', headers: authHeaders() }).catch(console.error);
//     }
//   };

//   const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
//   const cartTotalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       token,
//       addToCart,
//       incrementItem,
//       decrementItem,
//       clearCart,
//       cartTotalItems,
//       cartTotalPrice,
//       isCartOpen,
//       setIsCartOpen,
//       orderType,
//       setOrderType
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import { type MenuItem, type CartItem } from '../types/menu';
import { API_URL } from '../config/api';

interface CartContextType {
  cartItems: CartItem[];
  token: string | null;
  addToCart: (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartTotalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  orderType: 'pickup' | 'delivery';
  setOrderType: (t: 'pickup' | 'delivery') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const createGuestUser = async (): Promise<string | null> => {
  try {
    const rand = Math.floor(Math.random() * 10000000);
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `guest${rand}@brentstreet.guest`,
        password: 'guestpassword123',
        name: `Guest ${rand}`
      })
    });
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
};

const formatImageUrl = (imagePath: string | undefined, categoryId?: string, itemId?: string): string => {
  if (categoryId === 'deals' || itemId?.startsWith('deal_')) {
    return 'https://pbs.twimg.com/media/DxIwlXCW0AA1uM3.jpg';
  }
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pizza_order_type');
      if (saved === 'delivery' || saved === 'pickup') {
        return saved as 'pickup' | 'delivery';
      }
    }
    return 'pickup';
  });

  useEffect(() => {
    localStorage.setItem('pizza_order_type', orderType);
  }, [orderType]);

  // NEW: Persist Deals to localStorage so they survive page reloads 
  // since the backend DB rejects them
  useEffect(() => {
    const localDeals = cartItems.filter(item => String(item.menuItemId).startsWith('deal_'));
    if (localDeals.length > 0) {
      localStorage.setItem('pizza_local_deals', JSON.stringify(localDeals));
    } else {
      localStorage.removeItem('pizza_local_deals');
    }
  }, [cartItems]);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('pizza_token');

      if (stored) {
        const res = await fetch(`${API_URL}/api/cart`, {
          headers: { 'Authorization': `Bearer ${stored}` }
        });
        if (res.ok) {
          const data = await res.json();
          setToken(stored);
          if (data.cartItems?.length) {
            const formattedItems = data.cartItems.map((ci: any) => ({
              ...ci,
              image: formatImageUrl(ci.image, undefined, ci.menuItemId)
            }));
            
            // Load deals from local storage that the backend doesn't know about
            const savedDeals = JSON.parse(localStorage.getItem('pizza_local_deals') || '[]');
            setCartItems([...formattedItems, ...savedDeals]);
          } else {
            // If DB cart is empty, still load local deals if they exist
            const savedDeals = JSON.parse(localStorage.getItem('pizza_local_deals') || '[]');
            setCartItems(savedDeals);
          }
          return;
        } else {
          localStorage.removeItem('pizza_token');
        }
      }

      const newToken = await createGuestUser();
      if (newToken) {
        localStorage.setItem('pizza_token', newToken);
        setToken(newToken);
      }
    };

    initAuth();
  }, []);

  const authHeaders = (t?: string | null) => ({
    'Authorization': `Bearer ${t ?? token}`,
    'Content-Type': 'application/json'
  });

  const addToCart = async (item: MenuItem, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number }) => {
    const unitPrice = Number(customizations?.price || item.price || 0);
    const effectiveSize = customizations?.size ?? (item.sizes?.length ? item.sizes[0].name : undefined);

    const localItem: CartItem = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      menuItemId: item.id,
      name: item.name,
      price: unitPrice,
      quantity: customizations?.quantity || 1,
      image: formatImageUrl(item.image, item.categoryId, item.id),
      size: effectiveSize,
      removedToppings: customizations?.removedToppings || [],
      addedExtras: customizations?.addedExtras || [],
    };

    // Always update local state immediately
    setCartItems(prev => {
      // Check if this exact deal is already locally in cart to just increment quantity
      if (String(item.id).startsWith('deal_')) {
        const existing = prev.find(p => p.menuItemId === item.id);
        if (existing) {
          return prev.map(p => p.menuItemId === item.id ? { ...p, quantity: p.quantity + (customizations?.quantity || 1) } : p);
        }
      }
      return [...prev, localItem];
    });

    if (token) {
      try {
        const payload = {
          menuItemId: item.id,
          quantity: localItem.quantity,
          price: localItem.price,
          size: localItem.size || null,
          removedToppings: localItem.removedToppings || [],
          addedExtras: localItem.addedExtras || []
        };
        
        const res = await fetch(`${API_URL}/api/cart`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const cartRes = await fetch(`${API_URL}/api/cart`, { headers: authHeaders() });
          const data = await cartRes.json();
          if (data.cartItems) {
            const formattedItems = data.cartItems.map((ci: any) => ({
              ...ci,
              image: formatImageUrl(ci.image, undefined, ci.menuItemId)
            }));
            
            // FIX: Merge the database items with our unsynced local deals so they don't get wiped!
            setCartItems(prev => {
              const localDeals = prev.filter(p => String(p.menuItemId).startsWith('deal_'));
              // Filter out backend items that might be deals (if you ever update the backend schema in the future)
              const dbItemsNormal = formattedItems.filter((i: any) => !String(i.menuItemId).startsWith('deal_'));
              return [...dbItemsNormal, ...localDeals];
            });
          }
        }
      } catch (err) {
        console.error('Cart sync failed (item still in local state):', err);
      }
    }
  };

  const incrementItem = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    
    // Prevent hitting backend for local-only deals
    if (token && !id.startsWith('local_')) {
      fetch(`${API_URL}/api/cart/${id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ quantity: item.quantity + 1 })
      }).catch(console.error);
    }
  };

  const decrementItem = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    if (item.quantity === 1) {
      setCartItems(prev => prev.filter(i => i.id !== id));
      if (token && !id.startsWith('local_')) {
        fetch(`${API_URL}/api/cart/${id}`, { method: 'DELETE', headers: authHeaders() }).catch(console.error);
      }
    } else {
      setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      if (token && !id.startsWith('local_')) {
        fetch(`${API_URL}/api/cart/${id}`, {
          method: 'PUT', headers: authHeaders(),
          body: JSON.stringify({ quantity: item.quantity - 1 })
        }).catch(console.error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('pizza_local_deals');
    if (token) {
      fetch(`${API_URL}/api/cart`, { method: 'DELETE', headers: authHeaders() }).catch(console.error);
    }
  };

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      token,
      addToCart,
      incrementItem,
      decrementItem,
      clearCart,
      cartTotalItems,
      cartTotalPrice,
      isCartOpen,
      setIsCartOpen,
      orderType,
      setOrderType
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
