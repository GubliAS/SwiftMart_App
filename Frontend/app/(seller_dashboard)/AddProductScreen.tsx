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
import PrimaryButton from "../../components/PrimaryButton";
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
  const params = useLocalSearchParams();

  const [productName, setProductName] = useState<string>(typeof params.productName === 'string' ? params.productName : "");
  const [description, setDescription] = useState<string>(typeof params.description === 'string' ? params.description : "");
  const [category, setCategory] = useState<string>(typeof params.category === 'string' ? params.category : "");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>(typeof params.condition === 'string' ? params.condition : "");
  const [showConditionDropdown, setShowConditionDropdown] = useState<boolean>(false);
  const [weight, setWeight] = useState<string>(typeof params.weight === 'string' ? params.weight : (typeof params.weight === 'number' ? String(params.weight) : ""));
  const parseBool = (val: any) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val === 'true';
    if (Array.isArray(val)) return val[0] === 'true';
    return false;
  };
  const [standardShipping, setStandardShipping] = useState<boolean>(parseBool(params.standardShipping));
  const [expressShipping, setExpressShipping] = useState<boolean>(parseBool(params.expressShipping));
  const [price, setPrice] = useState<string>(typeof params.price === 'string' ? params.price : (typeof params.price === 'number' ? String(params.price) : ""));
  const [addVariants, setAddVariants] = useState<boolean>(parseBool(params.addVariants));

  const categoryOptions: string[] = [
    "Home & Living",
    "Electronics & Devices",
    "Sports & Fitness",
    "Computer & Accessories",
    "Beauty & Personal Care",
    "Office & Stationary",
    "Fashion",
    "Automative & Tools",
    "Groceries & Essentials",
    "Kids & Toys",
  ];
  const conditionOptions: string[] = ["New", "Used"];

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
      // If checked, navigate to AddVariant screen and pass addVariants
      router.push({
        pathname: "/AddVariant",
        params: {
          ...currentFormData,
          standardShipping: String(currentFormData.standardShipping),
          expressShipping: String(currentFormData.expressShipping),
          addVariants: "true",
        } as Record<string, string | number>,
      });
    } else {
      // If not checked, navigate to AddProductDetailScreen and do NOT pass addVariants
      const { addVariants, ...formDataWithoutVariants } = currentFormData;
      router.push({
        pathname: "/AddProductDetailScreen",
        params: {
          ...formDataWithoutVariants,
          standardShipping: String(currentFormData.standardShipping),
          expressShipping: String(currentFormData.expressShipping),
        } as Record<string, string | number>,
      });
    }
  };

  const handleCategoryPress = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top row: chevron and info icon above heading */}
        <View className="flex-row items-center justify-between mt-4 mb-2">
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/SellerDashboard" })}
            className="p-1"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="w-8 h-8 bg-white items-center justify-center ml-2">
            <Ionicons name="information-circle-outline" size={24} color="#EBB65B" />
          </View>
        </View>
        <Text className="text-Heading2 font-Manrope font-bold text-center mb-8">Add New Product</Text>

        {/* Product Name */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">1. Product Name</Text>
          <TextInput
            value={productName}
            onChangeText={setProductName}
            placeholder='eg. "PlayStation 5 Controller"'
            className="border border-gray-300 px-4 py-3 mb-0 text-sm"
            style={{ height: 60, borderRadius: 12 }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">2. Product Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="eg. “A comfortable and stylish armchair…”"
            multiline
            numberOfLines={4}
            className="border border-gray-300 px-4 py-3 mb-0 text-sm text-gray-800"
            style={{ height: 100, borderRadius: 12 }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Category */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">3. Category</Text>
          <Pressable
            onPress={handleCategoryPress}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-0 flex-row justify-between items-center"
          >
            <Text className="text-sm text-gray-700">
              {category || "Select Category"}
            </Text>
            <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color="#999" />
          </Pressable>
          {showCategoryDropdown && (
            <View className="border border-gray-300 rounded-lg mt-2 bg-white shadow">
              {categoryOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryDropdown(false);
                  }}
                  className={`px-4 py-3 ${category === item ? "bg-secondary" : ""}`}
                >
                  <Text
                    className={`text-sm ${category === item ? "text-white" : "text-gray-800"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Condition */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">4. Condition</Text>
          <Pressable
            onPress={() => setShowConditionDropdown(!showConditionDropdown)}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-0 flex-row justify-between items-center"
          >
            <Text className="text-sm text-gray-700">
              {condition || "Select Condition"}
            </Text>
            <Ionicons name={showConditionDropdown ? "chevron-up" : "chevron-down"} size={20} color="#999" />
          </Pressable>
          {showConditionDropdown && (
            <View className="border border-gray-300 rounded-lg mt-2 bg-white shadow">
              {conditionOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setCondition(item);
                    setShowConditionDropdown(false);
                  }}
                  className={`px-4 py-3 ${condition === item ? "bg-secondary" : ""}`}
                >
                  <Text
                    className={`text-sm ${condition === item ? "text-white" : "text-gray-800"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Weight */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">5. Product Weight (in kg)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="eg. 2.5"
            keyboardType="numeric"
            className="border border-gray-300 px-4 py-3 mb-0 text-sm"
            style={{ height: 60, borderRadius: 12 }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Shipping */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">6. Shipping Method</Text>
          <Text className="text-xs mb-2" style={{ color: '#9e9e9e' }}>
            Which Swift Mall shipping options are supported for this product?
          </Text>
          <View className="flex-row items-center mb-2">
            <Pressable
              onPress={() => setStandardShipping(!standardShipping)}
              className="flex-row items-center"
            >
          <View className={`w-6 h-6 rounded border-2 items-center justify-center ${standardShipping ? 'bg-secondary border-secondary' : 'bg-white border-gray-400'}`}>
            {standardShipping && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
              <Text className="ml-2 text-[16px] font-bold" style={{ color: '#404040' }}>
                Standard Shipping (5-10 days)
              </Text>
            </Pressable>
          </View>
          <View className="flex-row items-center mb-2">
            <Pressable
              onPress={() => setExpressShipping(!expressShipping)}
              className="flex-row items-center"
            >
          <View className={`w-6 h-6 rounded border-2 items-center justify-center ${expressShipping ? 'bg-secondary border-secondary' : 'bg-white border-gray-400'}`}>
            {expressShipping && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
              <Text className="ml-2 text-[16px] font-bold" style={{ color: '#404040' }}>
                Express Shipping (2-5 days)
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Price */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">7. Price</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="eg. $230"
            keyboardType="numeric"
            className="border border-gray-300 px-4 py-3 mb-0 text-sm"
            style={{ height: 60, borderRadius: 12 }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Add Variants - Radio Buttons */}
        <View className="mb-6">
          <Text className="font-bold text-[18px] text-[#404040] mb-3">8. Do you want to add variants(eg. color, size)?</Text>
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setAddVariants(true)}
              className="flex-row items-center mr-6"
            >
          <View className={`w-6 h-6 rounded border-2 items-center justify-center ${addVariants ? 'bg-secondary border-secondary' : 'bg-white border-gray-400'}`}>
            {addVariants && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
              <Text className="ml-2 text-[16px] font-bold" style={{ color: '#404040' }}>
                Yes
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAddVariants(false)}
              className="flex-row items-center"
            >
          <View className={`w-6 h-6 rounded border-2 items-center justify-center ${!addVariants ? 'bg-secondary border-secondary' : 'bg-white border-gray-400'}`}>
            {!addVariants && <Ionicons name="checkmark" size={18} color="#fff" />}
          </View>
              <Text className="ml-2 text-[16px] font-bold" style={{ color: '#404040' }}>
                No
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Next Button */}
        <PrimaryButton
          BtnText="Next"
          onPress={handleNext}
          color="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;