// SellerSettings.tsx
// This screen allows the seller to manage store info, contact info, payout preferences, and notification settings.
// It uses context for payout and notification state, and supports editing via modals.

import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import SettingOption from "@/components/SettingOption";
import MasterCard from "@/assets/svgs/mastercard.svg";
import IconButton from "@/components/IconButton";
import Exit from "@/assets/svgs/exit.svg";
import { formatPhoneNumber } from "@/constants/formatUtils";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter, useLocalSearchParams } from "expo-router"; // Import useRouter and useLocalSearchParams for navigation and handling parameters
import VisaSvg from "@/assets/svgs/visa.svg";
import MasterCardSvg from "@/assets/svgs/mastercard.svg";
import MobileMoneySvg from "@/assets/svgs/mobile-money.svg";
import { iconMap } from "@/constants/iconMap";
import SecondaryButton from "@/components/SecondaryButton";
import { useNotification } from "@/context/NotificationContext";
import { usePayout } from "@/context/PayoutContext";

const SellerSettings = () => {
  const router = useRouter();
  const { updatedPayoutMethod } = useLocalSearchParams(); // Retrieve the updated payout method from parameters
  const {
    newOrderNotification, setNewOrderNotification,
    lowStockNotification, setLowStockNotification,
    swiftMartAnnouncements, setSwiftMartAnnouncements
  } = useNotification();
  const { payoutMethods, defaultPayoutMethodId } = usePayout();
  const defaultPayoutMethod = payoutMethods.find((m: any) => m.id === defaultPayoutMethodId);

  // --- State for payout methods and default payout method comes from context ---
  // payoutMethods: array of all saved payout methods
  // defaultPayoutMethodId: id of the default payout method
  // defaultPayoutMethod: the actual default payout method object

  // --- Modal state for editing store/contact fields ---
  // modalVisible: controls modal visibility
  // currentField/currentValue: track which field is being edited
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(""); // Field being edited
  const [currentValue, setCurrentValue] = useState(""); // Value of the field being edited

  // --- Store/Contact Info State ---
  // storeName, storeDescription, email, selectedCountryCode, phoneNumber
  const [storeName, setStoreName] = useState("Swift Deals Ghana");
  const [storeDescription, setStoreDescription] = useState("What you sell...");
  const [email, setEmail] = useState("user@mail.com");
  const [selectedCountryCode, setSelectedCountryCode] = useState("GH"); // Default to Ghana
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber("+233241234567", "GH")
  ); // Format the default value

  // --- useEffect: Handles updates to payout method from navigation params ---
  useEffect(() => {
    if (updatedPayoutMethod) {
      try {
        const parsedMethod = JSON.parse(
          Array.isArray(updatedPayoutMethod)
            ? updatedPayoutMethod[0]
            : updatedPayoutMethod
        );
        // The selectedPayoutMethod state is removed, so we don't need to update it here.
        // The iconMap will be used to display the icon if the parsed method has an icon.
      } catch (error) {
        console.error("Failed to parse updatedPayoutMethod:", error);
      }
    }
  }, [updatedPayoutMethod]);

  // --- handleEditPress: Opens modal for editing a field ---
  const handleEditPress = (field: string, value: string) => {
    setCurrentField(field);
    setCurrentValue(value);
    setModalVisible(true);
  };

  // --- handleSave: Saves the edited field value ---
  const handleSave = () => {
    switch (currentField) {
      case "Store Name":
        setStoreName(currentValue);
        break;
      case "Store Description":
        setStoreDescription(currentValue);
        break;
      case "Email Address":
        setEmail(currentValue);
        break;
      case "Phone Number":
        setPhoneNumber(currentValue);
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

  // --- handlePayoutEdit: Navigates to payout selection screen ---
  const handlePayoutEdit = () => {
    // Navigate to Payout Selection screen and pass the current payout method
    router.push({
      pathname: "/(seller_dashboard)/PayoutSelection",
      params: {
        currentPayoutMethod: JSON.stringify(defaultPayoutMethod), // Pass current payout method as a parameter
      },
    });
  };

  // --- IconComponent: Dynamically renders the icon for the payout method ---
  let IconComponent = null;
  if (
    defaultPayoutMethod &&
    typeof defaultPayoutMethod.icon === "string" &&
    iconMap[defaultPayoutMethod.icon]
  ) {
    IconComponent = iconMap[defaultPayoutMethod.icon];
  } else if (
    defaultPayoutMethod &&
    typeof defaultPayoutMethod.icon === "function"
  ) {
    IconComponent = defaultPayoutMethod.icon;
  }

  return (
    <View className="flex-1 bg-neutral-10 ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-neutral-10"
      >
        <ScrollView
          className="flex-1 "
          contentContainerClassName="gap-4 px-4 bg-neutral-10"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View>
            <TouchableOpacity>
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-text font-Manrope text-Heading3 text-center">
              Seller Settings
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="gap-4">
              {/* Store Information */}
              <Text className="text-text font-Manrope text-Heading4 ">
                Store Information
              </Text>
              <SettingOption
                label="Store Name"
                value={storeName}
                onEditPress={() => handleEditPress("Store Name", storeName)}
              />
              <SettingOption
                label="Store Description"
                value={storeDescription}
                onEditPress={() =>
                  handleEditPress("Store Description", storeDescription)
                }
              />

              {/* Contact Information */}
              <Text className="text-text font-Manrope text-Heading4 ">
                Contact Information
              </Text>
              <SettingOption
                label="Email Address"
                value={email}
                showEditButton={false}
                onEditPress={() => handleEditPress("Email Address", email)}
              />
              <SettingOption
                label="Phone Number"
                value={phoneNumber}
                onEditPress={() => handleEditPress("Phone Number", phoneNumber)}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Payout Preferences */}
          <View className="flex flex-row items-center justify-between">
            <Text className="text-text font-Manrope text-Heading4">
              Payout Preferences
            </Text>
            {defaultPayoutMethod ? (
              <TouchableOpacity
                className="mr-4"
                onPress={handlePayoutEdit}
              >
                <Text className="font-Manrope text-secondary text-BodySmallRegular">
                  Edit
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="mr-4"
                onPress={() => router.push("/(seller_dashboard)/PayoutSelection")}
              >
                <Text className="font-Manrope text-secondary text-BodySmallRegular">
                  Add Payout Method
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {defaultPayoutMethod ? (
            <View
              style={{
                boxShadow: "2px 4px 24px 0px rgba(0, 0, 0, 0.10)",
              }}
              className="flex flex-row items-center gap-4 p-4 rounded-[14px]"
            >
              {IconComponent ? (
                <IconComponent width={100} height={100} />
              ) : (
                <Text>No Icon Available</Text>
              )}
              <View className="gap-2">
                <Text className="text-Heading5 text-text font-Manrope">
                  {defaultPayoutMethod?.name || "No Payout Method Added"}
                </Text>
                <Text className="text-BodySmallRegular text-neutral-60 font-Manrope">
                  {defaultPayoutMethod?.name === "Mobile Money"
                    ? defaultPayoutMethod?.number
                    : `**** **** **** ${defaultPayoutMethod?.number}`}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-neutral-60 text-BodyRegular font-Manrope mt-2">
              No payout methods added yet. Please add a payout method to receive payouts.
            </Text>
          )}

          {/* Notification Settings */}
          <Text className="text-text font-Manrope text-Heading4 ">
            Notification Settings
          </Text>
          <View className="flex flex-row items-center justify-between py-3">
            <View style={{ maxWidth: 261 }}>
              <Text className="text-BodyRegular font-Manrope text-text">
                Notify me when I receive a new order
              </Text>
            </View>
            <View className="mr-4" style={{ transform: [{ scale: 1.5 }] }}>
              <Switch
                value={newOrderNotification}
                onValueChange={setNewOrderNotification}
                trackColor={{ false: "#E5E5E5", true: "#EBB65B" }}
                thumbColor={newOrderNotification ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>
          </View>
          <View className="flex flex-row items-center justify-between py-3">
            <View style={{ maxWidth: 261 }}>
              <Text className="text-BodyRegular font-Manrope text-text">
                Notify me when a product is low on stock
              </Text>
            </View>
            <View className="mr-4" style={{ transform: [{ scale: 1.5 }] }}>
              <Switch
                value={lowStockNotification}
                onValueChange={setLowStockNotification}
                trackColor={{ false: "#E5E5E5", true: "#EBB65B" }}
                thumbColor={lowStockNotification ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>
          </View>
          <View className="flex flex-row items-center justify-between py-3">
            <View style={{ maxWidth: 261 }}>
              <Text className="text-BodyRegular font-Manrope text-text">
                Email me SwiftMart announcements
              </Text>
            </View>
            <View className="mr-4" style={{ transform: [{ scale: 1.5 }] }}>
              <Switch
                value={swiftMartAnnouncements}
                onValueChange={setSwiftMartAnnouncements}
                trackColor={{ false: "#E5E5E5", true: "#EBB65B" }}
                thumbColor={swiftMartAnnouncements ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sign Out Button */}
      <View className="px-4 py-4">
        <IconButton
          BtnText="Sign Out"
          IconComponent={Exit}
          bgColor="bg-alert"
          textColor="text-neutral-10"
          fillColor="#E44A4A"
          borderColor="border-alert"
        />
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/50"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full gap-8 bg-white   rounded-t-[30px] px-4 pt-8 pb-[64px]">
              <Text className="text-Heading5 text-center text-text font-Manrope ">
                Edit {currentField}
              </Text>
              <TextInput
                value={currentValue}
                onChangeText={(text) => {
                  if (currentField === "Phone Number") {
                    const formatted = formatPhoneNumber(
                      text,
                      selectedCountryCode
                    ); // Pass the selected country code
                    setCurrentValue(formatted);
                  } else {
                    setCurrentValue(text);
                  }
                }}
                placeholder={
                  currentField === "Store Description"
                    ? "e.g. What you sell..."
                    : "e.g. +233 24 123 4567"
                }
                multiline={currentField === "Store Description"} // Enable multiline for Store Description
                style={{
                  height: currentField === "Store Description" ? 120 : 50,
                }}
                className="border border-neutral-40 rounded-lg px-4 py-2 text-BodyRegular text-text font-Manrope"
              />
              <View className="my-auto">
                <SecondaryButton BtnText="Save" onPress={handleSave} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default SellerSettings;
