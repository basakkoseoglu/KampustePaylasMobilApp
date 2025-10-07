import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { colors } from "@/constants/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive helper functions
const wp = (percentage: number): number => {
  return (screenWidth * percentage) / 100;
};

const hp = (percentage: number): number => {
  return (screenHeight * percentage) / 100;
};

const normalize = (size: number): number => {
  const scale = screenWidth / 375; // iPhone X base width
  return Math.round(size * scale);
};

const Home = () => {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/kplogo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.slogan}>Paylaş, Destek Ol, Güçlen!</Text>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, styles.greenButton]}
            onPress={() => router.push("/(modals)/courseAdvertModal")}
          >
            <Entypo name="open-book" size={normalize(32)} color="#4CAF50" />
            <Text style={styles.cardTitle}>Ders Notu & Kitap</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.grayButton]}
            onPress={() => router.push("/(modals)/campusEventModal")}
          >
            <MaterialIcons
              name="campaign"
              size={normalize(35)}
              color="#757575"
            />
            <Text style={styles.cardTitle}>Etkinlik & Duyuru</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, styles.orangeButton]}
            onPress={() => router.push("/(modals)/volunteerHelpModal")}
          >
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={normalize(32)}
              color="#FF9800"
            />
            <Text style={styles.cardTitle}>Gönüllü Yardım</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, styles.blueButton]}
            onPress={() => router.push("/(modals)/lendOrSellModal")}
          >
            <FontAwesome5
              name="suitcase"
              size={normalize(28)}
              color="#64b5f6"
            />
            <Text style={styles.cardTitle}>Ödünç Eşya Verme & Satma</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(4.2),
    backgroundColor: "#f5f5f5",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoImage: {
    width: wp(34.7),
    height: wp(34.7),
  },
  slogan: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#188040",
    marginBottom: hp(5),
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    gap: hp(1),
  },
  row: {
    flexDirection: "row",
    gap: wp(3.2),
    marginBottom: hp(1.5),
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: wp(3),
    height: hp(19),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.neutral300,
  },
  cardTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    marginTop: hp(1),
    textAlign: "center",
  },
  cardText: {
    fontSize: normalize(13),
    textAlign: "center",
    color: "#555",
    marginTop: hp(0.5),
  },
  greenButton: {},
  blueButton: {},
  orangeButton: {},
  grayButton: {},
});
