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
  input: {
    flex: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontSize: 16,
    backgroundColor: "#f2f2f2",
    color: "#000",
    marginRight: 8,
    height: 50,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: "#188040",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
