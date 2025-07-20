import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import { Feather } from '@expo/vector-icons';
import { ChevronLeft } from 'lucide-react-native';
import productData from '@/constants/productData';

const markAllReadIcon = require('@/assets/images/mark-all-read.png');

// Mock notifications by category with read property
const mockNotifications: { [key: string]: { id: number; title: string; subtitle: string; read: boolean; }[] } = {
  orders: [
    { id: 1, title: 'Order #1234 shipped', subtitle: 'Your order has been shipped.', read: false },
    { id: 2, title: 'Order #1234 delivered', subtitle: 'Your order has been delivered.', read: true },
  ],
  promotions: [
    { id: 1, title: 'Flash Sale!', subtitle: '50% off on all electronics today only.', read: false },
  ],
  play: [],
  prize: [],
  gogo: [],
};

const messageCategories = [
  {
    key: 'orders',
    icon: <Feather name="shopping-bag" size={24} color="#156651" />,
    title: 'Orders',
    subtitle: 'View important order messages and replies',
  },
  {
    key: 'promotions',
    icon: <Feather name="percent" size={24} color="#E55000" />,
    title: 'Promotions',
    subtitle: 'Get discounts for you!',
  },
  {
    key: 'play',
    icon: <Feather name="gift" size={24} color="#EBB65B" />,
    title: 'Play & Earn',
    subtitle: 'Earn by daily spin',
  },
  {
    key: 'prize',
    icon: <Feather name="star" size={24} color="#EBB65B" />,
    title: 'Prize Land',
    subtitle: 'Get great prizes for fun!',
  },
  {
    key: 'gogo',
    icon: <Feather name="bell" size={24} color="#156651" />,
    title: 'GoGo Match Notification',
    subtitle: 'Get notified for matches',
  },
];

const moreToLoveProducts = [
  productData.find(p => p.id === 2), // UltraBook 14 Pro
  productData.find(p => p.id === 4), // Dumbbell Set
].filter(Boolean);

const Notifications = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Helper: check if a category has unread notifications
  const hasUnread = (categoryKey: string) => {
    return notifications[categoryKey]?.some((n: any) => !n.read);
  };

  // Helper: mark all as read
  const markAllAsRead = () => {
    const updated = { ...notifications };
    Object.keys(updated).forEach((cat) => {
      updated[cat] = updated[cat].map((n) => ({ ...n, read: true }));
    });
    setNotifications(updated);
    setShowModal(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white font-Manrope">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">Messages</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Image source={markAllReadIcon} style={{ width: 28, height: 28 }} />
        </TouchableOpacity>
      </View>

      {/* Notification Banner */}
      <View className="flex-row items-center justify-between bg-[#F4EDD8] px-4 py-3 mx-4 mt-2 rounded-xl border border-[#EBB65B]">
        <View className="flex-1">
          <Text className="text-BodyBold text-[#404040]">Enable seller notifications</Text>
          <Text className="text-BodySmallRegular text-[#404040] opacity-70">Get important notifications, messages and replies.</Text>
        </View>
        <TouchableOpacity className="ml-4 bg-[#EBB65B] px-4 py-2 rounded-lg">
          <Text className="text-white text-BodyBold">OK</Text>
        </TouchableOpacity>
      </View>

      {/* Message Categories */}
      <ScrollView className="flex-1 mt-4 px-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-2 mb-4">
          {messageCategories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.key}
              className="flex-row items-center py-3 px-2 border-b border-neutral-20 last:border-b-0"
              onPress={() => router.push({ pathname: '/(root)/(profile)/CategoryNotifications', params: { category: cat.key } })}
            >
              <View className="w-10 h-10 rounded-lg bg-[#F4EDD8] items-center justify-center mr-3">
                {cat.icon}
              </View>
              <View className="flex-1">
                <Text className="text-BodyBold text-text">{cat.title}</Text>
                <Text className="text-BodySmallRegular text-neutral-60">{cat.subtitle}</Text>
              </View>
              {hasUnread(cat.key) && <View className="w-2 h-2 bg-primary rounded-full ml-2" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* All Notifications List */}
        <Text className="text-BodyBold text-text mb-2">All Notifications</Text>
        <View className="space-y-2 mb-8">
          {Object.entries(notifications).flatMap(([catKey, notifs]) =>
            (notifs as any[]).map((notif) => (
              <View key={catKey + notif.id} className="flex-row items-center bg-neutral-10 rounded-xl p-4 mb-2">
                {!notif.read && <View className="w-2 h-2 bg-primary rounded-full mr-2" />}
                <View className="flex-1">
                  <Text className={`text-BodyBold ${!notif.read ? 'text-text' : 'text-neutral-60'}`}>{notif.title}</Text>
                  <Text className="text-BodySmallRegular text-neutral-60">{notif.subtitle}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* More to Love Section */}
        <Text className="text-BodyBold text-text mb-2">More to Love</Text>
        <View className="flex-row gap-4 mb-8">
          {moreToLoveProducts.map((product) => (
            product ? (
              <TouchableOpacity
                key={product.id}
                className="w-[48%]"
                onPress={() => router.push({ pathname: '/(root)/(Home)/ProductDetail', params: { productId: product.id } })}
              >
                <ProductCard
                  {...product}
                  price={Number(product.price)}
                  originalPrice={Number(product.originalPrice)}
                  discount={product.discount ? Number(product.discount) : undefined}
                />
              </TouchableOpacity>
            ) : null
          ))}
        </View>
      </ScrollView>

      {/* Mark All As Read Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-2xl p-6 pb-10 items-center">
            <Text className="text-Heading4 font-Manrope text-text mb-2">Mark All As Read?</Text>
            <Text className="text-BodySmallRegular text-neutral-60 mb-6">This action cannot be undone.</Text>
            <TouchableOpacity className="w-full bg-primary rounded-lg py-4 mb-2 items-center" onPress={markAllAsRead}>
              <Text className="text-white text-BodyBold">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full bg-[#F4EDD8] rounded-lg py-4 items-center" onPress={() => setShowModal(false)}>
              <Text className="text-primary text-BodyBold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Notifications; 