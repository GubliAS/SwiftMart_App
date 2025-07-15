import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import CarouselCard from "@/components/CarouselCard";
import ProductCard from "@/components/ProductCard"; // Importing ProductCard as a default export
import productData from "@/constants/productData"; // Import the product data
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/assets/svgs/LogoLG2.svg"

const carouselData = [
  {
    title: "This Week \nOnly",
    description: "Get discount up to 67% for furniture purchases",
    image: require("@/assets/images/carousel1.png"),
    gradientColors: [
      "rgba(21, 102, 81, 0.94)",
      "rgba(21, 102, 81, 0.67)",
      "rgba(21, 102, 81, 0)",
    ] as const,
    buttonText: "Shop Now",
    onPress: () => console.log("Shop Now pressed"),
  },
  {
    title: "Shop Together\nPay Together",
    description: "Add items together and each person checks out their part.",
    image: require("@/assets/images/carousel1.png"),
    gradientColors: ["rgba(0, 0, 0, 0.63)", "rgba(0, 0, 0, 0)"] as const,
    buttonText: "Create Cart",
    onPress: () => console.log("Explore pressed"),
  },
  {
    title: "Deals You Can't\nScroll Past!",
    description: "Snag the best discounts before they're gone ",
    image: require("@/assets/images/carousel1.png"),
    gradientColors: [
      "rgba(227, 173, 51, 0.55)",
      "rgba(227, 173, 51, 0)",
    ] as const,
    buttonText: "Shop Now",
    onPress: () => console.log("View More pressed"),
  },
];

const categories = [
  { name: "All Products", image: require("@/assets/images/sports.png") },
  {
    name: "Electronics & Devices",
    image: require("@/assets/images/electronics.png"),
  },
  { name: "Sports & Fitness", image: require("@/assets/images/sports.png") },
  {
    name: "Computer & Accessories",
    image: require("@/assets/images/computer.png"),
  },
  {
    name: "Beauty & Personal Care",
    image: require("@/assets/images/beauty.png"),
  },
  {
    name: "Office & Stationery",
    image: require("@/assets/images/office.png"),
  },
  { name: "Home & Living", image: require("@/assets/images/home.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  {
    name: "Automotive & Tools",
    image: require("@/assets/images/automotive.png"),
  },
  {
    name: "Groceries & Essentials",
    image: require("@/assets/images/Groceries.png"),
  },
  { name: "Kids & Toys", image: require("@/assets/images/kids.png") },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCategory, setShowCategory] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = 335 + 16; // Card width + gap
    const currentIndex = Math.round(contentOffsetX / cardWidth);
    setActiveIndex(currentIndex);
  };

  const handleCategoriesPress = () => {
    setShowCategory(!showCategory); // Toggle category view
  };

  const handleCategorySelection = (categoryName: string) => {
    router.push({
      pathname: "/FilteredProducts",
      params: { categoryName },
    });
  };

  return (
    <SafeAreaView className="font-Manrope  bg-white flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* Header and Search Bar */}
        <View className=" w-full  bg-white px-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable>
              <Image
                style={{ height: 55, width: 55 }}
                source={require("@/assets/images/LogoLG.png")}
              />
              
            </Pressable>
            <Pressable>
              <Feather name="bell" size={28} color="#404040" />
              <View className="w-[10px] h-[10px] bg-alert rounded-full absolute right-1 " />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row gap-[10px] items-center flex-1 h-[48px] rounded-full px-4 bg-[#F4EDD8]/50">
              <Feather name="search" size={18} color="#156651" />
              <TextInput
                onPress={() => router.push("/Search")}
                className="flex-1 text-text text-Heading5"
                placeholder="Search"
                placeholderTextColor={"#88939E"}
                selectionColor="#404040"
                editable={false} // Make the TextInput non-editable to prevent keyboard from showing
              />
            </View>
            <Pressable className="w-[50px] h-[50px] border border-neutral-50 rounded-full items-center justify-center">
              <Feather name="camera" size={20} color="#404040" />
            </Pressable>
            <Pressable onPress={handleCategoriesPress}>
              <AntDesign name="appstore-o" size={32} color="#156651" />
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View className="flex-1 overflow-visible">
        {/* Main Content */}
        {showCategory ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingBottom: 16,
              paddingHorizontal: 16,
            }}
          >
            <View className="gap-4">
              <Text className="font-Manrope text-Heading3 text-text">
                Shop by Categories
              </Text>
              <View className="flex-row flex-wrap justify-between gap-y-4">
                {categories.map((category, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleCategorySelection(category.name)}
                    className="w-[48%] h-[128px] mb-4 rounded-[20px] overflow-hidden"
                  >
                    <ImageBackground
                      source={category.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    >
                      <View className="bg-black/20 absolute h-full w-full" />
                      <View className="absolute h-full justify-center items-center w-full">
                        <Text className="font-Manrope text-neutral-10 text-Heading4 font-bold text-center">
                          {category.name}
                        </Text>
                      </View>
                    </ImageBackground>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
          contentContainerClassName="flex-1 overflow-visible"
            contentContainerStyle={{
            }}
          >
            <View className="gap-4 flex">
              {/* Carousel and Indicator Circles */}
              <View className="px-1 overflow-visible" >
                {/* Carousel */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 16,
                  }}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  {carouselData.map((item, index) => (
                    <CarouselCard
                      key={index}
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      gradientColors={item.gradientColors}
                      buttonText={item.buttonText}
                      onPress={item.onPress}
                    />
                  ))}
                </ScrollView>

                {/* Indicator Circles */}
                <View className="flex-row justify-center mt-4">
                  {carouselData.map((_, index) => (
                    <View
                      key={index}
                      className={`w-[10px] h-[10px] rounded-full mx-[5px] ${
                        activeIndex === index ? "bg-primary" : "bg-neutral-50"
                      }`}
                    />
                  ))}
                </View>
              </View>

              {/* Main Content */}
              <View className="px-4 gap-4 overflow-visible">
                <View className="flex-row items-center justify-between">
                  <Text className="font-Manrope text-Heading3 text-text">
                    Special Offers
                  </Text>
                  <TouchableOpacity onPress={() => router.push({ pathname: '/FilteredProducts', params: { specialOffers: 'true' } })}>
                    <Text className="font-Manrope text-BodySmallBold text-primary">
                      See More
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 16,
                  }}
                  style={{
                    overflow: "visible", // Ensure shadows are not clipped
                  }}
                >
                  {productData.filter(product => product.discount).slice(0, 10).map((product) => (
                    <TouchableOpacity key={product.id} onPress={() => router.push({ pathname: '/(root)/(Home)/ProductDetail', params: { productId: product.id } })}>
                      <ProductCard
                        image={product.image}
                        name={product.name}
                        price={parseFloat(product.price)}
                        originalPrice={parseFloat(product.originalPrice)}
                        discount={product.discount ? parseFloat(product.discount) : undefined}
                        rating={product.rating}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
