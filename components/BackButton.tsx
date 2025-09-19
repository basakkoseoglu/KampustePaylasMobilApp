import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { BackButtonProps } from "@/types";

const BackButton = ({
  style,
  iconSize = 26,
  iconColor = "#666",
}: BackButtonProps & { iconColor?: string }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
    >
      <CaretLeft
        size={verticalScale(iconSize)}
        color={iconColor}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryLight,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    padding: 5,
  },
});
