import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getOrderById, getOrderLines } from '@/app/api/orderApi';
import { fetchProductById } from '@/app/api/productApi';
import { useAuth } from '@/context/AuthContext';
import type { Order, OrderLine } from '@/app/api/orderApi';
import type { Product } from '@/app/api/productApi';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { token } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Navigate to a specific screen if can't go back
      router.replace('/(orders)/TransactionPage');
    }
  };

  // Fetch real order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch order details and lines in parallel
        const [orderData, linesData] = await Promise.allSettled([
          getOrderById(Number(orderId), token),
          getOrderLines(Number(orderId), token)
        ]);
        
        if (orderData.status === 'fulfilled') {
          setOrder(orderData.value);
        } else {
          console.error('Failed to fetch order:', orderData.reason);
        }
        
        if (linesData.status === 'fulfilled') {
          setOrderLines(linesData.value);
        } else {
          console.error('Failed to fetch order lines:', linesData.reason);
        }
        
        // Fetch product details for each order line
        if (linesData.status === 'fulfilled') {
          const productMap = new Map<number, Product>();
          const uniqueProductIds = [...new Set(linesData.value.map(line => line.productItemId))];
          
          await Promise.allSettled(
            uniqueProductIds.map(async (productId) => {
              try {
                const product = await fetchProductById(productId);
                productMap.set(productId, product);
              } catch (err) {
                console.error(`Failed to fetch product ${productId}:`, err);
                // Create a fallback product object
                productMap.set(productId, {
                  id: productId,
                  name: `Product #${productId}`,
                  description: `Product ${productId}`,
                  price: 0,
                  originalPrice: 0,
                  rating: '0',
                  productImage: '',
                  condition: 'new',
                  categoryId: 1
                });
              }
            })
          );
          
          setProducts(productMap);
        }
        
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, token]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (orderId && token) {
        const refreshData = async () => {
          try {
            const [orderData, linesData] = await Promise.allSettled([
              getOrderById(Number(orderId), token),
              getOrderLines(Number(orderId), token)
            ]);
            
            if (orderData.status === 'fulfilled') {
              setOrder(orderData.value);
            }
            
            if (linesData.status === 'fulfilled') {
              setOrderLines(linesData.value);
            }
          } catch (err) {
            console.error('Error refreshing order data:', err);
          }
        };
        
        refreshData();
      }
    }, [orderId, token])
  );

  const mapStatus = (backendStatus: string): string => {
    switch (backendStatus.toLowerCase()) {
      case 'pending':
        return 'In Progress';
      case 'confirmed':
        return 'In Progress';
      case 'shipped':
        return 'In Progress';
      case 'delivered':
        return 'Delivered';
      case 'received':
        return 'Received';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'In Progress';
    }
  };

  const handleDetailPress = (itemId: number) => {
    // Navigate to product detail page
    router.push({
      pathname: '/(root)/(Home)/ProductDetail',
      params: { 
        productId: itemId.toString()
      }
    });
  };

  const handleTrackPress = (itemId: number) => {
    // Navigate to tracking page
    router.push({
      pathname: '/(orders)/OrderTrackingPage',
      params: { 
        orderId: order?.id?.toString() || orderId as string,
        itemId: itemId.toString()
      }
    });
  };

  const handleLeaveReviewPress = (itemId: number) => {
    // Navigate to leave review page
    router.push({
      pathname: '/(orders)/LeaveReviewPage',
      params: { 
        orderId: order?.id?.toString() || orderId as string,
        itemId: itemId.toString()
      }
    });
  };

  const handleReceivedPress = (itemId: number) => {
    // Mark order as completed when received is clicked
    // In a real app, this would update the backend
    // For now, we'll just navigate to order info showing received status
    router.push({
      pathname: '/(orders)/OrderInfoPage',
      params: { 
        orderId: order?.id?.toString() || orderId as string,
        itemId: itemId.toString(),
        mode: 'received', // Flag to show order received status
        statusUpdate: 'completed' // Indicates the order should be marked as completed
      }
    });
  };

  const handleInfoPress = () => {
    // Navigate to full order details page
    router.push({
      pathname: '/(orders)/OrderInfoPage',
      params: { 
        orderId: order?.id?.toString() || orderId as string
        // No itemId or mode params - shows full order details
      }
    });
  };

  const getSecondaryButtonConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return {
          text: 'Track',
          onPress: handleTrackPress,
          style: 'bg-primary'
        };
      case 'received':
        return {
          text: 'Leave a Review',
          onPress: handleLeaveReviewPress,
          style: 'bg-primary'
        };
      case 'completed':
        return {
          text: 'Leave a Review',
          onPress: handleLeaveReviewPress,
          style: 'bg-primary'
        };
      case 'delivered':
        return {
          text: 'Received',
          onPress: handleReceivedPress,
          style: 'bg-primary'
        };
      default:
        return {
          text: 'Track',
          onPress: handleTrackPress,
          style: 'bg-primary'
        };
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'border-secondary';
      case 'received':
        return 'border-primary';
      case 'completed':
        return 'border-primary';
      case 'delivered':
        return 'border-primary';
      default:
        return 'border-secondary';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'text-secondary';
      case 'received':
        return 'text-primary';
      case 'completed':
        return 'text-primary';
      case 'delivered':
        return 'text-primary';
      default:
        return 'text-secondary';
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#156651" />
          <Text className="text-BodyRegular text-neutral-60 mt-4">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-BodyBold text-neutral-60 text-center">
            {error || 'Failed to load order details'}
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
        <View className="items-center">
          <Text className="text-Heading3 font-Manrope text-text">Order #{order.id}</Text>
          <Text className={`text-BodySmallBold font-Manrope ${getStatusTextColor(mapStatus(order.orderStatus))}`}>
            {mapStatus(order.orderStatus)}
          </Text>
        </View>
        <TouchableOpacity 
          className="absolute right-4"
          onPress={handleInfoPress}
        >
          <Info size={24} color="#156651" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-2">
        {/* Order Items */}
        {orderLines.map((line) => {
          const product = products.get(line.productItemId);
          const status = mapStatus(order.orderStatus);
          
          return (
            <View key={line.id} className="bg-white rounded-xl p-4 mb-8" style={{ 
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 8,
            }}>
              {/* Order Status Badge - Top Right */}
              <View className="absolute top-4 right-4">
                <View className={`border ${getStatusBadgeColor(status)} px-3 py-1 rounded`}>
                  <Text className={`text-sm font-Manrope ${getStatusTextColor(status)}`}>
                    {status}
                  </Text>
                </View>
              </View>

              <View className="flex-row mb-4">
                {/* Product Image */}
                <View className="w-28 h-28 rounded-lg overflow-hidden mr-4">
                  <Image 
                    source={{ uri: product?.productImage || 'https://via.placeholder.com/112' }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Product Details */}
                <View className="flex-1">
                  <Text className="text-BodyBold w-[150px] font-Manrope text-text mb-1" numberOfLines={1} ellipsizeMode="tail">
                    {product?.name || `Product #${line.productItemId}`}
                  </Text>
                  <Text className="text-BodyBold font-Manrope text-text mb-2">
                    ${line.price.toFixed(2)}
                  </Text>
                  <Text className="text-BodySmallRegular font-Manrope text-neutral-60">
                    Qty: {line.qty}
                  </Text>
                  {status.toLowerCase() === 'received' && (
                    <TouchableOpacity 
                      onPress={() => handleTrackPress(line.productItemId)}
                      className="mt-2"
                    >
                      <Text className="text-primary text-BodySmallBold font-Manrope">
                        View Timeline
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Action Buttons Below Image */}
              <View className="flex-row space-x-2 flex justify-between gap-2 ">
                <TouchableOpacity
                  onPress={() => handleDetailPress(line.productItemId)}
                  className="flex-1 border border-primary rounded-lg py-3 px-4"
                >
                  <Text className="text-primary text-center font-Manrope text-BodySmallBold">
                    Detail
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const buttonConfig = getSecondaryButtonConfig(status);
                    buttonConfig.onPress(line.productItemId);
                  }}
                  className={`flex-1 ${getSecondaryButtonConfig(status).style} rounded-lg py-3 px-4`}
                >
                  <Text className="text-white text-center font-Manrope text-BodySmallBold">
                    {getSecondaryButtonConfig(status).text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsPage;
