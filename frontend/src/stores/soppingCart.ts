import { IBook } from '@/types/book';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ShoppingCartStore {
  items: IBook[];
  addItem: (item: IBook) => void;
  removeItem: (item: IBook) => void;
  clear: () => void;
  isInCart: (item?: IBook) => boolean;
  totalPrice: () => number;
}

export const shoppingCartStore = create<ShoppingCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: IBook) => {
        if (get().isInCart(item)) {
          return;
        }

        set(state => ({
          items: [...state.items, item],
        }));
      },
      removeItem: (item: IBook) => {
        set(state => ({
          items: state.items.filter(i => i.id !== item.id),
        }));
      },
      clear: () => {
        set({ items: [] });
      },
      isInCart: item => {
        if (!item) return false;

        return get().items.some(i => i.id === item.id);
      },
      totalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.priceInETH, 0);
      },
    }),
    {
      name: 'shopping-cart-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    }
  )
);

export const useShoppingCartStore = shoppingCartStore;
