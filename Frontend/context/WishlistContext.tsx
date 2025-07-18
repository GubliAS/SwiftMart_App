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

  // Debug: Log wishlist changes
  useEffect(() => {
    console.log('Wishlist state changed:', wishlist);
  }, [wishlist]);

  const addToWishlist = (product: WishlistProduct) => {
    console.log('Wishlist before add:', wishlist);
    setWishlist((prev) => {
      const newWishlist = prev.some((p) => p.id === product.id) ? prev : [...prev, product];
      console.log('Wishlist after add:', newWishlist);
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId: number) => {
    console.log('Wishlist before remove:', wishlist);
    setWishlist((prev) => {
      const newWishlist = prev.filter((p) => p.id !== productId);
      console.log('Wishlist after remove:', newWishlist);
      return newWishlist;
    });
  };

  const isWishlisted = (productId: number) => {
    const result = wishlist.some((p) => p.id === productId);
    console.log(`Checking if product ${productId} is wishlisted:`, result);
    return result;
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