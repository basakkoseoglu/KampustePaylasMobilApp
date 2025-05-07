import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { firestore } from '@/config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/authContext'; 

interface ChatPreview {
  chatId: string;
  otherUserName: string;
  lastMessage: string;
}

const ChatScreen: React.FC = () => {
  const [chatList, setChatList] = useState<ChatPreview[]>([]);
  const { user } = useAuth(); 
  const currentUserId = user?.uid;
  const router = useRouter();

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', currentUserId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const chatData = doc.data();
        const otherUserName = chatData.participantsInfo?.find((u: any) => u.id !== currentUserId)?.name || 'Bilinmeyen';
        return {
          chatId: doc.id,
          otherUserName,
          lastMessage: chatData.lastMessage || '',
        };
      });
      setChatList(data);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const goToChat = (chatId: string, otherUserName: string) => {
    router.push({
      pathname: '/MessagingScreen', 
      params: {
        chatId,
        receiverName: otherUserName,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sohbetler</Text>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => goToChat(item.chatId, item.otherUserName)}>
            <Text style={styles.chatName}>{item.otherUserName}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingTop: 50, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  chatItem: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 15 },
  chatName: { fontSize: 18, fontWeight: '600' },
  lastMessage: { fontSize: 14, color: '#666', marginTop: 4 },
});
