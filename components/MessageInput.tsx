import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icons from 'phosphor-react-native';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  sendMessage: () => void;
  handleTyping: () => void;
  stopTyping: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  sendMessage,
  handleTyping,
  stopTyping,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={newMessage}
        onChangeText={text => {
          setNewMessage(text);
          if (text.trim()) {
            handleTyping();
          } else {
            stopTyping();
          }
        }}
        onBlur={stopTyping}
        placeholder="Mesaj yaz..."
        style={styles.input}
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Icons.PaperPlaneTilt size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
