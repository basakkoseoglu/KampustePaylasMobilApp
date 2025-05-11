import { StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import Animated from 'react-native-reanimated'
import { useRouter } from 'expo-router'

const Welcome = () => {
  const router =useRouter();
  return (
    <ScreenWrapper>
      <ImageBackground
        source={require('../../assets/images/welcome3.jpg')} 
        style={styles.backgroundImage}
      >
        {/* Karartma (overlay) - İstersen kaldırabilirsin */}
        <View style={styles.overlay} />

        <View style={styles.container}>
          {/* Üst kısım: Oturum Aç butonu */}
          <View>
            <TouchableOpacity onPress={()=>router.push('/(auth)/login')} style={styles.loginButton}>
              <Typo fontWeight={"400"} color="#fff" >
                Giriş Yap
              </Typo>
            </TouchableOpacity>
          </View>

          {/* Alt kısım: Footer içindeki yazılar ve buton */}
          <View style={styles.footer}>
            <View style={{ alignItems: "center" }}>
              <Typo size={20} fontWeight={"600"} color={colors.neutral200}>
                Kitaplar, Notlar, Eşyalar...
              </Typo>
              <Typo size={20} fontWeight={"600"} color={colors.neutral200}>
                Paylaşan Kazanır!
              </Typo>
            </View>
            <View style={{ alignItems: "center", gap: 2 }}>
              <Typo size={15} color={colors.textLight}>
                Üniversite içinde paylaşımın 
              </Typo>
              <Typo size={15} color={colors.textLight}>
                kolay yolu!
              </Typo>
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={()=>router.push('/(auth)/register')}>
                <Typo size={22} color={colors.neutral200} fontWeight={"600"}>Haydi Başlayalım</Typo>
              </Button>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,             // tüm alanı kaplasın
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // karartma; istersen kaldır veya azalt
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._20,
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    // Arka plan rengi ve gölge ayarlarını kaldırdık:
    // backgroundColor: colors.neutral900,
    // shadowColor: "white",
    // shadowOffset: { width: 0, height: -10 },
    // elevation: 10,
    // shadowRadius: 25,
    // shadowOpacity: 0.15,
    
    alignItems: "center",
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(45),
    gap: spacingY._10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
