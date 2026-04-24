import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { AppText } from "@/components/Text";
import { colors } from "@/theme/tokens";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View style={[styles.wrap, compact && styles.compactWrap]}>
      <Svg width={compact ? 72 : 88} height={compact ? 42 : 48} viewBox="0 0 104 58">
        <Circle cx={37} cy={29} r={26} stroke={colors.textPrimary} strokeWidth={2.2} fill="none" />
        <Circle cx={67} cy={29} r={26} stroke={colors.accentPrimary} strokeWidth={2.2} fill="none" />
        <Circle cx={52} cy={29} r={7} fill={colors.accentPrimary} />
      </Svg>
      {!compact && (
        <View style={styles.taglineBlock}>
          <AppText variant="label" style={styles.tagline}>Think.</AppText>
          <AppText variant="label" style={styles.tagline}>Organize.</AppText>
          <AppText variant="label" style={styles.tagline}>Execute.</AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  compactWrap: {
    gap: 0
  },
  taglineBlock: {
    gap: 1
  },
  tagline: {
    maxWidth: 92,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.8,
    color: colors.taupe
  }
});
