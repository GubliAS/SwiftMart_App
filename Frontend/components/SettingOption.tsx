import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type SettingOptionProps = {
  label: string; // Label for the setting
  value: string; // Value of the field
  onEditPress?: () => void; // Function to handle edit button press
  showEditButton?: boolean; // Controls visibility of the Edit button
};

const SettingOption = ({
  label,
  value,
  onEditPress,
  showEditButton = true,
}: SettingOptionProps) => {
  return (
    <View className="flex flex-row items-center gap-4 px-4 py-2 rounded-xl border border-neutral-40">
      <View className="flex-1 gap-2">
        <Text className="text-Caption text-text font-Manrope">
          {label}
        </Text>
        <Text
          className="text-BodyRegular text-text font-Manrope"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
      {showEditButton && (
        <TouchableOpacity onPress={onEditPress}>
          <Text className="font-Manrope text-secondary text-BodySmallRegular">
            Edit
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SettingOption;
