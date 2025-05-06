import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();
  
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.slogan}>Birlikte Daha Güçlüyüz!</Text>
      
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, styles.greenButton]}
            onPress={() => router.push('/(modals)/courseAdvertModal')}
          >
            <Text style={styles.buttonText}>
              Ders Notu & Kitap Paylaşımı ilanı vermek için tıklayınız.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.blueButton]}
          onPress={() => router.push('/(modals)/lendOrSellModal')}>
            <Text style={styles.buttonText}>
              Ödünç Eşya Verme & Kullanılmayan Eşya Satma işlemleri ilanı vermek için tıklayınız.
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.orangeButton]}
          onPress={()=>router.push('/(modals)/volunteerHelpModal')}>
            <Text style={styles.buttonText}>
              Gönüllü Yardımlaşma (Ders çalıştırma,fotokopi çektirme vb.) ilanı vermek için tıklayınız.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.grayButton]}
           onPress={()=>router.push('/(modals)/campusEventModal')}>
            <Text style={styles.buttonText}>
              Kampüs İçi Etkinlik Duyuru ilanı vermek için tıklayınız.
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
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5'
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  slogan: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 13,
    textAlign: 'center',
  },
  greenButton: {
    backgroundColor: '#C8E6C9',
    borderColor: '#A5D6A7',
    borderWidth: 1,
  },
  blueButton: {
    backgroundColor: '#BBDEFB',
    borderColor: '#90CAF9',
    borderWidth: 1,
  },
  orangeButton: {
    backgroundColor: '#FFE0B2',
    borderColor: '#FFCC80',
    borderWidth: 1,
  },
  grayButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
    borderWidth: 1,
  }
});