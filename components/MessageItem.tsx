import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface MessageItemProps {
  item: {
    text: string;
    senderId: string;
    username?: string;
    timestamp?: number;
  };
  showAvatar?: boolean;
  currentUserId: string;
  senderImage?: string; // ekledik
  receiverImage?: string;
  receiverName?: string; // ekledik
  getInitials?: (name: string) => string; // ekledik
}

const MessageItem: React.FC<MessageItemProps> = ({
  item,
  currentUserId,
  showAvatar,
  receiverImage,
}) => {
  const isMe = item.senderId === currentUserId;

  return isMe ? (
    <View style={[styles.messageContainer, styles.myMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {item.timestamp && (
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      )}
    </View>
  ) : (
    <View style={styles.theirMessageWrapper}>
      {showAvatar ? (
        receiverImage && receiverImage.trim() !== "" ? (
          <Image
            source={{ uri: receiverImage }}
            style={styles.avatarImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.username
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase() || "?"}
            </Text>
          </View>
        )
      ) : (
        <View style={{ width: 32, marginRight: 8 }} />
      )}

      <View style={[styles.messageContainer, styles.theirMessage]}>
        {showAvatar && <Text style={styles.senderName}>{item.username}</Text>}
        <Text style={styles.messageTextDark}>{item.text}</Text>
        {item.timestamp && (
          <Text style={styles.timestampDark}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  myMessage: {
    backgroundColor: "#188040",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#F1F1F1",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  messageTextDark: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  timestampDark: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  theirMessageWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B0D9B1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
});
