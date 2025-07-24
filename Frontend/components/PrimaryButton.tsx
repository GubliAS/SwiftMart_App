import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

type PrimaryButtonProps = {
  BtnText: string; // Button text
  disabled?: boolean; // Disabled state
  loading?: boolean; // Loading state
  onPress?: () => void; // Function to handle button press
  color?: "primary" | "secondary"; // Button color
};

const PrimaryButton = ({
  BtnText,
  disabled = false,
  loading = false,
  onPress,
  color = "primary",
}: PrimaryButtonProps) => {
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      onPress={!isDisabled ? onPress : undefined} // Disable onPress if the button is disabled or loading
      className={`items-center justify-center w-full rounded-lg px-[18px] py-3 ${
        isDisabled ? "bg-neutral-10" : "bg-primary"
      }`}
      disabled={isDisabled} // Disable touch events
    >
      {loading ? (
        <ActivityIndicator size="small" color="#156651" />
      ) : (
      <Text
        className={`text-BodyBold ${
            isDisabled ? "text-primary" : "text-white"
        } font-Manrope`}
      >
        {BtnText}
      </Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
