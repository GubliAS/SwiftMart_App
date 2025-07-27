import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Image imports
import visaIcon from '@/assets/images/visa.png';
import mastercardIcon from '@/assets/images/mastercard.png';
import visaMastercardIcon from '@/assets/images/visa-mastercard.png';
import mobileMoneyIcon from '@/assets/images/mobile-money.png';
import mtnIcon from '@/assets/images/mtn.png';
import vodafoneIcon from '@/assets/images/vodafone.png';
import airteltigoIcon from '@/assets/images/airteltigo.png';

type PaymentMethod = {
  id: string;
  type: 'VISA' | 'MasterCard' | 'VISA/MasterCard' | 'MobileMoney';
  last4: string;
  phone?: string; // <-- Add this line
  network?: 'MTN' | 'Vodafone' | 'AirtelTigo';
  isDefault?: boolean;
};

const SavedPaymentCard = ({ method, onEdit, onDelete, onSetDefault }: { method: PaymentMethod, onEdit?: () => void, onDelete?: () => void, onSetDefault?: () => void }) => {
  const getPaymentIcon = () => {
    if (method.type === 'VISA') return visaIcon;
    if (method.type === 'MasterCard') return mastercardIcon;
    if (method.type === 'VISA/MasterCard') return visaMastercardIcon;
    if (method.type === 'MobileMoney') {
      switch (method.network) {
        case 'MTN': return mtnIcon;
        case 'Vodafone': return vodafoneIcon;
        case 'AirtelTigo': return airteltigoIcon;
        default: return mobileMoneyIcon;
      }
    }
    return null;
  };

  const handleDelete = async () => {
    try {
      const stored = await AsyncStorage.getItem('profile_payment_methods');
      let arr = [];
      if (stored) arr = JSON.parse(stored);
      const updated = arr.filter((m: any) => m.id !== method.id);
      await AsyncStorage.setItem('profile_payment_methods', JSON.stringify(updated));
      if (onDelete) onDelete(); // Optionally notify parent
    } catch (e) {
      // handle error
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F4EDD8', // or your neutral-200
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center">
          <Image 
            source={getPaymentIcon()} 
            className="w-12 h-8 mr-3" 
            resizeMode="contain"
          />
          <Text className="text-BodyBold font-Manrope text-text">
            {method.type === 'MobileMoney' 
              ? `${method.network} Mobile Money` 
              : method.type}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={{ marginRight: 8 }}>
              <Text className="text-BodyRegular font-Manrope text-primary">Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDelete}>
            <Trash2 size={28} color="#E44A4A" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text className="text-BodyRegular font-Manrope text-text">
        {method.type === 'MobileMoney'
          ? method.phone // Show full phone number
          : `**** **** **** ${method.last4}`}
      </Text>
      {/* Set as Default Button - move above Default Payment label */}
      {!method.isDefault && onSetDefault && (
        <TouchableOpacity
          onPress={onSetDefault}
          style={{
            marginTop: 10,
            marginBottom: 2,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#156651',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Text className="text-BodySmallRegular font-Manrope text-primary">Set as Default</Text>
        </TouchableOpacity>
      )}
      {method.isDefault && (
        <View className="mt-2 pt-2 border-t border-neutral-100">
          <Text className="text-BodySmallRegular font-Manrope text-primary">
            Default Payment
          </Text>
        </View>
      )}
    </View>
  );
};

export default SavedPaymentCard;