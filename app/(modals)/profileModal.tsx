import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import * as Icons from "phosphor-react-native";
import { UserDataType } from "@/types";
import Typo from "@/components/Typo";
import TextInputField from "@/components/TextInputField";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import UniversityPicker from "@/components/universityPicker";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
    university: "",
    department: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const router = useRouter();
  const isFocused = useIsFocused();

  // Gender options
  const genderOptions = [
    { label: " Seçiniz", value: "" },
    { label: " Erkek", value: " Erkek" },
    { label: " Kadın", value: " Kadın" },
    { label: " Belirtmek İstemiyorum", value: " Belirtmek İstemiyorum" },
  ];

  // İlk olarak, mevcut kullanıcı verilerini local state'e aktarıyoruz
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        image: user.image || null,
        university: user.university || "",
        department: user.department || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  // fetchUserData fonksiyonunu bileşenin üst seviyesinde tanımlıyoruz
  const fetchUserData = async () => {
    if (user?.uid) {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const fetchedData = userSnap.data();
        setUserData({
          name: fetchedData.name || "",
          image: fetchedData.image || null,
          university: fetchedData.university || "",
          department: fetchedData.department || "",
          gender: fetchedData.gender || "",
        });
        setImageUrl(fetchedData.image);
      } else {
        console.log("Kullanıcı bulunamadı!");
      }
    }
  };

  // Ekran odaklandığında (isFocused) kullanıcı verilerini çekiyoruz
  useEffect(() => {
    if (isFocused && user?.uid) {
      fetchUserData();
    }
  }, [isFocused, user?.uid]);

  // Ayrıca user?.uid değiştiğinde de veriyi çekiyoruz
  useEffect(() => {
    if (user?.uid) {
      fetchUserData();
    }
  }, [user?.uid]);

  // userData.image güncellendiğinde imageUrl'yi güncelle
  useEffect(() => {
    setImageUrl(userData.image);
  }, [userData.image]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setUserData({ ...userData, image: result.assets[0].uri });
    }
  };

  const onSubmit = async () => {
    let { name, image, university, department, gender } = userData;
    if (
      !name.trim() ||
      !university?.trim() ||
      !department?.trim() ||
      !gender?.trim()
    ) {
      Alert.alert("Kullanıcı", "Lütfen tüm alanları doldurun.");
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);
    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("Kullanıcı", res.msg);
    }
  };

  return (
    <>
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title="Profili Güncelle"
            leftIcon={
              <BackButton
                iconSize={24}
                iconColor="#666"
                style={{
                  backgroundColor: "transparent",
                  elevation: 0,
                  padding: 0,
                }}
              />
            }
            style={{ marginBottom: spacingY._10 }}
          />
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={
                  imageUrl
                    ? { uri: imageUrl }
                    : require("../../assets/images/defaultAvatar.png")
                }
                contentFit="cover"
                transition={100}
              />
              <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                <Icons.Pencil size={verticalScale(20)} color={colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.black}>İsim</Typo>
              <TextInputField
                placeholder={userData.name ? "" : "İsim"}
                value={userData.name}
                onChangeText={(value) =>
                  setUserData({ ...userData, name: value })
                }
                style={{ paddingTop: verticalScale(2), fontSize: 16 }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.black}>Üniversite </Typo>
              <UniversityPicker
                value={userData.university || ""}
                onChange={(university) =>
                  setUserData({ ...userData, university })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.black}>Bölüm </Typo>
              <TextInput
                placeholder="Bölüm"
                value={userData.department}
                onChangeText={(value) =>
                  setUserData({ ...userData, department: value })
                }
                style={{
                  borderWidth: 1,
                  borderColor: colors.neutral300,
                  paddingHorizontal: spacingX._15,
                  borderRadius: 12,
                  height: verticalScale(60),
                  fontSize: 16,
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.black}>Cinsiyet</Typo>
              <TouchableOpacity
                onPress={() => setShowGenderModal(true)}
                style={styles.selectContainer}
              >
                <Typo color={colors.black} fontWeight={"300"}>
                  {userData.gender ? userData.gender : "Seçiniz"}
                </Typo>
                <Icons.CaretDown
                  size={16}
                  color={colors.black}
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        {!showGenderModal && (
          <View style={styles.footer}>
            <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
              <Typo color={colors.white} fontWeight={"700"}>
                Güncelle
              </Typo>
            </Button>
          </View>
        )}
      </ModalWrapper>

      {showGenderModal && (
        <ModalWrapper style={{ backgroundColor: "transparent" }}>
          <View style={styles.modalContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setUserData({ ...userData, gender: option.value });
                  setShowGenderModal(false);
                }}
                style={styles.modalOption}
              >
                <Typo color={colors.black} fontWeight={"300"}>
                  {option.label}
                </Typo>
              </TouchableOpacity>
            ))}
            {/* İsteğe bağlı: Modalı kapatmak için iptal butonu */}
            <Button
              onPress={() => setShowGenderModal(false)}
              style={styles.cancelButton}
            >
              <Typo color={colors.white}>Vazgeç</Typo>
            </Button>
          </View>
        </ModalWrapper>
      )}
    </>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral800,
    marginBottom: spacingY._5,
  },
  form: {
    gap: spacingY._25,
    marginTop: spacingY._10,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral300,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    height: verticalScale(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: spacingX._10,
    backgroundColor: colors.neutral100,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._5,
  },
  dropdownIcon: {
    marginRight: spacingX._10,
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: spacingY._20,
    borderRadius: 8,
    margin: spacingX._20,
  },
  modalOption: {
    paddingVertical: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral300,
  },
  cancelButton: {
    marginTop: spacingY._15,
    backgroundColor: colors.neutral300,
  },
});
