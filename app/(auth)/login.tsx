import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import TextInputField from "@/components/TextInputField";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import PasswordReset from "@/components/PasswordReset";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Giriş Yap", "Lütfen tüm alanları doldurun.");
      return;
    }
    setIsLoading(true);
    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Giriş Yap", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require("../../assets/images/logo3.png")}
          />
        </View>
        {/* form */}
        <View style={styles.form}>
          <TextInputField
            placeholder="E-posta"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.At size={verticalScale(20)} color={colors.neutral300} />
            }
          />
          <TextInputField
            placeholder="Şifre"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(value) => (passwordRef.current = value)}
            icon={
              <Icons.Lock size={verticalScale(20)} color={colors.neutral300} />
            }
            rightIcon={
              <Pressable
                onPress={() => setIsPasswordVisible((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {isPasswordVisible ? (
                  <Icons.Eye
                    size={verticalScale(20)}
                    color={colors.neutral300}
                  />
                ) : (
                  <Icons.EyeClosed
                    size={verticalScale(20)}
                    color={colors.neutral300}
                  />
                )}
              </Pressable>
            }
          />

          <View style={{ alignSelf: "flex-end" }}>
            <PasswordReset />
          </View>
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.white} size={18}>
              Giriş Yap
            </Typo>
          </Button>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <View style={styles.lineAboveText} />
          <Typo size={15} color={colors.neutral400}>
            Henüz bir hesabın yok mu?
          </Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.neutral150}>
              Kayıt Ol
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: spacingY._20,
    marginBottom: spacingY._30,
  },
  logo: {
    height: 200,
    aspectRatio: 1,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: spacingY._40,
    paddingVertical: spacingY._50,
  },
  lineAboveText: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.neutral300,
  },
});
