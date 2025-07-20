import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProductCard from "@/components/ProductCard"; // Import ProductCard
import productData from "@/constants/productData"; // Import product data
import type { Product } from "@/constants/productData"; // Import Product type
import { useSearchContext } from "@/components/SearchContext";
import SearchLabel from "@/components/searchLabel";
import { useRouter } from "expo-router"; // Import the router
import { SafeAreaView } from "react-native-safe-area-context";


const popularSearches = [
  {
    name: "Women's Loose Casual Denim Jeans With Pockets",
    image: require("@/assets/images/jeans.jpg"),
    label: "Hot",
    color: "#EB1A1A",
  },
  {
    name: "Apple iPad Air",
    image: require("@/assets/images/ipad.jpg"),
    label: "Popular",
    color: "#E96411",
  },
  {
    name: "Minimalist LED Wall Lamps Nordic Style Indoor Lighting Sconce For Bedroom",
    image: require("@/assets/images/lamp.jpg"),
    label: "New",
    color: "secondary",
  },
  {
    name: "Adjustable Dumbbell",
    image: require("@/assets/images/dumbell.jpg"),
    label: "New",
    color: "secondary",
  },
]; // Predefined list of popular searches

const labelColors = {
  Hot: {
    bgColor: "#FD868663",
    textColor: "#EB1A1A",
    borderColor: "#FF5353",
  },
  Popular: {
    bgColor: "#FEA6664F",
    textColor: "#E96411",
    borderColor: "#FF9216",
  },
  New: {
    bgColor: "#EBB65B66",
    textColor: "#EBB65B",
    borderColor: "#EBB65B",
  },
}; // Define colors for each label type

const Search = () => {
  const [searchInput, setSearchInput] = useState<string>(""); // State for the search input
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State for filtered products
  const searchInputRef = useRef<TextInput>(null); // Ref for the search bar
  const { lastSearches, addSearch, clearSearches, removeSearch } =
    useSearchContext(); // Access context methods
  const router = useRouter(); // Initialize the router

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchInput.trim() !== "") {
      addSearch(searchInput.trim()); // Add search to last searches in context
      router.push({
        pathname: "/FilteredProducts",
        params: { searchQuery: searchInput.trim() }, // Pass the search query as a parameter
      });
    }
  };

  // Handle tapping on a popular search
  const handlePopularSearch = (search: string) => {
    setSearchInput(search); // Set the search input to the tapped popular search
    if (searchInputRef.current) {
      searchInputRef.current.focus(); // Focus the search bar
    }

    // Filter products based on the popular search
    const filtered = productData.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered); // Update the filtered products state
  };

  return (
        <SafeAreaView className="font-Manrope  bg-white flex-1">
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 font-Manrope bg-white px-4 py-6">
        {/* Search Bar */}
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-row gap-[10px] items-center flex-1 h-[48px] rounded-full px-4 bg-[#F4EDD8]/50">
            <Feather name="search" size={18} color="#156651" />
            <TextInput
              ref={searchInputRef} // Attach the ref to the search bar
              className="flex-1 text-text text-Heading5"
              placeholder="Search"
              placeholderTextColor={"#88939E"}
              selectionColor="#404040"
              value={searchInput}
              onChangeText={setSearchInput} // Update the search input state
              onSubmitEditing={handleSearchSubmit} // Route to FilteredProducts on submission
              returnKeyType="search" // Change the return button to "Search"
            />
          </View>
          <Pressable className="w-[50px] h-[50px] border border-neutral-50 rounded-full items-center justify-center">
            <Feather name="camera" size={20} color="#404040" />
          </Pressable>
        </View>
        <ScrollView>
        {/* Last Search Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-Heading4 text-text">Last Search</Text>
            <TouchableOpacity onPress={clearSearches}>
              <Text className="text-BodySmallBold text-primary">Clear All</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-[10px]">
            {lastSearches.length > 0 ? (
              lastSearches.map((search: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row max-w-[150px] items-center gap-[10px] border px-[10px] py-[8px] rounded-[10px]"
                  onPress={() => setSearchInput(search)} // Focus search bar when tapped
                >
                  <Text
                    style={{ marginRight: 20 }}
                    className="text-Caption text-text"
                    numberOfLines={1}
                  >
                    {search}
                  </Text>
                  <TouchableOpacity
                    className="absolute right-0"
                    onPress={() => removeSearch(search)}
                  >
                    <Ionicons name="close-outline" size={24} color="black" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-BodySmallBold text-gray-500">
                No recent searches.
              </Text>
            )}
          </View>
        </View>

        {/* Popular Searches Section */}
        <View>
          <Text className="text-Heading4 text-text mb-4">Popular Searches</Text>
          <View className="gap-8">
            {popularSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-4"
                onPress={() => handlePopularSearch(search.name)} // Handle tapping on a popular search
              >
                <View className="w-[75px] h-[75px] rounded-[20px] overflow-hidden">
                  <Image
                    source={search.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-row flex-1 items-center justify-between">
                  <Text className="text-BodyRegular max-w-[170px] text-center flex-1 text-text">
                    {search.name}
                  </Text>
                  {search.label && (
                    <SearchLabel
                      name={search.label}
                      bgColor={
                        labelColors[search.label as keyof typeof labelColors]
                          ?.bgColor || "#FFFFFF"
                      }
                      textColor={
                        labelColors[search.label as keyof typeof labelColors]
                          ?.textColor || "#000000"
                      }
                      borderColor={
                        labelColors[search.label as keyof typeof labelColors]
                          ?.borderColor || "#000000"
                      }
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </ScrollView>

      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Search;
