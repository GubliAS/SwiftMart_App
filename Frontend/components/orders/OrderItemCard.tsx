import React from 'react';
import { View, Text } from 'react-native';
import { OrderItem } from '../../types/orders';

interface OrderItemCardProps {
  item: OrderItem;
  showDetails?: boolean;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, showDetails = false }) => {
  return (
    <View className="border-b border-neutral-100 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-BodyBold font-Manrope flex-1 text-text">{item.name}</Text>
          {item.description && showDetails && (
            <Text className="text-BodyRegular font-Manrope text-neutral-60 mt-1">
              {item.description}
            </Text>
          )}
          {item.sku && showDetails && (
            <Text className="text-BodyRegular font-Manrope text-neutral-60 mt-1">
              SKU: {item.sku}
            </Text>
          )}
          <Text className="text-BodyRegular font-Manrope text-neutral-60 mt-1">
            Qty: {item.quantity}
          </Text>
        </View>
        <Text className="text-BodyBold font-Manrope text-text">${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default OrderItemCard;
