import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SecondaryButton from "@/components/SecondaryButton";
import Logo from "@/assets/svgs/LogoLG2.svg"


const SellerGetStarted = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Logo */}
        {/* Image */}
        <View className="w-full h-[250px] items-center justify-center mb-8">
        <Logo width={400} height={400} />
      </View>
      

      {/* Title */}
      <Text className="text-Heading3 text-text  text-center mb-4">
        Welcome To Seller Mode
      </Text>

      {/* Subtitle */}
      <Text className="text-BodySmallRegular w-[303px] text-neutral-60 text-center mb-12">
        Start selling your products on Swift Mall. Just a few quick steps to set
        up your shop.
      </Text>

      {/* Get Started Button */}
      <SecondaryButton BtnText="Get Started" onPress={()=>{router.push("/(seller_dashboard)/SellerRegister1")}} />
    </View>
  );
};

export default SellerGetStarted;
