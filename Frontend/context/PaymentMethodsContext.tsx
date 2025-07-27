import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export type PaymentMethod = {
  id: string;
  type: 'VISA' | 'MasterCard' | 'VISA/MasterCard' | 'MobileMoney';
  last4: string;
  network?: 'MTN' | 'Vodafone' | 'AirtelTigo';
  isDefault?: boolean;
  phone?: string;
};

type PaymentMethodsContextType = {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
};

const PaymentMethodsContext = createContext<PaymentMethodsContextType | undefined>(undefined);

export const PaymentMethodsProvider = ({ children }: { children: ReactNode }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('payment_methods');
      if (stored) setPaymentMethods(JSON.parse(stored));
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('payment_methods', JSON.stringify(paymentMethods));
    }
  }, [paymentMethods, loading]);

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => {
      // If setting as default, unset previous default
      let updated = method.isDefault
        ? prev.map(m => ({ ...m, isDefault: false }))
        : prev;
      return [...updated, method];
    });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#156651" />
    </View>
  );

  return (
    <PaymentMethodsContext.Provider value={{ paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod }}>
      {children}
    </PaymentMethodsContext.Provider>
  );
};

export const usePaymentMethods = () => {
  const ctx = useContext(PaymentMethodsContext);
  if (!ctx) throw new Error('usePaymentMethods must be used within a PaymentMethodsProvider');
  return ctx;
}; 