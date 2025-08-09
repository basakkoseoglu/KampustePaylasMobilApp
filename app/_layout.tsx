import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(modals)/profileModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(modals)/courseAdvertModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(modals)/lendOrSellModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(modals)/volunteerHelpModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(modals)/campusEventModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(modals)/hakkimizdaModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="post-detail" />
        <Stack.Screen name="MessagingScreen"/>
      </Stack>
    </AuthProvider>
  );
}
