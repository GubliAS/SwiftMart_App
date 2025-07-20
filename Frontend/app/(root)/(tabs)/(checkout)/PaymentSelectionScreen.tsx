import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SavedPaymentCard from './components/SavedPaymentCard';
import PaymentFormScreen from './components/PaymentFormScreen';
// import ChoosePaymentTypeScreen from './components/ChoosePaymentTypeScreen';
import { PlusIcon } from 'react-native-heroicons/outline';
import ChoosePaymentTypeScreen from './components/ChoosePaymentTypeScreen';
import { useCheckout } from '@/context/_CheckoutContext';
import { usePaymentMethods, PaymentMethod } from '@/context/PaymentMethodsContext';
import { useCallback } from 'react';

const PaymentSelectionScreen = () => {
  const router = useRouter();
  const { setPaymentMethod } = useCheckout();
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = usePaymentMethods();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'card' | 'mobile'>('card');
  const [showChooser, setShowChooser] = useState(false);

  const handleAddPayment = (type: 'card' | 'mobile') => {
    setFormType(type);
    setShowForm(true);
  };

  const handleSavePayment = (newMethod: PaymentMethod, returnTo?: string) => {
    addPaymentMethod({
      ...newMethod,
      id: Date.now().toString(),
      phone: newMethod.type === 'MobileMoney' ? newMethod.phone : undefined,
      network: newMethod.type === 'MobileMoney' ? newMethod.network : undefined,
      last4: newMethod.type === 'MobileMoney'
        ? newMethod.phone ?? ''
        : newMethod.last4 ?? '',
    });
    // Save to context
    const paymentForCheckout = {
      type: newMethod.type,
      last4: newMethod.type === 'MobileMoney'
        ? newMethod.phone ?? ''
        : newMethod.last4 ?? '',
      fullNumber: newMethod.type !== 'MobileMoney' ? (newMethod as any).number : undefined,
      network: newMethod.type === 'MobileMoney' ? newMethod.network : undefined,
      phone: newMethod.type === 'MobileMoney' ? newMethod.phone : undefined,
      expiry: newMethod.type !== 'MobileMoney' ? (newMethod as any).expiry : undefined,
      cvv: newMethod.type !== 'MobileMoney' ? (newMethod as any).cvv : undefined,
    };
    setPaymentMethod(paymentForCheckout);
    setShowForm(false);
    if (returnTo) {
      router.replace(returnTo as any);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            if (showForm) {
              setShowForm(false);
            } else if (showChooser) {
              setShowChooser(false);
            } else {
              router.back();
            }
          }}
        >
          <ChevronLeft size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Centered Heading */}
      <View className="items-center mb-6">
        <Text className="text-Heading3 font-Manrope text-text">
          {showForm
            ? formType === 'mobile'
              ? 'Add Mobile Money'
              : 'Add New Card'
            : 'Payment Method'}
        </Text>
      </View>

      {showChooser ? (
        <ChoosePaymentTypeScreen
          onSelectType={(type) => {
            setFormType(type);
            setShowChooser(false);
            setShowForm(true);
          }}
          onCancel={() => setShowChooser(false)}
        />
      ) : showForm ? (
        <PaymentFormScreen
          type={formType}
          onSave={(data) => handleSavePayment(data, '/(root)/(tabs)/(checkout)/CheckoutScreen')}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <ScrollView className="px-4 pb-4 flex-1">
          {paymentMethods.length > 0 ? (
            <View className="mt-4">
              {paymentMethods.map((method) => {
                const handleSelect = useCallback(() => {
                  setPaymentMethod(method);
                  router.replace('/(root)/(tabs)/(checkout)/CheckoutScreen');
                }, [method]);
                return (
                  <TouchableOpacity key={method.id} activeOpacity={0.8} onPress={handleSelect}>
                    <SavedPaymentCard 
                      method={method}
                      onEdit={() => {
                        setFormType(method.type === 'MobileMoney' ? 'mobile' : 'card');
                        setShowForm(true);
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-16">
              <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-6">
                No saved payment method.
              </Text>
            </View>
          )}
          {/* Always show the Add Payment Option button */}
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#156651',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: 32, // space below the text
            }}
            onPress={() => setShowChooser(true)}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#156651',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: '#fff',
              }}
            >
              <Text style={{ color: '#156651', fontSize: 18 }}>+</Text>
            </View>
            <Text style={{ color: '#156651', fontFamily: 'Manrope-Regular', fontSize: 16 }}>
              Add Payment Option
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default PaymentSelectionScreen;