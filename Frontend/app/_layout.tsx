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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  return (
    <WishlistProvider>
      <NotificationProvider>
    <SearchProvider>
      <CartProvider>
        <View className="font-Manrope" style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(root)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </CartProvider>
    </SearchProvider>
      </NotificationProvider>
    </WishlistProvider>
  );
}
