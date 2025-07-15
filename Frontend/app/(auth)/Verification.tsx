import Button from "@/components/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BASE_URL } from "@/constants/env";

const Verification = () => {
  const [focusedInput, setFocusedInput] = useState<number | null>(null); // Tracks which input is focused
  const [code, setCode] = useState(["", "", "", ""]); // Stores the verification code
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null); // Tracks if the code is correct or incorrect
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Tracks if the success modal is visible
  const inputRefs = useRef<(TextInput | null)[]>([]); // References to all input fields
  const { email, password, phoneNumber, firstName, lastName, role } =
    useLocalSearchParams();

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(0, 1); // Ensure only one character is stored
    setCode(newCode);

    // Move to the next input field if available
    if (text.length === 1 && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && index > 0 && code[index] === "") {
      // Move to the previous input field if backspace is pressed and the current field is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Verifying code for email:", email, "code:", code.join(""));
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.join("") }),
      });
      if (response.ok) {
        // Now create the user account
        const createResponse = await fetch(`${BASE_URL}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: {
              emailAddress: email,
              phoneNumber,
              firstName,
              lastName,
              roles: [{ name: role }],
            },
            password,
          }),
        });
        setIsSubmitting(false);
        if (createResponse.ok) {
          setIsCodeCorrect(true);
          setShowSuccessModal(true);
        } else {
          setIsCodeCorrect(false);
          Alert.alert("Account creation failed. Please try again.");
        }
      } else {
        setIsSubmitting(false);
        setIsCodeCorrect(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsCodeCorrect(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    console.log("Resending code to email:", email);
    try {
      let endpoint = `${BASE_URL}/api/auth/send-verification-code`;
      if (role) {
        endpoint = `${BASE_URL}/api/auth/send-registration-code`;
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        Alert.alert("Verification code has been resent to your email.");
      } else {
        Alert.alert("Failed to resend verification code.");
      }
    } catch (error) {
      Alert.alert("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every((value) => value !== ""); // Check if all fields are filled

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView className="flex-1 font-Manrope bg-neutral-10 px-4 py-2">
            {/* Header with Left Arrow */}
            <View className="flex-row items-center w-full bg-white ">
              <Pressable onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#404040" />
              </Pressable>
              <Text className="flex-1 text-Heading2 text-center text-text">
                Verification
              </Text>
            </View>

            {/* Scrollable Verification Content */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="justify-center items-center gap-8 py-8">
                <View className="justify-center items-center relative">
                  {/* Outer Circle */}
                  <View
                    className={`rounded-full h-[150px] w-[150px] ${
                      isCodeCorrect === false ? "bg-alert/15" : "bg-primary/15"
                    }`}
                  ></View>
                  {/* Inner Circle */}
                  <View
                    className={`rounded-full absolute h-[100px] w-[100px] ${
                      isCodeCorrect === false ? "bg-alert" : "bg-primary"
                    }`}
                  ></View>
                  {/* Icon */}
                  <MaterialIcons
                    className="absolute"
                    name={isCodeCorrect === false ? "close" : "mail-outline"}
                    size={40}
                    color="#ffffff"
                  />
                </View>
                <View className="items-center gap-1">
                  {/* Dynamic Text */}
                  <Text
                    className={`text-Heading3 ${
                      isCodeCorrect === false ? "text-alert" : "text-text"
                    } text-center font-Manrope`}
                  >
                    {isCodeCorrect === false
                      ? "Incorrect Code"
                      : "Verification Code"}
                  </Text>
                  <Text
                    className={`text-BodyRegular ${
                      isCodeCorrect === false ? "text-alert" : "text-neutral-70"
                    } font-Manrope`}
                  >
                    {isCodeCorrect === false
                      ? "Please make sure the code is correct"
                      : "We have sent a verification code to"}
                  </Text>
                  {isCodeCorrect !== false && (
                    <Text className="text-BodyBold text-text font-Manrope">{email}</Text>
                  )}
                </View>

                {/* Input Fields */}
                <View className="flex flex-row w-full gap-5 justify-center">
                  {code.map((value, index) => (
                    <TextInput
                      selectionColor={"#404040"} // Change selection color
                      key={index}
                      ref={(ref) => {
                        inputRefs.current[index] = ref;
                      }} // Store reference to the input field
                      value={value}
                      onChangeText={(text) => handleChangeText(text, index)} // Handle text change
                      onKeyPress={({ nativeEvent }) =>
                        handleKeyPress(nativeEvent.key, index)
                      } // Handle backspace
                      className={`border rounded-2xl bg-secondary/10 px-[10px] py-[10px] w-[64px] h-[88px] text-text text-center text-Heading2 ${
                        focusedInput === index
                          ? "border-primary"
                          : "border-neutral-30"
                      }`}
                      keyboardType="numeric"
                      maxLength={1} // Limit input to one character
                      onFocus={() => setFocusedInput(index)} // Custom focus logic
                      onBlur={() => setFocusedInput(null)} // Clear focus state
                    />
                  ))}
                </View>
                <View className="w-full gap-4 flex">
                  <Button
                    BtnText={isSubmitting ? "Submitting..." : "Submit"}
                    bgColor="bg-primary"
                    disabled={!isCodeComplete || isSubmitting}
                    onPress={handleSubmit}
                  />
                  {/* Text */}
                  <View className="flex-row items-center justify-center">
                    <Text className="text-BodyRegular text-text">
                      Didn't receive code?{" "}
                    </Text>
                    <Pressable
                      onPress={handleResendCode}
                      disabled={isResending}
                    >
                      <Text
                        className={`text-primary text-BodyRegular ${
                          isResending ? "opacity-50" : ""
                        }`}
                      >
                        {isResending ? "Resending..." : "Resend"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Sliding Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[32px] px-4 pt-12 pb-16 gap-8 w-full items-center">
            {/* <View className="w-[100px] h-[5px] rounded-full bg-black/15"></View> */}
            <View className="justify-center items-center relative">
              {/* Outer Circle */}
              <View
                className={`rounded-full h-[150px] w-[150px] bg-primary/15`}
              ></View>
              {/* Inner Circle */}
              <View
                className={`rounded-full absolute h-[100px] bg-primary w-[100px]`}
              ></View>
              {/* Icon */}
              <Ionicons
                className="absolute"
                name="checkmark-circle"
                size={40}
                color="white"
              />
            </View>
            <View className="items-center gap-2 w-[319px]">
              <Text className="text-Heading3 text-text ">
                Register Success!
              </Text>
              <Text className="text-BodyRegular text-neutral-70 text-center ">
                Congratulations! Your account has been created{" "}
              </Text>
            </View>
            <View className="w-full">
              <Button
                BtnText="Go To Homepage"
                bgColor="bg-primary"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push("/Home"); // Navigate to the next page
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Verification;
