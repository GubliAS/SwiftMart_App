import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import "@/global.css";

const index = () => {
  return <Redirect href="/(seller_dashboard)/SellerSettings" />;
};

export default index;
