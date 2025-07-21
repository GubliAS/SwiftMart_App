import IconButton from "@/components/IconButton";
import SecondaryButton from "@/components/SecondaryButton";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "@/constants/env";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleIcon from "@/assets/svgs/google.svg"
import Facebook from "@/assets/svgs/facebook.svg"

const SellerRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1"); // Default country code
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  
  // Get ID verification data from previous screen
  const { storeName, idCardType, idCardCountry, idCardNumber } = useLocalSearchParams();

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
  });

  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhoneNumber = (phone: string) => /^[0-9]{10,15}$/.test(phone);

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /[0-9]/.test(password),
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every((value) => value);
  };

  useEffect(() => {
    const isValid = validatePassword(password);
    setIsPasswordValid(isValid);
  }, [password]);

  useEffect(() => {
    setIsEmailValid(isValidEmail(email));
    setIsPhoneNumberValid(isValidPhoneNumber(phoneNumber));

    if (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      isValidEmail(email) &&
      isValidPhoneNumber(phoneNumber) &&
      validatePassword(password)
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [firstName, lastName, email, phoneNumber, password]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/codes"
        );
        const data = await response.json();

        const countryItems = data.data.map((country: any, index: number) => ({
          label: country.name,
          value: country.dial_code,
          key: `${country.dial_code}_${index}`, // Added unique key
        }));

        setItems(countryItems);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSendCode = async () => {
    try {
      // Send registration verification code
      const response = await fetch(
        `${BASE_URL}/api/auth/send-registration-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        router.push({
          pathname: "/Verification",
          params: {
            email,
            password,
            phoneNumber: countryCode + phoneNumber,
            firstName,
            lastName,
            role: "SELLER",
            storeName,
            idCardType,
            idCardCountry,
            idCardNumber,
          },
        });
      } else {
        const errorText = await response.text();
        if (errorText.includes("Email already registered")) {
          setErrorMessage("An account with this email already exists. Please log in or use a different email.");
        } else {
          setErrorMessage("Failed to send verification code.");
        }
      }
    } catch (error) {
      setErrorMessage(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-white px-4 py-6 font-Manrope">
          <ScrollView
            className="flex-1 overflow-visible"
            contentContainerClassName="gap-6 "
            keyboardShouldPersistTaps="handled"
          >
            <View className="w-[343px] gap-2">
              <Text className="text-Heading2 text-text">
                Create Seller Account
              </Text>
              <Text className="text-BodyRegular text-neutral-70">
                Fill in your details below to start selling on our platform.
              </Text>
            </View>

            {/* First Name and Last Name */}
            <View className="flex flex-row gap-2 w-full">
              <View
                className={`flex-1 flex-row gap-4 items-center border border-neutral-40 rounded-xl py-2 px-[18px] ${
                  firstNameTouched && firstName.trim() === ""
                    ? "border-red-500"
                    : "border-neutral-40"
                }`}
              >
                <Feather name="user" size={24} color="#757575" />
                <View className="gap-1">
                  <Text className="text-BodySmallRegular text-neutral-70">
                    First Name
                  </Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setFirstNameTouched(true)}
                    selectionColor={"#404040"}
                    placeholder=""
                    className="w-full h-[20px]"
                  />
                </View>
              </View>

              <View
                className={`flex-1 items-center flex-row gap-4 border border-neutral-40 rounded-xl py-2 px-[18px] ${
                  lastNameTouched && lastName.trim() === ""
                    ? "border-red-500"
                    : "border-neutral-40"
                }`}
              >
                <Feather name="user" size={24} color="#757575" />
                <View className="gap-1">
                  <Text className="text-BodySmallRegular text-neutral-70">
                    Last Name
                  </Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setLastNameTouched(true)}
                    selectionColor={"#404040"}
                    placeholder=""
                    className="flex-1 h-[20px]"
                  />
                </View>
              </View>
            </View>

            {/* Email Field */}
            <View
              className={`w-full border px-[18px] flex-row items-center gap-4 border-neutral-40 rounded-xl py-2 ${
                emailTouched && !isEmailValid
                  ? "border-red-500"
                  : "border-neutral-40"
              }`}
            >
              <MaterialIcons name="mail-outline" size={24} color="#757575" />
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
                  selectionColor={"#404040"}
                  placeholder=""
                  className="w-full text-text text-BodyRegular"
                />
              </View>
            </View>

            {/* Phone Number Field */}
            <View
              className={`w-full py-2 px-[18px] border rounded-xl flex-row items-center gap-2 ${
                phoneTouched && !isPhoneNumberValid
                  ? "border-red-500"
                  : "border-neutral-40"
              }`}
            >
              <Feather name="phone" size={24} color="#757575" />
              {/* Country Code Dropdown */}
              <View className="w-[40%] text-text border-r border-neutral-40">
                <DropDownPicker
                  open={open}
                  value={countryCode}
                  items={items}
                  setOpen={setOpen}
                  setValue={setCountryCode}
                  setItems={setItems}
                  searchable={true}
                  searchTextInputStyle={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    color: "#404040",
                  }}
                  placeholder="Select a country"
                  style={{
                    borderWidth: 0,
                    borderRadius: 8,
                  }}
                  dropDownContainerStyle={{
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                  }}
                  itemKey="key" // Added to use our unique key
                  listMode="SCROLLVIEW" // Better for performance
                />
              </View>
              <View>
                <Text>{countryCode}</Text>
              </View>
              <View className="flex-1">
                <TextInput
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setIsPhoneNumberValid(isValidPhoneNumber(text));
                  }}
                  onFocus={() => setPhoneTouched(true)}
                  selectionColor={"#404040"}
                  placeholder=""
                  className="w-full h-[20px] text-text text-BodyRegular"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            {/* Password Field */}
            <View>
              <View
                className={`w-full flex flex-row gap-4 py-2 px-[18px] items-center border border-neutral-40 rounded-xl ${
                  passwordTouched && !isPasswordValid
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
                    onChangeText={setPassword}
                    onFocus={() => {
                      setPasswordFocused(true);
                      setPasswordTouched(true);
                    }}
                    onBlur={() => setPasswordFocused(false)}
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
              {/* Password Criteria Dropdown */}
              {passwordFocused && (
                <View
                  className="mt-2  bg-neutral-10 p-4 rounded-lg shadow"
                  style={{
                    alignSelf: "flex-start", // Ensures the dropdown does not stretch to the full width
                    maxWidth: 300, // Optional: Set a maximum width for the dropdown
                  }}
                >
                  <Text
                    className={`text-BodySmallRegular ${
                      passwordCriteria.length ? "text-primary" : "text-alert"
                    }`}
                  >
                    • At least 8 characters
                  </Text>
                  <Text
                    className={`text-BodySmallRegular ${
                      passwordCriteria.uppercase ? "text-primary" : "text-alert"
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
                      passwordCriteria.number ? "text-primary" : "text-alert"
                    }`}
                  >
                    • At least one number
                  </Text>
                </View>
              )}
            </View>
            <View className="w-full">
              <Text className="w-full text-BodySmallRegular text-neutral-70">
                By clicking Create Account, you acknowledge you have read and
                agreed to our{" "}
                <Text className="text-secondary">Terms of Use</Text> and{" "}
                <Text className="text-secondary">Privacy Policy</Text>
              </Text>
            </View>
            {/* Create Account Button */}
            <SecondaryButton
              BtnText="Create Account"
              disabled={isButtonDisabled}
              onPress={handleSendCode}
            />
            {/* Error Message */}
            {errorMessage !== "" && (
              <Text className="text-alert text-BodySmallRegular text-center">
                {errorMessage}
              </Text>
            )}
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
            {/* Login Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-BodyRegular text-text">
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/Login")}>
                <Text className="text-secondary text-BodyRegular">Login</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SellerRegister;
