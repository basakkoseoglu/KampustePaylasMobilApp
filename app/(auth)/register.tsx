import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

import universityData from "../../json/province-universities.json";
import TextInputField from "@/components/TextInputField";

type University = {
  name: string;
  phone: string;
  fax: string;
  website: string;
  email: string;
  adress: string;
  rector: string;
};

type ProvinceUniversity = {
  province: string;
  universities: University[];
};

const isIos = Platform.OS === "ios";

const Register: React.FC = () => {
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const nameRef = useRef<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  // Modal ve üniversite listesi için state
  const [showModal, setShowModal] = useState(false);
  const [allUniversities, setAllUniversities] = useState<string[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>(
    []
  );
  const [searchText, setSearchText] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");

  // Loading state for universities loading
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  // Üniversite isimlerini çek, Türkçe uyumlu biçimlendir ve sırala
  useEffect(() => {
    setLoadingUniversities(true);

    const timer = setTimeout(() => {
      const formatUniversityName = (name: string) => {
        const lower = name.toLocaleLowerCase("tr-TR");
        return lower
          .split(" ")
          .map((w) =>
            w.length > 0
              ? w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1)
              : ""
          )
          .join(" ");
      };

      const names = (universityData as ProvinceUniversity[]).flatMap((prov) =>
        prov.universities.map((u) => formatUniversityName(u.name))
      );

      names.sort((a, b) => a.localeCompare(b, "tr-TR"));

      setAllUniversities(names);
      setFilteredUniversities(names);
      setLoadingUniversities(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const openModal = () => {
    setSearchText(selectedUniversity);
    if (selectedUniversity.trim() === "") {
      setFilteredUniversities(allUniversities);
    } else {
      const filtered = allUniversities.filter((u) =>
        u
          .toLocaleLowerCase("tr-TR")
          .includes(selectedUniversity.toLocaleLowerCase("tr-TR"))
      );
      setFilteredUniversities(filtered);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredUniversities(allUniversities);
    } else {
      const filtered = allUniversities.filter((u) =>
        u.toLocaleLowerCase("tr-TR").includes(text.toLocaleLowerCase("tr-TR"))
      );
      setFilteredUniversities(filtered);
    }
  };

  const handleSelectUniversity = (uni: string) => {
    setSelectedUniversity(uni);
    setSearchText(uni);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (
      !emailRef.current.trim() ||
      !passwordRef.current.trim() ||
      !nameRef.current.trim() ||
      !selectedUniversity.trim()
    ) {
      Alert.alert("Kayıt Ol", "Lütfen tüm alanları doldurun.");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current,
      selectedUniversity
    );
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Kayıt Ol", res.msg);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require("../../assets/images/logo3.png")}
          />
        </View>

        <View style={styles.form}>
          <TextInputField
            placeholder="Kullanıcı Adı"
            onChangeText={(v) => (nameRef.current = v)}
            icon={
              <Icons.User size={verticalScale(20)} color={colors.neutral300} />
            }
          />
          <TextInputField
            placeholder="E-Posta"
            onChangeText={(v) => (emailRef.current = v)}
            icon={
              <Icons.At size={verticalScale(20)} color={colors.neutral300} />
            }
          />
          <TextInputField
            placeholder="Şifre"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(v) => (passwordRef.current = v)}
            icon={
              <Icons.Lock size={verticalScale(20)} color={colors.neutral300} />
            }
            rightIcon={
              <Pressable
                onPress={() => setIsPasswordVisible((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {isPasswordVisible ? (
                  <Icons.Eye
                    size={verticalScale(20)}
                    color={colors.neutral300}
                  />
                ) : (
                  <Icons.EyeClosed
                    size={verticalScale(20)}
                    color={colors.neutral300}
                  />
                )}
              </Pressable>
            }
          />

          {/* Üniversite seçici */}
          <TouchableOpacity
            onPress={openModal}
            style={[
              styles.universitySelector,
              { borderColor: colors.neutral300 },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icons.Building size={20} color={colors.neutral300} />
              <Text
                style={{
                  fontSize: 16,
                  color: selectedUniversity ? colors.black : colors.neutral400,
                }}
              >
                {selectedUniversity || "Üniversite Seçiniz"}
              </Text>
            </View>
            <Icons.CaretDown size={18} color={colors.neutral300} />
          </TouchableOpacity>

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight="700" color={colors.white} size={18}>
              Kayıt Ol
            </Typo>
          </Button>
        </View>

        {/* Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable onPress={closeModal} style={styles.closeButton}>
                  <Icons.X size={24} color={colors.black} />
                </Pressable>
              </View>

              {loadingUniversities ? (
                <View
                  style={[
                    styles.listContainer,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      height: verticalScale(300),
                    },
                  ]}
                >
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Typo style={{ marginTop: 10 }} color={colors.neutral400}>
                    Üniversiteler yükleniyor...
                  </Typo>
                </View>
              ) : (
                <>
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Üniversite Ara..."
                      placeholderTextColor={colors.neutral300}
                      value={searchText}
                      onChangeText={handleSearch}
                      autoFocus
                    />
                  </View>
                  <ScrollView
                    style={styles.listContainer}
                    showsVerticalScrollIndicator={true}
                  >
                    {filteredUniversities.length ? (
                      filteredUniversities.map((uni) => (
                        <Pressable
                          key={uni}
                          onPress={() => handleSelectUniversity(uni)}
                          style={styles.optionItem}
                        >
                          <Typo
                            color={colors.black}
                            style={{ fontSize: verticalScale(16) }}
                          >
                            {uni}
                          </Typo>
                        </Pressable>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Typo color={colors.neutral300}>Sonuç bulunamadı</Typo>
                      </View>
                    )}
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          <View style={styles.lineAboveText} />
          <Typo size={15} color={colors.neutral400}>
            Hesabın var mı?
          </Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight="700" color="#AAA">
              Giriş Yap
            </Typo>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: spacingY._20,
    marginBottom: spacingY._30,
  },
  logo: {
    height: 200,
    aspectRatio: 1,
    marginTop: 20,
  },
  form: {
    gap: spacingY._12,
  },
  universitySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._15,
    backgroundColor: colors.neutral100,
    marginBottom: spacingY._20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: spacingX._15,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacingX._10,
    paddingTop: spacingY._10,
  },
  closeButton: {
    padding: spacingX._5,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    paddingHorizontal: spacingX._12,
  },
  searchInput: {
    fontSize: verticalScale(16),
    paddingVertical: spacingY._7,
    color: colors.black,
  },
  listContainer: {
    maxHeight: verticalScale(300),
  },
  optionItem: {
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  emptyContainer: {
    padding: spacingY._20,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: spacingY._40,
    paddingVertical: spacingY._50,
  },
  lineAboveText: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral300,
  },
});
