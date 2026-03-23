# 🍕 Brent Street Pizza — Frontend Handoff

> **React + Vite + TypeScript + Tailwind CSS v4**
> The frontend is complete and deployed on Vercel. Your job is to wire up the backend: real menu data, cart/checkout, orders, and contact forms.

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # Production build → /dist
npm run preview    # Preview production build
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 (PostCSS) |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| State | React Context API (Cart + Menu) |
| Persistence | `localStorage` (temporary — replace with backend) |

---

## 📁 Project Structure

```
src/
├── App.tsx                    # Root: Router + CartProvider + MenuProvider + Layout
├── index.css                  # Global styles, CSS variables, animations
├── main.tsx                   # Entry point
│
├── layout/                    # Always-visible shell components
│   ├── Navbar.tsx             # Sticky white nav, logo, phone number, ORDER NOW btn
│   ├── Footer.tsx             # Brand info, nav links, contact, trading hours, CTAs
│   ├── MobileCTABar.tsx       # Fixed bottom bar on mobile
│   └── Logo.tsx               # SVG logo component
│
├── pages/                     # Route-level page components
│   ├── Home.tsx               # Landing page — assembles all sections
│   ├── Menu.tsx               # Full pizza menu, category nav, cart sidebar
│   ├── Deals.tsx              # 5 combo deals (Quick, Double, Family, Party, Lunch)
│   ├── ContactUs.tsx          # Contact form, trading hours, map, social
│   ├── About.tsx              # Brand story, pillars, stats
│   └── Admin.tsx              # Admin panel (menu management via localStorage)
│
├── sections/                  # Homepage sections (used in Home.tsx only)
│   ├── HeroSlider.tsx         # Full-screen hero, background image, 2 CTA buttons
│   ├── QuickLinks.tsx         # Pizza / Deals / Drinks quick-link strip
│   ├── CategorySection.tsx    # 3-panel image strip (Pizza / Ice Cream / Desserts)
│   ├── MarqueeBanner.tsx      # Scrolling ticker bar
│   ├── CustomerFavourites.tsx # 4 featured pizza cards with Quick Add
│   ├── WhyOrderDirect.tsx     # Conversion section: savings/speed comparison
│   ├── InfoSection.tsx        # "Crafted With Passion" brand story + image
│   ├── CateringSection.tsx    # Catering enquiry form
│   └── DeliveryAreas.tsx      # Delivery suburbs, stats, Order Delivery CTA
│
├── components/                # Shared UI components
│   ├── CartWidget.tsx         # Slide-in order sidebar — Pickup/Delivery toggle,
│   │                          #   address form, checkout flow, order confirmation
│   └── CustomizationModal.tsx # Two-column pizza customization modal —
│                              #   size picker, toppings, extras accordion
│
├── context/
│   ├── CartContext.tsx        # Global cart state (add/increment/decrement/clear)
│   └── MenuContext.tsx        # Menu data state (loads from dummyMenuData, saves to localStorage)
│
├── data/
│   └── dummyMenuData.ts       # ⚠️ REPLACE WITH API — 15 pizzas across 5 categories + extras
│
└── types/
    └── menu.ts                # TypeScript interfaces: MenuItem, MenuCategory, CartItem, etc.
```

---

## 🗂️ Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home.tsx` | Landing page |
| `/menu` | `Menu.tsx` | Full menu with cart |
| `/menu?tab=delivery` | `Menu.tsx` | Opens cart in delivery mode |
| `/deals` | `Deals.tsx` | Combo deals page |
| `/contact` | `ContactUs.tsx` | Contact form + hours + map |
| `/about` | `About.tsx` | Brand story |
| `/admin` | `Admin.tsx` | Admin panel (password protected) |

---

## 🛒 Cart System

**File:** `src/context/CartContext.tsx`

### Current behaviour
- Stores cart in `localStorage` (survives page refresh)
- Pickup / Delivery toggle in the cart sidebar
- Delivery address form with validation (name, phone, address, suburb)
- Order confirmation screen after checkout

### Cart context API
```ts
cartItems: CartItem[]
addToCart(item: MenuItem, customizations?: {
  size?: string
  price?: number
  removedToppings?: string[]
  addedExtras?: { name: string; price: number }[]
  quantity?: number
})
incrementItem(id: string)
decrementItem(id: string)
clearCart()
cartTotalItems: number
cartTotalPrice: number
```

### What you need to do
- Replace the simulated checkout (`setTimeout`) in `CartWidget.tsx` with a real `POST /api/orders`
- Replace `localStorage` cart with server-side session/cart if needed
- Wire delivery address to your order payload

---

## 🍕 Menu Data

**File:** `src/data/dummyMenuData.ts`

### Current shape
```ts
interface MenuCategory {
  id: string;       // e.g. "cat-classic-pizza"
  name: string;     // e.g. "Classic Pizza"
  iconName: string;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;          // Base price (Small size)
  image: string;          // Unsplash URL — replace with your own
  sizes?: MenuSize[];     // [{ name: 'Small', price: 14 }, ...]
  toppings?: string[];    // Base toppings shown in customization modal
  hasPizzaExtras?: boolean; // Shows extras accordion in modal
  tags: {
    isVegan?: boolean
    isSpicy?: boolean
    isFavorite?: boolean  // Shows on Customer Favourites section
  }
}

interface ExtraCategory {
  id: string;   // 'sauce' | 'cheese' | 'veggies' | 'meat' | 'seafood' | 'garnish'
  name: string;
  options: { name: string; price: number }[]
}
```

### Current pizza categories (5)
- Classic Pizza (4 items)
- Meat Pizza (4 items)
- Seafood Pizza (3 items)
- Chicken Pizza (3 items)
- Vegetarian Pizza (3 items)

### How to replace with API
```ts
// src/hooks/useMenu.ts
export function useMenu() {
  useEffect(() => {
    fetch('/api/menu/categories').then(r => r.json()).then(setCategories);
    fetch('/api/menu/items').then(r => r.json()).then(setItems);
    fetch('/api/menu/extras').then(r => r.json()).then(setExtras);
  }, []);
}
```
Then update `src/context/MenuContext.tsx` to call the API instead of importing `dummyMenuData.ts`.

---

## 📋 Forms That Need Backend Endpoints

### 1. Checkout / Place Order — `components/CartWidget.tsx`
**Currently:** Simulates with `setTimeout`, shows confirmation screen.
**Needs:** `POST /api/orders`

```json
{
  "orderType": "pickup | delivery",
  "items": [
    {
      "menuItemId": "pizza-margherita",
      "name": "Margherita",
      "size": "Large",
      "price": 18.00,
      "quantity": 2,
      "removedToppings": ["Oregano"],
      "addedExtras": [{ "name": "Feta", "price": 2.50 }]
    }
  ],
  "total": 41.00,
  "customer": {
    "name": "Jane Smith",
    "phone": "0412 345 678",
    "address": "12 Main St",   // delivery only
    "suburb": "Moonah"         // delivery only
  }
}
```

### 2. Contact Form — `pages/ContactUs.tsx`
**Currently:** Sets `submitted = true` on submit.
**Needs:** `POST /api/contact`

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "General Enquiry",
  "message": "Hello..."
}
```

### 3. Catering Enquiry — `sections/CateringSection.tsx`
**Currently:** Frontend-only form.
**Needs:** `POST /api/catering`

```json
{
  "name": "Jane Smith",
  "date": "2026-04-15",
  "guests": "50",
  "message": "Corporate lunch event..."
}
```

---

## 🔌 Suggested API Routes

```
GET    /api/menu/categories          → MenuCategory[]
GET    /api/menu/items               → MenuItem[]
GET    /api/menu/extras              → ExtraCategory[]

POST   /api/orders                   → Place an order
GET    /api/orders/:id               → Get order status

POST   /api/contact                  → Contact form
POST   /api/catering                 → Catering enquiry
```

---

## 🎨 Design System

**Defined in** `src/index.css` under `@theme`:

```css
--color-brand-red:   #C8201A   /* Primary CTA red */
--color-brand-gold:  #D4952A   /* Accent gold */
--color-brand-cream: #FDF8F2   /* Page background */
--color-brand-warm:  #F5EDE0   /* Card backgrounds */
--color-brand-border:#E8D8C8   /* Borders */

--font-bebas:  "Bebas Neue"        /* Display headings */
--font-inter:  "Inter"             /* Body text */
--font-barlow: "Barlow Condensed"  /* Labels, buttons, nav */
--font-poppins:"Poppins"           /* Hero headings */
```

**Utility classes:**
- `.btn-primary` — Red CTA button
- `.btn-outline` — Transparent bordered button
- `.reveal` / `.reveal-left` / `.reveal-right` — Scroll-triggered fade animations
- `.divider-gold` — Gold gradient horizontal line
- `.hide-scroll` — Hide scrollbar

---

## 🖼️ Images

| Image | Location | Notes |
|---|---|---|
| Hero background | `/public/heropic.jpeg` | Used on hero, menu, contact pages |
| Logo | `/public/logo.jpeg` | Used in navbar and footer |
| Side pic | `/public/sidepic.jpg` | Available for use |
| Pizza images | Unsplash URLs in `dummyMenuData.ts` | ⚠️ Replace with licensed/own images |

---

## 📞 Business Info (hardcoded — update if changed)

| Info | Value | Files |
|---|---|---|
| Phone | `03 6272 4004` | Navbar, Footer, CartWidget, ContactUs, Menu, CateringSection, DeliveryAreas |
| Address | `2 Brent Street, Glenorchy TAS 7010` | ContactUs, Footer |
| Email | `brentstreetgroup@gmail.com` | ContactUs |
| Pickup Hours | Daily 11am – 8pm | Footer, ContactUs |
| Delivery Hours | Sun–Thu 11am–9:30pm, Fri–Sat 11am–11pm | Footer, ContactUs |

---

## ✅ Backend Handoff Checklist

- [ ] Replace `src/data/dummyMenuData.ts` with real API calls in `MenuContext.tsx`
- [ ] Wire `POST /api/orders` to the checkout in `CartWidget.tsx` (replace the `setTimeout`)
- [ ] Wire `POST /api/contact` to the form in `ContactUs.tsx`
- [ ] Wire `POST /api/catering` to the form in `CateringSection.tsx`
- [ ] Add `.env` with `VITE_API_URL=https://your-api.com`
- [ ] Replace Unsplash pizza images with licensed/self-hosted images
- [ ] Set Node version to **20.x** in Vercel dashboard (Settings → General → Node.js Version)
- [ ] Test mobile responsiveness on real device

---

## 🌐 Deployment

- **Platform:** Vercel (connected to GitHub `main` branch)
- **Auto-deploy:** Every push to `main` triggers a new deployment
- **Config:** `vercel.json` — SPA rewrite, cache headers, security headers
- **Node:** Must be set to **20.x** in Vercel dashboard

---

## 🧑‍💻 Dev Notes

- **Tailwind v4** — config is in `@theme {}` in `index.css`, not `tailwind.config.js`
- **MenuContext** always loads fresh from `dummyMenuData.ts` on startup (clears stale localStorage)
- **Cart** uses `localStorage` for persistence — survives page refresh
- **Scroll animations** use native `IntersectionObserver` — no animation libraries
- **`/menu?tab=delivery`** — deep link that opens cart sidebar in delivery mode automatically
- **Admin panel** at `/admin` — allows editing menu items via localStorage (dev tool only)
