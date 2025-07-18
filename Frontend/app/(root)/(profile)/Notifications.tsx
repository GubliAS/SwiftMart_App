import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "expo-router";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock notification data for buyer app
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "Order Shipped! 🚚",
    message: "Your order #SWM-2024-001 has been shipped and is on its way to you.",
    time: "2 minutes ago",
    read: false,
    icon: "truck",
    iconColor: "#156651",
  },
  {
    id: 2,
    type: "promotion",
    title: "Flash Sale Alert! ⚡",
    message: "50% OFF on all electronics! Limited time offer, ends in 2 hours.",
    time: "1 hour ago",
    read: false,
    icon: "zap",
    iconColor: "#E55000",
  },
  {
    id: 3,
    type: "delivery",
    title: "Package Delivered! 📦",
    message: "Your package has been delivered to your doorstep. Enjoy your purchase!",
    time: "3 hours ago",
    read: true,
    icon: "package",
    iconColor: "#156651",
  },
  {
    id: 4,
    type: "announcement",
    title: "New Features Available! ✨",
    message: "We've added wishlist sharing and group buying features. Check them out!",
    time: "1 day ago",
    read: true,
    icon: "star",
    iconColor: "#EBB65B",
  },
  {
    id: 5,
    type: "order",
    title: "Order Confirmed! ✅",
    message: "Your order #SWM-2024-002 has been confirmed and is being processed.",
    time: "2 days ago",
    read: true,
    icon: "check-circle",
    iconColor: "#156651",
  },
  {
    id: 6,
    type: "promotion",
    title: "Birthday Special! 🎉",
    message: "Happy Birthday! Enjoy 20% OFF on your next purchase with code BDAY20.",
    time: "3 days ago",
    read: true,
    icon: "gift",
    iconColor: "#E55000",
  },
  {
    id: 7,
    type: "delivery",
    title: "Delivery Update 📍",
    message: "Your package is out for delivery. Expected arrival: 2-4 PM today.",
    time: "4 days ago",
    read: true,
    icon: "map-pin",
    iconColor: "#156651",
  },
];

const Notifications = () => {
  const router = useRouter();
  const {
    newOrderNotification,
    setNewOrderNotification,
    lowStockNotification,
    setLowStockNotification,
    swiftMartAnnouncements,
    setSwiftMartAnnouncements,
  } = useNotification();

  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (iconName: string) => {
    switch (iconName) {
      case "truck":
        return <Feather name="truck" size={20} color="#156651" />;
      case "zap":
        return <Feather name="zap" size={20} color="#E55000" />;
      case "package":
        return <Feather name="package" size={20} color="#156651" />;
      case "star":
        return <Feather name="star" size={20} color="#EBB65B" />;
      case "check-circle":
        return <Feather name="check-circle" size={20} color="#156651" />;
      case "gift":
        return <Feather name="gift" size={20} color="#E55000" />;
      case "map-pin":
        return <Feather name="map-pin" size={20} color="#156651" />;
      default:
        return <Feather name="bell" size={20} color="#156651" />;
    }
  };

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-white font-Manrope">
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => router.replace('/(root)/(tabs)/Profile')} 
          className="mr-2"
        >
          <Feather name="chevron-left" size={28} color="#404040" />
        </TouchableOpacity>
        <Text className="text-Heading3 font-Manrope text-text flex-1 text-center">
          Notifications
        </Text>
        <TouchableOpacity 
          onPress={markAllAsRead}
          className="ml-2"
        >
          <Text className="text-BodySmallBold text-primary">Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-3 px-4 rounded-lg mr-2 ${
            activeTab === "all" ? "bg-primary" : "bg-neutral-10"
          }`}
        >
          <Text
            className={`text-BodyBold text-center ${
              activeTab === "all" ? "text-white" : "text-text"
            }`}
          >
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("unread")}
          className={`flex-1 py-3 px-4 rounded-lg ml-2 ${
            activeTab === "unread" ? "bg-primary" : "bg-neutral-10"
          }`}
        >
          <Text
            className={`text-BodyBold text-center ${
              activeTab === "unread" ? "text-white" : "text-text"
            }`}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      <View className="px-4 mb-4">
        <Text className="text-BodyBold text-text mb-3">Notification Preferences</Text>
        <View className="bg-neutral-10 rounded-14 p-4 space-y-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
                <Feather name="shopping-bag" size={20} color="#156651" />
              </View>
              <View className="flex-1">
                <Text className="text-BodyBold text-text">Order Updates</Text>
                <Text className="text-BodySmallRegular text-neutral-60">
                  Get notified about your order status
                </Text>
              </View>
            </View>
            <Switch
              value={newOrderNotification}
              onValueChange={setNewOrderNotification}
              trackColor={{ false: "#E5E5E5", true: "#156651" }}
              thumbColor={newOrderNotification ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-alert/10 rounded-lg items-center justify-center mr-3">
                <Feather name="zap" size={20} color="#E55000" />
              </View>
              <View className="flex-1">
                <Text className="text-BodyBold text-text">Flash Sales & Deals</Text>
                <Text className="text-BodySmallRegular text-neutral-60">
                  Don't miss out on exclusive offers
                </Text>
              </View>
            </View>
            <Switch
              value={lowStockNotification}
              onValueChange={setLowStockNotification}
              trackColor={{ false: "#E5E5E5", true: "#156651" }}
              thumbColor={lowStockNotification ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-secondary/10 rounded-lg items-center justify-center mr-3">
                <Feather name="star" size={20} color="#EBB65B" />
              </View>
              <View className="flex-1">
                <Text className="text-BodyBold text-text">App Updates & News</Text>
                <Text className="text-BodySmallRegular text-neutral-60">
                  Stay updated with new features
                </Text>
              </View>
            </View>
            <Switch
              value={swiftMartAnnouncements}
              onValueChange={setSwiftMartAnnouncements}
              trackColor={{ false: "#E5E5E5", true: "#156651" }}
              thumbColor={swiftMartAnnouncements ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-neutral-10 rounded-full items-center justify-center mb-4">
              <Feather name="bell" size={32} color="#E5E5E5" />
            </View>
            <Text className="text-BodyBold text-neutral-60 mt-4">
              {activeTab === "all" ? "No notifications yet" : "No unread notifications"}
            </Text>
            <Text className="text-BodySmallRegular text-neutral-40 mt-2 text-center px-8">
              {activeTab === "all" 
                ? "You'll see order updates, deals, and app news here."
                : "All caught up! No unread notifications."
              }
            </Text>
          </View>
        ) : (
          <View className="space-y-3 pb-6">
            {filteredNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => markAsRead(notification.id)}
                className={`bg-white rounded-14 p-4 border ${
                  notification.read ? "border-neutral-20" : "border-primary"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-start">
                  {/* Notification Icon */}
                  <View className="w-12 h-12 bg-neutral-10 rounded-lg items-center justify-center mr-3 mt-1">
                    {getNotificationIcon(notification.icon)}
                  </View>

                  {/* Notification Content */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-BodyBold text-text flex-1">
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View className="w-2 h-2 bg-primary rounded-full ml-2" />
                      )}
                    </View>
                    <Text className="text-BodySmallRegular text-neutral-60 mb-2 leading-5">
                      {notification.message}
                    </Text>
                    <Text className="text-Caption text-neutral-40">
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications; 