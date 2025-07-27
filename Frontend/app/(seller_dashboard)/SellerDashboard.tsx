// SellerDashboardScreen.tsx
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
const headerBg = require('../../assets/images/seller_db.png');
import { SafeAreaView } from 'react-native-safe-area-context';

// Reusable Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  icon?: string; // Optional icon name for specific cards like rating
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <View className="w-[48%] mb-4 flex flex-col justify-center items-start px-4" style={{ backgroundColor: 'rgba(235,182,91,0.1)', borderRadius: 16, height: 95 }}>
    <Text className="text-neutral-50 mb-1 text-[16px]">{title}</Text>
    <View className="flex-row items-center">
      <Text className="font-bold text-gray-900 text-[24px]">{value}</Text>
      {icon && <Ionicons name={icon as any} size={20} color="#FFD700" style={{ marginLeft: 5 }} />}
    </View>
  </View>
);

// Reusable Quick Action Item Component
interface QuickActionItemProps {
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof FontAwesome5.glyphMap; // Allow different icon sets
  iconColor: string;
  iconBg: string;
  label: string;
  onPress: () => void;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
}

const quickActionColors: Record<string, { icon: string; bg: string }> = {
  add: { icon: '#4CAF50', bg: 'rgba(76,175,80,0.08)' }, // green
  'briefcase-outline': { icon: '#2196F3', bg: 'rgba(33,150,243,0.08)' }, // blue
  'clipboard-list-outline': { icon: '#9C27B0', bg: 'rgba(156,39,176,0.08)' }, // purple
  'cash-outline': { icon: '#FFC107', bg: 'rgba(255,193,7,0.08)' }, // yellow
  'settings-outline': { icon: '#757575', bg: 'rgba(158,158,158,0.08)' }, // gray
  'megaphone-outline': { icon: '#FF5722', bg: 'rgba(255,87,34,0.08)' }, // orange
};

const QuickActionItem: React.FC<QuickActionItemProps> = ({ iconName, iconColor, iconBg, label, onPress, iconType = 'Ionicons' }) => {
  const IconComponent =
    iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
    iconType === 'FontAwesome5' ? FontAwesome5 :
    Ionicons;

  // Use solid color for icon and pale version for background
  const colorSet = quickActionColors[iconName as string] || { icon: iconColor, bg: iconBg };

  return (
    <TouchableOpacity className="items-center mb-6" style={{ width: 167, height: 123 }} onPress={onPress}>
      <View className="w-10 h-10 rounded-full justify-center items-center mb-2" style={{ backgroundColor: colorSet.bg }}>
        <IconComponent name={iconName as any} size={20} color={colorSet.icon} />
      </View>
      <Text className="text-base font-bold text-black text-center mt-1">{label}</Text>
    </TouchableOpacity>
  );
};

const SellerDashboardScreen: React.FC = () => {
  const router = useRouter();

  const handleLeaveSellerMode = () => {
    // Navigate to the home screen
    router.push('/(root)/(tabs)/Home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* The header is now inside the ScrollView, so it scrolls away with content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-4 mt-0 mb-4 rounded-2xl overflow-hidden shadow-lg">
          <ImageBackground source={headerBg} resizeMode="cover" className="w-full" style={{ minHeight: 160, height: 160, justifyContent: 'center' }}>
            <View className="p-6">
              <Text className="font-bold text-white mb-1 text-[32px]">Dashboard</Text>
              <Text className="font-bold text-white/80 text-[24px]">Welcome back, <Text className="font-bold text-white text-[32px]">Claire</Text></Text>
            </View>
          </ImageBackground>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between px-4 mb-5">
          <StatCard title="Total Products" value="42" />
          <StatCard title="Pending Orders" value="7" />
          <StatCard title="Sales This Week" value="$1,245" />
          <StatCard title="Store Rating" value="4.8" icon="star" />
        </View>

        {/* Quick Actions Section */}
        <Text accessibilityRole="header" aria-level={1} className="text-Heading3 text-text font-Manrope ml-5 mb-6 mt-2">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between px-6 mb-8">
          <QuickActionItem
            iconName="add-circle-outline"
            iconColor="#4CAF50"
            iconBg="rgba(76,175,80,0.08)"
            label="Add Product"
            onPress={() => router.push('/AddProductScreen')}
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="bag-outline"
            iconColor="#2196F3"
            iconBg="rgba(33,150,243,0.08)"
            label="My Products"
            onPress={() => router.push('/MyProducts')}
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="clipboard-outline"
            iconColor="#9C27B0"
            iconBg="rgba(156,39,176,0.08)"
            label="Orders"
            onPress={() => router.push('/Orders')}
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="logo-usd"
            iconColor="#FFC107"
            iconBg="rgba(255,193,7,0.1)"
            label="Earnings"
            onPress={() => router.push('/OrderEarnings')}
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="settings-outline"
            iconColor="#757575"
            iconBg="rgba(158,158,158,0.08)"
            label="Settings"
            onPress={() => router.push('/SellerSettings')}
            iconType="Ionicons"
          />
          <QuickActionItem
            iconName="megaphone-outline"
            iconColor="#FF5722"
            iconBg="rgba(255,87,34,0.08)"
            label="Promotions"
            onPress={() => router.push('/Promotions')}
            iconType="Ionicons"
          />
        </View>

        {/* Leave Seller Mode Button */}
       
        <TouchableOpacity className="bg-alert mx-5 flex-row justify-center items-center mb-8 shadow" style={{ height: 88, borderRadius: 16 }} onPress={handleLeaveSellerMode}>
          <Ionicons name="exit-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text className="text-white text-base font-bold">Leave Seller Mode</Text>
        </TouchableOpacity>

        {/* Recent Activity Section */}
        <Text accessibilityRole="header" aria-level={1} className="text-Heading3 text-text font-Manrope ml-5 mb-3">Recent Activity</Text>
        <View className="w-full flex items-center mb-8">
          {/* Example Recent Activity Item 1 */}
          <View className="bg-white rounded-2xl shadow px-5 py-4 mb-6 flex-row items-center" style={{ height: 126, maxWidth: 370, width: '100%' }}>
            <Ionicons name="bag-outline" size={32} color="#22C55E" style={{ marginRight: 16 }} />
            <View className="flex-1 flex-col justify-between h-full">
              <View className="flex-row justify-between items-start">
                <Text className="font-black text-gray-900 text-[16px]">New order received</Text>
                <Text className="text-[11px] text-neutral-400 mt-0.5">2h ago</Text>
              </View>
              <Text className="text-[12px] text-neutral-500 mt-1">Order <Text className="font-black text-gray-900">#SWM93284</Text></Text>
              <Text className="text-[12px] text-neutral-500 mt-0.5">Total Amount: <Text className="font-black text-gray-900">$274.13</Text></Text>
              <Text className="text-[12px] text-neutral-500 mt-0.5">Size: <Text className="font-black text-gray-900">2</Text></Text>
            </View>
          </View>

          {/* Example Recent Activity Item 2 */}
          <View className="bg-white rounded-2xl shadow px-5 py-4 mb-6 flex-row items-center" style={{ height: 126, maxWidth: 370, width: '100%' }}>
            <Ionicons name="bag-outline" size={32} color="#22C55E" style={{ marginRight: 16 }} />
            <View className="flex-1 flex-col justify-between h-full">
              <View className="flex-row justify-between items-start">
                <Text className="font-black text-gray-900 text-[16px]">New order received</Text>
                <Text className="text-[11px] text-neutral-400 mt-0.5">9h ago</Text>
              </View>
              <Text className="text-[12px] text-neutral-500 mt-1">Order <Text className="font-black text-gray-900">#SPK93284</Text></Text>
              <Text className="text-[12px] text-neutral-500 mt-0.5">Total Amount: <Text className="font-black text-gray-900">$109.13</Text></Text>
              <Text className="text-[12px] text-neutral-500 mt-0.5">Size: <Text className="font-black text-gray-900">1</Text></Text>
            </View>
          </View>

          {/* Example Recent Activity Item 3 */}
          <View className="bg-white rounded-2xl shadow px-5 py-4 flex-row items-center" style={{ height: 126, maxWidth: 370, width: '100%' }}>
            <Ionicons name="bag-outline" size={32} color="#22C55E" style={{ marginRight: 16 }} />
            <View className="flex-1 flex-col justify-between h-full">
              <View className="flex-row justify-between items-start">
                <Text className="font-black text-gray-900 text-[16px]">New order received</Text>
                <Text className="text-[11px] text-neutral-400 mt-0.5">2h ago</Text>
              </View>
              <Text className="text-[12px] text-neutral-500 mt-1">Order <Text className="font-black text-gray-900">#SWM93284</Text></Text>
              <Text className="text-[12px] text-neutral-500 mt-0.5">Total Amount: <Text className="font-black text-gray-900">$274.13</Text></Text>
              <Text className="text-[12px] text-neutral-500 mt-0.5">Size: <Text className="font-black text-gray-900">2</Text></Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellerDashboardScreen;