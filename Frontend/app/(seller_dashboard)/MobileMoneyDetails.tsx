// MobileMoneyDetails.tsx
// This screen allows the seller to add a Mobile Money payout method.
// The seller selects a provider, enters a phone number, and saves the method to context.
// If it's the first payout method, it is set as default.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import MTNSvg from "@/assets/svgs/mtn.svg";
import AirtelSvg from "@/assets/svgs/airtel.svg";
import TelecelSvg from "@/assets/svgs/telecel.svg";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import SecondaryButton from "@/components/SecondaryButton";
import MobileMoneySvg from "@/assets/svgs/mobile-money.svg"; // Import the Mobile Money icon
import { usePayout } from "@/context/PayoutContext";
import { formatPhoneNumber, validatePhoneNumber } from "@/constants/formatUtils";

const MobileMoneyDetails = () => {
  const router = useRouter();
  const { payoutMethods, setPayoutMethods, defaultPayoutMethodId, setDefaultPayoutMethodId } = usePayout();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null); // Track selected provider
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState(""); // Mobile money number input
  const [isNumberValid, setIsNumberValid] = useState(false); // Track if the number is valid
  const [errorMessage, setErrorMessage] = useState(""); // Track error message

  const providers = [
    { id: "1", name: "MTN", icon: MTNSvg },
    { id: "2", name: "Airtel", icon: AirtelSvg },
    { id: "3", name: "Telecel", icon: TelecelSvg },
  ];

  const handleSave = () => {
    const newMobileMoneyDetails = {
      id: Date.now().toString(), // Generate a unique ID
      name: "Mobile Money", // Always set the name to "Mobile Money"
      icon: "MobileMoney", // Pass the string identifier for the icon
      number: mobileMoneyNumber,
      provider: providers.find((provider) => provider.id === selectedProvider)
        ?.name, // Store the provider name separately
    };

    setPayoutMethods((prev: any[]) => {
      const updated = [...prev, newMobileMoneyDetails];
      if (updated.length === 1) setDefaultPayoutMethodId(newMobileMoneyDetails.id);
      return updated;
    });
    router.push("/(seller_dashboard)/PayoutSelection");
  };

  const handleNumberChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setMobileMoneyNumber(formattedNumber);
    setIsNumberValid(validatePhoneNumber(formattedNumber));
    setErrorMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-neutral-10"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 gap-8 p-4">
          {/* Header */}
          <View>
            <TouchableOpacity
              className="w-6"
              onPress={() => router.replace('/(seller_dashboard)/PayoutSelection')}
            >
              <Entypo name="chevron-left" size={24} color="#404040" />
            </TouchableOpacity>
            <Text className="text-text font-Manrope text-Heading3 text-center">
              Mobile Money Options{" "}
            </Text>
          </View>

          {/* Providers */}
          <View className="gap-4 mt-6">
            <Text className="font-Manrope text-text text-BodySmallRegular">
              Network Type
            </Text>
            <View className="justify-between gap-4 flex-row flex-wrap">
              {providers.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  onPress={() => setSelectedProvider(provider.id)}
                  className={`flex-row h-[75px] items-center gap-4 p-4 rounded-lg border ${
                    selectedProvider === provider.id
                      ? "border-secondary bg-secondary/10"
                      : "border-neutral-300 bg-white"
                  }`}
                  style={{ width: "48%" }}
                >
                  <provider.icon width={50} height={4500} />
                  <Text className="text-text font-Manrope text-BodyRegular">
                    {provider.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mobile Money Number Input */}
          <View className="gap-4 mt-6">
            <Text className="font-Manrope text-text text-BodySmallRegular">
              Phone Number
            </Text>

            <View className="h-[75px] gap-8 border border-secondary rounded-2xl px-4 py-2 flex-row items-center">
              <MaterialCommunityIcons
                name="text-short"
                size={24}
                color="#EBB65B"
              />

              <TextInput
                value={mobileMoneyNumber}
                onChangeText={handleNumberChange}
                placeholder="Enter Mobile Money Number"
                keyboardType="phone-pad"
                selectionColor={"#404040"}
                className="text-BodyRegular text-text font-Manrope"
              />
            </View>
            {errorMessage && (
              <Text className="text-red-500 text-BodySmallRegular font-Manrope">
                {errorMessage}
              </Text>
            )}
          </View>

          {/* Save Button */}
          <SecondaryButton
            BtnText="Save"
            onPress={handleSave}
            disabled={!selectedProvider || !isNumberValid} // Disable button if provider or number is not selected
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default MobileMoneyDetails;
