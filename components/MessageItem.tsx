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

return isMe ? (
  <View style={[styles.messageContainer, styles.myMessage]}>
    <Text style={styles.messageText}>{item.text}</Text>
    {item.timestamp && (
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    )}
  </View>
) : (
  <View style={styles.theirMessageWrapper}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {item.username?.split(' ').map((w) => w[0]).join('').toUpperCase() || '?'}
      </Text>
    </View>
    <View style={[styles.messageContainer, styles.theirMessage]}>
      <Text style={styles.senderName}>{item.username}</Text>
      <Text style={styles.messageTextDark}>{item.text}</Text>
      {item.timestamp && (
        <Text style={styles.timestampDark}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
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
  timestamp: {
  fontSize: 12,
  color: 'white',
  marginTop: 4,
  alignSelf: 'flex-end',
},
theirMessageWrapper: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginBottom: 10,
},

avatar: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
},

avatarText: {
  fontWeight: 'bold',
  color: 'white',
},

messageTextDark: {
  fontSize: 16,
  color: 'black',
},

timestampDark: {
  fontSize: 12,
  color: '#555',
  marginTop: 4,
  alignSelf: 'flex-end',
},


});
