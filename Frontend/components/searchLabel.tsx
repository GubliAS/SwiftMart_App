import { View, Text, StyleSheet } from "react-native";
import React from "react";

interface SearchLabelProps {
  name: string; // Label text
  bgColor: string; // Background color
  textColor: string; // Text color
  borderColor: string; // Border color
}

const SearchLabel: React.FC<SearchLabelProps> = ({
  name,
  bgColor,
  textColor,
  borderColor,
}) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: borderColor },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SearchLabel;
