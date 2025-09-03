import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import * as Icons from "phosphor-react-native";
import BackButton from "@/components/BackButton";

const SUPPORT_EMAIL = "byteque.dev@gmail.com";

const AboutScreen = () => {
  const handleSupportPress = () => {
    const mailto = `mailto:${SUPPORT_EMAIL}`;
    Linking.openURL(mailto);
  };

  const BulletItem = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <BackButton style={{ marginBottom: 8 }} />
        <Text style={styles.pageTitle}>Hakkımızda</Text>

        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Kampüste Paylaş</Text>, üniversite
              öğrencilerinin kampüs hayatını kolaylaştırmak, paylaşımı artırmak
              ve sosyal bağları güçlendirmek için tasarlanmış bir platformdur.
            </Text>

            <Text style={styles.sectionTitle}>Burada öğrenciler:</Text>
            <View style={{ marginTop: 6 }}>
              <BulletItem>
                <Text>
                  <Text style={styles.bold}>Ders notları</Text> ve{" "}
                  <Text style={styles.bold}>kitaplarını</Text> paylaşabilir.
                </Text>
              </BulletItem>
              <BulletItem>
                <Text>
                  <Text style={styles.bold}>İkinci el eşyalarını</Text>{" "}
                  satabilir veya kiraya verebilir.
                </Text>
              </BulletItem>
              <BulletItem>
                İhtiyaç duyduklarında{" "}
                <Text style={styles.bold}>ödünç eşya</Text> alabilir.
              </BulletItem>
              <BulletItem>
                <Text>
                  <Text style={styles.bold}>Yardımlaşma ilanlarını</Text>{" "}
                  görüntüleyebilir.
                </Text>
              </BulletItem>
              <BulletItem>
                Kampüs içi ve çevresindeki{" "}
                <Text style={styles.bold}>etkinlikleri</Text> keşfedebilir.
              </BulletItem>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
              Topluluk Kuralları
            </Text>
            <View style={{ marginTop: 6 }}>
              <BulletItem>Saygılı ve nezaketli iletişim kurun.</BulletItem>
              <BulletItem>
                Yanıltıcı, yanlış veya <Text style={styles.bold}>spam</Text>{" "}
                içerik paylaşmayın.
              </BulletItem>
              <BulletItem>
                Satış, kiralama ve paylaşım ilanlarında{" "}
                <Text style={styles.bold}>doğru bilgi</Text> verin.
              </BulletItem>
              <BulletItem>
                Tüm işlemlerde <Text style={styles.bold}>güvenli ödeme</Text> ve{" "}
                <Text style={styles.bold}>teslim yöntemlerini</Text> tercih
                edin.
              </BulletItem>
              <BulletItem>
                İlanlarınız ve mesajlarınızda{" "}
                <Text style={styles.bold}>kişisel bilgilerinizi</Text> koruyun.
              </BulletItem>
            </View>

            <Text style={[styles.paragraph, { marginTop: 14 }]}>
              Bir sorun yaşarsanız veya öneriniz olursa bize e-posta
              gönderebilirsiniz.
            </Text>

            <TouchableOpacity
              style={styles.cta}
              onPress={handleSupportPress}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaText}>Destek ile İletişime Geç</Text>
            </TouchableOpacity>

            <View style={styles.emailRow}>
              <Icons.Envelope size={18} color="#6B7280" weight="regular" />
              <Text style={styles.emailText}>{SUPPORT_EMAIL}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  paragraph: {
    fontSize: 15.5,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14.5,
    color: "#111827",
    fontWeight: "700",
    marginTop: 8,
  },
  bold: {
    fontWeight: "700",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletDot: {
    width: 18,
    lineHeight: 24,
    fontSize: 16,
    color: "#1F2937",
    textAlign: "center",
  },
  bulletText: {
    flex: 1,
    fontSize: 15.5,
    lineHeight: 24,
    color: "#374151",
  },
  cta: {
    marginTop: 18,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    alignSelf: "center",
  },
  ctaText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15.5,
  },
  emailRow: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emailText: {
    color: "#4B5563",
    fontSize: 14.5,
  },
});
