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
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import SettingOption from "@/components/SettingOption";
import MasterCard from "@/assets/svgs/mastercard.svg";
import IconButton from "@/components/IconButton";
import Exit from "@/assets/svgs/exit.svg";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import PrimaryButton from "@/components/PrimaryButton";

const phoneUtil = PhoneNumberUtil.getInstance();

const formatPhoneNumber = (text: string, selectedCountryCode: string) => {
  try {
    const phoneNumber = phoneUtil.parse(text, selectedCountryCode); // Use the selected country code
    return phoneUtil.format(phoneNumber, PhoneNumberFormat.INTERNATIONAL); // e.g., "+1 234 567 8901"
  } catch (error) {
    return text; // Return the original text if parsing fails
  }
};

const SellerSettings = () => {
  const [newOrderNotification, setNewOrderNotification] = useState(false);
  const [lowStockNotification, setLowStockNotification] = useState(false);
  const [swiftMartAnnouncements, setSwiftMartAnnouncements] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(""); // Field being edited
  const [currentValue, setCurrentValue] = useState(""); // Value of the field being edited

  // Field values
  const [storeName, setStoreName] = useState("Swift Deals Ghana");
  const [storeDescription, setStoreDescription] = useState("What you sell...");
  const [email, setEmail] = useState("user@mail.com");
  const [selectedCountryCode, setSelectedCountryCode] = useState("GH"); // Default to Ghana
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber("+233241234567", "GH")
  ); // Format the default value

  const handleEditPress = (field: string, value: string) => {
    setCurrentField(field);
    setCurrentValue(value);
    setModalVisible(true);
  };

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
            <Text className="text-text font-Manrope text-Heading4 ">
              Payout Preferences
            </Text>
            <TouchableOpacity className="mr-4">
              <Text className="font-Manrope text-secondary text-BodySmallRegular">
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              boxShadow: "2px 4px 24px 0px rgba(0, 0, 0, 0.10)",
            }}
            className="flex flex-row items-center gap-4 p-4 rounded-[14px] "
          >
            <MasterCard width={100} height={100} />
            <View className="gap-2">
              <Text className="text-Heading5 text-text font-Manrope">
                MasterCard
              </Text>
              <Text className="text-BodySmallRegular text-neutral-60 font-Manrope">
                **** **** **** 1234
              </Text>
            </View>
          </View>

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
                <PrimaryButton BtnText="Save" onPress={handleSave} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default SellerSettings;
