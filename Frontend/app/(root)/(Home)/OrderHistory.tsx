import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign } from "@expo/vector-icons";
import { getOrdersByUser } from "@/app/api/orderApi";
import type { Order } from "@/app/api/orderApi";
import { useAuth } from '@/context/AuthContext';

const OrderHistory = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from auth context
  const userId = user?.id || 1;

  const fetchOrders = async () => {
    try {
      setError(null);
      const userOrders = await getOrdersByUser(userId, token);
      setOrders(userOrders);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return "#007AFF";
      case "shipped":
        return "#4CAF50";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "clock";
      case "confirmed":
        return "check-circle";
      case "shipped":
        return "truck";
      case "delivered":
        return "package";
      case "cancelled":
        return "x-circle";
      default:
        return "help-circle";
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: "/(root)/(Home)/OrderDetail",
        params: { orderId: item.id.toString() }
      })}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            Order #{item.id}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {formatDate(item.orderDate)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-gray-900">
            ${item.orderTotal.toFixed(2)}
          </Text>
          <View className="flex-row items-center mt-1">
            <Feather
              name={getStatusIcon(item.orderStatus) as any}
              size={16}
              color={getStatusColor(item.orderStatus)}
            />
            <Text
              className="text-sm ml-1 capitalize"
              style={{ color: getStatusColor(item.orderStatus) }}
            >
              {item.orderStatus}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Feather name="map-pin" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
            {item.shippingAddress}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Feather name="package" size={64} color="#ccc" />
      <Text className="text-xl font-semibold text-gray-500 mt-4">
        No Orders Yet
      </Text>
      <Text className="text-gray-400 text-center mt-2 px-8">
        Start shopping to see your order history here
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(root)/(Home)")}
        className="bg-primary mt-6 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Feather name="alert-circle" size={64} color="#FF3B30" />
      <Text className="text-xl font-semibold text-gray-500 mt-4">
        Something went wrong
      </Text>
      <Text className="text-gray-400 text-center mt-2 px-8">
        {error}
      </Text>
      <TouchableOpacity
        onPress={fetchOrders}
        className="bg-primary mt-6 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Order History</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#156651" />
          <Text className="text-gray-500 mt-4">Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Order History</Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        {error ? (
          renderErrorState()
        ) : orders.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#156651"]}
              />
            }
            ListHeaderComponent={
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Your Orders ({orders.length})
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderHistory; 