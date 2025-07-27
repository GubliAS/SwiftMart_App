import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Package, Truck, Clock, CreditCard, MapPin, User, Star, ShoppingCart } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOrderById, getOrderLines } from '@/app/api/orderApi';
import { fetchProductById } from '@/app/api/productApi';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import type { Order, OrderLine } from '@/app/api/orderApi';
import type { Product } from '@/app/api/productApi';

const OrderInfoPage = () => {
  const router = useRouter();
  const { orderId, itemId, mode } = useLocalSearchParams();
  const { token } = useAuth();
  const { user } = useUser();
  
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
    const fetchOrderInfo = async () => {
      if (!orderId || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch order details
        const orderData = await getOrderById(Number(orderId), token);
        setOrder(orderData);
        
        // Fetch order lines
        const linesData = await getOrderLines(Number(orderId), token);
        setOrderLines(linesData);
        
        // Fetch product details for each order line
        const productMap = new Map<number, Product>();
        const uniqueProductIds = [...new Set(linesData.map(line => line.productItemId))];
        
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
        
      } catch (err) {
        console.error('Error fetching order info:', err);
        setError('Failed to load order information');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId, token]);

  // Map backend status to frontend status
  const mapStatus = (backendStatus: string): string => {
    switch (backendStatus.toLowerCase()) {
      case 'pending':
        return 'In Progress';
      case 'confirmed':
        return 'In Progress';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'In Progress';
    }
  };

  // Get real order info
  const getOrderInfo = () => {
    if (!order || !orderLines.length) return null;
    
    // Log order data for debugging
    console.log('Order ID:', order.id, 'Date:', order.orderDate);
    
    const items = orderLines.map((line) => {
      const product = products.get(line.productItemId);
      return {
        id: line.id,
        name: product?.name || `Product #${line.productItemId}`,
        price: line.price,
        quantity: line.qty,
        description: product?.description || `Product ${line.productItemId}`,
        sku: `SKU-${line.productItemId}`,
        category: 'General',
        image: product?.productImage 
          ? { uri: product.productImage }
          : require('../../assets/images/computer.png'),
        rating: parseFloat(product?.rating || '0'),
        reviews: 0,
        features: []
      };
    });

    // Parse order date from backend
    let orderDate: Date;
    if (order.orderDate) {
      // The backend sends ISO format like "2025-07-26T20:09:47.822841"
      orderDate = new Date(order.orderDate);
      
      // Check if the date is valid
      if (isNaN(orderDate.getTime())) {
        console.log('Invalid date from backend, using current date');
        orderDate = new Date();
      }
    } else {
      console.log('No order date from backend, using current date');
      orderDate = new Date();
    }
    
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from order date

    return {
      id: order.id.toString(),
      status: mapStatus(order.orderStatus),
      amount: order.orderTotal,
      orderDate: orderDate.toLocaleDateString(),
      estimatedDelivery: estimatedDelivery.toLocaleDateString(),
      items: items,
      customer: {
        name: user ? `${user.firstName} ${user.lastName}` : 'Customer',
        email: user?.email || 'customer@email.com',
        phone: '+1 (555) 123-4567'
      },
      shipping: {
        address: {
          street: order.shippingAddress || '123 Main Street',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'United States'
        },
        method: 'Standard Delivery',
        carrier: 'UPS',
        trackingNumber: `TRK${order.id}${Date.now()}`
      },
      payment: {
        method: 'Credit Card',
        cardType: 'Visa',
        last4: '1234',
        billingAddress: {
          street: order.shippingAddress || '123 Main Street',
          city: 'City',
          state: 'State',
          zipCode: '12345'
        }
      },
      timeline: [
        { status: 'Order Placed', date: orderDate.toLocaleDateString(), time: orderDate.toLocaleTimeString(), completed: true },
        { status: 'Payment Confirmed', date: orderDate.toLocaleDateString(), time: orderDate.toLocaleTimeString(), completed: true },
        { status: 'Processing', date: orderDate.toLocaleDateString(), time: orderDate.toLocaleTimeString(), completed: order.orderStatus !== 'PENDING' },
        { status: 'Shipped', date: orderDate.toLocaleDateString(), time: orderDate.toLocaleTimeString(), completed: order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' },
        { status: 'Out for Delivery', date: estimatedDelivery.toLocaleDateString(), time: 'Pending', completed: false },
        { status: 'Delivered', date: estimatedDelivery.toLocaleDateString(), time: 'Pending', completed: order.orderStatus === 'DELIVERED' }
      ],
      totals: {
        subtotal: order.orderTotal,
        shipping: 15.00,
        tax: order.orderTotal * 0.1, // 10% tax
        total: order.orderTotal
      }
    };
  };

  const orderInfo = getOrderInfo();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center p-4 relative">
          <TouchableOpacity 
            onPress={handleBackPress}
            className="absolute left-4"
          >
            <ChevronLeft size={24} color="#156651" />
          </TouchableOpacity>
          <Text className="text-Heading3 font-Manrope text-text">Order Information</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#156651" />
          <Text className="text-gray-500 mt-4">Loading order information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !orderInfo) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center p-4 relative">
          <TouchableOpacity 
            onPress={handleBackPress}
            className="absolute left-4"
          >
            <ChevronLeft size={24} color="#156651" />
          </TouchableOpacity>
          <Text className="text-Heading3 font-Manrope text-text">Order Information</Text>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-600 text-center text-lg">{error || 'Order not found'}</Text>
          <Text className="text-gray-500 text-center mt-2">Could not load order information</Text>
        </View>
      </SafeAreaView>
    );
  }

  const InfoCard = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) => (
    <View className="bg-white rounded-xl p-4 mb-4" style={Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
      }
    })}>
      <View className="flex-row items-center mb-3">
        <Icon size={20} color="#156651" />
        <Text className="text-BodyBold font-Manrope text-text ml-2">{title}</Text>
      </View>
      {children}
    </View>
  );

  // If mode is 'item', show item details
  if (mode === 'item' && itemId) {
    const item = orderInfo.items.find(i => i.id === parseInt(itemId as string));
    
    if (!item) {
      return (
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 justify-center items-center">
            <Text className="text-BodyRegular font-Manrope text-neutral-60">Item not found</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-center p-4 relative">        <TouchableOpacity 
          onPress={handleBackPress}
          className="absolute left-4"
        >
            <ChevronLeft size={24} color="#156651" />
          </TouchableOpacity>
          <Text className="text-Heading3 font-Manrope text-text">Item Details</Text>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Product Image */}
          <View className="items-center mb-6">
            <View className="w-48 h-48 rounded-2xl overflow-hidden">
              <Image 
                source={item.image} 
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Product Info */}
          <InfoCard title="Product Information" icon={Package}>
            <View className="space-y-3">
              <View>
                <Text className="text-BodyBold font-Manrope text-text text-2xl mb-2">{item.name}</Text>
                <Text className="text-BodyBold font-Manrope text-primary text-xl">${item.price.toFixed(2)}</Text>
              </View>
              <View className="flex-row items-center">
                <Star size={16} color="#156651" fill="#156651" />
                <Text className="text-BodyRegular font-Manrope text-text ml-1">
                  {item.rating} ({item.reviews} reviews)
                </Text>
              </View>
              <View>
                <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">Description</Text>
                <Text className="text-BodyRegular font-Manrope text-text">{item.description}</Text>
              </View>
              <View>
                <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">SKU</Text>
                <Text className="text-BodyRegular font-Manrope text-text">{item.sku}</Text>
              </View>
              <View>
                <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">Category</Text>
                <Text className="text-BodyRegular font-Manrope text-text">{item.category}</Text>
              </View>
              <View>
                <Text className="text-BodyRegular font-Manrope text-neutral-60 mb-1">Quantity Ordered</Text>
                <Text className="text-BodyRegular font-Manrope text-text">{item.quantity}</Text>
              </View>
            </View>
          </InfoCard>

          {/* Features */}
          <InfoCard title="Features" icon={Star}>
            <View className="space-y-2">
              {item.features.map((feature, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <Text className="text-BodyRegular font-Manrope text-text">{feature}</Text>
                </View>
              ))}
            </View>
          </InfoCard>

          {/* Order Context */}
          <InfoCard title="Order Context" icon={ShoppingCart}>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-BodyRegular font-Manrope text-neutral-60">Order ID</Text>
                <Text className="text-BodyRegular font-Manrope text-text">#{orderInfo.id}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-BodyRegular font-Manrope text-neutral-60">Order Date</Text>
                <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.orderDate}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-BodyRegular font-Manrope text-neutral-60">Status</Text>
                <Text className="text-BodyRegular font-Manrope text-secondary">{orderInfo.status}</Text>
              </View>
            </View>
          </InfoCard>

          {/* Action Buttons */}
          <View className="flex-row flex justify-between gap-2 mt-4">
            <TouchableOpacity
              className="flex-1 bg-primary py-3 rounded-lg"
              onPress={() => router.push({
                pathname: '/(orders)/OrderTrackingPage',
                params: { orderId: orderInfo.id, itemId: item.id.toString() }
              })}
            >
              <Text className="text-white text-center font-Manrope font-medium">Track Item</Text>
            </TouchableOpacity>
            {orderInfo.status.toLowerCase() === 'completed' ? (
              <TouchableOpacity
                className="flex-1 border border-primary py-3 rounded-lg"
                onPress={() => router.push({
                  pathname: '/(orders)/LeaveReviewPage',
                  params: { orderId: orderInfo.id, itemId: item.id.toString() }
                })}
              >
                <Text className="text-primary text-center font-Manrope font-medium">Leave Review</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
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
        <Text className="text-Heading3 font-Manrope text-text">Order Details</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Order Summary */}
        <InfoCard title="Order Summary" icon={Package}>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Order ID</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.id}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Date</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.orderDate}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Status</Text>
              <View className="bg-yellow-100 px-2 py-1 rounded">
                <Text className="text-xs font-Manrope text-yellow-800">{orderInfo.status}</Text>
              </View>
            </View>
          </View>
        </InfoCard>

        {/* Order Items */}
        <InfoCard title="Order Items" icon={Package}>
          <View className="space-y-4">
            {orderInfo.items.map((item, index) => (
              <View key={item.id} className="flex-row items-center">
                <View className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                  <Image 
                    source={item.image} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-BodyBold font-Manrope text-text">{item.name}</Text>
                  <Text className="text-BodyRegular font-Manrope text-neutral-60">
                    Qty: {item.quantity} • ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </InfoCard>

        {/* Customer Information */}
        <InfoCard title="Customer Information" icon={User}>
          <View className="space-y-2">
            <View>
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Name</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.customer.name}</Text>
            </View>
            <View>
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Email</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.customer.email}</Text>
            </View>
            <View>
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Phone</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.customer.phone}</Text>
            </View>
          </View>
        </InfoCard>

        {/* Shipping Information */}
        <InfoCard title="Shipping Information" icon={MapPin}>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Address</Text>
              <Text className="text-BodyRegular font-Manrope text-text flex-1 text-right">
                {orderInfo.shipping.address.street}, {orderInfo.shipping.address.city}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">State</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.shipping.address.state}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Zip Code</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.shipping.address.zipCode}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Country</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.shipping.address.country}</Text>
            </View>
          </View>
        </InfoCard>

        {/* Payment Information */}
        <InfoCard title="Payment Information" icon={CreditCard}>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Method</Text>
              <Text className="text-BodyRegular font-Manrope text-text">{orderInfo.payment.method}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Subtotal</Text>
              <Text className="text-BodyRegular font-Manrope text-text">${orderInfo.totals.subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Shipping</Text>
              <Text className="text-BodyRegular font-Manrope text-text">${orderInfo.totals.shipping.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-BodyRegular font-Manrope text-neutral-60">Tax</Text>
              <Text className="text-BodyRegular font-Manrope text-text">${orderInfo.totals.tax.toFixed(2)}</Text>
            </View>
            <View className="border-t border-neutral-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-BodyBold font-Manrope text-text">Total</Text>
                <Text className="text-BodyBold font-Manrope text-primary">${orderInfo.totals.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </InfoCard>

        {/* Action Buttons */}
        <View className="flex-row space-x-6 mt-4">
          <TouchableOpacity
            className="flex-1 bg-primary py-3 rounded-lg"
            onPress={() => router.push({
              pathname: '/(orders)/OrderTrackingPage',
              params: { orderId: orderInfo.id }
            })}
          >
            <Text className="text-white text-center font-Manrope font-medium">Track Order</Text>
          </TouchableOpacity>
          {orderInfo.status.toLowerCase() === 'completed' ? (
            <TouchableOpacity
              className="flex-1 border border-primary py-3 rounded-lg"
              onPress={() => router.push({
                pathname: '/(orders)/LeaveReviewPage',
                params: { orderId: orderInfo.id }
              })}
            >
              <Text className="text-primary text-center font-Manrope font-medium">Leave Review</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderInfoPage;
