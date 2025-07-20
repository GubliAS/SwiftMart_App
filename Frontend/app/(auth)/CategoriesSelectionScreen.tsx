import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const categories = [
  "Home & Living",
  "Electronics & Devices",
  "Sports & Fitness",
  "Computer & Accessories",
  "Beauty & Personal Care",
  "Office & Stationary",
  "Fashion",
  "Automative & Tools",
  "Groceries & Essentials",
  "Kids & Toys",
];

const CategorySelectionScreen = () => {
  const router = useRouter();

  const handleSelect = (category: string) => {
    // Navigate back to AddProductScreen with the selected category
    router.replace({
      pathname: "/AddProductScreen",
      params: { selectedCategory: category },
    });
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Pressable onPress={() => router.back()} className="mb-6">
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <ScrollView>
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => handleSelect(category)}
            className="py-3 border-b border-gray-200"
          >
            <Text className="text-base text-gray-800">{category}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySelectionScreen;