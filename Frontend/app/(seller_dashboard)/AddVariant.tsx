// Addvariant.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the structure of a single variant
interface ProductVariant {
  id: string;
  color: string;
  // New structure for size: an object to hold type and value
  size: {
    type: string; // e.g., "Standard", "Numeric", "Custom"
    value: string; // e.g., "M", "36", "XL-Tall"
  };
  stock: string;
}

// Define the interface for the product data passed from the previous screen
interface ProductDataFromParams {
  productName: string;
  description: string;
  category: string;
  condition: string;
  weight: string;
  price: string;
  standardShipping: string;
  expressShipping: string;
  addVariants: string;
}

const Addvariant: React.FC = () => {
  const router = useRouter();
  const productData = useLocalSearchParams() as unknown as ProductDataFromParams;

  const [colorVariantsEnabled, setColorVariantsEnabled] = useState<boolean>(false);
  const [sizeVariantsEnabled, setSizeVariantsEnabled] = useState<boolean>(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Dummy data for color dropdown
  const colorOptions: string[] = ["Red", "Blue", "Green", "Black", "White"];
  // Size Type options as per "side variant.jpg"
  const sizeTypeOptions: string[] = ["Standard (S, M, L...)", "Numeric (eg. 39, 40, 41...)", "Custom"];

  // Dummy data for actual sizes based on type selection
  const standardSizes: string[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const numericSizes: string[] = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  // State to manage which specific dropdown is open for each variant
  // This will store { variantId: 'color' | 'sizeType' | 'sizeValue' }
  const [activeDropdown, setActiveDropdown] = useState<{ id: string; type: 'color' | 'sizeType' | 'sizeValue' } | null>(null);
  // State for selected size type
  const [selectedSizeType, setSelectedSizeType] = useState<string>("");

  useEffect(() => {
    // Add one empty variant field by default if variants are enabled and none exist
    if ((colorVariantsEnabled || sizeVariantsEnabled) && variants.length === 0) {
      addEmptyVariant();
    } else if (!colorVariantsEnabled && !sizeVariantsEnabled && variants.length > 0) {
      // Clear variants if both toggles are off
      setVariants([]);
    }
  }, [colorVariantsEnabled, sizeVariantsEnabled]);

  // Add one empty variant field
  const addEmptyVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        color: "",
        size: { type: "", value: "" },
        stock: ""
      }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
          <Text className="font-bold text-[18px] text-[#404040] mb-3">9. Product Variants</Text>
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[16px] font-bold text-[#404040]">Color Variants</Text>
              <Switch
                value={colorVariantsEnabled}
                onValueChange={setColorVariantsEnabled}
                trackColor={{ false: '#eee', true: '#EBB65B' }}
                thumbColor={'#fff'}
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginRight: 8, marginLeft: 8 }}
              />
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[16px] font-bold text-[#404040]">Size Variants</Text>
              <Switch
                value={sizeVariantsEnabled}
                onValueChange={setSizeVariantsEnabled}
                trackColor={{ false: '#eee', true: '#EBB65B' }}
                thumbColor={'#fff'}
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginRight: 8, marginLeft: 8 }}
              />
            </View>
          </View>
          {/* Size Type dropdown above variant rows if sizeVariantsEnabled */}
          {sizeVariantsEnabled && (
            <View style={{ marginBottom: 16 }}>
              <Text className="text-[14px] text-[#404040] mb-1">Size Type</Text>
              <Pressable
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fafafa', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onPress={() => setActiveDropdown({ id: 'sizeType', type: 'sizeType' })}
              >
                <Text style={{ color: selectedSizeType ? '#404040' : '#999', fontSize: 16 }}>
                  {selectedSizeType || 'Select Size Type'}
                </Text>
                <Ionicons name={activeDropdown?.type === 'sizeType' ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
              </Pressable>
              {/* Dropdown options */}
              {activeDropdown?.type === 'sizeType' && (
                <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 12, backgroundColor: '#fff', marginTop: 4 }}>
                  {sizeTypeOptions.map((type) => (
                    <Pressable key={type} onPress={() => { setSelectedSizeType(type); setActiveDropdown(null); }} style={{ padding: 12, backgroundColor: selectedSizeType === type ? '#EBB65B' : '#fff' }}>
                      <Text style={{ color: selectedSizeType === type ? '#fff' : '#404040', fontSize: 16 }}>{type}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}
          {/* Show all variant input rows */}
          {(colorVariantsEnabled || sizeVariantsEnabled) && variants.map((variant, idx) => (
            <View key={variant.id}>
              <View className="flex-row items-center justify-between mb-4">
                {/* Color input */}
                {colorVariantsEnabled && (
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text className="text-[14px] text-[#404040] mb-1">Color</Text>
                    <TextInput
                      value={variant.color}
                      onChangeText={(text) => {
                        const updated = [...variants];
                        updated[idx].color = text;
                        setVariants(updated);
                      }}
                      placeholder={colorVariantsEnabled ? "Enter color" : "Select Color"}
                      className="border border-gray-300 px-4 py-3 text-sm"
                      style={{ borderRadius: 12 }}
                      editable={colorVariantsEnabled}
                      placeholderTextColor="#999"
                    />
                  </View>
                )}
                {/* Size input dropdown */}
                {sizeVariantsEnabled && (
                  <View style={{ flex: 1, marginHorizontal: colorVariantsEnabled ? 8 : 0 }}>
                    <Text className="text-[14px] text-[#404040] mb-1">Size</Text>
                    <Pressable
                      style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fafafa', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                      onPress={() => setActiveDropdown({ id: variant.id, type: 'sizeValue' })}
                    >
                      <Text style={{ color: variant.size.value ? '#404040' : '#999', fontSize: 16 }}>
                        {variant.size.value || 'Select Size'}
                      </Text>
                      <Ionicons name={activeDropdown?.id === variant.id && activeDropdown?.type === 'sizeValue' ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
                    </Pressable>
                    {/* Dropdown options for size value */}
                    {activeDropdown?.id === variant.id && activeDropdown?.type === 'sizeValue' && (
                      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 12, backgroundColor: '#fff', marginTop: 4 }}>
                        {(selectedSizeType === 'Standard (S, M, L...)' ? standardSizes : selectedSizeType === 'Numeric (eg. 39, 40, 41...)' ? numericSizes : []).map((size) => (
                          <Pressable key={size} onPress={() => {
                            const updated = [...variants];
                            updated[idx].size.value = size;
                            setVariants(updated);
                            setActiveDropdown(null);
                          }} style={{ padding: 12, backgroundColor: variant.size.value === size ? '#EBB65B' : '#fff' }}>
                            <Text style={{ color: variant.size.value === size ? '#fff' : '#404040', fontSize: 16 }}>{size}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                )}
                {/* Stock input */}
                <View style={{ flex: 1, marginLeft: sizeVariantsEnabled ? 8 : (colorVariantsEnabled ? 8 : 0) }}>
                  <Text className="text-[14px] text-[#404040] mb-1">Stock</Text>
                  <TextInput
                    value={variant.stock}
                    onChangeText={(text) => {
                      const updated = [...variants];
                      updated[idx].stock = text;
                      setVariants(updated);
                    }}
                    placeholder="Enter qty in stock"
                    className="border border-gray-300 px-4 py-3 text-sm"
                    style={{ borderRadius: 12 }}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>
          ))}
          {/* Only one delete icon below the last input fields */}
          {variants.length > 0 && (
            <View className="items-center mb-4">
              <Pressable
                onPress={() => {
                  setVariants((prev) => prev.slice(0, -1));
                }}
                style={{ width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#EBB65B', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="trash-outline" size={28} color="#EBB65B" />
              </Pressable>
            </View>
          )}
          {/* Add Variant button - outlined style */}
          <View className="mb-8 items-center justify-center">
            <Pressable
              onPress={addEmptyVariant}
              disabled={!(colorVariantsEnabled || sizeVariantsEnabled)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#EBB65B',
                borderRadius: 8,
                height: 48,
                width: '100%'
                ,backgroundColor: '#fff',
                opacity: (colorVariantsEnabled || sizeVariantsEnabled) ? 1 : 0.5,
              }}
            >
              <Ionicons name="add" size={20} color="#EBB65B" style={{ marginRight: 8 }} />
              <Text className="text-[16px] font-bold" style={{ color: '#EBB65B' }}>Add Variant</Text>
            </Pressable>
          </View>
        </ScrollView>
        {/* Next button fixed at the absolute bottom */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff' }}>
          <PrimaryButton
            BtnText="Next"
            onPress={() => {
              if (variants.length > 0) {
                // If variants exist, go to AddProductDetailScreen with only image and publish fields
                router.push({ pathname: "/AddProductDetailScreen", params: { ...productData, showStock: "false", showImage: "true", variants: JSON.stringify(variants) } });
              } else {
                // If no variants, go to AddProductDetailScreen with stock and image fields
                router.push({ pathname: "/AddProductDetailScreen", params: { ...productData, showStock: "true", showImage: "true" } });
              }
            }}
            color="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
export default Addvariant;