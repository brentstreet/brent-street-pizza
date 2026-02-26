# 🍕 Brent Street Pizza - Glenorchy

A premium, modern web application for **Brent Street Pizza**, featuring a complete redesign focused on high-performance UX, interactive menu discovery, and mobile-first responsiveness.

![Brent Street Pizza Branding](https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80)

## 🚀 Key Features

- **📱 Fully Responsive Design**: Seamless experience across mobile, tablet, and desktop with a custom overlay navigation for small screens.
- **✨ Dynamic Hero Slider**: Interactive, auto-advancing carousel showcasing signature pizzas and daily promos.
- **🛒 Functional Menu & Cart**: 
  - Vertical category filtering (Pizza, Sides, Drinks, Desserts).
  - Individual menu item cards with tags (Vegan, Spicy, Gluten-Free).
  - Floating shopping cart widget with real-time subtotal calculation.
- **📍 Localized Pages**:
  - Dedicated **Trading Hours** with active-day highlighting.
  - **Contact Us** with integrated Google Maps and premium messaging form.
- **🎨 Custom Branding**: Personalized typography (Bangers, Oswald), brand-consistent color palette (Red, Gold, Charcoal), and custom browser favicon.

## 🛠️ Technical Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 👨‍💻 For Developers / Backend Integration

The project is structured to be easily integrated with a backend API:
- **Data Shape**: Consistently defined in `src/types/menu.ts`.
- **Mock Database**: Centralized in `src/data/dummyMenuData.ts`. Simply swap this file's exports with your API fetch results.
- **Components**: Modular and atomic structure located in `src/components/pizza-redesign/`.

## 📦 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/varuntejreddy03/Brent-Street-Pizza.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---
*Created with ❤️ for Brent Street Pizza - Tasmania*
