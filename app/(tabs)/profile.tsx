import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/authContext";
import Typo from "@/components/Typo";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import * as Icons from "phosphor-react-native";
import Animated from "react-native-reanimated";
import { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const isFocused = useIsFocused();

  // userData state'i tanımlandı (isim ve resim)
  const [userData, setUserData] = useState<{
    name: string;
    image: string | null;
  }>({
    name: "",
    image: null,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // fetchUserData fonksiyonunu bileşenin en üst seviyesinde tanımlıyoruz
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
        });
        setImageUrl(fetchedData.image);
      } else {
        console.log("Kullanıcı bulunamadı!");
      }
    }
  };

  // Ekran odaklandığında veya user.uid değiştiğinde veriyi çekiyoruz
  useEffect(() => {
    if (isFocused && user?.uid) {
      fetchUserData();
    }
  }, [isFocused, user?.uid]);

  // userData.image güncellendiğinde imageUrl state'ini güncelle
  useEffect(() => {
    setImageUrl(userData.image);
  }, [userData.image]);

  const accountOptions: accountOptionType[] = [
    {
      title: "Profili Düzenle",
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#188040",
    },
    // {
    //   title: 'Ayarlar',
    //   icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
    //   // routeName: '/(modals)/profileModal',
    //   bgColor: '#059669',
    // },
    {
      title: "Hakkımızda",
      icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/hakkimizdaModal",
      bgColor: "#FF9800",
    },
    {
      title: "Çıkış Yap",
      icon: <Icons.Power size={26} color={colors.white} weight="fill" />,
      // routeName: '/(modals)/profileModal',
      bgColor: colors.neutral400,
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  const showLogoutAlert = () => {
    Alert.alert("Onay", "Çıkış yapmak istediğinizden emin misiniz?", [
      {
        text: "İptal",
        onPress: () => console.log("Çıkış iptal edildi"),
        style: "cancel",
      },
      {
        text: "Çıkış Yap",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const handlePress = (item: accountOptionType) => {
    if (item.title === "Çıkış Yap") {
      showLogoutAlert();
    }
    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profil" style={{ marginVertical: spacingY._10 }} />
        {/* Kullanıcı bilgileri */}
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            {/* Kullanıcı resmi */}
            <Image
              // source={getProfileImage(user?.image)}
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("../../assets/images/defaultAvatar.png")
              }
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* İsim & Email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight="600" color={colors.black}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* Hesap Seçenekleri */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <View key={index.toString()} style={styles.listItem}>
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
              >
                {/* Icon */}
                <View
                  style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon}
                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                  {item.title}
                </Typo>
                <Icons.CaretRight
                  size={verticalScale(20)}
                  weight="bold"
                  color={colors.black}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
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
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,

    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral400,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
