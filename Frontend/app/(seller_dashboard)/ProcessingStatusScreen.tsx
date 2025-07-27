import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProcessingStatusScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Back Arrow */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        {/* Header */}
        <Text className="text-lg font-bold text-center mb-4">
          Order #SWM93284
        </Text>

        {/* Status box */}
        <View className="bg-yellow-50 p-4 rounded-2xl mb-6">
          <View className="flex-row justify-between mb-2">
            <View>
              <Text className="text-xs text-gray-500">Status</Text>
              <Text className="font-bold text-base text-yellow-800">Pending</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Date</Text>
              <Text className="font-bold text-base">June 15, 2025</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Time</Text>
              <Text className="font-bold text-base">10:23</Text>
            </View>
          </View>

          <Text className="text-sm font-medium text-gray-600 mb-2">Change Status</Text>

          <View className="flex-row gap-2">
            <Pressable className="flex-1 bg-secondary py-2 rounded-lg items-center">
              <Text className="text-white font-semibold">Processing</Text>
            </Pressable>
            <Pressable className="flex-1 bg-yellow-400 py-2 rounded-lg items-center">
              <Text className="text-white font-semibold">Shipped</Text>
            </Pressable>
          </View>
        </View>

        {/* Customer Info */}
        <Text className="text-base font-semibold mb-2">Customer Information</Text>
        <View className="bg-gray-100 p-4 rounded-xl mb-4">
          <Text className="font-medium text-gray-800">John Smith</Text>
          <Text className="text-gray-600">johnsmith@example.com</Text>
          <Text className="text-gray-600">+233 50 284 5656</Text>
        </View>

        {/* Shipping Address */}
        <Text className="text-base font-semibold mb-2">Shipping Address</Text>
        <View className="bg-gray-100 p-4 rounded-xl mb-4">
          <Text className="font-medium text-gray-800">John Smith</Text>
          <Text className="text-gray-600">Kumasi, KNUST</Text>
          <Text className="text-gray-600">Ghana</Text>
        </View>

        {/* Order Items */}
        <Text className="text-base font-semibold mb-2">Order Items</Text>

        {[1, 2].map((_, index) => (
          <View
            key={index}
            className="flex-row items-center bg-white p-4 mb-4 rounded-xl shadow-sm"
          >
            <Image
              source={
                index === 0
                  ? require("@/assets/images/yellow-chair.png")
                  : require("@/assets/images/yellow-chair.png")
              }
              className="w-16 h-16 rounded-lg mr-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              {/* Removed the line that displayed "EKERÖ" */}
              {/* <Text className="font-semibold text-gray-800">EKERÖ</Text> */}
              <Text className="text-gray-800 font-bold">$230.00</Text>
              <Text className="text-gray-500 text-sm">Yellow</Text>
              <Text className="text-xs text-gray-500">Qty: 1</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProcessingStatusScreen;