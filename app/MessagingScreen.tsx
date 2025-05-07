import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Messaging from '@/components/Messaging';
import { useAuth } from '@/contexts/authContext';

const MessagingScreen = () => {
  const { chatId, receiverName } = useLocalSearchParams<{
    chatId: string;
    receiverName: string;
  }>();

  const { user } = useAuth();

  if (!chatId || !receiverName || !user?.uid || !user?.name) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Messaging
        chatId={chatId}
        currentUserId={user.uid}
        username={user.name}
        receiverName={receiverName}
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
});
