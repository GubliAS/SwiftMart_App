import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign } from "@expo/vector-icons";
import { getOrderById, getOrderLines } from "@/app/api/orderApi";
import type { Order, OrderLine } from "@/app/api/orderApi";
import { useAuth } from '@/context/AuthContext';

const OrderDetail = () => {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const orderId = Number(params.orderId);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    try {
      setError(null);
      const [orderData, linesData] = await Promise.all([
        getOrderById(orderId, token),
        getOrderLines(orderId, token)
      ]);
      setOrder(orderData);
      setOrderLines(linesData);
    } catch (err) {
      setError("Failed to load order details");
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Your order is being processed";
      case "confirmed":
        return "Your order has been confirmed";
      case "shipped":
        return "Your order is on its way";
      case "delivered":
        return "Your order has been delivered";
      case "cancelled":
        return "Your order has been cancelled";
      default:
        return "Order status unknown";
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Order Details</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#156651" />
          <Text className="text-gray-500 mt-4">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Order Details</Text>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <Feather name="alert-circle" size={64} color="#FF3B30" />
          <Text className="text-xl font-semibold text-gray-500 mt-4">
            Order Not Found
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            {error || "The order you're looking for doesn't exist"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary mt-6 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
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
        <Text className="text-xl font-semibold ml-4">Order #{order.id}</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View className="bg-white p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Feather
              name={getStatusIcon(order.orderStatus) as any}
              size={24}
              color={getStatusColor(order.orderStatus)}
            />
            <View className="ml-3 flex-1">
              <Text
                className="text-lg font-semibold capitalize"
                style={{ color: getStatusColor(order.orderStatus) }}
              >
                {order.orderStatus}
              </Text>
              <Text className="text-gray-500 text-sm">
                {getStatusDescription(order.orderStatus)}
              </Text>
            </View>
          </View>
          <Text className="text-gray-600">
            Ordered on {formatDate(order.orderDate)}
          </Text>
        </View>

        {/* Order Items */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-lg font-semibold mb-4">Order Items</Text>
          {orderLines.map((line, index) => (
            <View key={line.id} className="flex-row items-center mb-4 last:mb-0">
              <View className="w-16 h-16 bg-gray-100 rounded-lg mr-3">
                <Image
                  source={{ uri: "https://via.placeholder.com/64" }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  Product #{line.productItemId}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Quantity: {line.qty}
                </Text>
                <Text className="text-gray-900 font-semibold">
                  ${line.price.toFixed(2)}
                </Text>
              </View>
              <Text className="text-lg font-bold text-gray-900">
                ${(line.price * line.qty).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Shipping Information */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-lg font-semibold mb-4">Shipping Information</Text>
          <View className="flex-row items-start mb-3">
            <Feather name="map-pin" size={20} color="#666" />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-900">Shipping Address</Text>
              <Text className="text-gray-600">{order.shippingAddress}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Feather name="truck" size={20} color="#666" />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-900">Shipping Method</Text>
              <Text className="text-gray-600">Method #{order.shippingMethodId}</Text>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View className="bg-white p-4 mb-4">
          <Text className="text-lg font-semibold mb-4">Payment Information</Text>
          <View className="flex-row items-center">
            <Feather name="credit-card" size={20} color="#666" />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-900">Payment Method</Text>
              <Text className="text-gray-600">Method #{order.paymentMethodId}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white p-4 mb-8">
          <Text className="text-lg font-semibold mb-4">Order Summary</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900">${order.orderTotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="text-gray-900">$0.00</Text>
            </View>
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-gray-900">Total</Text>
                <Text className="text-lg font-bold text-gray-900">
                  ${order.orderTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="bg-white p-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Contact Support",
              "Would you like to contact customer support about this order?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Contact Support", onPress: () => {
                  // Handle contact support
                  Alert.alert("Support", "Support feature coming soon!");
                }}
              ]
            );
          }}
          className="bg-gray-100 py-3 rounded-lg mb-3"
        >
          <Text className="text-center font-semibold text-gray-900">
            Contact Support
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push("/(root)/(Home)/OrderHistory")}
          className="bg-primary py-3 rounded-lg"
        >
          <Text className="text-center font-semibold text-white">
            View All Orders
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail; 