import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type BadgeStatus = "success" | "warning" | "error" | "default";

interface BadgeProps {
  label: string;
  status?: BadgeStatus;
}

const statusColors: Record<BadgeStatus, { bg: string; text: string }> = {
  success: { bg: "#E3F1EA", text: colors.primary },
  warning: { bg: "#FBF0DC", text: "#92620A" },
  error: { bg: "#FBE3E3", text: colors.error },
  default: { bg: colors.border, text: colors.textSecondary },
};

export function Badge({ label, status = "default" }: BadgeProps) {
  const { bg, text } = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
