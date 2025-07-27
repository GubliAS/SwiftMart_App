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
import SavedAddressCard from "./components/SavedAddressCard";
import { useCheckout } from '@/context/_CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
// Corrected import path for addressApi (should be '@/api/addressApi')
import { fetchAddresses, deleteAddress, setDefaultAddress, Address } from '@/app/api/addressApi';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";

const AddressSelectionScreen = () => {
  const router = useRouter();
  const { setAddress, clearAddress } = useCheckout();
  const { token } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleAddAddress = async () => {
    await router.push("/(root)/(checkout)/AddAddress");
    loadAddresses();
  };

  const handleEditAddress = async (addressId: string) => {
    await router.push({
      pathname: "/(root)/(checkout)/AddAddress",
      params: {
        addressId,
        editMode: "true",
      },
    });
    loadAddresses();
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id || !token) return;
    try {
      setLoading(true);
      await setDefaultAddress(user.id, addressId, token);
      // Update the default address ID
      setDefaultAddressId(addressId);
      // Reload addresses to get updated default status
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId
    );
    if (selectedAddress && user?.id && token) {
      try {
        setLoading(true);
        // Set as default in backend if not already default
        if (selectedAddress.id !== defaultAddressId) {
          await setDefaultAddress(user.id, selectedAddress.id, token);
          setDefaultAddressId(selectedAddress.id);
        }
        // Ensure zipCode is set from postalCode if missing
        const zipCode = selectedAddress.zipCode || selectedAddress.postalCode || '';
        setAddress({ ...selectedAddress, zipCode });
        router.replace("/(root)/(checkout)/CheckoutScreen");
      } catch (error) {
        console.error('Error setting default address:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return;
    try {
      await deleteAddress(addressId, token);
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      // If we deleted the default address, clear the default address ID
      if (addressId === defaultAddressId) {
        setDefaultAddressId(null);
      }
      if (updatedAddresses.length === 0) {
        clearAddress();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAddresses();
    }, [user, token])
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
    <ScrollView
      className="flex-1 bg-neutral-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-white border-b border-neutral-200 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className=" font-Manrope text-Heading3 text-gray-900">Select Address</Text>
        </View>
      </View>

      {/* Address List */}
      <View className="p-4">
        {addresses.length > 0 ? (
          <View>
            {addresses.map((address) => (
              <SavedAddressCard
                key={address.id}
                address={{
                  ...address,
                  country: '', // Always provide a string for compatibility
                  countryCode: address.countryCode ?? "",
                  zipCode: address.zipCode ?? "",
                  isDefault: address.id === defaultAddressId,
                }}
                onEdit={() => handleEditAddress(address.id)}
                onDelete={() => handleDeleteAddress(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
                isSelected={selectedAddressId === address.id}
                onPress={() => setSelectedAddressId(address.id)}
              />
            ))}
            {/* Confirm Button */}
            <TouchableOpacity
              className={`rounded-lg p-4 mt-4 items-center mx-auto w-[92%] border border-primary
    ${selectedAddressId ? "bg-primary" : "bg-transparent"}`}
              disabled={!selectedAddressId || loading}
              onPress={handleConfirm}
            >
              <Text
                className={`text-BodyBold font-Manrope ${
                  selectedAddressId ? "text-neutral-10" : "text-primary"
                }`}
              >
                {loading ? "Setting Default..." : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="py-8">
            <Text className="text-BodyRegular font-Manrope text-neutral-60 text-center">
              No saved addresses found.
            </Text>
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
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default AddressSelectionScreen;
