import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import provinceUniversities from "@/json/province-universities.json";
import { collection, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { query, where } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import { Alert } from "react-native";
import { Trash } from "phosphor-react-native";
import { deleteDoc, doc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface Post {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerUniversity: string;
  ownerImage: string;
  title: string;
  type: string;
  createdAt: number;
}

const POST_TYPES = [
  { label: "Kitap/Not", value: "notesAds" },
  { label: "Eşya Paylaşımı", value: "loanAds" },
  { label: "Yardımlaşma", value: "volunteerAds" },
  { label: "Etkinlik", value: "eventAds" },
];

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
};

const Discover = () => {
  const router = useRouter();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [allUniversities, setAllUniversities] = useState<string[]>([]);
  const [universitySearchText, setUniversitySearchText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // Gerçek zamanlı listeners'ları saklamak için
  const [unsubscribers, setUnsubscribers] = useState<(() => void)[]>([]);

  useEffect(() => {
    const formatUniversityName = (name: string): string => {
      return name
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toLocaleUpperCase("tr-TR") +
            word.slice(1).toLocaleLowerCase("tr-TR")
        )
        .join(" ");
    };
    const allUniversityNames = provinceUniversities.flatMap((province) =>
      province.universities.map((university) =>
        formatUniversityName(university.name)
      )
    );
    allUniversityNames.sort((a, b) => a.localeCompare(b, "tr-TR"));
    const universitiesWithAllOption = ["Tümü", ...allUniversityNames];
    setAllUniversities(universitiesWithAllOption);
    setUniversities(universitiesWithAllOption);
  }, []);

  useEffect(() => {
    if (user?.university) {
      const formatted = user.university
        .split(" ")
        .map(
          (w) =>
            w.charAt(0).toLocaleUpperCase("tr-TR") +
            w.slice(1).toLocaleLowerCase("tr-TR")
        )
        .join(" ");
      setSelectedUniversity(formatted);
    }
  }, [user?.university]);

  const setupRealtimeListeners = useCallback(() => {
    const db = getFirestore();
    const collections = ["loanAds", "notesAds", "volunteerAds", "eventAds"];
    const newUnsubscribers: (() => void)[] = [];

    unsubscribers.forEach(unsubscribe => unsubscribe());

    collections.forEach((collectionName) => {
      const ref = collection(db, collectionName);
      const q = selectedUniversity && selectedUniversity !== "Tümü"
        ? query(ref, where("ownerUniversity", "==", selectedUniversity))
        : ref;

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const collectionPosts: Post[] = [];
        
        snapshot.forEach((doc) => {
          const d = doc.data() as any;
          collectionPosts.push({
            id: doc.id,
            ownerId: d.ownerUid,
            ownerName: d.ownerName,
            ownerUniversity: d.ownerUniversity,
            ownerImage: d.ownerImage || "",
            title:
              d.itemTitle ||
              d.courseTitle ||
              d.adTitle ||
              d.ilanBasligi ||
              "İlan",
            type: collectionName,
            createdAt:
              typeof d.createdAt === "number"
                ? d.createdAt
                : typeof d.createdAt?.toDate === "function"
                ? d.createdAt.toDate().getTime()
                : Date.now(),
          });
        });

        setPosts(prevPosts => {
          const otherPosts = prevPosts.filter(post => post.type !== collectionName);
          const allPosts = [...otherPosts, ...collectionPosts];
          return allPosts.sort((a, b) => b.createdAt - a.createdAt);
        });
      }, (error) => {
        console.error(`${collectionName} dinleme hatası:`, error);
      });

      newUnsubscribers.push(unsubscribe);
    });

    setUnsubscribers(newUnsubscribers);
  }, [selectedUniversity]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setupRealtimeListeners();
      setLoading(false);
    };

    fetchData();

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [setupRealtimeListeners]);

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [selectedUniversity])
  );

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const db = getFirestore();
      const allData: Post[] = [];
      const collections = ["loanAds", "notesAds", "volunteerAds", "eventAds"];

      for (const name of collections) {
        const ref = collection(db, name);
        const q =
          selectedUniversity && selectedUniversity !== "Tümü"
            ? query(ref, where("ownerUniversity", "==", selectedUniversity))
            : ref;

        const snap = await getDocs(q);
        snap.forEach((doc) => {
          const d = doc.data() as any;
          allData.push({
            id: doc.id,
            ownerId: d.ownerUid,
            ownerName: d.ownerName,
            ownerUniversity: d.ownerUniversity,
            ownerImage: d.ownerImage || "",
            title:
              d.itemTitle ||
              d.courseTitle ||
              d.adTitle ||
              d.ilanBasligi ||
              "İlan",
            type: name,
            createdAt:
              typeof d.createdAt === "number"
                ? d.createdAt
                : typeof d.createdAt?.toDate === "function"
                ? d.createdAt.toDate().getTime()
                : Date.now(),
          });
        });
      }

      allData.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(allData);
    } catch (error) {
      console.error("Veri yenileme hatası:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesType = selectedType === null || post.type === selectedType;
    const matchesUniversity =
      selectedUniversity === "" ||
      selectedUniversity === "Tümü" ||
      post.ownerUniversity.includes(selectedUniversity);
    return matchesType && matchesUniversity;
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}.${parts[parts.length - 1][0]}`
      : name.slice(0, 2);
  };

  const handlePostPress = (post: Post) => {
    router.push({
      pathname: "/post-detail",
      params: {
        id: post.id,
        type: post.type,
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
            // Gerçek zamanlı listener otomatik olarak güncelleme yapacak
          } catch (error) {
            console.error("İlan silme hatası:", error);
          }
        },
      },
    ]);
  };

  const handleStartChat = async (post: Post) => {
    if (!user?.uid || !user?.name) return;
    const chatId = [user.uid, post.ownerId].sort().join("_");

    router.push({
      pathname: "/MessagingScreen",
      params: {
        chatId,
        receiverName: post.ownerName,
        receiverImage: post?.ownerImage,
        currentUserId: user?.uid,
        username: user?.name,
        receiverId: post.ownerId,
      },
    });
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {item.ownerImage && item.ownerImage.trim() !== "" ? (
              <Image
                source={{ uri: item.ownerImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {getInitials(item.ownerName)}
              </Text>
            )}
          </View>
          <View style={styles.userInfoContainer}>
            <View style={styles.userRow}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.ownerName}</Text>
                <View style={styles.universityRow}>
                  <Icons.MapPin
                    size={14}
                    color={colors.neutral400}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.universityText}>
                    {item.ownerUniversity}
                  </Text>
                </View>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Yayınlanma Tarihi</Text>
                <Text style={styles.dateText}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* başlık + filtre ikonu */}
      <View style={styles.titleRow}>
        <Text style={styles.postTitle}>{item.title}</Text>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => handlePostPress(item)}>
          <Text style={styles.detailsText}>Detayları görüntüle</Text>
        </TouchableOpacity>

        {user?.uid === item.ownerId ? (
          <TouchableOpacity
            onPress={() => handleDeletePost(item.id, item.type)}
          >
            <Trash size={20} color="#ff9800" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleStartChat(item)}
          >
            <Text style={styles.contactButtonText}>İlgileniyorum</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icons.MagnifyingGlass size={80} color={colors.neutral300} />
      </View>
      <Text style={styles.emptyTitle}>
        {selectedType ? "Bu kategoride henüz ilan yok" : "Henüz ilan bulunmuyor"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {selectedUniversity && selectedUniversity !== "Tümü" 
          ? `${selectedUniversity} için ${selectedType ? 'bu kategoride' : ''} henüz ilan paylaşılmamış.`
          : `${selectedType ? 'Bu kategoride' : ''} İlk ilanı sen paylaş!`
        }
      </Text>
      
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => router.push('/(tabs)')} 
      >
        <Icons.Plus size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.emptyButtonText}>İlan Oluştur</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={refreshData}
      >
        <Icons.ArrowClockwise size={18} color={colors.neutral400} style={{ marginRight: 6 }} />
        <Text style={styles.refreshButtonText}>Yenile</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#188040" />
          <Text style={styles.loadingText}>İlanlar yükleniyor...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          textAlign: "center",
          color: colors.black,
        }}
      >
        İlanlar
      </Text>

      {/* Üniversite seçici */}
      <View style={styles.universityPickerContainer}>
        <TouchableOpacity
          onPress={() => setShowUniversityModal(!showUniversityModal)}
          style={styles.selectContainer}
        >
          <Text
            style={
              selectedUniversity ? styles.selectText : styles.placeholderText
            }
          >
            {selectedUniversity || "Okul seçiniz"}
          </Text>
          <Icons.Funnel size={18} color={colors.black} />
        </TouchableOpacity>
        {showUniversityModal && (
          <View style={styles.dropdown}>
            <TextInput
              style={styles.searchInput}
              placeholder="Üniversite Ara..."
              placeholderTextColor={colors.neutral300}
              value={universitySearchText}
              onChangeText={(text) => {
                setUniversitySearchText(text);
                setUniversities(
                  text
                    ? allUniversities.filter((u) =>
                        u
                          .toLocaleLowerCase("tr-TR")
                          .includes(text.toLocaleLowerCase("tr-TR"))
                      )
                    : allUniversities
                );
              }}
            />
            <FlatList
              data={universities}
              keyExtractor={(item) => item}
              style={{ maxHeight: 250 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUniversity(item);
                    setShowUniversityModal(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* İlan Türü Seçici */}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => setShowTypeModal(!showTypeModal)}
        >
          <Text style={styles.typeButtonText}>
            {selectedType
              ? POST_TYPES.find((t) => t.value === selectedType)?.label
              : "İlan türü seçin"}
          </Text>
          <Icons.Funnel  size={18} color={colors.black} />
        </TouchableOpacity>
        {showTypeModal && (
          <View style={styles.typeModal}>
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                setSelectedType(null);
                setShowTypeModal(false);
              }}
            >
              <Text style={styles.typeOptionText}>Tümü</Text>
            </TouchableOpacity>
            {POST_TYPES.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={styles.typeOption}
                onPress={() => {
                  setSelectedType(value);
                  setShowTypeModal(false);
                }}
              >
                <Text style={styles.typeOptionText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* İlan Listesi */}
      {filteredPosts.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          {renderEmptyState()}
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.postsList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshData}
        />
      )}
    </ScreenWrapper>
  );
};

export default Discover;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 35 },
  universityPickerContainer: { padding: 16 },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  selectText: { fontSize: 14, color: colors.black },
  placeholderText: { fontSize: 14, color: colors.neutral300 },
  searchInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    fontSize: 16,
    backgroundColor: colors.neutral100,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginTop: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  dropdownItemText: { fontSize: 16 },
  typeContainer: { paddingHorizontal: 16, marginBottom: 12 },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  typeButtonText: { fontSize: 16, color: colors.neutral300 },
  typeModal: {
    marginTop: 4,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    elevation: 5,
    zIndex: 20,
  },
  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  typeOptionText: { fontSize: 16 },
  postsList: { padding: 16 },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral100,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.neutral400,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  refreshButtonText: {
    color: colors.neutral400,
    fontSize: 14,
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    width: "100%",
  },
  userInfoContainer: { flex: 1 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: "bold" },
  avatarImage: { width: 36, height: 36, borderRadius: 18 },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  userDetails: { flex: 1 },
  userName: { fontSize: 13, fontWeight: "600" },
  universityRow: { flexDirection: "row", alignItems: "center" },
  universityText: { fontSize: 11, color: colors.neutral400 },
  dateContainer: { alignItems: "flex-end", minWidth: 100 },
  dateLabel: { fontSize: 11, color: "#888", textAlign: "right" },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  postTitle: { fontSize: 16 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 14,
    color: colors.neutral400,
    textDecorationLine: "underline",
  },
  contactButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactButtonText: { color: "white", fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: colors.neutral400 },
});