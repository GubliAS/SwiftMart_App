// Addvariant.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert, // Make sure Alert is imported
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the structure of a single variant
interface ProductVariant {
  id: string;
  color: string;
  // New structure for size: an object to hold type and value
  size: {
    type: string; // e.g., "Standard", "Numeric", "Custom"
    value: string; // e.g., "M", "36", "XL-Tall"
  };
  stock: string;
}

// Define the interface for the product data passed from the previous screen
interface ProductDataFromParams {
  productName: string;
  description: string;
  category: string;
  condition: string;
  weight: string;
  price: string;
  standardShipping: string;
  expressShipping: string;
  addVariants: string;
}

const Addvariant: React.FC = () => {
  const router = useRouter();
  const productData = useLocalSearchParams() as unknown as ProductDataFromParams;

  const [colorVariantsEnabled, setColorVariantsEnabled] = useState<boolean>(false);
  const [sizeVariantsEnabled, setSizeVariantsEnabled] = useState<boolean>(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Dummy data for color dropdown
  const colorOptions: string[] = ["Red", "Blue", "Green", "Black", "White"];
  // Size Type options as per "side variant.jpg"
  const sizeTypeOptions: string[] = ["Standard (S, M, L...)", "Numeric (eg. 39, 40, 41...)", "Custom"];

  // Dummy data for actual sizes based on type selection
  const standardSizes: string[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const numericSizes: string[] = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  // State to manage which specific dropdown is open for each variant
  // This will store { variantId: 'color' | 'sizeType' | 'sizeValue' }
  const [activeDropdown, setActiveDropdown] = useState<{ id: string; type: 'color' | 'sizeType' | 'sizeValue' } | null>(null);

  useEffect(() => {
    // Add one empty variant field by default if variants are enabled and none exist
    if ((colorVariantsEnabled || sizeVariantsEnabled) && variants.length === 0) {
      addEmptyVariant();
    } else if (!colorVariantsEnabled && !sizeVariantsEnabled && variants.length > 0) {
      // Clear variants if both toggles are off
      setVariants([]);
    }
  }, [colorVariantsEnabled, sizeVariantsEnabled]);

  const addEmptyVariant = () => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { id: String(Date.now()), color: "", size: { type: "", value: "" }, stock: "" },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants((prevVariants) => prevVariants.filter((variant) => variant.id !== id));
    if (activeDropdown && activeDropdown.id === id) {
      setActiveDropdown(null); // Close dropdown if its variant is removed
    }
  };

  // Modified updateVariant to handle nested size object
  const updateVariant = (id: string, field: keyof ProductVariant, value: string | { type: string, value: string }) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) => {
        if (variant.id === id) {
          if (field === 'size' && typeof value === 'object') {
            return { ...variant, size: value };
          } else if (field === 'size' && typeof value === 'string') {
            // This case handles updating only the size.value
            return { ...variant, size: { ...variant.size, value: value } };
          }
          return { ...variant, [field]: value };
        }
        return variant;
      })
    );
  };

  const handlePublish = () => {
    const parsedStandardShipping = productData.standardShipping === 'true';
    const parsedExpressShipping = productData.expressShipping === 'true';

    let isValid = true;
    const finalVariants = variants.map((v) => {
      const parsedStock = parseInt(v.stock);

      if (colorVariantsEnabled && !v.color) {
        isValid = false;
        Alert.alert("Validation Error", "Please select a color for all active variants.");
        return null;
      }
      if (sizeVariantsEnabled) {
        if (!v.size.type) { // Validate if size type is selected
          isValid = false;
          Alert.alert("Validation Error", "Please select a size type for all active variants.");
          return null;
        }
        if (v.size.type !== "Custom" && !v.size.value) { // Validate size value if not custom
          isValid = false;
          Alert.alert("Validation Error", "Please select a size value for all active variants (or enter custom size).");
          return null;
        }
        if (v.size.type === "Custom" && !v.size.value.trim()) { // Validate custom size input
            isValid = false;
            Alert.alert("Validation Error", "Please enter a custom size value.");
            return null;
        }
      }
      if (isNaN(parsedStock) || parsedStock < 0) {
        isValid = false;
        Alert.alert("Validation Error", "Please enter a valid stock quantity for all variants.");
        return null;
      }
      return { ...v, stock: parsedStock };
    }).filter(Boolean);

    if (!isValid) {
      return;
    }

    if ((colorVariantsEnabled || sizeVariantsEnabled) && finalVariants.length === 0) {
      Alert.alert("Validation Error", "Please add at least one variant.");
      return;
    }

    const fullProductData = {
      ...productData,
      standardShipping: parsedStandardShipping,
      expressShipping: parsedExpressShipping,
      colorVariantsEnabled,
      sizeVariantsEnabled,
      variants: finalVariants,
    };

    console.log("Publishing Full Product Data with Variants:", fullProductData);

    // --- ONLY THE ALERT IS HERE, NO NAVIGATION ---
    Alert.alert(
      "Success! 🎉", // Title of the alert
      "Your product is now live! Thank you very much for selling here. We appreciate your partnership! 🚀", // The heartfelt message
      [
        {
          text: "OK", // The button text
          onPress: () => {
            // No navigation here. The alert will simply dismiss.
            console.log("Product published and alert dismissed.");
          },
        },
      ]
    );
    // --- End of Alert ---
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <Ionicons name="information-circle-outline" size={24} color="black" style={styles.infoIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>9. Product Variants</Text>

        {/* Color Variants Toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Color Variants</Text>
          <Switch
            value={colorVariantsEnabled}
            onValueChange={setColorVariantsEnabled}
            trackColor={{ false: "#ccc", true: "#facc15" }}
            thumbColor={colorVariantsEnabled ? "#f59e0b" : "#fff"}
          />
        </View>

        {/* Size Variants Toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Size Variants</Text>
          <Switch
            value={sizeVariantsEnabled}
            onValueChange={setSizeVariantsEnabled}
            trackColor={{ false: "#ccc", true: "#facc15" }}
            thumbColor={sizeVariantsEnabled ? "#f59e0b" : "#fff"}
          />
        </View>

        {/* Variant Input Fields (conditionally rendered) */}
        {(colorVariantsEnabled || sizeVariantsEnabled) && (
          <>
            <View style={styles.variantHeaderRow}>
              {colorVariantsEnabled && <Text style={styles.variantHeaderCol}>Color</Text>}
              {sizeVariantsEnabled && <Text style={styles.variantHeaderCol}>Size</Text>}
              <Text style={styles.variantHeaderColStock}>Stock</Text>
            </View>

            {variants.map((variant) => (
              // Apply zIndex to the entire variantRow when a dropdown in it is active
              <View
                key={variant.id}
                style={[
                  styles.variantRow,
                  (activeDropdown?.id === variant.id) && { zIndex: 10 }
                ]}
              >
                {/* Color Dropdown */}
                {colorVariantsEnabled && (
                  <View style={styles.dropdownWrapper}>
                    <Pressable
                      onPress={() => {
                        setActiveDropdown(
                          activeDropdown?.id === variant.id && activeDropdown?.type === 'color'
                            ? null
                            : { id: variant.id, type: 'color' }
                        );
                      }}
                      style={[styles.dropdownInput, sizeVariantsEnabled && styles.halfWidth]}
                    >
                      <Text style={styles.dropdownInputText}>
                        {variant.color || "Select Color"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#999" />
                    </Pressable>
                    {activeDropdown?.id === variant.id && activeDropdown?.type === 'color' && (
                      <View style={styles.dropdownListContainerLocal}>
                        {colorOptions.map((item) => (
                          <TouchableOpacity
                            key={item}
                            onPress={() => {
                              updateVariant(variant.id, "color", item);
                              setActiveDropdown(null);
                            }}
                            style={[styles.dropdownListItem, variant.color === item && styles.selectedDropdownItem]}
                          >
                            <Text style={[styles.dropdownListItemText, variant.color === item && styles.selectedDropdownItemText]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Size Dropdowns (Type and Value) */}
                {sizeVariantsEnabled && (
                  <View style={styles.dropdownWrapper}>
                    {/* Size Type Dropdown */}
                    <Pressable
                      onPress={() => {
                        setActiveDropdown(
                          activeDropdown?.id === variant.id && activeDropdown?.type === 'sizeType'
                            ? null
                            : { id: variant.id, type: 'sizeType' }
                        );
                      }}
                      style={[styles.dropdownInput, colorVariantsEnabled && styles.halfWidth]}
                    >
                      <Text style={styles.dropdownInputText}>
                        {variant.size.type || "Select Size Type"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#999" />
                    </Pressable>
                    {activeDropdown?.id === variant.id && activeDropdown?.type === 'sizeType' && (
                      <View style={styles.dropdownListContainerLocal}>
                        {sizeTypeOptions.map((item) => (
                          <TouchableOpacity
                            key={item}
                            onPress={() => {
                              updateVariant(variant.id, "size", { type: item, value: "" });
                              setActiveDropdown(null);
                            }}
                            style={[styles.dropdownListItem, variant.size.type === item && styles.selectedDropdownItem]}
                          >
                            <Text style={[styles.dropdownListItemText, variant.size.type === item && styles.selectedDropdownItemText]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Conditional rendering for the SECOND (actual size) dropdown/input */}
                    {variant.size.type && (
                      <View style={styles.nestedSizeInputWrapper}>
                        {/* Render dropdown for Standard or Numeric sizes */}
                        {(variant.size.type === "Standard (S, M, L...)" || variant.size.type === "Numeric (eg. 39, 40, 41...)") && (
                          <>
                            <Pressable
                              onPress={() => {
                                setActiveDropdown(
                                  activeDropdown?.id === variant.id && activeDropdown?.type === 'sizeValue'
                                    ? null
                                    : { id: variant.id, type: 'sizeValue' }
                                );
                              }}
                              style={styles.dropdownInput}
                            >
                              <Text style={styles.dropdownInputText}>
                                {variant.size.value || (variant.size.type === "Standard (S, M, L...)" ? "Select Size" : "Select Number")}
                              </Text>
                              <Ionicons name="chevron-down" size={20} color="#999" />
                            </Pressable>
                            {activeDropdown?.id === variant.id && activeDropdown?.type === 'sizeValue' && (
                              <View style={styles.dropdownListContainerLocal}>
                                {(variant.size.type === "Standard (S, M, L...)" ? standardSizes : numericSizes).map((item) => (
                                  <TouchableOpacity
                                    key={item}
                                    onPress={() => {
                                      updateVariant(variant.id, "size", { ...variant.size, value: item });
                                      setActiveDropdown(null);
                                    }}
                                    style={[styles.dropdownListItem, variant.size.value === item && styles.selectedDropdownItem]}
                                  >
                                    <Text style={[styles.dropdownListItemText, variant.size.value === item && styles.selectedDropdownItemText]}>
                                      {item}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                          </>
                        )}

                        {/* Render TextInput for Custom size */}
                        {variant.size.type === "Custom" && (
                          <TextInput
                            value={variant.size.value}
                            onChangeText={(text) => updateVariant(variant.id, "size", { ...variant.size, value: text })}
                            placeholder="Enter Custom Size"
                            style={styles.customSizeInput}
                            placeholderTextColor="#999"
                          />
                        )}
                      </View>
                    )}
                  </View>
                )}

                {/* Stock Input */}
                <TextInput
                  value={variant.stock}
                  onChangeText={(text) => updateVariant(variant.id, "stock", text)}
                  placeholder="In stock"
                  keyboardType="numeric"
                  style={styles.stockInput}
                  placeholderTextColor="#999"
                />

                {/* Delete Variant Button */}
                {variants.length > 1 && (
                  <TouchableOpacity onPress={() => removeVariant(variant.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Add Variant Button */}
            <TouchableOpacity
              onPress={addEmptyVariant}
              style={styles.addVariantButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="#888" />
              <Text style={styles.addVariantButtonText}>Add Variant</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Publish Button */}
        <Pressable
          onPress={handlePublish}
          style={styles.publishButton}
        >
          <Text style={styles.publishButtonText}>Publish</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  infoIcon: {
    padding: 8,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  variantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  variantHeaderCol: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  variantHeaderColStock: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginRight: 40,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
  },
  dropdownWrapper: {
    flex: 1,
    marginRight: 8,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dropdownInputText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  halfWidth: {
    flex: 0.5,
  },
  stockInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
  },
  addVariantButton: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 40,
  },
  addVariantButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#777',
  },
  publishButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownListContainerLocal: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    maxHeight: 150,
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownListItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItem: {
    backgroundColor: '#facc15',
  },
  selectedDropdownItemText: {
    color: '#fff',
    fontWeight: '600',
  },
  nestedSizeInputWrapper: {
    marginTop: 0,
    position: 'relative',
  },
  customSizeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  }
});

export default Addvariant;