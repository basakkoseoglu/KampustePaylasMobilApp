import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import { firestore } from "@/config/firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";

interface MessagingProps {
  chatId: string;
  currentUserId: string;
  username: string;
  receiverName: string;
  receiverImage?: string;
  receiverId?: string;
}

const Messaging: React.FC<MessagingProps> = ({
  chatId,
  currentUserId,
  username,
  receiverName,
  receiverImage,
  receiverId,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTypingText, setIsTypingText] = useState("");
  const [chatExists, setChatExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantImages, setParticipantImages] = useState<{
    [key: string]: string;
  }>({});
  const flatListRef = useRef<FlatList>(null);

  const formatDateLabel = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const msgStart = new Date(date.setHours(0, 0, 0, 0));
    const diffDays = Math.floor(
      (todayStart.getTime() - msgStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7)
      return msgStart.toLocaleDateString("tr-TR", { weekday: "long" });
    return msgStart.toLocaleDateString("tr-TR");
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2).toUpperCase();
  };

  // Kullanıcı profil resmini Firebase'den çek
  const fetchUserProfileImage = async (userId: string) => {
    try {
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profileImage =
          userData.profileImage ||
          userData.imageUrl ||
          userData.image ||
          userData.photoURL ||
          "";
        return profileImage;
      }
    } catch (error) {
      console.error("Kullanıcı profil resmi çekilemedi:", error);
    }
    return "";
  };

  // Chat participants'ların profil resimlerini çek
  useEffect(() => {
    const loadParticipantImages = async () => {
      try {
        const chatDocRef = doc(firestore, "chats", chatId);
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          const participants = chatData.participants || [];
          const imagePromises = participants.map(
            async (participantId: string) => {
              const profileImage = await fetchUserProfileImage(participantId);
              return { [participantId]: profileImage };
            }
          );

          const imageResults = await Promise.all(imagePromises);
          const imagesMap = imageResults.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          );
          setParticipantImages(imagesMap);

          console.log("Participant Images:", imagesMap);
        }
      } catch (error) {
        console.error("Participant resimleri yüklenirken hata:", error);
      }
    };

    if (chatId) {
      loadParticipantImages();
    }
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const checkChatExists = async () => {
      try {
        const chatDocRef = doc(firestore, "chats", chatId);
        const chatDoc = await getDoc(chatDocRef);
        setChatExists(chatDoc.exists());
      } catch (error) {
        console.error("Chat kontrol hatası:", error);
        setChatExists(false);
      }
    };

    checkChatExists();

    const messagesRef = collection(firestore, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
      setLoading(false);
    });

    const chatDocRef = doc(firestore, "chats", chatId);
    const unsubscribeTyping = onSnapshot(chatDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.typingUser && data.typingUser !== currentUserId) {
        setIsTypingText(`${data.typingUsername} yazıyor...`);
      } else {
        setIsTypingText("");
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

  const createChatDocument = async () => {
    if (!receiverId) return;

    const chatDocRef = doc(firestore, "chats", chatId);
    await setDoc(chatDocRef, {
      participants: [currentUserId, receiverId],
      participantNames: {
        [currentUserId]: username,
        [receiverId]: receiverName,
      },
      createdAt: Date.now(),
      lastMessage: "",
      updatedAt: Date.now(),
      typingUser: "",
      typingUsername: "",
    });
    setChatExists(true);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    if (chatExists === false) {
      await createChatDocument();
    }

    const messageData = {
      text: newMessage,
      senderId: currentUserId,
      username: username,
      timestamp: Date.now(),
    };

    const messagesRef = collection(firestore, "chats", chatId, "messages");
    await addDoc(messagesRef, messageData);

    const chatDocRef = doc(firestore, "chats", chatId);
    await setDoc(
      chatDocRef,
      {
        lastMessage: messageData.text,
        updatedAt: messageData.timestamp,
        typingUser: "",
        typingUsername: "",
      },
      { merge: true }
    );

    setNewMessage("");
  };

  const handleTyping = async () => {
    if (chatExists === false) return;

    const chatDocRef = doc(firestore, "chats", chatId);
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
    if (chatExists === false) return;

    const chatDocRef = doc(firestore, "chats", chatId);
    await setDoc(
      chatDocRef,
      {
        typingUser: "",
        typingUsername: "",
      },
      { merge: true }
    );
    setIsTypingText("");
  };

  const renderMessagesWithDate = () => {
    if (messages.length === 0) {
      return (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessageText}>İlk mesajı gönderin!</Text>
        </View>
      );
    }

    const grouped: { [key: string]: any[] } = {};
    messages.forEach((msg) => {
      const label = formatDateLabel(msg.timestamp);
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });

    return Object.entries(grouped).map(([label, group]) => (
      <View key={label}>
        <Text style={styles.dateLabel}>{label}</Text>
        {group.map((msg, index) => {
          const prevMsg = group[index - 1];
          const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;

          // Mesajı gönderen kişinin profil resmini al
          const senderImage = participantImages[msg.senderId] || "";

          return (
            <MessageItem
              key={msg.id}
              item={msg}
              currentUserId={currentUserId}
              showAvatar={showAvatar}
              senderImage={senderImage} // Gönderenin profil resmi
              receiverImage={receiverImage}
              receiverName={receiverName}
              getInitials={getInitials}
            />
          );
        })}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={[]}
          ListHeaderComponent={<>{renderMessagesWithDate()}</>}
          renderItem={null}
          contentContainerStyle={styles.messagesList}
          keyboardShouldPersistTaps="handled"
        />
      )}

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
    backgroundColor: "#f5f5f5",
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
    fontStyle: "italic",
    color: "black",
  },
  dateLabel: {
    alignSelf: "center",
    backgroundColor: "#e0f7e9",
    color: "#1e5128",
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: "600",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 12,
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyMessageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
