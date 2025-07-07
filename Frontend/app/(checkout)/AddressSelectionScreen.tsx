import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SavedAddressCard from './components/SavedAddressCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // or useEffect if not using navigation

type Address = {
  id: string;
  name: string;
  phone: string;
  code: string;
  street: string;
  city: string;
  region: string;
  house: string;
  country: string;
  isDefault?: boolean;
};

const AddressSelectionScreen: React.FC = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const handleAddAddress = () => {
    router.push('./components/AddAddress');
  };

  const handleEditAddress = (addressId: string) => {
    router.push({
      pathname: './components/AddAddress',
      params: { 
        addressId,
        editMode: 'true'
      }
    });
  };

  const handleConfirm = () => {
    const selectedAddress = addresses.find(address => address.id === selectedAddressId);
    router.push({
      pathname: './CheckoutScreen',
      params: { selectedAddress: JSON.stringify(selectedAddress) },
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    const existing = await AsyncStorage.getItem('addresses');
    const addresses = existing ? JSON.parse(existing) : [];
    const updatedAddresses = addresses.filter((addr: any) => addr.id !== addressId);
    await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadAddresses = async () => {
        const stored = await AsyncStorage.getItem('addresses');
        setAddresses(stored ? JSON.parse(stored) : []);
      };
      loadAddresses();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Centered Heading */}
      <View className="items-center mb-6">
        <Text className="text-Heading3 font-Manrope text-text">Saved Address</Text>
      </View>

      {addresses.length === 0 ? (
        <View className="items-center justify-center py-16">
          <Text className="text-BodyRegular font-Manrope text-neutral-80 mb-6">
            No saved address.
          </Text>
        </View>
      ) : (
        <View>
          {addresses.map((address) => (
            <SavedAddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEditAddress(address.id)}
              onDelete={() => handleDeleteAddress(address.id)}
              isSelected={selectedAddressId === address.id}
              onPress={() => setSelectedAddressId(address.id)}
            />
          ))}
          {/* Confirm Button */}
          <TouchableOpacity
            className={`rounded-lg p-4 mt-4 items-center mx-auto w-[92%] border border-primary
    ${selectedAddressId ? 'bg-primary' : 'bg-transparent'}`}
            disabled={!selectedAddressId}
            onPress={handleConfirm}
          >
            <Text className={`text-BodyBold font-Manrope ${selectedAddressId ? 'text-neutral-10' : 'text-primary'}`}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add New Address Button (always visible) */}
      <TouchableOpacity
        className="border border-primary rounded-lg p-4 mt-6 items-center mx-auto w-[92%] bg-primary"
        onPress={handleAddAddress}
      >
        <Text className="text-BodyBold font-Manrope text-neutral-10">
          Add New Address
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddressSelectionScreen;