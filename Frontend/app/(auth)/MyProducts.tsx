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
  View,
} from "react-native";


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
 image: erekoImage, // Using the imported local image
 },
 {
 id: 2,
 name: "EKERÖ",
 price: 230,
 category: "Home & Living",
 stock: 9,
 status: "Low Stock",
 image: erekoImage, // Using the imported local image
 },
 {
 id: 3,
 name: "EKERÖ",
 price: 230,
 category: "Home & Living",
 stock: 0,
 status: "Out of Stock",
 image: erekoImage, // Using the imported local image
 },
];


export default function MyProducts() {
 const router = useRouter();
 const [activeFilter, setActiveFilter] = useState("All Products");
 const [search, setSearch] = useState("");


 const getStatusColor = (status: string) => {
 switch (status) {
 case "Active":
 return "text-green-600 bg-green-100";
 case "Low Stock":
 return "text-yellow-600 bg-yellow-100";
 case "Out of Stock":
 return "text-red-600 bg-red-100";
 default:
 return "text-gray-600 bg-gray-200";
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
 className="flex-1 bg-white"
 style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
 >
 <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
 {/* Header with Back Arrow and Title */}
 <View
 className="flex-row items-center justify-center mb-4 relative py-3"
 style={{ backgroundColor: '#F9F9F9', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}
 >
 <Pressable onPress={() => router.back()} className="absolute left-4 p-2">
 <Ionicons name="arrow-back" size={24} color="black" />
 </Pressable>
 <Text className="text-xl font-bold">My Products</Text>
 <View className="w-10"></View> {/* Spacer to balance title */}
 </View>


 {/* Search Bar */}
 <View className="flex-row items-center bg-yellow-100 rounded-full px-4 py-2 mb-4">
 <Ionicons name="search" size={18} color="#888" />
 <TextInput
 placeholder="Search products..."
 value={search}
 onChangeText={setSearch}
 className="ml-2 flex-1 text-gray-700"
 placeholderTextColor="#999"
 />
 </View>


 {/* Filter Chips */}
 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
 <View className="flex-row gap-2">
 {FILTERS.map((filter) => (
 <Pressable
 key={filter}
 className={`px-4 py-1 rounded-full ${
 activeFilter === filter ? "bg-yellow-300" : "bg-gray-200"
 }`}
 onPress={() => setActiveFilter(filter)}
 >
 <Text
 className={`text-sm ${
 activeFilter === filter
 ? "text-gray-800 font-bold"
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
 {filteredProducts.length > 0 ? (
 filteredProducts.map((product) => (
 <View
 key={product.id}
 className="bg-white p-4 mb-4 rounded-2xl border border-gray-200 shadow-sm"
 >
 <View className="flex-row gap-4">
 <Image
 source={product.image} // Now using require() for local image
 className="w-24 h-24 rounded-xl"
 onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
 />
 <View className="flex-1 justify-between">
 <View className="flex-row justify-between">
 <Text className="font-semibold text-gray-800">{product.name}</Text>
 <Text
 className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
 product.status
 )}`}
 >
 {product.status}
 </Text>
 </View>
 <Text className="text-gray-700 mt-1">${product.price.toFixed(2)}</Text>
 <Text className="text-sm text-gray-500">{product.category}</Text>
 <Text className="text-sm text-gray-500">Stock: {product.stock}</Text>
 </View>
 </View>


 {/* Edit Button */}
 <Pressable className="mt-4 w-full py-2 rounded-xl border border-yellow-400 items-center">
 <View className="flex-row items-center gap-2">
 <Ionicons name="pencil-outline" size={16} color="#D97706" />
 <Text className="text-yellow-700 font-medium">Edit</Text>
 </View>
 </Pressable>
 </View>
 ))
 ) : (
 <Text className="text-center text-gray-500 mt-10">No products found for this filter.</Text>
 )}
 </ScrollView>
 </SafeAreaView>
 );
}