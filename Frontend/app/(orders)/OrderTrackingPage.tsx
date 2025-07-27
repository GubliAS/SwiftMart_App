import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle, Clock, Package, Truck, Home } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOrderById, getOrderStatusHistory, updateOrderStatus } from '@/app/api/orderApi';
import { useAuth } from '@/context/AuthContext';
import type { Order, OrderStatusHistory } from '@/app/api/orderApi';

interface OrderTrackingData {
  orderId: string;
  orderPlacedDate: string;
  orderPlacedTime: string;
  paymentCompletedDate: string;
  paymentCompletedTime: string;
  shipmentStatus: 'Not Completed' | 'Completed' | 'In Progress';
  shipmentDate?: string;
  orderReceivedStatus: 'Not Received' | 'Received' | 'In Progress';
  orderReceivedDate?: string;
  paymentMethod: string;
}

const OrderTrackingPage = () => {
  const router = useRouter();
  const { orderId, itemId } = useLocalSearchParams();
  const { token } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch real order data
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch order details and status history in parallel
        const [orderData, historyData] = await Promise.allSettled([
          getOrderById(Number(orderId), token),
          getOrderStatusHistory(Number(orderId), token)
        ]);
        
        if (orderData.status === 'fulfilled') {
          setOrder(orderData.value);
        } else {
          console.error('Failed to fetch order:', orderData.reason);
        }
        
        if (historyData.status === 'fulfilled') {
          setStatusHistory(historyData.value);
        } else {
          console.error('Failed to fetch status history:', historyData.reason);
          setStatusHistory([]);
        }
        
      } catch (err) {
        setError('Failed to load order tracking data');
        console.error('Error fetching order data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, token]);

  // Handle marking order as received
  const handleMarkAsReceived = async () => {
    if (!order || !token) return;

    Alert.alert(
      'Mark as Received',
      'Are you sure you want to mark this order as received?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          style: 'default',
          onPress: async () => {
            try {
              setUpdatingStatus(true);
              
              // Update order status to "received" (lowercase for API)
              const updatedOrder = await updateOrderStatus(order.id, 'received', token);
              
              // Update local state
              setOrder(updatedOrder);
              
              Alert.alert(
                'Success',
                'Order has been marked as received!',
                [{ text: 'OK' }]
              );
              
            } catch (err) {
              console.error('Error updating order status:', err);
              Alert.alert(
                'Error',
                'Failed to mark order as received. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setUpdatingStatus(false);
            }
          }
        }
      ]
    );
  };

  // Generate tracking data from real order
  const getTrackingData = (): OrderTrackingData => {
    if (!order) {
      return {
        orderId: (orderId as string) || 'Unknown',
        orderPlacedDate: 'Unknown',
        orderPlacedTime: 'Unknown',
        paymentCompletedDate: 'Unknown',
        paymentCompletedTime: 'Unknown',
        shipmentStatus: 'Not Completed',
        orderReceivedStatus: 'Not Received',
        paymentMethod: 'Unknown'
      };
    }

    const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
    const orderPlacedDate = orderDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const orderPlacedTime = orderDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    // Determine shipment and received status based on order status
    let shipmentStatus: 'Not Completed' | 'Completed' | 'In Progress' = 'Not Completed';
    let orderReceivedStatus: 'Not Received' | 'Received' | 'In Progress' = 'Not Received';
    let shipmentDate: string | undefined;
    let orderReceivedDate: string | undefined;

    // If no status history, use order date as fallback for order placed
    if (statusHistory.length === 0 && order.orderDate) {
      const orderDate = new Date(order.orderDate);
      const orderPlacedDate = orderDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      // For received orders without history, use order date as received date
      if (order.orderStatus.toLowerCase() === 'received') {
        orderReceivedDate = orderPlacedDate;
        shipmentDate = orderPlacedDate; // Use same date as fallback
      }
    }

    switch (order.orderStatus.toLowerCase()) {
      case 'pending':
        shipmentStatus = 'Not Completed';
        orderReceivedStatus = 'Not Received';
        break;
      case 'confirmed':
        shipmentStatus = 'Not Completed';
        orderReceivedStatus = 'Not Received';
        break;
      case 'shipped':
        shipmentStatus = 'In Progress';
        orderReceivedStatus = 'Not Received';
        // Find shipment date from status history
        const shippedStatus = statusHistory.find(h => h.statusId === 3); // SHIPPED = ID 3
        if (shippedStatus) {
          shipmentDate = new Date(shippedStatus.changedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        }
        break;
      case 'delivered':
        shipmentStatus = 'Completed';
        orderReceivedStatus = 'Not Received'; // User needs to mark as received
        // Find delivery date from status history
        const deliveredStatus = statusHistory.find(h => h.statusId === 4); // DELIVERED = ID 4
        if (deliveredStatus) {
          shipmentDate = new Date(deliveredStatus.changedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        }
        break;
      case 'received':
        shipmentStatus = 'Completed';
        orderReceivedStatus = 'Received';
        // Find received date from status history
        const receivedStatus = statusHistory.find(h => h.statusId === 6); // RECEIVED = ID 6
        if (receivedStatus) {
          orderReceivedDate = new Date(receivedStatus.changedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        }
        // Also set shipment date if we have delivery history
        const deliveredStatusForReceived = statusHistory.find(h => h.statusId === 4);
        if (deliveredStatusForReceived) {
          shipmentDate = new Date(deliveredStatusForReceived.changedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        }
        break;
      case 'cancelled':
        shipmentStatus = 'Not Completed';
        orderReceivedStatus = 'Not Received';
        break;
      default:
        shipmentStatus = 'Not Completed';
        orderReceivedStatus = 'Not Received';
        break;
    }

    return {
      orderId: order.id?.toString() || (orderId as string),
      orderPlacedDate,
      orderPlacedTime,
      paymentCompletedDate: orderPlacedDate, // Assuming payment completed when order placed
      paymentCompletedTime: orderPlacedTime,
      shipmentStatus,
      shipmentDate,
      orderReceivedStatus,
      orderReceivedDate,
      paymentMethod: 'Credit/Debit card' // This would come from order data
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Received':
        return 'text-primary';
      case 'In Progress':
        return 'text-secondary';
      case 'Not Completed':
      case 'Not Received':
      default:
        return 'text-secondary';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return `${date}, ${time}`;
  };

  // Timeline component
  const OrderTimeline = () => {
    const trackingData = getTrackingData();
    
    const timelineSteps = [
      {
        id: 1,
        title: 'Order Placed',
        status: 'completed',
        date: formatDateTime(trackingData.orderPlacedDate, trackingData.orderPlacedTime),
        icon: CheckCircle,
        color: '#156651'
      },
      {
        id: 2,
        title: 'Payment Completed',
        status: 'completed',
        date: formatDateTime(trackingData.paymentCompletedDate, trackingData.paymentCompletedTime),
        icon: CheckCircle,
        color: '#156651'
      },
      {
        id: 3,
        title: 'Order Shipped',
        status: trackingData.shipmentStatus === 'Completed' ? 'completed' : 
               trackingData.shipmentStatus === 'In Progress' ? 'in-progress' : 'pending',
        date: trackingData.shipmentStatus === 'Completed' ? trackingData.shipmentDate || 'Completed' :
              trackingData.shipmentStatus === 'In Progress' ? 'In Progress' : 'Not Completed',
        icon: trackingData.shipmentStatus === 'Completed' ? CheckCircle : 
              trackingData.shipmentStatus === 'In Progress' ? Truck : Clock,
        color: trackingData.shipmentStatus === 'Completed' ? '#156651' : 
               trackingData.shipmentStatus === 'In Progress' ? '#F9B023' : '#9CA3AF'
      },
      {
        id: 4,
        title: 'Order Delivered',
        status: trackingData.orderReceivedStatus === 'Received' ? 'completed' : 
               trackingData.orderReceivedStatus === 'In Progress' ? 'in-progress' : 'pending',
        date: trackingData.orderReceivedStatus === 'Received' ? trackingData.orderReceivedDate || 'Received' :
              trackingData.orderReceivedStatus === 'In Progress' ? 'In Progress' : 'Not Received',
        icon: trackingData.orderReceivedStatus === 'Received' ? Home : 
              trackingData.orderReceivedStatus === 'In Progress' ? Package : Clock,
        color: trackingData.orderReceivedStatus === 'Received' ? '#156651' : 
               trackingData.orderReceivedStatus === 'In Progress' ? '#F9B023' : '#9CA3AF'
      }
    ];

    return (
      <View className="bg-white rounded-xl p-4 mb-6" style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text className="text-Heading4 font-Manrope text-text mb-4">Order Timeline</Text>
        
        {timelineSteps.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === timelineSteps.length - 1;
          
          return (
            <View key={step.id} className="flex-row items-start mb-4">
              {/* Timeline line */}
              <View className="items-center mr-3">
                <View 
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: step.color }}
                />
                {!isLast && (
                  <View 
                    className="w-0.5 h-12"
                    style={{ backgroundColor: '#E5E7EB' }}
                  />
                )}
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <IconComponent size={16} color={step.color} />
                  <Text 
                    className="ml-2 font-Manrope text-BodyBold text-text"
                  >
                    {step.title}
                  </Text>
                </View>
                
                <Text className="text-BodySmallRegular text-neutral-60 ml-6">
                  {step.date}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#156651" />
          <Text className="text-BodyRegular text-neutral-60 mt-4">Loading order tracking...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-BodyBold text-neutral-60 text-center">
            {error || 'Failed to load order tracking'}
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-4 bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white text-BodyBold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const trackingData = getTrackingData();
  const isDelivered = order.orderStatus.toLowerCase() === 'delivered';

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center p-4 relative">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute left-4"
        >
          <ChevronLeft size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text">Order Info</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-2">
        {/* Order Timeline */}
        <OrderTimeline />

        {/* Mark as Received Button - Only show when delivered */}
        {isDelivered && (
          <View className="bg-white rounded-xl p-4 mb-6" style={{ 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text className="text-Heading4 font-Manrope text-text mb-4">Order Actions</Text>
            <TouchableOpacity
              onPress={handleMarkAsReceived}
              disabled={updatingStatus}
              className={`bg-primary rounded-lg py-4 px-6 mb-3 ${updatingStatus ? 'opacity-50' : ''}`}
            >
              {updatingStatus ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white text-BodyBold ml-2">Marking as Received...</Text>
                </View>
              ) : (
                <Text className="text-white text-BodyBold text-center">Mark as Received</Text>
              )}
            </TouchableOpacity>
            <Text className="text-BodySmallRegular text-neutral-60 mt-2 text-center">
              Confirm that you have received your order
            </Text>
          </View>
        )}



        {/* Order Info and Order ID on same line */}
        <View className="flex-row items-center mb-5">
          <Text className="text-BodyRegular font-Manrope text-neutral-60" style={{ width: '60%' }}>
            Order ID
          </Text>
          <Text className="text-BodyBold font-Manrope text-text flex-1">
            #{trackingData.orderId}
          </Text>
        </View>

        {/* Order Placed */}
        <View className="flex-row items-center mb-5">
          <Text className="text-BodyRegular font-Manrope text-neutral-60" style={{ width: '60%' }}>
            Order placed on
          </Text>
          <Text className="text-BodyBold font-Manrope text-text flex-1">
            {formatDateTime(trackingData.orderPlacedDate, trackingData.orderPlacedTime)}
          </Text>
        </View>

        {/* Payment Completed */}
        <View className="flex-row items-center mb-5">
          <Text className="text-BodyRegular font-Manrope text-neutral-60" style={{ width: '60%' }}>
            Payment completed on
          </Text>
          <Text className="text-BodyBold font-Manrope text-text flex-1">
            {formatDateTime(trackingData.paymentCompletedDate, trackingData.paymentCompletedTime)}
          </Text>
        </View>

        {/* Shipment Completed */}
        <View className="flex-row items-center mb-5">
          <Text className="text-BodyRegular font-Manrope text-neutral-60" style={{ width: '60%' }}>
            Shipment completed on
          </Text>
          <Text className={`text-BodyBold font-Manrope flex-1 ${getStatusColor(trackingData.shipmentStatus)}`}>
            {trackingData.shipmentStatus === 'Completed' && trackingData.shipmentDate
              ? trackingData.shipmentDate
              : trackingData.shipmentStatus === 'In Progress' 
                ? 'In Progress'
                : 'Not Completed'}
          </Text>
        </View>

        {/* Order Received */}
        <View className="flex-row items-center mb-5">
          <Text className="text-BodyRegular font-Manrope text-neutral-60" style={{ width: '60%' }}>
            Order received on
          </Text>
          <Text className={`text-BodyBold font-Manrope flex-1 ${getStatusColor(trackingData.orderReceivedStatus)}`}>
            {trackingData.orderReceivedStatus === 'Received' && trackingData.orderReceivedDate
              ? trackingData.orderReceivedDate
              : trackingData.orderReceivedStatus === 'In Progress' 
                ? 'In Progress'
                : 'Not Received'}
          </Text>
        </View>

        {/* Payment Method */}
        <View className="flex-row items-center mb-5">
          <Text className="text-BodyRegular font-Manrope text-neutral-60" style={{ width: '60%' }}>
            Payment method
          </Text>
          <Text className="text-BodyBold font-Manrope text-text flex-1">
            {trackingData.paymentMethod}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderTrackingPage;
