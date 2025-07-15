import React from "react";
import { Text, TouchableOpacity } from "react-native";

type PrimaryButtonProps = {
  BtnText: string; // Button text
  disabled?: boolean; // Disabled state
  onPress?: () => void; // Function to handle button press
};

const PrimaryButton = ({
  BtnText,
  disabled = false,
  onPress,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined} // Disable onPress if the button is disabled
      className={`items-center justify-center w-full rounded-lg px-[18px] py-3 ${
        disabled ? "bg-neutral-10" : "bg-primary"
      }`}
      disabled={disabled} // Disable touch events
    >
      <Text
        className={`text-BodyBold ${
          disabled ? "text-primary" : "text-white"
        } font-Manrope`}
      >
        {BtnText}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
