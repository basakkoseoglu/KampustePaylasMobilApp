import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { Trash } from "phosphor-react-native";

interface VolunteerDetailViewProps {
  data: any;
}

const VolunteerDetailView: React.FC<VolunteerDetailViewProps> = ({ data }) => {
  const { user } = useAuth();

  const handleStartChat = async (postData: any) => {
    if (!user?.uid || !user?.name) return;

    // Firebase'deki alan adını kontrol et - genelde ownerUid kullanılır
    const receiverId = postData.ownerUid || postData.ownerId;

    if (!receiverId) {
      console.error("receiverId bulunamadı:", postData);
      return;
    }

    const chatId = [user.uid, receiverId].sort().join("_");

    router.push({
      pathname: "/MessagingScreen",
      params: {
        chatId,
        receiverName: postData.ownerName,
        receiverImage: postData?.ownerImage || "",
        currentUserId: user?.uid,
        username: user?.name,
        receiverId: receiverId,
      },
    });
  };

  const handleDeletePost = async (postId: string, type: string) => {
    Alert.alert("İlanı Sil", "Bu ilanı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(getFirestore(), type, postId));
            // Silme işlemi tamamlandıktan sonra geri dön
            router.back();
          } catch (error) {
            console.error("İlan silme hatası:", error);
          }
        },
      },
    ]);
  };

  // Kullanıcının kendi ilanı mı kontrol et
  const isOwnPost = user?.uid === (data.ownerUid || data.ownerId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Kişi Bilgileri */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icons.User size={18} color="#FF9800" weight="bold" />
          <Text style={styles.sectionTitle}>Kişi Bilgileri</Text>
        </View>
        <InfoRow label="İsim" value={data.ownerName} />
        <InfoRow label="Üniversite" value={data.ownerUniversity} />
      </View>

      {/* İlan Bilgileri */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icons.Handshake size={18} color="#FF9800" weight="bold" />
          <Text style={styles.sectionTitle}>İlan Bilgileri</Text>
        </View>
        <InfoRow
          label="Başlık"
          value={data.adTitle || data.title || data.itemTitle}
        />
        <InfoRow label="Açıklama" value={data.description} />
        <InfoRow label="Beklentiler & Koşullar" value={data.expectations} />
        <InfoRow label="Yardım Türü" value={data.helpType} />
        <InfoRow label="Tarih" value={data.eventDate} />
        <InfoRow label="Konum" value={data.eventLocation} />

        {/* Tarih bilgisi varsa göster */}
        {data.createdAt && (
          <InfoRow
            label="Yayınlanma Tarihi"
            value={formatDate(data.createdAt)}
          />
        )}
      </View>

      {/* Butonlar */}
      <View style={styles.footer}>
        {isOwnPost ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              handleDeletePost(data.id, data.type || "volunteerAds")
            }
          >
            <Trash size={20} color="white" />
            <Text style={styles.deleteButtonText}>İlanı Sil</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleStartChat(data)}
          >
            <Text style={styles.contactButtonText}>İlgileniyorum</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.rowColumn}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "—"}</Text>
  </View>
);

// Tarih formatlama fonksiyonu
const formatDate = (timestamp: number | any) => {
  let date;
  if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (timestamp && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else {
    return "—";
  }

  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
};

export default VolunteerDetailView;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.neutral100,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  rowColumn: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "500",
    color: colors.neutral400,
    marginBottom: 4,
  },
  value: {
    color: colors.black,
    fontWeight: "500",
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 32,
    alignItems: "center",
  },
  contactButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: colors.neutral400,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  descriptionValue: {
    color: colors.black,
    fontWeight: "500",
    marginTop: 4,
    lineHeight: 20,
  },
});
