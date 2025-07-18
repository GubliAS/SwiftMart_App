// Utility functions for navigating to order-related screens
import { router } from 'expo-router';

export const navigateToTransactionPage = () => {
  router.push('/(orders)/TransactionPage');
};

export const navigateToOrderDetails = (orderId: string) => {
  router.push({
    pathname: '/(orders)/OrderDetailsPage',
    params: { orderId }
  });
};

export const navigateToOrderInfo = (orderId: string) => {
  router.push({
    pathname: '/(orders)/OrderInfoPage',
    params: { orderId }
  });
};

export const navigateToLeaveReview = (orderId: string) => {
  router.push({
    pathname: '/(orders)/LeaveReviewPage',
    params: { orderId }
  });
};

// Example usage for integrating with main app navigation
export const orderNavigationItems = [
  {
    title: 'My Orders',
    onPress: navigateToTransactionPage,
    icon: 'package' // or whatever icon system you're using
  }
];
