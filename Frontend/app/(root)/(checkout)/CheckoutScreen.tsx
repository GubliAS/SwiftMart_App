import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native';
import type { ReactNode } from 'react';
import Button from '@/components/Button';
import OrderStatusModal from './components/OrderStatusModal';
import { ChevronLeft } from 'lucide-react-native';
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import ShoppingCartTotalModal from './components/ShoppingCartTotalModal';
import { useCheckout } from '@/context/_CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { mockProcessPayment } from '@/app/api/mockPayment';
import { fetchDefaultPaymentMethod } from '@/app/api/paymentApi';
import { fetchDefaultAddress } from '@/app/api/addressApi';
import { useFocusEffect } from 'expo-router';

// Image imports
const houseIcon = require('@/assets/images/house.png');
const mastercardIcon = require('@/assets/images/mastercard.png');

const CheckoutScreen = () => {
  const params = useLocalSearchParams();
  const { address: contextAddress } = useCheckout();
  const { token } = useAuth();
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      router.replace('/(auth)/Login');
    }
  }, [token]);

  // Fetch default payment method on load
  useEffect(() => {
    const fetchDefault = async () => {
      if (!user?.id || !token) {
        setPaymentMethod(null);
        setLoadingPayment(false);
        return;
      }
      setLoadingPayment(true);
      try {
        const method = await fetchDefaultPaymentMethod(String(user.id), token);
        console.log('Fetched default payment method:', method);
        let mapped = null;
        if (method) {
          mapped = {
            id: method.id,
            type: method.paymentTypeId === 4 ? 'MobileMoney' : method.provider,
            last4: method.accountNumber ? method.accountNumber.slice(-4) : '',
            network: method.provider,
            isDefault: method.isDefault,
            phone: method.accountNumber,
            expiry: method.expiryDate,
          };
        }
        setPaymentMethod(mapped);
        setPaymentError(null);
      } catch (e: any) {
        setPaymentMethod(null);
        setPaymentError('Failed to fetch payment method');
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchDefault();
  }, [user?.id, token]);

  // Fetch default address on load
  const fetchDefaultAddressData = async () => {
    if (!user?.id || !token) {
      setAddress(null);
      setLoadingAddress(false);
      return;
    }
    setLoadingAddress(true);
    try {
      const defaultAddress = await fetchDefaultAddress(user.id, token);
      console.log('Fetched default address:', defaultAddress);
      if (defaultAddress) {
        // Ensure zipCode is set from postalCode if missing
        const zipCode = defaultAddress.zipCode || defaultAddress.postalCode || '';
        setAddress({ ...defaultAddress, zipCode });
      } else {
        setAddress(null);
      }
      setAddressError(null);
    } catch (e: any) {
      setAddress(null);
      setAddressError('Failed to fetch address');
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchDefaultAddressData();
  }, [user?.id, token]);

  // Refetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDefaultAddressData();
    }, [user?.id, token])
  );

  // Parse cart from params
  const cart = params.cart ? JSON.parse(params.cart as string) : undefined;

  // Calculate subtotal and shipping based on cart items
  const subtotal =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ) || 0;
  const shipping = 6.96; 
  const total = subtotal + shipping;

  // State for modal visibility
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Handlers
  const handleEditAddress = () => {
    // Navigate to address selection/edit screen
    router.push('/(root)/(checkout)/AddressSelectionScreen');
  };

  const handleEditPayment = () => {
    // Navigate to payment selection screen
    router.push('/(root)/(checkout)/PaymentSelectionScreen');
  };

  const handleOpenOrderModal = async () => {
    if (!address || !paymentMethod) {
      return;
    }
    setIsProcessingPayment(true);
    setPaymentError(null);
    try {
      const result = await mockProcessPayment({ address, paymentMethod, total });
      setIsProcessingPayment(false);
      if (result.success) {
    setIsOrderModalVisible(true);
      } else {
        setPaymentError(result.message);
      }
    } catch (e: any) {
      setIsProcessingPayment(false);
      setPaymentError(e.message || 'Payment failed.');
    }
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalVisible(false);
  };

  const handleCheckoutNow = () => {
    if (!address || !paymentMethod) {
      // You can add a toast or alert here to inform the user
      return;
    }
    setIsCartModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsCartModalVisible(false);
  };

  const getPaymentIcon = () => {
    if (!paymentMethod) return mastercardIcon;
    if (paymentMethod.type === 'VISA') return require('@/assets/images/visa.png');
    if (paymentMethod.type === 'MasterCard') return require('@/assets/images/mastercard.png');
    if (paymentMethod.type === 'VISA/MasterCard') return require('@/assets/images/visa-mastercard.png');
    if (paymentMethod.type === 'MobileMoney') {
      switch (paymentMethod.network) {
        case 'MTN': return require('@/assets/images/mtn.png');
        case 'Vodafone': return require('@/assets/images/vodafone.png');
        case 'AirtelTigo': return require('@/assets/images/airteltigo.png');
        default: return require('@/assets/images/mobile-money.png');
      }
    }
    return mastercardIcon;
  };

  if (loadingPayment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">Loading payment method...</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-neutral-20">
        {/* Header with Back button */}
        <View className="flex-row items-center p-4" style={{ marginTop: 16 }}>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.push('/(root)/(tabs)/CartScreen')}
          >
            <ChevronLeft size={24} color="#156651" />
            <Text className="text-BodyRegular font-Manrope text-primary ml-2">Back To Cart</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="px-4 pb-4">
          {/* Checkout Title */}
          <View className="items-center mb-6">
            <Text className="text-Heading3 font-Manrope text-text">Checkout</Text>
          </View>
          
          {/* Address Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-semibold font-Manrope">Address</Text>
              <TouchableOpacity onPress={handleEditAddress}>
                <Text className="text-BodyRegular font-Manrope text-primary">Edit</Text>
              </TouchableOpacity>
            </View>
            {loadingAddress ? (
              <View className="py-4"><Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">Getting things ready...</Text></View>
            ) : address ? (
              <View className="bg-neutral-10 rounded-lg p-4 shadow-sm flex-row">
                <Image 
                  source={houseIcon} 
                  className="h-16 w-16 mr-4" 
                  resizeMode="contain"
                />
                <View className="flex-1">
                  {/* Contact name and ZIP code row */}
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-BodyBold font-Manrope text-text">{address.name || 'No name provided'}</Text>
                    <View className="bg-neutral-20 px-2 py-1 rounded">
                      <Text className="text-sm font-medium text-neutral-60">
                        ZIP: {address.zipCode || 'N/A'}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Address details */}
                  <Text className="text-BodyRegular font-Manrope text-text mb-1">{address.street}</Text>
                  <Text className="text-BodyRegular font-Manrope text-text mb-1">{address.city}{address.region ? `, ${address.region}` : ''}</Text>
                  <Text className="text-BodyRegular font-Manrope text-text">{address.country || ''}</Text>
                </View>
              </View>
            ) : (
              <View className="py-4">
                <Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">
                  No address has been chosen.
                </Text>
              </View>
            )}
            {addressError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{addressError}</Text>}
          </View>
          
          {/* Payment Method Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-semibold font-Manrope">Payment method</Text>
              <TouchableOpacity onPress={handleEditPayment}>
                <Text className="text-BodyRegular font-Manrope text-primary">Edit</Text>
              </TouchableOpacity>
            </View>
            {loadingPayment ? (
              <View className="py-4"><Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">Getting things ready...</Text></View>
            ) : paymentMethod && paymentMethod.type ? (
              <View className="bg-neutral-10 rounded-lg p-4 shadow-sm flex-row">
                <Image 
                  source={getPaymentIcon()} 
                  className="h-16 w-16 mr-4" 
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="text-BodyBold font-Manrope text-text mb-1">{paymentMethod.type}</Text>
                  <Text className="text-BodyRegular font-Manrope text-text">
                    {paymentMethod.type === 'MobileMoney'
                      ? paymentMethod.phone // show full phone number
                      : `**** **** **** ${paymentMethod.last4}`} {/* show only last 4 for cards */}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="py-4">
                <Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">
                  No payment method has been chosen.
                </Text>
              </View>
            )}
            {paymentError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{paymentError}</Text>}
          </View>
         
        </ScrollView>

        {/* Bottom Container with Cart Icon and Checkout Button */}
        <View className="absolute bottom-6 left-4 right-4">
          <View className="relative">
            {/* Shopping Cart Button - Small Square */}
            <TouchableOpacity 
              className="absolute -top-14 right-0 bg-primary shadow-sm p-3 rounded-md z-10"
              onPress={handleCheckoutNow}
              style={{ opacity: address && paymentMethod ? 1 : 0.5 }}
              disabled={!address || !paymentMethod}
            >
              <AntDesign name="shoppingcart" size={20} color="white" />
            </TouchableOpacity>

            {/* Checkout Button */}
            <Button 
              BtnText={isProcessingPayment ? 'Processing...' : 'Checkout'}
              onPress={handleOpenOrderModal}
              bgColor="bg-primary"
              disabled={!address || !paymentMethod || isProcessingPayment}
            />
            {paymentError && (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{paymentError}</Text>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Shopping Cart Total Modal */}
      <ShoppingCartTotalModal
        isVisible={isCartModalVisible}
        subtotal={subtotal}
        shipping={shipping}
        onClose={handleCloseModal}
      />

      {/* Order Status Modal */}
      <OrderStatusModal
        isVisible={isOrderModalVisible}
        onClose={handleCloseOrderModal}
        paymentDetails={{
          paymentMethod: paymentMethod?.type,
          cardNumber: paymentMethod?.fullNumber || paymentMethod?.last4,
          expiryDate: paymentMethod?.type !== 'MobileMoney' ? (paymentMethod as any)?.expiry : undefined,
          cvv: paymentMethod?.type !== 'MobileMoney' ? (paymentMethod as any)?.cvv : undefined,
          network: paymentMethod?.network,
          phone: paymentMethod?.type === 'MobileMoney' ? String(paymentMethod?.phone || paymentMethod?.last4) : undefined
        }}
        addressDetails={{
          country: address?.country || '',
          countryCode: address?.zipCode || '',
          name: address?.name || '',
          phone: address?.phone || '',
          street: address?.street || '',
          city: address?.city || '',
          region: address?.region || '',
          zipCode: address?.zipCode || '',
          isDefault: false
        }}
        onTrackOrder={() => {
          router.push('/(orders)/OrderTrackingPage');
          setIsOrderModalVisible(false);
        }}
        onGoToHomePage={() => {
          setIsOrderModalVisible(false);
          router.push('/(root)/(tabs)/Home');
        }}
        onRetry={() => {
          setIsOrderModalVisible(false);
        }}
        onContactSupport={() => {
          setIsOrderModalVisible(false);
        }}
      />
    </>
  );
};

export default CheckoutScreen;
