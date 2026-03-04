# 🍕 Brent Street Pizza — Frontend Handoff

> A premium dark-themed restaurant website built with **React + Vite + TypeScript + Tailwind CSS v4**.  
> The frontend is complete. Your job is to wire up the backend: real menu data, cart/checkout, orders, and contact forms.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 (PostCSS) |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| State | React Context API (Cart) |
| Persistence | `localStorage` (temporary, replace with backend) |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── App.tsx                  # Root: Router + CartProvider + Layout shell
├── index.css                # Global styles, CSS variables, animations
│
├── layout/                  # Shell components (always on screen)
│   ├── Navbar.tsx           # Sticky frosted-glass nav, cart badge, ORDER NOW btn
│   ├── Footer.tsx           # Pre-footer CTA, 4-col layout, SMS opt-in, Uber Eats fallback
│   ├── MobileCTABar.tsx     # Fixed bottom bar on mobile (Order Pickup / Uber Eats)
│   └── Logo.tsx             # SVG logo component
│
├── sections/                # Homepage sections (used only in pages/Home.tsx)
│   ├── HeroSlider.tsx       # Full-screen hero, video bg, Trust bar, 2 CTAs
│   ├── CategorySection.tsx  # Pizza / Gelato / Desserts cards strip
│   ├── MarqueeBanner.tsx    # Scrolling red ticker bar
│   ├── CustomerFavourites.tsx # Product cards grid with ratings + Quick Add
│   ├── WhyOrderDirect.tsx   # Conversion section: savings/speed/loyalty comparison
│   ├── CustomerTestimonials.tsx # Review carousel with star ratings
│   ├── InfoSection.tsx      # "Crafted With Passion" story + process steps
│   ├── CateringSection.tsx  # Catering enquiry form (name/date/guests/message)
│   └── DeliveryAreas.tsx    # Suburb list + postcode check + embedded map
│
├── components/              # Shared UI components
│   ├── CartWidget.tsx       # Slide-in cart sidebar (used in Menu page)
│   └── MenuItemCard.tsx     # Individual menu item card (used in Menu page)
│
├── pages/                   # Route-level page components
│   ├── Home.tsx             # Assembles all sections in order
│   ├── Menu.tsx             # Full menu with sticky category nav + cart integration
│   └── ContactUs.tsx        # Contact form + map + hours + social links
│
├── context/
│   └── CartContext.tsx      # Global cart state (add/increment/decrement/clear)
│
├── data/
│   └── dummyMenuData.ts     # ⚠️ REPLACE WITH API — mock menu categories + items
│
└── types/
    └── menu.ts              # TypeScript interfaces: MenuItem, MenuCategory, CartItem
```

---

## 🗂️ Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home.tsx` | Landing page with all marketing sections |
| `/menu` | `Menu.tsx` | Full menu by category, cart sidebar |
| `/contact` | `ContactUs.tsx` | Contact form, map, hours |

---

## 🛒 Cart System (Context API)

Located in `src/context/CartContext.tsx`.

### What it does right now
- Stores cart in **`localStorage`** (survives page refresh)
- Exposes a React context with these values:

```ts
cartItems: CartItem[]         // All items in cart
addToCart(item: MenuItem)     // Add or increment item
incrementItem(id: string)     // +1 qty
decrementItem(id: string)     // -1 qty (removes if qty = 1)
clearCart()                   // Empty the cart
cartTotalItems: number        // Total item count (for badge)
cartTotalPrice: number        // Total price (for checkout)
```

### What you need to do
- Replace `localStorage` persistence with your **API session or database**
- Implement a real **checkout endpoint** (the Checkout button in `CartWidget.tsx` has no handler yet)
- Optionally: sync cart with a logged-in user's server-side cart

---

## 🍕 Menu Data (Replace This First!)

**File:** `src/data/dummyMenuData.ts`

This file has hardcoded mock data. Replace it with a real API call.

### Current shape

```ts
// Category
interface MenuCategory {
  id: string;       // e.g. "cat-pizza"
  name: string;     // e.g. "PIZZA"
  iconName: string; // Lucide icon name (not used in rendering currently)
}

// Item
interface MenuItem {
  id: string;
  categoryId: string;  // Must match a MenuCategory.id
  name: string;
  description: string;
  price: number;       // In AUD dollars, e.g. 17.00
  image: string;       // URL to image
  tags: {
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
    isFavorite?: boolean;   // Shows "Favourite" badge on home page card
  };
}
```

### How to replace with an API

```ts
// Example: src/hooks/useMenu.ts
import { useEffect, useState } from 'react';

export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/menu/categories').then(r => r.json()).then(setCategories);
    fetch('/api/menu/items').then(r => r.json()).then(setItems);
  }, []);

  return { categories, items };
}
```

Then update `Menu.tsx` and `CustomerFavourites.tsx` to use `useMenu()` instead of `import { CATEGORIES, MENU_ITEMS }`.

---

## 📋 Forms That Need Backend Endpoints

### 1. Contact Form — `pages/ContactUs.tsx`
**Currently:** Frontend-only, sets `submitted = true` on submit.  
**Needs:** `POST /api/contact`

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "General Enquiry",
  "message": "Hello..."
}
```

---

### 2. Catering Enquiry — `sections/CateringSection.tsx`
**Currently:** Frontend-only form.  
**Needs:** `POST /api/catering-enquiry`

```json
{
  "name": "Jane Smith",
  "date": "2026-04-15",
  "guests": "50",
  "message": "Corporate lunch event..."
}
```

---

### 3. SMS Loyalty Sign-Up — `layout/Footer.tsx`
**Currently:** Frontend-only, sets `smsSubmitted = true`.  
**Needs:** `POST /api/loyalty/subscribe`

```json
{
  "phone": "0411 234 567"
}
```

---

### 4. Delivery Postcode Check — `sections/DeliveryAreas.tsx`
**Currently:** Checks against a hardcoded array of suburb names.  
**Needs:** `GET /api/delivery/check?postcode=7010`

```json
// Response
{ "available": true, "suburb": "Glenorchy", "eta": "30-45 min" }
```

---

### 5. Cart Checkout — `components/CartWidget.tsx`
**Currently:** Checkout button is present but has no action.  
**Needs:** `POST /api/orders`

```json
{
  "items": [
    { "menuItemId": "pizza-1", "name": "Supreme", "price": 17, "quantity": 2 }
  ],
  "orderType": "pickup | delivery",
  "total": 34.00,
  "customer": {
    "name": "...",
    "phone": "...",
    "address": "..."  // if delivery
  }
}
```

---

## 🎨 Design System (CSS Variables)

Defined in `src/index.css` under `@theme`:

```css
--color-brand-red:    #C0392B   /* Primary CTA red */
--color-brand-gold:   #d4a017   /* Accent gold */
--color-brand-dark:   #1a0a00   /* Page background */
--color-brand-deep:   #2b1200   /* Card backgrounds */

--font-bebas:  "Bebas Neue"       /* Display headings */
--font-inter:  "Inter"            /* Body text */
--font-barlow: "Barlow Condensed" /* Labels, buttons, nav */
```

**Utility classes:**
- `.btn-primary` — Red CTA button with glow on hover
- `.btn-outline` — Transparent bordered button
- `.reveal` / `.reveal-left` / `.reveal-right` — Scroll-triggered fade animations (activated by `IntersectionObserver` in each section)
- `.divider-gold` — Gold gradient horizontal line

---

## 🖼️ Images

| Image | Location | Notes |
|---|---|---|
| Hero background | `/public/heropic.jpeg` | Used as video poster + fallback image |
| Hero video | External CDN (Coverr) | `coverr-a-pizza-being-made-in-a-restaurant-4989` |
| Pizza images | Unsplash URLs in `dummyMenuData.ts` | Replace with your own hosted images |
| Gelato images | iStock preview URL | ⚠️ Watermarked — replace with licensed or own image |

To add local images, place them in `/public/` and reference as `/your-image.jpg`.

---

## 🔌 Suggested Backend API Routes

```
GET    /api/menu/categories          → List of MenuCategory[]
GET    /api/menu/items               → List of MenuItem[]
GET    /api/menu/items/:categoryId   → Filtered by category

POST   /api/orders                   → Place an order
GET    /api/orders/:id               → Get order status

POST   /api/contact                  → Contact form submission
POST   /api/catering-enquiry         → Catering form submission
POST   /api/loyalty/subscribe        → SMS loyalty sign-up

GET    /api/delivery/check?postcode= → Postcode delivery check
```

---

## ✅ Frontend → Backend Handoff Checklist

- [ ] Replace `src/data/dummyMenuData.ts` with real API calls
- [ ] Wire `POST /api/orders` to the Checkout button in `CartWidget.tsx`
- [ ] Wire `POST /api/contact` to the form in `ContactUs.tsx`
- [ ] Wire `POST /api/catering-enquiry` to `CateringSection.tsx`
- [ ] Wire `POST /api/loyalty/subscribe` to the SMS field in `Footer.tsx`
- [ ] Implement postcode check in `DeliveryAreas.tsx` (currently hardcoded suburbs)
- [ ] Replace iStock gelato preview with a licensed or self-hosted image
- [ ] Set up environment variables for API base URL (add `.env` with `VITE_API_URL=`)
- [ ] Test mobile responsiveness on real device
- [ ] Replace `localStorage` cart with server-side cart/session if needed

---

## 📞 Business Info (currently hardcoded in components)

Update these in the relevant files:

| Info | Value | Files |
|---|---|---|
| Phone | `0455 123 678` | Navbar, Footer, ContactUs, CateringSection |
| Address | `2 Brent Street, Glenorchy TAS 7010` | ContactUs, Footer |
| Email | `brentstreetgroup@gmail.com` | ContactUs |
| Hours | Daily 11 AM – 11 PM | Footer, ContactUs |
| Google Maps | Glenorchy embed | ContactUs |

---

## 🧑‍💻 Dev Notes

- **Tailwind v4** is used — config is done via `@theme {}` in `index.css`, **not** `tailwind.config.js`
- **PostCSS**: `@import url(...)` for Google Fonts **must** come before `@import "tailwindcss"` in `index.css`
- All scroll animations use native `IntersectionObserver` — no animation libraries needed
- Cart state is wrapped in `<CartProvider>` in `App.tsx` — all child components can call `useCart()`

---

*Frontend built with ❤️ — good luck with the backend! 🚀*
