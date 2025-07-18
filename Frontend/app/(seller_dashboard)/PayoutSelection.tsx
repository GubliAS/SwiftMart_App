// PayoutSelection.tsx
// This screen lets the seller view, select, add, delete, and set default payout methods.
// Uses context for payout methods and default payout method id.

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Import Expo Router's useRouter and useLocalSearchParams hooks
import VisaSvg from "@/assets/svgs/visa.svg";
import MasterCardSvg from "@/assets/svgs/mastercard.svg";
import MobileMoneySvg from "@/assets/svgs/mobile-money.svg";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import IconButton from "@/components/IconButton";
import PlusCircle from "@/assets/svgs/plus-circle.svg"; // Importing the Plus Circle SVG
import SecondaryButton from "@/components/SecondaryButton";
import { parsePhoneNumberFromString } from "libphonenumber-js"; // Import the library
import PayoutMethodCard from "@/components/PayoutMethodCard"; // Import the reusable component
import { usePayout } from "@/context/PayoutContext";
// Removed import of iconMap because it does not exist or is not found

const PayoutSelection = () => {
  const router = useRouter(); // Use Expo Router's navigation system
  const { payoutMethods, setPayoutMethods, defaultPayoutMethodId, setDefaultPayoutMethodId } = usePayout();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const iconMap: { [key: string]: any } = {
    MobileMoney: MobileMoneySvg,
    Visa: VisaSvg,
    MasterCard: MasterCardSvg,
  };

  // Remove useEffect for payoutMethodsParam and newPayoutMethod

  // --- State from context: payoutMethods, setPayoutMethods, defaultPayoutMethodId, setDefaultPayoutMethodId ---
  // --- selectedMethod: local state for which method is currently selected ---
  // --- iconMap: maps string names to SVG icons ---

  const handleSelect = (methodId: string) => {
    setSelectedMethod(methodId); // Set the selected payout method
  };

  const handleDelete = (methodId: string) => {
    // Remove the payout method from the list
    setPayoutMethods((prevMethods: any[]) =>
      prevMethods.filter((method) => method.id !== methodId)
    );
    // If the deleted method was selected, clear the selection
    if (selectedMethod === methodId) {
      setSelectedMethod(null);
    }
  };

  const handleConfirm = () => {
    // Find the selected payout method
    const selectedPayoutMethod = payoutMethods.find(
      (method: any) => method.id === selectedMethod
    );

    // Ensure the selected payout method exists
    if (!selectedPayoutMethod) {
      console.error("No payout method selected!");
      return;
    }

    // Normalize the icon name to match the keys in iconMap
    const normalizedIconName = selectedPayoutMethod.name.replace(/\s+/g, "");

    // Navigate back to Seller Settings and pass the selected payout method
    router.push({
      pathname: "/(seller_dashboard)/SellerSettings",
      params: {
        updatedPayoutMethod: JSON.stringify({
          ...selectedPayoutMethod,
          icon: normalizedIconName, // Pass the normalized icon name
        }),
      },
    });
  };

  const handleAddPayoutMethod = () => {
    // Navigate to the Add Payout Method screen
    router.push("/AddPayoutOption");
  };

  const handleAddCard = () => {
    router.push("/CardDetails");
  };

  const handleSetDefault = (methodId: string) => {
    setDefaultPayoutMethodId(methodId);
  };

  const formatMobileNumber = (number: string): string => {
    const phoneNumber = parsePhoneNumberFromString(number);
    return phoneNumber ? phoneNumber.formatInternational() : number; // Format the number or return as-is if invalid
  };

  // --- handleSelect: Selects a payout method for confirmation ---
  // --- handleDelete: Removes a payout method from the list ---
  // --- handleConfirm: Navigates back to SellerSettings with the selected payout method ---
  // --- handleAddPayoutMethod: Navigates to AddPayoutOption screen ---
  // --- handleAddCard: Navigates to CardDetails screen ---
  // --- handleSetDefault: Sets a payout method as default ---
  // --- formatMobileNumber: Formats mobile numbers for display ---

  return (
    <View className="flex-1 gap-6 bg-white p-4">
      <View>
        <TouchableOpacity
          className="w-6"
          onPress={() => router.replace('/(seller_dashboard)/SellerSettings')}
        >
          <Entypo name="chevron-left" size={24} color="#404040" />
        </TouchableOpacity>
        <Text className="font-Manrope text-center text-Heading3 text-text">
          Payout Method
        </Text>
      </View>
      <View className="gap-4 overflow-visible">
        {payoutMethods.length > 0 ? (
          <FlatList
            data={payoutMethods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PayoutMethodCard
                item={{ ...item, icon: iconMap[item.icon] || item.icon }}
                selectedMethod={selectedMethod}
                handleSelect={handleSelect}
                handleDelete={handleDelete}
                formatMobileNumber={formatMobileNumber}
                isDefault={item.id === defaultPayoutMethodId}
                onSetDefault={handleSetDefault}
              />
            )}
            style={{
              overflow: "visible", // Ensure overflow is visible
            }}
          />
        ) : (
          <Text className="text-center my-8 text-neutral-500 text-lg">
            No saved payout methods.
          </Text>
        )}

        <IconButton
          BtnText="Add Payout Option"
          IconComponent={PlusCircle}
          borderColor="border-secondary"
          textColor="text-secondary"
          onPress={handleAddPayoutMethod}
        />

        {payoutMethods.length > 0 && (
          <SecondaryButton
            BtnText="Confirm Payout Method"
            disabled={!selectedMethod}
            onPress={handleConfirm}
          />
        )}
      </View>
    </View>
  );
};

export default PayoutSelection;
