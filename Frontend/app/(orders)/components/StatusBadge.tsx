import React from 'react';
import { View, Text } from 'react-native';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'processing':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sizeClass = variant === 'large' ? 'px-3 py-2' : 'px-2 py-1';
  const textClass = variant === 'large' ? 'text-sm' : 'text-xs';

  return (
    <View className={`${sizeClass} rounded ${getStatusColor(status)}`}>
      <Text className={`${textClass} font-Manrope ${getStatusColor(status).split(' ')[1]}`}>
        {status}
      </Text>
    </View>
  );
};

export default StatusBadge;
