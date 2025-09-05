import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import EventDetailView from "@/components/EventDetailView";
import NoteDetailView from "@/components/NoteDetailView";
import LoanDetailView from "@/components/LoanDetailView";
import VolunteerDetailView from "@/components/VolunteerDetailView";

const PostDetail = () => {
  const { id = "", type = "" } = useLocalSearchParams() as {
    id: string;
    type: string;
  };
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(getFirestore(), type, id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  const renderContent = () => {
    switch (type) {
      case "eventAds":
        return <EventDetailView data={data} />;
      case "notesAds":
        return <NoteDetailView data={data} />;
      case "loanAds":
        return <LoanDetailView data={data} />;
      case "volunteerAds":
        return <VolunteerDetailView data={data} />;
      default:
        return <Text>Bilinmeyen ilan türü.</Text>;
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primaryLight}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backIcon}
            >
              <Icons.CaretLeft size={24} weight="bold" color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.header}>İlan Detayı</Text>
          </View>

          {data ? renderContent() : <Text>İlan bulunamadı.</Text>}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 25 },
  scroll: { padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  desc: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral400,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  backIcon: {
    marginRight: 12,
    padding: 4,
  },
});
