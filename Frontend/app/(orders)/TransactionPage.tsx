import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import OrderCard from '@/components/orders/OrderCard';
import { OrderListItem } from '@/types/orders';
import { getOrdersByUser, getOrderLines } from '@/app/api/orderApi';
import type { Order, OrderLine } from '@/app/api/orderApi';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';

const TransactionPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('My Order');
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from auth context
  const userId = Number(user?.id) || 1;

  const fetchOrders = async () => {
    try {
      setError(null);
      const backendOrders = await getOrdersByUser(userId, token || undefined);
      
      // Map backend orders to OrderListItem format
      const mappedOrders: OrderListItem[] = await Promise.all(
        backendOrders.map(async (order) => {
          // Fetch order lines for each order
          const orderLines = await getOrderLines(order.id, token || undefined);
          
          // Map order lines to items format
          const items = orderLines.map(line => ({
            name: `Product #${line.productItemId}`, // In real app, fetch product name from product service
            price: line.price,
            quantity: line.qty
          }));

          // Map backend status to frontend status
          const mapStatus = (backendStatus: string): OrderListItem['status'] => {
            switch (backendStatus.toLowerCase()) {
              case 'pending':
                return 'In Progress';
              case 'confirmed':
                return 'In Progress';
              case 'shipped':
                return 'In Progress';
              case 'delivered':
                return 'In Progress';
              case 'received':
                return 'Received';
              case 'cancelled':
                return 'Cancelled';
              default:
                return 'In Progress';
            }
          };

          return {
            id: order.id.toString(),
            amount: order.orderTotal,
            size: orderLines.length, // Number of items in order
            status: mapStatus(order.orderStatus),
            items: items
          };
        })
      );

      setOrders(mappedOrders);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
      // Don't fallback to mock data - show empty state instead
      setOrders([]);
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



  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Navigate to home or main screen if can't go back
      router.replace('/');
    }
  };

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    if (activeTab === 'History') {
      // History shows completed and cancelled orders
      return orders.filter(order => 
        order.status === 'Completed' || order.status === 'Cancelled'
      );
    }
    // My Order shows in progress and received orders
    return orders.filter(order => 
      order.status === 'In Progress' || order.status === 'Received'
    );
  };

  const filteredOrders = getFilteredOrders();

  const handleOrderPress = (orderId: string) => {
    router.push({
      pathname: '/(orders)/OrderDetailsPage',
      params: { orderId }
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center p-4 relative mb-8">
          <TouchableOpacity 
            onPress={handleBackPress}
            className="absolute left-4"
          >
            <ChevronLeft size={24} color="#156651" />
          </TouchableOpacity>
          <Text className="text-Heading3 font-Manrope text-text">Transaction</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#156651" />
          <Text className="text-gray-500 mt-4">Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 relative mb-8">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="absolute left-4"
        >
          <ChevronLeft size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text">Transaction</Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row mx-4 mb-8">
        <TouchableOpacity
          className="flex-1 py-3"
          onPress={() => setActiveTab('My Order')}
        >
          <Text className={`text-center font-Manrope text-base ${activeTab === 'My Order' ? 'text-text font-semibold' : 'text-gray-400'}`}>
            My Order
          </Text>
          {activeTab === 'My Order' ? (
            <View className="h-0.5 bg-primary mt-2 mx-auto" style={{ width: 60 }} />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3"
          onPress={() => setActiveTab('History')}
        >
          <Text className={`text-center font-Manrope text-base ${activeTab === 'History' ? 'text-text font-semibold' : 'text-gray-400'}`}>
            History
          </Text>
          {activeTab === 'History' ? (
            <View className="h-0.5 bg-primary mt-2 mx-auto" style={{ width: 60 }} />
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView 
        className="flex-1 px-4 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#156651"]}
          />
        }
      >
        {error && (
          <View className="bg-red-50 p-4 rounded-lg mb-4">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}
        
        {filteredOrders.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-xl font-semibold text-gray-500 mt-4">
              No {activeTab === 'History' ? 'order history' : 'active orders'}
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              {activeTab === 'History' 
                ? 'Your completed and cancelled orders will appear here'
                : 'Your active orders will appear here'
              }
            </Text>
          </View>
        ) : (
          <View className='flex-1 gap-4'>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={handleOrderPress}
            />
          ))}
        </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionPage;
