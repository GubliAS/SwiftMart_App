import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

interface PromoCardProps {
  title: string;
  subtitle: string;
  timer: string;
  cta: string;
  bgColor: string;
  onPress: () => void;
}

const PromoCard = ({ title, subtitle, timer, cta, bgColor, onPress }: PromoCardProps) => {
  return (
    <View className="w-[335px]  rounded-[14px] mb-4 overflow-hidden"
    style={{
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <LinearGradient
        colors={["rgba(235, 182, 91, 0.39)", "rgba(235, 182, 91, 0.18)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View className="p-4 ">
            <View className="flex-row gap-2 items-center">
            <View className="w-4 h-4 rounded-full bg-primary"/>
        <Text className="text-BodyBold text-text font-Manrope">SwiftMart Promo</Text>
            </View>
        <Text className="text-Heading2 font-Manrope text-text ">{title}</Text>
        <Text className="text-BodyBold text-text  font-Manrope">{subtitle}</Text>
        <Text className="text-BodySmallBold text-secondary mb-4 font-Manrope">{timer}</Text>
        <SecondaryButton BtnText={cta} onPress={onPress} />    
        </View>
        </LinearGradient>
    </View>
  );
};

export default PromoCard; 