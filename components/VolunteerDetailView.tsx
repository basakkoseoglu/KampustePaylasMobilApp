import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/theme';
import * as Icons from 'phosphor-react-native';

interface VolunteerDetailViewProps {
  data: any;
}
const VolunteerDetailView: React.FC<VolunteerDetailViewProps> = ({ data }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Kişi Bilgileri */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icons.User size={18} color='#FF9800' weight="bold" />
          <Text style={styles.sectionTitle}>Kişi Bilgileri</Text>
        </View>
        <InfoRow label="İsim" value={data.ownerName} />
        <InfoRow label="Üniversite" value={data.ownerUniversity} />
      </View>

      {/* Etkinlik Bilgileri */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icons.Handshake size={18} color='#FF9800'weight="bold" />
          <Text style={styles.sectionTitle}>İlan Bilgileri</Text>
        </View>
        <InfoRow label="Başlık" value={data.adTitle} />
        <InfoRow label="Açıklama" value={data.description} />
        <InfoRow label="Beklentiler & Koşullar" value={data.expectations} />
        <InfoRow label="Yardım Türü" value={data.helpType} />
        <InfoRow label="Tarih" value={data.eventDate} />
        <InfoRow label="Konum" value={data.eventLocation} />
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
  <View style={styles.rowColumn}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '—'}</Text>
  </View>
);


export default VolunteerDetailView;

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
 rowColumn: {
    marginBottom: 10,
  },
  label: {
    fontWeight: '500',
    color: colors.neutral400,
    marginBottom: 4, 
  },
  value: {
    color: colors.black,
    fontWeight: '500',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  button: {
    backgroundColor:'#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  descriptionValue: {
    color: colors.black,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 20,
  },
});
