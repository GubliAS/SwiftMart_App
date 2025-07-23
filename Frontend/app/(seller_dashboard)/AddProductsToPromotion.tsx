// AddProductsToPromotion.tsx
// This screen allows the seller to add products to a selected promotion.
// The seller can select products, set promo prices, and submit to join the promo.
// Updates the joinedPromos context with the selected products.

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, Image } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import productData from "@/constants/productData";
import { usePromo } from "@/context/PromoContext";
import SecondaryButton from "@/components/SecondaryButton";

// Mock promo data list
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

const SELLER_ID = 1;

const AddProductsToPromotion = () => {
  const { promoId, addMore } = useLocalSearchParams();
  const promo = mockPromos.find(p => p.id === promoId) || mockPromos[0];
  const { joinedPromos, setJoinedPromos }: { joinedPromos: any[]; setJoinedPromos: React.Dispatch<any[]> } = usePromo() || { joinedPromos: [], setJoinedPromos: () => {} };

  // Find already joined products for this promo
  const alreadyInPromo = addMore
    ? (joinedPromos.find((jp: any) => jp.promoId === promo.id)?.products.map((p: any) => p.id) || [])
    : [];

  // Filter products for this seller, excluding those already in the promo if addMore
  const sellerProducts = productData
    .filter((p: any) => p.sellerId === SELLER_ID && (!addMore || !alreadyInPromo.includes(p.id)))
    .map((p: any) => ({
      ...p,
      isSelectedForPromo: false,
      promoPrice: (Number(p.price) * (100 - promo.discount) / 100).toFixed(2),
    }));

  const [products, setProducts] = useState(sellerProducts);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleToggleProduct = (productId: number) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, isSelectedForPromo: !product.isSelectedForPromo }
          : product
      )
    );
  };

  const handlePromoPriceChange = (productId: number, newPrice: string) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, promoPrice: newPrice }
          : product
      )
    );
  };

  const handleSubmit = () => {
    const anySelected = products.some(p => p.isSelectedForPromo);
    if (!anySelected) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
      return;
    }
    // Prepare selected products for this promo
    const selectedProducts = products.filter((p: any) => p.isSelectedForPromo).map((p: any) => ({
      ...p,
      promoId: promo.id,
      promoPrice: p.promoPrice
    }));
    // Update joinedPromos context
    if (addMore) {
      // Merge with existing products
      const updatedPromos = joinedPromos.map((jp: any) => jp.promoId === promo.id ? { ...jp, products: [...jp.products, ...selectedProducts] } : jp);
      setJoinedPromos(updatedPromos);
    } else {
      const updatePromos = (prev: any[]) => {
        const exists = prev.find((jp: any) => jp.promoId === promo.id);
        if (exists) {
          // Merge products, avoiding duplicates
          const oldProducts = exists.products;
          const newProducts = selectedProducts.filter(
            (p: any) => !oldProducts.some((op: any) => op.id === p.id)
          );
          return prev.map((jp: any) =>
            jp.promoId === promo.id
              ? { ...jp, products: [...oldProducts, ...newProducts] }
              : jp
          );
        } else {
          // Add new joined promo
          return [
            ...prev,
            {
              promoId: promo.id,
              promoInfo: promo,
              products: selectedProducts
            }
          ];
        }
      };
      setJoinedPromos(updatePromos(joinedPromos));
    }
    router.replace({ pathname: '/(seller_dashboard)/Promotions', params: { success: 'productsAdded' } });
  };

  return (
    <View className="flex-1  bg-neutral-10">
      {/* Header */}
      <View className="bg-white px-4 z-10 py-4">
            <TouchableOpacity
              className="w-6"
              onPress={() => router.replace('/(seller_dashboard)/Promotions')}
            >
              <Entypo name="chevron-left" size={24} color="#404040" />
            </TouchableOpacity>
            <Text className="text-text font-Manrope text-Heading3 text-center">
              Add Products To Promotion
            </Text>
          </View>

     

      {/* Error Toast */}
      {showError && (
        <View className="absolute top-1/2 left-0 right-0 items-center mx-8  z-50">
          <View className="flex-row gap-2 bg-alert/85 rounded-xl p-4 shadow-lg items-center">
            <Entypo name="cross" size={24} color="white" />
            <Text className="font-Manrope text-Heading5 font-bold text-neutral-10">
              Please select at least one product to add to the promotion.
            </Text>
          </View>
        </View>
      )}

      <ScrollView className="flex-1 px-4 mb-4 overflow-visible " showsVerticalScrollIndicator={false}>
        {/* Promotion Details */}
        <View className="bg-white rounded-14 p-4 mb-4 mt-4">
          <View className="flex-row gap-2 items-center ">
            <View className="w-4 h-4 rounded-full bg-primary" />
            <Text className="text-BodyBold text-text font-Manrope">SwiftMart Promo</Text>
          </View>
          <Text className="text-Heading2 font-Manrope text-text ">{promo.name}</Text>
          <Text className="text-BodyBold text-text font-Manrope ">{promo.description}</Text>
          <Text className="text-BodySmallBold text-secondary mt-2">
            {promo.date}
          </Text>
        </View>

        {/* Product List */}
        <View className="gap-4 ">
          {products.map((product) => (
            <View key={product.id} className="bg-white rounded-[14px] p-4 relative"
            style={{
              boxShadow: "0px 2px 24px 0px rgba(0, 0, 0, 0.10)",
            }}
            >
              {/* Quantity Badge */}
              {product.quantity > 0 && (
                <View className="absolute top-2 left-2 bg-primary rounded-md">
                  <Text className="text-Caption text-white font-Manrope">{product.quantity}</Text>
                </View>
              )}

              {/* Product Info Row */}
              <View className="flex-row  gap-4 mb-4">
                {/* Product Image */}
                <View className="w-[100px] bg-neutral-10 h-[100px] rounded-lg overflow-hidden ">
                  <Image
                    source={product.image}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>

                {/* Product Details */}
                <View className="flex-1">
                  <Text className="text-BodyRegular text-text font-Manrope" numberOfLines={1}>{product.brand || product.name}</Text>
                  <Text className="text-Heading4 font-Manrope text-text">${Number(product.price).toFixed(2)}</Text>
                </View>

                {/* Discount and Toggle */}
                <View className="flex-row  gap-4">
                        {/* Discount Badge */}
                        <View className=" h-[20px] mt-2  bg-alert px-2 py-1 rounded-tl-[10px] rounded-br-[10px]">
            <Text className="text-white text-[10px] font-semibold">
              {promo.discount}% OFF
            </Text>
          </View>
           
                  <Switch
                    value={product.isSelectedForPromo}
                    onValueChange={() => handleToggleProduct(product.id)}
                    trackColor={{ false: "#E55000", true: "#EBB65B" }}
                    thumbColor={product.isSelectedForPromo ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
              </View>

              {/* Price Input Fields */}              
                <View className=" flex-row items-center border border-neutral-50 rounded-lg ">
                  <View className="flex-1 border-r border-neutral-50 p-4 justify-center  flex-row items-center">
                    <Text className="text-BodyBold text-neutral-50 font-Manrope mr-1">$</Text>
                    <Text className="text-BodyBold text-neutral-50 font-Manrope">
                      {(
                        Number(product.price) * (100 - promo.discount) / 100
                      ).toFixed(2)}
                    </Text>
                  </View>
                  <View className=" flex-1 p-4 items-center justify-center ">
                  <Text className="text-BodySmallRegular  text-text font-Manrope ">Promo Price <Text className="text-secondary font-Manrope text-BodySmallBold">$</Text></Text>
                  </View>
                </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="px-4 py-4 bg-white">
        <SecondaryButton
          BtnText="Submit"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default AddProductsToPromotion; 