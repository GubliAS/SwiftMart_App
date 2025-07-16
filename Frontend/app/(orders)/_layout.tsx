import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionPage" />
      <Stack.Screen name="OrderDetailsPage" />
      <Stack.Screen name="OrderInfoPage" />
      <Stack.Screen name="OrderTrackingPage" />
      <Stack.Screen name="LeaveReviewPage" />
    </Stack>
  );
}
