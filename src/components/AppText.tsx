import { Text, TextProps } from "react-native";

type Props = TextProps & {
  weight?: "regular" | "semibold" | "bold";
};

export default function AppText({ style, weight = "regular", ...props }: Props) {
  const fontFamily =
    weight === "bold"
      ? "FiraSans_700Bold"
      : weight === "semibold"
      ? "FiraSans_600SemiBold"
      : "FiraSans_400Regular";

  return <Text {...props} style={[{ fontFamily }, style]} />;
}
