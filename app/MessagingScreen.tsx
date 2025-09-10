// MessagingScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Messaging from "@/components/Messaging";
import { useAuth } from "@/contexts/authContext";
import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { Image } from "expo-image";
import { firestore } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

const MessagingScreen = () => {
  const { chatId, receiverName, receiverImage, receiverId } =
    useLocalSearchParams<{
      chatId: string;
      receiverName: string;
      receiverImage?: string;
      receiverId?: string;
    }>();
  const { user } = useAuth();
  const router = useRouter();

  const [receiverProfileImage, setReceiverProfileImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  if (!chatId || !receiverName || !user?.uid || !user?.name) {
    return null;
  }

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
        // Farklı alan isimlerini kontrol et
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

  // receiverId varsa profil resmini çek
  useEffect(() => {
    const loadReceiverProfileImage = async () => {
      if (receiverId && receiverId !== "undefined") {
        const profileImage = await fetchUserProfileImage(receiverId);
        setReceiverProfileImage(profileImage);
      }
      setLoading(false);
    };

    loadReceiverProfileImage();
  }, [receiverId]);

  // Önce receiverImage prop'unu kontrol et, yoksa çekilen resmi kullan
  const finalReceiverImage =
    receiverImage &&
    receiverImage.trim() !== "" &&
    receiverImage !== "undefined"
      ? receiverImage
      : receiverProfileImage;

  console.log("MessagingScreen Debug:", {
    receiverId,
    receiverImage,
    receiverProfileImage,
    finalReceiverImage,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>

        {/* Receiver Avatar */}
        <View style={styles.receiverAvatar}>
          {finalReceiverImage ? (
            <Image
              source={{ uri: finalReceiverImage }}
              style={styles.avatarImage}
              onError={() =>
                console.log("Header avatar yüklenemedi:", finalReceiverImage)
              }
            />
          ) : (
            <Text style={styles.avatarText}>{getInitials(receiverName)}</Text>
          )}
        </View>
        <Text style={styles.headerText}>{receiverName}</Text>
      </View>

      <Messaging
        chatId={chatId}
        currentUserId={user.uid}
        username={user.name}
        receiverName={receiverName}
        receiverImage={finalReceiverImage}
        receiverId={receiverId}
      />
    </View>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 16,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },
  receiverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    flex: 1,
  },
});
