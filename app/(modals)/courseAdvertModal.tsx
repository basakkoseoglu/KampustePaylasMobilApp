import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import * as Icons from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import BackButton from "@/components/BackButton";
import { doc, getDoc } from "firebase/firestore";

const CourseAdvertModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);

  const [ownerName, setOwnerName] = useState("");
  const [schoolInfo, setSchoolInfo] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  // Dropdown states
  const [resourceType, setResourceType] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const resourceTypes = ["DERS NOTU", "KİTAP", "ÖZET", "SUNUM & SLAYT"];

  const [conditionType, setConditionType] = useState("");
  const [conditionDropdownVisible, setConditionDropdownVisible] =
    useState(false);
  const conditionTypes = ["TEMİZ", "KULLANILMIŞ"];

  const [shareType, setShareType] = useState("");
  const [shareDropdownVisible, setShareDropdownVisible] = useState(false);
  const shareTypes = ["ÜCRETSİZ", "TAKAS", "SATILIK", "KİRALIK"];

  useEffect(() => {
    if (user?.name) setOwnerName(user.name);
    if (user?.university) setSchoolInfo(user.university);
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const ref = doc(firestore, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setOwnerName(data.name || "");
          setSchoolInfo(data.university || "");
          setUserImage(data.image || null);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleResourceTypeSelect = (type: string) => {
    setResourceType(type);
    setDropdownVisible(false);
  };

  const handleConditionTypeSelect = (type: string) => {
    setConditionType(type);
    setConditionDropdownVisible(false);
  };

  const handleShareTypeSelect = (type: string) => {
    setShareType(type);
    setShareDropdownVisible(false);
  };

  const handleSubmitNotesAd = async () => {
    if (
      !courseTitle ||
      !courseName ||
      !description ||
      !resourceType ||
      !conditionType ||
      !shareType
    ) {
      Alert.alert("Eksik Alan", "Lütfen tüm alanları doldurun.", [
        { text: "Tamam" },
      ]);
      return;
    }
    try {
      const ref = collection(firestore, "notesAds");
      await addDoc(ref, {
        ownerUid: user?.uid,
        ownerName: user?.name,
        ownerUniversity: user?.university,
        ownerImage: userImage,

        courseTitle,
        courseName,
        description,
        resourceType,
        conditionType,
        shareType,

        createdAt: serverTimestamp(),
      });
      Alert.alert(
        "İlan Oluşturuldu 🎉",
        "Ders notu & kitap yardım ilanınız kaydedildi.",
        [
          {
            text: "Tamam",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Hata 😢", "Kaydedilirken bir hata oluştu.", [
        { text: "Tamam" },
      ]);
    }
  };

  const renderDropdownModal = (
    visible: boolean,
    items: string[],
    onSelect: (item: string) => void,
    onClose: () => void
  ) => (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownMenu}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenWrapper style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Ana Başlık */}
          <View style={styles.titleRow}>
            <BackButton
              iconSize={30}
              style={{
                backgroundColor: "#79A57BFF",
                padding: 6,
                marginRight: 12,
              }}
            />
            <Text style={styles.mainTitle}>Ders Notu & Kitap Paylaşımı</Text>
          </View>
          <Text style={styles.subTitle}>
            Ders notu ve kitaplarınızı paylaşın!
          </Text>

          {/* Kişi Bilgileri (Card) */}
          <View style={styles.card}>
            {/* Kart Başlığı */}
            <View style={styles.cardHeaderRow}>
              <Icons.User size={24} color="#FF9800" style={styles.headerIcon} />
              <Text style={styles.cardTitle}>Kişi Bilgileri</Text>
            </View>

            {/* İsim */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Icons.UserCircle
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>İsim</Text>
              </View>
              <TextInput value={ownerName} editable={false} />
            </View>

            {/* Üniversite */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Icons.Building
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Üniversite</Text>
              </View>
              <TextInput value={schoolInfo} editable={false} />
            </View>
          </View>

          {/* İlan Bilgileri (Card) */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Icons.FileText
                size={24}
                color="#FF9800"
                style={styles.headerIcon}
              />
              <Text style={styles.cardTitle}>İlan Bilgileri</Text>
            </View>

            {/* İlan Başlığı */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Icons.PencilSimple
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>İlan Başlığı</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Örn. Matematik 2 Ders Notları"
                placeholderTextColor="#999"
                value={courseTitle}
                onChangeText={setCourseTitle}
              />
            </View>

            {/* Ders Adı / Konu */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Icons.BookOpen
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Ders Adı / Konu</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Örn. Diferansiyel Denklemler"
                placeholderTextColor="#999"
                value={courseName}
                onChangeText={setCourseName}
              />
            </View>

            {/* Açıklama */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Icons.NotePencil
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Açıklama</Text>
              </View>
              <View style={styles.descriptionContainer}>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="İlan ile ilgili detayları buraya yazabilirsiniz..."
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>

          {/* Ek Bilgiler (Card) */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Icons.Info size={24} color="#FF9800" style={styles.headerIcon} />
              <Text style={styles.cardTitle}>Ek Bilgiler</Text>
            </View>

            {/* Resource Type Dropdown */}
            <View style={styles.optionContainer}>
              <View style={styles.labelRow}>
                <Icons.Notebook
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.optionText}>Not / Kaynak Türü</Text>
              </View>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {resourceType || "Not / Kaynak Türünü Seçin"}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Condition Dropdown */}
            <View style={styles.optionContainer}>
              <View style={styles.labelRow}>
                <Icons.CheckCircle
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.optionText}>Durumu</Text>
              </View>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setConditionDropdownVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {conditionType || "Durum Seçin"}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Share Type Dropdown */}
            <View style={styles.optionContainer}>
              <View style={styles.labelRow}>
                <Icons.ShareNetwork
                  size={20}
                  color="#555"
                  style={styles.labelIcon}
                />
                <Text style={styles.optionText}>Paylaşım Şekli</Text>
              </View>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShareDropdownVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {shareType || "Paylaşım Şeklini Seçin"}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Dropdown Modalları */}
        {renderDropdownModal(
          dropdownVisible,
          resourceTypes,
          handleResourceTypeSelect,
          () => setDropdownVisible(false)
        )}
        {renderDropdownModal(
          conditionDropdownVisible,
          conditionTypes,
          handleConditionTypeSelect,
          () => setConditionDropdownVisible(false)
        )}
        {renderDropdownModal(
          shareDropdownVisible,
          shareTypes,
          handleShareTypeSelect,
          () => setShareDropdownVisible(false)
        )}

        {/* Yayınla Butonu */}
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handleSubmitNotesAd}
        >
          <Text style={styles.publishButtonText}>Yayınla</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#79A57BFF",
    marginTop: 7,
    textAlign: "center",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 1,
  },
  // Kart Başlığında İkon ve Metin Aynı Satır
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF9800",
  },

  // Label Satırında İkon ve Metin Aynı Hizada
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    // Açıklama alanıyla aynı gölge efekti:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },

  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
  },

  inputWrapper: {
    marginBottom: 16, // biraz daha boşluk ekledim
  },

  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },

  descriptionInput: {
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },

  optionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    width: 100,
    marginRight: 12,
  },

  dropdownButtonText: {
    fontSize: 14,
    color: colors.neutral400,
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  publishButton: {
    backgroundColor: "#79A57BFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    margin: 16,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // marginTop: 16,
    paddingHorizontal: 16,
  },
});

export default CourseAdvertModal;
