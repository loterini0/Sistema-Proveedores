import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, scroll = false, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, style]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 16,
  },
});
