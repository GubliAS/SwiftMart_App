import SecondaryButton from "@/components/SecondaryButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SellerRegister1 = () => {
  const [storeName, setStoreName] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleImageSelection = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              alert("Camera permission is required to take a photo.");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled) {
              setIdImage(result.assets[0].uri); // Save the image URI
            }
          },
        },
        {
          text: "Upload from Photos",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Gallery permission is required to upload an image.");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled) {
              setIdImage(result.assets[0].uri); // Save the image URI
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteImage = () => {
    setIdImage(null); // Clear the selected image
  };

  // Validate inputs and enable/disable the button
  useEffect(() => {
    if (storeName.trim() !== "" && idImage) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [storeName, idImage]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 gap-8 bg-white px-4 py-6 font-Manrope">
        <View className="w-[343px] gap-2">
          <Text className="text-Heading2 text-text">Create Account</Text>
          <Text className="text-BodyRegular text-neutral-70">
            Fill in your details below to get started on a seamless shopping
            experience.
          </Text>
        </View>

        {/* Store Name */}
        <View className="flex gap-4">
          <Text className="text-BodySmallRegular text-text">
            What is the name of your store?
          </Text>
          <TextInput
            placeholder="Enter Store Name"
            placeholderTextColor="#C2C2C2"
            className="w-full rounded-xl border border-neutral-40 px-[18px] py-4 text-BodyRegular text-text"
            selectionColor="#404040"
            value={storeName}
            onChangeText={setStoreName}
          />
        </View>

        {/* ID Image Input */}
        <View className="flex gap-4">
          <Text className="text-BodySmallRegular text-text">
            Upload an image of your National ID
          </Text>
          <TouchableOpacity
            onPress={handleImageSelection}
            className="relative h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed border-neutral-40 "
          >
            {idImage ? (
              <>
                {/* Display Selected Image */}
                <Image
                  source={{ uri: idImage }}
                  className="absolute h-full w-full rounded-lg"
                />
                {/* Delete Icon */}
                <TouchableOpacity
                  onPress={handleDeleteImage}
                  className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-neutral-10 shadow"
                >
                  <Text className="text-lg text-primary">✕</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Camera Icon */}
                <Image
                  source={require("@/assets/images/camera-icon.png")}
                  className=""
                />
                <Text className="mt-2 text-BodySmallRegular text-neutral-50">
                  Tap to upload
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <SecondaryButton
          BtnText="Finish"
          disabled={isButtonDisabled} // Disable functionality when inputs are invalid
          onPress={
            !isButtonDisabled
              ? () => router.push("/SellerFinished")
              : undefined
          }
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SellerRegister1;
