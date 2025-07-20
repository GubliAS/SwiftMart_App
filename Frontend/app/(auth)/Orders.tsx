import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = ["All Orders", "Pending", "Processing", "Shipped", "Delivered"] as const;
type Tab = typeof tabs[number];

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

type Order = {
  id: string;
  name: string;
  status: OrderStatus;
  amount: string;
  size: string;
};

const orders: Order[] = [
  { id: "SWM93284", name: "John Smith", status: "Pending", amount: "$274.13", size: "2" },
  { id: "SWM93285", name: "Paul Smith", status: "Processing", amount: "$274.13", size: "1" },
  { id: "SWM93286", name: "Jane Doe", status: "Shipped", amount: "$274.13", size: "1" },
  { id: "SWM93287", name: "Gabriel Smith", status: "Delivered", amount: "$274.13", size: "2" },
];

const statusColor: Record<OrderStatus, string> = {
  Pending: "border border-yellow-400 text-yellow-600",
  Processing: "border border-purple-500 text-purple-600",
  Shipped: "border border-green-500 text-green-600",
  Delivered: "border border-gray-400 text-gray-600",
};

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => (
  <Pressable
    onPress={onPress}
    className="relative mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <View className="flex-row justify-between mb-2">
      <Text className="font-bold text-base">Order #{order.id}</Text>
      <View className={`px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
        <Text className="text-xs font-medium">{order.status}</Text>
      </View>
    </View>
    <Text className="text-sm text-gray-800">{order.name}</Text>
    <Text className="text-sm text-gray-500">Total Amount: {order.amount}</Text>
    <Text className="text-sm text-gray-500">Mobile Money</Text>
    <Text className="text-sm text-gray-500">Size: {order.size}</Text>
    <Feather
      name="chevron-right"
      size={18}
      className="absolute right-4 top-5 text-gray-400"
    />
  </Pressable>
);

const OrdersScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Pending");

  const filteredOrders =
    activeTab === "All Orders"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={() => {
        router.push("/(auth)/AllOrders");
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <FlatList
        ListHeaderComponent={
          <>
            {/* Back Arrow */}
            <Pressable onPress={() => router.back()} className="mb-4">
              <Feather name="arrow-left" size={24} color="black" />
            </Pressable>

            {/* Screen title */}
            <Text className="text-xl font-bold text-center mb-4">Orders</Text>

            {/* Tabs */}
            <View className="flex-row justify-between mb-4">
              {tabs.map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => {
                    if (tab === "All Orders") {
                      router.push("/(auth)/AllOrders");
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  className={`px-4 py-2 rounded-full ${
                    activeTab === tab ? "bg-yellow-300" : "bg-gray-200"
                  }`}
                >
                  <Text className="text-xs font-medium text-gray-800">{tab}</Text>
                </Pressable>
              ))}
            </View>

            {/* Summary cards */}
            <View className="flex-row flex-wrap justify-between gap-3 mb-6">
              <View className="w-[48%] bg-yellow-50 p-4 rounded-xl shadow-sm">
                <Text className="text-gray-500 text-sm">Today’s Orders</Text>
                <Text className="text-xl font-bold mt-1">3</Text>
              </View>
              <View className="w-[48%] bg-yellow-50 p-4 rounded-xl shadow-sm">
                <Text className="text-gray-500 text-sm">Pending Orders</Text>
                <Text className="text-xl font-bold mt-1">7</Text>
              </View>
              <View className="w-[48%] bg-yellow-50 p-4 rounded-xl shadow-sm">
                <Text className="text-gray-500 text-sm">This Week</Text>
                <Text className="text-xl font-bold mt-1">18</Text>
              </View>
              <View className="w-[48%] bg-yellow-50 p-4 rounded-xl shadow-sm">
                <Text className="text-gray-500 text-sm">Total Revenue</Text>
                <Text className="text-xl font-bold mt-1">$1,245</Text>
              </View>
            </View>

            {/* Quick Actions heading */}
            <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
          </>
        }
        data={filteredOrders}
        keyExtractor={(item) => `${item.id}-${item.status}`}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;
