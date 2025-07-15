import React from "react";
import { View, SafeAreaView } from "react-native";
import { Stack } from "expo-router";

const SellerDashboardLayout = () => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <View className="flex-1">
        {/* Stack Navigator */}
        <Stack
          screenOptions={{
           headerShown: false,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SellerDashboardLayout;