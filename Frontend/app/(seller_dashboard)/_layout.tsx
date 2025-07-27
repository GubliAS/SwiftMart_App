// _layout.tsx
// This file sets up the layout and navigation stack for the seller dashboard.
// It wraps all seller dashboard screens in Promo, Payout, and Notification context providers.
// The Stack defines all seller dashboard screens and disables the default header.

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { PromoProvider } from "@/context/PromoContext";
import { PayoutProvider } from "@/context/PayoutContext";
import { NotificationProvider } from "@/context/NotificationContext";

const SellerDashboardLayout = () => {
  return (
    <PromoProvider>
      <PayoutProvider>
        <NotificationProvider>
          <SafeAreaView className="flex-1 bg-neutral-10">
            <View className="flex-1">
              {/* Stack Navigator */}
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="SellerSettings" />
                <Stack.Screen name="PayoutSelection" />
                <Stack.Screen name="AddPayoutOption" />
                <Stack.Screen name="SellerFinished" />
                <Stack.Screen name="SellerGetStarted" />
                <Stack.Screen name="SellerRegister1" />
                <Stack.Screen name="CardDetails" />
                <Stack.Screen name="MobileMoneyDetails" />
                <Stack.Screen name="Promotions" />
                <Stack.Screen name="PromotionDetails" />
              </Stack>
            </View>
          </SafeAreaView>
        </NotificationProvider>
       </PayoutProvider>
    </PromoProvider>
  );
};

export default SellerDashboardLayout;