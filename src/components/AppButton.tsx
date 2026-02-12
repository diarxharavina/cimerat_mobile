import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../theme/colors";
import AppText from "./AppText";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "ghost";
  style?: ViewStyle;
};

export default function AppButton({ title, onPress, variant = "primary", style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.ghost,
        style,
      ]}
    >
      <AppText weight="bold" style={[styles.text, variant === "primary" ? styles.textPrimary : styles.textGhost]}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 15,
  },
  textPrimary: {
    color: "white",
  },
  textGhost: {
    color: colors.text,
  },
});
