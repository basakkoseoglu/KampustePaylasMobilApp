import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

interface OtherUserProps {
  chatId: string;
  currentUserId: string;
}

const OtherUser: React.FC<OtherUserProps> = ({ chatId, currentUserId }) => {
  const [otherUsername, setOtherUsername] = useState<string>('');

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'chats', chatId), (docSnap) => {
      const data = docSnap.data();
      const participantsInfo = data?.participantsInfo || [];
      const other = participantsInfo.find((u: any) => u.id !== currentUserId);
      setOtherUsername(other?.name || 'Bilinmeyen');
    });

    return () => unsub();
  }, [chatId, currentUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{otherUsername} ile sohbet</Text>
    </View>
  );
};

export default OtherUser;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
