import { ActivityIndicator, Pressable, Text } from "react-native";
import { actionButtonStyles as styles, colors } from "../styles";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export default function ActionButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: ActionButtonProps) {
  const backgroundColor =
    variant === "primary"
      ? colors.teal
      : variant === "danger"
        ? colors.red
        : "#ffffff";
  const textColor = variant === "secondary" ? colors.ink : "#ffffff";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        variant === "secondary" && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}
