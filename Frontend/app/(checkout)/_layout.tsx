import { Stack } from 'expo-router';
import { CheckoutProvider } from '../context/CheckoutContext';

export default function Layout() {
  return (
    <CheckoutProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CheckoutProvider>
  );
}
