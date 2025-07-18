import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { router } from "expo-router";
import React from "react";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/assets/svgs/LogoLG2.svg"

const GetStarted = () => {
  return (
    <SafeAreaView className="flex-1 font-Manrope justify-center items-center gap-8 px-4 bg-neutral-10">
      {/* Image */}
      <View className="w-full h-[250px] items-center justify-center">
        <Logo width={450} height={450} />
      </View>
     

      
     
      {/* TextBox */}
      <View className="items-center w-[335px] gap-8">
        <Text className="text-Heading3 text-text text-center  font-Manrope">
          Your one-stop shop for everything you love
        </Text>
        <Text className="text-Heading5 font-Manrope text-text tracking-tight">
          Are you a buyer or seller?
        </Text>
      </View>
      {/* Buttons */}
      <View className="flex w-full gap-2">
        <PrimaryButton
          BtnText="Buyer"
          onPress={() => router.push("/BuyerRegister")}
        />
        <SecondaryButton
          BtnText="Seller"
          onPress={() => router.push("/SellerRegister1")}
        />
      </View>
      {/* Text */}
      <View className="flex-row items-center justify-center">
        <Text className="text-BodyRegular text-text font-Manrope">
          Already have an account?{" "}
        </Text>
        <Pressable onPress={() => router.push("/Login")}>
          <Text className="text-primary text-BodyRegular font-Manrope">Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default GetStarted;
