

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import SavedAddressCard from '@/app/components/SavedAddressCard';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { fetchAddresses, deleteAddress, setDefaultAddress, Address } from '@/app/api/addressApi';
import { useFocusEffect } from 'expo-router';


const SavedAddressScreen: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAddresses = async () => {
    if (!user?.id || !token) return;
    try {
      const data = await fetchAddresses(user.id, token);
      
      // Find the default address from the backend response
      const defaultAddress = data.find(addr => addr.isDefault === true);
      setDefaultAddressId(defaultAddress?.id || null);
      
      // Sort addresses: default address first, then others
      const sortedAddresses = data.sort((a, b) => {
        const aIsDefault = a.isDefault === true;
        const bIsDefault = b.isDefault === true;
        
        if (aIsDefault && !bIsDefault) return -1; // a comes first
        if (!aIsDefault && bIsDefault) return 1;  // b comes first
        return 0; // both have same default status, maintain original order
      });
      
      setAddresses(sortedAddresses);
      setErrorMsg(null);
    } catch (error: any) {
      console.error('Error loading addresses:', error);
      setErrorMsg(error.message || 'Failed to load addresses');
      setAddresses([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleAddAddress = async () => {
    router.push('/(root)/(profile)/address/AddAddress');
  };

  const handleEditAddress = async (addressId: string) => {
    router.push({
      pathname: '/(root)/(profile)/address/AddAddress',
      params: {
        addressId,
        editMode: 'true',
        returnTo: '/(root)/(profile)/SavedAddressScreen'
      },
    });
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id || !token) return;
    try {
      await setDefaultAddress(user.id, addressId, token);
      // Update the default address ID
      setDefaultAddressId(addressId);
      // Reload addresses to get updated default status
      await loadAddresses();
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to set default address');
      console.error('Set default error:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token || !user?.id) return;
    try {
      console.log('Attempting to delete address:', addressId);
      await deleteAddress(Number(addressId), token, user.id);
      setAddresses(addresses.filter((addr) => Number(addr.id) !== Number(addressId)));
      
      // If we deleted the default address, clear the default address ID
      if (addressId === defaultAddressId) {
        setDefaultAddressId(null);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to delete address');
      console.error('Delete error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAddresses();
    }, [user, token])
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 mt-16">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* Centered Heading */}
      <View className="items-center mb-6">
        <Text className="text-Heading3 font-Manrope text-text">
          Saved Address
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
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
                address={{
                  ...address,
                  countryCode: address.zipCode ?? '',
                  zipCode: address.zipCode ?? '',
                  isDefault: address.id === defaultAddressId,
                }}
                onEdit={() => handleEditAddress(address.id)}
                onDelete={() => handleDeleteAddress(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
            ))}
          </View>
        )}

        {/* Add New Address Button (always visible) */}
        <TouchableOpacity
          className="border border-primary rounded-lg p-4 mt-6 items-center mx-auto w-[92%] bg-primary mb-8"
          onPress={handleAddAddress}
        >
          <Text className="text-BodyBold font-Manrope text-neutral-10">
            Add New Address
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {errorMsg ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</Text> : null}
    </View>
  );
};


export default SavedAddressScreen; 