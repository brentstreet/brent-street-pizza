// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { type MenuItem } from '../types/menu';
// import { API_URL } from '../config/api';

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   categoryId?: string;
//   size?: string;
//   removedToppings?: string[];
//   addedExtras?: any[];
//   menuItemId?: string;
//   dealId?: string | null;
//   selectedDealItems?: any[];
//   image: string;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   token: string | null;
//   addToCart: (item: MenuItem, customizations?: { 
//     size?: string, 
//     price?: number, 
//     removedToppings?: string[], 
//     addedExtras?: { name: string; price: number }[], 
//     quantity?: number,
//     selectedDealItems?: any[],
//     dealId?: string
//   }) => void;
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

// const formatImageUrl = (imagePath: string | undefined, categoryId?: string, itemId?: string): string => {
//   if (categoryId === 'deals' || itemId?.startsWith('deal_')) {
//     return 'https://pbs.twimg.com/media/DxIwlXCW0AA1uM3.jpg';
//   }
//   if (!imagePath) return '';
//   if (imagePath.startsWith('http')) return imagePath;
//   return `${API_URL}${imagePath}`;
// };

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [token, setToken] = useState<string | null>(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);
  
//   const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('pizza_order_type');
//       if (saved === 'delivery' || saved === 'pickup') {
//         return saved as 'pickup' | 'delivery';
//       }
//     }
//     return 'pickup';
//   });

//   useEffect(() => {
//     localStorage.setItem('pizza_order_type', orderType);
//   }, [orderType]);

//   useEffect(() => {
//     const initAuth = async () => {
//       const stored = localStorage.getItem('pizza_token');

//       if (stored) {
//         const res = await fetch(`${API_URL}/api/cart`, {
//           headers: { 'Authorization': `Bearer ${stored}` }
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setToken(stored);
//           if (data.cartItems?.length) {
//             const formattedItems = data.cartItems.map((ci: any) => ({
//               ...ci,
//               image: formatImageUrl(ci.image, undefined, ci.menuItemId)
//             }));
//             setCartItems(formattedItems);
//           }
//           return;
//         } else {
//           localStorage.removeItem('pizza_token');
//         }
//       }

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

//   const addToCart = async (item: MenuItem | any, customizations?: { size?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number, selectedDealItems?: any[] }) => {
//     const unitPrice = Number(customizations?.price || item.price || 0);
//     const effectiveSize = customizations?.size ?? (item.sizes?.length ? item.sizes[0].name : undefined);
    
//     // Determine Deal IDs if applicable
//     const isDeal = item.categoryId === 'deals' || String(item.id).startsWith('deal_');
//     const rawDealId = isDeal ? (item.dealId || String(item.id).replace('deal_', '')) : null;

//     const localItem: CartItem = {
//       id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
//       menuItemId: isDeal ? null : item.id, // Normal products use menuItemId
//       dealId: rawDealId,                   // Deals use dealId
//       name: item.name,
//       price: unitPrice,
//       quantity: customizations?.quantity || 1,
//       image: formatImageUrl(item.image, item.categoryId, item.id),
//       size: effectiveSize,
//       removedToppings: customizations?.removedToppings || [],
//       addedExtras: customizations?.addedExtras || [],
//       selectedDealItems: customizations?.selectedDealItems || item.selectedDealItems || [],
//       categoryId: item.categoryId
//     };

//     // Update local UI immediately for snappiness
//     setCartItems(prev => [...prev, localItem]);

//     if (token) {
//       try {
//         const payload = {
//           menuItemId: localItem.menuItemId,
//           dealId: localItem.dealId,
//           quantity: localItem.quantity,
//           price: localItem.price,
//           size: localItem.size || null,
//           removedToppings: localItem.removedToppings,
//           addedExtras: localItem.addedExtras,
//           selectedDealItems: localItem.selectedDealItems
//         };
        
//         const res = await fetch(`${API_URL}/api/cart`, {
//           method: 'POST',
//           headers: authHeaders(),
//           body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//           // Re-fetch the clean cart from DB to get actual DB IDs and standardized formatting
//           const cartRes = await fetch(`${API_URL}/api/cart`, { headers: authHeaders() });
//           const data = await cartRes.json();
//           if (data.cartItems) {
//             const formattedItems = data.cartItems.map((ci: any) => ({
//               ...ci,
//               image: formatImageUrl(ci.image, undefined, ci.menuItemId)
//             }));
//             setCartItems(formattedItems);
//           }
//         }
//       } catch (err) {
//         console.error('Cart sync failed:', err);
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
import { type MenuItem } from '../types/menu';
import { API_URL } from '../config/api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId?: string;
  size?: string;
  
  // NEW: Support capturing the chosen variant for the cart
  variant?: string; 
  
  removedToppings?: string[];
  addedExtras?: any[];
  menuItemId?: string;
  dealId?: string | null;
  selectedDealItems?: any[];
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  token: string | null;
  addToCart: (item: MenuItem, customizations?: { 
    size?: string, 
    variant?: string, // NEW: Include variant in customizations arg
    price?: number, 
    removedToppings?: string[], 
    addedExtras?: { name: string; price: number }[], 
    quantity?: number,
    selectedDealItems?: any[],
    dealId?: string
  }) => void;
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
            setCartItems(formattedItems);
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

  const addToCart = async (item: MenuItem | any, customizations?: { size?: string, variant?: string, price?: number, removedToppings?: string[], addedExtras?: { name: string; price: number }[], quantity?: number, selectedDealItems?: any[] }) => {
    const unitPrice = Number(customizations?.price || item.price || 0);
    const effectiveSize = customizations?.size ?? (item.sizes?.length ? item.sizes[0].name : undefined);
    
    // Determine Deal IDs if applicable
    const isDeal = item.categoryId === 'deals' || String(item.id).startsWith('deal_');
    const rawDealId = isDeal ? (item.dealId || String(item.id).replace('deal_', '')) : null;

    const localItem: CartItem = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      menuItemId: isDeal ? null : item.id, // Normal products use menuItemId
      dealId: rawDealId,                   // Deals use dealId
      name: item.name,
      price: unitPrice,
      quantity: customizations?.quantity || 1,
      image: formatImageUrl(item.image, item.categoryId, item.id),
      size: effectiveSize,
      variant: customizations?.variant || undefined, // NEW: Apply chosen variant
      removedToppings: customizations?.removedToppings || [],
      addedExtras: customizations?.addedExtras || [],
      selectedDealItems: customizations?.selectedDealItems || item.selectedDealItems || [],
      categoryId: item.categoryId
    };

    // Update local UI immediately for snappiness
    setCartItems(prev => [...prev, localItem]);

    if (token) {
      try {
        const payload = {
          menuItemId: localItem.menuItemId,
          dealId: localItem.dealId,
          quantity: localItem.quantity,
          price: localItem.price,
          size: localItem.size || null,
          variant: localItem.variant || null, // NEW: Send variant to backend
          removedToppings: localItem.removedToppings,
          addedExtras: localItem.addedExtras,
          selectedDealItems: localItem.selectedDealItems
        };
        
        const res = await fetch(`${API_URL}/api/cart`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          // Re-fetch the clean cart from DB to get actual DB IDs and standardized formatting
          const cartRes = await fetch(`${API_URL}/api/cart`, { headers: authHeaders() });
          const data = await cartRes.json();
          if (data.cartItems) {
            const formattedItems = data.cartItems.map((ci: any) => ({
              ...ci,
              image: formatImageUrl(ci.image, undefined, ci.menuItemId)
            }));
            setCartItems(formattedItems);
          }
        }
      } catch (err) {
        console.error('Cart sync failed:', err);
      }
    }
  };

  const incrementItem = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    
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
