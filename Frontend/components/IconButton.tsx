import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

type IconButtonProps = {
  BtnText: string; // Text for the button
  IconComponent: React.FC<SvgProps>; // SVG component
  bgColor?: string; // Optional background color
  borderColor?: string; // Optional border color
  textColor?: string; // Optional text color
  fillColor?: string; // Optional fill color for the SVG
  onPress?: () => void; // Function to handle button press
};

const IconButton = ({
  BtnText,
  IconComponent,
  bgColor = "",
  borderColor = "border-primary",
  textColor = "text-neutral-10",
  fillColor = "#156651", // Default fill color
  onPress,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex flex-row border items-center justify-center gap-[14px] rounded-lg px-[18px] py-3 ${bgColor} ${borderColor}`}
    >
      {/* SVG Icon */}
      <IconComponent width={24} height={24} fill={fillColor} />
      {/* Text */}
      <Text className={`text-BodyBold ${textColor} font-Manrope`}>{BtnText}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;
