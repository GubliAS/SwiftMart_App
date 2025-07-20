import OnBoardingTextBox from '@/components/OnboardingTextBox';
import PageIndicator from '@/components/PageIndicator';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
type ScreenData = {
  title: string;
  description: string;
  image: any;
};

const screens: ScreenData[] = [
  {
    title: 'Choose Products',
    description: 'Browse thousands of items and discover what you love in seconds.',
    image: require('@/assets/images/onboarding1.png'),
  },
  {
    title: 'Make Payment',
    description: 'Pay securely with flexible options at checkout.',
    image: require('@/assets/images/onboarding2.png'),
  },
  {
    title: 'Get Your Order',
    description: 'Track your delivery and receive your items right at your doorstep.',
    image: require('@/assets/images/onboarding3.png'),
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState<number>(0);

  const nextScreen = () => {
    if (index < screens.length - 1) {
      setIndex(index + 1);
    } else {
      router.replace('/GetStarted'); // Navigate to GetStarted screen
    }
  };

  const previousScreen = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const { title, description, image } = screens[index];

  return (
    <View className="flex-1 items-center gap-8 bg-white font-Manrope">
      {/* Image */}
      <View className="h-[55%] w-[170%] items-center overflow-hidden rounded-b-[340px]">
        <Image source={image} className="h-[100%] w-[60%]" />
      </View>
      {/* Main Content */}
      <View className="w-full items-center gap-8 px-4">
        {/* TextBox */}
        <OnBoardingTextBox title={title} description={description} />
        {/* Page Indicator */}
        <PageIndicator index={index} screens={screens} />
        {/* Buttons */}
        <View className="flex w-full flex-row items-center ">
          {/* Back Btn */}
          {index > 0 ? (
            <TouchableOpacity
              onPress={previousScreen}
              className="w-[20%] px-[18px] py-3 mr-4  rounded-lg"
            >
              <Text className="text-BodyBold text-primary text-center font-Manrope">Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {/* Next Btn */}
          <TouchableOpacity
            onPress={nextScreen}
            className="flex-1 items-center rounded-lg bg-primary px-[18px] py-3"
          >
            <Text className="text-BodyBold text-neutral-10 font-Manrope">
              {index === screens.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
