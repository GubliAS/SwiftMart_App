import React, { useState } from 'react';
import { View, Text, TextInput, Clipboard, Alert, TouchableOpacity, Modal } from 'react-native';
import { ChevronLeft, X, Copy } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

type Cart = {
  id: string;
  name: string;
  items: any[];
  invited: string[];
};

const CreateCartScreen = () => {
  const [cartName, setCartName] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [cartLink, setCartLink] = useState('');
  const [newCart, setNewCart] = useState<Cart | null>(null);
  const router = useRouter();

  const handleCreateCart = () => {
    if (!cartName.trim()) return;
    const newCartId = Date.now().toString();
    const cartData = {
      id: newCartId,
      name: cartName.trim(),
      items: [],
      invited: []
    };
    setNewCart(cartData);
    const newCartLink = `https://swiftmart.tg/split-cart/invite?${newCartId}`;
    setCartLink(newCartLink);
    setSuccessModalVisible(true);
  };

  const handleCopy = () => {
    Clipboard.setString(cartLink);
    Alert.alert('Copied!', 'Cart link copied to clipboard.');
  };

  const handleCloseSuccess = () => {
    setSuccessModalVisible(false);
    if (newCart) {
      router.push({
        pathname: '../CartScreen',
        params: { newCart: JSON.stringify(newCart) }
      });
    }
    setCartName('');
    setCartLink('');
    setNewCart(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      {/* Header */}
      <View className="flex-row items-center mt-10 mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#222" />
        </TouchableOpacity>
        <Text className="text-Heading3 ml-24">Create Cart</Text>
      </View>

      {/* Cart Creation Form */}
      <Text className="text-base text-text mb-4 mt-8">What is the name of the cart?</Text>
      <TextInput
        placeholder="Enter Cart Name"
        value={cartName}
        onChangeText={setCartName}
        className="border border-gray-200 rounded-lg p-3 mb-6 text-base bg-white"
        autoFocus
      />
      
      <View className="mt-8">
        <Button
          BtnText="Create Cart"
          bgColor={cartName ? "bg-primary" : "bg-primary"}
          textColor="text-neutral-10"
          hasBorder={true}
          borderColor='border-primary'
          disabled={!cartName}
          onPress={handleCreateCart}
        />
      </View>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto">
            {/* Header */}
            <View className="mb-6">
              <TouchableOpacity 
                onPress={handleCloseSuccess}
                className="absolute right-0 top-0 p-1 z-10"
              >
                <X size={24} color="#222" />
              </TouchableOpacity>
              <Text className="font-Manrope text-Heading4 text-text text-center mx-auto">
                Cart created successfully
              </Text>
            </View>

            {/* Description */}
            <Text className="text-BodyRegular text-neutral-70 text-center mb-4">
              Copy this link to invite others
            </Text>

            {/* Link Box */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between bg-white rounded-lg border border-neutral-20 p-3">
                <Text 
                  className="flex-1 text-neutral-50 text-BodyRegular mr-2" 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {cartLink}
                </Text>
                <TouchableOpacity 
                  onPress={handleCopy}
                  className="p-1"
                >
                  <Copy size={20} color="#156651" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity 
              onPress={handleCloseSuccess}
              className="bg-primary py-4 rounded-xl"
            >
              <Text className="text-neutral-10 font-Manrope text-BodyBold text-center">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateCartScreen;
