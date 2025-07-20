import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import PrimaryButton from "@/components/PrimaryButton";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { BASE_URL } from "@/constants/env";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
// @ts-ignore
import * as SecureStore from "expo-secure-store";
import GoogleIcon from "@/assets/svgs/google.svg";
import Facebook from "@/assets/svgs/facebook.svg"

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    number: /\d/.test(password),
  };
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const [modalEmail, setModalEmail] = useState("");
  const [modalEmailTouched, setModalEmailTouched] = useState(false);
  const [isModalEmailValid, setIsModalEmailValid] = useState(false);
  const [isEmailAssigned, setIsEmailAssigned] = useState(true);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isEnteringCode, setIsEnteringCode] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [focusedCodeIndex, setFocusedCodeIndex] = useState<number | null>(null);
  const [normalCodeText, setNormalCodeText] = useState(true);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const panY = useState(new Animated.Value(0))[0];
  const panResponder = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          closeModal();
        } else {
          resetPosition();
        }
      },
    })
  )[0];

  const resetPosition = () => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setShowForgotPasswordModal(false);
    Animated.timing(panY, {
      toValue: 500,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      panY.setValue(0);
      setIsEmailAssigned(true);
      setModalEmail("");
      setIsModalEmailValid(false);
      setModalEmailTouched(false);
      setIsEnteringCode(false);
      setCode(["", "", "", ""]);
      setIsResettingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setIsCheckingEmail(false);
    });
  };

  useEffect(() => {
    setIsEmailValid(isValidEmail(email));
    const passwordValid = isValidPassword(password);

    if (
      isValidEmail(email) &&
      passwordValid.length &&
      passwordValid.uppercase &&
      passwordValid.specialChar &&
      passwordValid.number
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordCriteria(isValidPassword(text));
  };

  const handleEmailSubmit = async () => {
    if (!isModalEmailValid) return;

    setIsCheckingEmail(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/send-verification-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: modalEmail }),
        }
      );

      if (response.ok) {
        setIsEmailAssigned(true);
        setIsEnteringCode(true);
      } else if (response.status === 404) {
        setIsEmailAssigned(false);
      } else {
        // Email exists but sending failed - for now, let's proceed to code input
        // In production, you'd want to show an error message
        setIsEmailAssigned(true);
        setIsEnteringCode(true);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      // For testing purposes, if there's a network error, assume email exists
      // In production, you'd want to show an error message
      setIsEmailAssigned(true);
      setIsEnteringCode(true);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(0, 1);
    setCode(newCode);

    if (text.length === 1 && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodeSubmit = async () => {
    const enteredCode = code.join("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: modalEmail,
          code: enteredCode,
        }),
      });

      if (response.ok) {
        setIsResettingPassword(true);
        setNormalCodeText(true);
      } else {
        setNormalCodeText(false);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setNormalCodeText(false);
    }
  };

  const handlePasswordResetSubmit = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }

    if (!isValidPassword(newPassword).length) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: modalEmail,
          code: code.join(""),
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        closeModal();
        setShowSuccessModal(true);
      } else {
        const errorText = await response.text();
        Alert.alert(
          "Password Reset Failed",
          errorText || "Failed to reset password. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert(
        "Error",
        "An error occurred while resetting your password. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        await SecureStore.setItemAsync("token", data.token);
        router.push("/Home");
      } else {
        setErrorMessage(
          "The email or password you entered is incorrect. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView className="flex-1 bg-neutral-10 p-4 gap-8">
            <ScrollView
              className="flex-1 overflow-visible"
              contentContainerClassName="gap-6"
              keyboardShouldPersistTaps="handled"
            >
              <View className="w-[343px] gap-2">
                <Text className="text-Heading2 text-text font-Manrope">Welcome Back!</Text>
                <Text className="text-BodyRegular text-neutral-70 font-Manrope">
                  Enter your email to start shopping and get awesome deals
                  today!
                </Text>
              </View>

              <View className="flex gap-6">
                <View className="flex gap-4">
                  {/* Email Input */}
                  <View
                    className={`w-full border px-[18px] flex-row items-center gap-4 border-neutral-40 rounded-xl py-2 ${
                      emailTouched && !isEmailValid
                        ? "border-red-500"
                        : "border-neutral-40"
                    }`}
                  >
                    <MaterialIcons
                      name="mail-outline"
                      size={24}
                      color="#757575"
                    />
                    <View className="gap-1 w-full">
                      <Text className="text-BodySmallRegular text-neutral-70">
                        Email
                      </Text>
                      <TextInput
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setIsEmailValid(isValidEmail(text));
                        }}
                        onFocus={() => setEmailTouched(true)}
                        placeholder=""
                        selectionColor={"#404040"}
                        className="w-full text-text text-BodyRegular"
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View className="mt-4">
                    <View
                      className={`w-full flex flex-row gap-4 py-2 px-[18px] items-center border border-neutral-40 rounded-xl ${
                        passwordTouched && !passwordCriteria.length
                          ? "border-red-500"
                          : "border-neutral-40"
                      }`}
                    >
                      <Feather name="lock" size={24} color="#757575" />
                      <View className="gap-1 flex-1">
                        <Text className="text-BodySmallRegular text-neutral-70">
                          Password
                        </Text>
                        <TextInput
                          value={password}
                          onChangeText={handlePasswordChange}
                          onFocus={() => setPasswordTouched(true)}
                          placeholder=""
                          secureTextEntry={!passwordVisible}
                          className="w-full h-[20px] text-text text-BodyRegular"
                          selectionColor={"#404040"}
                        />
                      </View>
                      <Pressable
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={{ padding: 4 }}
                      >
                        <Feather
                          name={passwordVisible ? "eye" : "eye-off"}
                          size={24}
                          color="#757575"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Forgot Password */}
                <View className="w-[170px]">
                  <Pressable
                    onPress={() => {
                      setShowForgotPasswordModal(true);
                    }}
                  >
                    <Text className="text-primary text-BodyRegular">
                      Forgot your password?
                    </Text>
                  </Pressable>
                </View>

                {/* Log In Button */}
                <View className="w-full">
                  <PrimaryButton
                    BtnText="Log In"
                    onPress={handleLogin}
                    disabled={isButtonDisabled}
                  />
                </View>

                {/* Error Message */}
                {errorMessage !== "" && (
                  <Text className="text-alert text-BodySmallRegular text-center font-Manrope">
                    {errorMessage}
                  </Text>
                )}
              </View>

              {/* OR Separator */}
              <View className="flex flex-row items-center">
                <View className="h-[1px] flex-1 bg-neutral-50" />
                <Text className="mx-4 text-Caption text-text">OR</Text>
                <View className="h-[1px] flex-1 bg-neutral-50" />
              </View>

                {/* Social Buttons */}
            <IconButton
            IconComponent={GoogleIcon}
              BtnText="Continue with Google"
              textColor="text-primary"
              borderColor="border-primary"
              bgColor="bg-neutral-10"
            />

            <IconButton
            IconComponent={Facebook}
            fillColor="#1877F2"
            BtnText="Continue with Facebook"
              textColor="text-primary"
              borderColor="border-primary"
              bgColor="bg-neutral-10"
            />

              {/* Register Link */}
              <View className="flex-row items-center justify-center">
                <Text className="text-BodyRegular text-text">
                  Don't have an account?{" "}
                </Text>
                <Pressable onPress={() => router.push("/GetStarted")}>
                  <Text className="text-primary text-BodyRegular">
                    Register
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-end gap-4 bg-black/50">
              <Animated.View
                className="flex items-center gap-4"
                style={{
                  transform: [{ translateY: panY }],
                  width: "100%",
                  backgroundColor: "white",
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  paddingTop: 16,
                  paddingBottom: 64,
                  paddingHorizontal: 16,
                }}
                {...panResponder.panHandlers}
              >
                <View
                  className="w-[100px] h-[5px] rounded-full bg-black/15 "
                  {...panResponder.panHandlers}
                />

                <View className="justify-center items-center relative">
                  <View
                    className={`rounded-full h-[150px] w-[150px] ${
                      isEmailAssigned ? "bg-primary/15" : "bg-alert/15"
                    }`}
                  ></View>
                  <View
                    className={`rounded-full absolute h-[100px] w-[100px] ${
                      isEmailAssigned ? "bg-primary" : "bg-alert"
                    }`}
                  ></View>
                  <FontAwesome5
                    className={`absolute ${
                      isEmailAssigned ? "-rotate-45" : "rotate-0"
                    }`}
                    name={isEmailAssigned ? "key" : "search"}
                    size={32}
                    color="white"
                  />
                </View>

                {isEmailAssigned ? (
                  <>
                    {isResettingPassword ? (
                      <>
                        <View className="items-center gap-2 mb-2 w-[319px]">
                          <Text className="text-Heading3 text-text font-Manrope">
                            Create New Password!
                          </Text>
                          <Text className="text-BodyRegular text-neutral-70 text-center font-Manrope">
                            The new passwords should match each other and also
                            meet the criteria.
                          </Text>
                        </View>
                        <View className="w-full gap-4 relative">
                          <View
                            className={`w-full border px-[18px] flex-row items-center gap-4 rounded-xl py-2 ${
                              newPassword &&
                              !isValidPassword(newPassword).length
                                ? "border-alert"
                                : "border-neutral-40"
                            }`}
                          >
                            <Feather name="lock" size={24} color="#757575" />
                            <View className="gap-1 flex-1">
                              <Text className="text-BodySmallRegular text-neutral-70">
                                New Password
                              </Text>
                              <TextInput
                                value={newPassword}
                                onChangeText={(text) => {
                                  setNewPassword(text);
                                  setPasswordCriteria(isValidPassword(text));
                                }}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                secureTextEntry={!newPasswordVisible}
                                placeholder=""
                                selectionColor={"#404040"}
                                className="w-full h-[32px] text-text text-BodyRegular"
                              />
                            </View>
                            <Pressable
                              onPress={() =>
                                setNewPasswordVisible(!newPasswordVisible)
                              }
                              style={{ padding: 4 }}
                            >
                              <Feather
                                name={newPasswordVisible ? "eye" : "eye-off"}
                                size={24}
                                color="#757575"
                              />
                            </Pressable>
                          </View>

                          {passwordFocused && (
                            <View className="absolute top-[80px] left-0 z-10 bg-neutral-10 p-4 rounded-lg shadow">
                              <Text className="text-BodySmallRegular text-neutral-70">
                                Password must meet the following criteria:
                              </Text>
                              <View className="flex flex-col gap-2 mt-2">
                                <Text
                                  className={`text-BodySmallRegular ${
                                    passwordCriteria.length
                                      ? "text-primary"
                                      : "text-alert"
                                  }`}
                                >
                                  • At least 8 characters
                                </Text>
                                <Text
                                  className={`text-BodySmallRegular ${
                                    passwordCriteria.uppercase
                                      ? "text-primary"
                                      : "text-alert"
                                  }`}
                                >
                                  • At least one uppercase letter
                                </Text>
                                <Text
                                  className={`text-BodySmallRegular ${
                                    passwordCriteria.specialChar
                                      ? "text-primary"
                                      : "text-alert"
                                  }`}
                                >
                                  • At least one special character
                                </Text>
                                <Text
                                  className={`text-BodySmallRegular ${
                                    passwordCriteria.number
                                      ? "text-primary"
                                      : "text-alert"
                                  }`}
                                >
                                  • At least one number
                                </Text>
                              </View>
                            </View>
                          )}

                          <View
                            className={`w-full border px-[18px] flex-row items-center gap-4 rounded-xl py-2 ${
                              confirmPassword && confirmPassword !== newPassword
                                ? "border-alert"
                                : "border-neutral-40"
                            }`}
                          >
                            <Feather name="lock" size={24} color="#757575" />
                            <View className="gap-1 flex-1">
                              <Text className="text-BodySmallRegular text-neutral-70">
                                Confirm Password
                              </Text>
                              <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!confirmPasswordVisible}
                                placeholder=""
                                selectionColor={"#404040"}
                                className="w-full h-[32px] text-text text-BodyRegular"
                              />
                            </View>
                            <Pressable
                              onPress={() =>
                                setConfirmPasswordVisible(
                                  !confirmPasswordVisible
                                )
                              }
                              style={{ padding: 4 }}
                            >
                              <Feather
                                name={
                                  confirmPasswordVisible ? "eye" : "eye-off"
                                }
                                size={24}
                                color="#757575"
                              />
                            </Pressable>
                          </View>
                        </View>

                        <View className="w-full">
                          <PrimaryButton
                            BtnText="Reset Password"
                            disabled={
                              !newPassword ||
                              !confirmPassword ||
                              newPassword !== confirmPassword ||
                              !passwordCriteria.length ||
                              !passwordCriteria.uppercase ||
                              !passwordCriteria.specialChar ||
                              !passwordCriteria.number
                            }
                            onPress={handlePasswordResetSubmit}
                          />
                        </View>
                      </>
                    ) : isEnteringCode ? (
                      <>
                        <View className="items-center gap-2 mb-2 w-[319px]">
                          <Text className="text-Heading3 text-text font-Manrope">
                            {normalCodeText
                              ? "Forgot Password!"
                              : "Invalid Code!"}
                          </Text>
                          <Text className="text-BodyRegular text-neutral-70 text-center font-Manrope">
                            {normalCodeText
                              ? "Enter code"
                              : "The code you entered is incorrect. Please try again."}
                          </Text>
                        </View>
                        <View className="flex flex-row w-full gap-5 justify-center">
                          {code.map((value, index) => (
                            <TextInput
                              selectionColor={"#404040"}
                              key={index}
                              ref={(ref) => {
                                inputRefs.current[index] = ref;
                              }}
                              value={value}
                              onChangeText={(text) =>
                                handleCodeChange(text, index)
                              }
                              onFocus={() => setFocusedCodeIndex(index)}
                              onBlur={() => setFocusedCodeIndex(null)}
                              className={`border rounded-2xl bg-secondary/10 px-[10px] py-[10px] w-[64px] h-[88px] text-text text-center text-Heading2 ${
                                focusedCodeIndex === index
                                  ? "border-primary"
                                  : "border-neutral-30"
                              }`}
                              keyboardType="numeric"
                              maxLength={1}
                            />
                          ))}
                        </View>

                        <View className="w-full">
                          <PrimaryButton
                            BtnText="Submit"
                            disabled={code.some((digit) => digit === "")}
                            onPress={handleCodeSubmit}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        <View className="items-center gap-2 mb-2 w-[319px]">
                          <Text className="text-Heading3 text-text font-Manrope">
                            {isEmailAssigned
                              ? "Forgot Password!"
                              : "No Account Found!"}
                          </Text>
                          <Text className="text-BodyRegular text-neutral-70 text-center font-Manrope">
                            {isEmailAssigned
                              ? "Enter your email"
                              : "The email address you entered is not linked to any SwiftMart account."}
                          </Text>
                        </View>
                        <View
                          className={`w-full border px-[18px] mb-2 flex-row items-center gap-4 rounded-xl py-2 ${
                            modalEmailTouched && !isModalEmailValid
                              ? "border-alert"
                              : "border-neutral-40"
                          }`}
                        >
                          <MaterialIcons
                            name="mail-outline"
                            size={24}
                            color="#757575"
                          />
                          <View className="gap-1 w-full">
                            <Text className="text-BodySmallRegular text-neutral-70">
                              Email
                            </Text>
                            <TextInput
                              value={modalEmail}
                              onChangeText={(text) => {
                                setModalEmail(text);
                                setIsModalEmailValid(isValidEmail(text));
                              }}
                              onFocus={() => setModalEmailTouched(true)}
                              placeholder=""
                              selectionColor={"#404040"}
                              className="w-full h-[32px] text-text text-BodyRegular"
                            />
                          </View>
                        </View>

                        <View className="w-full">
                          <PrimaryButton
                            BtnText={
                              isCheckingEmail ? "Checking..." : "Send Code"
                            }
                            disabled={!isModalEmailValid || isCheckingEmail}
                            onPress={handleEmailSubmit}
                          />
                        </View>
                      </>
                    )}
                  </>
                ) : (
                  <View className="w-full flex items-center gap-4">
                    <Button
                      BtnText="Create Account"
                      bgColor="bg-alert"
                      onPress={() => {
                        closeModal();
                        router.push("/GetStarted");
                      }}
                    />
                    <Button
                      BtnText="Try Again"
                      bgColor="bg-neutral-10"
                      textColor="text-alert"
                      hasBorder={true}
                      borderColor="border-alert"
                      onPress={() => {
                        setIsEmailAssigned(true);
                        setModalEmail("");
                        setIsModalEmailValid(false);
                        setModalEmailTouched(false);
                        setIsEnteringCode(false);
                        setIsResettingPassword(false);
                        setCode(["", "", "", ""]);
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    />
                  </View>
                )}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Password Reset Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.4)]">
          <View className="bg-neutral-10 rounded-[16px] px-4 py-6 gap-4 items-center w-[300px]">
            <AntDesign name="checkcircle" size={64} color="#156651" />
            <View>
              <Text className="text-center text-Heading4 text-text">
                Password Reset Successful
              </Text>
              <Text className="text-center text-BodySmallRegular text-neutral-70">
                Your password has been successfully reset. You can now log in
                with your new password.
              </Text>
            </View>
            <Pressable
              onPress={() => setShowSuccessModal(false)}
              className="bg-primary rounded-[8px] py-3 px-[18px] w-full items-center"
            >
              <Text className=" text-neutral-10 text-BodyBold">OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Login;
