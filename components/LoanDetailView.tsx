// Düzenlenmiş LoanDetailView.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import { colors } from "@/constants/theme";

interface LoanDetailViewProps {
  data: any;
}

const LoanDetailView: React.FC<LoanDetailViewProps> = ({ data }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Kişi Bilgileri */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icons.User size={18} color="#7AA9CFFF" weight="bold" />
          <Text style={styles.sectionTitle}>Kişi Bilgileri</Text>
        </View>
        <InfoRow label="İsim" value={data.ownerName} />
        <InfoRow label="Üniversite" value={data.ownerUniversity} />
      </View>

      {/* Etkinlik Bilgileri */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icons.Swap size={18} color="#7AA9CFFF" weight="bold" />
          <Text style={styles.sectionTitle}>İlan Bilgileri</Text>
        </View>
        <InfoRow label="Başlık" value={data.itemTitle} />
        <InfoRow label="Açıklama" value={data.description} />
        <InfoRow label="Özel Şartlar" value={data.specialConditions} />
        <InfoRow label="Fiyat" value={data.price} />
        <InfoRow label="Kiralama Süresi" value={data.rentalPeriod} />
        <InfoRow label="Eşya Türü" value={data.resourceType} />
        <InfoRow label="Durumu" value={data.conditionType} />
        <InfoRow label="Depozite İsteniyor Mu" value={data.shareType} />
      </View>

      {/* Buton */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>İlgileniyorum</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.rowBetween}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "—"}</Text>
  </View>
);

export default LoanDetailView;

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "500",
    color: colors.neutral400,
    flex: 1,
  },
  value: {
    color: colors.black,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  footer: {
    paddingBottom: 32,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
