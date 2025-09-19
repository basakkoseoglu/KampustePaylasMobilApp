import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
          source={require("../../assets/images/logo3.png")}
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
            <Entypo name="open-book" size={normalize(38)} color="#188040" />
            <Text style={styles.cardTitle}>Ders Notu & Kitap</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.blueButton]}
            onPress={() => router.push("/(modals)/lendOrSellModal")}
          >
            <FontAwesome5 name="suitcase" size={normalize(34)} color="#424242" />
            <Text style={styles.cardTitle}>Ödünç Eşya Verme & Satma</Text>
            <Text style={styles.cardText}>
              işlemleri ilanı vermek için tıklayınız.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, styles.grayButton]}
            onPress={() => router.push("/(modals)/campusEventModal")}
          >
            <MaterialIcons name="campaign" size={normalize(42)} color="#424242" />
            <Text style={styles.cardTitle}>Etkinlik & Duyuru</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, styles.orangeButton]}
            onPress={() => router.push("/(modals)/volunteerHelpModal")}
          >
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={normalize(35)}
              color="#ef6c00"
            />
            <Text style={styles.cardTitle}>Gönüllü Yardım</Text>
            <Text style={styles.cardText}>
              (Ders desteği, kampüs işleri vb.) ilanı vermek için tıklayınız.
            </Text>
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
    paddingHorizontal: wp(4.2), // 16px -> 4.2% of screen width
    backgroundColor: "#f5f5f5",
    paddingTop: hp(4.3), // 35px -> 4.3% of screen height
  },
  logoContainer: {
    alignItems: "center",
    marginTop: hp(4.9), // 40px -> 4.9% of screen height
  },
  logoImage: {
    width: wp(34.7), // 130px -> 34.7% of screen width
    height: wp(34.7), // Keep aspect ratio square
  },
  slogan: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#188040",
    marginBottom: hp(4.9), // 40px -> 4.9% of screen height
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    gap: hp(1), // 8px -> 1% of screen height
  },
  row: {
    flexDirection: "row",
    gap: wp(3.2), // 12px -> 3.2% of screen width
    marginBottom: hp(1.5), // 12px -> 1.5% of screen height
  },
  card: {
    flex: 1,
    borderRadius: wp(4.3), // 16px -> 4.3% of screen width
    padding: wp(4.3), // 16px -> 4.3% of screen width
    minHeight: hp(19.5), // 160px -> 19.5% of screen height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 4,
  },
  cardTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    marginTop: hp(1.2), // 10px -> 1.2% of screen height
    textAlign: "center",
  },
  cardText: {
    fontSize: normalize(13),
    textAlign: "center",
    color: "#555",
    marginTop: hp(0.2), // 2px -> 0.2% of screen height
  },
  greenButton: {
    backgroundColor: "#f4f6f4",
    borderColor: "#e8eae8",
    borderWidth: 1,
  },
  blueButton: {
    backgroundColor: "#f6f6f6",
    borderColor: "#eaeaea",
    borderWidth: 1,
  },
  orangeButton: {
    backgroundColor: "#f6f5f4",
    borderColor: "#eae9e8",
    borderWidth: 1,
  },
  grayButton: {
    backgroundColor: "#f3f3f3",
    borderColor: "#e7e7e7",
    borderWidth: 1,
  },
});