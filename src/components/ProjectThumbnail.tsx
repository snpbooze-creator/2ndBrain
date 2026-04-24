import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/theme/tokens";
import { Project } from "@/types/models";

type ProjectThumbnailProps = {
  type: Project["type"];
  large?: boolean;
};

export function ProjectThumbnail({ type, large = false }: ProjectThumbnailProps) {
  return (
    <View style={[styles.wrap, large && styles.large]}>
      <Svg width="100%" height="100%" viewBox="0 0 72 56">
        <Rect x="0" y="0" width="72" height="56" rx="8" fill="#E8DDCD" />
        <Path d="M2 44 C16 39 22 50 38 43 C51 37 56 43 70 36" stroke="#D5C7B5" strokeWidth="8" opacity={0.5} />
        {type === "app" && (
          <>
            <Rect x="15" y="10" width="42" height="36" rx="2" fill="#F7F0E5" stroke={colors.taupe} strokeWidth="1" />
            <Line x1="22" y1="18" x2="50" y2="18" stroke={colors.taupe} strokeWidth="1" />
            <Rect x="21" y="24" width="12" height="14" fill="none" stroke={colors.mutedText} strokeWidth="0.9" />
            <Rect x="39" y="24" width="12" height="14" fill="none" stroke={colors.mutedText} strokeWidth="0.9" />
          </>
        )}
        {type === "video" && (
          <>
            <Circle cx="34" cy="26" r="13" fill="#1C1C1A" opacity="0.88" />
            <Circle cx="34" cy="26" r="7" fill="none" stroke="#EAE4DA" strokeWidth="1.5" />
            <Rect x="17" y="40" width="38" height="6" rx="1" fill="#F7F0E5" stroke={colors.taupe} />
            <Line x1="22" y1="43" x2="50" y2="43" stroke={colors.taupe} />
          </>
        )}
        {type === "music" && (
          <>
            <Path d="M21 30 C21 18 51 18 51 30" fill="none" stroke="#1C1C1A" strokeWidth="4" strokeLinecap="round" />
            <Rect x="17" y="29" width="10" height="15" rx="4" fill="#1C1C1A" />
            <Rect x="45" y="29" width="10" height="15" rx="4" fill="#1C1C1A" />
            <Path d="M13 46 C24 40 35 51 58 42" stroke={colors.taupe} strokeWidth="1.2" fill="none" />
          </>
        )}
        {type === "writing" && (
          <>
            <Rect x="16" y="11" width="40" height="34" rx="2" fill="#F7F0E5" stroke={colors.taupe} />
            {[18, 24, 30, 36].map((y) => (
              <Line key={y} x1="23" y1={y} x2="49" y2={y} stroke={colors.mutedText} strokeWidth="0.9" />
            ))}
            <Line x1="48" y1="42" x2="57" y2="33" stroke="#1C1C1A" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {type === "other" && <Circle cx="36" cy="28" r="8" fill={colors.accentSecondary} />}
        <Circle cx="52" cy="40" r="3.5" fill={colors.accentPrimary} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 58,
    height: 46,
    borderRadius: radius.sm,
    overflow: "hidden",
    backgroundColor: colors.backgroundSecondary
  },
  large: {
    width: "100%",
    height: "100%",
    borderRadius: radius.lg
  }
});
