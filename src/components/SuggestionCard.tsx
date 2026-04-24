import { ArrowRight, Sparkle } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { AppText } from "@/components/Text";
import { colors, radius, shadows, spacing, typography } from "@/theme/tokens";

type SuggestionCardProps = {
  text: string;
  onPress?: () => void;
};

export function SuggestionCard({ text, onPress }: SuggestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <View style={styles.symbol}>
          <Sparkle size={14} color={colors.accentPrimary} strokeWidth={1.4} />
        </View>
        <AppText variant="label">AI Suggestion</AppText>
      </View>
      <AppText style={styles.text}>{text}</AppText>
      <Svg width={132} height={18} viewBox="0 0 132 18">
        <Path
          d="M4 12 C28 4 58 17 86 8 C102 3 114 4 128 7"
          stroke={colors.accentPrimary}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Pressable onPress={onPress} style={styles.actionRow}>
        <AppText variant="button">Use this suggestion</AppText>
        <ArrowRight size={18} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.light
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  text: {
    fontFamily: typography.serif,
    fontSize: 21,
    lineHeight: 29,
    maxWidth: 250,
    transform: [{ rotate: "-1deg" }]
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  symbol: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.accentPrimary
  }
});
