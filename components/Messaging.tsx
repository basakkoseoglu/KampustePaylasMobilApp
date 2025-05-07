import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { firestore } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

interface MessagingProps {
  chatId: string;
  currentUserId: string;
  username: string;
  receiverName: string;
}

const Messaging: React.FC<MessagingProps> = ({
  chatId,
  currentUserId,
  username,
  receiverName,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTypingText, setIsTypingText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
    });

    const chatDocRef = doc(firestore, 'chats', chatId);
    const unsubscribeTyping = onSnapshot(chatDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.typingUser && data.typingUser !== currentUserId) {
        setIsTypingText(`${data.typingUsername} yazıyor...`);
      } else {
        setIsTypingText('');
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
    };
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      text: newMessage,
      senderId: currentUserId,
      username: username,
      timestamp: Date.now(),
    };

    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    await addDoc(messagesRef, messageData);

    const chatDocRef = doc(firestore, 'chats', chatId);
    await setDoc(
      chatDocRef,
      {
        lastMessage: messageData.text,
        updatedAt: messageData.timestamp,
        typingUser: '',
        typingUsername: '',
      },
      { merge: true }
    );

    setNewMessage('');
  };

  const handleTyping = async () => {
    const chatDocRef = doc(firestore, 'chats', chatId);
    await setDoc(
      chatDocRef,
      {
        typingUser: currentUserId,
        typingUsername: username,
      },
      { merge: true }
    );
  };

  const stopTyping = async () => {
    const chatDocRef = doc(firestore, 'chats', chatId);
    await setDoc(
      chatDocRef,
      {
        typingUser: '',
        typingUsername: '',
      },
      { merge: true }
    );
    setIsTypingText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem item={item} currentUserId={currentUserId} />
        )}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
      />

      {isTypingText ? (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{isTypingText}</Text>
        </View>
      ) : null}

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
        stopTyping={stopTyping}
      />
    </View>
  );
};

export default Messaging;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 5,
    paddingTop: 5,
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingContainer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'black',
  },
});
