import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack>
      <Stack.Screen name="CreatePostScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="PostDetailModal"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 