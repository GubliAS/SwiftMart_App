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
import SavedAddressCard from "../(tabs)/(checkout)/components/SavedAddressCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const SavedAddressScreen: React.FC = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAddresses = async () => {
    const stored = await AsyncStorage.getItem("addresses");
    setAddresses(stored ? JSON.parse(stored) : []);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  const handleAddAddress = async () => {
    await router.replace({
      pathname: "../(tabs)/(checkout)/components/AddAddress",
      params: {
        returnTo: "/(root)/(profile)/SavedAddressScreen"
      }
    });
    // Refresh addresses after returning from add address screen
    loadAddresses();
  };

  const handleEditAddress = async (addressId: string) => {
    await router.replace({
      pathname: "../(tabs)/(checkout)/components/AddAddress",
      params: {
        addressId,
        editMode: "true",
        returnTo: "/(root)/(profile)/SavedAddressScreen"
      },
    });
    // Refresh addresses after returning from edit address screen
    loadAddresses();
  };

  const handleDeleteAddress = async (addressId: string) => {
    const existing = await AsyncStorage.getItem("addresses");
    const addresses = existing ? JSON.parse(existing) : [];
    const updatedAddresses = addresses.filter(
      (addr: any) => addr.id !== addressId
    );
    await AsyncStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
  };

  useEffect(() => {
    // Load addresses when component mounts
    loadAddresses();
  }, []);

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
                  countryCode: address.code,
                  zipCode: address.code,
                  isDefault: address.isDefault || false,
                }}
                onEdit={() => handleEditAddress(address.id)}
                onDelete={() => handleDeleteAddress(address.id)}
                onPress={() => handleEditAddress(address.id)}
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
    </View>
  );
};

export default SavedAddressScreen; 