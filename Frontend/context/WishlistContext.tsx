import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface WishlistProduct {
  id: number;
  name: string;
  image: any;
  price: number;
  originalPrice: number;
  discount?: number;
  rating: string;
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);

  const addToWishlist = (product: WishlistProduct) => {
    setWishlist((prev) => {
      const newWishlist = prev.some((p) => p.id === product.id) ? prev : [...prev, product];
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((p) => p.id !== productId);
      return newWishlist;
    });
  };

  const isWishlisted = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}; 