import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Messaging from '@/components/Messaging';
import { useAuth } from '@/contexts/authContext';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';


const MessagingScreen = () => {
  const { chatId, receiverName ,receiverImage} = useLocalSearchParams<{
    chatId: string;
    receiverName: string;
    receiverImage?:string;
  }>();

  const { user } = useAuth();
  const router = useRouter();


  if (!chatId || !receiverName || !user?.uid || !user?.name) {
    return null;
  }

 return (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText}>{receiverName}</Text>
    </View>

    <Messaging
      chatId={chatId}
      currentUserId={user.uid}
      username={user.name}
      receiverName={receiverName}
      receiverImage={receiverImage}
    />
  </View>
);

};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
  height: 60,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
  gap: 12,
},
headerText: {
  fontSize: 18,
  fontWeight: '600',
  color: 'black',
},

});
