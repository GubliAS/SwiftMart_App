import React from "react";
import { View, Text } from "react-native";
import SecondaryButton from "./SecondaryButton";
import IconButton from "./IconButton";
import PlusCircleIcon from "@/assets/svgs/plus-circle.svg"

interface JoinedPromoCardProps {
  title: string;
  subtitle: string;
  sales: string;
  orders: number;
  status: string;
  cta: string;
  bgColor: string;
  onPress: () => void;
  onAddMore?: () => void;
}

const JoinedPromoCard = ({ 
  title, 
  subtitle, 
  sales, 
  orders, 
  status, 
  cta, 
  onPress, 
  onAddMore
}: JoinedPromoCardProps) => {
  // Get status styling based on status value
  const getStatusStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          borderColor: "border-secondary",
          textColor: "text-secondary"
        };
      case "active":
        return {
          borderColor: "border-primary",
          textColor: "text-primary"
        };    
      default:
        return {
          borderColor: "border-neutral-60",
          textColor: "text-neutral-60"
        };
    }
  };

  const statusStyling = getStatusStyling(status);

  return (
    <View className={`rounded-[14px] border gap-2 border-neutral-30 p-4 bg-neutral-10 `} 
    style={{
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <View>
      <View className="flex-row justify-between items-center ">
        <Text className="text-Caption text-neutral-60 font-Manrope">SwiftMart Promo</Text>
        <View className={`px-2 py-1 rounded-[8px] border ${statusStyling.borderColor}`}>
          <Text className={`text-Caption ${statusStyling.textColor} font-Manrope`}>{status}</Text>
        </View>
      </View>
      <Text className="text-Heading3 font-Manrope text-text">{title}</Text>
      <Text className="text-BodyBold text-text font-Manrope">{subtitle}</Text>   
        </View>   
        <View className="flex-row items-center " style={{gap:64}}>
        <View className="gap-2">
          <Text className="text-Caption text-neutral-70 font-Manrope">Sales</Text>
          <Text className="text-BodyBold text-text font-Manrope">{sales}</Text>
        </View>
        <View className="gap-2">
          <Text className="text-Caption text-neutral-70 font-Manrope">Orders</Text>
          <Text className="text-BodyBold text-text font-Manrope">{orders}</Text>
        </View>
      </View>
      <View className="flex-row gap-4">
<View className="flex-1">
      <SecondaryButton  BtnText={cta} onPress={onPress} />
</View>
<View className="flex-1">
      <IconButton BtnText="Add More" IconComponent={PlusCircleIcon} bgColor="bg-neutral-10"  borderColor="border-secondary" textColor="text-secondary" fillColor="#EBB65B" onPress={onAddMore} />
</View>
      </View>
    </View>
  );
};

export default JoinedPromoCard; 