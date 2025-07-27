import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ProductCard from "@/components/ProductCard";
import productData from "@/constants/productData";
import { categories } from "@/constants/categories";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PrimaryButton from "@/components/PrimaryButton";
import Button from "@/components/Button";
import { fetchProducts, fetchProductsByCategoryId, fetchProductsBySearch } from "@/app/api/productApi";





const FilteredProducts = () => {
  const router = useRouter();
  const { categoryId, categoryName, searchQuery, specialOffers } = useLocalSearchParams();
  const normalizedSearchQuery = Array.isArray(searchQuery)
    ? searchQuery.join(" ")
    : searchQuery;
  const [searchInput, setSearchInput] = useState(normalizedSearchQuery || "");
  const [submittedQuery, setSubmittedQuery] = useState(normalizedSearchQuery || "");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Temporary filter state (used while the modal is open)
  const [tempPriceRange, setTempPriceRange] = useState([0, Infinity]);
  const [tempSelectedColor, setTempSelectedColor] = useState("");

  // Applied filter state (used to filter products after clicking "Apply Filter")
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, Infinity]);
  const [appliedSelectedColor, setAppliedSelectedColor] = useState("");

  const categoryMap: Record<string, number> = {
    "Electronics & Devices": 1,
    "Sports & Fitness": 2,
    "Computer & Accessories": 3,
    "Beauty & Personal Care": 4,
    "Office & Stationery": 5,
    "Home & Living": 6,
    "Fashion": 7,
    "Automotive & Tools": 8,
    "Groceries & Essentials": 9,
    "Kids & Toys": 10,
  };

  const getCategoryNameById = (id: number) => {
    const cat = Object.entries(categoryMap).find(([name, cid]) => cid === id);
    return cat ? cat[0] : undefined;
  };

  // Using the improved API client from productApi.ts

  // Fetch products from backend based on filter
  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let data = [];
        if (specialOffers === "true") {
          data = await fetchProducts(0, 100);
          data = data.filter((p: any) => p.discount && Number(p.discount) > 0);
        } else if (categoryId) {
          data = await fetchProductsByCategoryId(Number(categoryId));
        } else if (searchQuery && typeof searchQuery === 'string') {
          data = await fetchProductsBySearch(searchQuery);
        } else {
          data = await fetchProducts(0, 100);
        }
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId, searchQuery, specialOffers]);





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
    setIsFilterModalVisible(false);
    Animated.timing(panY, {
      toValue: 500,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      panY.setValue(0);
    });
  };

  const applyFilters = () => {
    setAppliedPriceRange(tempPriceRange); // Apply the temporary price range
    setAppliedSelectedColor(tempSelectedColor); // Apply the temporary selected color
    closeModal(); // Close the modal
  };

  const resetFilters = () => {
    setTempPriceRange([0, Infinity]); // Reset price range to cover all
    setTempSelectedColor(""); // Reset selected color
    setAppliedPriceRange([0, Infinity]); // Immediately apply the reset price range
    setAppliedSelectedColor(""); // Immediately apply the reset color
  };

  // Further filter products based on the submitted query and applied filters
  const searchedProducts = products.filter((product) => {
    const matchesQuery = product.name
      .toLowerCase()
      .includes(
        typeof submittedQuery === "string" ? submittedQuery.toLowerCase() : ""
      );
    const matchesPrice =
      parseFloat(product.price) >= appliedPriceRange[0] &&
      parseFloat(product.price) <= appliedPriceRange[1];
    const matchesColor = appliedSelectedColor
      ? product.variants?.some((variant: any) => variant.color === appliedSelectedColor) || false
      : true;
    return matchesQuery && matchesPrice && matchesColor;
  });

  // Handle search submission
  const handleSearchSubmit = () => {
    setSubmittedQuery(searchInput); // Update the submitted query
  };

  // Get the page title based on the filter type
  const getPageTitle = () => {
    if (specialOffers === "true") {
      return "Special Offers";
    } else if (categoryId) {
      return categoryNameFromId;
    } else if (categoryName) {
      return categoryName;
    } else {
      return "All Products";
    }
  };

  // Get the search placeholder based on the filter type
  const getSearchPlaceholder = () => {
    if (specialOffers === "true") {
      return "Search special offers";
    } else if (categoryName) {
      return `Search within ${categoryName}`;
    } else {
      return "Search products";
    }
  };

  const categoryNameFromId = categoryId ? getCategoryNameById(Number(categoryId)) : undefined;

  return (
    <SafeAreaView className="font-Manrope bg-white gap-4 flex-1">
      {/* Header */}
      <View className="flex-row items-center mx-4 justify-between">
        <Pressable
          className="flex-row items-center gap-1"
          onPress={() => router.back()}
        >
          <Entypo name="chevron-left" size={24} color="black" />
          <Text className="text-BodyRegular text-primary font-Manrope">Back</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="flex-row mx-4 items-center gap-4">
        <View className="flex-row gap-[10px] items-center flex-1 h-[48px] rounded-full px-4 bg-[#F4EDD8]/50">
          <Feather name="search" size={18} color="#156651" />
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput} // Update search input state
            onSubmitEditing={handleSearchSubmit} // Trigger search on "Return" or "Search"
            className="flex-1 text-text text-Heading5"
            placeholder={getSearchPlaceholder()}
            placeholderTextColor={"#88939E"}
            selectionColor="#404040"
            returnKeyType="search" // Set the keyboard button to "Search"
          />
          <TouchableOpacity
            onPress={() => {
              setIsFilterModalVisible(true);
              setTempSelectedColor(""); // Reset the selected color
            }}
          >
            <Feather name="sliders" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Pressable className="w-[50px] h-[50px] border border-neutral-50 rounded-full items-center justify-center">
          <Feather name="camera" size={20} color="#404040" />
        </Pressable>
      </View>

      {/* Category Header */}
      <View className="px-4">
        {(categoryId || specialOffers === "true") ? (
          <View className="relative h-[132px] w-full rounded-[14px] overflow-hidden">
            <ImageBackground
              source={
                specialOffers === "true"
                  ? require("@/assets/images/carousel1.png")
                  : categories.find(
                      (category: { name: string; image: any }) =>
                        category.name === categoryNameFromId
                    )?.image
              }
              className="w-full h-full"
              resizeMode="cover"
            >
              <View className="bg-black/20 absolute h-full w-full" />
              <View className="absolute h-full py-5 items-center w-full">
                <Text className="text-neutral-10 text-Heading3 font-bold text-center">
                  {getPageTitle()}
                </Text>
              </View>
            </ImageBackground>
          </View>
        ) : (
          // All Products case: show default image and text
          <View className="relative h-[132px] w-full rounded-[14px] overflow-hidden">
            <ImageBackground
              source={require("@/assets/images/carousel1.png")}
              className="w-full h-full"
              resizeMode="cover"
            >
              <View className="bg-black/20 absolute h-full w-full" />
              <View className="absolute h-full py-5 items-center w-full">
                <Text className="text-neutral-10 text-Heading3 font-bold text-center">
                  All Products
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end bg-black/50"
          >
            <Animated.View
              className="bg-white gap-6 rounded-t-[32px] px-4 pt-6 pb-[36px]"
              style={{
                transform: [{ translateY: panY }],
              }}
              {...panResponder.panHandlers}
            >
              {/* Rectangle for Sliding */}
              <View className="w-[100px] h-[5px] rounded-full bg-black/15 self-center " />

              <Text className="text-Heading3 text-text text-center ">
                Filter By
              </Text>
              {/* Price Range */}
              <View className=" gap-4">
                <Text className="text-BodyBold text-text">Price Range</Text>
                <View className="flex-row gap-4 items-center">
                  {/* Minimum Price Input */}
                  <View className="flex-1 flex-col gap-1 h-[72px]">
                    <Text className="text-primary  text-BodySmallRegular">
                      Min
                    </Text>
                    <TextInput
                      value={tempPriceRange[0].toString()}
                      onChangeText={(value) => {
                        const parsedValue = parseFloat(value);
                        setTempPriceRange([
                          isNaN(parsedValue) ? 0 : parsedValue,
                          tempPriceRange[1],
                        ]);
                      }}
                      keyboardType="numeric"
                      placeholder="Min Price"
                      className="flex-1 h-[48px] rounded-[12px] px-4 border border-gray-300"
                    />
                  </View>
                  {/* Maximum Price Input */}
                  <View className="flex-1 flex-col gap-1 h-[72px]">
                    <Text className="text-primary  text-BodySmallRegular">
                      Max
                    </Text>
                    <TextInput
                      value={tempPriceRange[1].toString()}
                      onChangeText={(value) => {
                        const parsedValue = parseFloat(value);
                        setTempPriceRange([
                          tempPriceRange[0],
                          isNaN(parsedValue) ? 0 : parsedValue,
                        ]);
                      }}
                      keyboardType="numeric"
                      placeholder="Max Price"
                      className="flex-1 h-[48px] rounded-[12px] px-4 border border-gray-300"
                    />
                  </View>
                </View>
              </View>
              {/* Color Filter */}
              <View className="gap-4">
                <Text className="text-BodyBold text-text">Color</Text>
                <View className="flex-row gap-2">
                  {[
                    "black",
                    "yellow",
                    "pink",
                    "white",
                    "green",
                    "red",
                    "blue",
                    "gray",
                  ].map((color) => (
                    <View className="items-center justify-center " key={color}>
                      <TouchableOpacity
                        className={`w-[32px] h-[32px] rounded-full border ${
                          tempSelectedColor === color
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onPress={() => setTempSelectedColor(color)}
                      />
                      {tempSelectedColor === color ? (
                        <Feather
                          className="absolute"
                          name="check"
                          size={24}
                          color="#156651"
                        />
                      ) : (
                        <View />
                      )}
                    </View>
                  ))}
                </View>
              </View>
              <View className="gap-2">
                {/* Apply Filter Button */}
                <View className="mt-[24px]">
                  <PrimaryButton
                    BtnText="Apply Filter"
                    onPress={applyFilters}
                  />
                </View>
                {/* Reset Button */}
                <View className="">
                  <Button
                    BtnText="Remove Filters"
                    onPress={resetFilters}
                    bgColor="#ffffff"
                    textColor="text-primary"
                    hasBorder={true}
                  />
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Filtered Products */}
      <View className="flex-1 overflow-hidden px-4">
        <ScrollView
          className="flex-1 overflow-visible pt-4"
          contentContainerStyle={{
            paddingBottom: 16,
            gap: 16,
          }}
        >
          <View className="gap-4 overflow-visible">
            {searchedProducts.length > 0 ? (
              <View className="flex-row flex-wrap overflow-visible justify-between gap-y-4">
                {searchedProducts.map((product) => (
                  <View key={product.id} className="w-[48%]">
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push({ pathname: '/(root)/(Home)/ProductDetail', params: { productId: product.id } })}>
                      <ProductCard
                        image={product.productImage}
                        name={product.name}
                        price={parseFloat(product.price)}
                        originalPrice={parseFloat(product.originalPrice)}
                        discount={product.discount ? parseFloat(product.discount) : undefined}
                        rating={product.rating}
                        width={""}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-BodySmallBold text-center text-gray-500">
                No products found. Please refine your search.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FilteredProducts;
