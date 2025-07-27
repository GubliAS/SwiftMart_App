import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react-native';
import type { OrderStatusHistory } from '@/app/api/orderApi';

interface OrderStatusHistoryProps {
  statusHistory: OrderStatusHistory[];
  currentStatus: string;
}

// Status mapping
const STATUS_MAP = {
  1: { name: 'PENDING', label: 'Order Placed', icon: Clock, color: '#6B7280' },
  2: { name: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle, color: '#3B82F6' },
  3: { name: 'SHIPPED', label: 'Shipped', icon: Truck, color: '#F59E0B' },
  4: { name: 'DELIVERED', label: 'Delivered', icon: Home, color: '#10B981' },
  5: { name: 'CANCELLED', label: 'Cancelled', icon: Clock, color: '#EF4444' },
};

const OrderStatusHistoryComponent: React.FC<OrderStatusHistoryProps> = ({ statusHistory, currentStatus }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
  };

  const getStatusIcon = (statusId: number) => {
    const status = STATUS_MAP[statusId as keyof typeof STATUS_MAP];
    if (!status) return Clock;
    return status.icon;
  };

  const getStatusColor = (statusId: number) => {
    const status = STATUS_MAP[statusId as keyof typeof STATUS_MAP];
    if (!status) return '#6B7280';
    return status.color;
  };

  const getStatusLabel = (statusId: number) => {
    const status = STATUS_MAP[statusId as keyof typeof STATUS_MAP];
    if (!status) return 'Unknown Status';
    return status.label;
  };

  if (!statusHistory || statusHistory.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-2">Order Status History</Text>
        <Text className="text-gray-500">No status history available for this order.</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Order Status Timeline</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {statusHistory.map((history, index) => {
          const IconComponent = getStatusIcon(history.statusId);
          const statusColor = getStatusColor(history.statusId);
          const statusLabel = getStatusLabel(history.statusId);
          const { date, time } = formatDate(history.changedAt);
          const isLast = index === statusHistory.length - 1;

          return (
            <View key={history.id} className="flex-row items-start mb-4">
              {/* Timeline line */}
              <View className="items-center mr-3">
                <View 
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: statusColor }}
                />
                {!isLast && (
                  <View 
                    className="w-0.5 h-12"
                    style={{ backgroundColor: '#E5E7EB' }}
                  />
                )}
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <IconComponent size={16} color={statusColor} />
                  <Text 
                    className="ml-2 font-medium text-gray-900"
                    style={{ color: statusColor }}
                  >
                    {statusLabel}
                  </Text>
                </View>
                
                <Text className="text-sm text-gray-500 mb-1">
                  {date} at {time}
                </Text>
                
                <Text className="text-xs text-gray-400">
                  Order #{history.orderId}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Current Status Summary */}
      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-sm font-medium text-gray-700 mb-1">Current Status</Text>
        <Text className="text-lg font-semibold text-gray-900 capitalize">
          {currentStatus.toLowerCase()}
        </Text>
      </View>
    </View>
  );
};

export default OrderStatusHistoryComponent; 