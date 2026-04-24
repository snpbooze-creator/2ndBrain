import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import { colors, radius } from "@/theme/tokens";

const nodes = [
  { x: 92, y: 88, r: 7, fill: colors.accentPrimary },
  { x: 46, y: 46, r: 4, fill: colors.textPrimary },
  { x: 70, y: 128, r: 5, fill: colors.accentSecondary },
  { x: 138, y: 48, r: 4, fill: colors.textPrimary },
  { x: 150, y: 120, r: 5, fill: colors.accentSecondary },
  { x: 118, y: 156, r: 4, fill: colors.textPrimary },
  { x: 184, y: 82, r: 4, fill: colors.textPrimary },
  { x: 196, y: 150, r: 5, fill: colors.accentSecondary }
];

const links = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [2, 5],
  [3, 6],
  [4, 7],
  [6, 7]
];

export function BrainVisual() {
  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 240 190">
        {links.map(([a, b]) => (
          <Line
            key={`${a}-${b}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={colors.mutedText}
            strokeWidth="1"
            opacity="0.55"
          />
        ))}
        {nodes.map((node, index) => (
          <Circle key={index} cx={node.x} cy={node.y} r={node.r} fill={node.fill} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 190,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    backgroundColor: colors.ivory,
    overflow: "hidden"
  }
});
