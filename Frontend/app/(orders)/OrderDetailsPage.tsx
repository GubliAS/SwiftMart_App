import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Navigate to a specific screen if can't go back
      router.replace('/(orders)/TransactionPage');
    }
  };

  // Mock data for different orders with their respective items
  const getOrderDetails = (orderId: string) => {
    const orderData = {
      'SWM93284': {
        id: 'SWM93284',
        items: [
          {
            id: 1,
            name: 'DEXO',
            price: 230.00,
            quantity: 1,
            image: require('../../assets/images/yellow-chair.png'),
            description: 'Comfortable ergonomic office chair',
            status: 'In Progress'
          },
          {
            id: 2,
            name: 'Office Supplies',
            price: 44.13,
            quantity: 1,
            image: require('../../assets/images/buildingblocks.jpeg'),
            description: 'Various office supplies',
            status: 'In Progress'
          }
        ]
      },
      'SWM96254': {
        id: 'SWM96254',
        items: [
          {
            id: 1,
            name: 'REXO',
            price: 590.13,
            quantity: 1,
            image: require('../../assets/images/sofa.jpeg'),
            description: 'Modern living room sofa',
            status: 'Completed'
          },
          {
            id: 2,
            name: 'Apple Device',
            price: 508.00,
            quantity: 1,
            image: require('../../assets/images/computer.png'),
            description: 'Apple electronic device',
            status: 'Completed'
          }
        ]
      },
      'SWM87456': {
        id: 'SWM87456',
        items: [
          {
            id: 1,
            name: 'NEXO',
            price: 450.75,
            quantity: 1,
            image: require('../../assets/images/diningtable.jpeg'),
            description: 'Elegant dining table',
            status: 'Delivered'
          }
        ]
      },
      'SWM78901': {
        id: 'SWM78901',
        items: [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 320.50,
            quantity: 1,
            image: require('../../assets/images/computer.png'),
            description: 'High-quality wireless headphones',
            status: 'Completed'
          }
        ]
      },
      'SWM65432': {
        id: 'SWM65432',
        items: [
          {
            id: 1,
            name: 'Phone Case',
            price: 45.00,
            quantity: 1,
            image: require('../../assets/images/buildingblocks.jpeg'),
            description: 'Protective phone case',
            status: 'Completed'
          },
          {
            id: 2,
            name: 'Screen Protector',
            price: 111.75,
            quantity: 1,
            image: require('../../assets/images/buildingblocks.jpeg'),
            description: 'Tempered glass screen protector',
            status: 'Completed'
          }
        ]
      }
    };

    return orderData[orderId as keyof typeof orderData] || orderData['SWM93284'];
  };

  const orderDetails = getOrderDetails(orderId as string);

  const handleDetailPress = (itemId: number) => {
    // Navigate to item detail page using OrderInfoPage
    router.push({
      pathname: '/(orders)/OrderInfoPage',
      params: { 
        orderId: orderDetails.id,
        itemId: itemId.toString(),
        mode: 'item' // Flag to show item details instead of full order
      }
    });
  };

  const handleTrackPress = (itemId: number) => {
    // Navigate to tracking page
    router.push({
      pathname: '/(orders)/OrderTrackingPage',
      params: { 
        orderId: orderDetails.id,
        itemId: itemId.toString()
      }
    });
  };

  const handleLeaveReviewPress = (itemId: number) => {
    // Navigate to leave review page
    router.push({
      pathname: '/(orders)/LeaveReviewPage',
      params: { 
        orderId: orderDetails.id,
        itemId: itemId.toString()
      }
    });
  };

  const handleReceivedPress = (itemId: number) => {
    // Handle marking item as received
    // This could update the order status or show a confirmation
    console.log('Item received:', itemId);
    // For now, just show an alert or update local state
  };

  const handleInfoPress = () => {
    // Navigate to full order details page
    router.push({
      pathname: '/(orders)/OrderInfoPage',
      params: { 
        orderId: orderDetails.id
        // No itemId or mode params - shows full order details
      }
    });
  };

  const getSecondaryButtonConfig = (status: string) => {
    switch (status.toLowerCase()) {
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
      default: // In Progress, Processing, etc.
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
        return 'bg-secondary/20';
      case 'completed':
        return 'bg-primary/20';
      case 'delivered':
        return 'bg-green-100';
      default:
        return 'bg-secondary/20';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'text-secondary';
      case 'completed':
        return 'text-primary';
      case 'delivered':
        return 'text-green-800';
      default:
        return 'text-secondary';
    }
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
        <Text className="text-Heading3 font-Manrope text-text">Order #{orderDetails.id}</Text>
        <TouchableOpacity 
          className="absolute right-4"
          onPress={handleInfoPress}
        >
          <Info size={24} color="#156651" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-2">
        {/* Order Items */}
        {orderDetails.items.map((item) => (
          <View key={item.id} className="bg-white border border-neutral-40 rounded-2xl p-4 mb-4 shadow-sm relative" style={{ height: 180 }}>
            {/* Order Status Badge - Top Right */}
            <View className="absolute top-4 right-4">
              <View className={`${getStatusBadgeColor(item.status)} px-3 py-1 rounded-full`}>
                <Text className={`text-Caption font-Manrope ${getStatusTextColor(item.status)}`}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View className="flex-row h-full">
              {/* Product Image */}
              <View className="w-28 h-28 rounded-lg overflow-hidden mr-4">
                <Image 
                  source={item.image} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Product Details */}
              <View className="flex-1 justify-between">
                <View>
                  <Text className="text-BodyBold font-Manrope text-text mb-1">{item.name}</Text>
                  <Text className="text-BodyBold font-Manrope text-text mb-2">${item.price.toFixed(2)}</Text>
                  <Text className="text-BodySmallRegular font-Manrope text-neutral-60">
                    Qty: {item.quantity}
                  </Text>
                </View>

                {/* Action Buttons  */}
                <View className="flex-row space-x-1" style={{ width: '100%' }}>
                  <TouchableOpacity
                    onPress={() => handleDetailPress(item.id)}
                    className="flex-1 border border-primary rounded-lg py-3 px-4"
                  >
                    <Text className="text-primary text-center font-Manrope text-BodySmallBold">
                      Detail
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const buttonConfig = getSecondaryButtonConfig(item.status);
                      buttonConfig.onPress(item.id);
                    }}
                    className={`flex-1 ${getSecondaryButtonConfig(item.status).style} rounded-lg py-3 px-4`}
                  >
                    <Text className="text-white text-center font-Manrope text-BodySmallBold">
                      {getSecondaryButtonConfig(item.status).text}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsPage;
