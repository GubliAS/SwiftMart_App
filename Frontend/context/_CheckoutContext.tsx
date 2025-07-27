import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

type Address = {
  id?: string | number;
  name: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  zipCode: string;
  countryId: number;
  countryCode?: string;
  isDefault?: boolean;
  country?: string;
};

type PaymentMethod = {
  type: string;
  last4: string;
  fullNumber?: string;
  network?: string;
  phone?: ReactNode;
  expiry?: string;
  cvv?: string;
};

type CheckoutContextType = {
  address: Address | undefined;
  paymentMethod: PaymentMethod | undefined;
  setAddress: (address: Address | undefined) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod | undefined) => void;
  clearAddress: () => void;
  clearPaymentMethod: () => void;
  clearCheckoutData: () => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

type CheckoutProviderProps = {
  children: ReactNode;
};

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [address, setAddressState] = useState<Address | undefined>();
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod | undefined>();
  const [loading, setLoading] = useState(true);

  // Add this function to clear payment method if it no longer exists
  const clearPaymentMethodIfInvalid = async () => {
    try {
      const stored = await AsyncStorage.getItem('profile_payment_methods');
      const checkoutPayment = await AsyncStorage.getItem('checkout_payment_method');
      if (!checkoutPayment) return;
      const current = JSON.parse(checkoutPayment);
      let arr = [];
      if (stored) arr = JSON.parse(stored);
      const stillExists = arr.some((m: any) => m.id === current.id);
      if (!stillExists) {
        await AsyncStorage.removeItem('checkout_payment_method');
        setPaymentMethodState(undefined);
      }
    } catch (e) {
      // handle error
    }
  };

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem('checkout_address');
        const savedPaymentMethod = await AsyncStorage.getItem('checkout_payment_method');
        
        if (savedAddress) {
          setAddressState(JSON.parse(savedAddress));
        }
        
        if (savedPaymentMethod) {
          setPaymentMethodState(JSON.parse(savedPaymentMethod));
        }
        // After loading, check if payment method is still valid
        await clearPaymentMethodIfInvalid();
      } catch (error) {
        console.error('Error loading checkout data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCheckoutData();
  }, []);

  const setAddress = async (newAddress: Address | undefined) => {
    try {
      if (newAddress) {
        await AsyncStorage.setItem('checkout_address', JSON.stringify(newAddress));
      } else {
        await AsyncStorage.removeItem('checkout_address');
      }
      setAddressState(newAddress);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const setPaymentMethod = async (newPaymentMethod: PaymentMethod | undefined) => {
    try {
      if (newPaymentMethod) {
        await AsyncStorage.setItem('checkout_payment_method', JSON.stringify(newPaymentMethod));
      } else {
        await AsyncStorage.removeItem('checkout_payment_method');
      }
      setPaymentMethodState(newPaymentMethod);
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const clearAddress = async () => {
    try {
      await AsyncStorage.removeItem('checkout_address');
      setAddressState(undefined);
    } catch (error) {
      console.error('Error clearing address:', error);
    }
  };

  const clearPaymentMethod = async () => {
    try {
      await AsyncStorage.removeItem('checkout_payment_method');
      setPaymentMethodState(undefined);
    } catch (error) {
      console.error('Error clearing payment method:', error);
    }
  };

  const clearCheckoutData = async () => {
    try {
      await AsyncStorage.removeItem('checkout_address');
      await AsyncStorage.removeItem('checkout_payment_method');
      setAddressState(undefined);
      setPaymentMethodState(undefined);
    } catch (error) {
      console.error('Error clearing checkout data:', error);
    }
  };

  const value: CheckoutContextType = {
    address,
    paymentMethod,
    setAddress,
    setPaymentMethod,
    clearAddress,
    clearPaymentMethod,
    clearCheckoutData,
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#156651" />
    </View>
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
