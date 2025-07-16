import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { OrderCard } from './components';
import { OrderListItem } from './types';

const TransactionPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('My Order');

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Navigate to home or main screen if can't go back
      router.replace('/');
    }
  };

  // Mock data for orders with different statuses
  const allOrders: OrderListItem[] = [
    {
      id: 'SWM93284',
      amount: 274.13,
      size: 2,
      status: 'In Progress',
      items: [
        { name: 'DEXO', price: 230.00, quantity: 1 },
        { name: 'Office Supplies', price: 44.13, quantity: 1 }
      ]
    },
    {
      id: 'SWM96254',
      amount: 1098.13,
      size: 3,
      status: 'Completed',
      items: [
        { name: 'REXO', price: 590.13, quantity: 1 },
        { name: 'Apple Device', price: 508.00, quantity: 1 }
      ]
    },
    {
      id: 'SWM87456',
      amount: 450.75,
      size: 1,
      status: 'Delivered',
      items: [
        { name: 'NEXO', price: 450.75, quantity: 1 }
      ]
    },
    {
      id: 'SWM78901',
      amount: 320.50,
      size: 1,
      status: 'Completed',
      items: [
        { name: 'Wireless Headphones', price: 320.50, quantity: 1 }
      ]
    },
    {
      id: 'SWM65432',
      amount: 156.75,
      size: 2,
      status: 'Completed',
      items: [
        { name: 'Phone Case', price: 45.00, quantity: 1 },
        { name: 'Screen Protector', price: 111.75, quantity: 1 }
      ]
    }
  ];

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    if (activeTab === 'History') {
      return allOrders.filter(order => order.status === 'Completed');
    }
    return allOrders; // Show all orders for "My Order" tab
  };

  const orders = getFilteredOrders();

  const handleOrderPress = (orderId: string) => {
    router.push({
      pathname: '/(orders)/OrderDetailsPage',
      params: { orderId }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 relative">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="absolute left-4"
        >
          <ChevronLeft size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text">Transaction</Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-neutral-30 mx-4 mb-2">
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === 'My Order' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('My Order')}
        >
          <Text className={`text-center font-Manrope text-BodyRegular ${activeTab === 'My Order' ? 'text-primary font-medium' : 'text-neutral-60'}`}>
            My Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === 'History' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('History')}
        >
          <Text className={`text-center font-Manrope text-BodyRegular ${activeTab === 'History' ? 'text-primary font-medium' : 'text-neutral-60'}`}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4 pt-2">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onPress={handleOrderPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionPage;
