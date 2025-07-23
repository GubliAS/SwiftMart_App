import { Feather, Ionicons } from "@expo/vector-icons"; // Feather for the withdrawal icon
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function EarningsScreen() {
  // Returns the balance value for the selected time period
  function getDisplayedBalance(period: string) {
    switch (period) {
      case "Last Month":
        return "$545.56";
      case "Last 3 Months":
        return "$1,980.00";
      case "This Year":
        return "$4,980.55";
      case "Total":
        return "$7,506.11";
      default:
        return "$545.56";
    }
  }
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
      className={`flex-1 bg-neutral-10 ${Platform.OS === 'android' ? 'pt-[' + (StatusBar.currentHeight || 0) + 'px]' : ''}`}
    >
      {/* Header */}
      <View className="flex-row items-center justify-center mb-4 relative py-3 bg-neutral-10">
        <Pressable onPress={() => router.back()} className="absolute left-4 p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-Heading2 font-Manrope text-text">Earnings</Text>
        <View className="w-10"></View> {/* Spacer to center title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Available Balance Section */}
        <LinearGradient
          colors={["#F9E3B0", "#EBB65B1A", "#EBB65B1A"]}
          locations={[0, 0.65, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            marginTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.07,
            shadowRadius: 4,
            elevation: 1,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            backgroundColor: '#FAF9F6',
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-neutral-80 text-base">Available Balance</Text>
            <Pressable className="bg-secondary py-2 px-6 rounded-lg">
              <Text className="text-white font-semibold text-base">Withdraw</Text>
            </Pressable>
          </View>
          <Text className="text-3xl font-bold mb-4 text-text">$1,095.80</Text>

          <View className="flex-row justify-between">
            {balanceStats.map((stat, index) => (
              <View key={index} className="items-start">
                <Text className="text-neutral-60 text-sm">{stat.label}</Text>
                <Text className="text-base font-semibold text-text">{stat.value}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Time Period Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row">
            {timePeriods.map((period, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedTimePeriod(period)}
                className={`py-2 px-4 rounded-lg mr-3 ${
                  selectedTimePeriod === period ? "bg-secondary" : "bg-neutral-20"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedTimePeriod === period ? "text-white" : "text-neutral-80"
                  }`}
                >
                  {period}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Large Balance Display */}
        <View style={{
          backgroundColor: 'rgba(235,182,91,0.08)',
          padding: 20,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.07,
          shadowRadius: 4,
          elevation: 1,
          borderWidth: 1,
          borderColor: '#e0e0e0',
        }}>
          <Text className="text-4xl font-bold text-text">{getDisplayedBalance(selectedTimePeriod)}</Text>
        </View>

        {/* Payment History */}
        <Text className="text-Heading3 font-Manrope text-text mb-4">Payment History</Text>

        <View className="mb-6">
          {paymentHistory.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-3"
            >
              <View className="flex-row items-center">
                {item.type === "payment" ? (
                  <View className="p-2 rounded-full bg-primary/10 mr-3">
                    <Ionicons name="checkmark" size={20} color="#156651" />
                  </View>
                ) : (
                  <View className="p-2 rounded-full bg-alert/10 mr-3">
                    <Feather name="arrow-up-right" size={20} color="#EB1A1A" />
                  </View>
                )}
                <View>
                  <Text className="font-semibold text-base text-text">{item.description}</Text>
                  <Text className="text-neutral-60 text-sm">
                    {item.orderId || item.method}
                  </Text>
                </View>
              </View>
              <Text
                className={`font-bold text-lg ${
                  item.type === "payment" ? "text-primary" : "text-alert"
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