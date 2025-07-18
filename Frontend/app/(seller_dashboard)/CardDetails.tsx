// CardDetails.tsx
// This screen allows the seller to add a card payout method (Visa/MasterCard).
// The seller enters card details, which are formatted and validated, and saves the method to context.
// If it's the first payout method, it is set as default.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import VisaSvg from "@/assets/svgs/visa.svg";
import MasterCardSvg from "@/assets/svgs/mastercard.svg";
import SecondaryButton from "@/components/SecondaryButton";
import { usePayout } from "@/context/PayoutContext";

const CardDetails = () => {
  const router = useRouter();
  const { payoutMethods, setPayoutMethods, defaultPayoutMethodId, setDefaultPayoutMethodId } = usePayout();
  const [cardNumber, setCardNumber] = useState(""); // Card number input
  const [expiry, setExpiry] = useState(""); // Expiry date input
  const [ccv, setCcv] = useState(""); // CCV input
  const [cardType, setCardType] = useState("Visa"); // Default card type

  // Format expiry date as MM/YY
  const handleExpiryChange = (text: string) => {
    const formattedText = text
      .replace(/\D/g, "") // Remove non-numeric characters
      .slice(0, 4) // Limit to 4 characters
      .replace(/(\d{2})(\d{1,2})/, "$1/$2"); // Add "/" after the first 2 digits
    setExpiry(formattedText);
  };

  // Format card number as '1234 5678 9012 3456' as user types
  const handleCardNumberChange = (text: string) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, "");
    // Insert a space every 4 digits
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleSave = () => {
    if (!cardNumber || !expiry || !ccv) {
      alert("Please fill in all fields.");
      return;
    }

    const newCardDetails = {
      id: Date.now().toString(), // Generate a unique ID
      name: cardType, // Use the selected card type as the name
      icon: cardType, // Use the card type as the icon identifier
      number: cardNumber.replace(/\s/g, "").slice(-4), // Only store the last 4 digits
    };

    setPayoutMethods((prev: any[]) => {
      const updated = [...prev, newCardDetails];
      if (updated.length === 1) setDefaultPayoutMethodId(newCardDetails.id);
      return updated;
    });
    router.push("/(seller_dashboard)/PayoutSelection");
  };

  // Check if all fields are valid to enable the Save button
  const isSaveDisabled =
    !cardNumber ||
    cardNumber.replace(/\s/g, "").length < 16 ||
    !expiry ||
    expiry.length < 5 ||
    !ccv ||
    ccv.length < 3;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-neutral-10"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled" // Ensure taps dismiss the keyboard
        >
          <View>
            <TouchableOpacity
              className="w-6"
              onPress={() => router.replace('/(seller_dashboard)/PayoutSelection')}
            >
              <Entypo name="chevron-left" size={24} color="#404040" />
            </TouchableOpacity>
            <Text className="text-text font-Manrope text-Heading3 text-center">
              Add New Card
            </Text>
          </View>

          {/* Card Type Selection */}
          <View className="gap-4 mt-6">
            <Text className="font-Manrope text-text text-BodySmallRegular">
              Card Type
            </Text>
            <View className="justify-between gap-4 flex-row">
              <TouchableOpacity
                onPress={() => setCardType("Visa")}
                style={{
                  boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className={`flex-1 h-[75px] items-center gap-4 p-4 rounded-[18px] ${
                  cardType === "Visa"
                    ? "border-secondary border bg-secondary/10"
                    : ""
                } `}
              >
                <VisaSvg width={"100%"} height={"100%"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCardType("MasterCard")}
                style={{
                  boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className={`flex-1 h-[75px] items-center gap-4 p-4 rounded-[18px] ${
                  cardType === "MasterCard"
                    ? "border-secondary border bg-secondary/10"
                    : ""
                } `}
              >
                <MasterCardSvg width={"100%"} height={"100%"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card Number Input */}
          <View className="gap-4 mt-6">
            <Text className="font-Manrope text-text text-BodySmallRegular">
              Card Number
            </Text>
            <View className="h-[75px] gap-8 border border-secondary rounded-2xl px-4 py-2 flex-row items-center">
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={24}
                color="#EBB65B"
              />
              <TextInput
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder="Enter Card Number"
                keyboardType="number-pad"
                maxLength={19} // 16 digits + 3 spaces
                selectionColor={"#404040"}
                className="text-BodyRegular flex-1 text-text font-Manrope"
              />
            </View>
          </View>

          {/* Expiry */}
          <View className="gap-4 mt-6">
            <Text className="font-Manrope text-text text-BodySmallRegular">
              Expiry
            </Text>
            <View className="h-[75px] gap-8 border border-secondary rounded-2xl px-4 py-2 flex-row items-center">
              <MaterialCommunityIcons
                name="calendar-today"
                size={24}
                color="#EBB65B"
              />
              <TextInput
                value={expiry}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                selectionColor={"#404040"}
                className="text-BodyRegular flex-1 text-text font-Manrope"
              />
            </View>
          </View>

          {/* CCV */}
          <View className="gap-4 mt-6">
            <Text className="font-Manrope text-text text-BodySmallRegular">
              CCV
            </Text>
            <View className="h-[75px] gap-8 border border-secondary rounded-2xl px-4 py-2 flex-row items-center">
              <Octicons name="shield-lock" size={24} color="#EBB65B" />
              <TextInput
                value={ccv}
                onChangeText={setCcv}
                placeholder="Enter CCV"
                keyboardType="number-pad"
                maxLength={3}
                selectionColor={"#404040"}
                className="text-BodyRegular flex-1 text-text font-Manrope"
              />
            </View>
          </View>

          {/* Save Button */}
          <View className="mt-8">
            <SecondaryButton
              BtnText="Save"
              onPress={handleSave}
              disabled={isSaveDisabled} // Disable button if fields are invalid
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CardDetails;
