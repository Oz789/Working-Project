import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(persist(
  (set) => ({
    cart: [],
    addToCart: (item) =>
      set((state) => ({
        cart: [...state.cart, item]
      })),
    removeFromCart: (id, type) =>
      set((state) => ({
        cart: state.cart.filter(i => !(i.itemID === id && i.type === type))
      })),
    updateQuantity: (id, type, quantity) =>
      set((state) => ({
        cart: state.cart.map(i =>
          i.itemID === id && i.type === type
            ? { ...i, quantity }
            : i
        )
      })),
    clearCart: () => set({ cart: [] })
  }),
  {
    name: 'receptionist-cart',
  }
));

export default useCartStore;
