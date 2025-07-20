// AddProductScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Required for type safety when receiving params from expo-router
interface LocalSearchParams {
  selectedCategory?: string | string[]; // Changed to handle string or array of strings as previous versions
}

// Required for type safety when passing product data to the next screen
interface BaseProductData {
  productName: string;
  description: string;
  category: string;
  condition: string;
  weight: number;
  price: number;
  standardShipping: boolean;
  expressShipping: boolean;
  addVariants: boolean;
}

const AddProductScreen: React.FC = () => {
  const router = useRouter();
  const { selectedCategory } = useLocalSearchParams(); // No generic type needed

  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [standardShipping, setStandardShipping] = useState<boolean>(false);
  const [expressShipping, setExpressShipping] = useState<boolean>(false);
  const [price, setPrice] = useState<string>("");
  const [showConditionDropdown, setShowConditionDropdown] = useState<boolean>(false);
  const [addVariants, setAddVariants] = useState<boolean>(false); // This is the key state for navigation logic

  const conditionOptions: string[] = ["New", "Used"];

  useEffect(() => {
    if (selectedCategory) {
      if (typeof selectedCategory === "string") {
        setCategory(selectedCategory);
      } else if (Array.isArray(selectedCategory) && selectedCategory.length > 0) {
        setCategory(selectedCategory[0]);
      }
    }
  }, [selectedCategory]);

  const handleNext = () => {
    const parsedWeight = parseFloat(weight);
    const parsedPrice = parseFloat(price);

    const currentFormData: BaseProductData = {
      productName,
      description,
      category,
      condition,
      weight: isNaN(parsedWeight) ? 0 : parsedWeight,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      standardShipping,
      expressShipping,
      addVariants,
    };

    if (addVariants) {
      // If 'Yes' is chosen for variants, navigate to the Addvariant screen
      router.push({
        pathname: "/AddVariant", // CORRECTED: Navigate to AddVariant.tsx
        params: {
          ...currentFormData,
          standardShipping: String(currentFormData.standardShipping),
          expressShipping: String(currentFormData.expressShipping),
          addVariants: String(currentFormData.addVariants),
        } as Record<string, string | number>, // Corrected type assertion for params
      });
    } else {
      // If 'No' is chosen, navigate to the AddProductDetailScreen (as per our last discussion)
      console.log("Product data submitted (no variants selected):", currentFormData);
      router.push({
        pathname: "/(auth)/AddProductDetailScreen", // Navigate to AddProductDetailScreen
        params: {
          ...currentFormData,
          standardShipping: String(currentFormData.standardShipping),
          expressShipping: String(currentFormData.expressShipping),
          addVariants: String(currentFormData.addVariants),
        } as Record<string, string | number>,
      });
    }
  };

  const handleCategoryPress = () => {
    router.push("/CategoriesSelectionScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        <Text className="text-xl font-bold mb-6 text-center">Add New Product</Text>

        {/* Product Name */}
        <Text className="text-sm font-semibold mb-1">1. Product Name</Text>
        <TextInput
          value={productName}
          onChangeText={setProductName}
          placeholder='eg. "PlayStation 5 Controller"'
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm"
          placeholderTextColor="#999"
        />

        {/* Description */}
        <Text className="text-sm font-semibold mb-1">2. Product Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="eg. “A comfortable and stylish armchair…”"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm text-gray-800"
          placeholderTextColor="#999"
        />

        {/* Category */}
        <Text className="text-sm font-semibold mb-1">3. Category</Text>
        <Pressable
          onPress={handleCategoryPress}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        >
          <Text className="text-sm text-gray-700">
            {category || "Select Category"}
          </Text>
        </Pressable>

        {/* Condition */}
        <Text className="text-sm font-semibold mb-1">4. Condition</Text>
        <Pressable
          onPress={() => setShowConditionDropdown(!showConditionDropdown)}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-1"
        >
          <Text className="text-sm text-gray-700">
            {condition || "Select Condition"}
          </Text>
        </Pressable>

        {showConditionDropdown && (
          <View className="border border-gray-300 rounded-lg mb-4 bg-white shadow">
            {conditionOptions.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setCondition(item);
                  setShowConditionDropdown(false);
                }}
                className={`px-4 py-3 ${condition === item ? "bg-yellow-400" : ""}`}
              >
                <Text
                  className={`text-sm ${
                    condition === item ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Weight */}
        <Text className="text-sm font-semibold mb-1">5. Product Weight (in kg)</Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="eg. 2.5"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm"
          placeholderTextColor="#999"
        />

        {/* Shipping */}
        <Text className="text-sm font-semibold mb-1">6. Shipping Method</Text>
        <Text className="text-xs text-gray-500 mb-2">
          Which Swift Mail shipping options are supported for this product?
        </Text>
        <View className="flex-row items-center mb-2">
          <Switch
            value={standardShipping}
            onValueChange={setStandardShipping}
            trackColor={{ false: "#ccc", true: "#facc15" }}
            thumbColor={standardShipping ? "#f59e0b" : "#fff"}
          />
          <Text className="ml-2 text-sm text-gray-700">
            Standard Shipping (5–10 days)
          </Text>
        </View>
        <View className="flex-row items-center mb-8">
          <Switch
            value={expressShipping}
            onValueChange={setExpressShipping}
            trackColor={{ false: "#ccc", true: "#facc15" }}
            thumbColor={expressShipping ? "#f59e0b" : "#fff"}
          />
          <Text className="ml-2 text-sm text-gray-700">
            Express Shipping (2-5 days)
          </Text>
        </View>
        <Text className="text-xs text-gray-500 mb-6 italic">(Both can be ticked)</Text>


        {/* Price */}
        <Text className="text-sm font-semibold mb-1">7. Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="eg. $230"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm"
          placeholderTextColor="#999"
        />

        {/* Add Variants - Radio Buttons */}
        <Text className="text-sm font-semibold mb-2">8. Do you want to add variants(eg. color, size) ?</Text>
        <View className="flex-row items-center mb-10">
          <Pressable
            onPress={() => setAddVariants(true)}
            className={`flex-row items-center mr-6`}
          >
            <View className={`w-5 h-5 rounded-full border-2 ${addVariants ? 'border-amber-500' : 'border-gray-400'} items-center justify-center`}>
              {addVariants && <View className="w-3 h-3 rounded-full bg-amber-500" />}
            </View>
            <Text className="ml-2 text-base text-gray-800">Yes</Text>
          </Pressable>
          <Pressable
            onPress={() => setAddVariants(false)}
            className={`flex-row items-center`}
          >
            <View className={`w-5 h-5 rounded-full border-2 ${!addVariants ? 'border-amber-500' : 'border-gray-400'} items-center justify-center`}>
              {!addVariants && <View className="w-3 h-3 rounded-full bg-amber-500" />}
            </View>
            <Text className="ml-2 text-base text-gray-800">No</Text>
          </Pressable>
        </View>


        {/* Next Button */}
        <Pressable
          onPress={handleNext}
          className="bg-yellow-500 rounded-full py-3 items-center mb-10"
        >
          <Text className="text-white font-semibold text-base">Next</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;