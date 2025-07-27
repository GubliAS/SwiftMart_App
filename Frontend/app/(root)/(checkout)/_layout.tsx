import React, { useEffect } from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  useEffect(() => {
    // console.log('CHECKOUT _layout MOUNT');
    return () => {
      // console.log('CHECKOUT _layout UNMOUNT');
    };
  }, []);
  return (
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="AddAddress" options={{ headerShown: false }} />
        <Stack.Screen name="AddPaymentScreen" options={{ headerShown: false }} />
        <Stack.Screen name="AddressSelectionScreen" options={{ headerShown: false }} />
        <Stack.Screen name="CheckoutScreen" options={{ headerShown: false }} />
        <Stack.Screen name="ChoosePaymentTypeScreen" options={{ headerShown: false }} />
        <Stack.Screen name="EditPaymentScreen" options={{ headerShown: false }} />
        <Stack.Screen name="PaymentSelectionScreen" options={{ headerShown: false }} />
      </Stack>

    
  );
}
