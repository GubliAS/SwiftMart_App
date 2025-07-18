// SellerFinished.tsx
// This is the final onboarding screen. It congratulates the seller and navigates to the dashboard home.

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SecondaryButton from "@/components/SecondaryButton";
import Logo from "@/assets/svgs/LogoLG2.svg"


const SellerFinished = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
     {/* Image */}
     <View className="w-full h-[250px] items-center justify-center mb-8">
        <Logo width={350} height={350} />
      </View>

      {/* Title */}
      <Text className="text-Heading3 text-text  text-center mb-4">
        Your Store Is Ready
      </Text>

      {/* Subtitle */}
      <Text className="text-BodySmallRegular w-[303px] text-neutral-60 text-center mb-12">
        You can now list products, manage orders, and track sales.
      </Text>

      {/* Get Started Button */}
      <SecondaryButton
        BtnText="Go to Seller Dashboard"
        onPress={() => {
          router.push("/(root)/(tabs)/Home");
        }}
      />
    </View>
  );
};

export default SellerFinished;
