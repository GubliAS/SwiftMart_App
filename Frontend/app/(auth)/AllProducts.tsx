import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

const AllProductsScreen = () => {
  const productImage = require("@/assets/images/Ereko.png");

  const renderCard = (
    status: string,
    stock: number,
    textColor: string,
    borderColor: string
  ) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-md">
      <View className="flex-row justify-between">
        <Image
          source={productImage}
          className="w-20 h-20 rounded-lg"
          resizeMode="contain"
        />

        <View className="flex-1 ml-4">
          <Text className="text-base font-bold">EKERÖ</Text>
          <Text className="text-lg font-bold">$230.00</Text>
          <Text className="text-sm text-gray-500">Home & Living</Text>
          <Text className="text-xs text-gray-400 mt-1">Stock: {stock}</Text>
        </View>

        <View
          className={`px-2 py-1 border rounded-full ${borderColor}`}
        >
          <Text className={`text-xs ${textColor}`}>{status}</Text>
        </View>
      </View>

      <Pressable className="mt-4 border border-yellow-500 rounded-xl py-2 items-center">
        <Text className="text-yellow-600 font-semibold">✏️ Edit</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-6">
      {/* Back Arrow */}
      <Pressable onPress={() => router.back()} className="mb-4 w-10">
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderCard("Active", 35, "text-green-600", "border-green-600")}
        {renderCard("Low Stock", 9, "text-yellow-600", "border-yellow-600")}
        {renderCard("Out of Stock", 0, "text-red-500", "border-red-500")}
        {renderCard("Archived", 0, "text-gray-400", "border-gray-400")}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllProductsScreen;
