import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(auth)/welcome");
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/kplogo.png")}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "40%",
    aspectRatio: 1,
  },
});
