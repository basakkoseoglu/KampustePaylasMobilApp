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

interface MessageWithDate {
  id: string;
  text: string;
  senderId: string;
  username?: string;
  timestamp: number;
  type: "message" | "date";
  dateLabel?: string;
  showAvatar?: boolean;
  senderImage?: string;
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
  const [processedMessages, setProcessedMessages] = useState<MessageWithDate[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const [isTypingText, setIsTypingText] = useState("");
  const [chatExists, setChatExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantImages, setParticipantImages] = useState<{
    [key: string]: string;
  }>({});
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
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

  // Mesajları tarih etiketleri ile birlikte işle
  const processMessagesWithDates = (messages: any[]) => {
    if (messages.length === 0) return [];

    const grouped: { [key: string]: any[] } = {};
    messages.forEach((msg) => {
      const label = formatDateLabel(msg.timestamp);
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });

    const processed: MessageWithDate[] = [];

    Object.entries(grouped).forEach(([label, group]) => {
      // Tarih etiketi ekle
      processed.push({
        id: `date-${label}`,
        timestamp: group[0].timestamp,
        type: "date",
        dateLabel: label,
        text: "",
        senderId: "",
      });

      // Grup içindeki mesajları ekle
      group.forEach((msg, index) => {
        const prevMsg = group[index - 1];
        const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
        const senderImage = participantImages[msg.senderId] || "";

        processed.push({
          ...msg,
          type: "message",
          showAvatar,
          senderImage,
        });
      });
    });

    return processed;
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

    let messagesUnsubscribe: (() => void) | null = null;
    let typingUnsubscribe: (() => void) | null = null;

    const initializeChat = async () => {
      try {
        setLoading(true);

        // Chat'in var olup olmadığını kontrol et
        const chatDocRef = doc(firestore, "chats", chatId);
        const chatDoc = await getDoc(chatDocRef);
        setChatExists(chatDoc.exists());

        // Mesajları dinlemeye başla
        const messagesRef = collection(firestore, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp"));

        messagesUnsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(fetched);

            // İlk yüklenme tamamlandı
            if (!isInitialLoadComplete) {
              setIsInitialLoadComplete(true);
            }
          },
          (error) => {
            console.error("Mesajlar dinlenirken hata:", error);
            setLoading(false);
          }
        );

        // Typing durumunu dinle
        typingUnsubscribe = onSnapshot(chatDocRef, (docSnap) => {
          const data = docSnap.data();
          if (data?.typingUser && data.typingUser !== currentUserId) {
            setIsTypingText(`${data.typingUsername} yazıyor...`);
          } else {
            setIsTypingText("");
          }
        });
      } catch (error) {
        console.error("Chat başlatılırken hata:", error);
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (messagesUnsubscribe) messagesUnsubscribe();
      if (typingUnsubscribe) typingUnsubscribe();
    };
  }, [chatId, currentUserId]);

  // Loading durumunu kontrol et - hem mesajlar hem de participant images yüklendiğinde kapat
  useEffect(() => {
    if (isInitialLoadComplete) {
      // Kısa bir gecikme ile loading'i kapat (UI smoothness için)
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isInitialLoadComplete]);

  // Mesajları işle ve processed messages'ı güncelle
  useEffect(() => {
    const processed = processMessagesWithDates(messages);
    setProcessedMessages(processed);
  }, [messages, participantImages]);

  // Yeni mesaj geldiğinde en alta scroll et
  useEffect(() => {
    if (processedMessages.length > 0 && !loading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [processedMessages, loading]);

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
    const messageText = newMessage.trim();
    setNewMessage("");

    if (chatExists === false) {
      await createChatDocument();
    }

    const messageData = {
      text: messageText,
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

  const renderItem = ({ item }: { item: MessageWithDate }) => {
    if (item.type === "date") {
      return <Text style={styles.dateLabel}>{item.dateLabel}</Text>;
    }

    // MessageItem için gerekli props'ları hazırla
    const messageItemData = {
      text: item.text,
      senderId: item.senderId,
      username: item.username,
      timestamp: item.timestamp,
    };

    return (
      <MessageItem
        item={messageItemData}
        currentUserId={currentUserId}
        showAvatar={item.showAvatar}
        senderImage={item.senderImage}
        receiverImage={receiverImage}
        receiverName={receiverName}
        getInitials={getInitials}
      />
    );
  };

  // Loading ekranını göster
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
        </View>
      </View>
    );
  }

  // Hiç mesaj yoksa
  if (processedMessages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessageText}>İlk mesajı gönderin!</Text>
        </View>

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          handleTyping={handleTyping}
          stopTyping={stopTyping}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={processedMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        onContentSizeChange={() => {
          // İçerik boyutu değiştiğinde (yeni mesaj geldiğinde) en alta scroll et
          if (!loading) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }}
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
    backgroundColor: "#f5f5f5",
    marginBottom: 5,
    paddingTop: 5,
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexGrow: 1,
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
