import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { OrderListItem } from '../types';

interface OrderCardProps {
  order: OrderListItem;
  onPress: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-secondary/20 text-secondary';
      case 'Completed': return 'bg-primary/20 text-primary';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-alert/20 text-alert';
      default: return 'bg-neutral-30 text-neutral-70';
    }
  };

  return (
    <TouchableOpacity
      className="bg-white border border-neutral-40 rounded-2xl p-5 mb-4 shadow-sm relative"
      style={{ height: 140 }}
      onPress={() => onPress(order.id)}
    >
      {/* Top Row: Order ID and Status */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-BodyBold font-Manrope text-text">Order #{order.id}</Text>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
          <Text className={`text-Caption font-Manrope ${getStatusColor(order.status).split(' ')[1]}`}>
            {order.status}
          </Text>
        </View>
      </View>

      {/* Left Side Content */}
      <View className="flex-1 justify-start">
        <Text className="text-BodyRegular font-Manrope text-text mb-2">
          Total Amount: ${order.amount.toFixed(2)}
        </Text>
        <Text className="text-BodySmallRegular font-Manrope text-neutral-60">
          Size {order.size}
        </Text>
      </View>

      {/* Chevron Right at Bottom Right */}
      <View className="absolute bottom-4 right-4">
        <ChevronRight size={20} color="#156651" />
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
