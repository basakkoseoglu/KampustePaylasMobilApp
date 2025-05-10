import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { firestore } from "@/config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";

interface ChatPreview {
  chatId: string;
  otherUserName: string;
  lastMessage: string;
  updatedAt: number;
  otherUserImage?: string;
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  const diff = now.getTime() - date.getTime();
  if (diff < 1000 * 60 * 60 * 24 * 2) return "Dün";

  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const ChatScreen: React.FC = () => {
  const [chatList, setChatList] = useState<ChatPreview[]>([]);
  const { user } = useAuth();
  const currentUserId = user?.uid;
  const router = useRouter();

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(firestore, "chats"),
      where("participants", "array-contains", currentUserId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const chatData = doc.data();
        const otherUser = chatData.participantsInfo?.find(
          (u: any) => u.id !== currentUserId
        );

        return {
          chatId: doc.id,
          otherUserName: otherUser?.name || "Bilinmeyen",
          otherUserImage: otherUser?.image || null,
          lastMessage: chatData.lastMessage || "",
          updatedAt: chatData.updatedAt || Date.now(),
        };
      });

      setChatList(data);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const goToChat = (chatId: string, otherUserName: string) => {
    router.push({
      pathname: "/MessagingScreen",
      params: {
        chatId,
        receiverName: otherUserName,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Sohbetler</Text>
      </View>

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => goToChat(item.chatId, item.otherUserName)}
          >
            <View style={styles.chatRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.otherUserName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.headerRow}>
                  <Text style={styles.chatName}>{item.otherUserName}</Text>
                  <Text style={styles.timeText}>
                    {formatTimestamp(item.updatedAt)}
                  </Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignItems: "center",
  },
  chatItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
