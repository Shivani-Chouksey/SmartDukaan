import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal', // Enables modal behavior
          sheetAllowedDetents: [0.5, 1], // Array of snap positions for screens that have a width less than 768px.
        }}
      />
    </Stack>
  );
}