import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  BtnText: string; // Button text
  bgColor?: string; // Background color
  textColor?: string; // Text color
  borderColor?: string; // Border color
  hasBorder?: boolean; // Toggle border visibility
  disabled?: boolean; // Disabled state
  onPress?: () => void; // Function to handle button press
};

const Button = ({
  BtnText,
  bgColor = "bg-primary",
  textColor = "text-neutral-10",
  borderColor = "border-primary",
  hasBorder = false,
  disabled = false,
  onPress,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined} // Disable onPress if the button is disabled
      className={`items-center mb-2 justify-center w-full rounded-lg px-[18px] py-3 ${
        disabled ? "bg-white" : bgColor
      } ${hasBorder ? borderColor : ""} ${hasBorder ? "border" : ""}`}
      disabled={disabled} // Disable touch events
    >
      <Text
        className={`text-BodyBold ${
          disabled ? bgColor.replace("bg-", "text-") : textColor
        }`}
      >
        {BtnText}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
