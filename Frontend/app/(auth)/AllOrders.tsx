import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = ["All Orders", "Pending", "Processing", "Shipped", "Delivered"];

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

type Order = {
  id: string;
  name: string;
  status: OrderStatus;
  amount: string;
  size: string;
};

const orders: Order[] = [
  {
    id: "SWM93284",
    name: "John Smith",
    status: "Pending",
    amount: "$274.13",
    size: "2",
  },
  {
    id: "SWM93285",
    name: "Paul Smith",
    status: "Processing",
    amount: "$274.13",
    size: "1",
  },
  {
    id: "SWM93286",
    name: "Gabriel Smith",
    status: "Shipped",
    amount: "$274.13",
    size: "1",
  },
  {
    id: "SWM93287",
    name: "John Smith",
    status: "Delivered",
    amount: "$274.13",
    size: "2",
  },
];

const statusColor: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-600",
  Processing: "bg-purple-100 text-purple-600",
  Shipped: "bg-green-100 text-green-600",
  Delivered: "bg-gray-100 text-gray-500",
};

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState("All Orders");

  const filteredOrders =
    activeTab === "All Orders"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Arrow */}
        <Pressable onPress={() => router.back()} className="mb-2 w-10">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        {/* Header */}
        <Text className="text-xl font-bold text-center my-4">All Orders</Text>

        {/* Tabs */}
        <View className="flex-row justify-between mb-4">
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                if (tab === "Pending") {
                  router.push("/(auth)/OrderDetailsScreen");
                } else {
                  setActiveTab(tab);
                }
              }}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab ? "bg-yellow-300" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? "text-white" : "text-gray-800"
                }`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Summary Cards */}
        <View className="flex-row flex-wrap justify-between gap-3 mb-6">
          {[
            { title: "Today's Orders", value: "3" },
            { title: "Pending Orders", value: "7" },
            { title: "This Week", value: "18" },
            { title: "Total Revenue", value: "$1,245" },
          ].map((card) => (
            <View
              key={card.title}
              className="w-[48%] bg-yellow-50 p-4 rounded-xl shadow-sm"
            >
              <Text className="text-gray-500 text-sm">{card.title}</Text>
              <Text className="text-xl font-bold mt-1">{card.value}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions header */}
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Quick Actions
        </Text>

        {/* Orders List */}
        {filteredOrders.map((order, idx) => (
          <View
            key={`${order.id}-${idx}`}
            className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="font-bold text-base">
                  Order&nbsp;#{order.id}
                </Text>
                <Text className="text-sm text-gray-800 mt-1">{order.name}</Text>
                <Text className="text-sm text-gray-500">
                  Total Amount:&nbsp;{order.amount}
                </Text>
                <Text className="text-sm text-gray-500">Mobile Money</Text>
                <Text className="text-sm text-gray-500">
                  Size:&nbsp;{order.size}
                </Text>
              </View>

              <View
                className={`px-2 py-1 rounded ${statusColor[order.status]}`}
              >
                <Text className="text-xs font-medium">{order.status}</Text>
              </View>
            </View>

            <View className="absolute right-4 top-1/2 -mt-2">
              <ChevronRight size={18} color="#000" />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrdersScreen;
