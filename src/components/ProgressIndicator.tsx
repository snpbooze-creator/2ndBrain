import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { AppText } from "@/components/Text";
import { colors } from "@/theme/tokens";

type ProgressIndicatorProps = {
  progress: number;
  size?: number;
  circular?: boolean;
};

export function ProgressIndicator({ progress, size = 48, circular = false }: ProgressIndicatorProps) {
  if (!circular) {
    return (
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(progress, 100)}%` }]} />
      </View>
    );
  }

  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.circleWrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.subtleBorder} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.accentPrimary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <AppText variant="meta" style={styles.circleText}>
        {progress}%
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    flex: 1,
    borderRadius: 99,
    backgroundColor: colors.subtleBorder,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: colors.taupe
  },
  circleWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  circleText: {
    position: "absolute",
    color: colors.textPrimary,
    fontWeight: "600"
  }
});
