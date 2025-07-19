import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🧾 Types
type CartItem = {
  image: unknown;
  title: string;
  oldPrice: number;
  color: string;
  price: number;
  id: string;
  name: string;
  quantity: number;
  shippingOption?: {
    type: string;
    price: number;
    duration?: string;
  };
};

export type Cart = {
  id: string;
  name: string;
  items: CartItem[];
  invited?: string[];
};

type CartContextType = {
  carts: Cart[];
  selectedCartId: string;
  setSelectedCartId: React.Dispatch<React.SetStateAction<string>>;
  addCart: (name: string) => void;
  removeCart: (id: string) => void;
  updateItemQuantity: (cartId: string, itemId: string, amount: number) => void;
  addItemToCart: (cartId: string, item: CartItem) => void;
  selectCart: (id: string) => void;
  handleRemovePerson: (cartId: string,person: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

const DEFAULT_CARTS: Cart[] = [
  {
    id: "default",
    name: "My Cart",
    items: [],
    invited: [],
  },
];

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carts, setCarts] = useState<Cart[]>(DEFAULT_CARTS);
  const [selectedCartId, setSelectedCartId] = useState('default');

  // Load carts and selected cart ID on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedCarts, savedSelectedId] = await Promise.all([
          AsyncStorage.getItem('USER_CARTS'),
          AsyncStorage.getItem('SELECTED_CART_ID')
        ]);

        if (savedCarts) {
          const parsedCarts = JSON.parse(savedCarts);
          setCarts(parsedCarts);
        }

        if (savedSelectedId) {
          setSelectedCartId(savedSelectedId);
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };
    loadData();
  }, []);

  // Save carts and selected cart ID when they change
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem('USER_CARTS', JSON.stringify(carts)),
          AsyncStorage.setItem('SELECTED_CART_ID', selectedCartId)
        ]);
      } catch (error) {
        console.error('Error saving cart data:', error);
      }
    };
    saveData();
  }, [carts, selectedCartId]);

  // One-time clear for all users to remove old carts and products
  useEffect(() => {
    const clearOldCarts = async () => {
      const alreadyReset = await AsyncStorage.getItem('CARTS_RESET_V2');
      if (!alreadyReset) {
        await AsyncStorage.removeItem('USER_CARTS');
        await AsyncStorage.removeItem('SELECTED_CART_ID');
        await AsyncStorage.setItem('CARTS_RESET_V2', 'true');
        setCarts(DEFAULT_CARTS);
        setSelectedCartId('default');
      }
    };
    clearOldCarts();
  }, []);

  const addCart = (name: string) => {
    // Use a robust unique ID
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newCart: Cart = {
      id: uniqueId,
      name,
      items: [],
      invited: []
    };
    setCarts(prev => [...prev, newCart]);
    setSelectedCartId(newCart.id); // Automatically select new cart
  };

  const removeCart = (id: string) => {
    if (id === 'default') return;
    setCarts(prev => prev.filter(cart => cart.id !== id));
    if (selectedCartId === id) {
      setSelectedCartId('default');
    }
  };

  const selectCart = (id: string) => {
    setSelectedCartId(id);
  };

  const updateItemQuantity = (cartId: string, itemId: string, amount: number) => {
    setCarts(prev =>
      prev.map(cart =>
        cart.id === cartId
          ? {
              ...cart,
              items: cart.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                  : item
              ),
            }
          : cart
      )
    );
  };

  const addItemToCart = (cartId: string, item: CartItem) => {
    setCarts(prev =>
      prev.map(cart =>
        cart.id === cartId
          ? {
              ...cart,
              items: [...cart.items, item],
            }
          : cart
      )
    );
  };

   const handleRemovePerson = (cartId: string, person: string) => {
    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              invited: cart.invited?.filter((p) => p !== person),
            }
          : cart
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        selectedCartId,
        setSelectedCartId,
        addCart,
        removeCart,
        updateItemQuantity,
        addItemToCart,
        selectCart,
        handleRemovePerson,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export default CartProvider;
