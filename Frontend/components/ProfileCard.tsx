import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { Entypo } from "@expo/vector-icons";

interface ProfileCardProps {
  text: string;
  IconComponent: React.ComponentType<IconProps>; // Correctly type the IconComponent
  iconName: string;
  iconColor?: string;
  onPress?: () => void; // Add onPress as an optional property
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  text,
  IconComponent,
  iconName,
  iconColor = "#404040",
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className="flex-row rounded-[14px] justify-between p-4 gap-4 items-center"
        style={{ boxShadow: "0px 2px 24px 0px rgba(0, 0, 0, 0.10)" }}
      >
        <View className="flex-row gap-4 items-center">
          <IconComponent name={iconName} size={24} color={iconColor} />
          <Text className="text-BodyRegular">{text}</Text>
        </View>
        <View>
          <Entypo name="chevron-right" size={24} color="#404040" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;
