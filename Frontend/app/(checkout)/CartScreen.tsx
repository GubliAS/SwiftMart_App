import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native';
import CartItem from "./components/CartItem";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import InvitedList from "./components/InvitedList";
import ShoppingCartTotalModal from "./components/ShoppingCartTotalModal";
import Modal from "react-native-modal";

const cartObject = [
  {
    id: "default",
    name: "My Cart",
    items: [
      {
        id: "1",
        image: require("../../assets/images/yellow-chair.png"),
        title: "EKERÖ",
        price: 230.0,
        oldPrice: 512.58,
        color: "Yellow",
        quantity: 1,
      },
      {
        id: "2",
        image: require("../../assets/images/yellow-chair.png"),
        title: "STRANDMON",
        price: 274.13,
        oldPrice: 865.66,
        color: "Grey",
        quantity: 1,
      },
    ],
    invited: [],
  },
  {
    id: "newcart",
    name: "Christmas Cart",
    items: [
      {
        id: "1",
        image: require("../../assets/images/yellow-chair.png"),
        title: "EKERÖ",
        price: 230.0,
        oldPrice: 512.58,
        color: "Yellow",
        quantity: 1,
      },
      {
        id: "2",
        image: require("../../assets/images/yellow-chair.png"),
        title: "STRANDMON",
        price: 274.13,
        oldPrice: 865.66,
        color: "Grey",
        quantity: 1,
      },
    ],
    invited: ["user1@example.com", "user2@example.com"],
  },
];

const CartScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [carts, setCarts] = useState(cartObject);
  const [selectedCartId, setSelectedCartId] = useState("default");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [showCartList, setShowCartList] = useState(false);

  // Handle new cart creation
  useEffect(() => {
    if (params.newCart) {
      const newCart = JSON.parse(params.newCart as string);
      setCarts(prevCarts => [...prevCarts, newCart]);
      setSelectedCartId(newCart.id);
    }
  }, [params.newCart]);

  const selectedCart = carts.find((cart) => cart.id === selectedCartId);

  const updateQuantity = (itemId: string, amount: number) => {
    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === selectedCartId
          ? {
              ...cart,
              items: cart.items.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                  : item
              ),
            }
          : cart
      )
    );
  };

  const handleDeleteCart = (cartId: string) => {
    if (cartId === "default") return;

    Alert.alert("Delete Cart", "Are you sure you want to delete this cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setCarts((prevCarts) => prevCarts.filter((cart) => cart.id !== cartId));
          if (selectedCartId === cartId) {
            setSelectedCartId("default");
          }
        },
      },
    ]);
  };

  const handleRemovePerson = (person: string) => {
    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === selectedCartId
          ? {
              ...cart,
              invited: cart.invited.filter((p) => p !== person),
            }
          : cart
      )
    );
  };

  const subtotal =
    selectedCart?.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

  const shipping = 5.99;
  const total = subtotal + shipping;

  const handleCreateCartPress = () => {
    router.push('./components/CreateCartScreen'); // Changed to navigate to CreateCartScreen
    setShowCartList(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-20 p-4">
      {/* Header */}
      <View className="flex-row items-center p-4" style={{ marginTop: 24 }}>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push('/')}
        >
          <Entypo name="chevron-left" size={24} color="#156651" />
          <Text className="text-BodyRegular font-Manrope text-primary ml-2">Go To Home</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Selection */}
      <View className="mb-4 z-50">
        <TouchableOpacity
          style={{ position: "relative", alignItems: "center" }}
          onPress={() => setShowCartList(!showCartList)}
          className="w-full gap-2 flex-row items-center justify-center border-b border-neutral-30 pb-2"
        >
          <View className="flex-row items-center justify-center w-full">
            <Text className="font-semibold text-[30px]">{selectedCart?.name}</Text>
            {showCartList ? (
              <Entypo name="chevron-up" size={20} color="black" />
            ) : (
              <Entypo name="chevron-down" size={20} color="black" />
            )}
          </View>

          {selectedCartId !== "default" && (
            <TouchableOpacity
              style={{ position: "absolute", right: 0, top: 5 }}
              onPress={() => setIsInviteVisible(true)}
            >
              <Ionicons name="person-add-outline" size={28} color="#156651" />
              {(selectedCart?.invited?.length ?? 0) > 0 && (
                <View className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                  <Text className="text-white text-xs">{(selectedCart?.invited?.length ?? 0)}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {showCartList && (
          <View className="bg-transparent w-full shadow p-4 rounded-lg max-h-60">
            <ScrollView showsVerticalScrollIndicator={false}>
              {carts.map((cart) => (
                <TouchableOpacity
                  key={cart.id}
                  onPress={() => {
                    setSelectedCartId(cart.id);
                    setShowCartList(false);
                  }}
                  className="flex bg-white py-3 rounded-xl px-8 h-[50px] flex-row justify-between items-center mb-3"
                >
                  <Text
                    style={{ fontSize: 16 }}
                    className={`${cart.id === selectedCartId ? "font-bold text-primary" : ""}`}
                  >
                    {cart.name}
                  </Text>

                  {cart.id === "default" ? (
                    <Text style={{ color: "#888", fontSize: 14, marginLeft: 8 }}>(default)</Text>
                  ) : (
                    <View className="flex-row items-center gap-4">
                      <Ionicons
                        name="person-add-outline"
                        size={20}
                        color="#156651"
                      />
                      <TouchableOpacity onPress={() => handleDeleteCart(cart.id)}>
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
                disabled={false}
                onPress={handleCreateCartPress} // Updated to use the new handler
              />
            </ScrollView>
          </View>
        )}
      </View>

      {/* Cart Items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={selectedCart?.items || []}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <CartItem
              {...item}
              onDecrease={() => updateQuantity(item.id, -1)}
              onIncrease={() => updateQuantity(item.id, 1)}
            />
          )}
        />
      </ScrollView>

      {/* Cart Total Button */}
      <TouchableOpacity
        className="bg-primary shadow-slate-950 shadow-xl p-4 rounded-2xl mb-2 absolute bottom-6 right-4 w-16 h-16"
        onPress={() => setIsModalVisible(true)}
      >
        <AntDesign name="shoppingcart" size={24} color="white" />
      </TouchableOpacity>

      {/* Cart Total Modal */}
      <ShoppingCartTotalModal
        isVisible={isModalVisible}
        subtotal={subtotal}
        shipping={shipping}
        onClose={() => setIsModalVisible(false)}
        showCheckoutButton={true}
        onCheckout={() => {
          setIsModalVisible(false);
          router.push({
            pathname: '/(checkout)/CheckoutScreen',
            params: { cart: JSON.stringify(selectedCart) }
          });
        }}
      />

      {/* Invite List Modal */}
      <Modal
        isVisible={isInviteVisible}
        onBackdropPress={() => setIsInviteVisible(false)}
        style={{ justifyContent: "center", margin: 20 }}
      >
        <InvitedList
          people={selectedCart?.invited || []}
          onRemove={handleRemovePerson}
          onClose={() => setIsInviteVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;