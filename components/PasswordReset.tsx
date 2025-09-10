import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import Typo from "./Typo";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

const PasswordReset = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Uyarı", "Lütfen önce e-posta adresinizi girin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Uyarı", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    setLoading(true);

    try {
      console.log("Auth nesnesi:", auth);
      console.log("Email gönderiliyor:", email);
      
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        "Başarılı",
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
      );
      setModalVisible(false);
      setEmail("");
      
    } catch (error: any) {
      console.error("Password reset hatası:", error);
      
      let errorMessage = "Bir hata oluştu.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Geçersiz e-posta adresi.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Hata", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.forgotPasswordPressable}
      >
        <Typo size={14} color="#999" style={styles.forgotPasswordText}>
          Şifreni Unuttun Mu?
        </Typo>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typo size={18} fontWeight="700" style={styles.modalTitle}>
              Şifre Sıfırlama
            </Typo>
            <TextInput
              placeholder="E-posta adresinizi girin"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
              placeholderTextColor="#CCC"
              editable={!loading}
            />
            <View style={styles.buttonRow}>
              <View style={styles.buttonContainer}>
                <Button
                  title={loading ? "Gönderiliyor..." : "Gönder"}
                  onPress={handlePasswordReset}
                  color="grey"
                  disabled={loading}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="İptal"
                  onPress={() => setModalVisible(false)}
                  color="#ccc"
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  forgotPasswordPressable: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  forgotPasswordText: {
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    marginBottom: 25,
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default PasswordReset;