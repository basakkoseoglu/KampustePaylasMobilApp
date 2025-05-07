// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { Stack } from 'expo-router'
// import { AuthProvider } from '@/contexts/authContext';

// const StackLayout = () => {
//   return (
//     <Stack screenOptions={{headerShown:false}}>
//       {/* Burada eksik olan ekranlarınızı eklemeniz gerekiyor */}
//       <Stack.Screen name='index' /> {/* Ana sayfa */}
//       <Stack.Screen name='(modals)/profileModal' options={{
//         presentation:'modal'
//       }} />
//       {/* CourseAdvertModal ekranını ekliyoruz */}
//       <Stack.Screen name='(modals)/courseAdvertModal' options={{
//         presentation:'modal'
//       }} />
//        {/* lendorsellModal ekranını ekliyoruz */}
//        <Stack.Screen name='(modals)/lendOrSellModal' options={{
//         presentation:'modal'
//       }} />
//       {/* volunteerhelpmodal ekranı */}
//       <Stack.Screen name='(modals)/volunteerHelpModal' options={{presentation:'modal'}} />
//       {/* campuseventmodal ekranı */}
//       <Stack.Screen name='(modals)/campusEventModal' options={{presentation:'modal'}} />
//     </Stack>
//   )
// };

// export default function RootLayout(){
//   return(
//     <AuthProvider>
//       <StackLayout />
//     </AuthProvider>
//   );
// }

// const styles = StyleSheet.create({})
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
        <Stack.Screen name="post-detail" />
        <Stack.Screen name="MessagingScreen"/>
      </Stack>
    </AuthProvider>
  );
}
