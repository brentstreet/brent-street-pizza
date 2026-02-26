export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: {
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  iconName: string; // We'll map this to Lucide icons in the component
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
