import React, { useState } from 'react';
import { View, Text, TextInput, Clipboard, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, X, Copy } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import Button from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/app/context/_CartContext';
import { useAuth } from '@/context/AuthContext';

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
  const { addCart, carts } = useCart(); // Fix: destructure carts
  const { token } = useAuth();
  const params = useLocalSearchParams();

  const handleCreateCart = async () => {
    if (!token) {
      Alert.alert(
        'Login Required',
        'Please log in to create a new cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/Login') }
        ]
      );
      return;
    }
    if (!cartName.trim()) return;
    const newCart: any = await addCart(cartName.trim());
    if (newCart && newCart.id) {
      const newCartLink = `https://swiftmart.tg/split-cart/invite?${newCart.id}`;
      setCartLink(newCartLink);
      setSuccessModalVisible(true);
    } else {
      Alert.alert('Error', 'Failed to create cart. Please try again.');
    }
  };

  const handleCopy = () => {
    Clipboard.setString(cartLink);
    Alert.alert('Copied!', 'Cart link copied to clipboard.');
  };

  const handleCloseSuccess = () => {
    setSuccessModalVisible(false);
    setCartName('');
    setCartLink('');
    // If returnTo param is provided, go back to ProductDetail with productId
    if (params.returnTo && params.productId) {
      router.replace({
        pathname: params.returnTo as any,
        params: {
          productId: params.productId as string,
          closeCartModal: "true",
        },
      });
    } else {
      router.push('/(root)/(tabs)/CartScreen');
        }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView className="flex-1 bg-white p-5">
        {/* Header */}
        <View className="flex-row items-center mt-10 mb-6">
          <TouchableOpacity onPress={() => {
            if (params.returnTo && params.productId) {
              router.replace({
                pathname: params.returnTo as any,
                params: {
                  productId: params.productId as string,
                  closeCartModal: "true",
                },
              });
            } else {
              router.back();
            }
          }}>
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
    </KeyboardAvoidingView>
  );
};

export default CreateCartScreen;
