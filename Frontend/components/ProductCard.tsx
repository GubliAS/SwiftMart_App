import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export interface ProductCardProps {
  image: any; // Replace `any` with the correct type for your image source
  name: string;
  price: number;
  originalPrice: number;
  discount?: number; // Optional discount
  rating: string;
  width?: string | number; // Optional width
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  originalPrice,
  discount,
  rating,
  width = "152px", // Default width if not provided
}) => {
  return (
    <View

      className={`h-[246px] p-4 gap-[10px] bg-white rounded-[14px] overflow-hidden`}
      style={{
        width: typeof width === "string" ? parseInt(width, 10) : width, // Ensure width is a number
        boxShadow: "0px 2px 24px 0px rgba(0, 0, 0, 0.10)",
      }}
    >
      {/* Product Image */}
      <View className="relative">
        <Image
          source={image}
          className="w-full h-[113px] object-cover"
          resizeMode="cover"
        />
        {/* Discount Badge */}
        {discount && (
          <View className="absolute bottom-0 h-[20px] left-1 bg-alert px-2 py-1 rounded-tl-[10px] rounded-br-[10px]">
            <Text className="text-white text-[10px] font-semibold">
              {discount}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View className="px-2 py-2 gap-1 flex">
        <Text className="text-BodySmallRegular text-text" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-Heading4 text-text">${price.toFixed(2)}</Text>
        <Text className="text-Caption text-text line-through">
          ${originalPrice.toFixed(2)}
        </Text>
        {/* Rating */}
        <View className="flex-row items-center gap-1">
          <AntDesign name="star" size={14} color="#EBB65B" />
          <Text className="text-Caption text-text">{rating}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
