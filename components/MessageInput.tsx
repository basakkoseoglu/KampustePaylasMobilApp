import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as Icons from "phosphor-react-native";

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
        onChangeText={(text) => {
          setNewMessage(text);
          if (text.trim().length > 0) {
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  // input: {
  //   flex: 1,
  //   borderRadius: 999,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   paddingHorizontal: 12,
  //   paddingVertical: 8,
  //   fontSize: 16,
  //   backgroundColor: '#f9f9f9',
  // },
  input: {
    flex: 1,
    borderRadius: 999, // daireye yakın görünüm
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f2f2f2",
    color: "#000",
    marginRight: 8,
  },

  sendButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});
