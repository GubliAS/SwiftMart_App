// PromotionDetails.tsx
// This screen shows details for a specific promotion, including joined products and sales.
// The seller can remove products from the promo or remove the promo entirely.

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import productData from "@/constants/productData";
import { usePromo } from "@/context/PromoContext";
import SecondaryButton from "@/components/SecondaryButton";

// Mock promo data list (reuse from AddProductsToPromotion)
const mockPromos = [
  {
    id: "1",
    name: "Black Friday Sale",
    discount: 35,
    description: "35% OFF selected goods",
    date: "Nov 28 - Dec 01, 2025",
  },
  {
    id: "2",
    name: "Summer Sale",
    discount: 20,
    description: "20% OFF all Furniture",
    date: "Jul 10 - Jul 20, 2025",
  },
  {
    id: "3",
    name: "Special Offers",
    discount: 35,
    description: "35% OFF selected goods",
    date: "Aug 01 - Aug 10, 2025",
  },
];

const PromotionDetails = () => {
  const { promoId } = useLocalSearchParams();
  const promo = mockPromos.find(p => p.id === promoId) || mockPromos[0];

  const { joinedPromos, setJoinedPromos }: { joinedPromos: any[]; setJoinedPromos: React.Dispatch<any[]> } = usePromo() || { joinedPromos: [], setJoinedPromos: () => {} };
  // Get products for this promo from context
  const joinedPromo = joinedPromos.find((jp: any) => jp.promoId === promo.id);
  const promoProducts = joinedPromo ? joinedPromo.products : [];
  const [removeModal, setRemoveModal] = useState<{ open: boolean, productId: number | null }>({ open: false, productId: null });

  // Calculate total sales (mocked as sum of promoPrice for now)
  const totalSales = promoProducts.reduce((sum, p) => sum + (Number(p.promoPrice) || 0), 0).toFixed(2);

  const handleRemove = (productId: number) => {
    if (promoProducts.length === 1) {
      setRemoveModal({ open: true, productId });
    } else {
      // Remove immediately if more than one product
      setJoinedPromos((prev: any[]) => prev.map((jp: any) => jp.promoId === promo.id ? { ...jp, products: jp.products.filter((p: any) => p.id !== productId) } : jp));
    }
  };

  const confirmRemove = () => {
    // Remove the entire promo from joinedPromos
    setJoinedPromos((prev: any[]) => prev.filter((jp: any) => jp.promoId !== promo.id));
    setRemoveModal({ open: false, productId: null });
    // Optionally, navigate back to Promotions if you want
    // router.replace('/(seller_dashboard)/Promotions');
  };

  return (
    <View className="flex-1 px-4 bg-neutral-10">
      {/* Header */}
      <View className="bg-white py-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.replace('/(seller_dashboard)/Promotions')}
            className="w-8 h-8 items-center justify-center"
          >
            <Entypo name="chevron-left" size={24} color="#44040" />
          </TouchableOpacity>
          <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">
            Promotion Details
          </Text>
        </View>
      </View>

      {/* Promo Details Card */}
      <View className="bg-white rounded-2xl p-4 mt-4 mb-4">
        <View className="flex-row gap-2 items-center mb-2">
          <View className="w-4 h-4 rounded-full bg-primary" />
          <Text className="text-BodyBold text-text font-Manrope">SwiftMart Promo</Text>
        </View>
        <Text className="text-Heading2 font-Manrope text-text mb-1">{promo.name}</Text>
        <Text className="text-BodyBold text-text font-Manrope mb-1">{promo.description}</Text>
        <Text className="text-BodySmallRegular text-neutral-60">{promo.date}</Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between mb-4">
        <View className="items-center">
          <Text className="text-BodySmallBold text-neutral-70 font-Manrope">Total Promo Sales</Text>
          <Text className="text-Heading3 text-text font-Manrope">${totalSales}</Text>
        </View>
        <View className="items-center">
          <Text className="text-BodySmallBold text-neutral-70 font-Manrope">Products</Text>
          <Text className="text-Heading3 text-text font-Manrope">{promoProducts.length}</Text>
        </View>
      </View>

      {/* Product List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 mb-6">
          {promoProducts.map((product: any) => (
            <View key={product.id} className="bg-white rounded-[14px] p-4 relative">
              {/* Product Info Row */}
              <View className="flex-row items-center gap-3 mb-4">
                {/* Product Image */}
                <View className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-30">
                  <Image
                    source={product.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                {/* Product Details */}
                <View className="flex-1">
                  <Text className="text-BodyBold text-text font-Manrope">{product.brand || product.name}</Text>
                  <Text className="text-Heading4 font-Manrope text-text">${Number(product.price).toFixed(2)}</Text>
                  <Text className="text-BodySmallRegular text-neutral-60">Promo Price: ${Number(product.promoPrice).toFixed(2)}</Text>
                </View>
                {/* Remove Button */}
                <TouchableOpacity
                  className="bg-alert/85 rounded-lg px-4 py-2"
                  onPress={() => handleRemove(product.id)}
                >
                  <Text className="text-white font-Manrope font-bold">Remove From Promo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Remove Confirmation Modal */}
      <Modal
        visible={removeModal.open}
        transparent
        animationType="fade"
        onRequestClose={() => setRemoveModal({ open: false, productId: null })}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md items-center">
            <Text className="text-Heading4 font-Manrope text-text mb-4 text-center">
              Removing this will remove you from the promotion. Are you sure?
            </Text>
            <View className="flex-row gap-4 mt-2">
              <TouchableOpacity
                className="flex-1 bg-neutral-30 rounded-lg py-3 items-center"
                onPress={() => setRemoveModal({ open: false, productId: null })}
              >
                <Text className="text-text font-Manrope font-bold">No</Text>
              </TouchableOpacity>
              <View className="flex-1">
                <SecondaryButton BtnText="Yes" onPress={confirmRemove} className="bg-alert/85" textClassName="text-white" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PromotionDetails; 