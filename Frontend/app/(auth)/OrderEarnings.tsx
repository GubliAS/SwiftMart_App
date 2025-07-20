import { Feather, Ionicons } from "@expo/vector-icons"; // Feather for the withdrawal icon
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";

export default function EarningsScreen() {
  const router = useRouter();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Last Month");

  const balanceStats = [
    { label: "Pending", value: "$545.56" },
    { label: "Last Payout", value: "$1,980.00" },
    { label: "This Month", value: "$4,980.55" },
  ];

  const timePeriods = ["Last Month", "Last 3 Months", "This Year", "Total"];

  const paymentHistory = [
    { type: "payment", description: "Order Payment", orderId: "#SWM93284", amount: "+$274.13" },
    { type: "withdrawal", description: "Withdrawal", method: "VISA", amount: "-$1,274.13" },
    { type: "payment", description: "Order Payment", orderId: "#SWM93284", amount: "+$274.13" },
    { type: "payment", description: "Order Payment", orderId: "#SWM93284", amount: "+$274.13" },
    // Add more dummy data as needed
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-center mb-4 relative py-3"
        style={{ backgroundColor: '#F9F9F9', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
      >
        <Pressable onPress={() => router.back()} className="absolute left-4 p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-xl font-bold">Earnings</Text>
        <View className="w-10"></View> {/* Spacer to center title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Available Balance Section */}
        <View className="bg-white p-5 rounded-xl shadow-sm mb-6 mt-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-600 text-base">Available Balance</Text>
            <Pressable className="bg-yellow-400 py-2 px-6 rounded-lg">
              <Text className="text-white font-semibold text-base">Withdraw</Text>
            </Pressable>
          </View>
          <Text className="text-3xl font-bold mb-4">$1,095.80</Text>

          <View className="flex-row justify-between">
            {balanceStats.map((stat, index) => (
              <View key={index} className="items-start">
                <Text className="text-gray-500 text-sm">{stat.label}</Text>
                <Text className="text-base font-semibold">{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Time Period Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row">
            {timePeriods.map((period, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedTimePeriod(period)}
                className={`py-2 px-4 rounded-lg mr-3 ${
                  selectedTimePeriod === period ? "bg-yellow-400" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedTimePeriod === period ? "text-white" : "text-gray-700"
                  }`}
                >
                  {period}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Large Balance Display */}
        <View className="bg-white p-5 rounded-xl shadow-sm items-center justify-center mb-6">
          <Text className="text-4xl font-bold text-gray-800">$545.56</Text>
        </View>

        {/* Payment History */}
        <Text className="text-xl font-bold mb-4 text-gray-800">Payment History</Text>

        <View className="mb-6">
          {paymentHistory.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-3"
            >
              <View className="flex-row items-center">
                {item.type === "payment" ? (
                  <View className="p-2 rounded-full bg-green-100 mr-3">
                    <Ionicons name="checkmark" size={20} color="#22C55E" />
                  </View>
                ) : (
                  <View className="p-2 rounded-full bg-red-100 mr-3">
                    <Feather name="arrow-up-right" size={20} color="#EF4444" /> {/* Or 'arrow-down-left' depending on desired visual for withdrawal */}
                  </View>
                )}
                <View>
                  <Text className="font-semibold text-base">{item.description}</Text>
                  <Text className="text-gray-500 text-sm">
                    {item.orderId || item.method}
                  </Text>
                </View>
              </View>
              <Text
                className={`font-bold text-lg ${
                  item.type === "payment" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}