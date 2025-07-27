import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  PanResponder,
  Modal,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";
import productData from "@/constants/productData";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "@/components/PrimaryButton";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "@/components/Button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "../../context/_CartContext";
import type { Cart } from "../../context/_CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProductById } from "@/app/api/productApi";

// Add Product type for backend data
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount?: number;
  rating: string;
  productImage: string;
  description: string;
  condition: string;
  variants?: any[];
  shippingOptions?: any[];
  [key: string]: any;
}

const ProductDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = Number(params.productId);

  let shouldCloseCartModal = false;
  if (typeof params.closeCartModal === "string") {
    shouldCloseCartModal = params.closeCartModal === "true";
  } else if (Array.isArray(params.closeCartModal)) {
    shouldCloseCartModal = params.closeCartModal.includes("true");
  } else if (typeof params.closeCartModal === "boolean") {
    shouldCloseCartModal = params.closeCartModal;
  }
  // Replace static lookup with backend fetch
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (productId) {
      fetchProductById(productId)
        .then((data) => {
  
          setProduct(data);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        });
    }
  }, [productId]);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Helper: get all unique sizes (optionally filtered by color)
  const uniqueSizes = React.useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(
        product.variants
          .filter(v => !selectedColor || v.color === selectedColor)
          .map(v => v.size)
      )
    );
  }, [product?.variants, selectedColor]);

  // Helper: get all unique colors (optionally filtered by size)
  const uniqueColors = React.useMemo(() => {
    if (!product?.variants) return [];
    return Array.from(
      new Set(
        product.variants
          .filter(v => !selectedSize || v.size === selectedSize)
          .map(v => v.color)
      )
    );
  }, [product?.variants, selectedSize]);

  // Color mapping function
  const getColorValue = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Blue': '#0000FF',
      'Red': '#FF0000',
      'Green': '#00FF00',
      'Yellow': '#FFFF00',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Pink': '#FFC0CB',
      'Gray': '#808080',
      'Brown': '#A52A2A',
      'Navy': '#000080',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Beige': '#F5F5DC',
      'Cream': '#FFFDD0',
      'Maroon': '#800000',
      'Teal': '#008080',
      'Cyan': '#00FFFF',
      'Magenta': '#FF00FF'
    };
    return colorMap[colorName] || '#CCCCCC'; // Default to gray if color not found
  };

  // Find the selected variant
  const selectedVariant = React.useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
  }, [product?.variants, selectedColor, selectedSize]);

  // Set initial color and size on product load
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      console.log("Setting initial color/size:", firstVariant.color, firstVariant.size);
      setSelectedColor(firstVariant.color);
      setSelectedSize(firstVariant.size);
    }
    // Reset image error state when product changes
    setImageError(false);
  }, [product?.variants]);

  // Debug selectedVariant
  useEffect(() => {
    console.log("Selected variant:", selectedVariant);
    console.log("Selected color:", selectedColor);
    console.log("Selected size:", selectedSize);
  }, [selectedVariant, selectedColor, selectedSize]);
  const [open, setOpen] = useState(false);
  const [sizeItems, setSizeItems] = useState(
    product?.variants?.[selectedVariantIdx]?.sizes?.map((size: any) => ({
      label: size,
      value: size,
    })) || []
  );
  const [descOpen, setDescOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(
    product && product.shippingOptions && product.shippingOptions.length === 1
      ? product.shippingOptions[0].type
      : (product &&
          product.shippingOptions &&
          product.shippingOptions[0]?.type) ||
          ""
  );
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [showAddedToWishlist, setShowAddedToWishlist] = useState(false);
  const [wishlistAction, setWishlistAction] = useState<"added" | "removed">(
    "added"
  );
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [newCartName, setNewCartName] = useState("");
  const [imageError, setImageError] = useState(false);

  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const {
    carts,
    selectedCartId,
    setSelectedCartId,
    addCart,
    addItemToCart,
    selectCart,
  } = useCart();

  // Drag-to-close modal state
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
          setCartDropdownOpen(false);
          setCartModalVisible(false);
          Animated.timing(panY, {
            toValue: 500,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            resetCartModal();
          });
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

  const resetCartModal = () => {
    setQuantity(1);
    setNewCartName("");
  };

  const closeCartModal = () => {
    setCartDropdownOpen(false);
    Animated.timing(panY, {
      toValue: 500,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCartModalVisible(false);
      panY.setValue(0);
      resetCartModal();
    });
  };

  const openCartModal = () => {
    panY.setValue(0);
    setCartModalVisible(true);
  };

  useEffect(() => {
    // Auto-select Standard if two options, or the only option if one
    if (
      product &&
      product.shippingOptions &&
      product.shippingOptions.length === 1
    ) {
      setSelectedShipping(product.shippingOptions[0].type);
    } else if (
      product &&
      product.shippingOptions &&
      product.shippingOptions.length > 1
    ) {
      setSelectedShipping(
        product.shippingOptions.find((opt: any) => opt.type === "Standard")
          ?.type || product.shippingOptions[0].type
      );
    }
  }, [product?.shippingOptions]);

  // Reset panY when modal opens
  useEffect(() => {
    if (cartModalVisible) {
      panY.setValue(0);
    }
  }, [cartModalVisible]);

  // Close Add to Cart modal if returning from CreateCartScreen
  useEffect(() => {
    if (shouldCloseCartModal) {
      setCartModalVisible(false);
    }
  }, [shouldCloseCartModal]);

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Product not found.</Text>
      </SafeAreaView>
    );
  }

  // Calculate average rating from reviews
  const getAverageRating = (reviews: { rating?: number }[] = []): string => {
    if (!reviews || reviews.length === 0) return "0.0";
    const sum = reviews.reduce(
      (acc: number, r: { rating?: number }) => acc + (r.rating || 0),
      0
    );
    return (sum / reviews.length).toFixed(1);
  };

  // Helper to get selected cart name
  const selectedCart =
    carts.find((c: Cart) => c.id === selectedCartId)?.name || "My Cart";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isWishlisted(product.id)) {
                console.log(
                  "Removing from wishlist:",
                  product.id,
                  product.name
                );
                removeFromWishlist(product.id);
              } else {
        
                addToWishlist({
                  id: product.id,
                  name: product.name,
                  image: product.productImage,
                  price:
                    typeof product.price === "string"
                      ? parseFloat(product.price)
                      : product.price,
                  originalPrice:
                    typeof product.originalPrice === "string"
                      ? parseFloat(product.originalPrice)
                      : product.originalPrice,
                  discount: product.discount
                    ? typeof product.discount === "string"
                      ? parseFloat(product.discount)
                      : product.discount
                    : undefined,
                  rating: product.rating,
                });
              }
            }}
            className="absolute top-2 right-4 z-10 bg-white/80 rounded-full p-2"
            style={{ elevation: 2 }}
          >
            <AntDesign
              name={isWishlisted(product.id) ? "heart" : "hearto"}
              size={24}
              color="#EB1A1A"
            />
          </TouchableOpacity>
        </View>
        {/* Product Image */}
        <View className="items-center mt-2">
          <Image
            source={{ 
              uri: selectedVariant?.image || product.productImage,
              cache: 'reload'
            }}
            style={{ width: 264, height: 264, borderRadius: 16 }}
            resizeMode="contain"
            onError={(error) => {
              console.log("Image loading error:", error.nativeEvent?.error);
              setImageError(true);
            }}
            onLoad={() => {
              console.log("Image loaded successfully");
              setImageError(false);
            }}
          />
          {/* Fallback text only if image fails */}
          {imageError && (
            <Text style={{ marginTop: 8, color: '#666' }}>Image not available</Text>
          )}
          {/* Variant Thumbnails */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-4 mt-3"
          >
            {product.variants?.map((v, idx) => (
              <TouchableOpacity
                key={`variant-${v.color}-${v.size}-${idx}`}
                onPress={() => {
                  setSelectedColor(v.color);
                  setSelectedSize(v.size);
                }}
                style={{
                  borderWidth: (selectedColor === v.color && selectedSize === v.size) ? 2 : 1,
                  borderColor: (selectedColor === v.color && selectedSize === v.size) ? "#156651" : "#ccc",
                  borderRadius: 8,
                  padding: 2,
                  backgroundColor: "#fff",
                  marginRight: 16,
                }}
              >
                <Image
                  source={{ uri: v.image }}
                  style={{ width: 54, height: 54, borderRadius: 10 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Product Info */}
        <View className="px-4  gap-4 mt-[54px] ">
          <View className="gap-2">
            <View className="justify-between flex-row items-center">
              <Text className="text-BodyRegular text-text font-Manrope">
                {product.name}
              </Text>
              <View className="border  items-center  px-4 py-2 border-neutral-90 rounded-[10px]">
                <Text className="text-BodyRegular text-neutral-80 font-Manrope">
                  {product.condition}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 ">
              <Text className="text-Heading2 text-text font-Manrope">
                ${selectedVariant?.price || product.price}
              </Text>
              <Text className="text-BodySmallRegular line-through text-text font-Manrope">
                ${product.originalPrice}
              </Text>

              {/* Discount Badge */}
              {(product as any).discount && (
                <View className=" h-[20px] left-1 bg-alert px-2 py-1 rounded-tl-[10px] rounded-br-[10px]">
                  <Text className="text-white text-[10px] font-semibold font-Manrope">
                    {(product as any).discount}% OFF
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-1 ">
              <AntDesign name="star" size={18} color="#EBB65B" />
              <Text className="text-Captiontext-gray-700 font-Manrope">
                {product.rating}
              </Text>
            </View>
          </View>
          {/* Product Description Section */}
          <View className="gap-4 ">
            <TouchableOpacity
              onPress={() => setDescOpen((open) => !open)}
              className="flex-row items-center gap-2 "
            >
              <Text className="text-Heading5 font-[700] text-text">
                Product Description
              </Text>
              <Feather
                name={descOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color="#404040"
              />
            </TouchableOpacity>
            {descOpen && (
              <Text className="text-BodyRegular text-gray-600 ">
                {product.description}
              </Text>
            )}
          </View>
          {/* Colors */}
          <View className="gap-4 mt-4 mb-4">
            <Text className="text-Heading5 font-[700] ">Colors</Text>
            {uniqueColors.length > 0 ? (
              <View className="flex-row gap-2 ">
                            {uniqueColors.map((color, idx) => (
              <TouchableOpacity
                key={`color-${color}-${idx}-${selectedSize}`}
                onPress={() => setSelectedColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: getColorValue(color),
                  borderWidth: selectedColor === color ? 2 : 1,
                  borderColor: selectedColor === color ? "#156651" : "#ccc",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedColor === color && (
                  <Feather name="check" size={20} color={getColorValue(color) === '#FFFFFF' ? "#000" : "#fff"} />
                )}
              </TouchableOpacity>
            ))}
              </View>
            ) : (
              <Text className="text-BodyRegular text-neutral-60">No color options available.</Text>
            )}
          </View>

          {/* Sizes */}
          <View className="gap-4 mb-4">
            <Text className="text-Heading5 font-[700] ">Sizes</Text>
            {uniqueSizes.length > 0 ? (
              <View className="flex-row gap-2 ">
                {uniqueSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={{
                      minWidth: 48,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: selectedSize === size ? "#fff" : "#fff",
                      borderWidth: selectedSize === size ? 2 : 1,
                      borderColor: selectedSize === size ? "#156651" : "#ccc",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ color:"#156651" }}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-BodyRegular text-neutral-60">No size options available.</Text>
            )}
          </View>

          {/* Shipping Options Section */}
          <View className="">
            <Text className="text-Heading5 font-[700] mb-2">
              Shipping Options
            </Text>
            {product.shippingOptions && product.shippingOptions.length > 0 ? (
              <View className="flex-row gap-4">
                {product.shippingOptions.map((option, idx) => {
                  const isSelected = selectedShipping === option.type;
                  const isLocked = product.shippingOptions && product.shippingOptions.length === 1;
                  return (
                    <TouchableOpacity
                      key={`${option.id}-${option.type}`}
                      onPress={() => {
                        if (!isLocked) setSelectedShipping(option.type);
                      }}
                      activeOpacity={isLocked ? 1 : 0.7}
                      style={{
                        flex: 1,
                        opacity: isLocked || isSelected ? 1 : 0.7,
                        borderWidth: 2,
                        borderColor: isSelected ? "#156651" : "#ccc",
                        borderRadius: 10,
                        padding: 12,
                        backgroundColor: isSelected ? "#e6f4ef" : "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "50%",
                      }}
                      disabled={isLocked}
                    >
                      <Text className="text-BodyBold">
                        {option.type} Shipping
                      </Text>
                      <Text className="text-BodySmallRegular text-neutral-60">
                        {option.duration}
                      </Text>
                      <Text className="text-BodySmallRegular text-neutral-80 mt-1">
                        {option.price === 0
                          ? "Free"
                          : `$${option.price.toFixed(2)}`}
                      </Text>
                      {isLocked && (
                        <Text className="text-xs text-neutral-60 mt-1">
                          Only option
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text className="text-BodyRegular text-neutral-60">No shipping options available.</Text>
            )}
          </View>

          {/* Product Reviews Section */}
          <View className="gap-4 mb-4">
            <TouchableOpacity
              onPress={() => setReviewsOpen((open) => !open)}
              className="flex-row items-center gap-2 "
            >
              <Text className="text-Heading5 font-[700] text-text">
                Product Reviews
              </Text>
              <Feather
                name={reviewsOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color="#404040"
              />
            </TouchableOpacity>
            {reviewsOpen && product.reviews && product.reviews.length > 0 ? (
              <View className="gap-[10px]">
                <View className="gap-2 ">
                  {/* Average Rating and Review Count */}
                  <Text className="text-Heading4 text-neutral-80 ">
                    {getAverageRating(product.reviews)} Ratings
                  </Text>
                  <Text className="text-Caption  text-neutral-60">
                    {product.reviews.length} Reviews
                  </Text>
                </View>
                {/* Reviews List */}
                {product.reviews.map((review: any, idx: number) => (
                  <View key={idx} className="gap-2">
                    <View className="flex-row items-center gap-2 justify-between ">
                      <Text className="text-BodyBold">
                        {review.reviewerName}
                      </Text>
                      <View className="flex-row">
                        {[...Array(5)].map((_, i) => (
                          <AntDesign
                            key={i}
                            name="star"
                            size={24}
                            color={i < review.rating ? "#EBB65B" : "#ccc"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="text-BodySmallRegular text-neutral-60 mb-1">
                      "{review.comment}"
                    </Text>
                    {/* Review Images */}
                    {"images" in review &&
                      Array.isArray((review as any).images) &&
                      (review as any).images.length > 0 && (
                        <View className="flex-row gap-2 mb-1">
                          {(review as any).images.map((img: any, i: number) => (
                            <Image
                              key={i}
                              source={img}
                              style={{
                                width: 75,
                                height: 75,
                                borderRadius: 10,
                              }}
                              resizeMode="contain"
                            />
                          ))}
                        </View>
                      )}
                    <Text className="text-Caption text-text">
                      {review.date}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              reviewsOpen && (
                <Text className="text-BodyRegular text-neutral-60">No reviews yet.</Text>
              )
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart and Wishlist Buttons */}
      <View className="px-4 pb-4 pt-[10px] flex-row gap-2 items-center">
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#156651",
            borderRadius: 12,
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
          onPress={() => {
            const currentlyWishlisted = isWishlisted(product.id);
            if (currentlyWishlisted) {
              removeFromWishlist(product.id);
              setWishlistAction("removed");
            } else {
              addToWishlist({
                id: product.id,
                name: product.name,
                image: product.productImage,
                price:
                  typeof product.price === "string"
                    ? parseFloat(product.price)
                    : product.price,
                originalPrice:
                  typeof product.originalPrice === "string"
                    ? parseFloat(product.originalPrice)
                    : product.originalPrice,
                discount: product.discount
                  ? typeof product.discount === "string"
                    ? parseFloat(product.discount)
                    : product.discount
                  : undefined,
                rating: product.rating,
              });
              setWishlistAction("added");
            }
            setShowAddedToWishlist(true);
            setTimeout(() => setShowAddedToWishlist(false), 1500);
          }}
        >
          {isWishlisted(product.id) ? (
            <AntDesign name="heart" size={24} color="#E44A4A" />
          ) : (
            <AntDesign name="hearto" size={24} color="#156651" />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PrimaryButton BtnText="Add to Cart" onPress={openCartModal} />
        </View>
      </View>

      {/* Centered overlays for success messages */}
      {(showAddedToCart || showAddedToWishlist) && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
          pointerEvents="none"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 16,
              paddingVertical: 24,
              paddingHorizontal: 32,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {showAddedToCart ? (
              <Feather
                name="check"
                size={24}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            ) : (
              <Feather
                name="heart"
                size={24}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            )}
            <Text className="text-neutral-10 text-Heading5">
              {showAddedToCart
                ? "Added To Cart"
                : wishlistAction === "added"
                ? "Added to Wishlist"
                : "Removed from Wishlist"}
            </Text>
          </View>
        </View>
      )}

      {/* Cart Modal */}
      <Modal
        visible={cartModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeCartModal}
      >
        <Animated.View
          className="flex gap-8 items-center px-4 pt-4 pb-12"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fff",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -2 },
            zIndex: 200,
            transform: [{ translateY: panY }],
          }}
          {...panResponder.panHandlers}
        >
          <View className="items-center gap-6 justify-center ">
            <View className="w-[100px] h-[5px] rounded-full bg-black/15 " />
            <TouchableOpacity
              className="flex-row items-center gap-2 justify-center"
              onPress={() => setCartDropdownOpen((open) => !open)}
              activeOpacity={0.8}
            >
              <Text className="text-Heading3 text-text  ">{selectedCart}</Text>
              <AntDesign
                name={cartDropdownOpen ? "up" : "down"}
                size={20}
                color="#404040"
              />
            </TouchableOpacity>
          </View>
          {cartDropdownOpen && (
            <View className=" flex-1 gap-4">
              {carts.map((cart: Cart) => (
                <TouchableOpacity
                  key={cart.id}
                  className={`flex-row w-full items-center justify-between rounded-[16px] px-4 py-6  ${
                    selectedCartId === cart.id
                      ? "bg-transparent border-2 border-primary "
                      : "bg-white border border-neutral-40"
                  }`}
                  onPress={() => {
                    selectCart(cart.id);
                    setCartDropdownOpen(false);
                  }}
                >
                  <Text className=" text-BodyBold text-text">{cart.name}</Text>
                  <View className="flex-row items-center gap-4">
                    <Feather name="user-plus" size={24} color="#156651" />
                  </View>
                </TouchableOpacity>
              ))}
              {/* Add new cart as last dropdown item */}
              <View className="">
                <Button
                  BtnText="Create Cart"
                  bgColor="bg-neutral-10"
                  textColor="text-primary"
                  hasBorder={true}
                  borderColor="border-primary"
                  onPress={() => {
                    setCartDropdownOpen(false);
                    setCartModalVisible(false);
                    setTimeout(() => {
                      router.push({
                        pathname:
                          "/(root)/(checkout)/components/CreateCartScreen",
                        params: {
                          returnTo: "/(root)/(Home)/ProductDetail",
                          productId: String(product.id),
                        },
                      });
                    }, 100);
                  }}
                />
              </View>
            </View>
          )}
          {/* Quantity Selector */}
          <View className="flex-row gap-8 items-center ">
            <Text className="text-Heading5 text-text ">Qty:</Text>
            <View className="flex-row gap-2 items-center">
              <View className="flex-row gap-4  border border-neutral-60 items-center rounded-[8px]">
                <TouchableOpacity
                  className="h-full px-4 py-2 items-center"
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <AntDesign name="minus" size={24} color="#156651" />
                </TouchableOpacity>
                <Text className="text-BodySmallRegular text-center ">
                  {quantity}
                </Text>

                <TouchableOpacity
                  className="h-full py-2 px-4"
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <AntDesign name="plus" size={24} color="#156651" />
                </TouchableOpacity>
              </View>
              <Text className=" text-primary">In Stock</Text>
            </View>
          </View>
          {/* Confirm Add to Cart */}
          <PrimaryButton
            BtnText="Add to Cart"
            onPress={() => {
              // Find the selected cart object
              const cart = carts.find((c: Cart) => c.id === selectedCartId);
              if (!cart) return;
              // Find the selected shipping option object
              const shippingOption = product.shippingOptions
                ? product.shippingOptions.find(
                    (opt) => opt.type === selectedShipping
                  )
                : undefined;
              // Prepare CartItem
              const item = {
                id: Number(product.id), // Use backend product ID (number)
                image: selectedVariant?.image || product.productImage,
                title: product.name,
                name: product.name,
                price:
                  typeof (selectedVariant?.price || product.price) === "string"
                    ? parseFloat(selectedVariant?.price || product.price)
                    : selectedVariant?.price || product.price,
                oldPrice:
                  typeof product.originalPrice === "string"
                    ? parseFloat(product.originalPrice)
                    : product.originalPrice,
                color: selectedVariant?.color || "",
                quantity,
                shippingOption, // Add the selected shipping option
              };
              // Only add if not already in cart, or always add (idempotent)
              addItemToCart(cart.id, { ...item, id: String(product.id) }); // Ensure id is a string for CartItem type
              setShowAddedToCart(true);
              setTimeout(() => setShowAddedToCart(false), 1500);
              setCartDropdownOpen(false);
              setCartModalVisible(false);
              Animated.timing(panY, {
                toValue: 500,
                duration: 250,
                useNativeDriver: true,
              }).start(() => {
                panY.setValue(0);
                resetCartModal();
              });
            }}
          />
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetail;



