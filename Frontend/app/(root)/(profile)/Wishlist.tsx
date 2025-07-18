import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import ProductCard from "@/components/ProductCard";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white font-Manrope">
      <View className="px-4 pt-6 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.replace('/(root)/(tabs)/Profile')} className="mr-2">
          <Feather name="chevron-left" size={28} color="#404040" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">Wishlist</Text>
        <Feather name="heart" size={28} color="#EB1A1A" />
      </View>
      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Feather name="heart" size={64} color="#EB1A1A" style={{ opacity: 0.2 }} />
          <Text className="text-BodyBold text-neutral-60 mt-4">Your wishlist is empty.</Text>
          <Text className="text-BodySmallRegular text-neutral-40 mt-2 text-center px-8">Browse products and tap the heart icon to add them to your wishlist.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-2" contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="flex-row flex-wrap justify-between gap-y-4 mt-2">
            {wishlist.map((product) => (
              <View key={product.id} className="w-[48%] relative">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: '/(root)/(Home)/ProductDetail', params: { productId: product.id } })}
                >
                  <ProductCard {...product} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1"
                  onPress={() => removeFromWishlist(product.id)}
                  style={{ elevation: 2 }}
                >
                  <Feather name="x" size={18} color="#EB1A1A" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Wishlist; 