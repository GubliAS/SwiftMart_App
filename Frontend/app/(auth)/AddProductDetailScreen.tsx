import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddProductDetailScreen = () => {
  const router = useRouter();
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

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Arrow */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        {/* Title */}
        <Text className="text-xl font-bold mb-6 text-center">Add New Product</Text>

        {/* 9. Stock */}
        <Text className="text-sm font-semibold mb-1">9. Stock</Text>
        <TextInput
          value={stock}
          onChangeText={setStock}
          placeholder="eg. 150"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm"
          placeholderTextColor="#999"
        />

        {/* 10. Upload Product Images */}
        <Text className="text-sm font-semibold mb-2">10. Upload Product Images</Text>
        <View className="flex-row justify-between mb-8">
          {images.map((uri, index) => (
            <Pressable
              key={index}
              onPress={() => pickImage(index)}
              className="w-24 h-24 border-2 border-yellow-400 border-dashed rounded-lg items-center justify-center"
            >
              {uri ? (
                <Image
                  source={{ uri }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="camera-outline" size={30} color="#999" />
              )}
            </Pressable>
          ))}
        </View>

        {/* Publish Button */}
        <Pressable
          onPress={handlePublish}
          className="bg-yellow-500 rounded-full py-3 items-center mb-10"
        >
          <Text className="text-white font-semibold text-base">Publish</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductDetailScreen;