import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";

const PayoutMethodCard = ({
  item,
  selectedMethod,
  handleSelect,
  handleDelete,
  formatMobileNumber,
  showDeleteButton = true, // Prop to control delete button visibility
  showNumber = true, // Prop to control number visibility
  isDefault = false, // New prop
  onSetDefault, // New optional prop
}: {
  item: { id: string; name: string; icon: any; number: string };
  selectedMethod: string | null;
  handleSelect: (methodId: string) => void;
  handleDelete?: (methodId: string) => void; // Optional delete handler
  formatMobileNumber: (number: string) => string;
  showDeleteButton?: boolean; // Optional prop to show/hide delete button
  showNumber?: boolean; // Optional prop to show/hide card/mobile number
  isDefault?: boolean; // New prop
  onSetDefault?: (methodId: string) => void; // New optional prop
}) => (
  <TouchableOpacity
    onPress={() => handleSelect(item.id)} // Select the payout method
    className="flex-row items-center gap-4 p-4 mb-4 rounded-[14px]"
    style={{
      boxShadow: "2px 4px 24px 0px rgba(0, 0, 0, 0.10)",
    }}
  >
    <item.icon width={100} height={68} />
    <View className="flex-1">
      <Text className="font-Manrope text-Heading5 text-text">{item.name}</Text>
      {showNumber && (
        <Text className="text-neutral-500 text-sm">
          {item.name === "Mobile Money"
            ? formatMobileNumber(item.number)
            : `**** **** **** ${item.number}`}
        </Text>
      )}
      {isDefault && (
        <Text className="text-xs text-primary font-Manrope mt-1">Default</Text>
      )}
      {!isDefault && onSetDefault && (
        <TouchableOpacity onPress={() => onSetDefault(item.id)} className="mt-1">
          <Text className="text-xs text-secondary underline">Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
    {/* Checkbox */}
    {selectedMethod === item.id ? (
      <AntDesign name="checksquare" size={24} color="#EBB65B" />
    ) : (
      <MaterialIcons name="check-box-outline-blank" size={24} color="#EBB65B" />
    )}

    {/* Delete Button */}
    {showDeleteButton && handleDelete && (
      <TouchableOpacity
        onPress={() => handleDelete(item.id)} // Delete the payout method
        className="ml-2"
      >
        <MaterialIcons name="delete" size={24} color="#e44a4a" />
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

export default PayoutMethodCard;
