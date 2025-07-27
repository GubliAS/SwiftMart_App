// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import * as SecureStore from "expo-secure-store";
// import { jwtDecode } from "jwt-decode";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ActivityIndicator, View } from 'react-native';

// interface AuthContextType {
//   token: string | null;
//   role: string | null;
//   login: (token: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// function getRoleFromToken(token: string | null): string | null {
//   if (!token) return null;
//   try {
//     const decoded: any = jwtDecode(token);
//     // Adjust this if your JWT uses a different claim for role
//     return decoded.role || decoded.roles?.[0] || null;
//   } catch {
//     return null;
//   }
// }

// // Function to clear user-specific data
// const clearUserData = async () => {
//   try {
//     await Promise.all([
//       AsyncStorage.removeItem('SELECTED_CART_ID'),
//       AsyncStorage.removeItem('payment_methods'),
//       AsyncStorage.removeItem('addresses'),
//       AsyncStorage.removeItem('checkout_address'),
//       AsyncStorage.removeItem('checkout_payment_method'),
//     ]);
//     console.log("User data cleared");
//   } catch (error) {
//     console.error('Error clearing user data:', error);
//   }
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     SecureStore.getItemAsync("token").then((storedToken) => {
//       console.log("Loaded token from SecureStore:", storedToken);
//       setToken(storedToken);
//       setRole(getRoleFromToken(storedToken));
//       setLoading(false);
//     });
//   }, []);

//   const login = async (newToken: string) => {
//     try {
//       // Clear any existing user data before setting new token
//       await clearUserData();
//       await SecureStore.setItemAsync("token", newToken);
//       setToken(newToken);
//       setRole(getRoleFromToken(newToken));
//     } catch (error) {
//       console.error('Error during login:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       // Clear all user data on logout
//       await clearUserData();
//       await SecureStore.deleteItemAsync("token");
//       setToken(null);
//       setRole(null);
//     } catch (error) {
//       console.error('Error during logout:', error);
//       throw error;
//     }
//   };

//   if (loading) return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <ActivityIndicator size="large" color="#156651" />
//     </View>
//   );

//   return (
//     <AuthContext.Provider value={{ token, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// }; 


//////////////////////////////////////////////////////////////////////////////////////////////////////
                      ///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                         /////////////////////////////////////////////////////////////////////////////////////

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.role || decoded.roles?.[0] || null;
  } catch {
    return null;
  }
}

// ✅ Function to clear user-specific data (guest cart cleared only when needed)
const clearUserData = async (includeGuestCart = false) => {
  try {
    const itemsToClear = [
      AsyncStorage.removeItem("SELECTED_CART_ID"),
      AsyncStorage.removeItem("payment_methods"),
      AsyncStorage.removeItem("addresses"),
      AsyncStorage.removeItem("checkout_address"),
      AsyncStorage.removeItem("checkout_payment_method"),
    ];

    if (includeGuestCart) {
      itemsToClear.push(AsyncStorage.removeItem("guest_cart"));
    }

    await Promise.all(itemsToClear);
    console.log(
      "User data cleared",
      includeGuestCart ? "(including guest cart)" : ""
    );
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((storedToken) => {
      console.log("Loaded token from SecureStore:", storedToken);
      setToken(storedToken);
      setRole(getRoleFromToken(storedToken));
      setLoading(false);
    });
  }, []);

  const login = async (newToken: string) => {
    try {
      // ✅ Keep guest cart intact for merging, only clear other user data
      await clearUserData(false);
      await SecureStore.setItemAsync("token", newToken);
      setToken(newToken);
      setRole(getRoleFromToken(newToken));
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // ✅ Clear everything on logout, including guest cart
      await clearUserData(true);
      await SecureStore.deleteItemAsync("token");
      setToken(null);
      setRole(null);

      
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#156651" />
      </View>
    );

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
