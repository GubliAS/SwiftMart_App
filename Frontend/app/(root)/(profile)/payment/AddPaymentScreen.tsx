import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AlignLeft, Calendar, ChevronLeft, Shield } from 'lucide-react-native'; // Update import
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCheckout } from '@/context/_CheckoutContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPaymentMethod } from '@/app/api/paymentApi';
import PaymentFormScreen from '@/app/(root)/(checkout)/components/PaymentFormScreen';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useState as useToastState } from 'react';
import { Feather } from '@expo/vector-icons';
import PrimaryButton from '@/components/PrimaryButton';

// Image imports
const visaIcon = require('@/assets/images/visa.png');
const mastercardIcon = require('@/assets/images/visa-mastercard.png');
const mtnIcon = require('@/assets/images/mtn.png');
const vodafoneIcon = require('@/assets/images/vodafone.png');
const airteltigoIcon = require('@/assets/images/airteltigo.png');

const AddPaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type === 'card' || params.type === 'mobile' ? params.type : 'card';
  let setPaymentMethod: ((data: any) => void) | undefined = undefined;
  try {
    setPaymentMethod = useCheckout().setPaymentMethod;
  } catch (e) {
    setPaymentMethod = undefined;
  }
  const [card, setCard] = useState({
    type: 'VISA',
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [mobileMoney, setMobileMoney] = useState({
    network: 'MTN',
    phone: ''
  });

  // Function to format Ghanaian phone numbers
  const formatGhanaianPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Handle different input formats
    let digits = cleaned;
    
    // If starts with +233, remove it
    if (digits.startsWith('233')) {
      digits = '0' + digits.slice(3);
    }
    
    // If doesn't start with 0, add it
    if (digits.length > 0 && !digits.startsWith('0')) {
      digits = '0' + digits;
    }
    
    // Limit to 10 digits (0 + 9 digits)
    digits = digits.slice(0, 10);
    
    // Format as XXX XXX XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
  };

  // Function to validate phone number format for the selected network
  const validatePhoneNumberForNetwork = (phone: string, network: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    
    switch (network) {
      case 'MTN':
        return /^0(24|25|53|54|55|59)\d{7}$/.test(cleaned);
      case 'Vodafone':
        return /^0(20|50|51|52|56)\d{7}$/.test(cleaned);
      case 'AirtelTigo':
        return /^0(26|27|28|57|58)\d{7}$/.test(cleaned);
      default:
        return false;
    }
  };

  // Function to validate card number using Luhn algorithm
  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Check if it's a valid length (13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEvenIndex = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEvenIndex) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEvenIndex = !isEvenIndex;
    }
    
    return sum % 10 === 0;
  };

  // Function to validate expiry date
  const validateExpiryDate = (expiry: string) => {
    if (!expiry || expiry.length !== 5) return false;
    
    const [month, year] = expiry.split('-');
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    
    // Check if month is valid
    if (monthNum < 1 || monthNum > 12) return false;
    
    // Check if date is not in the past
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return false;
    }
    
    return true;
  };

  // Function to validate CVV
  const validateCVV = (cvv: string, cardType: string) => {
    if (!cvv) return false;
    
    // American Express uses 4 digits, others use 3
    const expectedLength = cardType === 'AMEX' ? 4 : 3;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
  };

  // Function to detect card type from number
  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    if (cleaned.startsWith('4')) return 'VISA';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'MasterCard';
    if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'AMEX';
    
    return 'VISA'; // Default
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'VISA': return visaIcon;
      case 'MasterCard': return mastercardIcon;
      case 'VISA/MasterCard': return mastercardIcon;
      default: return null;
    }
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case 'MTN': return mtnIcon;
      case 'Vodafone': return vodafoneIcon;
      case 'AirtelTigo': return airteltigoIcon;
      default: return null;
    }
  };

  const { token } = useAuth();
  const { user } = useUser();

  const [toast, setToast] = useToastState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData: any) => {
    if (!token || !user?.id) return;
    setLoading(true);
    try {
      if (type === 'card') {
        let expiryDate = '';
        if (formData.expiry && formData.expiry.length === 5) {
          const [month, year] = formData.expiry.split('-');
          expiryDate = `20${year}-${month}-01`;
        }
      const cardData = {
          userId: user.id,
          paymentTypeId: 1,
          provider: formData.type,
          accountNumber: formData.number,
          expiryDate,
          isDefault: false,
        };
        await addPaymentMethod(cardData, token);
      if (setPaymentMethod) setPaymentMethod(cardData);
    } else {
      const mobileData = {
          userId: user.id,
          paymentTypeId: 4,
          provider: formData.network,
          accountNumber: formData.phone,
          isDefault: false,
        };
        await addPaymentMethod(mobileData, token);
      if (setPaymentMethod) setPaymentMethod(mobileData);
      }
      setToast('Payment method added!');
      setTimeout(() => {
        setToast('');
      router.replace('./PaymentMethodListScreen');
      }, 1200);
    } catch (e) {
      setToast('Failed to add payment method');
      setTimeout(() => setToast(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  const isCardValid = card.number && card.expiry && card.cvv && 
                   validateCardNumber(card.number) && 
                   validateExpiryDate(card.expiry) && 
                   validateCVV(card.cvv, card.type);
  const isMobileValid = mobileMoney.phone && validatePhoneNumberForNetwork(mobileMoney.phone, mobileMoney.network);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
 <SafeAreaView className="flex-1 bg-white gap-8 py-4">
        {toast ? (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            }}
            pointerEvents="none"
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 16,
                paddingVertical: 24,
                paddingHorizontal: 32,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Feather name="check" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-neutral-10 text-Heading5">{toast}</Text>
            </View>
          </View>
        ) : null}
        <View className='flex-row items-center justify-center'>
            <TouchableOpacity className='absolute left-4' onPress={() => router.back()}>
                <ChevronLeft size={24} color="#404040" />
            </TouchableOpacity>
            <Text className='text-Heading3 font-Manrope text-text'>Choose Payment Type</Text>
                </View>
        <PaymentFormScreen
          type={type}
          onSave={handleSave}
          onCancel={() => router.back()}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AddPaymentScreen;