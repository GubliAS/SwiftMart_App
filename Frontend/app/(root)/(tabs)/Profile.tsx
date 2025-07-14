import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileCard from "@/components/ProfileCard";

const Profile = () => {
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
        <Feather name="bell" size={24} color="white" />
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
              <PrimaryButton BtnText="Become A Seller" />
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
                onPress={() => console.log("Wishlist card pressed!")}
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
              {/* Saved Address Card */}
              <ProfileCard
                text="Notification"
                IconComponent={Feather}
                iconName="bell"
                onPress={() => console.log("Notification card pressed!")}
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
