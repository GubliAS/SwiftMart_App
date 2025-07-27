import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import PrimaryButton from "@/components/PrimaryButton";
import ProfileCard from "@/components/ProfileCard";
import { router } from "expo-router";
import { useUser } from '@/context/UserContext';
import { navigateToTransactionPage } from '@/utils/orders/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import SecondaryButton from "@/components/SecondaryButton";
import { useFocusEffect } from '@react-navigation/native';

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
  const { user, setUser } = useUser();
  const { logout, role, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        if (!token) {
          setLoading(false);
          return;
        }
        
        setLoading(true);
        setError('');
        try {
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser((prev) => ({
              ...prev,
              ...data,
              id: data.id || prev.id, // Store numeric user ID if available
              phoneNumber: data.phoneNumber || data.phone_number || prev.phoneNumber,
            }));
          } else {
            setError('Failed to load profile');
          }
        } catch (e) {
          setError('Network error');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [token, setUser])
  );

  const handleLogout = async () => {
    await logout();
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: '',
      verificationStatus: '',
      storeName: '',
      idCardType: '',
      idCardCountry: '',
      idCardNumber: '',
      photo: null,
    });
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const isSeller = role === "SELLER";

  // If not logged in, show placeholder content
  if (!token) {
    return (
      <View className="flex-1 bg-neutral-10">
        <ImageBackground
          source={require("@/assets/images/ProfileBG.png")}
          className="w-full z-10 flex-row justify-between items-center py-[56px] px-4 h-[192px]"
          resizeMode="cover"
        >
          <Image
            source={require("@/assets/images/LogoWhite.png")}
            className="w-[44px] h-[44px]"
            resizeMode="contain"
          />
          <Text className="text-Heading3 text-neutral-10">My Account</Text>
          <View style={{ width: 24 }} /> {/* Placeholder for spacing */}
        </ImageBackground>

        <View className="flex-1 gap-6 bg-white px-4 overflow-visible">
          <View
            style={{ boxShadow: "0px 2px 24px 0px rgba(0, 0, 0, 0.10)" }}
            className="bg-neutral-10 z-10 -mt-[50px] rounded-[14px] items-center p-8"
          >
            <Text className="text-Heading4 text-text mb-4">Welcome to SwiftMart</Text>
            <Text className="text-BodyRegular text-neutral-70 text-center mb-6">
              Log in to access your profile, track orders, and manage your shopping preferences.
            </Text>
            <Button 
              BtnText="Login" 
              bgColor="bg-primary" 
              onPress={() => router.push('/(auth)/Login')} 
            />
          </View>

          <View className="flex-1 overflow-visible">
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1 z-0 overflow-visible"
              contentContainerClassName="gap-4"
            >
              <View className="gap-4">
                <Text className="text-BodyBold text-text">General</Text>
                <ProfileCard
                  text="Wishlist"
                  IconComponent={Feather}
                  iconName="heart"
                  onPress={() => router.push('/(auth)/Login')}
                />
                <ProfileCard
                  text="Contact Us"
                  IconComponent={Feather}
                  iconName="user"
                  onPress={() => router.push("/(root)/(profile)/ContactUsScreen")}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-10">
        <ActivityIndicator size="large" color="#156651" />
        <Text className="text-Heading3 text-text mt-4">Loading profile...</Text>
        {error ? <Text className="text-alert mt-2">{error}</Text> : null}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-10 pb-12">
      <ImageBackground
        source={role === "SELLER" ? require("@/assets/images/ProfileBGseller.png") : require("@/assets/images/ProfileBG.png")}
        className="w-full z-10 flex-row justify-between items-center py-[56px] px-4 h-[192px]"
        resizeMode="cover"
      >
        <Image
          source={require("@/assets/images/LogoWhite.png")}
          className="w-[44px] h-[44px]"
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
          className="bg-neutral-10 z-10 flex-row -mt-[50px] justify-between rounded-[14px] items-center p-4"
        >
          <View className="flex-row gap-4 items-center">
            <View className="rounded-full w-[64px] h-[64px] overflow-hidden">
              <ImageBackground
                className="w-full h-full"
                source={user.photo ? user.photo : require("@/assets/images/userPic.jpeg")}
              />
            </View>
            <View>
              <Text className="text-Heading4 text-text">
                {(user.firstName || user.lastName) ? `${user.firstName} ${user.lastName}`.trim() : 'Name'}
              </Text>
              <Text className="text-BodySmallRegular text-neutral-70">
                {user.email || 'Email'}
              </Text>
              <Text className="text-BodySmallRegular text-neutral-70">
                {user.phoneNumber || 'Phone Number'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(root)/(profile)/EditProfile')}>
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
              {isSeller ? (
                <SecondaryButton BtnText="Seller Dashboard" onPress={() => router.push("/(seller_dashboard)/Promotions")} />
              ) : (
                <PrimaryButton BtnText="Become A Seller" onPress={() => router.push("/(seller_dashboard)/SellerGetStarted")} />
              )}
            </View>
            <View className="gap-4">
              <Text className="text-BodyBold text-text">General</Text>
              <ProfileCard
                text="Transaction"
                IconComponent={MaterialIcons}
                iconName="receipt"
                onPress={navigateToTransactionPage}
              />
              <ProfileCard
                text="Wishlist"
                IconComponent={Feather}
                iconName="heart"
                onPress={() => router.push("/(root)/(profile)/Wishlist")}
              />
              <ProfileCard
                text="Saved Address"
                IconComponent={Feather}
                iconName="bookmark"
                onPress={() => router.push("/(root)/(profile)/SavedAddressScreen")}
              />
              <ProfileCard
                text="Payment Methods"
                IconComponent={Feather}
                iconName="credit-card"
                onPress={() => router.push("/(root)/(profile)/payment/PaymentMethodListScreen")}
              />
              <ProfileCard
                text="Notification"
                IconComponent={Feather}
                iconName="bell"
                onPress={() => router.push("/(root)/(profile)/Notifications")}
              />
              <ProfileCard
                text="Security"
                IconComponent={Feather}
                iconName="lock"
                onPress={() => router.push("/(root)/(profile)/SecurityScreen")}
              />
            </View>
            <View className="gap-4">
              <Text className="text-BodyBold text-text">Support</Text>
              <ProfileCard
                text="Get in Touch With Us"
                IconComponent={Feather}
                iconName="user"
                onPress={() => router.push("/(root)/(profile)/ContactUsScreen")}
              />
            </View>
            <Text className="text-center text-neutral-60 text-Caption mt-4">
              App version: 1.0
            </Text>
      {token && (
        <View className="px-4 mt-4">
          <Button BtnText="Log Out" bgColor="bg-alert" onPress={handleLogout} />
        </View>
      )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Profile;
