import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageItemProps {
  item: {
    text: string;
    senderId: string;
    username?: string;
    timestamp?: number;
  };
  currentUserId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, currentUserId }) => {
  const isMe = item.senderId === currentUserId;

  return (
    <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
      {!isMe && <Text style={styles.senderName}>{item.username}</Text>}
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  senderName: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
