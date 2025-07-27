import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native";
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


const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-primary/10 text-primary border border-primary";
    case "Processing":
      return "bg-secondary/10 text-secondary border border-secondary";
    case "Shipped":
      return "bg-alert/10 text-alert border border-alert";
    case "Delivered":
      return "bg-gray-300 text-gray-700 border border-gray-400";
    default:
      return "bg-gray-200 text-gray-600 border border-gray-300";
  }
};

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => (
  <Pressable
    onPress={onPress}
    className="relative mb-4 p-4 bg-white rounded-xl border border-gray-100"
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    }}
  >
    <View className="flex-row justify-between items-center mb-2">
      <Text className="font-bold text-lg text-gray-900">Order #{order.id}</Text>
      <Text
        className={`px-2 py-0.5 text-xs min-w-[80px] text-center rounded-[4px] ${getStatusColor(order.status)}`}
      >
        {order.status}
      </Text>
    </View>
    <Text className="text-sm text-gray-800 font-medium">{order.name}</Text>
    <Text className="text-sm text-gray-500">Total Amount: <Text className="font-bold text-gray-800">{order.amount}</Text></Text>
    <Text className="text-sm text-gray-500">Mobile Money</Text>
    <Text className="text-sm text-gray-500">Size: <Text className="font-bold text-gray-800">{order.size}</Text></Text>
    <View style={{ position: 'absolute', right: 16, bottom: 8 }}>
      <Feather
        name="chevron-right"
        size={22}
        color="#BDBDBD"
      />
    </View>
  </Pressable>
);

const OrdersScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("All Orders");

  const filteredOrders =
    activeTab === "All Orders"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={() => {
        router.push({ pathname: "/Orders" });
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {/* Header at the very top, occupying empty space */}
      <View style={{ paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}>
        <View className="flex-row items-center justify-between pt-2 pb-2">
          <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginRight: 8 }}>
            <Feather name="chevron-left" size={24} color="black" />
          </Pressable>
          <Text className="text-Heading2 font-Manrope text-text text-center flex-1">Orders</Text>
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <>
            {/* Tabs - horizontal scroll, left-aligned, gap 16px, no justify-between */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ flexDirection: 'row', gap: 16, alignItems: 'center', paddingLeft: 0 }}>
                {tabs.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`px-4 rounded-full ${
                      activeTab === tab ? "bg-secondary" : "bg-gray-100"
                    }`}
                    style={{ height: 32, justifyContent: 'center' }}
                  >
                    <Text className={`text-xs font-semibold ${activeTab === tab ? "text-white" : "text-gray-700"}`}>{tab}</Text>
                  </Pressable>
                ))}
            </ScrollView>

            {/* Summary cards */}
            <View className="flex-row flex-wrap justify-between gap-3 mb-6">
              <View className="w-[48%] flex flex-col justify-center items-start px-4" style={{ backgroundColor: 'rgba(235,182,91,0.1)', borderRadius: 16, height: 95 }}>
                <Text className="text-neutral-50 mb-1 text-[16px]">Today’s Orders</Text>
                <Text className="font-bold text-gray-900 text-[24px]">3</Text>
              </View>
              <View className="w-[48%] flex flex-col justify-center items-start px-4" style={{ backgroundColor: 'rgba(235,182,91,0.1)', borderRadius: 16, height: 95 }}>
                <Text className="text-neutral-50 mb-1 text-[16px]">Pending Orders</Text>
                <Text className="font-bold text-gray-900 text-[24px]">7</Text>
              </View>
              <View className="w-[48%] flex flex-col justify-center items-start px-4" style={{ backgroundColor: 'rgba(235,182,91,0.1)', borderRadius: 16, height: 95 }}>
                <Text className="text-neutral-50 mb-1 text-[16px]">This Week</Text>
                <Text className="font-bold text-gray-900 text-[24px]">18</Text>
              </View>
              <View className="w-[48%] flex flex-col justify-center items-start px-4" style={{ backgroundColor: 'rgba(235,182,91,0.1)', borderRadius: 16, height: 95 }}>
                <Text className="text-neutral-50 mb-1 text-[16px]">Total Revenue</Text>
                <Text className="font-bold text-gray-900 text-[24px]">$1,245</Text>
              </View>
            </View>

            {/* Quick Actions styled like summary cards */}
            <View className="w-full flex flex-col justify-center items-start px-4 mb-3">
              <Text className="text-Heading3 font-Manrope text-text mb-1">Quick Actions</Text>
            </View>
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
