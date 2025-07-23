import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/Button";


// Import the local image
const erekoImage = require('../../assets/images/Ereko.png'); // Adjust the path if your folder structure is different


const FILTERS = ["All Products", "Active", "Out of Stock", "Archive"];


// Dummy products data with the local image
const products = [
 {
   id: 1,
   name: "EKERÖ",
   price: 230,
   category: "Home & Living",
   stock: 35,
   status: "Active",
   image: erekoImage,
 },
 {
   id: 2,
   name: "EKERÖ",
   price: 230,
   category: "Home & Living",
   stock: 9,
   status: "Low Stock",
   image: erekoImage,
 },
 {
   id: 3,
   name: "EKERÖ",
   price: 230,
   category: "Home & Living",
   stock: 0,
   status: "Out of Stock",
   image: erekoImage,
 },
 {
   id: 4,
   name: "EKERÖ",
   price: 230,
   category: "Home & Living",
   stock: 0,
   status: "Archive",
   image: erekoImage,
 },
];


export default function MyProducts() {
 const router = useRouter();
 const [activeFilter, setActiveFilter] = useState("All Products");
 const [search, setSearch] = useState("");


const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-primary/10 text-primary border border-primary";
    case "Low Stock":
      return "bg-secondary/10 text-secondary border border-secondary";
    case "Out of Stock":
      return "bg-alert/10 text-alert border border-alert";
    case "Archive":
      return "bg-gray-300 text-gray-700 border border-gray-400";
    default:
      return "bg-gray-200 text-gray-600 border border-gray-300";
  }
};


 const filteredProducts = products.filter((product) => {
 const matchesFilter =
 activeFilter === "All Products" || product.status === activeFilter;


 const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
 product.category.toLowerCase().includes(search.toLowerCase());


 return matchesFilter && matchesSearch;
 });


return (
  <SafeAreaView
    className={`flex-1 bg-white ${Platform.OS === 'android' ? 'pt-[' + (StatusBar.currentHeight || 0) + 'px]' : ''}`}
  >
    <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
      <View className="flex flex-col gap-6">
        {/* Header with Back Arrow and Title */}
        <View className="flex-row items-center justify-center relative py-4">
         
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/SellerDashboard" })}
          style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
          <Text className="text-Heading2 font-Manrope text-text text-center flex-1">My Products</Text>
          <View className="w-8" /> {/* Spacer to balance title */}
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-secondary/10 rounded-3xl px-4" style={{ height: 42 }}>
          <Ionicons name="search" size={20} color="#156651" className="text-primary" />
          <TextInput
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            className="ml-2 flex-1 text-[18px] text-text"
            placeholderTextColor="#757575"
            style={{ fontSize: 18 }}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {FILTERS.map((filter) => (
              <Pressable
                key={filter}
                className={`px-4 py-1 rounded-[16px] h-[32px] flex-row items-center justify-center border shadow-zinc-600 ${
                  activeFilter === filter
                    ? "bg-secondary border-secondary"
                    : "bg-gray-100 border-gray-200"
                }`}
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 }}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  className={`text-sm ${
                    activeFilter === filter
                      ? "text-white font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Product Cards */}
        <View className="flex flex-col gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <View
                key={product.id}
                className="bg-white p-4 rounded-2xl shadow-sm"
              >
                <View className="flex-row gap-4">
                  <Image
                    source={product.image}
                    className="w-24 h-24 rounded-xl"
                    onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                  />
                  <View className="flex-1 justify-between">
                    <View className="flex-row justify-between">
                      <Text className="font-semibold text-gray-800">{product.name}</Text>
                      <Text
                        className={`px-2 py-0.5 text-xs min-w-[80px] text-center rounded-[4px] ${getStatusColor(product.status)}`}
                      >
                        {product.status}
                      </Text>
                    </View>
                    <Text className="text-gray-700 mt-1">${product.price.toFixed(2)}</Text>
                    <Text className="text-sm text-gray-500">{product.category}</Text>
                    <Text className="text-sm text-gray-500">Stock: {product.stock}</Text>
                  </View>
                </View>

                {/* Edit Button for all cards */}
                <View className="mt-4">
                  <Pressable
                    className="flex-row items-center justify-center border border-secondary rounded-lg bg-white h-[48px]"
                    style={{ minHeight: 48 }}
                    onPress={() => {
                      router.push({
                        pathname: '/AddProductScreen',
                        params: {
                          productName: product.name,
                          price: product.price,
                          category: product.category,
                          stock: product.stock,
                          status: product.status,
                        },
                      });
                    }}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#E6B15C" style={{ marginRight: 8 }} />
                    <Text className="text-secondary font-bold text-base" style={{ fontWeight: 'bold' }}>Edit</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-10">No products found for this filter.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
 );
}