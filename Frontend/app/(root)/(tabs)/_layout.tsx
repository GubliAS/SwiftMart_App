import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Platform } from "react-native";
import React, { useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Layout = () => {
 
  return (
    <View className="flex-1 pb-4 font-Manrope bg-white">
      <StatusBar style="dark"/>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#156651",
            tabBarInactiveTintColor: "#C2C2C2",
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#ffffff",
              paddingBottom: 16,
              paddingTop: 16,
              paddingRight: 16,
              paddingLeft: 16,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 0, // Remove the thin border
              ...Platform.select({
                web: { boxShadow: '0px -2px 10px rgba(0,0,0,0.1)' },
                default: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 3,
                }
              }),
            },
          }}
        >
          <Tabs.Screen
            name="Home"
            options={{
              title: "Home",
              tabBarIcon: ({ focused }) => (
                <Feather
                  name="home"
                  size={28}
                  color={focused ? "#156651" : "#9CA3AF"}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Search"
            options={{
              title: "Search",
              tabBarIcon: ({ focused }) => (
                <Feather
                  name="search"
                  size={28}
                  color={focused ? "#156651" : "#9CA3AF"}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Feed"
            options={{
              title: "Feed",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <MaterialCommunityIcons
                  className="h-14 w-14"
                    name="video-plus"
                    size={48}
                    color="#156651"
                  />
                ) : (
                  <Feather
                    name="wifi"
                    size={28}
                    color="#c2c2c2"
                    className="rotate-45"
                  />
                ),
            }}

          />
          <Tabs.Screen
            name="CartScreen"
            options={{
              title: "Cart",
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="cart-outline"
                  size={28}
                  color={focused ? "#156651" : "#9CA3AF"}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ focused }) => (
                <Feather
                  name="user"
                  size={28}
                  color={focused ? "#156651" : "#9CA3AF"}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
};

export default Layout;
