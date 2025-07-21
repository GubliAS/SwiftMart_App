import SecondaryButton from "@/components/SecondaryButton";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import Feather from "@expo/vector-icons/Feather";

const SellerRegister1 = () => {
  const [storeName, setStoreName] = useState("");
  const [idCardType, setIdCardType] = useState("");
  const [idCardCountry, setIdCardCountry] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Dropdown states
  const [cardTypeOpen, setCardTypeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [cardTypeItems, setCardTypeItems] = useState([
    { label: "National ID", value: "national_id" },
    { label: "Passport", value: "passport" },
    { label: "Driver's License", value: "drivers_license" },
    { label: "Social Security Card", value: "ssn" },
    { label: "Other Government ID", value: "other" },
  ]);
  const [countryItems, setCountryItems] = useState<any[]>([]);

  // Validation states
  const [storeNameTouched, setStoreNameTouched] = useState(false);
  const [idCardNumberTouched, setIdCardNumberTouched] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/codes"
        );
        const data = await response.json();

        const countries = data.data.map((country: any, index: number) => ({
          label: country.name,
          value: country.name,
          key: `${country.name}_${index}`,
        }));

        setCountryItems(countries);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, []);

  // Validate ID card number based on type and country
  const validateIdCardNumber = (number: string, type: string, country: string) => {
    if (!number || !type || !country) return false;
    
    const cleanNumber = number.replace(/\s/g, '');
    
    // Basic length validation
    let isValidLength = false;
    switch (type) {
      case "national_id":
        isValidLength = cleanNumber.length >= 6 && cleanNumber.length <= 20;
        break;
      case "passport":
        isValidLength = cleanNumber.length >= 6 && cleanNumber.length <= 12;
        break;
      case "drivers_license":
        isValidLength = cleanNumber.length >= 6 && cleanNumber.length <= 15;
        break;
      case "ssn":
        isValidLength = cleanNumber.length === 9;
        break;
      case "other":
        isValidLength = cleanNumber.length >= 4 && cleanNumber.length <= 20;
        break;
      default:
        isValidLength = cleanNumber.length >= 4;
    }
    
    if (!isValidLength) return false;
    
    // Country-specific validation patterns
    if (country === "United States") {
      switch (type) {
        case "ssn":
          // US SSN validation: XXX-XX-XXXX format, no 000, 666, or 900-999 in first group
          const ssnPattern = /^(?!000|666|9\d{2})\d{3}(?!00)\d{2}(?!0000)\d{4}$/;
          return ssnPattern.test(cleanNumber);
        case "drivers_license":
          // US Driver's License: alphanumeric, 6-15 characters
          const dlPattern = /^[A-Z0-9]{6,15}$/;
          return dlPattern.test(cleanNumber.toUpperCase());
        case "passport":
          // US Passport: 6-9 digits
          const passportPattern = /^\d{6,9}$/;
          return passportPattern.test(cleanNumber);
        case "national_id":
          // US National ID: alphanumeric, 6-20 characters
          const nationalIdPattern = /^[A-Z0-9]{6,20}$/;
          return nationalIdPattern.test(cleanNumber.toUpperCase());
        case "other":
          // Other US documents: alphanumeric, 4-20 characters
          const otherPattern = /^[A-Z0-9]{4,20}$/;
          return otherPattern.test(cleanNumber.toUpperCase());
        default:
          return false; // Unknown type
      }
    } else if (country === "United Kingdom") {
      switch (type) {
        case "passport":
          // UK Passport: 9 digits
          const ukPassportPattern = /^\d{9}$/;
          return ukPassportPattern.test(cleanNumber);
        case "drivers_license":
          // UK Driver's License: 16 characters, alphanumeric
          const ukDlPattern = /^[A-Z0-9]{16}$/;
          return ukDlPattern.test(cleanNumber.toUpperCase());
        case "national_id":
          // UK National ID: alphanumeric, 6-20 characters
          const ukNationalIdPattern = /^[A-Z0-9]{6,20}$/;
          return ukNationalIdPattern.test(cleanNumber.toUpperCase());
        case "other":
          // Other UK documents: alphanumeric, 4-20 characters
          const ukOtherPattern = /^[A-Z0-9]{4,20}$/;
          return ukOtherPattern.test(cleanNumber.toUpperCase());
        default:
          return false; // Unknown type
      }
    } else if (country === "Canada") {
      switch (type) {
        case "passport":
          // Canadian Passport: 2 letters + 6 digits
          const caPassportPattern = /^[A-Z]{2}\d{6}$/;
          return caPassportPattern.test(cleanNumber.toUpperCase());
        case "drivers_license":
          // Canadian Driver's License: alphanumeric, 6-15 characters
          const caDlPattern = /^[A-Z0-9]{6,15}$/;
          return caDlPattern.test(cleanNumber.toUpperCase());
        case "national_id":
          // Canadian National ID: alphanumeric, 6-20 characters
          const caNationalIdPattern = /^[A-Z0-9]{6,20}$/;
          return caNationalIdPattern.test(cleanNumber.toUpperCase());
        case "other":
          // Other Canadian documents: alphanumeric, 4-20 characters
          const caOtherPattern = /^[A-Z0-9]{4,20}$/;
          return caOtherPattern.test(cleanNumber.toUpperCase());
        default:
          return false; // Unknown type
      }
    } else {
      // For other countries, apply strict alphanumeric validation
      switch (type) {
        case "passport":
          // Passport: digits only, 6-12 characters
          const passportPattern = /^\d{6,12}$/;
          return passportPattern.test(cleanNumber);
        case "drivers_license":
          // Driver's License: alphanumeric, 6-15 characters
          const dlPattern = /^[A-Z0-9]{6,15}$/;
          return dlPattern.test(cleanNumber.toUpperCase());
        case "national_id":
          // National ID: alphanumeric, 6-20 characters
          const nationalIdPattern = /^[A-Z0-9]{6,20}$/;
          return nationalIdPattern.test(cleanNumber.toUpperCase());
        case "ssn":
          // SSN: digits only, 9 characters
          const ssnPattern = /^\d{9}$/;
          return ssnPattern.test(cleanNumber);
        case "other":
          // Other documents: alphanumeric, 4-20 characters
          const otherPattern = /^[A-Z0-9]{4,20}$/;
          return otherPattern.test(cleanNumber.toUpperCase());
        default:
          return false; // Unknown type
      }
    }
  };

  // Validate inputs and enable/disable the button
  useEffect(() => {
    const isStoreNameValid = storeName.trim() !== "";
    const isIdCardTypeValid = idCardType !== "";
    const isIdCardCountryValid = idCardCountry !== "";
    const isIdCardNumberValid = validateIdCardNumber(idCardNumber, idCardType, idCardCountry);

    // Debug logging
    console.log("=== VALIDATION DEBUG ===");
    console.log("Store Name:", storeName, "Valid:", isStoreNameValid);
    console.log("ID Card Type:", idCardType, "Valid:", isIdCardTypeValid);
    console.log("ID Card Country:", idCardCountry, "Valid:", isIdCardCountryValid);
    console.log("ID Card Number:", idCardNumber, "Valid:", isIdCardNumberValid);
    console.log("All Valid:", isStoreNameValid && isIdCardTypeValid && isIdCardCountryValid && isIdCardNumberValid);
    console.log("=========================");

    if (isStoreNameValid && isIdCardTypeValid && isIdCardCountryValid && isIdCardNumberValid) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [storeName, idCardType, idCardCountry, idCardNumber]);

  const handleNext = () => {
    // Store the ID verification data in router params
    router.push({
      pathname: "/SellerRegister2",
      params: {
        storeName,
        idCardType,
        idCardCountry,
        idCardNumber,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          className="flex-1 bg-white px-4 py-6 font-Manrope"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <SafeAreaView className="flex-1 gap-8">
            <View className="w-[343px] gap-2">
              <Text className="text-Heading2 text-text">Create Seller Account</Text>
              <Text className="text-BodyRegular text-neutral-70">
                Provide your store information and ID verification to start selling on our platform.
              </Text>
            </View>

            {/* Store Name */}
            <View className="flex gap-4">
              <Text className="text-BodySmallRegular text-text">
                What is the name of your store?
              </Text>
              <View
                className={`flex-row gap-4 items-center border border-neutral-40 rounded-xl py-2 px-[18px] ${
                  storeNameTouched && storeName.trim() === ""
                    ? "border-red-500"
                    : "border-neutral-40"
                }`}
              >
                <Feather name="shopping-bag" size={24} color="#757575" />
                <View className="gap-1 flex-1">
                  <Text className="text-BodySmallRegular text-neutral-70">
                    Store Name
              </Text>
              <TextInput
                value={storeName}
                onChangeText={setStoreName}
                    onFocus={() => setStoreNameTouched(true)}
                    selectionColor={"#404040"}
                    placeholder="Enter your store name"
                    className="w-full h-[20px] text-BodyRegular text-text"
                  />
                </View>
              </View>
            </View>

            {/* ID Card Type */}
            <View className="flex gap-4" style={{ zIndex: 2000 }}>
              <Text className="text-BodySmallRegular text-text">
                What type of ID card are you using?
              </Text>
              <DropDownPicker
                open={cardTypeOpen}
                value={idCardType}
                items={cardTypeItems}
                setOpen={setCardTypeOpen}
                setValue={setIdCardType}
                setItems={setCardTypeItems}
                placeholder="Select ID card type"
                style={{
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                }}
                dropDownContainerStyle={{
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  zIndex: 2000,
                }}
                listMode="SCROLLVIEW"
                zIndex={2000}
                zIndexInverse={1000}
              />
            </View>

            {/* ID Card Country */}
            <View className="flex gap-4" style={{ zIndex: 1000 }}>
              <Text className="text-BodySmallRegular text-text">
                Which country issued your ID card?
              </Text>
              <DropDownPicker
                open={countryOpen}
                value={idCardCountry}
                items={countryItems}
                setOpen={setCountryOpen}
                setValue={setIdCardCountry}
                setItems={setCountryItems}
                placeholder="Select country"
                searchable={true}
                searchTextInputStyle={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                  color: "#404040",
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                }}
                dropDownContainerStyle={{
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                  borderRadius: 12,
                  zIndex: 1000,
                }}
                listMode="SCROLLVIEW"
                zIndex={1000}
                zIndexInverse={2000}
              />
            </View>

            {/* ID Card Number */}
            <View className="flex gap-4">
              <Text className="text-BodySmallRegular text-text">
                Enter your ID card number
              </Text>
              <View
                className={`flex-row gap-4 items-center border border-neutral-40 rounded-xl py-2 px-[18px] ${
                  idCardNumberTouched && !validateIdCardNumber(idCardNumber, idCardType, idCardCountry)
                    ? "border-red-500"
                    : "border-neutral-40"
                }`}
              >
                <Feather name="credit-card" size={24} color="#757575" />
                <View className="gap-1 flex-1">
                  <Text className="text-BodySmallRegular text-neutral-70">
                    ID Card Number
                  </Text>
                  <TextInput
                    value={idCardNumber}
                    onChangeText={setIdCardNumber}
                    onFocus={() => setIdCardNumberTouched(true)}
                    selectionColor={"#404040"}
                    placeholder="Enter your ID card number"
                    className="w-full h-[20px] text-BodyRegular text-text"
                    autoCapitalize="characters"
                  />
                </View>
              </View>
              {idCardNumberTouched && !validateIdCardNumber(idCardNumber, idCardType, idCardCountry) && (
                <Text className="text-red-500 text-BodySmallRegular">
                  Please enter a valid {idCardType.replace('_', ' ')} number
                    </Text>
                )}
            </View>

            {/* Next Button */}
            <SecondaryButton
              BtnText="Next"
              disabled={isButtonDisabled}
              onPress={!isButtonDisabled ? handleNext : undefined}
            />
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SellerRegister1;
