import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Home = () => {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo2.png")}
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
            <Ionicons name="book-outline" size={38} color="#188040" />
            <Text style={styles.cardTitle}>Ders Notu & Kitap</Text>
            <Text style={styles.cardText}>ilanı vermek için tıklayınız.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.blueButton]}
            onPress={() => router.push("/(modals)/lendOrSellModal")}
          >
            <FontAwesome5 name="suitcase" size={34} color="#1565c0" />
            <Text style={styles.cardTitle}>Ödünç Eşya Verme & Satma</Text>
            <Text style={styles.cardText}>
              {" "}
              işlemleri ilanı vermek için tıklayınız.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, styles.orangeButton]}
            onPress={() => router.push("/(modals)/volunteerHelpModal")}
          >
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={35}
              color="#ef6c00"
            />
            <Text style={styles.cardTitle}>Gönüllü Yardım</Text>
            <Text style={styles.cardText}>
              (Ders desteği, kampüs işleri vb.) ilanı vermek için tıklayınız.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.grayButton]}
            onPress={() => router.push("/(modals)/campusEventModal")}
          >
            <MaterialIcons name="campaign" size={42} color="#424242" />
            <Text style={styles.cardTitle}>Etkinlik & Duyuru</Text>
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
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  slogan: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#188040",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginTop: 2,
  },
  greenButton: {
    backgroundColor: "#C8E6C9",
    borderColor: "#A5D6A7",
    borderWidth: 2,
  },
  blueButton: {
    backgroundColor: "#BBDEFB",
    borderColor: "#90CAF9",
    borderWidth: 2,
  },
  orangeButton: {
    backgroundColor: "#FFE0B2",
    borderColor: "#FFCC80",
    borderWidth: 2,
  },
  grayButton: {
    backgroundColor: "#E0E0E0",
    borderColor: "#BDBDBD",
    borderWidth: 2,
  },
});
