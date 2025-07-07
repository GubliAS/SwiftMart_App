import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Dimensions, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Button from "@/components/Button";

type OrderStatusModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onTrackOrder?: () => void;
  onGoToHomePage?: () => void;
  onRetry?: () => void;
  onContactSupport?: () => void;
  // Payment validation
  paymentDetails?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    paymentMethod?: string;
  };
  // Address validation
  addressDetails?: {
    country: string;
    countryCode: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    zipCode: string;
    isDefault: boolean;
  };
};

const { height } = Dimensions.get('window');

type OrderStatus = 'processing' | 'success' | 'failed';

// Removed ADDRESS constant as it's not needed in this modal

export default function OrderStatusModal({ 
  isVisible, 
  onClose,
  onTrackOrder,
  onGoToHomePage,
  onRetry,
  onContactSupport,
  paymentDetails,
  addressDetails
}: OrderStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>('processing');
  const [pan] = useState(new Animated.ValueXY());
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy > 0) { // Only allow downward swipe
        Animated.event([null, { dy: pan.y }], {
          useNativeDriver: false,
        })(e, gestureState);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 50) { // If swiped down more than 50 units
        onClose();
      } else {
        Animated.spring(pan.y, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  // Reset pan value when modal opens
  useEffect(() => {
    if (isVisible) {
      pan.setValue({ x: 0, y: 0 });
    }
  }, [isVisible]);

  const validatePaymentDetails = (payment?: OrderStatusModalProps['paymentDetails']) => {
    if (!payment) return false;    
    const { cardNumber, expiryDate, cvv, paymentMethod } = payment;    

    // For mobile money payments
    if (paymentMethod === 'mobile_money') {
      // Mobile money only needs a valid payment method
      // In a real app, you would also validate phone number and network provider
      return true;
    }

    // For bank transfer payments
    if (paymentMethod === 'bank_transfer') {
      // Bank transfers will be handled by the payment provider
      return true;
    }

    // For card payments
    if (paymentMethod === 'card') {
      // Check if all card details are present
      if (!cardNumber || !expiryDate || !cvv) return false;      
      // Basic card validation
      const isValidCardNumber = cardNumber.replace(/\s/g, '').length >= 15;
      const isValidCVV = cvv.length >= 3;      
      // Expiry date validation (MM/YY format)
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;      
      const isValidExpiry = Number(year) > currentYear || 
        (Number(year) === currentYear && Number(month) >= currentMonth);

      return isValidCardNumber && isValidCVV && isValidExpiry;
    }

    return false;
  };

  const validateAddressDetails = (address?: OrderStatusModalProps['addressDetails']) => {
    if (!address) return false;
    
    const { street, city, country, region, zipCode, name, phone } = address;
    
    // Check if required fields are present
    if (!street || !city || !country || !name || !phone || !region) return false;
    
    // Basic validation for address fields
    const hasValidStreet = street.trim().length >= 5;
    const hasValidCity = city.trim().length >= 2;
    const hasValidCountry = country.trim().length >= 2;
    const hasValidRegion = region.trim().length >= 2;
    const hasValidName = name.trim().length >= 2;
    const hasValidPhone = phone.trim().length >= 10;
    
    // ZIP code is optional
    const hasValidZipCode = !zipCode || zipCode.trim().length >= 4;

    return (
      hasValidStreet && 
      hasValidCity && 
      hasValidCountry && 
      hasValidRegion && 
      hasValidName && 
      hasValidPhone && 
      hasValidZipCode
    );
  };

  useEffect(() => {
    if (isVisible && status === 'processing') {
      const validateOrderDetails = async () => {
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log('Payment Details received:', paymentDetails);
          console.log('Address Details received:', addressDetails);
          
          const hasValidPayment = validatePaymentDetails(paymentDetails);
          const hasValidAddress = validateAddressDetails(addressDetails);

          console.log('Validation Results:', {
            payment: {
              isValid: hasValidPayment,
              details: paymentDetails
            },
            address: {
              isValid: hasValidAddress,
              details: addressDetails
            }
          });

          if (hasValidPayment && hasValidAddress) {
            setStatus('success');
          } else {
            setStatus('failed');
            console.log('Validation failed because:', {
              payment: hasValidPayment ? 'valid' : 'missing or invalid payment details',
              address: hasValidAddress ? 'valid' : 'missing or invalid address details'
            });
          }
        } catch (error) {
          setStatus('failed');
          console.error('Order processing error:', error);
        }
      };

      validateOrderDetails();
    }
  }, [isVisible, paymentDetails, addressDetails]);

  // Removed header and address render functions as they should not be in this modal

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <>
            <View className="w-40 h-40 rounded-full bg-[#E7F1EF] items-center justify-center mb-8">
              <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
                <MaterialCommunityIcons name="timer-sand" size={40} color="#fff" />
              </View>
            </View>
            <Text className="text-2xl font-Manrope font-bold text-[#111] mb-4">Processing Order</Text>
            <Text className="text-[#666] text-center text-base leading-6">
              Please hold on while we confirm your payment.{'\n'}Don't close this app — This will only take{'\n'}a moment.
            </Text>
          </>
        );
      case 'success':
        return (
          <>
            <View className="w-40 h-40 rounded-full bg-[#E7F1EF] items-center justify-center mb-8">
              <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
                <MaterialIcons name="check" size={40} color="#fff" />
              </View>
            </View>
            <Text className="text-2xl font-Manrope font-bold text-[#111] mb-4">Order Successful</Text>
            <Text className="text-[#666] text-center text-base leading-6 mb-8">
              Congratulations! Your order has been{'\n'}placed successfully.
            </Text>
            <View className="w-full space-y-4">
              <Button 
                BtnText="Track Order"
                bgColor="bg-[#156651]"
                textColor="text-white"
                onPress={onTrackOrder}
                hasBorder={false}
              />
              <Button 
                BtnText="Go To HomePage"
                bgColor="bg-white"
                textColor="text-[#111]"
                hasBorder
                borderColor="border-neutral-200"
                onPress={onGoToHomePage}
              />
            </View>
          </>
        );
      case 'failed':
        return (
          <>
            <View className="w-40 h-40 rounded-full bg-[#FFECEC] items-center justify-center mb-8">
              <View className="w-20 h-20 rounded-full bg-alert items-center justify-center">
                <MaterialIcons name="close" size={40} color="#fff" />
              </View>
            </View>
            <Text className="text-2xl font-Manrope font-bold text-[#111] mb-4">Order Failed</Text>
            <Text className="text-[#666] text-center text-base leading-6 mb-8">
              Sorry! We weren't able to place your order.
            </Text>
            <View className="w-full space-y-4">
              <Button 
                BtnText="Retry"
                bgColor="bg-alert"
                textColor="text-white"
                onPress={handleRetry}
                hasBorder={false}
              />
              <Button 
                BtnText="Contact Support"
                bgColor="bg-white"
                textColor="text-[#111]"
                hasBorder
                borderColor="border-neutral-200"
                onPress={onContactSupport}
              />
            </View>
          </>
        );
    }
  };

  const handleRetry = () => {
    setStatus('processing'); // Reset status to processing
    // The useEffect will automatically trigger the validation again
    // when the status changes to 'processing'
    if (onRetry) {
      onRetry(); // Call the parent's retry handler if provided
    }
  };

  // Reset status when modal is opened
  useEffect(() => {
    if (isVisible) {
      setStatus('processing');
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 justify-end">
          <Animated.View 
            className="bg-white rounded-t-3xl"
            style={[
              {
                height: height * 0.55,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                transform: [{ translateY: pan.y }],
              }
            ]}
            {...panResponder.panHandlers}
          >
            {/* Horizontal bar for closing modal */}
            <TouchableOpacity 
              className="w-full items-center pt-3 pb-2"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <View className="w-16 h-1 bg-neutral-200 rounded-full" />
            </TouchableOpacity>
            
            {/* Content Container */}
            <View className="flex-1 px-6 items-center justify-center">
              {renderContent()}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}