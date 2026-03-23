import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES as dummyCategories, MENU_ITEMS as dummyItems, PIZZA_EXTRAS as dummyExtras } from '../data/dummyMenuData';
import type { MenuItem, MenuCategory, ExtraCategory } from '../types/menu';

interface MenuContextType {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  extras: ExtraCategory[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [extras, setExtrasState] = useState<ExtraCategory[]>([]);

  useEffect(() => {
    // Always load fresh from source — replace with API calls when backend is ready
    setMenuItems(dummyItems);
    setCategories(dummyCategories);
    setExtrasState(dummyExtras);
  }, []);

  return (
    <MenuContext.Provider value={{ categories, menuItems, extras }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
