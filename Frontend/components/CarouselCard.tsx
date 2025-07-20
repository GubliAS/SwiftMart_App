import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, View, Text, TouchableOpacity } from "react-native";

interface CarouselCardProps {
  title: string;
  description: string;
  image: any; // Replace 'any' with a specific type if possible
  gradientColors: readonly [string, string, ...string[]];
  buttonText: string;
  onPress: () => void;
}

const CarouselCard = ({ title, description, image, gradientColors, buttonText, onPress }: CarouselCardProps) => {
  return (
    <View className="rounded-[14px] overflow-hidden w-[335px] h-[174px] relative">
      <ImageBackground
        source={image}
        className="w-full h-full"
        resizeMode="cover"
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="absolute inset-0"
        >
          <View className="p-4 h-full w-full">
            <View className="w-[178px] flex gap-3">
            <Text className="text-white text-Heading4 ">{title}</Text>
            <Text className="text-white text-Caption ">{description}</Text>
            <TouchableOpacity
              className="bg-white rounded-full py-3 px-6 self-start"
              activeOpacity={0.8}
              onPress={onPress}
            >
              <Text className="text-primary font-bold">{buttonText}</Text>
            </TouchableOpacity>

            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};
export default CarouselCard;