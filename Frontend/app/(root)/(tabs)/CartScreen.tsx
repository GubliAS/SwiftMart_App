import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";
import CartItem from "@/app/(root)/(checkout)/components/CartItem";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import InvitedList from "@/app/(root)/(checkout)/components/InvitedList";
import ShoppingCartTotalModal from "@/app/(root)/(checkout)/components/ShoppingCartTotalModal";
import { useCart } from "@/app/context/_CartContext";
import { useAuth } from '@/context/AuthContext';
import productData from '@/constants/productData';
import PrimaryButton from '@/components/PrimaryButton';


const CartScreen = () => {
  const params = useLocalSearchParams();
  // const [_, ] = useState(cartObject);
  const cartContext = useCart();
  const { carts, removeCart, setSelectedCartId, selectedCartId, updateItemQuantity, handleRemovePerson, cartReady } = cartContext; // Use the cart context
  // const [selectedCartId, setSelectedCartId] = useState("default");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [showCartList, setShowCartList] = useState(false);
  const { token } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // If not logged in, always show only the default cart
  const isGuest = !token;
  const guestCart = carts.find((cart) => cart.id === "default") || { id: "default", name: "My Cart", items: [], invited: [] };
  const displayCarts = isGuest ? [guestCart] : carts;
  const displaySelectedCartId = isGuest ? "default" : selectedCartId;
  const selectedCart = displayCarts.find((cart) => cart.id === displaySelectedCartId) || displayCarts[0];

  // ✅ FIXED: Safe cart creation without overwriting existing carts
  useEffect(() => {
    if (params.newCart) {
      try {
        const incoming = JSON.parse(params.newCart as string);

        if (!incoming.id || !incoming.name) {
          console.warn("Missing required cart fields.");
          return;
        }

        const cartExists = carts.some((cart) => cart.id === incoming.id);

        if (!cartExists) {
          const newCart = {
            id: incoming.id,
            name: incoming.name,
            items: Array.isArray(incoming.items) ? incoming.items : [],
            invited: Array.isArray(incoming.invited) ? incoming.invited : [],
          };

          // setCarts((prev) => [...prev, newCart]);
          setSelectedCartId(newCart.id);
          setShowCartList(false);
        }
      } catch (err) {
      }
    }
  }, [params.newCart]);

  useEffect(() => {
    // Only run for logged-in users
    if (!isGuest && displayCarts.length > 0) {
      // If selectedCartId is missing, invalid, or 'default', set it to the first available cart
      const valid = displayCarts.some(cart => cart.id === selectedCartId);
      if (!valid || selectedCartId === "default" || selectedCartId == null) {
        setSelectedCartId(displayCarts[0].id);
      }
    }
  }, [isGuest, displayCarts, selectedCartId, setSelectedCartId]);

  // Merge product details into cart items
  const mergedCartItems = (selectedCart?.items || []).map((item) => {
    // Try to find product details by productItemId (item.productItemId or item.id)
    const productId = (item as any).productItemId !== undefined ? Number((item as any).productItemId) : Number(item.id);
    const product = productData.find((p) => p.id === productId);
    return {
      ...item,
      price: product ? Number(product.price) : 0,
      oldPrice: product ? Number(product.originalPrice) : 0,
      title: product ? product.name : item.name || 'Product',
      image: product ? product.image : undefined,
      shippingOption: product && product.shippingOptions ? product.shippingOptions[0] : undefined,
    };
  });

  const subtotal =
    mergedCartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    ) || 0;

  const shipping = mergedCartItems.reduce((sum, item) => sum + (item.shippingOption?.price || 0), 0) || 0;
  const total = subtotal + shipping;

  const handleCreateCartPress = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    router.push("/(root)/(checkout)/components/CreateCartScreen");
    setShowCartList(false);
  };

  if (!cartReady) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-20 p-4 justify-center items-center">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text className="text-lg mb-2">Loading your cart...</Text>
          <ActivityIndicator size="large" color="#156651" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-10 p-4">
     
      <View className="mb-4   z-50"  style={{ marginTop: 24 }}>
        <View className="flex-row px-4 items-center  pb-2">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center"
            onPress={() => setShowCartList(!showCartList)}
          >
           
            <Text className="font-semibold  text-[30px]">
              {selectedCart?.name}
            </Text>
            {showCartList ? (
              <Entypo
                name="chevron-up"
                size={20}
                color="black"
                className="ml-2"
              />
            ) : (
              <Entypo
                name="chevron-down"
                size={20}
                color="black"
                className="ml-2"
              />
            )}
          </TouchableOpacity>

          {displaySelectedCartId !== "default" ? (
            <TouchableOpacity
              className="w-16 absolute right-4 items-center"
              onPress={() => setIsInviteVisible(true)}
            >
              <Ionicons name="person-add-outline" size={28} color="#156651" />
              {(selectedCart?.invited?.length ?? 0) > 0 && (
                <View className="absolute -top-1 right-0 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                  <Text className="text-white text-xs">
                    {selectedCart?.invited?.length ?? 0}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View className="" />
          )}
        </View>

        {showCartList && (
          <View className="bg-transparent  shadow p-4 rounded-lg max-h-60">
            <ScrollView showsVerticalScrollIndicator={false}>
              {displayCarts.map((cart) => (
                <TouchableOpacity
                  key={cart.id}
                  onPress={() => {
                    setSelectedCartId(cart.id);
                    setShowCartList(false);
                  }}
                  className="flex  bg-white py-3 rounded-xl px-4 h-[50px] flex-row justify-between items-center mb-3"
                >
                  <Text
                    style={{ fontSize: 16 }}
                    className={`${
                      cart.id === displaySelectedCartId ? "font-bold text-primary" : ""
                    }`}
                  >
                    {cart.name}
                  </Text>

                  {cart.id === "default" ? (
                    <Text
                      style={{ color: "#888", fontSize: 14, marginLeft: 8 }}
                    >
                      (default)
                    </Text>
                  ) : (
                    <View className="flex-row items-center  gap-4">
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedCartId(cart.id);
                          setShowCartList(false);
                          setIsInviteVisible(true);
                        }}
                      >
                        <Ionicons
                          name="person-add-outline"
                          size={20}
                          color="#156651"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removeCart(cart.id)}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={20}
                          color="#156651"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <Button
                BtnText="Create New Cart"
                bgColor="bg-white"
                textColor="text-primary"
                hasBorder={true}
                disabled={!cartReady}
                onPress={cartReady ? handleCreateCartPress : undefined}
              />
            </ScrollView>
          </View>
        )}
      </View>

      <ScrollView contentContainerClassName="px-4" showsVerticalScrollIndicator={false}>
        <FlatList
        className="overflow-visible"
          data={
            (selectedCart?.items || []).map((item) => {
              // Try to find product details by productItemId (item.productItemId or item.id)
              const productId = (item as any).productItemId !== undefined ? Number((item as any).productItemId) : Number(item.id);
              const product = productData.find((p) => p.id === productId);
              return {
                ...item,
                price: product ? Number(product.price) : 0,
                oldPrice: product ? Number(product.originalPrice) : 0,
                title: product ? product.name : item.name || 'Product',
                image: product ? product.image : undefined,
                shippingOption: product && product.shippingOptions ? product.shippingOptions[0] : undefined,
              };
            })
          }
          keyExtractor={(item) => item.id?.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <CartItem
              {...item}
              onDecrease={() => cartReady && cartContext.updateItemQuantity(cartContext.selectedCartId, item.productItemId || item.id, -1, item.size ?? null)}
              onIncrease={() => cartReady && cartContext.updateItemQuantity(cartContext.selectedCartId, item.productItemId || item.id, 1, item.size ?? null)}
            />
          )}
        />
      </ScrollView>

      <TouchableOpacity
        className="bg-primary shadow-slate-950 shadow-xl p-4 rounded-2xl mb-2 absolute bottom-6 right-4 w-16 h-16"
        onPress={() => setIsModalVisible(true)}
      >
        <AntDesign name="shoppingcart" size={24} color="white" />
      </TouchableOpacity>

      <ShoppingCartTotalModal
        isVisible={isModalVisible}
        subtotal={subtotal}
        shipping={shipping}
        onClose={() => setIsModalVisible(false)}
        showCheckoutButton={true}
        disableCheckout={!cartReady || !selectedCart?.items || selectedCart.items.length === 0}
        onCheckout={() => {
          if (!selectedCart?.items || selectedCart.items.length === 0) return;
          setIsModalVisible(false);
          if (!token) {
            router.push('/(auth)/Login');
            return;
          }
          router.push({
            pathname: "/(root)/(checkout)/CheckoutScreen",
            params: { cart: JSON.stringify(selectedCart) },
          });
        }}
      />

      <Modal
        visible={isInviteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsInviteVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setIsInviteVisible(false)}
        >
          <View style={{ justifyContent: "center", margin: 20 }}>
            <InvitedList
              people={selectedCart?.invited || []}
              onRemove={()=> handleRemovePerson(displaySelectedCartId, "")}
              onClose={() => setIsInviteVisible(false)}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Login Required Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-2xl p-8 w-80 shadow-lg items-center">
            <Text className="text-Heading3 text-text font-Manrope mb-2">Login Required</Text>
            <Text className="text-BodySmallRegular text-neutral-60 text-center mb-6">Please log in to create a new cart and share with others.</Text>
            <View className="flex-row gap-4 mt-2 w-full">
            <View className="flex-1">
              <Button
                BtnText="Cancel"
                bgColor="bg-neutral-20"
                textColor="text-text"
                borderColor="border-neutral-40"
                hasBorder={true}
                onPress={() => setShowLoginModal(false)}
              />
            
            </View>
            <View className="flex-1">
              <PrimaryButton
                BtnText="Login"
                onPress={() => {
                  setShowLoginModal(false);
                  router.push('/(auth)/Login');
                }}
              />
            
            </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;
