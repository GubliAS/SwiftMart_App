import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import SavedPaymentCard from '@/app/(root)/(checkout)/components/SavedPaymentCard';
import { PlusIcon } from 'react-native-heroicons/outline';
import { fetchPaymentMethods, deletePaymentMethod, updatePaymentMethod } from '@/app/api/paymentApi';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';

type PaymentMethod = {
  id: string;
  type: 'VISA' | 'MasterCard' | 'VISA/MasterCard' | 'MobileMoney';
  last4: string;
  network?: 'MTN' | 'Vodafone' | 'AirtelTigo';
  isDefault?: boolean;
  phone?: string;
};

const PaymentMethodListScreen = () => {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const { user } = useUser();
  // Load payment methods from backend
  const loadPaymentMethods = async () => {
    if (!user?.id || !token) return;
    try {
      const methods = await fetchPaymentMethods(user.id.toString(), token);
      console.log('Fetched payment methods (raw):', methods);
      const mapped = methods.map((pm: any) => ({
        id: pm.id,
        type: pm.paymentTypeId === 4 ? 'MobileMoney' : pm.provider, // or use a lookup for other types
        last4: pm.accountNumber ? pm.accountNumber.slice(-4) : '',
        network: pm.provider,
        isDefault: pm.isDefault,
        phone: pm.accountNumber,
      }));
      console.log('Mapped payment methods:', mapped);
      setPaymentMethods(mapped);
      setError(null);
    } catch (e) {
      setPaymentMethods([]);
      setError('Failed to load payment methods');
      console.error('Error loading payment methods:', e);
    }
  };

  // Delete handler for payment method
  const handleDelete = async (id: string) => {
    if (!token) return;
    // Optimistically update UI
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    try {
      await deletePaymentMethod(id, token);
      loadPaymentMethods();
    } catch (e) {
      setError('Failed to delete payment method');
      // Optionally, revert UI or show a toast
    }
  };

  // Set as default handler
  const handleSetDefault = async (method: PaymentMethod) => {
    if (!token || !user?.id) return;
    try {
      // Call backend to set this method as default
      await updatePaymentMethod({
        ...method,
        isDefault: true,
        userId: user.id,
        paymentTypeId: method.type === 'MobileMoney' ? 4 : 1, // adjust as needed
        provider: method.network || method.type,
        accountNumber: method.phone || method.last4, // adjust as needed
      }, token);
      loadPaymentMethods();
    } catch (e) {
      setError('Failed to set default payment method');
    }
  };

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPaymentMethods();
    }, [])
  );

  return (
    <View className="flex-1  bg-white">
      {/* Back Button */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.replace('/(root)/(tabs)/Profile')}
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

      <ScrollView className="px-4 pb-4  flex-1">
        {paymentMethods.length > 0 ? (
          <View className="mt-4 gap-4">
            {paymentMethods
              .slice() // copy array
              .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)) // default at top
              .map((method) => (
              <SavedPaymentCard 
                key={method.id}
                method={method}
                onEdit={() => router.push({ pathname: './EditPaymentScreen', params: { id: method.id } })}
                  onDelete={() => handleDelete(method.id)}
                  onSetDefault={() => handleSetDefault(method)}
              />
            ))}
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
            marginBottom: 64,
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
    </View>
  );
};

export default PaymentMethodListScreen; 