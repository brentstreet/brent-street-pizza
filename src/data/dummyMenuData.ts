import { type MenuCategory, type MenuItem } from '../types/menu';

export const CATEGORIES: MenuCategory[] = [
  { id: 'cat-pizza', name: 'Pizza', iconName: 'Pizza' },
  { id: 'cat-sides', name: 'Sides', iconName: 'Salad' },
  { id: 'cat-drinks', name: 'Drinks', iconName: 'CupSoda' },
  { id: 'cat-desserts', name: 'Desserts', iconName: 'CakeSlice' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    categoryId: 'cat-pizza',
    name: 'MARGHERITA',
    description: 'Fresh basil, mozzarella, classic tomato sauce, and hit of extra virgin olive oil.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    tags: { isVegan: true }
  },
  {
    id: 'item-2',
    categoryId: 'cat-pizza',
    name: 'PEPPERONI FEAST',
    description: 'Double pepperoni, extra mozzarella, tomato sauce on a classic base.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
    tags: { isGlutenFree: true }
  },
  {
    id: 'item-3',
    categoryId: 'cat-pizza',
    name: 'VEGGIE DELIGHT',
    description: 'Capsicum, mushrooms, red onions, olives, tomato sauce, and mozzarella.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80',
    tags: { isSpicy: true }
  },
  {
    id: 'item-4',
    categoryId: 'cat-pizza',
    name: 'HAWAIIAN',
    description: 'Ham, pineapple pieces, mozzarella, and classic tomato sauce.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    tags: { isSpicy: true }
  },
  {
    id: 'item-5',
    categoryId: 'cat-pizza',
    name: 'AMERICANA',
    description: 'Bacon, mushrooms, mozzarella, and a smoky BBQ sauce drizzle.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    tags: { isVegan: true, isGlutenFree: true }
  },
];

export const ADD_ONS: MenuItem[] = [
  {
    id: 'addon-1',
    categoryId: 'cat-sides',
    name: 'GARLIC BREAD',
    description: 'Oven baked bread infused with our signature garlic butter.',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80',
    tags: {}
  },
  {
    id: 'addon-2',
    categoryId: 'cat-sides',
    name: 'DIP TRIO',
    description: 'Selection of 3 classic dips: Garlic mayo, BBQ, and sweet chili.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1601314115160-c651abcbcd6a?w=400&q=80',
    tags: {}
  },
  {
    id: 'addon-3',
    categoryId: 'cat-sides',
    name: 'CHILI OIL',
    description: 'Our house-made spicy infused oil, perfect for crust dipping.',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1593457582527-3dc6173491ea?w=400&q=80',
    tags: {}
  }
];
