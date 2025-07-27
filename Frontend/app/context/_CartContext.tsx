import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/constants/env";
import { ActivityIndicator, View } from "react-native";

// Cart service URL
const CART_SERVICE_URL = BASE_URL.replace(":8080", ":8089");

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
  size?: string | null;
  productItemId?: string | number;
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
  updateItemQuantity: (
    cartId: string,
    productItemId: string | number,
    amount: number,
    size: string | null
  ) => void;
  addItemToCart: (cartId: string, item: CartItem) => void;
  selectCart: (id: string) => void;
  handleRemovePerson: (cartId: string, person: string) => void;
  cartReady: boolean;
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
  const { token } = useAuth();
  const { user } = useUser();
  const [carts, setCarts] = useState<Cart[]>(DEFAULT_CARTS);
  const [selectedCartId, setSelectedCartId] = useState("default");
  const [loading, setLoading] = useState(true);
  // Track if initial load is done
  const [initialLoad, setInitialLoad] = useState(true);
  const [cartReady, setCartReady] = useState(false);

  // Helper: fetch backend carts (all for user)
  const fetchBackendCarts = async (userEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${CART_SERVICE_URL}/api/cart/user/${userEmail}`,
        {
        headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched backend carts:", data);
        setCarts(data);
        // Immediately set the selected cart after carts are loaded
        setTimeout(() => {
          const selectedCart = data.find((cart: Cart) => cart.id === selectedCartId);
          const needsAutoSelect =
            !selectedCart ||
            selectedCartId === "default" ||
            selectedCartId === undefined ||
            selectedCartId === null;
          if (needsAutoSelect) {
            const myCart = data.find((cart: Cart) => cart.name === "My Cart");
            if (myCart && myCart.id) {
          setSelectedCartId(myCart.id.toString());
        } else if (data.length > 0) {
          setSelectedCartId(data[0].id.toString());
        }
          }
        }, 0);
      } else {
        const err = await res.text();
        console.error("Error fetching backend carts:", err);
      }
    } catch (e) {
      console.error("Error fetching backend carts:", e);
    } finally {
      setLoading(false);
    }
  };

  // On login, fetch all backend carts and clear guest cart
  // useEffect(() => {
  //   setInitialLoad(true);
  //   setCartReady(false);
  //   if (token && user && user.email) {
  //     const initializeUserCarts = async () => {
  //       // 1. Load guest cart from AsyncStorage
  //       let guestCarts: Cart[] = [];
  //       try {
  //         const savedCarts = await AsyncStorage.getItem("USER_CARTS");
  //         if (savedCarts) {
  //           guestCarts = JSON.parse(savedCarts);
  //         }
  //       } catch (e) {
  //         guestCarts = [];
  //       }
  //       let mergedCarts = [];
  //       // 2. If guest carts exist, merge them via backend
  //       if (guestCarts.length > 0) {
  //         console.log(
  //           "[Cart Merge] Sending guest carts to backend:",
  //           guestCarts
  //         );
  //         const mergePayload = {
  //           userEmail: user.email,
  //           guestCarts: guestCarts.map((gc) => ({
  //             name: gc.name,
  //             items: gc.items.map((item) => ({
  //               productItemId: Number(item.productItemId || item.id),
  //               quantity: item.quantity,
  //               size: item.size ?? null,
  //             })),
  //           })),
  //         };

  //         // Detailed logging before fetch
  //         const mergeUrl = `${CART_SERVICE_URL}/api/cart/merge`;
  //         const mergeHeaders = {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         };
  //         console.log("[Cart Merge] About to POST", {
  //           url: mergeUrl,
  //           headers: mergeHeaders,
  //           body: mergePayload,
  //         });

  //         try {
  //           const res = await fetch(mergeUrl, {
  //             method: "POST",
  //             headers: mergeHeaders,
  //             body: JSON.stringify(mergePayload),
  //           });

  //           console.log("[Cart Merge] Merge response status:", res.status);
  //           let data = null;
  //           try {
  //             data = await res.json();
  //           } catch (e) {
  //             data = null;
  //           }
  //           console.log("[Cart Merge] Merge response data:", data);

  //           if (res.ok) {
  //             const mergedCarts = data;
  //             console.log("[Cart Merge] Backend carts after merge:", mergedCarts);
  //             setCarts(mergedCarts);
  //           } else {
  //             console.error("[Cart Merge] Backend merge failed:", data);
  //           }
  //         } catch (e) {
  //           console.error("[Cart Merge] Network or code error:", e);
  //         }
  //         // Clear guest cart from AsyncStorage
  //         await AsyncStorage.removeItem("USER_CARTS");
  //         await AsyncStorage.removeItem("SELECTED_CART_ID");
  //       } else {
  //         // 3. If no guest carts, just fetch backend carts
  //         const res = await fetch(
  //           `${CART_SERVICE_URL}/api/cart/user/${user.email}`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         if (res.ok) {
  //           mergedCarts = await res.json();
  //         }
  //       }
  //       setCarts(mergedCarts);
  //       // Always select 'My Cart' if it exists, otherwise first cart
  //       let myCart = mergedCarts.find((cart: Cart) => cart.name === "My Cart");
  //       if (myCart && myCart.id && myCart.id !== "default") {
  //         setSelectedCartId(myCart.id.toString());
  //       } else if (mergedCarts.length > 0 && mergedCarts[0].id !== "default") {
  //         setSelectedCartId(mergedCarts[0].id.toString());
  //       }
  //       // If no carts exist, create a default cart
  //       if (mergedCarts.length === 0) {
  //         const newCart = await createCart("My Cart");
  //         if (newCart) {
  //           setCarts([newCart]);
  //           setSelectedCartId(newCart.id.toString());
  //         }
  //       }
  //       setCartReady(true);
  //       setLoading(false);
  //       setInitialLoad(false);
  //     };
  //     initializeUserCarts();
  //   } else {
  //     // Guest: always reset to default cart on logout
  //     setCarts(DEFAULT_CARTS);
  //     setSelectedCartId("default");
  //     setCartReady(true); // <-- Ensure this is synchronous and immediate
  //     setLoading(false);
  //     setInitialLoad(false);
  //   }
  // }, [token, user]);
  const hasMergedRef = useRef(false); // ✅ Synchronous guard

  useEffect(() => {
  let isCancelled = false;

      const initializeUserCarts = async () => {
    if (!token || !user?.email) return;

    // ✅ 1. Prevent immediate duplicate merges (Strict Mode safe)
    if (hasMergedRef.current) {
      console.log("[Cart Merge] Skipping duplicate merge this session");
      await fetchBackendCarts(user.email);

      setCartReady(true);
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    hasMergedRef.current = true; // ✅ Set before async work begins
    // ✅ Remove guest selected cart to avoid wrong default
await AsyncStorage.removeItem("SELECTED_CART_ID");


    try {
      const savedCarts = await AsyncStorage.getItem("USER_CARTS");
      const guestCarts: Cart[] = savedCarts ? JSON.parse(savedCarts) : [];

      if (guestCarts.length > 0) {
        console.log("[Cart Merge] Merging guest carts into backend...");

        const mergePayload = {
          userEmail: user.email,
          guestCarts: guestCarts.map((gc) => ({
            name: gc.name,
            items: gc.items.map((item) => ({
              productItemId: Number(item.productItemId || item.id),
              quantity: item.quantity,
              size: item.size ?? null,
            })),
          })),
        };

        try {
          const res = await fetch(`${CART_SERVICE_URL}/api/cart/merge`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(mergePayload),
          });

          if (!res.ok) {
            console.error("[Cart Merge] Merge failed:", await res.text());
          } else {
            console.log("[Cart Merge] Merge successful");
           
          }
        } catch (e) {
          console.error("[Cart Merge] Network error:", e);
        }

        await AsyncStorage.multiRemove(["USER_CARTS", "SELECTED_CART_ID"]);
                } else {
        console.log("[Cart Merge] No guest carts to merge");
      }

      await fetchBackendCarts(user.email);
    } catch (e) {
      console.error("[Cart Init] Error:", e);
    }

    if (!isCancelled) {
        setCartReady(true);
      setLoading(false);
      setInitialLoad(false);
    }
  };

  if (token && user?.email) {
    setInitialLoad(true);
    setCartReady(false);
    initializeUserCarts();
  } else {
    // ✅ Guest Mode
    setCarts(DEFAULT_CARTS);
    setSelectedCartId("default");
    setCartReady(true);
    setLoading(false);
    setInitialLoad(false);

    // ✅ Reset guard on logout
    hasMergedRef.current = false;
  }

  return () => {
    isCancelled = true;
  };
  }, [token, user]);

  // Add this effect after all state and context declarations
useEffect(() => {
  // Only run for logged-in users
  if (!token || !user?.email) return;
  if (!carts || carts.length === 0) return;

  // If selectedCartId is missing, invalid, or 'default', select 'My Cart' or the first cart
  const selectedCart = carts.find((cart) => cart.id === selectedCartId);
  if (
    !selectedCart ||
    selectedCartId === "default" ||
    selectedCartId === undefined ||
    selectedCartId === null
  ) {
    const myCart = carts.find((cart) => cart.name === "My Cart");
    if (myCart && myCart.id) {
      setSelectedCartId(myCart.id.toString());
    } else if (carts.length > 0) {
      setSelectedCartId(carts[0].id.toString());
    }
  }
}, [carts, token, user?.email, selectedCartId]);

  // Remove the robust cart selection effect (the useEffect that auto-selects based on carts/selectedCartId)

  

  // Save guest cart to AsyncStorage
  useEffect(() => {
    if (!token) {
      const saveData = async () => {
        try {
          await Promise.all([
            AsyncStorage.setItem("USER_CARTS", JSON.stringify(carts)),
            AsyncStorage.setItem("SELECTED_CART_ID", String(selectedCartId)),
          ]);
        } catch (error) {
          console.error("Error saving cart data:", error);
        }
      };
      saveData();
    } else {
      // ✅ Ensure guest selection never persists after login
      AsyncStorage.removeItem("SELECTED_CART_ID");
    }
    
  }, [carts, selectedCartId, token]);

  // Backend create cart
  const createCart = async (name: string) => {
    if (!token || !user.email) return null;
    try {
      const res = await fetch(`${CART_SERVICE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, createdBy: user.email }),
      });
      if (res.ok) {
        await fetchBackendCarts(user.email);
        // Find the new cart by name
        const latestRes = await fetch(
          `${CART_SERVICE_URL}/api/cart/user/${user.email}`,
          {
          headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (latestRes.ok) {
          const carts = await latestRes.json();
          const newCart = carts.find((c: any) => c.name === name);
          if (newCart) setSelectedCartId(newCart.id.toString());
          console.log("Created new cart:", newCart);
          return newCart;
        }
      } else {
        const err = await res.text();
        console.error("Backend create cart failed:", err);
      }
    } catch (e) {
      console.error("Error creating backend cart:", e);
    }
    return null;
  };

  // Backend remove item
  const removeItemFromBackendCart = async (itemId: string) => {
    const currentSelectedId = selectedCartId; // Remember current selection
    try {
      const res = await fetch(`${CART_SERVICE_URL}/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchBackendCarts(user.email);
        // Restore the selection after fetching
        setSelectedCartId(currentSelectedId);
      }
    } catch (e) {
      console.error("Error removing item from backend cart:", e);
    }
  };

  // Backend update quantity (by removing and re-adding for simplicity)
  const updateItemQuantityBackend = async (
    cartId: string,
    itemId: string,
    amount: number
  ) => {
    // Find the item
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return;
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;
    // Remove then add with new quantity
    await removeItemFromBackendCart(itemId);
    await addItemToBackendCart(cartId, {
      ...item,
      quantity: item.quantity + amount,
      size: item.size ?? null,
    });
  };

  // Backend add item to cart
  const addItemToBackendCart = async (cartId: string, item: CartItem) => {
    const currentSelectedId = selectedCartId; // Remember current selection
    // Find if item already exists in the cart
    const cart = carts.find((c) => c.id === cartId);
    let existing = null;
    if (cart) {
      existing = cart.items.find(
        (i) =>
        (i.productItemId || i.id) == (item.productItemId || item.id) &&
        (i.size ?? null) === (item.size ?? null)
      );
    }
    const newQty = existing ? existing.quantity + item.quantity : item.quantity;
    try {
      const res = await fetch(
        `${CART_SERVICE_URL}/api/cart/${Number(cartId)}/items`,
        {
          method: "POST",
        headers: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productItemId: Number(item.productItemId || item.id),
          qty: newQty,
          size: item.size ?? null,
        }),
        }
      );
      if (res.ok) {
        await fetchBackendCarts(user.email);
        setSelectedCartId(currentSelectedId);
        console.log("Added item to backend cart:", item);
      } else {
        const err = await res.text();
        console.error("Backend add item to cart failed:", err);
      }
    } catch (e) {
      console.error("Error adding item to backend cart:", e);
    }
  };

  // Backend delete cart
  const deleteBackendCart = async (cartId: string) => {
    try {
      const res = await fetch(
        `${CART_SERVICE_URL}/api/cart/${Number(cartId)}`,
        {
          method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        await fetchBackendCarts(user.email);
        if (selectedCartId === cartId) {
          setSelectedCartId(carts.length > 0 ? carts[0].id : "default");
        }
      } else {
        const err = await res.text();
        console.error("Backend delete cart failed:", err);
      }
    } catch (e) {
      console.error("Error deleting backend cart:", e);
    }
  };

  // Context methods
  const addCart = async (name: string) => {
    if (token) {
      return await createCart(name);
    }
    // Use a robust unique ID
    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newCart: Cart = {
      id: uniqueId,
      name,
      items: [],
      invited: [],
    };
    setCarts((prev) => [...prev, newCart]);
    setSelectedCartId(newCart.id); // Automatically select new cart
    return newCart;
  };

  const removeCart = (id: string) => {
    if (token) {
      const cart = carts.find((c) => c.id === id);
      if (cart && cart.name === "My Cart") {
        alert("You cannot delete your main cart.");
        return;
      }
      deleteBackendCart(id);
      return;
    }
    if (id === "default") return;
    setCarts((prev) => prev.filter((cart) => cart.id !== id));
    if (selectedCartId === id) {
      setSelectedCartId("default");
    }
  };

  const selectCart = (id: string) => {
    setSelectedCartId(id);
  };

  const updateItemQuantity = (
    cartId: string,
    productItemId: string | number,
    amount: number,
    size: string | null
  ) => {
    console.log(
      "[updateItemQuantity] loading:",
      loading,
      "selectedCartId:",
      selectedCartId,
      "cartId:",
      cartId,
      "productItemId:",
      productItemId,
      "amount:",
      amount,
      "size:",
      size
    );
    if (loading || !cartReady) {
      console.warn("[updateItemQuantity] Blocked: Cart not ready");
      return;
    }
    
    if (token) {
      // Find the backend item by productItemId and size
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return;
      const item = cart.items.find(
        (i) =>
          (i.productItemId || i.id) == productItemId &&
          (i.size ?? null) === (size ?? null)
      );
      if (!item) return;

      const newQuantity = item.quantity + amount;
      // Only proceed if the new quantity is valid
      if (newQuantity > 0) {
        const currentSelectedId = selectedCartId;
        fetch(`${CART_SERVICE_URL}/api/cart/${Number(cartId)}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productItemId: Number(productItemId),
            qty: newQuantity,
            size: size ?? null,
          }),
        })
          .then(async (res) => {
          if (res.ok) {
            await fetchBackendCarts(user.email);
            setSelectedCartId(currentSelectedId);
          } else {
            const err = await res.text();
              console.error("Backend update quantity failed:", err);
          }
          })
          .catch((e) => {
            console.error("Error updating quantity:", e);
        });
      } else if (amount < 0) {
        // Remove logic as before (by cart item id)
        if (item.id) removeItemFromBackendCart(item.id);
      }
    } else {
      setCarts((prev) =>
        prev.map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                items: cart.items
                  .map((item) =>
                    (item.productItemId || item.id) == productItemId &&
                    (item.size ?? null) === (size ?? null)
                      ? { ...item, quantity: item.quantity + amount }
                      : item
                  )
                  .filter((item) => item.quantity > 0),
              }
            : cart
        )
      );
    }
  };

  // 'My Cart' is the same cart for both guest and logged-in users; items merge on login
  const isGuest = !token;
  const addItemToCart = async (cartId: string, item: CartItem) => {
    console.log(
      "[addItemToCart] loading:",
      loading,
      "selectedCartId:",
      selectedCartId,
      "cartId:",
      cartId,
      "item:",
      item
    );
    if (loading || !cartReady) {
      console.warn("[updateItemQuantity] Blocked: Cart not ready");
      return;
    }
    
    if (token) {
      await addItemToBackendCart(cartId, item);
    } else {
      setCarts((prev) =>
        prev.map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                items: cart.items.some((i) => i.id === item.id)
                  ? cart.items.map((i) =>
                      i.id === item.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                    )
                  : [...cart.items, item],
              }
            : cart
        )
      );
      console.log("Added item to guest cart:", item);
    }
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

  if (loading && initialLoad)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#156651" />
    </View>
  );

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
        cartReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
