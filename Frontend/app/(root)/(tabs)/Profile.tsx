import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileCard from "@/components/ProfileCard";
import { router } from "expo-router";

// Mock notification data for badge count (matching the notifications screen)
const mockNotifications = [
  { id: 1, read: false }, // Order Shipped
  { id: 2, read: false }, // Flash Sale Alert
  { id: 3, read: true },  // Package Delivered
  { id: 4, read: true },  // New Features
  { id: 5, read: true },  // Order Confirmed
  { id: 6, read: true },  // Birthday Special
  { id: 7, read: true },  // Delivery Update
];

const Profile = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  
  return (
    <View className="flex-1 bg-neutral-10 pb-12 ">
      <ImageBackground
        source={require("@/assets/images/ProfileBG.png")}
        className="w-full z-10 flex-row justify-between items-center py-[56px] px-4 h-[192px]  "
        resizeMode="cover"
      >
        <Image
          source={require("@/assets/images/LogoWhite.png")}
          className=" w-[44px] h-[44px]"
          resizeMode="contain"
        />
        <Text className="text-Heading3 text-neutral-10">My Account</Text>
        <TouchableOpacity 
          onPress={() => router.push("/(root)/(profile)/Notifications")}
          className="relative"
        >
          <Feather name="bell" size={24} color="white" />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-alert rounded-full items-center justify-center">
              <Text className="text-[10px] text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ImageBackground>
      <View className="flex-1 gap-6 bg-white px-4 overflow-visible">
        <View
          style={{ boxShadow: "0px 2px 24px 0px rgba(0, 0, 0, 0.10)" }}
          className="bg-neutral-10 z-10 flex-row  -mt-[50px] justify-between   rounded-[14px] items-center p-4 "
        >
          <View className="flex-row  gap-4 items-center">
            <View className="rounded-full w-[64px] h-[64px] overflow-hidden">
              <ImageBackground
                className="w-full h-full  "
                source={require("@/assets/images/userPic.jpeg")}
              />
            </View>
            <View>
              <Text className="text-Heading4 text-text">Claire Cooper</Text>
              <Text className="text-BodySmallRegular text-neutral-70">
                claire.cooper@mail.com
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="edit" size={24} color="#404040" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 overflow-visible">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 z-0 overflow-visible"
            contentContainerClassName="gap-4"
          >
            <View className="">
              <PrimaryButton BtnText="Become A Seller" onPress={() => { router.push("/(seller_dashboard)/SellerGetStarted") }} />
            </View>
            <View className="gap-4">
              <Text className="text-BodyBold text-text">General</Text>
              {/* Transaction Card */}
              <ProfileCard
                text="Transaction"
                IconComponent={MaterialIcons}
                iconName="receipt"
                onPress={() => console.log("Transaction card pressed!")}
              />
              {/* Settings Card */}
              <ProfileCard
                text="Wishlist"
                IconComponent={Feather}
                iconName="heart"
                onPress={() => router.push("/(root)/(profile)/Wishlist")}
              />
              {/* Saved Address Card */}
              <ProfileCard
                text="Saved Address"
                IconComponent={Feather}
                iconName="bookmark"
                onPress={() => console.log("Saved Adress card pressed!")}
              />
              {/* Saved Address Card */}
              <ProfileCard
                text="Payment Methods"
                IconComponent={Feather}
                iconName="credit-card"
                onPress={() => console.log("Payment Methods card pressed!")}
              />
              {/* Notification Card */}
              <ProfileCard
                text="Notification"
                IconComponent={Feather}
                iconName="bell"
                onPress={() => router.push("/(root)/(profile)/Notifications")}
              />
              {/* Saved Address Card */}
              <ProfileCard
                text="Security"
                IconComponent={Feather}
                iconName="lock"
                onPress={() => console.log("Security card pressed!")}
              />
            </View>
            <View className="gap-4">
              <Text className="text-BodyBold text-text">General</Text>
              {/* Transaction Card */}
              <ProfileCard
                text="Get in Touch With Us"
                IconComponent={Feather}
                iconName="user"
                onPress={() =>
                  console.log("Get in Touch With Us card pressed!")
                }
              />
            </View>
            <Text className="text-center text-neutral-60 text-Caption mt-4">
              App version: 1.0
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Profile;
