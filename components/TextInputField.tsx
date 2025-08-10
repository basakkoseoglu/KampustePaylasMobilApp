import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Animated,
  TextStyle,
  Pressable,
} from "react-native";
import { InputProps } from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const TextInputField = ({
  placeholder,
  icon,
  rightIcon,
  inputRef,
  inputStyle,
  containerStyle,
  onChangeText,
  ...rest
}: InputProps & { rightIcon?: React.ReactNode }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const staticLabelStyle: TextStyle = {
    position: "absolute",
    left: icon ? 50 : 15,
  };

  const animatedLabelStyle = {
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [verticalScale(20), verticalScale(6)],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.neutral400, colors.neutral300],
    }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {icon && icon}
      <Animated.Text style={[staticLabelStyle, animatedLabelStyle]}>
        {placeholder}
      </Animated.Text>
      <TextInput
        style={[styles.input, inputStyle]}
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (onChangeText) onChangeText(text);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(60),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,

    position: "relative",
  },
  input: {
    flex: 1,
    color: colors.black,
    fontSize: verticalScale(14),
    paddingTop: verticalScale(20), // placeholder animasyonu için
  },
  rightIcon: {
    position: "absolute",
    right: spacingX._15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
