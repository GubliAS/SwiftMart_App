// AddPayoutOption.tsx
// This screen lets the seller choose which type of payout method to add (Card or Mobile Money).
// After selection, navigates to the appropriate details screen.

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import PayoutMethodCard from "@/components/PayoutMethodCard"; // Import the reusable component
import VisaMastercardSvg from "@/assets/svgs/visa-mastercard.svg";
import MobileMoneySvg from "@/assets/svgs/mobile-money.svg";
import { Entypo } from "@expo/vector-icons";
import SecondaryButton from "@/components/SecondaryButton";

const AddPayoutOption = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track selected payout option
  const [payoutOptions, setPayoutOptions] = useState([
    { id: "1", name: "VISA/MASTERCARD", icon: VisaMastercardSvg, number: "" },
    { id: "2", name: "Mobile Money", icon: MobileMoneySvg, number: "" },
  ]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId); // Set the selected payout option
  };

  const handleContinue = () => {
    if (!selectedOption) {
      alert("Please select a payout option.");
      return;
    }

    if (selectedOption === "2") {
      // Navigate to Mobile Money Details screen
      router.push("/(seller_dashboard)/MobileMoneyDetails");
    } else {
      // Navigate to Card Details screen
      router.push("/(seller_dashboard)/CardDetails");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-neutral-10"
    >
      <ScrollView
        contentContainerClassName="gap-6 px-4 py-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View>
          <TouchableOpacity
            className="w-6"
            onPress={() => router.replace('/(seller_dashboard)/PayoutSelection')}
          >
            <Entypo name="chevron-left" size={24} color="#404040" />
          </TouchableOpacity>
          <Text className="text-text font-Manrope text-Heading3 text-center">
            Add Payout Option
          </Text>
        </View>

        {/* Payout Options */}
        <View className="gap-4">
          {payoutOptions.map((option) => (
            <PayoutMethodCard
              key={option.id}
              showNumber={false} // Hide the card or phone number
              showDeleteButton={false} // Show delete button
              item={option}
              selectedMethod={selectedOption}
              handleSelect={handleSelectOption}
              handleDelete={(methodId) => {
                setPayoutOptions((prevOptions) =>
                  prevOptions.filter((opt) => opt.id !== methodId)
                );
                if (selectedOption === methodId) {
                  setSelectedOption(null); // Clear selection if deleted
                }
              }}
              formatMobileNumber={() => ""} // Pass an empty string for formatting
            />
          ))}
        </View>

        {/* Continue Button */}
        <View className="mt-6">
          <SecondaryButton
            BtnText="Continue"
            disabled={!selectedOption}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddPayoutOption;
