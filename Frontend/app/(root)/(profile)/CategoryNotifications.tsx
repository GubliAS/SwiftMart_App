import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

// Import your custom icon
const markAllReadIcon = require('@/assets/images/mark-all-read.png');

// Mock notifications by category
const mockNotifications: { [key: string]: { id: number; title: string; time: string; body: string; }[] } = {
  orders: [
    { id: 1, title: 'Order #1234 shipped', time: '2h ago', body: 'Your order has been shipped.' },
    { id: 2, title: 'Order #1234 delivered', time: '1d ago', body: 'Your order has been delivered.' },
  ],
  promotions: [
    { id: 1, title: 'Flash Sale!', time: '3h ago', body: '50% off on all electronics today only.' },
  ],
  play: [],
  prize: [],
  gogo: [],
};

const categoryTitles: { [key: string]: string } = {
  orders: 'Orders',
  promotions: 'Promotions',
  play: 'Play & Earn',
  prize: 'Prize Land',
  gogo: 'GoGo Match Notification',
};

const CategoryNotifications = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const notifications = mockNotifications[category as string] || [];

  return (
    <SafeAreaView className="flex-1 bg-white font-Manrope">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-6 pb-2 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#156651" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">
          {categoryTitles[category as string] || 'Notifications'}
        </Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Image source={markAllReadIcon} style={{ width: 28, height: 28 }} />
        </TouchableOpacity>
      </View>

      {/* Notifications List or Empty State */}
      <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-BodyBold text-neutral-60 mt-4 text-center">
              No notifications in this category yet.
            </Text>
          </View>
        ) : (
          <View className="space-y-4 pb-8">
            {notifications.map((notif: any) => (
              <View key={notif.id} className="bg-neutral-10 rounded-xl p-4 shadow-sm mb-4">
                <Text className="text-BodyBold text-text mb-1">{notif.title}</Text>
                <Text className="text-BodySmallRegular text-neutral-60 mb-2">{notif.body}</Text>
                <Text className="text-Caption text-neutral-40">{notif.time}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Mark All As Read Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-2xl p-6 pb-10 items-center">
            <Text className="text-Heading4 font-Manrope text-text mb-2">Mark All As Read?</Text>
            <Text className="text-BodySmallRegular text-neutral-60 mb-6">This action cannot be undone.</Text>
            <TouchableOpacity className="w-full bg-primary rounded-lg py-4 mb-2 items-center" onPress={() => setShowModal(false)}>
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

export default CategoryNotifications; 