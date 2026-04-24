import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import { AppText } from "@/components/Text";
import { colors, typography } from "@/theme/tokens";

type TimerCircleProps = {
  remaining: string;
  progress?: number;
  size?: number;
  onStart?: () => void;
  startLabel?: string;
};

export function TimerCircle({ remaining, progress = 0.72, size = 286, onStart, startLabel = "Start" }: TimerCircleProps) {
  const stroke = 4;
  const radius = (size - stroke - 18) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {Array.from({ length: 96 }).map((_, index) => {
          const angle = (index / 96) * 360;
          const isMajor = index % 8 === 0;
          const inner = radius + (isMajor ? 5 : 12);
          const outer = radius + 17;
          const rad = ((angle - 90) * Math.PI) / 180;
          return (
            <Line
              key={index}
              x1={center + inner * Math.cos(rad)}
              y1={center + inner * Math.sin(rad)}
              x2={center + outer * Math.cos(rad)}
              y2={center + outer * Math.sin(rad)}
              stroke={colors.subtleBorder}
              strokeWidth={isMajor ? 1.2 : 0.8}
            />
          );
        })}
        <Circle cx={center} cy={center} r={radius} stroke={colors.subtleBorder} strokeWidth={stroke} fill="none" opacity={0.45} />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.accentPrimary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <AppText style={styles.time}>{remaining}</AppText>
      <AppText variant="label" style={styles.label}>Focus Session</AppText>
      <View style={styles.modeRow}>
        <Pressable onPress={onStart} style={styles.startPressable}>
          <AppText variant="button" style={styles.startPill}>{startLabel}</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  time: {
    position: "absolute",
    top: "39%",
    fontFamily: typography.serif,
    fontSize: 54,
    lineHeight: 64,
    color: colors.textPrimary
  },
  label: {
    position: "absolute",
    top: "34%",
    color: colors.textPrimary,
    fontSize: 9,
    letterSpacing: 1.4
  },
  modeRow: {
    position: "absolute",
    top: "63%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  startPill: {
    minWidth: 72,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 16,
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 10
  },
  startPressable: {
    outlineStyle: "none"
  } as object
});
