import { type MenuCategory, type MenuItem } from '../types/menu';

export const CATEGORIES: MenuCategory[] = [
  { id: 'cat-pizza', name: 'PIZZA', iconName: 'Pizza' },
  { id: 'cat-gelato', name: 'GELATO', iconName: 'IceCream' },
  { id: 'cat-desserts', name: 'DESERTS', iconName: 'CakeSlice' },
];

export const MENU_ITEMS: MenuItem[] = [
  // PIZZAS
  {
    id: 'pizza-1',
    categoryId: 'cat-pizza',
    name: 'SUPREME',
    description: 'Ham, pepperoni, mushrooms, capsicum, onions, olives, pineapple and mozzarella.',
    price: 17.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    tags: { isFavorite: true }
  },
  {
    id: 'pizza-2',
    categoryId: 'cat-pizza',
    name: 'MARGHERITA',
    description: 'Fresh basil, mozzarella, classic tomato sauce, and extra virgin olive oil.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    tags: { isFavorite: true }
  },
  {
    id: 'pizza-3',
    categoryId: 'cat-pizza',
    name: 'PEPPERONI',
    description: 'Double pepperoni, extra mozzarella, tomato sauce on a classic base.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    tags: { isFavorite: true }
  },
  {
    id: 'pizza-4',
    categoryId: 'cat-pizza',
    name: 'HAWAIIAN',
    description: 'Ham, pineapple pieces, mozzarella, and classic tomato sauce.',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    tags: { isFavorite: true }
  },

  // GELATO
  {
    id: 'gelato-1',
    categoryId: 'cat-gelato',
    name: 'VANILLA BEAN',
    description: 'Creamy traditional vanilla bean gelato made with Madagascar vanilla.',
    price: 6.00,
    image: 'https://media.istockphoto.com/id/503082763/photo/gelato-in-a-store-window.jpg?s=612x612&w=0&k=20&c=TkwBIPqSu4Q-BBVQjTxSpB4frO7Hd_tMSbJ8jpFIzRw=',
    tags: {}
  },
  {
    id: 'gelato-2',
    categoryId: 'cat-gelato',
    name: 'BELGIAN CHOCOLATE',
    description: 'Rich, dark chocolate gelato crafted with 70% cocoa Belgian chocolate.',
    price: 6.00,
    image: 'https://media.istockphoto.com/id/503082763/photo/gelato-in-a-store-window.jpg?s=612x612&w=0&k=20&c=TkwBIPqSu4Q-BBVQjTxSpB4frO7Hd_tMSbJ8jpFIzRw=',
    tags: {}
  },
  {
    id: 'gelato-3',
    categoryId: 'cat-gelato',
    name: 'PISTACHIO',
    description: 'Authentic Italian pistachio gelato with roasted nut pieces.',
    price: 7.00,
    image: 'https://media.istockphoto.com/id/503082763/photo/gelato-in-a-store-window.jpg?s=612x612&w=0&k=20&c=TkwBIPqSu4Q-BBVQjTxSpB4frO7Hd_tMSbJ8jpFIzRw=',
    tags: {}
  },

  // DESERTS
  {
    id: 'dessert-1',
    categoryId: 'cat-desserts',
    name: 'TIRAMISU',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    tags: {}
  },
  {
    id: 'dessert-2',
    categoryId: 'cat-desserts',
    name: 'CHOCOLATE LAVA CAKE',
    description: 'Warm chocolate cake with a molten center, served with a scoop of vanilla.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62adda51?w=600&q=80',
    tags: {}
  },
];

export const ADD_ONS: MenuItem[] = [];
