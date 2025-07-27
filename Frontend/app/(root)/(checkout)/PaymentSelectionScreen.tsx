import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useFocusEffect, router } from 'expo-router';
import SavedPaymentCard from './components/SavedPaymentCard';
import { PlusIcon } from 'react-native-heroicons/outline';
import { fetchPaymentMethods, deletePaymentMethod, updatePaymentMethod } from '@/app/api/paymentApi';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useCheckout } from '@/context/_CheckoutContext';
import PrimaryButton from '@/components/PrimaryButton';

type PaymentMethod = {
  id: string;
  type: 'VISA' | 'MasterCard' | 'VISA/MasterCard' | 'MobileMoney';
  last4: string;
  network?: 'MTN' | 'Vodafone' | 'AirtelTigo';
  isDefault?: boolean;
  phone?: string;
};

const PaymentSelectionScreen = () => {
  const { setPaymentMethod } = useCheckout();
  const { token } = useAuth();
  const { user } = useUser();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load payment methods from backend
  const loadPaymentMethods = async () => {
    if (!user?.id || !token) return;
    try {
      const methods = await fetchPaymentMethods(user.id.toString(), token);
      // Map backend data to frontend shape
      const mapped = methods.map((pm: any) => ({
        id: pm.id,
        type: pm.paymentTypeId === 4 ? 'MobileMoney' : pm.provider, // or use a lookup for other types
        last4: pm.accountNumber ? pm.accountNumber.slice(-4) : '',
        network: pm.provider,
        isDefault: pm.isDefault,
        phone: pm.accountNumber,
      }));
      setPaymentMethods(mapped);
      setError(null);
      // Auto-select default method if present
      const defaultMethod = mapped.find((m: any) => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id);
      } else if (mapped.length > 0) {
        setSelectedPaymentMethodId(mapped[0].id);
      }
    } catch (e) {
      setPaymentMethods([]);
      setError('Failed to load payment methods');
    }
  };

  const handleDelete = async (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    if (!token) return;
    await deletePaymentMethod(id, token);
    loadPaymentMethods();
  };

  useEffect(() => {
    loadPaymentMethods();
  }, [user?.id, token]);

  useFocusEffect(
    React.useCallback(() => {
      loadPaymentMethods();
    }, [user?.id, token])
  );

  // Handle selecting a payment method (just highlight, don't navigate)
  const handleSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethodId(method.id);
  };

  // Confirm selection: set in context and route
  const handleConfirm = async () => {
    const selected = paymentMethods.find((m) => m.id === selectedPaymentMethodId);
    if (selected) {
      try {
        setLoading(true);
        if (!selected.isDefault) {
          // Set as default in backend
          await updatePaymentMethod({
            ...selected,
            isDefault: true,
            userId: user && user.id ? String(user.id) : '',
            paymentTypeId: selected.type === 'MobileMoney' ? 4 : 1, // adjust as needed
            provider: selected.network || selected.type,
            accountNumber: selected.phone || selected.last4, // adjust as needed
          }, token || '');
        }
        setPaymentMethod(selected);
    router.replace('/(root)/(checkout)/CheckoutScreen');
      } catch (e) {
        setError('Failed to set payment method as default');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.replace('./CheckoutScreen')}
        >
          <ChevronLeft size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Centered Heading */}
      <View className="items-center mb-6">
        <Text className="text-Heading3 font-Manrope text-text">Payment Method</Text>
      </View>

      {error && <Text style={{color: 'red', margin: 16}}>{error}</Text>}

      <ScrollView className="px-4 pb-4 mb-16 flex-1">
        {paymentMethods.length > 0 ? (
          <View className="mt-4 gap-4">
            {paymentMethods.map((method) => {
              const isSelected = method.id === selectedPaymentMethodId;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handleSelect(method)}
                  style={{
                    borderWidth: 2,
                    borderColor: isSelected ? '#156651' : 'transparent',
                    borderRadius: 14,
                  }}
                >
                <SavedPaymentCard 
                  method={method}
                  onEdit={() => router.push({ pathname: './EditPaymentScreen', params: { id: method.id } })}
                  onDelete={() => handleDelete(method.id)}
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
            marginTop: 32,
          }}
          onPress={() => router.push('./ChoosePaymentTypeScreen')}
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
            <PlusIcon color="#156651" size={18} />
          </View>
          <Text style={{ color: '#156651', fontFamily: 'Manrope-Regular', fontSize: 16 }}>
            Add Payment Option
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Confirm Button at bottom */}
      <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F4EDD8' }}>
        <PrimaryButton
          BtnText="Confirm"
          disabled={!selectedPaymentMethodId || loading}
          loading={loading}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
};

export default PaymentSelectionScreen;