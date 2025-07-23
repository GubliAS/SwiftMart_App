import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import SecondaryButton from "../../components/SecondaryButton";
import { SafeAreaView } from "react-native-safe-area-context";

const AddProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<Array<string | null>>([null, null, null]);

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const handlePublish = () => {
    // You can validate and send product data here
    alert("Product published!");
  };

  // Only show stock input if user did NOT come from AddVariant screen (i.e., no variants param)
  const showStock = !params.variants;

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top row: chevron and info icon above heading */}
        <View className="flex-row items-center justify-between mt-4 mb-2">
          <Pressable onPress={() => router.back()} className="p-1">
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <View className="w-8 h-8 bg-white items-center justify-center ml-2">
            <Ionicons name="information-circle-outline" size={24} color="#EBB65B" />
          </View>
        </View>
        <Text className="text-Heading2 font-Manrope font-bold text-center mb-8">Add New Product</Text>

        {/* 9. Stock */}
        {showStock && (
          <>
            <Text className="text-sm font-semibold mb-1">9. Stock</Text>
            <TextInput
              value={stock}
              onChangeText={setStock}
              placeholder="eg. 150"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm"
              placeholderTextColor="#999"
            />
          </>
        )}

        {/* 10. Upload Product Images */}
        <Text className="text-sm font-semibold mb-2">10. Upload Product Images</Text>
        <View className="flex-row justify-between mb-8">
          {images.map((uri, index) => (
            <Pressable
              key={index}
              onPress={() => pickImage(index)}
              style={{ width: 100, height: 100, borderWidth: 2, borderColor: '#EBB65B', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#fff' }}
            >
              {uri ? (
                <Image
                  source={{ uri }}
                  style={{ width: 100, height: 100, borderRadius: 12 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="camera-outline" size={36} color="#999" />
              )}
            </Pressable>
          ))}
        </View>

        {/* Publish Button */}
        <SecondaryButton
          BtnText="Publish"
          onPress={handlePublish}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductDetailScreen;