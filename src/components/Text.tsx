import { PropsWithChildren } from "react";
import { StyleSheet, Text as NativeText, TextProps } from "react-native";

import { colors, typography } from "@/theme/tokens";

type AppTextProps = PropsWithChildren<TextProps & { variant?: keyof typeof styles }>;

export function AppText({ children, style, variant = "body", ...props }: AppTextProps) {
  return (
    <NativeText {...props} style={[styles[variant], style]}>
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.textPrimary,
    fontFamily: typography.serif,
    fontSize: 16,
    lineHeight: 23
  },
  heading: {
    color: colors.textPrimary,
    fontFamily: typography.serifSemibold,
    fontSize: 34,
    lineHeight: 40
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.serif,
    fontSize: 25,
    lineHeight: 31
  },
  label: {
    color: colors.mutedText,
    fontFamily: typography.sansSemibold,
    fontSize: 12,
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  meta: {
    color: colors.mutedText,
    fontFamily: typography.sans,
    fontSize: 13,
    lineHeight: 18
  },
  button: {
    color: colors.textPrimary,
    fontFamily: typography.sansSemibold,
    fontSize: 14,
    fontWeight: "600"
  }
});
