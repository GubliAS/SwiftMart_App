import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PaymentFormScreen from '@/app/(root)/(checkout)/components/PaymentFormScreen';
import { fetchPaymentMethods, updatePaymentMethod } from '@/app/api/paymentApi';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

const EditPaymentScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      if (!user?.id || !token || !id) return;
      try {
        const methods = await fetchPaymentMethods(user.id.toString(), token);
        const found = methods.find((m: any) => m.id?.toString() === id?.toString());
        setMethod(found);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id, token, id]);

  if (loading) return null;
  if (!method) return <></>;

  // Determine type and initial values
  const isMobile = method.paymentTypeId === 4 || method.type === 'MobileMoney';
  const type = isMobile ? 'mobile' : 'card';
  const initialValues = isMobile
    ? {
        network: method.provider,
        phone: method.accountNumber || method.phone,
      }
    : {
        type: method.provider,
        number: method.accountNumber,
        expiry: method.expiryDate && method.expiryDate.length >= 7
          ? (() => {
              // Convert 'YYYY-MM-DD' to 'MM-YY'
              const [year, month] = method.expiryDate.split('-');
              return `${month}-${year.slice(-2)}`;
            })()
          : '',
        cvv: '', // CVV is never stored
        name: '', // Name is not stored
      };

  const handleSave = async (formData: any) => {
    if (type === 'card') {
      let expiryDate = '';
      if (formData.expiry && formData.expiry.length === 5) {
        const [month, year] = formData.expiry.split('-');
        expiryDate = `20${year}-${month}-01`;
      }
      const cardData = {
        ...method,
        provider: formData.type,
        accountNumber: formData.number,
        expiryDate,
      };
      console.log('EditPaymentScreen - formData.expiry:', formData.expiry);
      console.log('EditPaymentScreen - expiryDate:', expiryDate);
      console.log('EditPaymentScreen - cardData:', cardData);
      await updatePaymentMethod(cardData, token || '');
    } else {
      const mobileData = {
        ...method,
        provider: formData.network,
        accountNumber: formData.phone,
      };
      console.log('EditPaymentScreen - mobileData:', mobileData);
      await updatePaymentMethod(mobileData, token || '');
    }
    router.replace('./PaymentMethodListScreen');
  };

  return (
    <SafeAreaView className='flex-1  gap-4 py-4 bg-white'>
      <Text className=' w-full text-center text-Heading3 font-Manrope text-text '>
        Edit Payment Method
      </Text>
      <View className='flex-1'>

    <PaymentFormScreen
      type={type}
      initialValues={initialValues}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
      </View>
    </SafeAreaView>
  );
};

export default EditPaymentScreen; 