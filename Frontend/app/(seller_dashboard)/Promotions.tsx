// Promotions.tsx
// This screen shows all available, active, joined, and scheduled promotions for the seller.
// It includes a promo carousel, tab navigation, and joined promo management.

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import PromoCard from "@/components/PromoCard";
import JoinedPromoCard from "@/components/JoinedPromoCard";
import { router, useLocalSearchParams } from "expo-router";
import { usePromo } from "@/context/PromoContext";

const promoTabs = ["AllPromotions", "Active", "Joined", "Scheduled"];
const promoTabsLabels = ["AllPromotions", "Active", "Joined", "Scheduled"];

const carouselPromos = [
  {
    id: "1",
    title: "Black Friday Sale",
    subtitle: "35% OFF selected goods",
    timer: "Starts in: 5 days 14:45:30",
    cta: "Add Products"
   
  },
  {
    id: "2",
    title: "Summer Sale",
    subtitle: "20% OFF all Furniture",
    timer: "Ends in: 3 days 14:45:30",
    cta: "Add Products"
   
  },
  {
    id: "3",
    title: "Special Offers",
    subtitle: "35% OFF selected goods",
    timer: "Ends in: 5 days 14:45:30",
    cta: "Add Products"
   
  },
];

const joinedPromos = [
  {
    id: "4",
    title: "Special Offers",
    subtitle: "35% OFF selected goods",
    sales: "$545.56",
    orders: 12,
    status: "Active",
    cta: "View Products",
    bg: "bg-[#F0FDF9]",
  },
  {
    id: "5",
    title: "Black Friday Sale",
    subtitle: "35% OFF selected goods",
    sales: "$0.00",
    orders: 0,
    status: "Pending",
    cta: "View Products",
    bg: "bg-[#F9F5FF]",
  },
];

const { width } = Dimensions.get("window");

// Add date parsing helper
function parsePromoDates(dateStr: string) {
  // Example: "Jul 17 - Jul 20, 2025"
  try {
    const monthMap: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [startStr, endStr] = dateStr.split("-").map(s => s.trim());
    let startMonth, startDay, endMonth, endDay, endYear;
    if (endStr.includes(",")) {
      // e.g. Jul 20, 2025
      [endMonth, endDay, endYear] = endStr.replace(",", "").split(" ");
    } else {
      [endMonth, endDay] = endStr.split(" ");
      endYear = new Date().getFullYear().toString();
    }
    [startMonth, startDay] = startStr.split(" ");
    const year = endYear ? endYear.trim() : new Date().getFullYear().toString();
    if (!startMonth || !startDay || !endMonth || !endDay || !year) {
      throw new Error("Invalid date parts");
    }
    const startDate = new Date(Number(year), monthMap[startMonth], Number(startDay));
    const endDate = new Date(Number(year), monthMap[endMonth], Number(endDay), 23, 59, 59, 999);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date constructed");
    }
    return { start: startDate, end: endDate };
  } catch (e) {
    console.error("Failed to parse promo date:", dateStr, e);
    // Fallback: treat as a promo that is never active
    return { start: new Date(0), end: new Date(0) };
  }
}

const Promotions = () => {
  const [activeTab, setActiveTab] = useState("AllPromotions");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { success } = useLocalSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const { joinedPromos }: { joinedPromos: any[] } = usePromo() || { joinedPromos: [] };

  useEffect(() => {
    if (success === 'productsAdded') {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }
  }, [success]);

  const now = new Date();
  // Helper to format date as 'Mon DD'
  function formatDate(date: Date) {
    return date.toLocaleString('en-US', { month: 'short', day: '2-digit' });
  }
  // Helper to compare only the date part (YMD)
  function toYMD(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0');
  }
  const todayYMD = toYMD(now);

  // Today
  const today = new Date();
  // Active promo: today - today+3 days
  const activeStart = new Date(today);
  const activeEnd = new Date(today); activeEnd.setDate(activeEnd.getDate() + 3);
  // Scheduled promo: today+5 - today+10 days
  const scheduledStart = new Date(today); scheduledStart.setDate(scheduledStart.getDate() + 5);
  const scheduledEnd = new Date(today); scheduledEnd.setDate(scheduledEnd.getDate() + 10);
  // Past promo: today-10 - today-5 days
  const pastStart = new Date(today); pastStart.setDate(pastStart.getDate() - 10);
  const pastEnd = new Date(today); pastEnd.setDate(pastEnd.getDate() - 5);
  // Far future promo: today+30 - today+40 days
  const futureStart = new Date(today); futureStart.setDate(futureStart.getDate() + 30);
  const futureEnd = new Date(today); futureEnd.setDate(futureEnd.getDate() + 40);

  const allPromos = [
    {
      id: "1",
      name: "Black Friday Sale",
      discount: 35,
      description: "35% OFF selected goods",
      date: `${formatDate(activeStart)} - ${formatDate(activeEnd)}, ${activeEnd.getFullYear()}`,
    },
    {
      id: "2",
      name: "Summer Sale",
      discount: 20,
      description: "20% OFF all Furniture",
      date: `${formatDate(scheduledStart)} - ${formatDate(scheduledEnd)}, ${scheduledEnd.getFullYear()}`,
    },
    {
      id: "3",
      name: "Special Offers",
      discount: 35,
      description: "35% OFF selected goods",
      date: `${formatDate(pastStart)} - ${formatDate(pastEnd)}, ${pastEnd.getFullYear()}`,
    },
    {
      id: "4",
      name: "Winter Clearance",
      discount: 50,
      description: "50% OFF winter items",
      date: `${formatDate(futureStart)} - ${formatDate(futureEnd)}, ${futureEnd.getFullYear()}`,
    },
    {
      id: "5",
      name: "Flash Sale",
      discount: 15,
      description: "15% OFF electronics",
      date: `${formatDate(pastStart)} - ${formatDate(pastEnd)}, ${pastEnd.getFullYear()}`,
    },
    {
      id: "6",
      name: "Spring Launch",
      discount: 10,
      description: "10% OFF new arrivals",
      date: `${formatDate(scheduledStart)} - ${formatDate(scheduledEnd)}, ${scheduledEnd.getFullYear()}`,
    }
  ];

  const joinedPromoIds = joinedPromos.map(jp => jp.promoId);

  const filteredPromos = (() => {
    if (activeTab === "AllPromotions") return allPromos;
    if (activeTab === "Joined") return allPromos.filter(p => joinedPromoIds.includes(p.id));
    if (activeTab === "Active") {
      return allPromos.filter(p => {
        const { start, end } = parsePromoDates(p.date);
        return toYMD(start) <= todayYMD && todayYMD <= toYMD(end);
      });
    }
    if (activeTab === "Scheduled") {
      return allPromos.filter(p => {
        const { start } = parsePromoDates(p.date);
        return todayYMD < toYMD(start);
      });
    }
    return allPromos;
  })();

  const noPromosMsg = {
    Joined: "No joined promos",
    Active: "No active promos",
    Scheduled: "No upcoming promos",
  };

  const carouselCardWidth = width * 0.8;
  const carouselGap = 16;

  return (
    <View className="flex-1 gap-6 px-4 pb-4 bg-neutral-10">
      {/* Success Toast */}
      {showSuccess && (
        <View style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 100,
        }}>
          <View className="flex-row gap-2" style={{
            backgroundColor: 'rgba(64,64,64,0.5)',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Entypo name="check" size={24} color="white" />
            <Text className="font-Manrope text-Heading5 font-bold text-neutral-10">
              Products successfully added
            </Text>
          </View>
        </View>
      )}
      <View className="bg-white z-10 gap-6 pb-4">
      {/* Header */}
      <View>
            <TouchableOpacity
              className="w-6"
              onPress={() => {
                router.back();
              }}
            >
              <Entypo name="chevron-left" size={24} color="#404040" />
            </TouchableOpacity>
            <Text className="text-text font-Manrope text-Heading3 text-center">
              Promotions
            </Text>
          </View>

      {/* Tabs */}
      <View className="flex-row gap-2  ">
        {promoTabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            className={`px-4 py-2 rounded-full ${activeTab === tab ? "bg-secondary" : "bg-neutral-30"}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-BodySmallRegular font-Manrope ${activeTab === tab ? "text-neutral-10" : "text-neutral-60"}`}>{tab.replace("AllPromotions", "All Promotions")}</Text>
          </TouchableOpacity>
        ))}
      </View>

      </View>

      <View className="flex-1"
      style={{overflowX:"visible", overflowY:"hidden"}}
      >
      <ScrollView className="flex-1 overflow-visible " contentContainerClassName="gap-6" showsVerticalScrollIndicator={false}>
       <View>
        {/* Carousel */}
        <View style={{ minHeight: 220, maxHeight: 220, justifyContent: 'center' }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: carouselGap, alignItems: 'center', minHeight: 220 }}
            scrollEventThrottle={16}
            snapToInterval={carouselCardWidth + carouselGap}
            decelerationRate="fast"
            onScroll={e => {
              const x = e.nativeEvent.contentOffset.x;
              const idx = Math.round(x / (carouselCardWidth + carouselGap));
              setCarouselIndex(idx);
            }}
            style={{ minHeight: 220, maxHeight: 220 }}
          >
            {filteredPromos.length === 0 ? (
              <View style={{ width: carouselCardWidth, height: 180, justifyContent: 'center', alignItems: 'center' }}>
                <Text className="text-neutral-60 text-BodyBold font-Manrope">{noPromosMsg[activeTab as keyof typeof noPromosMsg]}</Text>
              </View>
            ) : (
              filteredPromos.map((item, index) => (
                <View key={item.id} style={{ width: carouselCardWidth }}>
                  <PromoCard
                    title={item.name}
                    subtitle={item.description}
                    timer={item.date}
                    cta={"Add Products"}
                    onPress={() => router.push({ pathname: '/(seller_dashboard)/AddProductsToPromotion', params: { promoId: item.id } })}
                    bgColor={""}
                  />
                </View>
              ))
            )}
          </ScrollView>
          {/* Carousel Indicator */}
          <View className="flex-row justify-center items-center mt-2">
            {filteredPromos.map((_, idx) => (
              <View key={idx} className={`w-[10px] h-[10px] mx-1 rounded-full ${carouselIndex === idx ? "bg-primary" : "bg-neutral-30"}`} />
            ))}
          </View>
        </View>
       </View>

        {/* Stats */}
        <View className="flex-row justify-between px-4 ">
          <View className="items-center">
            <Text className="text-BodySmallBold text-neutral-70 font-Manrope">Promotions Joined</Text>
            <Text className="text-Heading3 w-full  text-text font-Manrope">{joinedPromos.length}</Text>
          </View>
          <View className="items-center">
            <Text className="text-BodySmallBold text-neutral-70 font-Manrope">Total Promo Sales</Text>
            <Text className="text-Heading3 w-full  text-text font-Manrope">$0.00</Text>
          </View>
        </View>

        {/* Joined Promotions */}
          
            <Text className="text-Heading4  font-Manrope text-text">Your Joined Promotions</Text>
            <View className="gap-6 overflow-visible">
              {joinedPromos.length === 0 ? (
                <View className="flex-1 items-center justify-center py-8">
                  <Text className="text-neutral-60 text-BodyBold font-Manrope">No joined promos</Text>
                </View>
              ) : (
                joinedPromos.map((jp: any) => {
                  const promo = allPromos.find(p => p.id === jp.promoId);
                  let status = "";
                  if (promo) {
                    const { start, end } = parsePromoDates(promo.date);
                    if (now < start) status = "Pending";
                    else if (now >= start && now <= end) status = "Active";
                    // else status = "Ended"; // Do not show 'Ended' status
                  }
                  return (
                    <JoinedPromoCard
                      key={jp.promoId}
                      title={jp.promoInfo.name}
                      subtitle={jp.promoInfo.description}
                      sales={"$0.00"}
                      orders={0}
                      status={status}
                      cta={"View Products"}
                      onPress={() => router.push({ pathname: '/(seller_dashboard)/PromotionDetails', params: { promoId: jp.promoId } })}
                      bgColor={""}
                      onAddMore={() => router.push({ pathname: '/(seller_dashboard)/AddProductsToPromotion', params: { promoId: jp.promoId, addMore: 'true' } })}
                    />
                  );
                })
              )}
            </View>
      
      </ScrollView>

      </View>
    </View>
  );
};

export default Promotions; 