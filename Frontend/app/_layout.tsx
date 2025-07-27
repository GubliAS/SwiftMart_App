import { View } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { Stack } from "expo-router";
import { CartProvider } from "./context/_CartContext";
import { SearchProvider } from "@/components/SearchContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { UserProvider } from '@/context/UserContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { PaymentMethodsProvider } from "@/context/PaymentMethodsContext";
import { FeedProvider } from './context/FeedContext';
import { AuthProvider } from '@/context/AuthContext';
import { CheckoutProvider } from '../context/_CheckoutContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    return () => {
    };
  }, []);

  const [fontsLoaded] = useFonts({
    Manrope: require("@/assets/fonts/Manrope-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  const devKey = __DEV__ ? Date.now() : undefined;

  return (
    <ActionSheetProvider>
      <AuthProvider key={devKey}>
        <UserProvider>
          <WishlistProvider>
            <NotificationProvider>
              <SearchProvider>
                <CartProvider>
                  <PaymentMethodsProvider>
                    <FeedProvider>
                      <CheckoutProvider>
                        <View className="font-Manrope" style={{ flex: 1 }}>
                          <StatusBar style="dark" />
                          <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="+not-found" />
                          </Stack>
                        </View>
                      </CheckoutProvider>
                    </FeedProvider>
                  </PaymentMethodsProvider>
                </CartProvider>
              </SearchProvider>
            </NotificationProvider>
          </WishlistProvider>
        </UserProvider>
      </AuthProvider>
    </ActionSheetProvider>
  );
}
