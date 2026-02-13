import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

type Variant = "primary" | "neutral" | "outline" | "danger" | "ghost";

type Props = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: Variant;
};

export default function AppButton({
  title,
  onPress,
  style,
  disabled,
  variant = "primary",
}: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "neutral" && styles.neutral,
        variant === "outline" && styles.outline,
        variant === "danger" && styles.danger,
        variant === "ghost" && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.textBase,
          (variant === "primary" || variant === "danger") && styles.textOnFill,
          (variant === "neutral" || variant === "outline") && styles.textNeutral,
          variant === "ghost" && styles.textGhost,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: colors.primary,
  },

  danger: {
    backgroundColor: colors.danger,
  },

  neutral: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },

  // "ghost" = text-only, no border, no fill
  ghost: {
    backgroundColor: "transparent",
    paddingVertical: 10,
  },

  pressed: {
    opacity: 0.9,
  },

  disabled: {
    opacity: 0.55,
  },

  textBase: {
    fontSize: 15,
    fontWeight: "700",
  },

  textOnFill: {
    color: "white",
  },

  textNeutral: {
    color: colors.text,
  },

  textGhost: {
    color: colors.text,
    opacity: 0.8,
  },
});
